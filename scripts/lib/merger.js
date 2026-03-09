/**
 * merger.js — 新旧数据合并模块
 * 将新数据与现有 JSON 合并，保留手动编辑的条目
 */
const fs = require('fs');
const path = require('path');

/**
 * 读取现有 JSON 文件
 * @param {string} filePath - JSON 文件绝对路径
 * @returns {Array}
 */
function readExisting(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[merger] 读取 ${filePath} 失败: ${err.message}`);
    return [];
  }
}

/**
 * 合并新闻（新条目插入到前面，按日期降序）
 * @param {Array} newItems - 去重后的新条目
 * @param {Array} existing - 现有条目
 * @param {number} maxItems - 最大保留条数
 * @returns {Array}
 */
function mergeNews(newItems, existing, maxItems = 100) {
  const merged = [...newItems, ...existing];

  // 按日期降序排列
  merged.sort((a, b) => {
    const da = new Date(a.date || 0);
    const db = new Date(b.date || 0);
    return db - da;
  });

  // 截断到最大条数
  return merged.slice(0, maxItems);
}

/**
 * 合并工具/模型（新条目追加到末尾）
 * @param {Array} newItems - 去重后的新条目
 * @param {Array} existing - 现有条目
 * @param {number} maxItems - 最大保留条数
 * @returns {Array}
 */
function mergeAppend(newItems, existing, maxItems = 50) {
  const merged = [...existing, ...newItems];
  return merged.slice(0, maxItems);
}

/**
 * 写入 JSON 文件（原子写入 — 先写临时文件再重命名）
 * @param {string} filePath
 * @param {Array} data
 */
function writeJSON(filePath, data) {
  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

module.exports = { readExisting, mergeNews, mergeAppend, writeJSON };
