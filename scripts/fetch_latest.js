#!/usr/bin/env node
/**
 * fetch_latest.js — 轻量级统一入口
 *
 * 功能：
 *   1. 运行完整抓取流水线（新闻 + 工具 + 模型）
 *   2. 每次更新最多新增 100 条新闻
 *   3. 自动清理超过 7 天的旧新闻
 *   4. 7 天内新闻累积保留供用户翻阅
 *   5. 对比写入前后内容哈希，无变化则跳过写入
 *   6. 输出 JSON 摘要供 CI 判断是否需要提交
 *
 * Usage:
 *   node scripts/fetch_latest.js           # 正常运行
 *   node scripts/fetch_latest.js --dry-run # 只输出不写入
 *   npm run fetch:latest                   # 通过 npm script
 */
const { execSync } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const DRY_RUN = process.argv.includes('--dry-run');
const MAX_PER_FETCH = 100;   // 每次更新保留的最大新条目数
const RETENTION_DAYS = 7;    // 新闻保留天数，超过自动清理

function fileHash(filePath) {
  if (!fs.existsSync(filePath)) return '';
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  FiveSeven AI — fetch:latest 统一入口        ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`📅 ${new Date().toISOString()}`);
  if (DRY_RUN) console.log('⚠️  DRY RUN 模式\n');

  // ====== 记录写入前哈希 ======
  const dataFiles = ['news.json', 'tools.json', 'models.json'];
  const beforeHashes = {};
  for (const f of dataFiles) {
    beforeHashes[f] = fileHash(path.join(DATA_DIR, f));
  }

  // ====== 执行完整抓取流水线 ======
  const dryFlag = DRY_RUN ? ' --dry-run' : '';
  const scripts = [
    { name: '📰 新闻抓取', cmd: `node scripts/fetch_news.js${dryFlag}` },
    { name: '🔧 工具发现', cmd: `node scripts/fetch_tools.js${dryFlag}` },
    { name: '🤖 模型追踪', cmd: `node scripts/fetch_models.js${dryFlag}` },
  ];

  const results = [];
  for (const script of scripts) {
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`▶ ${script.name}`);
    const t0 = Date.now();
    try {
      execSync(script.cmd, { cwd: ROOT, stdio: 'inherit', timeout: 120000 });
      results.push({ name: script.name, ok: true, time: Date.now() - t0 });
    } catch {
      results.push({ name: script.name, ok: false, time: Date.now() - t0 });
      console.error(`❌ ${script.name} 执行失败，继续下一个`);
    }
  }

  // ====== 7天清理 + 累积保留 ======
  if (!DRY_RUN) {
    const newsFile = path.join(DATA_DIR, 'news.json');
    try {
      const news = JSON.parse(fs.readFileSync(newsFile, 'utf-8'));
      if (Array.isArray(news)) {
        const beforeCount = news.length;

        // 1. 按日期倒序排列
        const sorted = [...news].sort((a, b) => {
          const da = new Date(a.date || 0);
          const db = new Date(b.date || 0);
          return db - da;
        });

        // 2. 删除超过 7 天的旧新闻
        const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 86400000)
          .toISOString().slice(0, 10);
        const retained = sorted.filter(item => {
          const itemDate = item.date || '';
          return itemDate >= cutoffDate;
        });
        const expiredCount = sorted.length - retained.length;

        // 3. 安全上限（7天内最多保留 MAX_PER_FETCH * RETENTION_DAYS 条，防止异常膨胀）
        const safeCap = MAX_PER_FETCH * RETENTION_DAYS;
        const trimmed = retained.slice(0, safeCap);

        // 仅在实际变更时写入
        if (beforeCount !== trimmed.length || JSON.stringify(news) !== JSON.stringify(trimmed)) {
          const tmpPath = newsFile + '.tmp';
          fs.writeFileSync(tmpPath, JSON.stringify(trimmed, null, 2), 'utf-8');
          fs.renameSync(tmpPath, newsFile);
          console.log(`\n📰 news.json 处理结果:`);
          console.log(`   原始: ${beforeCount} 条`);
          if (expiredCount > 0) console.log(`   🗑️  清理过期(>${RETENTION_DAYS}天): ${expiredCount} 条`);
          console.log(`   ✅ 保留: ${trimmed.length} 条 (${RETENTION_DAYS}天内累积)`);
        }
      }
    } catch (err) {
      console.error(`清理失败: ${err.message}`);
    }
  }

  // ====== 对比写入后哈希，判断是否有实际变化 ======
  const afterHashes = {};
  let changed = false;
  const changedFiles = [];
  for (const f of dataFiles) {
    afterHashes[f] = fileHash(path.join(DATA_DIR, f));
    if (beforeHashes[f] !== afterHashes[f]) {
      changed = true;
      changedFiles.push(f);
    }
  }

  // ====== 输出摘要 ======
  console.log(`\n${'═'.repeat(50)}`);
  console.log('📊 fetch:latest 运行摘要');
  console.log('═'.repeat(50));
  for (const r of results) {
    const status = r.ok ? '✅' : '❌';
    console.log(`  ${status} ${r.name} (${(r.time / 1000).toFixed(1)}s)`);
  }
  console.log('─'.repeat(50));
  if (changed) {
    console.log(`📝 数据变更: ${changedFiles.join(', ')}`);
  } else {
    console.log('📭 无数据变更');
  }

  // 写入摘要文件供 CI 读取
  const summary = {
    timestamp: new Date().toISOString(),
    changed,
    changedFiles,
    scripts: results.map(r => ({ name: r.name, ok: r.ok, ms: r.time })),
  };
  if (!DRY_RUN) {
    fs.writeFileSync(path.join(ROOT, '.fetch-summary.json'), JSON.stringify(summary, null, 2));
  }

  const failed = results.filter(r => !r.ok);
  if (failed.length === results.length) {
    console.error('\n❌ 所有脚本均失败');
    process.exit(1);
  }
  console.log('\n✅ fetch:latest 完成');
}

main();
