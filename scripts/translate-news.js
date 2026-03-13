#!/usr/bin/env node
/**
 * translate-news.js — 为英文新闻批量添加高质量中文翻译
 *
 * 优先使用 Claude API 翻译，回退到手工映射表。
 * 会自动清除低质量翻译（[EN] 前缀、中文占比 < 30%），然后重新翻译。
 *
 * Usage:
 *   node scripts/translate-news.js           # AI 翻译（需要 ANTHROPIC_API_KEY）
 *   node scripts/translate-news.js --dry-run # 只检查不写入
 */
const fs = require('fs');
const path = require('path');
const config = require('./config');

const NEWS_FILE = path.join(config.DATA_DIR, 'news.json');
const DRY_RUN = process.argv.includes('--dry-run');
const CJK_REGEX = /[\u4e00-\u9fff]/;

// ====== 翻译质量验证 ======
function isGoodZhTitle(titleZh) {
  if (!titleZh) return false;
  if (titleZh.startsWith('[EN]') || titleZh.startsWith('[待翻译]')) return false;
  const zhChars = (titleZh.match(/[\u4e00-\u9fff]/g) || []);
  return zhChars.length >= 4 && zhChars.length / titleZh.length >= 0.3;
}

function isEnglishTitle(title) {
  return !CJK_REGEX.test(title || '');
}

// ====== 引号规范化 ======
function norm(s) {
  return s
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/[\u00a0\u2002\u2003\u2009\u200a]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ====== 清理 HTML 实体 ======
function cleanHtmlEntities(text) {
  return (text || '')
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&#8212;/g, '—').replace(/&#8211;/g, '–')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

// ====== 单条 AI 翻译 ======
async function translateSingleAI(client, item) {
  const title = cleanHtmlEntities(item.title);
  const summary = cleanHtmlEntities(item.summary || '');
  const resp = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `将以下AI新闻标题翻译为中文。只返回JSON，不要markdown。
{"titleZh":"中文标题(15-30字,品牌名保留英文)","summaryZh":"中文摘要(50-100字)"}

标题: ${title}
${summary ? '摘要: ' + summary.substring(0, 150) : ''}`,
    }],
  });
  const text = resp.content[0]?.text || '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
}

// ====== AI 批量翻译（批量优先，失败单条重试） ======
async function batchTranslateAI(items) {
  if (!config.AI_ENABLED) return [];

  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
  const results = [];
  const failedItems = [];
  const BATCH_SIZE = 8;

  // Phase 1: 批量翻译
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const batchInput = batch.map((item, idx) => (
      `${idx + 1}. ${cleanHtmlEntities(item.title)}`
    )).join('\n');

    try {
      const resp = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `将以下英文AI新闻标题翻译为中文。只返回JSON数组，不要markdown代码块。
格式：[{"titleZh":"中文标题","summaryZh":"中文摘要"},...]
要求：标题15-30字，品牌名(OpenAI/Claude/Meta等)保留英文。

${batchInput}`,
        }],
      });

      const text = resp.content[0]?.text || '[]';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const translations = JSON.parse(jsonMatch ? jsonMatch[0] : text);

      let batchOk = 0;
      batch.forEach((item, idx) => {
        const t = translations[idx];
        if (t && isGoodZhTitle(t.titleZh)) {
          results.push({ id: item.id, titleZh: t.titleZh, summaryZh: t.summaryZh || '' });
          batchOk++;
        } else {
          failedItems.push(item);
        }
      });

      console.log(`  ✓ 批次 ${Math.floor(i / BATCH_SIZE) + 1}: ${batchOk}/${batch.length} 条`);
    } catch (err) {
      console.error(`  ✗ 批次 ${Math.floor(i / BATCH_SIZE) + 1} JSON解析失败，加入重试队列`);
      failedItems.push(...batch);
    }

    if (i + BATCH_SIZE < items.length) await new Promise(r => setTimeout(r, 300));
  }

  // Phase 2: 失败的逐条重试
  if (failedItems.length > 0) {
    console.log(`  🔄 逐条重试 ${failedItems.length} 条...`);
    let retryOk = 0;
    for (const item of failedItems) {
      try {
        const t = await translateSingleAI(client, item);
        if (t && isGoodZhTitle(t.titleZh)) {
          results.push({ id: item.id, titleZh: t.titleZh, summaryZh: t.summaryZh || '' });
          retryOk++;
        }
      } catch (err) {
        console.error(`    ✗ ${item.title.substring(0, 40)}...`);
      }
      await new Promise(r => setTimeout(r, 200));
    }
    console.log(`  🔄 重试完成: ${retryOk}/${failedItems.length} 条`);
  }

  return results;
}

// ====== 主逻辑 ======
async function main() {
  const news = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
  console.log(`📰 加载 ${news.length} 条新闻`);

  // Step 1: 清除低质量翻译
  let cleanedCount = 0;
  news.forEach(n => {
    if (n.titleZh && !isGoodZhTitle(n.titleZh)) {
      n.titleZh = '';
      n.summaryZh = '';
      cleanedCount++;
    }
  });
  if (cleanedCount > 0) console.log(`🧹 清除 ${cleanedCount} 条低质量翻译`);

  // Step 2: 找出需要翻译的英文条目
  const needTranslation = news.filter(n => isEnglishTitle(n.title) && !isGoodZhTitle(n.titleZh));
  console.log(`🌐 需要翻译: ${needTranslation.length} 条`);

  if (needTranslation.length === 0) {
    console.log('✅ 所有英文新闻已有中文翻译');
    return;
  }

  if (DRY_RUN) {
    console.log('\n⚠️ DRY RUN — 不写入文件');
    needTranslation.slice(0, 10).forEach(n => console.log(`  - ${n.title.substring(0, 70)}`));
    if (needTranslation.length > 10) console.log(`  ... 等 ${needTranslation.length - 10} 条`);
    return;
  }

  // Step 3: AI 批量翻译
  let translatedCount = 0;
  if (config.AI_ENABLED) {
    console.log('🤖 使用 Claude API 批量翻译...');
    const aiResults = await batchTranslateAI(needTranslation);

    // 应用翻译结果
    const resultMap = new Map(aiResults.map(r => [r.id, r]));
    news.forEach(n => {
      const t = resultMap.get(n.id);
      if (t) {
        n.titleZh = t.titleZh;
        n.summaryZh = t.summaryZh;
        translatedCount++;
      }
    });
    console.log(`🤖 AI 翻译完成: ${translatedCount} 条`);
  } else {
    console.log('⚠️ ANTHROPIC_API_KEY 未配置，跳过 AI 翻译');
    console.log('  请在 .env 文件中配置：ANTHROPIC_API_KEY=sk-ant-...');
  }

  // Step 4: 写入
  fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2), 'utf8');

  // 统计最终结果
  const enItems = news.filter(n => isEnglishTitle(n.title));
  const hasGoodZh = enItems.filter(n => isGoodZhTitle(n.titleZh));
  const stillMissing = enItems.filter(n => !isGoodZhTitle(n.titleZh));

  console.log(`\n📊 翻译统计:`);
  console.log(`  英文条目总数: ${enItems.length}`);
  console.log(`  有中文翻译: ${hasGoodZh.length} ✅`);
  console.log(`  仍需翻译: ${stillMissing.length} ${stillMissing.length > 0 ? '⚠️' : ''}`);

  if (stillMissing.length > 0) {
    console.log(`\n未翻译条目:`);
    stillMissing.forEach(n => console.log(`  - ${n.title.substring(0, 70)}`));
  }
}

main().catch(err => {
  console.error('❌ 致命错误:', err);
  process.exit(1);
});
