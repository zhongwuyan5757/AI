#!/usr/bin/env node
/**
 * fetch_models.js — AI 模型自动追踪脚本
 *
 * Pipeline: HuggingFace API → 清洗 → 格式化 → 校验 → 去重 → 合并 → 写入
 *
 * Usage:
 *   node scripts/fetch_models.js           # 正常运行
 *   node scripts/fetch_models.js --dry-run # 只输出不写入
 */
const path = require('path');
const config = require('./config');
const Logger = require('./lib/logger');
const { fetchJSON } = require('./lib/fetcher');
const { validateBatch } = require('./lib/validator');
const { dedupByIdOrName } = require('./lib/dedup');
const { readExisting, mergeAppend, writeJSON } = require('./lib/merger');

const DRY_RUN = process.argv.includes('--dry-run');
const MODELS_FILE = path.join(config.DATA_DIR, 'models.json');

async function main() {
  const log = new Logger('fetch_models');
  log.info('🚀 开始模型追踪...');
  if (DRY_RUN) log.warn('⚠️ DRY RUN 模式 — 不会写入文件');

  const rawItems = [];

  // ====== Step 1: HuggingFace Trending Models ======
  log.info('📡 抓取 HuggingFace 热门模型...');
  try {
    const models = await fetchJSON(
      'https://huggingface.co/api/models?sort=likes&direction=-1&limit=20',
      { timeout: 20000 }
    );

    const items = (Array.isArray(models) ? models : []).map(m => ({
      modelId: m.modelId || m.id || '',
      author: m.author || '',
      downloads: m.downloads || 0,
      likes: m.likes || 0,
      tags: m.tags || [],
      pipelineTag: m.pipeline_tag || m.pipelineTag || '',
      lastModified: m.lastModified || '',
    }));

    log.info(`  ✓ HuggingFace: ${items.length} 个模型`);
    log.addFetched(items.length);
    rawItems.push(...items);
  } catch (err) {
    log.error(`  ✗ HuggingFace 抓取失败: ${err.message}`);
  }

  if (rawItems.length === 0) {
    log.warn('没有发现新模型，退出');
    log.summary();
    return;
  }

  // ====== Step 2: 转换为平台模型格式 ======
  log.info('🔧 格式化模型数据...');
  const formatted = [];

  for (const item of rawItems) {
    const id = (item.modelId || '').replace(/\//g, '-').toLowerCase();
    const name = item.modelId?.split('/').pop() || id;

    // 基于 pipelineTag 推断类型
    const typeInfo = inferModelType(item.pipelineTag, item.tags);

    formatted.push({
      id,
      name,
      vendor: item.author || 'Community',
      icon: typeInfo.icon,
      type: typeInfo.type,
      capabilities: typeInfo.capabilities,
      contextWindow: '-',
      pricing: '开源免费',
      speed: '取决于硬件',
      bestFor: typeInfo.bestFor,
      desc: `HuggingFace热门模型 — ${item.pipelineTag || 'general'} — ❤️${item.likes} 👁️${item.downloads}`,
      featured: item.likes > 1000,
      source: 'huggingface',
      likes: item.likes,
      downloads: item.downloads,
    });
  }

  log.info(`📋 格式化完成: ${formatted.length} 个模型`);

  // ====== Step 3: 校验 ======
  const validated = validateBatch(formatted, 'model', log);
  log.info(`✅ 校验通过: ${validated.length} 个`);

  // ====== Step 4: 去重 ======
  const existing = readExisting(MODELS_FILE);
  const { unique, dupeCount } = dedupByIdOrName(validated, existing);
  log.addDeduped(dupeCount);
  log.info(`🔍 去重: ${dupeCount} 个重复, ${unique.length} 个新增`);

  // ====== Step 5: 合并 + 写入 ======
  if (unique.length > 0) {
    log.addAdded(unique.length);
    const merged = mergeAppend(unique, existing, config.QUALITY.maxModelsItems);

    if (DRY_RUN) {
      log.info('📋 DRY RUN — 新发现模型预览:');
      unique.slice(0, 5).forEach(m => {
        log.info(`  → [${m.type}] ${m.name} by ${m.vendor} — ❤️${m.likes}`);
      });
    } else {
      writeJSON(MODELS_FILE, merged);
      log.ok(`💾 已写入 ${MODELS_FILE} (共 ${merged.length} 个模型)`);
    }
  } else {
    log.info('📭 没有新模型需要添加');
  }

  log.summary();
}

/**
 * 基于 HuggingFace pipeline_tag 推断模型类型
 */
function inferModelType(pipelineTag, tags = []) {
  const tag = (pipelineTag || '').toLowerCase();
  const allTags = tags.join(' ').toLowerCase();

  if (tag.includes('text-generation') || tag.includes('text2text') || allTags.includes('llm')) {
    return {
      type: 'llm',
      icon: '🧠',
      capabilities: ['text-gen', 'reasoning'],
      bestFor: ['文本生成', '对话助手', '代码辅助'],
    };
  }
  if (tag.includes('image') || tag.includes('text-to-image') || allTags.includes('diffusion')) {
    return {
      type: 'image',
      icon: '🎨',
      capabilities: ['image-gen'],
      bestFor: ['图像生成', '风格迁移', '概念设计'],
    };
  }
  if (tag.includes('video') || allTags.includes('video')) {
    return {
      type: 'video',
      icon: '🎬',
      capabilities: ['video-gen'],
      bestFor: ['视频生成', '动画创作'],
    };
  }
  if (tag.includes('audio') || tag.includes('speech') || allTags.includes('tts')) {
    return {
      type: 'audio',
      icon: '🎵',
      capabilities: ['audio-gen'],
      bestFor: ['语音合成', '音乐生成'],
    };
  }
  if (tag.includes('code') || allTags.includes('code')) {
    return {
      type: 'code',
      icon: '💻',
      capabilities: ['code-gen'],
      bestFor: ['代码生成', '代码补全'],
    };
  }
  if (tag.includes('vision') || tag.includes('visual') || tag.includes('multimodal')) {
    return {
      type: 'multimodal',
      icon: '👁️',
      capabilities: ['vision', 'text-gen'],
      bestFor: ['多模态理解', '图像分析'],
    };
  }

  return {
    type: 'llm',
    icon: '🤖',
    capabilities: ['text-gen'],
    bestFor: ['通用AI任务'],
  };
}

main().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ 致命错误:', err);
  process.exit(1);
});
