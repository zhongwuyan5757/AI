/**
 * fetcher.js — HTTP/RSS 通用抓取模块
 * 支持 JSON API 和 RSS Feed 两种模式
 */
const RSSParser = require('rss-parser');

const rssParser = new RSSParser({
  timeout: 15000,
  headers: { 'User-Agent': 'FiveSevenAI/1.0 (+https://fiveseven.ai)' },
});

/**
 * 抓取 JSON API
 * @param {string} url
 * @param {object} options - { headers, timeout }
 * @returns {Promise<object>}
 */
async function fetchJSON(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout || 15000);

  try {
    const headers = {
      'User-Agent': 'FiveSevenAI/1.0',
      'Accept': 'application/json',
      ...options.headers,
    };
    const res = await fetch(url, { headers, signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 抓取 RSS Feed
 * @param {string} url
 * @returns {Promise<Array<{title, link, pubDate, summary, source}>>}
 */
async function fetchRSS(url) {
  const feed = await rssParser.parseURL(url);
  return (feed.items || []).map(item => ({
    title: (item.title || '').trim(),
    link: item.link || '',
    pubDate: item.pubDate || item.isoDate || '',
    summary: (item.contentSnippet || item.content || '').substring(0, 300).trim(),
    source: feed.title || new URL(url).hostname,
  }));
}

/**
 * 从 URL 提取域名
 */
function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}

module.exports = { fetchJSON, fetchRSS, extractDomain };
