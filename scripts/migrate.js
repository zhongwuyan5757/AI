#!/usr/bin/env node
/**
 * migrate.js — 一次性迁移脚本
 * 将 data.js 中的 DATA 对象拆分为 8 个 JSON 文件
 *
 * 输出:
 *   data/meta.json       — 分类映射对象
 *   data/jobs.json        — 岗位数据
 *   data/news.json        — 新闻数据
 *   data/tools.json       — 工具数据
 *   data/models.json      — 模型数据
 *   data/tutorials.json   — 教程数据
 *   data/prompts.json     — Prompt数据
 *   data/resources.json   — 资源数据
 *
 * Usage: node scripts/migrate.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DATA_JS = path.join(ROOT, 'js', 'data.js');
const DATA_DIR = path.join(ROOT, 'data');

// 确保 data/ 目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log('📦 FiveSeven AI — 数据迁移工具');
console.log('================================\n');

// 1. 读取 data.js 源码
console.log(`📖 读取 ${DATA_JS}`);
const source = fs.readFileSync(DATA_JS, 'utf-8');

// 2. 在隔离沙箱中执行，提取 DATA 对象
// const 声明不会挂载到 sandbox，需要改写为 this.DATA = ...
console.log('🔧 解析 DATA 对象...');
const modifiedSource = source.replace(/^const DATA\s*=/m, 'this.DATA =');
const sandbox = {};
try {
  vm.runInNewContext(modifiedSource, sandbox);
} catch (err) {
  console.error('❌ 解析 data.js 失败:', err.message);
  process.exit(1);
}

const DATA = sandbox.DATA;
if (!DATA) {
  console.error('❌ 未找到 DATA 对象');
  process.exit(1);
}

// 3. 定义内容数组和元数据映射
const contentArrays = ['jobs', 'news', 'tools', 'models', 'tutorials', 'prompts', 'resources'];
const metaKeys = [
  'newsCategories',
  'toolCategories',
  'tutorialTiers',
  'difficultyMap',
  'resourceCategories',
  'modelTypes',
  'modelCapabilities',
  'jobRecommendations',
];

// 4. 构建 meta.json
const meta = {};
for (const key of metaKeys) {
  if (DATA[key]) {
    meta[key] = DATA[key];
    console.log(`  ✓ meta.${key} — ${Object.keys(DATA[key]).length} 条`);
  } else {
    console.log(`  ⚠ meta.${key} — 未找到，跳过`);
  }
}

// 5. 写出 meta.json
const metaPath = path.join(DATA_DIR, 'meta.json');
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
console.log(`\n✅ 写入 data/meta.json (${Object.keys(meta).length} 个映射对象)\n`);

// 6. 写出每个内容数组
const report = [];
for (const key of contentArrays) {
  const arr = DATA[key];
  if (!arr || !Array.isArray(arr)) {
    console.log(`  ⚠ DATA.${key} — 不是数组或未找到，跳过`);
    continue;
  }
  const filePath = path.join(DATA_DIR, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2), 'utf-8');
  const size = (fs.statSync(filePath).size / 1024).toFixed(1);
  console.log(`  ✅ data/${key}.json — ${arr.length} 条记录 (${size} KB)`);
  report.push({ file: `${key}.json`, count: arr.length, size: `${size} KB` });
}

// 7. 迁移报告
console.log('\n================================');
console.log('📊 迁移完成!\n');
console.log('文件                 记录数    大小');
console.log('─────────────────────────────────');
console.log(`meta.json            ${Object.keys(meta).length} 映射    ${(fs.statSync(metaPath).size / 1024).toFixed(1)} KB`);
for (const r of report) {
  const name = r.file.padEnd(20);
  const count = String(r.count).padEnd(9);
  console.log(`${name} ${count} ${r.size}`);
}
console.log('─────────────────────────────────');

const totalRecords = report.reduce((s, r) => s + r.count, 0);
console.log(`\n总计: ${report.length + 1} 个JSON文件, ${totalRecords} 条内容记录`);
console.log('\n下一步: 修改 index.html 加载 data-loader.js 替代 data.js');
