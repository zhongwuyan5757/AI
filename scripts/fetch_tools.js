#!/usr/bin/env node
/**
 * fetch_tools.js — AI 工具自动发现脚本
 *
 * Pipeline: GitHub Trending → 清洗 → AI分类 → 校验 → 去重 → 合并 → 写入
 *
 * Usage:
 *   node scripts/fetch_tools.js           # 正常运行
 *   node scripts/fetch_tools.js --dry-run # 只输出不写入
 */
const path = require('path');
const config = require('./config');
const Logger = require('./lib/logger');
const { fetchJSON, extractDomain } = require('./lib/fetcher');
const { classifyTool } = require('./lib/ai-enricher');
const { validateBatch } = require('./lib/validator');
const { dedupByIdOrName } = require('./lib/dedup');
const { readExisting, mergeAppend, writeJSON } = require('./lib/merger');

const DRY_RUN = process.argv.includes('--dry-run');
const TOOLS_FILE = path.join(config.DATA_DIR, 'tools.json');

async function main() {
  const log = new Logger('fetch_tools');
  log.info('🚀 开始工具发现...');
  if (DRY_RUN) log.warn('⚠️ DRY RUN 模式 — 不会写入文件');

  const rawItems = [];

  // ====== Step 1: GitHub API — Trending AI repos ======
  log.info('📡 抓取 GitHub AI 仓库...');
  try {
    const headers = {};
    if (config.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${config.GITHUB_TOKEN}`;
    }

    // 搜索最近创建的 AI 工具仓库
    const data = await fetchJSON(
      'https://api.github.com/search/repositories?q=AI+tool+language:python+language:javascript+stars:>100&sort=stars&order=desc&per_page=20',
      { headers }
    );

    const repos = (data.items || []).map(repo => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics || [],
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }));

    log.info(`  ✓ GitHub: ${repos.length} 个仓库`);
    log.addFetched(repos.length);
    rawItems.push(...repos);
  } catch (err) {
    log.error(`  ✗ GitHub 抓取失败: ${err.message}`);
  }

  if (rawItems.length === 0) {
    log.warn('没有发现新工具，退出');
    log.summary();
    return;
  }

  // ====== Step 2: 转换为平台工具格式 ======
  log.info('🔧 格式化工具数据...');
  const formatted = [];

  for (const item of rawItems) {
    try {
      // AI分类
      const classification = await classifyTool({
        name: item.name,
        description: item.description,
      });

      const toolId = item.name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

      const features = classification.features.length > 0 ? classification.features : extractFeatures(item);
      formatted.push({
        id: toolId,
        name: item.name,
        category: classification.category,
        icon: getCategoryIcon(classification.category),
        color: { text: '#69eacb', image: '#a78bfa', video: '#f472b6', code: '#38bdf8', audio: '#fbbf24', productivity: '#34d399' }[classification.category] || '#69eacb',
        desc: item.description.substring(0, 200),
        officialUrl: item.url,
        pricing: '开源免费',
        difficulty: classification.difficulty,
        suitableJobs: classification.targetJobs || ['all'],
        targetJobs: classification.targetJobs,
        problemsSolved: features.slice(0, 3),
        features: features,
        pros: classification.pros.length > 0 ? classification.pros : [`⭐ ${item.stars} Stars`, `${item.language || 'Multi'} 语言`],
        cons: classification.cons.length > 0 ? classification.cons : ['需要技术背景'],
        tutorialId: null,
        editorPick: false,
        source: 'github',
        stars: item.stars,
      });
    } catch (err) {
      log.warn(`  分类失败: ${item.name} — ${err.message}`);
    }
  }

  log.info(`📋 格式化完成: ${formatted.length} 个工具`);

  // ====== Step 3: 校验 ======
  const validated = validateBatch(formatted, 'tool', log);
  log.info(`✅ 校验通过: ${validated.length} 个`);

  // ====== Step 4: 去重 ======
  const existing = readExisting(TOOLS_FILE);
  const { unique, dupeCount } = dedupByIdOrName(validated, existing);
  log.addDeduped(dupeCount);
  log.info(`🔍 去重: ${dupeCount} 个重复, ${unique.length} 个新增`);

  // ====== Step 5: 合并 + 写入 ======
  if (unique.length > 0) {
    log.addAdded(unique.length);
    const merged = mergeAppend(unique, existing, config.QUALITY.maxToolsItems);

    if (DRY_RUN) {
      log.info('📋 DRY RUN — 新发现工具预览:');
      unique.slice(0, 5).forEach(t => {
        log.info(`  → [${t.category}] ${t.name} — ⭐${t.stars} — ${t.description?.substring(0, 50)}`);
      });
    } else {
      writeJSON(TOOLS_FILE, merged);
      log.ok(`💾 已写入 ${TOOLS_FILE} (共 ${merged.length} 个工具)`);
    }
  } else {
    log.info('📭 没有新工具需要添加');
  }

  log.summary();
}

function getCategoryIcon(category) {
  const icons = {
    text: '💬', image: '🎨', video: '🎬', code: '💻',
    audio: '🎵', productivity: '⚡',
  };
  return icons[category] || '🔧';
}

function extractFeatures(item) {
  const features = [];
  if (item.stars > 1000) features.push('社区活跃');
  if (item.language) features.push(`${item.language} 开发`);
  if (item.topics?.length > 0) features.push(...item.topics.slice(0, 3));
  return features.slice(0, 5);
}

main().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ 致命错误:', err);
  process.exit(1);
});
