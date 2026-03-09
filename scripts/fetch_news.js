#!/usr/bin/env node
/**
 * fetch_news.js — 新闻自动抓取脚本
 *
 * Pipeline: 抓取RSS/API → 清洗 → AI分类 → 校验 → 去重 → 合并 → 写入
 *
 * Usage:
 *   node scripts/fetch_news.js           # 正常运行
 *   node scripts/fetch_news.js --dry-run # 只输出不写入
 */
const path = require('path');
const config = require('./config');
const Logger = require('./lib/logger');
const { fetchRSS, fetchJSON, extractDomain } = require('./lib/fetcher');
const { classifyNews, enrichNewsEditorial } = require('./lib/ai-enricher');
const { validateBatch } = require('./lib/validator');
const { dedupNews } = require('./lib/dedup');
const { readExisting, mergeNews, writeJSON } = require('./lib/merger');

const DRY_RUN = process.argv.includes('--dry-run');
const NEWS_FILE = path.join(config.DATA_DIR, 'news.json');

async function main() {
  const log = new Logger('fetch_news');
  log.info('🚀 开始新闻抓取...');
  if (DRY_RUN) log.warn('⚠️ DRY RUN 模式 — 不会写入文件');

  // ====== Step 1: 并行抓取所有数据源 ======
  log.info(`📡 抓取 ${config.NEWS_SOURCES.length} 个数据源...`);
  const rawItems = [];

  const fetchPromises = config.NEWS_SOURCES.map(async (source) => {
    try {
      let items = [];

      if (source.type === 'rss') {
        items = await fetchRSS(source.url);
        log.info(`  ✓ [RSS] ${source.name}: ${items.length} 条`);
      } else if (source.type === 'api') {
        // HackerNews Algolia API 格式
        if (source.url.includes('hn.algolia.com')) {
          const data = await fetchJSON(source.url);
          items = (data.hits || []).map(hit => ({
            title: hit.title || '',
            link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            pubDate: hit.created_at || '',
            summary: (hit.title || '') + (hit.story_text ? ` — ${hit.story_text.substring(0, 200)}` : ''),
            source: 'Hacker News',
          }));
          log.info(`  ✓ [API] ${source.name}: ${items.length} 条`);
        }
      }

      log.addFetched(items.length);
      return items;
    } catch (err) {
      log.error(`  ✗ [${source.name}] 抓取失败: ${err.message}`);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  results.forEach(items => rawItems.push(...items));

  if (rawItems.length === 0) {
    log.warn('没有抓取到任何新闻，退出');
    log.summary();
    return;
  }

  log.info(`📥 共抓取 ${rawItems.length} 条原始新闻`);

  // ====== Step 2: Source Whitelist 过滤 ======
  const whitelisted = rawItems.filter(item => {
    const domain = extractDomain(item.link);
    // 允许白名单域名 + 无URL的条目（保留以便手动审核）
    if (!domain) return true;
    const allowed = config.SOURCE_WHITELIST.some(w => domain.includes(w));
    if (!allowed) {
      log.warn(`  过滤非白名单: ${domain} — ${item.title?.substring(0, 40)}`);
      log.addSkipped();
    }
    return allowed;
  });

  log.info(`📋 白名单过滤后: ${whitelisted.length} 条`);

  // ====== Step 2.5: AI 相关性过滤 ======
  const AI_KEYWORDS = [
    'ai', 'artificial intelligence', '人工智能', '大模型', 'llm', 'gpt', 'claude',
    'gemini', 'deepseek', 'midjourney', 'stable diffusion', 'runway', 'sora',
    'diffusion', 'chatbot', '生成式', 'generative', 'prompt', 'agent',
    '机器学习', 'machine learning', 'deep learning', '深度学习', 'neural',
    'transformer', 'aigc', '千问', 'copilot', 'cursor', 'perplexity',
    'huggingface', 'openai', 'anthropic', 'meta ai', 'mistral',
    '智能', 'ai工具', 'ai tool', 'ai assistant', 'kling', '可灵',
    'notion ai', 'canva ai', 'adobe firefly', 'flux', 'comfyui',
  ];

  const aiRelevant = whitelisted.filter(item => {
    const text = `${item.title} ${item.summary || ''}`.toLowerCase();
    const isRelevant = AI_KEYWORDS.some(kw => text.includes(kw));
    if (!isRelevant) {
      log.warn(`  过滤非AI内容: ${item.title?.substring(0, 50)}`);
      log.addSkipped();
    }
    return isRelevant;
  });

  log.info(`🤖 AI相关性过滤后: ${aiRelevant.length} 条 (过滤 ${whitelisted.length - aiRelevant.length} 条无关内容)`);

  // ====== Step 3: 清洗 + 格式化 ======
  let newsCounter = Date.now(); // 用于生成唯一ID
  const cleaned = aiRelevant.map(item => ({
    id: `auto-${(newsCounter++).toString(36)}`,
    title: item.title?.trim() || '',
    url: item.link || '',
    source: item.source || '',
    date: formatDate(item.pubDate),
    summary: (item.summary || '').substring(0, 300).trim(),
    category: '', // 待分类
    tags: [],
    relatedJobs: [],
    isHot: false,
  })).filter(item => item.title.length >= config.QUALITY.minTitleLength);

  log.info(`🧹 清洗后: ${cleaned.length} 条`);

  // ====== Step 4: AI 分类 ======
  log.info('🤖 开始分类...');
  for (const item of cleaned) {
    try {
      const classification = await classifyNews(item);
      item.category = classification.category;
      item.relatedJobs = classification.relatedJobs;
      item.tags = classification.tags;
    } catch (err) {
      log.warn(`  分类失败: ${item.title?.substring(0, 30)} — ${err.message}`);
      item.category = 'industry-product'; // 默认分类
    }
  }

  // ====== Step 4.5: 编辑智能增强（Phase 2 字段） ======
  log.info('✨ 开始编辑智能增强（why_it_matters, fit_for, recommended_path, editor_note）...');
  let enrichedCount = 0;
  for (const item of cleaned) {
    try {
      const editorial = await enrichNewsEditorial(item);
      item.why_it_matters = editorial.why_it_matters;
      item.fit_for = editorial.fit_for;
      item.recommended_path = editorial.recommended_path;
      item.editor_note = editorial.editor_note;
      enrichedCount++;
    } catch (err) {
      log.warn(`  增强失败: ${item.title?.substring(0, 30)} — ${err.message}`);
      // 使用默认值
      item.why_it_matters = '值得了解的行业动态';
      item.fit_for = ['全员'];
      item.recommended_path = '';
      item.editor_note = '';
    }
  }
  log.info(`✨ 编辑增强完成: ${enrichedCount} 条`);

  // ====== Step 4.6: 自动双语翻译（英文→中文标题+摘要） ======
  log.info('🌐 开始双语翻译...');
  const CJK_REGEX = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/;
  let translatedCount = 0;
  for (const item of cleaned) {
    if (!CJK_REGEX.test(item.title)) {
      // 英文标题 → 生成 titleZh 和 summaryZh
      try {
        const translation = await translateToZh(item);
        item.titleZh = translation.titleZh;
        item.summaryZh = translation.summaryZh;
        translatedCount++;
      } catch (err) {
        log.warn(`  翻译失败: ${item.title?.substring(0, 30)} — ${err.message}`);
        // 回退：使用简单的标记提醒需要人工翻译
        item.titleZh = `[待翻译] ${item.title}`;
        item.summaryZh = item.summary;
      }
    }
  }
  log.info(`🌐 翻译完成: ${translatedCount} 条英文新闻已添加中文翻译`);

  // ====== Step 5: 校验 ======
  const validated = validateBatch(cleaned, 'news', log);
  log.info(`✅ 校验通过: ${validated.length} 条`);

  // ====== Step 6: 去重 ======
  const existing = readExisting(NEWS_FILE);
  const { unique, dupeCount } = dedupNews(validated, existing);
  log.addDeduped(dupeCount);
  log.info(`🔍 去重: ${dupeCount} 条重复, ${unique.length} 条新增`);

  // ====== Step 7: 合并 + 写入 ======
  if (unique.length > 0) {
    log.addAdded(unique.length);
    const merged = mergeNews(unique, existing, config.QUALITY.maxNewsItems);

    if (DRY_RUN) {
      log.info('📋 DRY RUN — 新增条目预览:');
      unique.slice(0, 5).forEach(item => {
        log.info(`  → [${item.category}] ${item.title}`);
      });
    } else {
      writeJSON(NEWS_FILE, merged);
      log.ok(`💾 已写入 ${NEWS_FILE} (共 ${merged.length} 条)`);
    }
  } else {
    log.info('📭 没有新的新闻条目需要添加');
  }

  log.summary();
}

/**
 * 英文→中文翻译（支持 AI 模式和关键词规则模式）
 */
async function translateToZh(item) {
  // 优先使用 Claude API 翻译
  if (config.AI_ENABLED) {
    try {
      const Anthropic = require('@anthropic-ai/sdk');
      const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
      const resp = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `将以下AI行业新闻翻译为简洁专业的中文。返回JSON（不要markdown）：
{"titleZh": "中文标题（简洁有力，15-30字）", "summaryZh": "中文摘要（专业流畅，50-120字，突出对游戏行业的价值）"}

标题: ${item.title}
摘要: ${item.summary || ''}`,
        }],
      });
      const json = JSON.parse(resp.content[0]?.text || '{}');
      return {
        titleZh: json.titleZh || `[待翻译] ${item.title}`,
        summaryZh: json.summaryZh || item.summary,
      };
    } catch (err) {
      // AI翻译失败，回退到规则翻译
    }
  }

  // 关键词规则翻译（无API时的回退方案）
  return translateHeuristic(item);
}

/**
 * 基于关键词替换的简易翻译（回退方案）
 */
function translateHeuristic(item) {
  let title = item.title;
  let summary = item.summary || '';

  // 常见AI术语映射
  const termMap = [
    [/\bAI\b/g, 'AI'], [/\bLLM\b/g, '大模型'], [/\bGPT\b/g, 'GPT'],
    [/\bopen.?source\b/gi, '开源'], [/\blaunch(es|ed)?\b/gi, '发布'],
    [/\braise[sd]?\s+\$/gi, '获得$'], [/\bfunding\b/gi, '融资'],
    [/\bstartup\b/gi, '初创公司'], [/\bagent[s]?\b/gi, '智能体'],
    [/\bmodel[s]?\b/gi, '模型'], [/\bimage generation\b/gi, '图像生成'],
    [/\bvideo generation\b/gi, '视频生成'], [/\bcode generation\b/gi, '代码生成'],
    [/\bautomation\b/gi, '自动化'], [/\bworkflow\b/gi, '工作流'],
    [/\bproductivity\b/gi, '生产力'], [/\bPentagon\b/g, '五角大楼'],
    [/\bDepartment of Defense\b/gi, '美国国防部'], [/\bDoD\b/g, '国防部'],
  ];

  // 生成标记翻译（标注关键术语但保留原文结构）
  let titleZh = `[EN] ${title}`;
  for (const [regex, replacement] of termMap) {
    titleZh = titleZh.replace(regex, replacement);
  }

  return {
    titleZh: titleZh,
    summaryZh: summary ? `${summary}` : '',
  };
}

/**
 * 日期格式化为 YYYY-MM-DD
 */
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

// 运行
main().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ 致命错误:', err);
  process.exit(1);
});
