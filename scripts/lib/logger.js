/**
 * logger.js — 日志系统
 * 同时输出到控制台和日志文件
 */
const fs = require('fs');
const path = require('path');
const { LOGS_DIR } = require('../config');

// 确保日志目录存在
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

class Logger {
  constructor(scriptName) {
    this.scriptName = scriptName;
    const date = new Date().toISOString().split('T')[0];
    this.logFile = path.join(LOGS_DIR, `${date}_${scriptName}.log`);
    this.stats = { fetched: 0, added: 0, skipped: 0, errors: 0, deduped: 0 };
  }

  _write(level, msg) {
    const timestamp = new Date().toISOString().substring(11, 19);
    const line = `[${timestamp}] [${level}] ${msg}`;

    // 控制台输出（带颜色）
    const colors = { INFO: '\x1b[36m', WARN: '\x1b[33m', ERROR: '\x1b[31m', OK: '\x1b[32m' };
    console.log(`${colors[level] || ''}${line}\x1b[0m`);

    // 文件输出
    fs.appendFileSync(this.logFile, line + '\n', 'utf-8');
  }

  info(msg) { this._write('INFO', msg); }
  warn(msg) { this._write('WARN', msg); }
  error(msg) { this._write('ERROR', msg); this.stats.errors++; }
  ok(msg) { this._write('OK', msg); }

  // 统计方法
  addFetched(n = 1) { this.stats.fetched += n; }
  addAdded(n = 1) { this.stats.added += n; }
  addSkipped(n = 1) { this.stats.skipped += n; }
  addDeduped(n = 1) { this.stats.deduped += n; }

  // 输出最终报告
  summary() {
    const s = this.stats;
    this._write('OK', '── 运行报告 ──');
    this._write('OK', `  抓取: ${s.fetched} | 新增: ${s.added} | 去重: ${s.deduped} | 跳过: ${s.skipped} | 错误: ${s.errors}`);
    this._write('INFO', `日志文件: ${this.logFile}`);
    return this.stats;
  }
}

module.exports = Logger;
