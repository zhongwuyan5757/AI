/**
 * Vercel Serverless Function — 社交分享 OG 标签动态渲染
 *
 * 解决问题：SPA hash 路由下，社交平台爬虫无法获取页面级 OG 标签
 *
 * 原理：
 *   分享链接 /tutorials/t-claude-02
 *   → Vercel rewrite 到 /api/og?section=tutorials&param=t-claude-02
 *   → 本函数读取 JSON 数据，返回带正确 OG 标签的 HTML
 *   → 爬虫看到标题+描述；用户被立刻重定向到 /#tutorials/t-claude-02
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const SITE_NAME = 'FiveSeven AI';
const SITE_URL = 'https://fiveseven-ai.vercel.app';
const DEFAULT_DESC = '面向游戏行业的 AI 成长平台。9 大核心岗位专属路径、精选工具、实战指南和 Prompt 模板——从好奇出发，到从容驾驭。';

// 各版块的默认 meta 信息
const SECTION_META = {
  home:         { title: '从好奇到从容的 AI 成长平台', desc: DEFAULT_DESC },
  jobs:         { title: '岗位路径', desc: '选一个最接近你的岗位——工具、指南和 Prompt 都帮你理好了' },
  news:         { title: 'AI Pulse', desc: 'AI 每天都有新东西，但不是每个都值得你看——这里只推值得关注的' },
  tools:        { title: '工具库', desc: '不用一个个去试——这些工具都按岗位筛过了，找到适合你的，直接上手' },
  models:       { title: '模型库', desc: 'ChatGPT、Claude、Gemini……到底该用哪个？这里帮你看清差异，选对模型' },
  tutorials:    { title: '实战指南', desc: '每篇指南都对应一个具体任务——跟着做就行' },
  prompts:      { title: 'Prompt 库', desc: '不知道怎么跟 AI 说？直接复制这些 Prompt，改几个关键词就能用' },
  resources:    { title: '资源库', desc: '模板、素材、参考资料——别人整理好的东西，拿去直接用' },
  path:         { title: '学习路径', desc: '不知道先学什么？选一条路径，按顺序来——每一步都帮你安排好了' },
  diagnosis:    { title: 'AI 能力诊断', desc: '3 个问题，1 分钟，帮你找到最适合的第一步' },
  'video-tool': { title: '视频学习助手', desc: '粘贴任意 YouTube 链接，用 AI 帮你精简、提炼、翻译视频内容' },
};

// 学习路径静态 meta（与 app.js 中 LEARNING_PATHS 保持一致）
const PATH_META = {
  '7day-beginner':  { title: '7 天 AI 入门之旅', desc: '每天 30 分钟，7 天后你会惊讶自己已经能做这么多' },
  '5day-efficiency': { title: '5 天 AI 效率提升', desc: '学会用得更聪明——写文案、做分析、出报告，每天少花一小时' },
  '5day-advanced':  { title: '5 天 AI 进阶实战', desc: '让 AI 不只是工具，而是你的工作搭档——搭建工作流、用 Agent 自动处理任务' },
};

// 懒加载 JSON 数据（Serverless 冷启动缓存，失败不缓存以允许重试）
const _cache = {};
function loadJSON(name) {
  if (_cache[name] !== undefined) return _cache[name];
  try {
    const filePath = join(process.cwd(), 'data', `${name}.json`);
    _cache[name] = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`[og] Failed to load data/${name}.json:`, err.message);
    return []; // 不缓存失败结果，下次请求可重试
  }
  return _cache[name];
}

function findItem(dataName, id) {
  const data = loadJSON(dataName);
  return Array.isArray(data) ? data.find(item => item.id === id) : null;
}

/**
 * 根据 section + param 解析出 OG 标题和描述
 */
function resolveMeta(section, param) {
  // 1. 有具体 ID 的内容页 — 使用内容标题
  if (param) {
    if (section === 'tutorials') {
      // 专栏详情页：/tutorials/column:oc17
      if (param.startsWith('column:')) {
        const col = findItem('columns', param.replace('column:', ''));
        if (col) return { title: col.title, desc: col.subtitle || col.desc };
      }
      // 按 tier 筛选：/tutorials/tier:beginner
      if (param.startsWith('tier:')) {
        const sectionMeta = SECTION_META.tutorials;
        return { title: sectionMeta.title, desc: sectionMeta.desc };
      }
      // 单篇教程详情：/tutorials/t-claude-02
      const tut = findItem('tutorials', param);
      if (tut) return { title: tut.title, desc: tut.desc };
    }

    if (section === 'jobs') {
      const job = findItem('jobs', param);
      if (job) return { title: `${job.name} · AI 成长路径`, desc: job.desc || job.tagline };
    }

    if (section === 'path') {
      const pathMeta = PATH_META[param];
      if (pathMeta) return { title: pathMeta.title, desc: pathMeta.desc };
    }
  }

  // 2. 版块首页 — 使用默认 meta
  const fallback = SECTION_META[section] || SECTION_META.home;
  return { title: fallback.title, desc: fallback.desc };
}

// ===== 安全工具函数 =====

/** 输入白名单 — 仅允许已知 section */
const ALLOWED_SECTIONS = new Set(Object.keys(SECTION_META));

/** param 安全字符：字母、数字、中文、连字符、下划线、冒号、点 */
const SAFE_PARAM = /^[a-zA-Z0-9\u4e00-\u9fff_\-:.]*$/;

/** HTML 属性转义 */
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** 内联 script 安全转义 — 防止 </script> 注入 */
function escJS(str) {
  return JSON.stringify(str).replace(/<\//g, '<\\/');
}

export default function handler(req, res) {
  const rawSection = req.query.section ?? 'home';
  const rawParam = req.query.param ?? '';

  // 输入校验：拒绝未知 section
  if (!ALLOWED_SECTIONS.has(rawSection)) {
    return res.status(400).send('Bad Request');
  }

  // 输入校验：param 仅允许安全字符
  if (rawParam && !SAFE_PARAM.test(rawParam)) {
    return res.status(400).send('Bad Request');
  }

  const section = rawSection;
  const param = rawParam;

  const { title, desc } = resolveMeta(section, param);
  const fullTitle = (section === 'home' && !param)
    ? `${SITE_NAME} — ${title}`
    : `${title} — ${SITE_NAME}`;

  // og:type — 详情页用 article，列表/首页用 website
  const ogType = (param && section !== 'path') ? 'article' : 'website';

  // 构造 hash 路由的跳转目标
  const hashPath = param ? `${section}/${param}` : (section === 'home' ? '' : section);
  const canonicalUrl = `${SITE_URL}/${hashPath}`;
  const hashUrl = `${SITE_URL}/#${hashPath}`;

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"/>
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}"/>

  <!-- Open Graph -->
  <meta property="og:type" content="${ogType}"/>
  <meta property="og:title" content="${esc(fullTitle)}"/>
  <meta property="og:description" content="${esc(desc)}"/>
  <meta property="og:site_name" content="${esc(SITE_NAME)}"/>
  <meta property="og:url" content="${esc(canonicalUrl)}"/>
  <meta property="og:locale" content="zh_CN"/>

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary"/>
  <meta name="twitter:title" content="${esc(fullTitle)}"/>
  <meta name="twitter:description" content="${esc(desc)}"/>

  <link rel="canonical" href="${esc(canonicalUrl)}"/>
</head>
<body>
  <p>正在跳转到 <a href="${esc(hashUrl)}">${esc(fullTitle)}</a></p>
  <script>window.location.replace(${escJS(hashUrl)});</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(html);
}
