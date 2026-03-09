/**
 * dedup.js — 去重模块
 * 基于 id/url/name 进行精确匹配去重
 */

/**
 * 新闻去重（按 URL）
 * @param {Array} newItems - 新抓取的条目
 * @param {Array} existing - 已有条目
 * @returns {{ unique: Array, dupeCount: number }}
 */
function dedupNews(newItems, existing) {
  const existingUrls = new Set(existing.map(e => normalizeUrl(e.url)));
  const existingTitles = new Set(existing.map(e => e.title?.toLowerCase().trim()));

  const unique = [];
  let dupeCount = 0;

  for (const item of newItems) {
    const normUrl = normalizeUrl(item.url);
    const normTitle = item.title?.toLowerCase().trim();

    if (existingUrls.has(normUrl) || existingTitles.has(normTitle)) {
      dupeCount++;
    } else {
      unique.push(item);
      existingUrls.add(normUrl);
      existingTitles.add(normTitle);
    }
  }

  return { unique, dupeCount };
}

/**
 * 工具/模型去重（按 id 或 name）
 * @param {Array} newItems
 * @param {Array} existing
 * @returns {{ unique: Array, dupeCount: number }}
 */
function dedupByIdOrName(newItems, existing) {
  const existingIds = new Set(existing.map(e => e.id?.toLowerCase()));
  const existingNames = new Set(existing.map(e => e.name?.toLowerCase().trim()));

  const unique = [];
  let dupeCount = 0;

  for (const item of newItems) {
    const id = item.id?.toLowerCase();
    const name = item.name?.toLowerCase().trim();

    if (existingIds.has(id) || existingNames.has(name)) {
      dupeCount++;
    } else {
      unique.push(item);
      existingIds.add(id);
      if (name) existingNames.add(name);
    }
  }

  return { unique, dupeCount };
}

/**
 * URL 标准化
 */
function normalizeUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    // 去除 trailing slash, www, 协议差异
    return u.hostname.replace('www.', '') + u.pathname.replace(/\/$/, '') + u.search;
  } catch {
    return url.toLowerCase().trim();
  }
}

module.exports = { dedupNews, dedupByIdOrName, normalizeUrl };
