#!/usr/bin/env node
/**
 * run_all.js — 编排器
 * 依次运行所有自动化脚本，汇总报告
 *
 * Usage:
 *   node scripts/run_all.js           # 正常运行所有脚本
 *   node scripts/run_all.js --dry-run # 所有脚本使用 dry-run 模式
 */
const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');
const dryFlag = DRY_RUN ? ' --dry-run' : '';

const scripts = [
  { name: '📰 新闻抓取', cmd: `node scripts/fetch_news.js${dryFlag}` },
  { name: '🔧 工具发现', cmd: `node scripts/fetch_tools.js${dryFlag}` },
  { name: '🤖 模型追踪', cmd: `node scripts/fetch_models.js${dryFlag}` },
];

console.log('╔══════════════════════════════════════════╗');
console.log('║  FiveSeven AI — 自动化内容平台 · 编排器  ║');
console.log('╚══════════════════════════════════════════╝');
console.log(`\n📅 ${new Date().toLocaleString('zh-CN')}`);
if (DRY_RUN) console.log('⚠️  DRY RUN 模式\n');
console.log('');

const results = [];
const startTime = Date.now();

for (const script of scripts) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`▶ ${script.name}`);
  console.log('='.repeat(50));

  const t0 = Date.now();
  try {
    execSync(script.cmd, { cwd: ROOT, stdio: 'inherit', timeout: 120000 });
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    results.push({ name: script.name, status: '✅ 成功', time: `${elapsed}s` });
  } catch (err) {
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    results.push({ name: script.name, status: '❌ 失败', time: `${elapsed}s` });
    console.error(`\n❌ ${script.name} 执行失败`);
  }
}

// 汇总报告
const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n\n${'═'.repeat(50)}`);
console.log('📊 运行汇总');
console.log('═'.repeat(50));
console.log('脚本                  状态       耗时');
console.log('─'.repeat(50));
for (const r of results) {
  console.log(`${r.name.padEnd(22)} ${r.status.padEnd(10)} ${r.time}`);
}
console.log('─'.repeat(50));
console.log(`总耗时: ${totalTime}s`);

const failed = results.filter(r => r.status.includes('失败'));
if (failed.length > 0) {
  console.log(`\n⚠️ ${failed.length} 个脚本失败，请检查日志`);
  process.exit(1);
} else {
  console.log('\n✅ 所有脚本执行成功!');
}
