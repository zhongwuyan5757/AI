/* ============================================
   FiveSeven AI - 应用逻辑
   路由、渲染器、筛选、交互
   ============================================ */

// ===== 工具函数 =====

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function getJobById(id) { return DATA.jobs.find(j => j.id === id); }
function getToolById(id) { return DATA.tools.find(t => t.id === id); }
function getTutorialById(id) { return DATA.tutorials.find(t => t.id === id); }
function getPromptById(id) { return DATA.prompts.find(p => p.id === id); }

const _escapeDiv = document.createElement('div');
function escapeHtml(text) {
  _escapeDiv.textContent = text;
  return _escapeDiv.innerHTML;
}

function escapeAttr(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^\/[^/]/.test(trimmed) || trimmed === '/') return trimmed;
  return '#';
}

function matchesJob(itemJobs, jobId) {
  if (!jobId || jobId === 'all') return true;
  if (!Array.isArray(itemJobs)) return false;
  return itemJobs.includes(jobId) || itemJobs.includes('all');
}

function highlightText(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  return escaped.replace(regex, '<span class="search-highlight">$1</span>');
}

function getFavorites() {
  // 迁移旧 key
  const old = localStorage.getItem('ai-hub-favorites');
  if (old) { localStorage.setItem('fiveseven-favorites', old); localStorage.removeItem('ai-hub-favorites'); }
  try { return JSON.parse(localStorage.getItem('fiveseven-favorites') || '[]'); }
  catch { return []; }
}

function toggleFavorite(toolId, btn) {
  const favs = getFavorites();
  const idx = favs.indexOf(toolId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    btn.classList.remove('favorited');
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    showToast('已取消收藏 ✓');
    trackEvent('unfavorite', { toolId });
  } else {
    favs.push(toolId);
    btn.classList.add('favorited');
    btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    showToast('已收藏 ✓');
    trackEvent('favorite', { toolId });
  }
  localStorage.setItem('fiveseven-favorites', JSON.stringify(favs));
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast('已复制'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('已复制');
  }
}

function jobTagsHtml(jobIds) {
  return jobIds.filter(id => id !== 'all').map(id => {
    const j = getJobById(id);
    return j ? `<span class="job-tag">${j.name}</span>` : '';
  }).join('');
}

function diffBadge(diff) {
  const d = DATA.difficultyMap[diff] || { label: diff, cssClass: 'beginner' };
  return `<span class="difficulty ${d.cssClass}">${d.label}</span>`;
}

function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function scrollToCard(type, id) {
  setTimeout(() => {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('search-target');
      setTimeout(() => el.classList.remove('search-target'), 2500);
    }
  }, 150);
}


// ===== 工具 SVG 图标库 =====

const TOOL_ICONS = {
  'chatgpt': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h5"/></svg>',
  'claude': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.09 6.26L20.18 10l-6.09 1.74L12 18l-2.09-6.26L3.82 10l6.09-1.74z"/></svg>',
  'midjourney': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  'stable-diffusion': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  'runway': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',
  'kling': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  'perplexity': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>',
  'notion-ai': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  'canva-ai': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  'figma-ai': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>',
  'photoshop-ai': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  'capcut-ai': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>',
  'descript': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>',
  'cursor': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  'gemini': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>',
  'deepseek': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>',
  'kimi': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>',
  'gamma': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  'suno': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
};

function getToolIcon(toolId) {
  return TOOL_ICONS[toolId] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
}


// ===== 路由 =====

let currentSection = 'home';

// 页面清理注册表 — 路由切换时释放前页面资源
const _pageCleanups = [];
function registerCleanup(fn) { _pageCleanups.push(fn); }
function runCleanups() {
  while (_pageCleanups.length) { try { _pageCleanups.pop()(); } catch(e) { /* ignore */ } }
}

function navigate(section, param) {
  trackEvent('navigate', { section, param: param || '' });
  if (param) {
    window.location.hash = `${section}/${param}`;
  } else {
    window.location.hash = section === 'home' ? '' : section;
  }
}

function handleRoute() {
  // 清理前一个页面的资源（observer、定时器等）
  runCleanups();

  const hash = window.location.hash.slice(1) || 'home';
  const parts = hash.split('/');
  const section = parts[0] || 'home';
  const param = parts.slice(1).join('/') || null;

  closeSearch();

  // 切换区块
  $$('.section').forEach(s => s.classList.remove('active'));
  const target = $(`#section-${section}`);
  if (target) {
    target.classList.add('active');
  } else {
    $('#section-home').classList.add('active');
  }

  // 更新导航高亮
  $$('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });

  currentSection = section;

  // 渲染对应页面
  switch (section) {
    case 'home':      renderHome(); break;
    case 'jobs':      renderJobZone(param); break;
    case 'news':      renderNews(); break;
    case 'tools':     renderTools(); break;
    case 'models':    renderModels(); break;
    case 'tutorials':
      if (param && param.startsWith('tier:')) renderTutorials(param.replace('tier:', ''));
      else if (param && param.startsWith('column:')) renderColumnDetail(param.replace('column:', ''));
      else if (param) renderTutorialDetail(param);
      else renderTutorials();
      break;
    case 'prompts':   renderPrompts(); break;
    case 'resources': renderResourcesPage(); break;
    case 'path':      renderLearningPath(param); break;
    case 'diagnosis': renderDiagnosis(); break;
    default:          renderHome();
  }

  // 动态更新页面标题
  updatePageTitle(section, param);

  window.scrollTo({ top: 0, behavior: 'instant' });
}

const SITE_NAME = 'FiveSeven AI';
const SECTION_TITLES = {
  home: '',
  jobs: '岗位路径',
  news: 'AI Pulse',
  tools: '工具库',
  models: '模型库',
  tutorials: '实战指南',
  prompts: 'Prompt 库',
  resources: '资源库',
  path: '学习路径',
  diagnosis: 'AI 能力诊断'
};

function updatePageTitle(section, param) {
  let title = '';

  if (section === 'home' || !SECTION_TITLES[section]) {
    document.title = `${SITE_NAME} — 从好奇到从容的 AI 成长平台`;
    return;
  }

  // 详情页：尝试获取具体名称
  if (param) {
    if (section === 'tutorials' && !param.startsWith('tier:')) {
      const t = getTutorialById(param);
      if (t) title = t.title;
    } else if (section === 'jobs') {
      const j = getJobById(param);
      if (j) title = j.name;
    } else if (section === 'path' && typeof LEARNING_PATHS !== 'undefined') {
      const p = LEARNING_PATHS[param];
      if (p) title = p.title;
    }
  }

  if (title) {
    document.title = `${title} — ${SITE_NAME}`;
  } else {
    document.title = `${SECTION_TITLES[section]} — ${SITE_NAME}`;
  }
}


// ===== 首页 =====

function renderHome() {
  $('#homeContent').innerHTML = `
    ${renderProgressReminder()}
    ${renderHomeHero()}
    ${renderQuickStart()}
    ${renderHomeUpdates()}
    ${renderJobEntryCards()}
    ${renderPlatformValue()}
    ${renderHomeCTA()}
  `;
  setupHomeEvents();
  setTimeout(animateCounters, 300);
  // 滚动渐入
  $$('#homeContent .home-section').forEach((el, i) => {
    el.classList.add('animate-on-scroll');
    el.style.transitionDelay = `${i * 0.06}s`;
  });
  setupScrollAnimations();
}

function renderProgressReminder() {
  // 查找有进度的路径
  let activePath = null;
  let activeProgress = [];
  for (const [id, path] of Object.entries(LEARNING_PATHS)) {
    const progress = getLearningProgress(id);
    if (progress.length > 0 && progress.length < path.days.length) {
      activePath = path;
      activeProgress = progress;
      break;
    }
  }
  if (!activePath) return '';

  const total = activePath.days.length;
  const done = activeProgress.length;
  const pct = Math.round((done / total) * 100);
  const nextDay = activePath.days.find(d => !activeProgress.includes(d.day));

  // 回访检测
  const lastVisit = localStorage.getItem('fs-last-visit');
  const now = Date.now();
  localStorage.setItem('fs-last-visit', now);
  const daysSince = lastVisit ? Math.floor((now - parseInt(lastVisit)) / 86400000) : 0;
  const welcomeBack = daysSince >= 2 ? `<span class="pr-welcome">👋 欢迎回来，你的进度还在</span> ` : '';

  return `
    <div class="progress-reminder" onclick="navigate('path', '${activePath.id}')">
      <div class="pr-left">
        <span class="pr-icon">${activePath.icon}</span>
        <div class="pr-info">
          <div class="pr-title">${welcomeBack}${activePath.title} — Day ${done}/${total} 已完成</div>
          ${nextDay ? `<div class="pr-next">下一步：Day ${nextDay.day} · ${nextDay.theme}</div>` : ''}
        </div>
      </div>
      <div class="pr-right">
        <div class="pr-bar"><div class="pr-bar-fill" style="width:${pct}%"></div></div>
        <span class="pr-cta">继续学习 <i class="fa-solid fa-arrow-right"></i></span>
      </div>
    </div>
  `;
}

function renderHomeHero() {
  return `
    <div class="home-hero">
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>
      <div class="home-hero-content">
        <div class="hero-eyebrow"><span class="hero-eyebrow-dot"></span> 面向游戏行业 · 帮你找到 AI 学习方向</div>
        <h1 class="hero-title">从好奇出发，<br><span class="gradient-text">到从容驾驭</span></h1>
        <p class="hero-desc">${DATA.jobs.length} 大游戏岗位的专属 AI 学习路径<br>工具怎么选、怎么学、怎么用——都帮你理清楚了</p>
        <div class="hero-actions">
          <button class="btn-primary btn-glow" onclick="trackEvent('hero_cta_click',{target:'quick-start'}); document.querySelector('.quick-start-section').scrollIntoView({behavior:'smooth'})"><i class="fa-solid fa-play"></i> 找到我的起点</button>
          <button class="btn-secondary" onclick="navigate('jobs')"><i class="fa-solid fa-compass"></i> 按岗位探索</button>
        </div>
        <div class="hero-trust"><span class="pulse-dot"></span> 你知道 AI 很重要，但不确定从哪开始？这里帮你理清方向，一步步来</div>
      </div>
    </div>
  `;
}

function animateCounters() {
  let cancelled = false;
  $$('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1200;
    const startTime = performance.now();
    function update(now) {
      if (cancelled) return; // 路由切换时停止
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
  // 路由切换时取消所有动画帧
  registerCleanup(() => { cancelled = true; });
}

function renderJobEntryCards() {
  const cards = DATA.jobs.map(j => `
    <div class="job-entry-card" data-job="${j.id}" style="--jc:${j.color}">
      <div class="job-entry-icon">${j.icon}</div>
      <div class="job-entry-name">${j.name}</div>
      <div class="job-entry-desc">${j.tagline}</div>
    </div>
  `).join('');

  return `
    <div class="home-section">
      <div class="block-header"><h2>找到你的岗位 <span>你的路径已准备好</span></h2><p>选一个最接近的岗位，看看 AI 能怎么帮到你</p></div>
      <div class="job-entry-grid">${cards}</div>
    </div>
  `;
}

function renderPlatformValue() {
  const features = [
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      title: '围绕你的岗位',
      desc: '不用满世界找资料——工具、指南、Prompt 都按你的岗位整理好了，打开就能用',
      accent: 'var(--primary)',
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      title: '学了就能用',
      desc: '每篇指南都对应一个真实工作场景——不是"了解 AI"，而是"今天就能用 AI 做这件事"',
      accent: 'var(--secondary)',
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
      title: '一步步来就好',
      desc: '从复制一个 Prompt 开始，到独立完成一个 AI 工作流——每一步都不大，但每一步都算数',
      accent: 'var(--accent-pink)',
    },
  ];

  return `
    <div class="home-section">
      <div class="platform-value">
        <div class="block-header"><h2>不是让你学更多 <span>而是帮你少走弯路</span></h2><p>别人踩过的坑、试过的工具、验证过的方法——直接给你，省下摸索的时间</p></div>
        <div class="platform-value-grid">
          ${features.map(f => `
            <div class="value-card" style="--vc:${f.accent}">
              <div class="value-card-icon">${f.icon}</div>
              <div class="value-card-title">${f.title}</div>
              <div class="value-card-desc">${f.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}




function renderQuickStart() {
  const tiers = [
    { tier: 'beginner', icon: '🌱', title: '从来没用过 AI', desc: '大多数人都从这里开始。7 天，每天 30 分钟，比你想象的简单', accent: 'var(--primary)', cta: '从 Day 1 开始', action: "navigate('path', '7day-beginner')" },
    { tier: 'job-specific', icon: '🚀', title: '用过，但不太会用', desc: '围绕你的岗位场景，学会用 AI 真正提效', accent: 'var(--secondary)', cta: '找到我的岗位', action: "navigate('jobs')" },
    { tier: 'advanced', icon: '💡', title: '想更进一步', desc: '搭建 AI 工作流，让重复的事自动跑起来', accent: 'var(--accent-pink)', cta: '进入进阶路径', action: "navigate('path', '5day-advanced')" },
  ];

  const cards = tiers.map(t => {
    const tutorials = DATA.tutorials.filter(x => x.tier === t.tier);
    const firstPick = tutorials.find(x => x.editorPick) || tutorials[0];
    return `
      <div class="quick-start-card" style="--qs-accent:${t.accent}" onclick="trackEvent('quickstart_click',{tier:'${t.tier}'}); ${t.action}">
        <div class="qs-icon">${t.icon}</div>
        <div class="qs-title">${t.title}</div>
        <div class="qs-desc">${t.desc}</div>
        <div class="qs-stats"><strong>${tutorials.length}</strong> 篇教程</div>
        ${firstPick ? `<div class="qs-recommend"><i class="fa-solid fa-star" style="color:${t.accent};font-size:10px"></i> 推荐：${firstPick.title}</div>` : ''}
        <div class="qs-cta"><span>${t.cta}</span> <i class="fa-solid fa-arrow-right"></i></div>
      </div>
    `;
  }).join('');

  return `
    <div class="home-section quick-start-section">
      <div class="block-header"><h2>不知道从哪开始？ <span>选最接近你的状态</span></h2><p>很多人都是这样——知道该学，但不知道先学什么。选一个，我们帮你理出头绪</p></div>
      <div class="diag-cta-banner" onclick="trackEvent('diagnosis_click', {source:'homepage'}); navigate('diagnosis')">
        <div class="diag-cta-left">
          <span class="diag-cta-icon">🧭</span>
          <div>
            <div class="diag-cta-title">不确定从哪里开始？</div>
            <div class="diag-cta-desc">3 个问题，1 分钟，帮你找到最适合的第一步</div>
          </div>
        </div>
        <span class="diag-cta-action">帮我看看 <i class="fa-solid fa-arrow-right"></i></span>
      </div>
      <div class="quick-start-grid">${cards}</div>
    </div>
  `;
}

function renderHomeUpdates() {
  const updates = (DATA.updates || []).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  if (!updates.length) return '';

  const typeConfig = {
    'tool-analysis': { label: '工具测评', icon: 'fa-solid fa-wrench', color: 'var(--primary)' },
    'model-explain': { label: '模型解读', icon: 'fa-solid fa-microchip', color: 'var(--secondary)' },
    'case-study':    { label: '实战案例', icon: 'fa-solid fa-lightbulb', color: 'var(--accent-pink)' },
    'weekly-brief':  { label: 'AI 周报', icon: 'fa-solid fa-newspaper', color: '#f59e0b' },
  };

  const cards = updates.map(u => {
    const cfg = typeConfig[u.type] || typeConfig['weekly-brief'];
    const pathTags = (u.relatedPaths || []).map(pid => {
      const p = LEARNING_PATHS[pid];
      return p ? `<span class="upd-path-tag" onclick="event.stopPropagation(); navigate('path', '${pid}')">${p.icon} ${p.title}</span>` : '';
    }).filter(Boolean).join('');

    return `
      <div class="upd-card" onclick="toggleUpdateDetail(this)" data-upd-id="${u.id}">
        <div class="upd-card-header">
          <span class="upd-type-badge" style="--upd-color:${cfg.color}"><i class="${cfg.icon}"></i> ${cfg.label}</span>
          <span class="upd-date">${u.date}</span>
        </div>
        <div class="upd-card-title">${u.title}</div>
        <div class="upd-card-summary">${u.summary}</div>
        ${pathTags ? `<div class="upd-card-paths">${pathTags}</div>` : ''}
        <div class="upd-card-detail" style="display:none">${renderUpdateDetail(u)}</div>
        <div class="upd-card-expand"><i class="fa-solid fa-chevron-down"></i> 展开详情</div>
      </div>
    `;
  }).join('');

  return `
    <div class="home-section">
      <div class="block-header"><h2>AI 动态太多？ <span>帮你筛好了</span></h2><p>不需要什么都跟——我们帮你挑出真正和你工作相关的变化</p></div>
      <div class="upd-grid">${cards}</div>
    </div>
  `;
}

function renderUpdateDetail(u) {
  const c = u.content;
  if (!c) return '';
  switch (u.type) {
    case 'tool-analysis':
      return `
        <div class="upd-detail-section">
          <div class="upd-verdict"><i class="fa-solid fa-gavel"></i> <strong>结论：</strong>${c.verdict}</div>
          <div class="upd-proscons">
            <div class="upd-pros"><div class="upd-proscons-label">优势</div><ul>${(c.pros||[]).map(p => `<li><i class="fa-solid fa-plus"></i> ${p}</li>`).join('')}</ul></div>
            <div class="upd-cons"><div class="upd-proscons-label">不足</div><ul>${(c.cons||[]).map(p => `<li><i class="fa-solid fa-minus"></i> ${p}</li>`).join('')}</ul></div>
          </div>
          <div class="upd-meta-row"><strong>最适合：</strong>${c.bestFor}</div>
          <div class="upd-tip"><i class="fa-solid fa-lightbulb"></i> <strong>技巧：</strong>${c.tip}</div>
        </div>
      `;
    case 'model-explain':
      return `
        <div class="upd-detail-section">
          <div class="upd-meta-row"><i class="fa-solid fa-bolt"></i> <strong>主要变化：</strong>${c.whatChanged}</div>
          <div class="upd-meta-row"><i class="fa-solid fa-bullseye"></i> <strong>实际影响：</strong>${c.impact}</div>
          <div class="upd-tip"><i class="fa-solid fa-hand-point-right"></i> <strong>试试看：</strong>${c.tryThis}</div>
        </div>
      `;
    case 'case-study':
      return `
        <div class="upd-detail-section">
          <div class="upd-meta-row"><i class="fa-solid fa-flag"></i> <strong>场景：</strong>${c.scenario}</div>
          <div class="upd-before-after">
            <div class="upd-before"><div class="upd-ba-label">改造前</div><p>${c.before}</p></div>
            <div class="upd-after"><div class="upd-ba-label">改造后</div><p>${c.after}</p></div>
          </div>
          <div class="upd-lessons"><div class="upd-proscons-label">经验总结</div><ul>${(c.lessonsLearned||[]).map(l => `<li><i class="fa-solid fa-check"></i> ${l}</li>`).join('')}</ul></div>
        </div>
      `;
    case 'weekly-brief':
      return `
        <div class="upd-detail-section">
          <div class="upd-highlights"><div class="upd-proscons-label">本周要点</div><ul>${(c.highlights||[]).map(h => `<li><i class="fa-solid fa-star"></i> ${h}</li>`).join('')}</ul></div>
          ${c.toolUpdates?.length ? `<div class="upd-meta-row"><i class="fa-solid fa-wrench"></i> <strong>工具更新：</strong>${c.toolUpdates.join('、')}</div>` : ''}
          ${c.modelUpdates?.length ? `<div class="upd-meta-row"><i class="fa-solid fa-microchip"></i> <strong>模型更新：</strong>${c.modelUpdates.join('、')}</div>` : ''}
          <div class="upd-tip"><i class="fa-solid fa-hand-point-right"></i> <strong>本周行动：</strong>${c.oneAction}</div>
        </div>
      `;
    default: return '';
  }
}

function toggleUpdateDetail(card) {
  const detail = card.querySelector('.upd-card-detail');
  const expand = card.querySelector('.upd-card-expand');
  const isOpen = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : 'block';
  expand.innerHTML = isOpen
    ? '<i class="fa-solid fa-chevron-down"></i> 展开详情'
    : '<i class="fa-solid fa-chevron-up"></i> 收起';
  card.classList.toggle('upd-card-open', !isOpen);
  if (!isOpen) trackEvent('update_expand', { title: card.querySelector('.upd-card-title')?.textContent });
}

function renderHomeCTA() {
  return `
    <div class="home-section">
      <div class="home-cta">
        <div class="cta-badge">From Curious to Confident</div>
        <h2 class="home-cta-title">别等"准备好"，现在就是最好的时机</h2>
        <p class="home-cta-desc">每天 30 分钟，7 天后你会发现——原来 AI 没那么难</p>
        <div class="hero-actions">
          <button class="btn-primary btn-glow" onclick="navigate('path', '7day-beginner')"><i class="fa-solid fa-play"></i> 从 Day 1 开始</button>
          <button class="btn-secondary" onclick="navigate('jobs')"><i class="fa-solid fa-compass"></i> 按岗位探索</button>
        </div>
      </div>
    </div>
  `;
}

function setupHomeEvents() {
  // 事件委托 — 岗位卡片 + Tab 切换
  const container = $('#homeContent');
  if (container._clickHandler) container.removeEventListener('click', container._clickHandler);
  container._clickHandler = function(e) {
    // 岗位卡片
    const jobCard = e.target.closest('.job-entry-card');
    if (jobCard) { navigate('jobs', jobCard.dataset.job); return; }
    // Tab 切换
    const tabBtn = e.target.closest('#recTabs .tab-btn');
    if (tabBtn) {
      const tabNav = $('#recTabs');
      tabNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      $$('#recPanels .tab-panel').forEach(p => p.classList.toggle('active', p.dataset.tab === tabBtn.dataset.tab));
    }
  };
  container.addEventListener('click', container._clickHandler);
}


// ===== 岗位专区 =====

// 岗位数据缓存 — DATA 是静态的，按岗位预计算一次
let _jobDataCache = null;
function getJobDataCache() {
  if (_jobDataCache) return _jobDataCache;
  _jobDataCache = {};
  DATA.jobs.forEach(j => {
    _jobDataCache[j.id] = {
      tools: DATA.tools.filter(t => matchesJob(t.suitableJobs, j.id)),
      tutorials: DATA.tutorials.filter(t => matchesJob(t.targetJobs, j.id)),
      prompts: DATA.prompts.filter(p => matchesJob(p.targetJobs, j.id)),
      resources: DATA.resources.filter(r => matchesJob(r.relatedJobs, j.id)),
    };
  });
  return _jobDataCache;
}

function renderJobZone(jobId) {
  if (!jobId) { renderJobSelector(); return; }
  const job = getJobById(jobId);
  if (!job) { navigate('home'); return; }

  const cache = getJobDataCache()[job.id] || {};
  const jobTools = cache.tools || [];
  const jobTutorials = cache.tutorials || [];
  const jobPrompts = cache.prompts || [];
  const jobResources = cache.resources || [];

  $('#jobsContent').innerHTML = `
    ${renderJobZoneHeader(job)}
    ${renderCapabilityMap(job)}
    ${renderJobTools(jobTools)}
    ${renderJobScenarios(job)}
    ${renderJobTutorials(jobTutorials)}
    ${renderJobPrompts(jobPrompts)}
    ${renderJobCases()}
    ${renderJobResources(jobResources)}
  `;
  setupCopyButtons();
}

function renderJobSelector() {
  const cache = getJobDataCache();
  const cards = DATA.jobs.map(j => {
    const jc = cache[j.id] || {};
    const toolCount = (jc.tools || []).length;
    const tutCount = (jc.tutorials || []).length;
    const promptCount = (jc.prompts || []).length;
    return `
      <div class="job-selector-card" data-job="${j.id}" style="--jc:${j.color}">
        <div class="job-selector-icon">${j.icon}</div>
        <div class="job-selector-name">${j.name}</div>
        <div class="job-selector-tagline">${j.tagline}</div>
        <div class="job-selector-desc">${j.desc}</div>
        <div class="job-selector-stats">
          <span><i class="fa-solid fa-toolbox"></i> ${toolCount} 工具</span>
          <span><i class="fa-solid fa-graduation-cap"></i> ${tutCount} 教程</span>
          <span><i class="fa-solid fa-terminal"></i> ${promptCount} Prompt</span>
        </div>
        <div class="job-selector-arrow"><i class="fa-solid fa-arrow-right"></i> 看看 AI 怎么帮到我</div>
      </div>
    `;
  }).join('');

  $('#jobsContent').innerHTML = `
    <div class="section-header">
      <div>
        <h2><i class="fa-solid fa-briefcase" style="color:var(--primary)"></i> 岗位路径</h2>
        <p>选一个最接近你的岗位——不用自己找资料，工具、指南和 Prompt 都帮你理好了</p>
      </div>
    </div>
    <div class="job-selector-grid">${cards}</div>
  `;

  // 事件委托
  const container = $('#jobsContent');
  if (container._selectorHandler) container.removeEventListener('click', container._selectorHandler);
  container._selectorHandler = function(e) {
    const card = e.target.closest('.job-selector-card');
    if (card) navigate('jobs', card.dataset.job);
  };
  container.addEventListener('click', container._selectorHandler);
}

function renderJobZoneHeader(job) {
  const otherJobs = DATA.jobs.filter(j => j.id !== job.id);
  const quickNav = otherJobs.map(j => `<a href="#jobs/${j.id}" class="job-quick-link">${j.icon} ${j.name}</a>`).join('');
  const jc = getJobDataCache()[job.id] || {};
  const toolCount = (jc.tools || []).length;
  const tutCount = (jc.tutorials || []).length;
  const promptCount = (jc.prompts || []).length;
  const scenarioCount = job.scenarios.length;

  return `
    <div class="job-zone-header" style="--jc:${job.color}">
      <div class="job-zone-icon" style="background:${job.color}20">${job.icon}</div>
      <div class="job-zone-meta">
        <div class="job-zone-title">${job.name} · AI 成长路径</div>
        <div class="job-zone-desc">${job.desc}</div>
        <div class="job-zone-summary">
          <span class="job-zone-stat"><strong>${toolCount}</strong> 款工具</span>
          <span class="job-zone-stat-sep">·</span>
          <span class="job-zone-stat"><strong>${tutCount}</strong> 套教程</span>
          <span class="job-zone-stat-sep">·</span>
          <span class="job-zone-stat"><strong>${promptCount}</strong> 个Prompt</span>
          <span class="job-zone-stat-sep">·</span>
          <span class="job-zone-stat"><strong>${scenarioCount}</strong> 个场景</span>
        </div>
        <div class="job-zone-nav">
          <a href="#jobs" class="job-quick-link back"><i class="fa-solid fa-arrow-left"></i> 返回选择</a>
          ${quickNav}
        </div>
      </div>
    </div>
  `;
}

function renderCapabilityMap(job) {
  const items = job.capabilities.map(c => {
    const pct = Math.round((c.level / 3) * 100);
    const levelLabel = ['', '基础', '进阶', '高级'][c.level];
    return `
      <div class="capability-item">
        <div class="capability-info">
          <span class="capability-name">${c.name}</span>
          <span class="capability-level-label">${levelLabel}</span>
        </div>
        <div class="capability-bar">
          <div class="capability-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="job-section">
      <div class="block-header"><h2>AI 能帮你提升什么 <span>${job.name}</span></h2><p>不知道 AI 能帮你做什么？看看这些维度，可能比你想象的多</p></div>
      <div class="capability-map">${items}</div>
    </div>
  `;
}

function renderJobTools(tools) {
  if (!tools.length) return '';
  const cards = tools.map(t => renderToolDetailCard(t)).join('');
  return `
    <div class="job-section">
      <div class="block-header"><h2>适合你的工具 <span>筛好了</span></h2><p>工具太多不知道选哪个？这些都和你的岗位相关，直接上手就行</p></div>
      <div class="models-grid">${cards}</div>
    </div>
  `;
}

function renderJobScenarios(job) {
  const cards = job.scenarios.map((s, idx) => {
    const toolTags = s.tools.map(tid => {
      const t = getToolById(tid);
      return t ? `<span class="scenario-tool-tag">${t.icon} ${t.name}</span>` : '';
    }).join('');
    return `
      <div class="scenario-card">
        <div class="scenario-num">${String(idx + 1).padStart(2, '0')}</div>
        <div class="scenario-title">${s.title}</div>
        <div class="scenario-desc">${s.desc}</div>
        <div class="scenario-tools">${toolTags}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="job-section">
      <div class="block-header"><h2>这些场景 <span>AI 都能帮上忙</span></h2><p>不知道在工作中怎么用 AI？这些场景，可以直接参考</p></div>
      <div class="scenarios-grid">${cards}</div>
    </div>
  `;
}

function renderJobTutorials(tutorials) {
  if (!tutorials.length) return '';
  const cards = tutorials.map(t => `
    <div class="tutorial-card" onclick="navigate('tutorials')">
      <div class="tutorial-top">
        ${diffBadge(t.difficulty)}
        <span class="tutorial-duration"><i class="fa-regular fa-clock"></i> ${t.duration}</span>
      </div>
      <div class="tutorial-icon">${t.icon}</div>
      <div class="tutorial-title">${t.title}</div>
      <div class="tutorial-desc">${t.desc}</div>
    </div>
  `).join('');

  return `
    <div class="job-section">
      <div class="block-header"><h2>跟着做就行 <span>实战指南</span></h2><p>不用自己摸索——每篇都可以跟着操作，看完就能用在你的工作里</p></div>
      <div class="tutorials-grid">${cards}</div>
    </div>
  `;
}

function renderJobPrompts(prompts) {
  if (!prompts.length) return '';
  const cards = prompts.map(p => renderPromptCard(p)).join('');
  return `
    <div class="job-section">
      <div class="block-header"><h2>Prompt 模板 <span>改几个词就能用</span></h2><p>不知道怎么跟 AI 说话？直接复制，把关键词换成你的就行</p></div>
      <div class="prompts-grid">${cards}</div>
    </div>
  `;
}

function renderJobCases() {
  return `
    <div class="job-section">
      <div class="block-header"><h2>真实案例 <span>别人是怎么用的</span></h2><p>不确定 AI 到底能做什么？看看同岗位的人是怎么用起来的</p></div>
      <div class="coming-soon">
        <i class="fa-solid fa-flask"></i>
        <div>案例征集中</div>
        <p>如果你用 AI 做出了不错的成果，欢迎分享你的故事</p>
      </div>
    </div>
  `;
}

function renderJobResources(resources) {
  if (!resources.length) return '';
  const list = resources.map(r => {
    const cat = DATA.resourceCategories[r.category] || {};
    return `
      <div class="download-item">
        <div class="dl-icon" style="background:${cat.color}15;color:${cat.color}">${cat.icon || '📄'}</div>
        <div class="dl-info">
          <div class="dl-name">${r.name}</div>
          <div class="dl-desc">${r.desc}</div>
          <div class="dl-meta">
            ${r.tags.map(t => `<span class="dl-tag">${t}</span>`).join('')}
            <span class="dl-size">${r.format} · ${r.size}</span>
          </div>
        </div>
        <div class="dl-actions">${r.url && r.url !== '#' ? `<a href="${sanitizeUrl(r.url)}" target="_blank" rel="noopener noreferrer" class="dl-btn primary"><i class="fa-solid fa-download"></i> 下载</a>` : `<span class="dl-btn disabled" title="资源整理中，即将上线"><i class="fa-solid fa-clock"></i> 即将上线</span>`}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="job-section">
      <div class="block-header"><h2>拿去用 <span>学习资料</span></h2><p>模板、文档、参考资料——别人整理好的，省去你自己找的时间</p></div>
      <div class="download-list">${list}</div>
    </div>
  `;
}


// ===== AI快报 =====

function renderNews() {
  let currentFilter = 'must-read';
  let searchQuery = '';
  let currentPage = 1;
  let authorFilter = 'all';  // 博主筛选状态
  const PAGE_SIZE = 9;

  // 静态数据缓存 — 计算一次，render 内部直接引用
  const tabCounts = {
    'must-read': DATA.news.filter(n => n.isHot).length,
    'model-update': DATA.news.filter(n => n.category === 'model-update').length,
    'tools-workflow': DATA.news.filter(n => n.category === 'tools-workflow').length,
    'industry-product': DATA.news.filter(n => n.category === 'industry-product').length,
    'deep-insight': DATA.news.filter(n => n.category === 'deep-insight').length,
    'digest': (DATA.digests || []).length,
  };

  function getFilteredItems() {
    // 深度解读模式：使用 digests 数据
    if (currentFilter === 'digest') {
      let items = DATA.digests || [];
      // 按博主筛选
      if (authorFilter !== 'all') {
        items = items.filter(d => d.source_author === authorFilter);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        items = items.filter(d =>
          d.title.toLowerCase().includes(q) ||
          d.core_insight.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q) ||
          d.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
      return items;
    }

    let items = DATA.news;

    // "今日必看" = items with isHot flag, sorted by date
    if (currentFilter === 'must-read') {
      items = items.filter(n => n.isHot);
    } else {
      items = items.filter(n => n.category === currentFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(n =>
        n.title.toLowerCase().includes(q) ||
        (n.titleZh || '').toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        (n.summaryZh || '').toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort by date descending
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    return items;
  }

  function render() {
    const items = getFilteredItems();
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const pageItems = items.slice(startIdx, startIdx + PAGE_SIZE);

    // 根据当前 tab 选择不同渲染逻辑
    let contentAreaHtml = '';
    if (currentFilter === 'digest') {
      // 博主筛选 chips
      const allDigests = DATA.digests || [];
      const authorCounts = {};
      allDigests.forEach(d => { authorCounts[d.source_author] = (authorCounts[d.source_author] || 0) + 1; });

      let authorChipsHtml = `<div class="digest-author-filters">`;
      authorChipsHtml += `<button class="digest-author-chip ${authorFilter === 'all' ? 'active' : ''}" data-author="all">
        <span class="digest-author-chip-icon">📖</span>
        <div class="digest-author-chip-info">
          <span class="digest-author-chip-name">全部博主</span>
        </div>
        <span class="digest-author-chip-count">${allDigests.length}</span>
      </button>`;
      Object.entries(DATA.digestAuthors || {}).forEach(([id, a]) => {
        const count = authorCounts[id] || 0;
        if (count === 0) return;
        const isActive = authorFilter === id;
        authorChipsHtml += `<button class="digest-author-chip ${isActive ? 'active' : ''}" data-author="${id}" style="--chip-color:${a.color}">
          <span class="digest-author-chip-icon">${a.icon}</span>
          <div class="digest-author-chip-info">
            <span class="digest-author-chip-name">${a.name}</span>
            <span class="digest-author-chip-focus">${a.focus}</span>
          </div>
          <span class="digest-author-chip-count">${count}</span>
        </button>`;
      });
      authorChipsHtml += `</div>`;

      const listHtml = pageItems.length
        ? `<div class="digest-list">${pageItems.map(d => renderDigestCard(d)).join('')}</div>`
        : '<div class="empty-state"><i class="fa-solid fa-book-open"></i>暂无深度解读内容</div>';
      contentAreaHtml = authorChipsHtml + listHtml;
    } else {
      const featured = (currentPage === 1 && pageItems.length > 0) ? pageItems[0] : null;
      const gridItems = currentPage === 1 ? pageItems.slice(1) : pageItems;
      const featuredHtml = featured ? renderNewsFeaturedCard(featured) : '';
      const cardsHtml = gridItems.length ? gridItems.map(n => renderNewsCard(n)).join('') : '';
      const emptyHtml = (!featured && !gridItems.length) ? '<div class="empty-state"><i class="fa-solid fa-newspaper"></i>没有找到完全匹配的结果，试试换个筛选条件？</div>' : '';
      contentAreaHtml = `${featuredHtml}<div class="news-grid">${cardsHtml}</div>${emptyHtml}`;
    }

    // tabCounts 已缓存在 renderNews 作用域内

    const filterBtns = Object.entries(DATA.newsCategories).map(([k, v]) =>
      `<button class="news-tab ${currentFilter === k ? 'active' : ''}" data-filter="${k}">
        <span class="news-tab-label">${v}</span>
        <span class="news-tab-count">${tabCounts[k] || 0}</span>
      </button>`
    ).join('') + `<span class="news-tab-divider"></span><button class="news-tab digest-tab ${currentFilter === 'digest' ? 'active' : ''}" data-filter="digest"><span class="news-tab-label">📖 深度解读</span><span class="news-tab-count">${tabCounts['digest'] || 0}</span></button>`;

    // Pagination
    const activeTabLabel = currentFilter === 'digest' ? '深度解读' : (DATA.newsCategories[currentFilter] || currentFilter);
    const paginationHtml = totalPages > 1 ? renderNewsPagination(currentPage, totalPages, items.length, activeTabLabel) : '';

    const isDigest = currentFilter === 'digest';
    $('#newsContent').innerHTML = `
      ${renderPageHeader({
        icon: isDigest ? 'fa-solid fa-book-open' : 'fa-solid fa-bolt',
        iconColor: isDigest ? 'var(--primary)' : 'var(--accent-orange)',
        title: isDigest ? '深度解读' : 'AI Pulse',
        desc: isDigest
          ? '全球顶级思想家的最新洞察，为游戏行业量身解读——不只是翻译，而是「这和我有什么关系」'
          : 'AI 每天都有新东西，但不是每个都值得你看——这里只推值得关注的',
        stats: isDigest ? [
          { value: (DATA.digests || []).length, label: '篇解读', icon: 'fa-solid fa-book-open' },
          { value: Object.keys(DATA.digestAuthors || {}).length, label: '位博主', icon: 'fa-solid fa-pen-nib' },
        ] : [
          { value: DATA.news.length, label: '条动态', icon: 'fa-solid fa-newspaper' },
          { value: tabCounts['must-read'], label: '条必看', icon: 'fa-solid fa-fire' },
        ]
      })}
      <div class="news-controls">
        <div class="news-tabs" id="newsFilters">${filterBtns}</div>
        <div class="search-wrap sm">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="newsSearch" placeholder="${isDigest ? '搜索深度解读…' : '搜索动态…'}" value="${escapeAttr(searchQuery)}" autocomplete="off" />
        </div>
      </div>
      ${contentAreaHtml}
      ${paginationHtml}
    `;
  }

  // 事件委托 — 替代 render 内部的所有 addEventListener
  const container = $('#newsContent');
  if (container._clickHandler) container.removeEventListener('click', container._clickHandler);
  container._clickHandler = function(e) {
    // Tab 切换
    const tabBtn = e.target.closest('#newsFilters .news-tab');
    if (tabBtn) {
      currentFilter = tabBtn.dataset.filter;
      currentPage = 1;
      authorFilter = 'all';
      render();
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // 分页
    const pageBtn = e.target.closest('.news-page-btn');
    if (pageBtn) {
      const page = parseInt(pageBtn.dataset.page);
      if (page && page !== currentPage) {
        currentPage = page;
        render();
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    // 博主筛选 chips
    const authorChip = e.target.closest('.digest-author-chip');
    if (authorChip) {
      authorFilter = authorChip.dataset.author;
      currentPage = 1;
      render();
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // 博主名链接
    const authorLink = e.target.closest('.digest-author-link');
    if (authorLink) {
      e.stopPropagation();
      authorFilter = authorLink.dataset.author;
      currentPage = 1;
      render();
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // 新闻卡片整体点击 → 跳转原文
    const card = e.target.closest('.news-card');
    if (card && !e.target.closest('a')) {
      const id = card.dataset.id;
      const item = DATA.news.find(n => n.id === id);
      if (item && item.url) {
        window.open(sanitizeUrl(item.url), '_blank', 'noopener,noreferrer');
      }
      return;
    }
  };
  container.addEventListener('click', container._clickHandler);

  // 搜索输入（input 事件委托）
  if (container._inputHandler) container.removeEventListener('input', container._inputHandler);
  const debouncedSearch = debounce(e => {
    if (e.target.id === 'newsSearch') {
      searchQuery = e.target.value;
      currentPage = 1;
      render();
    }
  }, 300);
  container._inputHandler = debouncedSearch;
  container.addEventListener('input', container._inputHandler);

  render();
}

function renderDigestCard(d) {
  const author = DATA.digestAuthors?.[d.source_author] || {};
  const valueType = DATA.digestValueTypes?.[d.value_type] || {};

  // 作者头部（可点击触发博主筛选）
  const focusHtml = author.focus ? `<span class="digest-author-focus">${author.focus}</span>` : '';
  const authorHtml = `
    <div class="digest-author-bar">
      <a class="digest-author-link" data-author="${d.source_author}" title="查看 ${author.name || d.source_author} 的所有解读">
        <span class="digest-author-icon" style="--author-color:${author.color || '#69EACB'}">${author.icon || '📝'}</span>
        <div class="digest-author-info">
          <span class="digest-author-name">${author.name || d.source_author}</span>
          <span class="digest-author-sep">·</span>
          <span class="digest-author-platform">${author.platform || ''}</span>
        </div>
        ${focusHtml}
      </a>
      <span class="digest-value-badge" style="--badge-color:${valueType.color || '#69EACB'}">${valueType.icon || '💡'} ${d.value_type}</span>
    </div>`;

  // 角色场景
  const scenariosHtml = (d.gaming_relevance?.scenarios || []).map(s =>
    `<div class="digest-scenario">
      <span class="digest-scenario-role">${s.role}</span>
      <span class="digest-scenario-text">${s.insight}</span>
    </div>`
  ).join('');

  // 行动建议
  const actionsHtml = (d.action_items || []).map(a =>
    `<div class="digest-action-item"><i class="fa-solid fa-circle-check"></i> ${a}</div>`
  ).join('');

  // 适用岗位标签
  const fitChips = (d.fit_for || []).map(r => `<span class="digest-fit-chip">${r}</span>`).join('');

  // 话题标签
  const tagsHtml = (d.tags || []).map(t => `<span class="digest-tag">${t}</span>`).join('');

  // 学习路径链接
  let pathLink = '';
  if (d.recommended_path && typeof LEARNING_PATHS !== 'undefined' && LEARNING_PATHS[d.recommended_path]) {
    const lp = LEARNING_PATHS[d.recommended_path];
    pathLink = `<button class="digest-path-link" onclick="navigate('path','${lp.id}')"><i class="fa-solid fa-route"></i> ${lp.title}</button>`;
  }

  return `
    <div class="digest-card" data-id="${d.id}">
      ${authorHtml}
      <div class="digest-title">${d.title}</div>
      <div class="digest-core-insight"><i class="fa-solid fa-bolt"></i> ${d.core_insight}</div>
      <div class="digest-hook">${d.gaming_relevance?.hook || ''}</div>
      <div class="digest-analysis">${d.gaming_relevance?.analysis || ''}</div>
      ${scenariosHtml ? `<div class="digest-scenarios"><div class="digest-section-label"><i class="fa-solid fa-gamepad"></i> 游戏行业场景</div>${scenariosHtml}</div>` : ''}
      ${actionsHtml ? `<div class="digest-actions"><div class="digest-section-label"><i class="fa-solid fa-list-check"></i> 本周行动</div>${actionsHtml}</div>` : ''}
      <div class="digest-footer">
        <div class="digest-meta">${fitChips}${tagsHtml}</div>
        <div class="digest-footer-right">
          <span class="digest-read-time"><i class="fa-regular fa-clock"></i> ${d.read_time}</span>
          ${pathLink}
          <a href="${sanitizeUrl(d.source_url)}" target="_blank" rel="noopener noreferrer" class="digest-source-link">原文 <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>
      </div>
    </div>
  `;
}

function renderNewsFeaturedCard(n) {
  const catColors = {
    'model-update': { bg: 'rgba(167,139,250,0.15)', color: '#A78BFA', icon: '🧠' },
    'tools-workflow': { bg: 'rgba(105,234,203,0.15)', color: '#69EACB', icon: '🛠️' },
    'industry-product': { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', icon: '🏢' },
    'deep-insight': { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', icon: '💡' },
  };
  const cc = catColors[n.category] || { bg: 'rgba(105,234,203,0.15)', color: '#69EACB', icon: '📰' };
  const catLabel = DATA.newsCategories[n.category] || n.category;
  const summary = (n.summaryZh || n.summary || '').substring(0, 200);

  // Editor note (editorial judgment)
  const editorNote = n.editor_note ? `<div class="news-editor-note"><i class="fa-solid fa-bullseye"></i> 看点：${n.editor_note}</div>` : '';

  // Why it matters
  const whyLine = n.why_it_matters ? `<div class="news-why-matters"><i class="fa-solid fa-lightbulb"></i> 值得看：${n.why_it_matters}</div>` : '';

  // Fit for roles
  const fitChips = (n.fit_for || []).length ? `<div class="news-fit-for"><i class="fa-solid fa-user"></i> ${n.fit_for.map(r => `<span class="news-fit-chip">${r}</span>`).join('')}</div>` : '';

  // Recommended learning path
  let pathLink = '';
  if (n.recommended_path && typeof LEARNING_PATHS !== 'undefined' && LEARNING_PATHS[n.recommended_path]) {
    const lp = LEARNING_PATHS[n.recommended_path];
    pathLink = `<button class="news-path-link" onclick="navigate('path','${lp.id}')"><i class="fa-solid fa-route"></i> 适合路径：${lp.title}</button>`;
  }

  return `
    <div class="news-featured" style="--feat-color:${cc.color}">
      <div class="news-featured-badge">
        <span class="news-featured-icon">${cc.icon}</span>
        <span>今日最值得关注</span>
      </div>
      <div class="news-featured-body">
        <div class="news-featured-meta">
          <span class="news-category" style="--cat-bg:${cc.bg};--cat-color:${cc.color}">${catLabel}</span>
          <span class="news-date">${n.date}</span>
          <span class="news-source">${n.source}</span>
        </div>
        <div class="news-featured-title">${n.titleZh || n.title}</div>
        ${n.titleZh ? `<div class="news-featured-title-en">${n.title}</div>` : ''}
        ${editorNote}
        <div class="news-featured-summary">${summary}</div>
        <div class="news-featured-signals">
          ${whyLine}
          ${fitChips}
        </div>
        <div class="news-featured-footer">
          <div class="news-tags">${(n.tags || []).map(t => `<span class="news-tag">${t}</span>`).join('')}</div>
          <div class="news-featured-actions">
            ${pathLink}
            <a href="${sanitizeUrl(n.url)}" target="_blank" rel="noopener noreferrer" class="news-link">阅读全文 <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderNewsPagination(current, total, itemCount, tabLabel) {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  if (start > 1) {
    pages.push(`<button class="news-page-btn" data-page="1">1</button>`);
    if (start > 2) pages.push(`<span class="news-page-dots">…</span>`);
  }

  for (let i = start; i <= end; i++) {
    pages.push(`<button class="news-page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`);
  }

  if (end < total) {
    if (end < total - 1) pages.push(`<span class="news-page-dots">…</span>`);
    pages.push(`<button class="news-page-btn" data-page="${total}">${total}</button>`);
  }

  // Context-rich range info
  const PAGE_SIZE = 9;
  const rangeStart = (current - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(current * PAGE_SIZE, itemCount);

  return `
    <div class="news-pagination-wrap">
      <div class="news-pagination-context">
        <span class="news-pagination-label">${tabLabel} · 第 ${current} / ${total} 页</span>
        <span class="news-pagination-range">显示第 ${rangeStart}-${rangeEnd} 条，共 ${itemCount} 条</span>
      </div>
      <div class="news-pagination">
        <button class="news-page-btn news-page-prev" data-page="${Math.max(1, current - 1)}" ${current <= 1 ? 'disabled' : ''}>
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="news-page-numbers">${pages.join('')}</div>
        <button class="news-page-btn news-page-next" data-page="${Math.min(total, current + 1)}" ${current >= total ? 'disabled' : ''}>
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `;
}


// ===== AI工具库 =====

function renderTools() {
  let catFilter = 'all';
  let jobFilter = 'all';

  function render() {
    let items = DATA.tools;
    if (catFilter !== 'all') items = items.filter(t => t.category === catFilter);
    if (jobFilter !== 'all') items = items.filter(t => matchesJob(t.suitableJobs, jobFilter));

    const cards = items.length ? items.map(t => renderToolDetailCard(t)).join('') : '<div class="empty-state"><i class="fa-solid fa-toolbox"></i>没有找到完全匹配的结果，试试换个筛选条件？</div>';
    const catBtns = Object.entries(DATA.toolCategories).map(([k, v]) =>
      `<button class="filter-btn ${catFilter === k ? 'active' : ''}" data-filter="${k}">${v}</button>`
    ).join('');
    const jobBtns = `<button class="filter-btn ${jobFilter === 'all' ? 'active' : ''}" data-filter="all">全部岗位</button>` +
      DATA.jobs.map(j => `<button class="filter-btn ${jobFilter === j.id ? 'active' : ''}" data-filter="${j.id}">${j.name}</button>`).join('');

    $('#toolsContent').innerHTML = `
      <div class="tools-page-wrapper">
        <div class="tools-page-glow"></div>
        ${renderPageHeader({
          icon: 'fa-solid fa-toolbox',
          iconColor: 'var(--primary)',
          title: '工具库',
          desc: '不用一个个去试——这些工具都按岗位筛过了，找到适合你的，直接上手',
          stats: [
            { value: items.length + '/' + DATA.tools.length, label: '款工具' },
            { value: Object.keys(DATA.toolCategories).length - 1, label: '个类别' },
          ]
        })}
        <div class="filter-group"><div class="filter-label"><i class="fa-solid fa-layer-group" style="opacity:0.5"></i> 工具类型</div><div class="filter-bar" id="toolCatFilter">${catBtns}</div></div>
        <div class="filter-group"><div class="filter-label"><i class="fa-solid fa-user-tie" style="opacity:0.5"></i> 适用岗位</div><div class="filter-bar" id="toolJobFilter">${jobBtns}</div></div>
        <div class="models-grid">${cards}</div>
      </div>
    `;
  }

  // 事件委托
  const container = $('#toolsContent');
  if (container._clickHandler) container.removeEventListener('click', container._clickHandler);
  container._clickHandler = function(e) {
    const catBtn = e.target.closest('#toolCatFilter .filter-btn');
    if (catBtn) { catFilter = catBtn.dataset.filter; render(); return; }
    const jobBtn = e.target.closest('#toolJobFilter .filter-btn');
    if (jobBtn) { jobFilter = jobBtn.dataset.filter; render(); return; }
  };
  container.addEventListener('click', container._clickHandler);

  render();
}


// ===== AI模型库（新页面） =====

function renderModels() {
  let typeFilter = 'all';
  let capFilter = 'all';

  function render() {
    let items = DATA.models;
    if (typeFilter !== 'all') items = items.filter(m => m.type === typeFilter);
    if (capFilter !== 'all') items = items.filter(m => m.capabilities.includes(capFilter));

    // 特色模型置顶
    items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    const cards = items.length ? items.map(m => renderModelCard(m)).join('') : '<div class="empty-state"><i class="fa-solid fa-robot"></i>没有找到完全匹配的结果，试试换个筛选条件？</div>';

    const typeBtns = Object.entries(DATA.modelTypes).map(([k, v]) =>
      `<button class="filter-btn ${typeFilter === k ? 'active' : ''}" data-filter="${k}">${v}</button>`
    ).join('');
    const capBtns = Object.entries(DATA.modelCapabilities).map(([k, v]) =>
      `<button class="filter-btn ${capFilter === k ? 'active' : ''}" data-filter="${k}">${v}</button>`
    ).join('');

    $('#modelsContent').innerHTML = `
      ${renderPageHeader({
        icon: 'fa-solid fa-robot',
        iconColor: 'var(--secondary)',
        title: '模型库',
        desc: 'ChatGPT、Claude、Gemini……到底该用哪个？这里帮你看清差异，选对模型',
        stats: [
          { value: items.length, label: '个模型', icon: 'fa-solid fa-microchip' },
          { value: DATA.models.filter(m => m.featured).length, label: '个推荐', icon: 'fa-solid fa-star' },
        ]
      })}
      <div class="filter-group"><div class="filter-label">模型类型：</div><div class="filter-bar" id="modelTypeFilter">${typeBtns}</div></div>
      <div class="filter-group"><div class="filter-label">核心能力：</div><div class="filter-bar" id="modelCapFilter">${capBtns}</div></div>
      <div class="models-grid">${cards}</div>
    `;
  }

  // 事件委托
  const container = $('#modelsContent');
  if (container._clickHandler) container.removeEventListener('click', container._clickHandler);
  container._clickHandler = function(e) {
    const typeBtn = e.target.closest('#modelTypeFilter .filter-btn');
    if (typeBtn) { typeFilter = typeBtn.dataset.filter; render(); return; }
    const capBtn = e.target.closest('#modelCapFilter .filter-btn');
    if (capBtn) { capFilter = capBtn.dataset.filter; render(); return; }
  };
  container.addEventListener('click', container._clickHandler);

  render();
}

function renderModelCard(m) {
  const typeLabel = DATA.modelTypes[m.type] || m.type;
  const capTags = m.capabilities.map(c => {
    const label = DATA.modelCapabilities[c] || c;
    return `<span class="badge badge-primary">${label}</span>`;
  }).join('');
  const bestTags = m.bestFor.map(b => `<span class="badge badge-purple">${b}</span>`).join('');

  return `
    <div class="model-card ${m.featured ? 'card-featured' : ''}" data-id="${m.id}">
      <div class="model-card-header">
        <span style="font-size:28px">${m.icon}</span>
        <div style="flex:1">
          <div class="model-card-vendor">${m.vendor}</div>
          <div class="model-card-name">${m.name} <span class="badge badge-primary" style="margin-left:6px;font-size:10px">${typeLabel}</span></div>
        </div>
        ${m.featured ? '<span class="badge badge-hot">🔥 推荐</span>' : ''}
      </div>
      <div class="model-card-desc">${m.desc}</div>
      <div class="model-card-caps">${capTags}</div>
      <div class="model-card-meta">
        <div class="model-meta-item"><span class="model-meta-label">上下文</span><span class="model-meta-value">${m.contextWindow}</span></div>
        <div class="model-meta-item"><span class="model-meta-label">定价</span><span class="model-meta-value">${m.pricing}</span></div>
        <div class="model-meta-item"><span class="model-meta-label">速度</span><span class="model-meta-value">${m.speed}</span></div>
      </div>
      <div class="model-card-best">${bestTags}</div>
    </div>
  `;
}


// ===== AI教程 =====

const TUTORIAL_INTENTS = [
  { key: 'quick-start', icon: '🚀', label: '不知道怎么开始', tiers: ['beginner'], desc: '没关系，从这里开始就对了' },
  { key: 'boost-efficiency', icon: '⚡', label: '让工作更快一些', tiers: ['job-specific'], desc: '直接解决你手头的工作问题' },
  { key: 'solve-task', icon: '🎯', label: '搞定一个具体任务', tiers: ['job-specific', 'intermediate'], desc: '写文案、做分析、出方案……找到对应的指南' },
  { key: 'advanced-flow', icon: '🔗', label: '我想更进一步', tiers: ['advanced'], desc: '搭工作流，让 AI 帮你做更多' }
];

function renderTutorialCard(t) {
  const solvesHtml = t.solves ? `<div class="tutorial-solves"><i class="fa-solid fa-crosshairs"></i> ${t.solves}</div>` : '';
  const outcomeHtml = t.outcome ? `<div class="tutorial-outcome"><i class="fa-solid fa-trophy"></i> ${t.outcome}</div>` : '';
  const fitHtml = t.fitLevel ? `<div class="tutorial-fit"><i class="fa-solid fa-user-check"></i> ${t.fitLevel}</div>` : '';
  return `
    <div class="tutorial-card" onclick="navigate('tutorials','${t.id}')" style="cursor:pointer">
      <div class="tutorial-top">
        ${diffBadge(t.difficulty)}
        <span class="tutorial-duration"><i class="fa-regular fa-clock"></i> ${t.duration}</span>
      </div>
      <div class="tutorial-icon">${t.icon}</div>
      <div class="tutorial-title">${t.title}</div>
      ${solvesHtml}
      ${outcomeHtml}
      <div class="tutorial-desc">${t.desc}</div>
      <div class="tutorial-footer">
        <div class="tutorial-meta">
          ${fitHtml}
        </div>
        <span class="tutorial-jobs">${(t.fitRoles && t.fitRoles.length) ? t.fitRoles.join('、') : (t.targetJobs.includes('all') ? '全岗位' : t.targetJobs.map(id => { const j = getJobById(id); return j ? j.name : ''; }).filter(Boolean).join('、'))}</span>
      </div>
    </div>
  `;
}

function renderTutorials(initialTier) {
  let tierFilter = initialTier || 'all';
  let jobFilter = 'all';
  let intentFilter = null;

  function render() {
    let items = DATA.tutorials;
    if (intentFilter) {
      const intent = TUTORIAL_INTENTS.find(i => i.key === intentFilter);
      if (intent) items = items.filter(t => intent.tiers.includes(t.tier));
    } else if (tierFilter !== 'all') {
      items = items.filter(t => t.tier === tierFilter);
    }
    if (jobFilter !== 'all') items = items.filter(t => matchesJob(t.targetJobs, jobFilter));

    const cards = items.length ? items.map(t => renderTutorialCard(t)).join('') : '<div class="empty-state"><i class="fa-solid fa-graduation-cap"></i>没有找到完全匹配的结果，试试换个筛选条件？</div>';

    // 意图导航
    const intentNavHtml = TUTORIAL_INTENTS.map(i => `
      <button class="tut-intent-btn ${intentFilter === i.key ? 'active' : ''}" data-intent="${i.key}">
        <span class="tut-intent-icon">${i.icon}</span>
        <span>${i.label}</span>
      </button>
    `).join('');

    // 推荐起点（仅在全部筛选下且无意图筛选时显示）
    const showRecommend = tierFilter === 'all' && !intentFilter && jobFilter === 'all';
    const beginnerPicks = DATA.tutorials.filter(t => t.tier === 'beginner' && t.editorPick).slice(0, 3);
    const recommendHtml = showRecommend && beginnerPicks.length ? `
      <div class="tut-recommend-section">
        <div class="tut-recommend-header">
          <span style="font-size:18px">⭐</span>
          <span class="tut-recommend-title">不知道先看哪篇？从这里开始</span>
          <span class="tut-recommend-subtitle">— 零基础也能跟着做，30 分钟就有收获</span>
        </div>
        <div class="tut-recommend-grid">${beginnerPicks.map(t => renderTutorialCard(t)).join('')}</div>
      </div>
    ` : '';

    const tierBtns = Object.entries(DATA.tutorialTiers).map(([k, v]) =>
      `<button class="filter-btn ${tierFilter === k && !intentFilter ? 'active' : ''}" data-filter="${k}">${v}</button>`
    ).join('');
    const jobBtns = `<button class="filter-btn ${jobFilter === 'all' ? 'active' : ''}" data-filter="all">全部岗位</button>` +
      DATA.jobs.map(j => `<button class="filter-btn ${jobFilter === j.id ? 'active' : ''}" data-filter="${j.id}">${j.name}</button>`).join('');

    // 专栏推荐区
    const columnsHtml = (DATA.columns && DATA.columns.length && tierFilter === 'all' && !intentFilter && jobFilter === 'all') ? renderColumnsShowcase() : '';

    $('#tutorialsContent').innerHTML = `
      ${renderPageHeader({
        icon: 'fa-solid fa-graduation-cap',
        iconColor: 'var(--primary)',
        title: '实战指南',
        desc: '不知道怎么开始用 AI？每篇指南都对应一个具体任务——跟着做就行',
        stats: [
          { value: DATA.tutorials.length, label: '篇指南', icon: 'fa-solid fa-book-open' },
          { value: DATA.jobs.length, label: '个岗位覆盖', icon: 'fa-solid fa-briefcase' },
        ]
      })}
      ${columnsHtml}
      <div class="tut-intent-nav" id="tutIntentNav">${intentNavHtml}</div>
      ${recommendHtml}
      <div class="filter-group"><div class="filter-label">教程级别：</div><div class="filter-bar" id="tutTierFilter">${tierBtns}</div></div>
      <div class="filter-group"><div class="filter-label">适用岗位：</div><div class="filter-bar" id="tutJobFilter">${jobBtns}</div></div>
      <div class="tutorials-grid">${cards}</div>
    `;
  }

  // 事件委托
  const container = $('#tutorialsContent');
  if (container._clickHandler) container.removeEventListener('click', container._clickHandler);
  container._clickHandler = function(e) {
    const intentBtn = e.target.closest('#tutIntentNav .tut-intent-btn');
    if (intentBtn) {
      const key = intentBtn.dataset.intent;
      if (intentFilter === key) { intentFilter = null; tierFilter = 'all'; }
      else { intentFilter = key; tierFilter = 'all'; }
      render(); return;
    }
    const tierBtn = e.target.closest('#tutTierFilter .filter-btn');
    if (tierBtn) { tierFilter = tierBtn.dataset.filter; intentFilter = null; render(); return; }
    const jobBtn = e.target.closest('#tutJobFilter .filter-btn');
    if (jobBtn) { jobFilter = jobBtn.dataset.filter; render(); return; }
  };
  container.addEventListener('click', container._clickHandler);

  render();
}


// ===== 专栏系统 =====

function getColumnById(id) {
  return (DATA.columns || []).find(c => c.id === id);
}

function getColumnForTutorial(tutId) {
  const tut = getTutorialById(tutId);
  if (tut && tut.columnId) return getColumnById(tut.columnId);
  return null;
}

function getColumnTutorials(column) {
  if (!column) return [];
  const allIds = column.learningPath.flatMap(p => p.tutorialIds);
  return allIds.map(id => {
    const t = getTutorialById(id);
    return t || { id, title: id, desc: '', icon: '📄', difficulty: 'beginner', duration: '—', _placeholder: true };
  });
}

function renderColumnsShowcase() {
  const cols = (DATA.columns || []).filter(c => c.featured);
  if (!cols.length) return '';
  return `
    <div class="columns-showcase">
      <div class="columns-showcase-title"><i class="fa-solid fa-layer-group"></i> 深度学习专栏</div>
      <div class="columns-showcase-grid">
        ${cols.map(c => {
          const publishedCount = c.learningPath.flatMap(p => p.tutorialIds).filter(id => getTutorialById(id) && !getTutorialById(id)._placeholder).length;
          const statusBadge = c.status === 'active'
            ? '<span class="column-card-badge active">连载中</span>'
            : '<span class="column-card-badge coming-soon">即将上线</span>';
          return `
            <div class="column-showcase-card" style="background:${c.gradient ? c.gradient.replace('100%)', '100%) 0.04') : 'var(--surface)'}; --col-color:${c.color}" onclick="navigate('tutorials','column:${c.id}')">
              <div class="column-card-header">
                <span class="column-card-icon">${c.icon}</span>
                <div>
                  <div class="column-card-title">${c.title}</div>
                  <div class="column-card-subtitle">${c.subtitle}</div>
                </div>
              </div>
              <div class="column-card-desc">${c.desc}</div>
              <div class="column-card-stats">
                ${statusBadge}
                <span><i class="fa-solid fa-book-open"></i> ${publishedCount}/${c.totalTutorials} 篇</span>
                <span><i class="fa-solid fa-layer-group"></i> ${c.learningPath.length} 个阶段</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderColumnDetail(columnId) {
  const col = getColumnById(columnId);
  if (!col) { renderTutorials(); return; }

  const phaseColors = {
    'beginner': { bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.15)' },
    'intermediate': { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: 'rgba(245,158,11,0.15)' },
    'advanced': { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.15)' },
    'expert': { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA', border: 'rgba(167,139,250,0.2)' }
  };

  const allTutIds = col.learningPath.flatMap(p => p.tutorialIds);
  const publishedCount = allTutIds.filter(id => { const t = getTutorialById(id); return t && !t._placeholder; }).length;

  const phasesHtml = col.learningPath.map(phase => {
    const pc = phaseColors[phase.difficulty] || phaseColors.beginner;
    const diffLabel = (DATA.difficultyMap[phase.difficulty] || { label: phase.difficulty }).label;
    const tutsHtml = phase.tutorialIds.map(id => {
      const t = getTutorialById(id);
      if (t) {
        return `
          <div class="column-tut-item" onclick="navigate('tutorials','${t.id}')">
            <span class="column-tut-item-icon">${t.icon}</span>
            <div class="column-tut-item-info">
              <div class="column-tut-item-title">${t.title}</div>
              <div class="column-tut-item-desc">${t.solves || t.desc}</div>
            </div>
            <div class="column-tut-item-meta">
              ${diffBadge(t.difficulty)}
              <span class="column-tut-item-duration"><i class="fa-regular fa-clock"></i> ${t.duration}</span>
              <i class="fa-solid fa-chevron-right column-tut-item-arrow"></i>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="column-tut-item coming-soon">
            <span class="column-tut-item-icon">📄</span>
            <div class="column-tut-item-info">
              <div class="column-tut-item-title">${id}</div>
              <div class="column-tut-item-desc">内容制作中，敬请期待</div>
            </div>
            <div class="column-tut-item-meta">
              <span class="column-card-badge coming-soon">即将上线</span>
            </div>
          </div>
        `;
      }
    }).join('');
    return `
      <div class="column-phase">
        <div class="column-phase-header">
          <div class="column-phase-dot" style="background:${pc.color}"></div>
          <span class="column-phase-title">${phase.phase}</span>
          <span class="column-phase-badge" style="background:${pc.bg};color:${pc.color};border:1px solid ${pc.border}">${diffLabel}</span>
        </div>
        <div class="column-phase-desc">${phase.desc}</div>
        <div class="column-phase-tutorials">${tutsHtml}</div>
      </div>
    `;
  }).join('');

  $('#tutorialsContent').innerHTML = `
    <button class="back-btn" onclick="navigate('tutorials')"><i class="fa-solid fa-arrow-left"></i> 返回全部指南</button>
    <div class="column-detail">
      <div class="column-detail-hero" style="background:${col.gradient ? col.gradient.replace('100%)', '100%) 0.03') : 'var(--surface)'}">
        <div class="column-hero-top">
          <span class="column-hero-icon">${col.icon}</span>
          <div class="column-hero-info">
            <div class="column-hero-title">${col.title}</div>
            <div class="column-hero-subtitle">${col.subtitle}</div>
          </div>
        </div>
        <div class="column-hero-desc">${col.desc}</div>
        <div class="column-hero-stats">
          <span class="column-hero-stat"><i class="fa-solid fa-book-open"></i> <strong>${publishedCount}</strong>/${col.totalTutorials} 篇已发布</span>
          <span class="column-hero-stat"><i class="fa-solid fa-layer-group"></i> <strong>${col.learningPath.length}</strong> 个学习阶段</span>
          <span class="column-hero-stat"><i class="fa-solid fa-users"></i> ${col.targetJobs.includes('all') ? '全岗位适用' : col.targetJobs.join('、')}</span>
        </div>
      </div>
      <div class="column-phases">
        ${phasesHtml}
      </div>
    </div>
  `;
}


function renderTutorialDetail(tutId) {
  const t = DATA.tutorials.find(x => x.id === tutId);
  if (!t) { renderTutorials(); return; }

  const steps = t.content || [];
  const jobNames = t.targetJobs.includes('all') ? '全岗位适用' : t.targetJobs.map(id => { const j = getJobById(id); return j ? j.name : ''; }).filter(Boolean).join('、');

  const stepsHTML = steps.length ? steps.map((s, i) => `
    <div class="tut-step">
      <div class="tut-step-num">${i + 1}</div>
      <div class="tut-step-body">
        <h3 class="tut-step-title">${s.title}</h3>
        <div class="tut-step-text">${s.body}</div>
        ${s.tip ? `<div class="tut-step-tip"><i class="fa-solid fa-lightbulb"></i> <strong>小贴士：</strong>${s.tip}</div>` : ''}
        ${s.example ? `<div class="tut-step-example"><div class="tut-example-label"><i class="fa-solid fa-code"></i> 示例</div><pre>${s.example}</pre></div>` : ''}
      </div>
    </div>
  `).join('') : '<div class="empty-state"><i class="fa-solid fa-hammer"></i> 教程内容正在制作中，敬请期待…</div>';

  // 详情页增强信息
  const valueTagsHtml = (t.solves || t.outcome || t.fitLevel) ? `
    <div class="tut-detail-value-tags">
      ${t.solves ? `<div class="tut-detail-value-item"><span class="tut-detail-value-label"><i class="fa-solid fa-crosshairs"></i> 解决问题：</span><span class="tut-detail-value-text">${t.solves}</span></div>` : ''}
      ${t.outcome ? `<div class="tut-detail-value-item"><span class="tut-detail-value-label"><i class="fa-solid fa-trophy"></i> 学完产出：</span><span class="tut-detail-value-text">${t.outcome}</span></div>` : ''}
      ${t.fitLevel ? `<div class="tut-detail-value-item"><span class="tut-detail-value-label"><i class="fa-solid fa-user-check"></i> 适合：</span><span class="tut-detail-value-text">${t.fitLevel}</span></div>` : ''}
    </div>
  ` : '';

  const pathTagHtml = t.relatedPath ? `<span class="tut-detail-path-tag"><i class="fa-solid fa-route"></i> ${t.relatedPath}</span>` : '';

  // 下一步推荐
  const nextGuides = (t.nextGuides || []).map(id => DATA.tutorials.find(x => x.id === id)).filter(Boolean);
  const nextHtml = nextGuides.length ? `
    <div class="tut-next-section">
      <div class="tut-next-title"><i class="fa-solid fa-arrow-right"></i> 学完这篇，下一步可以看</div>
      <div class="tut-next-grid">
        ${nextGuides.map(n => `
          <div class="tut-next-card" onclick="navigate('tutorials','${n.id}')">
            <div class="tut-next-card-title">${n.icon} ${n.title}</div>
            <div class="tut-next-card-desc">${n.solves || n.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // 检查该教程是否属于某学习路径
  const pathInfo = findPathByTutorial(tutId);
  let pathActionsHTML = '';
  if (pathInfo) {
    const progress = getLearningProgress(pathInfo.pathId);
    const isDayDone = progress.includes(pathInfo.day);
    pathActionsHTML = `
      <div class="tutorial-path-actions">
        <button class="btn-primary ${isDayDone ? 'btn-done' : ''}" onclick="if(!getLearningProgress('${pathInfo.pathId}').includes(${pathInfo.day})){toggleDayComplete('${pathInfo.pathId}',${pathInfo.day})}; navigate('path','${pathInfo.pathId}')">
          <i class="fa-solid fa-${isDayDone ? 'check-circle' : 'check'}"></i> ${isDayDone ? '已完成 · 返回路径' : '完成本课并返回'}
        </button>
        <button class="btn-secondary" onclick="navigate('path','${pathInfo.pathId}')">
          <i class="fa-solid fa-arrow-left"></i> 返回学习路径
        </button>
      </div>
    `;
  }

  // 专栏面包屑和上下篇导航
  const column = getColumnForTutorial(tutId);
  let columnBreadcrumbHtml = '';
  let columnNavHtml = '';
  if (column) {
    const allColTutIds = column.learningPath.flatMap(p => p.tutorialIds);
    const currentIdx = allColTutIds.indexOf(tutId);
    columnBreadcrumbHtml = `
      <div class="column-breadcrumb">
        <a href="#tutorials" onclick="event.preventDefault();navigate('tutorials')">实战指南</a>
        <span class="sep"><i class="fa-solid fa-chevron-right"></i></span>
        <a href="#tutorials/column:${column.id}" onclick="event.preventDefault();navigate('tutorials','column:${column.id}')">${column.icon} ${column.title}</a>
        <span class="sep"><i class="fa-solid fa-chevron-right"></i></span>
        <span>${t.title}</span>
      </div>
    `;
    const prevId = currentIdx > 0 ? allColTutIds[currentIdx - 1] : null;
    const nextId = currentIdx < allColTutIds.length - 1 ? allColTutIds[currentIdx + 1] : null;
    const prevTut = prevId ? getTutorialById(prevId) : null;
    const nextTut = nextId ? getTutorialById(nextId) : null;
    columnNavHtml = `
      <div class="column-nav-bar">
        ${prevTut ? `<div class="column-nav-item prev" onclick="navigate('tutorials','${prevTut.id}')"><div class="column-nav-label"><i class="fa-solid fa-arrow-left"></i> 上一篇</div><div class="column-nav-title">${prevTut.icon} ${prevTut.title}</div></div>` : '<div class="column-nav-item placeholder"></div>'}
        ${nextTut ? `<div class="column-nav-item next" onclick="navigate('tutorials','${nextTut.id}')"><div class="column-nav-label">下一篇 <i class="fa-solid fa-arrow-right"></i></div><div class="column-nav-title">${nextTut.icon} ${nextTut.title}</div></div>` : '<div class="column-nav-item placeholder"></div>'}
      </div>
    `;
  }

  const backTarget = column
    ? `navigate('tutorials','column:${column.id}')`
    : (pathInfo ? `navigate('path','${pathInfo.pathId}')` : `navigate('tutorials')`);
  const backLabel = column
    ? `返回「${column.title}」`
    : (pathInfo ? `返回「${pathInfo.path.title}」` : '返回全部指南');

  $('#tutorialsContent').innerHTML = `
    ${columnBreadcrumbHtml}
    <button class="back-btn" onclick="${backTarget}"><i class="fa-solid fa-arrow-left"></i> ${backLabel}</button>
    <div class="tut-detail-header">
      <div class="tut-detail-icon">${t.icon}</div>
      <div class="tut-detail-meta">
        <h1 class="tut-detail-title">${t.title}</h1>
        <p class="tut-detail-desc">${t.desc}</p>
        ${valueTagsHtml}
        <div class="tut-detail-tags">
          ${diffBadge(t.difficulty)}
          <span class="tut-tag"><i class="fa-regular fa-clock"></i> ${t.duration}</span>
          <span class="tut-tag"><i class="fa-solid fa-list-ol"></i> ${steps.length} 个步骤</span>
          <span class="tut-tag"><i class="fa-solid fa-users"></i> ${jobNames}</span>
        </div>
        ${pathTagHtml}
      </div>
    </div>
    <div class="tut-steps-list">
      ${stepsHTML}
    </div>
    ${pathActionsHTML}
    ${columnNavHtml}
    ${nextHtml}
  `;
}


// ===== Prompt库 =====

function renderPrompts() {
  let jobFilter = 'all';
  let scenarioFilter = 'all';
  const scenarios = [...new Set(DATA.prompts.map(p => p.scenario))];

  function render() {
    let items = DATA.prompts;
    if (jobFilter !== 'all') items = items.filter(p => matchesJob(p.targetJobs, jobFilter));
    if (scenarioFilter !== 'all') items = items.filter(p => p.scenario === scenarioFilter);

    const cards = items.length ? items.map(p => renderPromptCard(p)).join('') : '<div class="empty-state"><i class="fa-solid fa-terminal"></i>没有找到完全匹配的结果，试试换个筛选条件？</div>';

    const jobBtns = `<button class="filter-btn ${jobFilter === 'all' ? 'active' : ''}" data-filter="all">全部岗位</button>` +
      DATA.jobs.map(j => `<button class="filter-btn ${jobFilter === j.id ? 'active' : ''}" data-filter="${j.id}">${j.name}</button>`).join('');
    const scenarioBtns = `<button class="filter-btn ${scenarioFilter === 'all' ? 'active' : ''}" data-filter="all">全部场景</button>` +
      scenarios.map(s => `<button class="filter-btn ${scenarioFilter === s ? 'active' : ''}" data-filter="${s}">${s}</button>`).join('');

    $('#promptsContent').innerHTML = `
      ${renderPageHeader({
        icon: 'fa-solid fa-terminal',
        iconColor: 'var(--accent-green)',
        title: 'Prompt 库',
        desc: '不知道怎么跟 AI 说？直接复制这些 Prompt，改几个关键词就能用',
        stats: [
          { value: items.length, label: '个Prompt', icon: 'fa-solid fa-code' },
          { value: scenarios.length, label: '个场景', icon: 'fa-solid fa-tags' },
        ]
      })}
      <div class="filter-group"><div class="filter-label">按岗位：</div><div class="filter-bar" id="promptJobFilter">${jobBtns}</div></div>
      <div class="filter-group"><div class="filter-label">按场景：</div><div class="filter-bar" id="promptScenarioFilter">${scenarioBtns}</div></div>
      <div class="prompts-grid">${cards}</div>
    `;
  }

  // 事件委托
  const container = $('#promptsContent');
  if (container._clickHandler) container.removeEventListener('click', container._clickHandler);
  container._clickHandler = function(e) {
    const jobBtn = e.target.closest('#promptJobFilter .filter-btn');
    if (jobBtn) { jobFilter = jobBtn.dataset.filter; render(); return; }
    const scenarioBtn = e.target.closest('#promptScenarioFilter .filter-btn');
    if (scenarioBtn) { scenarioFilter = scenarioBtn.dataset.filter; render(); return; }
  };
  container.addEventListener('click', container._clickHandler);

  render();
}


// ===== 资源下载独立页面 =====

function renderResourcesPage() {
  let catFilter = 'all';
  let jobFilter = 'all';

  function render() {
    let items = DATA.resources;
    if (catFilter !== 'all') items = items.filter(r => r.category === catFilter);
    if (jobFilter !== 'all') items = items.filter(r => matchesJob(r.relatedJobs, jobFilter));

    const list = items.length ? items.map(r => {
      const cat = DATA.resourceCategories[r.category] || {};
      return `
        <div class="download-item" data-id="${r.id}">
          <div class="dl-icon" style="background:${cat.color}15;color:${cat.color}">${cat.icon || '📄'}</div>
          <div class="dl-info">
            <div class="dl-name">${r.name}</div>
            <div class="dl-desc">${r.desc}</div>
            <div class="dl-meta">
              ${r.tags.map(t => `<span class="dl-tag">${t}</span>`).join('')}
              <span class="dl-size">${r.format} · ${r.size}</span>
            </div>
          </div>
          <div class="dl-actions">
            ${r.url && r.url !== '#' ? `<a href="${sanitizeUrl(r.url)}" target="_blank" rel="noopener noreferrer" class="dl-btn primary"><i class="fa-solid fa-download"></i> 下载</a>` : `<span class="dl-btn disabled" title="资源整理中，即将上线"><i class="fa-solid fa-clock"></i> 即将上线</span>`}
          </div>
        </div>
      `;
    }).join('') : '<div class="empty-state"><i class="fa-solid fa-download"></i>没有找到完全匹配的结果，试试换个筛选条件？</div>';

    const catBtns = `<button class="filter-btn ${catFilter === 'all' ? 'active' : ''}" data-filter="all">全部</button>` +
      Object.entries(DATA.resourceCategories).map(([k, v]) =>
        `<button class="filter-btn ${catFilter === k ? 'active' : ''}" data-filter="${k}">${v.label}</button>`
      ).join('');
    const jobBtns = `<button class="filter-btn ${jobFilter === 'all' ? 'active' : ''}" data-filter="all">全部岗位</button>` +
      DATA.jobs.map(j => `<button class="filter-btn ${jobFilter === j.id ? 'active' : ''}" data-filter="${j.id}">${j.name}</button>`).join('');

    const availableCount = items.filter(r => r.url && r.url !== '#').length;
    const comingCount = items.filter(r => !r.url || r.url === '#').length;

    $('#resourcesContent').innerHTML = `
      ${renderPageHeader({
        icon: 'fa-solid fa-download',
        iconColor: 'var(--accent-blue)',
        title: '资源库',
        desc: '模板、素材、参考资料——别人整理好的东西，拿去直接用',
        stats: [
          { value: availableCount, label: '个可下载', icon: 'fa-solid fa-file-zipper' },
          { value: comingCount, label: '个筹备中', icon: 'fa-solid fa-clock' },
        ]
      })}
      <div class="filter-group"><div class="filter-label">资源分类：</div><div class="filter-bar" id="resCatFilter">${catBtns}</div></div>
      <div class="filter-group"><div class="filter-label">相关岗位：</div><div class="filter-bar" id="resJobFilter">${jobBtns}</div></div>
      <div class="download-list">${list}</div>
    `;
  }

  // 事件委托 — 单个监听器，不会累积
  const container = $('#resourcesContent');
  if (container._clickHandler) container.removeEventListener('click', container._clickHandler);
  container._clickHandler = function(e) {
    const catBtn = e.target.closest('#resCatFilter .filter-btn');
    if (catBtn) { catFilter = catBtn.dataset.filter; render(); return; }
    const jobBtn = e.target.closest('#resJobFilter .filter-btn');
    if (jobBtn) { jobFilter = jobBtn.dataset.filter; render(); return; }
  };
  container.addEventListener('click', container._clickHandler);

  render();
}


// ===== 标准化页头组件 =====

function renderPageHeader(config) {
  const { icon, iconColor, title, desc, stats } = config;
  const statsHtml = stats ? `
    <div class="page-header-stats">
      ${stats.map(s => `<span class="page-stat">${s.icon ? `<i class="${s.icon}"></i>` : ''} <strong>${s.value}</strong> ${s.label}</span>`).join('<span class="page-stat-sep">·</span>')}
    </div>
  ` : '';
  return `
    <div class="page-header">
      <h2><i class="${icon}" style="color:${iconColor}"></i> ${title}</h2>
      <p>${desc}</p>
      ${statsHtml}
    </div>
  `;
}

// ===== 共享卡片组件 =====

function renderNewsCard(n) {
  const catColors = {
    'model-update': { bg: 'rgba(167,139,250,0.15)', color: '#A78BFA', icon: '🧠' },
    'tools-workflow': { bg: 'rgba(105,234,203,0.15)', color: '#69EACB', icon: '🛠️' },
    'industry-product': { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', icon: '🏢' },
    'deep-insight': { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', icon: '💡' },
  };
  const cc = catColors[n.category] || { bg: 'rgba(105,234,203,0.15)', color: '#69EACB', icon: '📰' };
  const catLabel = DATA.newsCategories[n.category] || n.category;
  const summary = (n.summaryZh || n.summary || '').substring(0, 100);

  // Lightweight "why it matters" line
  const whyLine = n.why_it_matters ? `<div class="news-card-why">${n.why_it_matters}</div>` : '';

  // Fit-for role chips (max 2, skip "全员" on cards for brevity)
  const fitRoles = (n.fit_for || []).filter(r => r !== '全员').slice(0, 2);
  const fitHtml = fitRoles.length ? fitRoles.map(r => `<span class="news-fit-chip-sm">${r}</span>`).join('') : '';

  return `
    <div class="news-card" data-id="${n.id}" style="--cat-color:${cc.color}">
      <div class="news-card-top">
        <span class="news-category" style="--cat-bg:${cc.bg};--cat-color:${cc.color}">${cc.icon} ${catLabel}</span>
        <span class="news-date">${n.date}</span>
      </div>
      <div class="news-title">${n.titleZh || n.title}</div>
      ${whyLine}
      <div class="news-desc">${summary}</div>
      <div class="news-card-bottom">
        <div class="news-card-chips">${fitHtml}${(n.tags || []).slice(0, fitRoles.length ? 1 : 2).map(t => `<span class="news-tag">${t}</span>`).join('')}</div>
        <div class="news-card-meta">
          <span class="news-source">${n.source}</span>
          <a href="${sanitizeUrl(n.url)}" target="_blank" rel="noopener noreferrer" class="news-link" onclick="event.stopPropagation()"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>
      </div>
    </div>
  `;
}

function renderToolDetailCard(tool) {
  const tags = jobTagsHtml(tool.suitableJobs);
  const diff = DATA.difficultyMap[tool.difficulty] || { label: tool.difficulty, cssClass: 'beginner' };
  const favs = getFavorites();
  const isFav = favs.includes(tool.id);
  const icon = getToolIcon(tool.id);
  const catLabel = DATA.toolCategories[tool.category] || tool.category;

  return `
    <div class="tool-detail-card" data-id="${tool.id}" style="--tool-glow:${tool.color}25;--tool-color:${tool.color}">
      <button class="fav-btn ${isFav ? 'favorited' : ''}" onclick="event.stopPropagation();toggleFavorite('${tool.id}',this)" title="${isFav ? '取消收藏' : '收藏'}"><i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i></button>
      <div class="tool-detail-header">
        <div class="tool-icon-container">${icon}</div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
            <div class="tool-detail-name">${tool.name}</div>
            <span class="tool-category-badge">${catLabel}</span>
          </div>
          <div class="job-tags">${tags}</div>
        </div>
        <span class="difficulty ${diff.cssClass}">${diff.label}</span>
      </div>
      <div class="tool-detail-desc">${tool.desc}</div>
      <div class="tool-detail-meta">
        <div class="tool-meta-item"><span class="tool-meta-label">定价</span><span class="tool-meta-value">${tool.pricing}</span></div>
        <div class="tool-meta-item"><span class="tool-meta-label">擅长解决</span><span class="tool-meta-value">${tool.problemsSolved.join('、')}</span></div>
      </div>
      <div class="tool-actions">
        <a href="${tool.officialUrl}" target="_blank" rel="noopener noreferrer" class="dl-btn primary"><i class="fa-solid fa-arrow-up-right-from-square"></i> 访问官网</a>
        ${tool.tutorialId ? `<a href="#tutorials" class="dl-btn secondary" onclick="setTimeout(()=>navigate('tutorials'),10)"><i class="fa-solid fa-graduation-cap"></i> 查看教程</a>` : ''}
      </div>
    </div>
  `;
}

function renderPromptCard(p) {
  const tags = jobTagsHtml(p.targetJobs);
  const highlightedPrompt = escapeHtml(p.prompt).replace(/\{([^}]+)\}/g, '<span class="prompt-variable">{$1}</span>');
  return `
    <div class="prompt-card" data-id="${p.id}">
      <div class="prompt-header">
        <h3 class="prompt-name">${p.name}</h3>
        <div class="prompt-scenario-tag">${p.scenario}</div>
      </div>
      <div class="prompt-tags">${tags}</div>
      ${p.recommendedModel ? `<div class="prompt-model-badge"><i class="fa-solid fa-robot"></i> 推荐模型：${p.recommendedModel}</div>` : ''}
      <div class="prompt-content">
        <pre><code>${highlightedPrompt}</code></pre>
        <button class="copy-btn" data-copy="${escapeAttr(p.prompt)}"><i class="fa-solid fa-copy"></i> 复制</button>
      </div>
      ${p.example ? `<div class="prompt-example"><strong>💡 使用示例：</strong>${escapeHtml(p.example)}</div>` : ''}
      ${p.notes ? `<div class="prompt-notes"><i class="fa-solid fa-circle-info"></i> ${p.notes}</div>` : ''}
    </div>
  `;
}

function renderPromptCardCompact(p) {
  const tags = jobTagsHtml(p.targetJobs);
  return `
    <div class="prompt-card">
      <div class="prompt-header">
        <h3 class="prompt-name">${p.name}</h3>
        <div class="prompt-scenario-tag">${p.scenario}</div>
      </div>
      <div class="prompt-tags">${tags}</div>
      <div class="prompt-content">
        <pre><code>${escapeHtml(p.prompt.length > 200 ? p.prompt.slice(0, 200) + '...' : p.prompt)}</code></pre>
        <button class="copy-btn" data-copy="${escapeAttr(p.prompt)}"><i class="fa-solid fa-copy"></i> 复制</button>
      </div>
    </div>
  `;
}


// ===== 复制按钮（事件委托，绑定一次，永不累积） =====

function setupCopyButtonsDelegation() {
  if (document.body._copyHandler) return; // 已绑定
  document.body._copyHandler = function(e) {
    const btn = e.target.closest('.copy-btn, .copy-btn-mini');
    if (!btn) return;
    e.stopPropagation();
    const text = btn.dataset.copy;
    copyToClipboard(text);
    trackEvent('copy', { textLength: text?.length || 0 });
    btn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-copy"></i> 复制';
      btn.classList.remove('copied');
    }, 2000);
  };
  document.body.addEventListener('click', document.body._copyHandler);
}

// 兼容旧调用点（不再重复绑定）
function setupCopyButtons() { /* noop — delegation handles it */ }


// ===== 全局搜索（智能导航中枢） =====

function setupGlobalSearch() {
  const input = $('#globalSearch');
  const overlay = $('#searchOverlay');
  const resultsContainer = $('#searchResults');
  if (!input) return;

  // 搜索状态
  let activeFilter = 'all';
  let activeIdx = -1;
  let flatResults = [];

  // 类型配置
  const TYPE_CONFIG = {
    path:     { label: '学习路径', icon: '🗺️', weight: 1.5, filterLabel: '找路径' },
    tutorial: { label: '实战指南', icon: '📚', weight: 1.4, filterLabel: '找教程' },
    tool:     { label: '工具',     icon: '🛠',  weight: 1.3, filterLabel: '找工具' },
    model:    { label: '模型',     icon: '🤖', weight: 1.2, filterLabel: '找模型' },
    job:      { label: '岗位',     icon: '💼', weight: 1.1, filterLabel: '找岗位' },
    prompt:   { label: 'Prompt',   icon: '📝', weight: 1.0, filterLabel: '找Prompt' },
    resource: { label: '资源',     icon: '📦', weight: 1.0, filterLabel: '找资源' },
    news:     { label: 'AI Pulse', icon: '📰', weight: 0.9, filterLabel: '找快报' },
    digest:   { label: '深度解读', icon: '📖', weight: 1.3, filterLabel: '找解读' },
  };

  // 热门搜索词
  const HOT_KEYWORDS = ['ChatGPT', 'Midjourney', 'Prompt技巧', '做海报', 'Claude', 'AI写文案', 'Suno', '视频生成'];

  // 构建学习路径教程 ID 集合
  function getPathTutorialIds() {
    const ids = new Set();
    if (typeof LEARNING_PATHS === 'undefined') return ids;
    Object.values(LEARNING_PATHS).forEach(p => {
      p.days.forEach(d => ids.add(d.tutorialId));
    });
    return ids;
  }

  // ===== 评分搜索 =====
  function scoreSearch(q) {
    const results = [];
    const ql = q.toLowerCase();
    const pathTutorialIds = getPathTutorialIds();

    // 搜索学习路径
    if (typeof LEARNING_PATHS !== 'undefined') {
      Object.values(LEARNING_PATHS).forEach(p => {
        let score = 0;
        if (p.title.toLowerCase().includes(ql)) score = p.title.toLowerCase() === ql ? 100 : 80;
        else if (p.desc.toLowerCase().includes(ql)) score = 40;
        else if (p.difficulty.toLowerCase().includes(ql)) score = 30;
        if (score > 0) {
          const tags = [];
          if (p.tier === 'beginner') tags.push({ text: '适合入门', cls: 'tag-green' });
          results.push({
            type: 'path', icon: p.icon, title: p.title,
            desc: `${p.difficulty} · ${p.estimatedDaily}/天 · ${p.days.length}天`,
            score, tags,
            action: () => navigate('path', p.id)
          });
        }
      });
    }

    // 搜索工具
    DATA.tools.forEach(t => {
      let score = 0;
      if (t.name.toLowerCase() === ql) score = 100;
      else if (t.name.toLowerCase().includes(ql)) score = 80;
      else if (t.problemsSolved.some(p => p.toLowerCase().includes(ql))) score = 60;
      else if (t.desc.toLowerCase().includes(ql)) score = 40;
      if (score > 0) {
        const tags = [];
        if (t.editorPick) { tags.push({ text: '编辑精选', cls: 'tag-primary' }); score += 20; }
        if (t.difficulty === 'easy') tags.push({ text: '适合入门', cls: 'tag-green' });
        results.push({
          type: 'tool', icon: t.icon, title: t.name,
          desc: t.desc.slice(0, 60),
          score, tags,
          action: () => { navigate('tools'); scrollToCard('tool', t.id); }
        });
      }
    });

    // 搜索模型
    DATA.models.forEach(m => {
      let score = 0;
      if (m.name.toLowerCase() === ql) score = 100;
      else if (m.name.toLowerCase().includes(ql)) score = 80;
      else if (m.vendor.toLowerCase().includes(ql)) score = 60;
      else if (m.bestFor.some(b => b.toLowerCase().includes(ql))) score = 60;
      else if (m.desc.toLowerCase().includes(ql)) score = 40;
      if (score > 0) {
        const tags = [];
        if (m.featured) { tags.push({ text: '热门', cls: 'tag-orange' }); score += 15; }
        results.push({
          type: 'model', icon: m.icon, title: m.name,
          desc: `${m.vendor} · ${m.desc.slice(0, 40)}`,
          score, tags,
          action: () => { navigate('models'); scrollToCard('model', m.id); }
        });
      }
    });

    // 搜索教程
    DATA.tutorials.forEach(t => {
      let score = 0;
      if (t.title.toLowerCase() === ql) score = 100;
      else if (t.title.toLowerCase().includes(ql)) score = 80;
      else if (t.desc.toLowerCase().includes(ql)) score = 40;
      if (score > 0) {
        const tags = [];
        if (t.editorPick) { tags.push({ text: '编辑精选', cls: 'tag-primary' }); score += 20; }
        if (pathTutorialIds.has(t.id)) { tags.push({ text: '学习路径', cls: 'tag-purple' }); score += 15; }
        if (t.difficulty === 'beginner') tags.push({ text: '适合入门', cls: 'tag-green' });
        const meta = [t.duration, DATA.difficultyMap?.[t.difficulty]?.label || t.difficulty].filter(Boolean).join(' · ');
        results.push({
          type: 'tutorial', icon: t.icon, title: t.title,
          desc: meta,
          score, tags,
          action: () => navigate('tutorials', t.id)
        });
      }
    });

    // 搜索 Prompt
    DATA.prompts.forEach(p => {
      let score = 0;
      if (p.name.toLowerCase() === ql) score = 100;
      else if (p.name.toLowerCase().includes(ql)) score = 80;
      else if (p.scenario.toLowerCase().includes(ql)) score = 60;
      else if (p.prompt.toLowerCase().includes(ql)) score = 20;
      if (score > 0) {
        const tags = [{ text: '可直接使用', cls: 'tag-blue' }];
        results.push({
          type: 'prompt', icon: '📝', title: p.name,
          desc: `${p.scenario} · 推荐用 ${p.recommendedModel || 'AI'}`,
          score, tags,
          action: () => { navigate('prompts'); scrollToCard('prompt', p.id); }
        });
      }
    });

    // 搜索快报
    DATA.news.forEach(n => {
      let score = 0;
      const title = n.titleZh || n.title;
      const summary = n.summaryZh || n.summary;
      if (title.toLowerCase().includes(ql)) score = 80;
      else if (summary.toLowerCase().includes(ql)) score = 40;
      else if (n.tags.some(t => t.toLowerCase().includes(ql))) score = 60;
      if (score > 0) {
        const tags = [];
        if (n.isHot) { tags.push({ text: '最新', cls: 'tag-red' }); score += 10; }
        results.push({
          type: 'news', icon: '📰', title,
          desc: summary.slice(0, 60),
          score, tags,
          action: () => { navigate('news'); scrollToCard('news', n.id); }
        });
      }
    });

    // 搜索深度解读
    (DATA.digests || []).forEach(d => {
      let score = 0;
      if (d.title.toLowerCase().includes(ql)) score = 80;
      else if (d.core_insight.toLowerCase().includes(ql)) score = 70;
      else if (d.summary.toLowerCase().includes(ql)) score = 50;
      else if ((d.gaming_relevance?.hook || '').toLowerCase().includes(ql)) score = 50;
      else if (d.tags.some(t => t.toLowerCase().includes(ql))) score = 60;
      else if ((d.fit_for || []).some(r => r.toLowerCase().includes(ql))) score = 40;
      if (score > 0) {
        const author = DATA.digestAuthors?.[d.source_author] || {};
        const tags = [];
        const vt = DATA.digestValueTypes?.[d.value_type];
        if (vt) tags.push({ text: d.value_type, cls: 'tag-purple' });
        results.push({
          type: 'digest', icon: '📖', title: d.title,
          desc: d.core_insight.slice(0, 60),
          score, tags,
          action: () => { navigate('news'); setTimeout(() => { const tabEl = document.querySelector('.digest-tab'); if (tabEl) tabEl.click(); setTimeout(() => scrollToCard('digest', d.id), 200); }, 100); }
        });
      }
    });

    // 搜索岗位
    DATA.jobs.forEach(j => {
      let score = 0;
      if (j.name.toLowerCase().includes(ql)) score = 80;
      else if (j.tagline.toLowerCase().includes(ql)) score = 60;
      else if (j.desc.toLowerCase().includes(ql)) score = 40;
      if (score > 0) {
        results.push({
          type: 'job', icon: j.icon, title: j.name + ' 专区',
          desc: j.tagline,
          score, tags: [],
          action: () => navigate('jobs', j.id)
        });
      }
    });

    // 搜索资源
    DATA.resources.forEach(r => {
      let score = 0;
      if (r.name.toLowerCase().includes(ql)) score = 80;
      else if (r.desc.toLowerCase().includes(ql)) score = 40;
      else if (r.tags.some(t => t.toLowerCase().includes(ql))) score = 60;
      if (score > 0) {
        const tags = [];
        if (r.url && r.url !== '#') tags.push({ text: '可下载', cls: 'tag-green' });
        results.push({
          type: 'resource', icon: '📦', title: r.name,
          desc: r.desc.slice(0, 60),
          score, tags,
          action: () => { navigate('resources'); scrollToCard('resource', r.id); }
        });
      }
    });

    // 计算最终得分 = matchScore × typeWeight + qualityBonus (已内联)
    results.forEach(r => {
      r.finalScore = r.score * (TYPE_CONFIG[r.type]?.weight || 1);
    });

    // 按分数排序
    results.sort((a, b) => b.finalScore - a.finalScore);

    return results;
  }

  // ===== 渲染过滤条 =====
  function renderFilterBar(results) {
    const typeCounts = {};
    results.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });

    let html = '<div class="search-filters"><button class="search-filter-btn active" data-filter="all">全部</button>';
    Object.entries(TYPE_CONFIG).forEach(([type, cfg]) => {
      if (typeCounts[type]) {
        html += `<button class="search-filter-btn" data-filter="${type}">${cfg.filterLabel}</button>`;
      }
    });
    html += '</div>';
    return html;
  }

  // ===== 渲染分组结果 =====
  function renderGroupedResults(results, q) {
    const filtered = activeFilter === 'all' ? results : results.filter(r => r.type === activeFilter);
    if (filtered.length === 0) {
      return `<div class="search-empty">
        <div class="search-empty-icon">🔍</div>
        <div>没有找到「<strong>${escapeHtml(q)}</strong>」相关的内容</div>
        <div class="search-empty-hint">试试其他关键词，或浏览 <a href="#tools" class="search-link" data-nav="tools">工具库</a> · <a href="#tutorials" class="search-link" data-nav="tutorials">实战指南</a> · <a href="#prompts" class="search-link" data-nav="prompts">Prompt 库</a></div>
      </div>`;
    }

    // 按类型分组，保持组内排序
    const groups = {};
    const typeOrder = ['path', 'tutorial', 'tool', 'model', 'digest', 'job', 'prompt', 'resource', 'news'];
    filtered.forEach(r => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });

    let html = '';
    let globalIdx = 0;

    // 限制每组最多5条，总共最多20条
    let totalShown = 0;
    const maxTotal = 20;
    const maxPerGroup = activeFilter === 'all' ? 5 : 10;

    typeOrder.forEach(type => {
      if (!groups[type] || totalShown >= maxTotal) return;
      const cfg = TYPE_CONFIG[type];
      const items = groups[type].slice(0, maxPerGroup);

      html += `<div class="search-group">`;
      html += `<div class="search-group-header"><span class="search-group-icon">${cfg.icon}</span> ${cfg.label} <span class="search-group-count">(${groups[type].length})</span></div>`;

      items.forEach(r => {
        if (totalShown >= maxTotal) return;
        const tagsHtml = r.tags.map(t => `<span class="search-tag ${t.cls}">${t.text}</span>`).join('');
        html += `<div class="search-result-item" data-global-idx="${globalIdx}">
          <span class="search-result-icon">${r.icon}</span>
          <div class="search-result-info">
            <div class="search-result-title">${highlightText(r.title, q)}${tagsHtml ? ' ' + tagsHtml : ''}</div>
            <div class="search-result-desc">${highlightText(r.desc, q)}</div>
          </div>
          <span class="search-result-type">${cfg.label}</span>
        </div>`;
        globalIdx++;
        totalShown++;
      });

      html += '</div>';
    });

    // 底部键盘提示
    html += '<div class="search-footer"><span class="search-kbd-hint">↑↓ 导航 · Enter 打开 · Esc 关闭</span></div>';

    return html;
  }

  // ===== 渲染零输入推荐面板 =====
  function renderZeroInputPanel() {
    let html = '<div class="search-zero">';

    // 热门搜索
    html += '<div class="search-zero-section"><div class="search-zero-title">🔥 热门搜索</div><div class="search-hot-tags">';
    HOT_KEYWORDS.forEach(kw => {
      html += `<button class="search-hot-tag" data-keyword="${escapeAttr(kw)}">${escapeHtml(kw)}</button>`;
    });
    html += '</div></div>';

    // 新手推荐
    html += '<div class="search-zero-section"><div class="search-zero-title">🌱 新手推荐</div>';
    if (typeof LEARNING_PATHS !== 'undefined') {
      const beginnerPath = LEARNING_PATHS['7day-beginner'];
      if (beginnerPath) {
        html += `<div class="search-zero-item" data-action="path:7day-beginner"><span class="search-zero-arrow">→</span> ${beginnerPath.title} <span class="search-tag tag-green">零基础</span></div>`;
      }
    }
    // 编辑精选入门教程
    const beginnerPicks = DATA.tutorials.filter(t => t.editorPick && t.difficulty === 'beginner').slice(0, 2);
    beginnerPicks.forEach(t => {
      html += `<div class="search-zero-item" data-action="tutorial:${t.id}"><span class="search-zero-arrow">→</span> ${escapeHtml(t.title)}</div>`;
    });
    html += '</div>';

    // 热门工具
    html += '<div class="search-zero-section"><div class="search-zero-title">🛠 热门工具</div><div class="search-hot-tags">';
    const hotTools = DATA.tools.filter(t => t.editorPick).slice(0, 5);
    hotTools.forEach(t => {
      html += `<button class="search-hot-tag" data-tool="${t.id}">${t.icon} ${escapeHtml(t.name)}</button>`;
    });
    html += '</div></div>';

    // 最近更新
    const hotNews = DATA.news.filter(n => n.isHot).slice(0, 2);
    if (hotNews.length > 0) {
      html += '<div class="search-zero-section"><div class="search-zero-title">⚡ 最近更新</div>';
      hotNews.forEach(n => {
        html += `<div class="search-zero-item" data-action="news:${n.id}"><span class="search-zero-arrow">→</span> ${escapeHtml(n.titleZh || n.title)}</div>`;
      });
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // ===== 显示搜索面板 =====
  function showSearchPanel() {
    const q = input.value.trim();
    if (!q) {
      resultsContainer.innerHTML = renderZeroInputPanel();
    } else {
      performSearch(q);
    }
    overlay.classList.remove('hidden');
  }

  // ===== 执行搜索 =====
  function performSearch(q) {
    activeIdx = -1;
    const results = scoreSearch(q);
    flatResults = [];

    // 构建扁平结果列表（用于键盘导航）
    const filtered = activeFilter === 'all' ? results : results.filter(r => r.type === activeFilter);
    const typeOrder = ['path', 'tutorial', 'tool', 'model', 'digest', 'job', 'prompt', 'resource', 'news'];
    const maxPerGroup = activeFilter === 'all' ? 5 : 10;
    let total = 0;
    typeOrder.forEach(type => {
      const group = filtered.filter(r => r.type === type).slice(0, maxPerGroup);
      group.forEach(r => {
        if (total < 20) { flatResults.push(r); total++; }
      });
    });

    const filterBarHtml = renderFilterBar(results);
    const resultsHtml = renderGroupedResults(results, q);
    resultsContainer.innerHTML = filterBarHtml + resultsHtml;
    // 不再在此处绑定事件 — 由 resultsContainer 上的事件委托处理
  }

  // ===== 搜索结果事件委托（绑定一次，永不累积） =====
  resultsContainer.addEventListener('click', function(e) {
    // 过滤按钮
    const filterBtn = e.target.closest('.search-filter-btn');
    if (filterBtn) {
      activeFilter = filterBtn.dataset.filter;
      resultsContainer.querySelectorAll('.search-filter-btn').forEach(b => b.classList.remove('active'));
      filterBtn.classList.add('active');
      performSearch(input.value.trim());
      return;
    }
    // 搜索结果项
    const resultItem = e.target.closest('.search-result-item');
    if (resultItem) {
      const idx = parseInt(resultItem.dataset.globalIdx);
      if (flatResults[idx]) {
        flatResults[idx].action();
        closeSearch();
        input.value = '';
      }
      return;
    }
    // 空状态链接
    const searchLink = e.target.closest('.search-link');
    if (searchLink) {
      e.preventDefault();
      navigate(searchLink.dataset.nav);
      closeSearch();
      input.value = '';
      return;
    }
    // 热门搜索标签
    const hotTag = e.target.closest('.search-hot-tag[data-keyword]');
    if (hotTag) {
      input.value = hotTag.dataset.keyword;
      activeFilter = 'all';
      performSearch(hotTag.dataset.keyword);
      input.focus();
      return;
    }
    // 工具标签
    const toolTag = e.target.closest('.search-hot-tag[data-tool]');
    if (toolTag) {
      navigate('tools');
      scrollToCard('tool', toolTag.dataset.tool);
      closeSearch();
      input.value = '';
      return;
    }
    // 推荐条目
    const zeroItem = e.target.closest('.search-zero-item[data-action]');
    if (zeroItem) {
      const [type, id] = zeroItem.dataset.action.split(':');
      if (type === 'path') navigate('path', id);
      else if (type === 'tutorial') navigate('tutorials', id);
      else if (type === 'news') { navigate('news'); scrollToCard('news', id); }
      closeSearch();
      input.value = '';
      return;
    }
  });

  // ===== 键盘导航 =====
  function updateHighlight() {
    resultsContainer.querySelectorAll('.search-result-item').forEach(el => el.classList.remove('search-active'));
    if (activeIdx >= 0 && activeIdx < flatResults.length) {
      const el = resultsContainer.querySelector(`[data-global-idx="${activeIdx}"]`);
      if (el) {
        el.classList.add('search-active');
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  // ===== 事件绑定 =====

  // 输入事件
  input.addEventListener('input', debounce(() => {
    const q = input.value.trim();
    activeFilter = 'all';
    if (!q) {
      resultsContainer.innerHTML = renderZeroInputPanel();
      overlay.classList.remove('hidden');
      return;
    }
    performSearch(q);
    overlay.classList.remove('hidden');
  }, 200));

  // 聚焦显示面板
  input.addEventListener('focus', () => {
    showSearchPanel();
  });

  // 点击 overlay 关闭
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeSearch();
  });

  // 键盘事件
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSearch();
      input.value = '';
      input.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (flatResults.length > 0) {
        activeIdx = Math.min(activeIdx + 1, flatResults.length - 1);
        updateHighlight();
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (flatResults.length > 0) {
        activeIdx = Math.max(activeIdx - 1, 0);
        updateHighlight();
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < flatResults.length) {
        flatResults[activeIdx].action();
        closeSearch();
        input.value = '';
      }
      return;
    }
  });
}

function closeSearch() {
  const overlay = $('#searchOverlay');
  if (overlay) overlay.classList.add('hidden');
}


// ===== 滚动进度条 =====

function setupScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ===== 返回顶部 =====

function setupBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== 滚动渐入动画 =====

function setupScrollAnimations() {
  const els = $$('.animate-on-scroll');
  if (!els.length) return;

  // Immediately show elements already in viewport
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.classList.add('visible');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02, rootMargin: '0px 0px 80px 0px' });
  els.forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });

  // 路由切换时断开 observer，防止累积
  registerCleanup(() => observer.disconnect());
}

// ===== 键盘快捷键 =====

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault();
      const input = $('#globalSearch');
      if (input) input.focus();
    }
  });
}

// ===== 移动端菜单 =====

function setupMobileMenu() {
  const toggle = $('#mobileMenuToggle');
  const nav = $('#mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      toggle.classList.remove('active');
      nav.classList.remove('open');
    }
  });
}


// ===== Analytics =====

// 批量写入 analytics，避免每次操作都同步读写 localStorage
const _eventBuffer = [];
let _eventFlushTimer = null;
function trackEvent(event, data) {
  _eventBuffer.push({ event, data, ts: Date.now() });
  if (!_eventFlushTimer) {
    _eventFlushTimer = setTimeout(() => {
      _eventFlushTimer = null;
      try {
        const log = JSON.parse(localStorage.getItem('fs-events') || '[]');
        log.push(..._eventBuffer.splice(0));
        if (log.length > 200) log.splice(0, log.length - 200);
        localStorage.setItem('fs-events', JSON.stringify(log));
      } catch {}
    }, 2000); // 每 2 秒批量写入一次
  }
}

// ===== 学习诊断 =====

const DIAGNOSIS_QUESTIONS = [
  {
    id: 'experience',
    question: '你和 AI 目前是什么关系？',
    options: [
      { value: 'none', label: '还没开始', icon: '🌱', desc: '听过不少，但还没真正用起来' },
      { value: 'some', label: '试过几次', icon: '🚀', desc: '聊过 ChatGPT，但不太确定还能怎么用' },
      { value: 'frequent', label: '已经在用了', icon: '💡', desc: '工作里会用，但觉得还能用得更好' },
    ]
  },
  {
    id: 'goal',
    question: '你最想让 AI 帮你做什么？',
    options: [
      { value: 'efficiency', label: '日常工作提速', icon: '⚡', desc: '写文案、出报告、分析数据这些，想更快' },
      { value: 'creative', label: '内容和创意', icon: '🎨', desc: '做图、剪视频、出设计方案' },
      { value: 'automation', label: '让重复的事自动跑', icon: '🤖', desc: '搭流程、建工作流，少干重复活' },
      { value: 'explore', label: '还没想好，先看看', icon: '🔍', desc: '了解一下 AI 到底能帮我做什么' },
    ]
  },
  {
    id: 'role',
    question: '你在做什么工作？',
    options: [
      { value: 'design', label: '设计相关', icon: '🎨', desc: '平面、视频、UI——需要视觉创意' },
      { value: 'ops', label: '运营相关', icon: '📊', desc: '用户、活动、产品运营——需要效率' },
      { value: 'product', label: '产品策划', icon: '📋', desc: '产品设计、数值策划——需要分析力' },
      { value: 'marketing', label: '市场推广', icon: '📈', desc: '品牌、新媒体、投放——需要内容力' },
      { value: 'tech', label: '技术开发', icon: '💻', desc: '美术、引擎、测试——需要工具力' },
      { value: 'other', label: '管理/其他', icon: '🏢', desc: '制作人、项目管理——需要全局视野' },
    ]
  },
];

let diagnosisAnswers = {};

function renderDiagnosis() {
  diagnosisAnswers = {};
  trackEvent('diagnosis_start');
  renderDiagnosisStep(0);
}

function renderDiagnosisStep(step) {
  if (step >= DIAGNOSIS_QUESTIONS.length) {
    renderDiagnosisResult();
    return;
  }
  const q = DIAGNOSIS_QUESTIONS[step];
  const progress = Math.round(((step) / DIAGNOSIS_QUESTIONS.length) * 100);

  const optionsHTML = q.options.map(o => `
    <button class="diag-option" onclick="selectDiagnosisAnswer(${step}, '${q.id}', '${o.value}')">
      <span class="diag-option-icon">${o.icon}</span>
      <div class="diag-option-text">
        <div class="diag-option-label">${o.label}</div>
        <div class="diag-option-desc">${o.desc}</div>
      </div>
      <i class="fa-solid fa-chevron-right diag-option-arrow"></i>
    </button>
  `).join('');

  $('#diagnosisContent').innerHTML = `
    <div class="diag-container">
      <div class="diag-progress">
        <div class="diag-progress-fill" style="width:${progress}%"></div>
      </div>
      <div class="diag-step-indicator">第 ${step + 1} 题 / 共 ${DIAGNOSIS_QUESTIONS.length} 题</div>
      <h2 class="diag-question">${q.question}</h2>
      <div class="diag-options">${optionsHTML}</div>
      ${step > 0 ? `<button class="diag-back" onclick="renderDiagnosisStep(${step - 1})"><i class="fa-solid fa-arrow-left"></i> 上一题</button>` : ''}
    </div>
  `;
}

function selectDiagnosisAnswer(step, questionId, value) {
  diagnosisAnswers[questionId] = value;
  trackEvent('diagnosis_answer', { question: questionId, answer: value });
  renderDiagnosisStep(step + 1);
}

function getDiagnosisRecommendation() {
  const { experience, goal, role } = diagnosisAnswers;

  // 决定推荐路径
  let pathId, reason;
  if (experience === 'none' || (experience === 'some' && goal === 'explore')) {
    pathId = '7day-beginner';
    reason = '不知道从哪开始，这很正常。这条路径每天只需要 30 分钟，带你从第一次 AI 对话开始，一步步理清方向。';
  } else if (experience === 'frequent' && goal === 'automation') {
    pathId = '5day-advanced';
    reason = '你已经有了不错的基础。下一步是把零散的使用变成稳定的工作流——让 AI 真正成为你的工作搭档。';
  } else {
    pathId = '5day-efficiency';
    reason = '你已经迈出了第一步，接下来可以把 AI 用在最能帮到你的地方——写文案、做分析、出报告，每一篇都对应真实工作场景。';
  }

  // 决定补充建议
  const roleJobMap = {
    design: ['graphic-designer', 'video-designer'],
    ops: ['product-ops'],
    product: ['product-planner', 'numerical-planner'],
    marketing: ['brand-manager', 'new-media', 'ad-manager', 'publishing-manager'],
    tech: ['technical-artist', 'engine-programmer', 'test-engineer'],
    other: ['producer', 'project-manager', 'product-ops'],
  };
  const relatedJobs = (roleJobMap[role] || []).map(jid => getJobById(jid)).filter(Boolean);
  const goalText = { efficiency: '工作提效', creative: '内容创意', automation: '流程自动化', explore: '探索 AI' }[goal] || '';

  // 根据目标追加个性化理由
  const goalSuffix = { efficiency: '，让你每天的工作更从容', career: '，让你在团队里多一份底气', creative: '，让好创意更快变成成品', automation: '，让重复的事情自己跑起来', explore: '，帮你看清 AI 在你工作中的可能性' }[goal] || '';
  if (goalSuffix) reason = reason.replace(/。$/, '') + goalSuffix + '。';

  return { pathId, reason, relatedJobs, goalText };
}

function renderDiagnosisResult() {
  const rec = getDiagnosisRecommendation();
  const path = LEARNING_PATHS[rec.pathId];
  trackEvent('diagnosis_complete', { pathId: rec.pathId, answers: diagnosisAnswers });

  const outcomesHTML = (path.outcomes || []).slice(0, 3).map(o => `<li><i class="fa-solid fa-check"></i> ${o}</li>`).join('');

  const otherPaths = Object.values(LEARNING_PATHS).filter(p => p.id !== rec.pathId).map(p => `
    <div class="diag-alt-card" onclick="navigate('path', '${p.id}')">
      <span class="diag-alt-icon">${p.icon}</span>
      <div>
        <div class="diag-alt-title">${p.title}</div>
        <div class="diag-alt-desc">${p.difficulty} · ${p.days.length} 天</div>
      </div>
      <i class="fa-solid fa-chevron-right"></i>
    </div>
  `).join('');

  const jobsHTML = rec.relatedJobs.length ? `
    <div class="diag-result-jobs">
      <div class="diag-result-jobs-label">你的岗位也有专属内容：</div>
      <div class="diag-result-jobs-list">
        ${rec.relatedJobs.map(j => `<span class="diag-job-tag" onclick="navigate('jobs', '${j.id}')">${j.icon} ${j.name}</span>`).join('')}
      </div>
    </div>
  ` : '';

  // 订阅状态
  const isSubscribed = localStorage.getItem('fs-subscribed');
  const subscribeHTML = isSubscribed ? `
    <div class="diag-subscribe diag-subscribed">
      <i class="fa-solid fa-check-circle"></i> 你已订阅 AI 学习周报
    </div>
  ` : `
    <div class="diag-subscribe">
      <div class="diag-subscribe-title"><i class="fa-solid fa-envelope"></i> 每周 AI 学习提醒</div>
      <div class="diag-subscribe-desc">不用担心错过什么——每周帮你整理最值得关注的变化和学习建议</div>
      <div class="diag-subscribe-form">
        <input type="email" id="diagEmail" placeholder="你的邮箱地址" class="diag-email-input" />
        <button class="btn-primary diag-subscribe-btn" onclick="handleSubscribe()">订阅</button>
      </div>
    </div>
  `;

  // 转化优化：完成日期计算
  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + path.days.length);
  const finishStr = `${finishDate.getMonth() + 1} 月 ${finishDate.getDate()} 日`;

  // 转化优化：Day 1 预告
  const day1 = path.days[0];
  const day1Preview = day1 ? `
    <div class="diag-day1-preview">
      <div class="diag-day1-label"><i class="fa-solid fa-calendar-day"></i> Day 1 预告</div>
      <div class="diag-day1-theme">${day1.theme}</div>
      <div class="diag-day1-goal">${day1.goal}</div>
    </div>
  ` : '';

  // 路径特色描述（真实信息，不使用虚假数据）
  const pathFeatures = {
    '7day-beginner': '零基础友好 · 每天 30 分钟就够',
    '5day-efficiency': '有基础就能学 · 5 天看到变化',
    '5day-advanced': '让 AI 成为你的工作搭档',
  };
  const featureText = pathFeatures[path.id] || `${path.days.length} 天系统学习`;

  $('#diagnosisContent').innerHTML = `
    <div class="diag-container diag-result">
      <div class="diag-result-badge"><i class="fa-solid fa-sparkles"></i> 找到了</div>
      <h2 class="diag-result-title">这条路径很适合你现在的状态</h2>
      <div class="diag-result-reason"><i class="fa-solid fa-lightbulb"></i> ${rec.reason}</div>

      <div class="diag-result-card" style="--lp-accent:${path.accent}">
        <div class="diag-result-card-header">
          <span class="diag-result-card-icon">${path.icon}</span>
          <div>
            <div class="diag-result-card-title">${path.title}</div>
            <div class="diag-result-card-meta">${path.days.length} 天 · 每天 ${path.estimatedDaily} · ${path.difficulty}</div>
          </div>
        </div>
        <div class="diag-social-proof"><i class="fa-solid fa-gem"></i> ${featureText}</div>
        <p class="diag-result-card-desc">${path.desc}</p>
        <ul class="diag-result-outcomes">${outcomesHTML}</ul>
        ${day1Preview}
        <div class="diag-finish-date"><i class="fa-solid fa-flag-checkered"></i> 今天开始，<strong>${finishStr}</strong> 就能完成——比你想象的快</div>
        <button class="btn-primary btn-glow diag-start-btn" onclick="trackEvent('path_start', {pathId:'${path.id}',source:'diagnosis'}); navigate('path', '${path.id}')">
          <i class="fa-solid fa-play"></i> 从 Day 1 开始
        </button>
      </div>

      ${jobsHTML}

      <div class="diag-alt-section">
        <div class="diag-alt-label">其他学习路径</div>
        ${otherPaths}
      </div>

      ${subscribeHTML}

      <button class="diag-restart" onclick="renderDiagnosis()"><i class="fa-solid fa-rotate"></i> 重新诊断</button>
    </div>
  `;
}

function handleSubscribe() {
  const email = document.getElementById('diagEmail')?.value?.trim();
  if (!email || !email.includes('@')) {
    showToast('请输入有效的邮箱地址', 'info');
    return;
  }
  localStorage.setItem('fs-subscribed', 'true');
  trackEvent('subscribe', { subscribed: true });
  showToast('订阅成功！每周帮你整理最值得关注的内容', 'success');
  // 更新 UI
  const sub = document.querySelector('.diag-subscribe');
  if (sub) {
    sub.className = 'diag-subscribe diag-subscribed';
    sub.innerHTML = `
      <div class="diag-sub-success"><i class="fa-solid fa-check-circle"></i> 好的，记住你了</div>
      <div class="diag-sub-next">有值得关注的新内容，第一时间告诉你。现在开始 Day 1 吧 👇</div>
    `;
    // 滚动到开始按钮
    document.querySelector('.diag-start-btn')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}


// ===== 学习路径 =====

const LEARNING_PATHS = {
  '7day-beginner': {
    id: '7day-beginner',
    title: '7 天 AI 入门之旅',
    desc: '你不需要有任何基础。每天 30 分钟，7 天后你会惊讶自己已经能做这么多',
    icon: '🌱',
    accent: 'var(--primary)',
    tier: 'beginner',
    difficulty: '零基础',
    audience: '对 AI 好奇，但还不知道从哪开始的你',
    estimatedDaily: '30 分钟',
    prerequisites: ['无需任何 AI 基础', '有一台能上网的电脑即可'],
    outcomes: [
      '独立使用 ChatGPT 和 Claude 完成日常任务',
      '编写有效的 AI 指令（Prompt）',
      '用 AI 制作 PPT、思维导图',
      '掌握 AI 搜索，高效获取信息',
      '建立安全使用 AI 的正确习惯',
    ],
    relatedJobs: [],
    days: [
      { day: 1, theme: '认识 AI 对话工具', tutorialId: 't001', goal: '学会与 ChatGPT 对话，完成你的第一个 AI 任务', task: '用 ChatGPT 写一段自我介绍，并优化到满意为止', deliverable: '一段 AI 辅助优化的自我介绍文本' },
      { day: 2, theme: '掌握第二个核心工具', tutorialId: 't002', goal: '了解 Claude 的独特优势，学会选择合适的 AI 工具', task: '将同一个问题分别在 ChatGPT 和 Claude 中提问，比较输出差异', deliverable: '一份两个 AI 工具的对比笔记' },
      { day: 3, theme: '安全使用 AI', tutorialId: 't014', goal: '理解 AI 的能力边界，建立安全使用习惯', task: '列出 3 个"AI 能做好"和 3 个"AI 容易出错"的场景', deliverable: '一份 AI 能力边界清单' },
      { day: 4, theme: '写出好的指令', tutorialId: 't003', goal: '掌握 Prompt 编写核心技巧，让 AI 输出更精准', task: '用课程中的技巧改写一个模糊提问，对比前后效果', deliverable: '一组"改前 vs 改后"的 Prompt 对比' },
      { day: 5, theme: 'AI 做演示文稿', tutorialId: 't026', goal: '用 Gamma AI 快速生成专业 PPT，体验 AI 实用场景', task: '用 Gamma AI 生成一份 5 页的主题 PPT', deliverable: '一份 AI 生成的演示文稿' },
      { day: 6, theme: 'AI 辅助思考', tutorialId: 't052', goal: '用 AI 创建思维导图，提升信息整理效率', task: '选一个你感兴趣的话题，用 AI 生成思维导图', deliverable: '一张 AI 辅助生成的思维导图' },
      { day: 7, theme: 'AI 搜索升级', tutorialId: 't004', goal: '掌握 AI 搜索引擎，从此告别低效信息获取', task: '用 Perplexity 搜索一个专业问题，对比传统搜索引擎的结果', deliverable: '一份 AI 搜索 vs 传统搜索的效果对比' },
    ],
    nextPaths: ['5day-efficiency'],
    nextFallback: { label: '选择你的岗位方向', action: "navigate('jobs')" },
  },
  '5day-efficiency': {
    id: '5day-efficiency',
    title: '5 天 AI 效率提升',
    desc: '你已经会用了，接下来学会用得更聪明——写文案、做分析、出报告，每天少花一小时',
    icon: '🚀',
    accent: 'var(--secondary)',
    tier: 'job-specific',
    difficulty: '中级',
    audience: '用过 AI，想让它真正帮到工作的你',
    estimatedDaily: '45 分钟',
    prerequisites: ['能熟练使用至少一个 AI 对话工具', '了解基本的 Prompt 编写技巧'],
    outcomes: [
      '用高级 Prompt 技巧获得专业级输出',
      '用 AI 快速撰写高转化广告文案',
      '用 AI 辅助完成产品需求文档',
      '掌握 AI 驱动的竞品分析方法',
      '将原始数据转化为结构化分析报告',
    ],
    relatedJobs: ['ad-manager', 'product-planner', 'new-media'],
    days: [
      { day: 1, theme: '进阶 Prompt 技巧', tutorialId: 't004', goal: '掌握高级 Prompt 模式，让 AI 输出更专业', task: '用角色扮演 + 少样本模式重写一段工作邮件', deliverable: '一封经 AI 优化的专业工作邮件' },
      { day: 2, theme: 'AI 写高转化文案', tutorialId: 't008', goal: '学会用 AI 生成和优化广告文案', task: '为一个产品生成 3 版不同风格的推广文案', deliverable: '3 版产品推广文案（不同受众/风格）' },
      { day: 3, theme: 'AI 产品文档', tutorialId: 't013', goal: '用 AI 辅助撰写完整的产品需求文档', task: '选一个功能需求，用 AI 生成完整 PRD 框架', deliverable: '一份结构化的产品需求文档初稿' },
      { day: 4, theme: 'AI 竞品分析', tutorialId: 't015', goal: '掌握 AI 驱动的系统化竞品分析方法', task: '选 2-3 个竞品，用 AI 生成对比分析矩阵', deliverable: '一份多维度竞品分析对比表' },
      { day: 5, theme: 'AI 数据报告', tutorialId: 't016', goal: '学会将原始数据转化为结构化分析报告', task: '用 AI 将一组数据整理成带结论的分析报告', deliverable: '一份数据驱动的分析报告' },
    ],
    nextPaths: ['5day-advanced'],
    nextFallback: { label: '探索更多教程', action: "navigate('tutorials')" },
  },
  '5day-advanced': {
    id: '5day-advanced',
    title: '5 天 AI 进阶实战',
    desc: '让 AI 不只是工具，而是你的工作搭档——搭建工作流、用 Agent 自动处理任务',
    icon: '💡',
    accent: 'var(--accent-pink)',
    tier: 'advanced',
    difficulty: '高级',
    audience: '想让 AI 成为稳定工作搭档的你',
    estimatedDaily: '50 分钟',
    prerequisites: ['熟练使用 AI 工具完成日常工作', '了解基本的工作流程自动化概念'],
    outcomes: [
      '掌握思维链、少样本学习等高级 Prompt 工程',
      '使用 AI Agent 自主完成复杂任务',
      '用 n8n 搭建可运行的自动化工作流',
      '让 AI 全程辅助策划从创意到落地',
      '搭建半自动化的内容生产流水线',
    ],
    relatedJobs: ['product-ops', 'product-planner', 'numerical-planner'],
    days: [
      { day: 1, theme: '高级 Prompt 工程', tutorialId: 't048', goal: '掌握思维链、少样本学习等高级 Prompt 技巧', task: '用思维链（CoT）方法解决一个多步骤推理问题', deliverable: '一组展示 CoT 效果的 Prompt 和输出对比' },
      { day: 2, theme: 'AI Agent 实战', tutorialId: 't017', goal: '了解 AI Agent 生态，学会使用自主代理完成任务', task: '使用一个 AI Agent 工具完成一个信息收集任务', deliverable: '一份 AI Agent 自主完成的调研结果' },
      { day: 3, theme: '自动化工作流', tutorialId: 't037', goal: '用 n8n 搭建真实的 AI 自动化工作流', task: '在 n8n 中搭建一个"触发→AI 处理→输出"的基础流程', deliverable: '一个可运行的 n8n 自动化工作流' },
      { day: 4, theme: 'AI 活动策划', tutorialId: 't009', goal: '让 AI 全程辅助从创意到落地的策划流程', task: '用 AI 完成一个活动的完整策划方案', deliverable: '一份包含时间线和预算的活动策划书' },
      { day: 5, theme: 'AI 内容工厂', tutorialId: 't012', goal: '搭建半自动化的 AI 内容生产流水线', task: '设计一条"选题→生成→编辑→发布"的内容管线', deliverable: '一份内容自动化管线的流程文档' },
    ],
    nextPaths: [],
    nextFallback: { label: '探索岗位专属路径', action: "navigate('jobs')" },
  },
};

function findPathByTutorial(tutorialId) {
  for (const [pathId, path] of Object.entries(LEARNING_PATHS)) {
    const dayInfo = path.days.find(d => d.tutorialId === tutorialId);
    if (dayInfo) return { pathId, path, day: dayInfo.day };
  }
  return null;
}

function getLearningProgress(pathId) {
  try { return JSON.parse(localStorage.getItem(`lp-${pathId}`) || '[]'); }
  catch { return []; }
}

function toggleDayComplete(pathId, day) {
  const progress = getLearningProgress(pathId);
  const idx = progress.indexOf(day);
  const wasComplete = progress.length === LEARNING_PATHS[pathId]?.days.length;
  if (idx >= 0) progress.splice(idx, 1);
  else progress.push(day);
  localStorage.setItem(`lp-${pathId}`, JSON.stringify(progress));
  const path = LEARNING_PATHS[pathId];
  const isNowComplete = path && progress.length === path.days.length;
  trackEvent(idx < 0 ? 'day_complete' : 'day_uncomplete', { pathId, day });
  // Toast 通知
  if (idx < 0) {
    if (isNowComplete) {
      trackEvent('path_complete', { pathId });
      showToast(`🎉 「${path.title}」全部完成！你做到了！`, 'success');
    } else {
      const remaining = path.days.length - progress.length;
      showToast(`✅ Day ${day} 搞定！还有 ${remaining} 天，按你的节奏来`, 'info');
    }
  }
  renderLearningPath(pathId);
}

function showToast(message, type) {
  type = type || 'info';
  const existing = document.querySelector('.lp-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `lp-toast lp-toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('lp-toast-show'));
  setTimeout(() => {
    toast.classList.remove('lp-toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function renderLearningPath(pathId) {
  if (!pathId) { renderPathIndex(); return; }
  const path = LEARNING_PATHS[pathId];
  if (!path) { navigate('home'); return; }

  const progress = getLearningProgress(pathId);
  const completedCount = progress.length;
  const totalDays = path.days.length;
  const progressPct = Math.round((completedCount / totalDays) * 100);
  const isComplete = completedCount === totalDays;

  // 路径概览卡片
  const prerequisitesHTML = (path.prerequisites || []).map(p => `<li><i class="fa-solid fa-circle-check"></i> ${p}</li>`).join('');
  const outcomesHTML = (path.outcomes || []).map(o => `<li><i class="fa-solid fa-star"></i> ${o}</li>`).join('');
  const relatedJobsHTML = (path.relatedJobs || []).map(jid => {
    const job = getJobById(jid);
    return job ? `<span class="lp-overview-job" onclick="event.stopPropagation(); navigate('jobs', '${jid}')">${job.icon} ${job.name}</span>` : '';
  }).filter(Boolean).join('');

  const overviewHTML = `
    <div class="lp-overview">
      <div class="lp-overview-col">
        <div class="lp-overview-section">
          <h3><i class="fa-solid fa-clipboard-check"></i> 你需要准备什么</h3>
          <ul>${prerequisitesHTML || '<li>无特殊要求</li>'}</ul>
        </div>
      </div>
      <div class="lp-overview-col">
        <div class="lp-overview-section">
          <h3><i class="fa-solid fa-trophy"></i> 学完你能做到</h3>
          <ul>${outcomesHTML}</ul>
        </div>
      </div>
      ${relatedJobsHTML ? `<div class="lp-overview-jobs"><span class="lp-overview-jobs-label">关联岗位：</span>${relatedJobsHTML}</div>` : ''}
    </div>
  `;

  const daysHTML = path.days.map(d => {
    const t = getTutorialById(d.tutorialId);
    const done = progress.includes(d.day);
    if (!t) return '';
    const taskHTML = d.task ? `
      <div class="lp-day-task">
        <div class="lp-day-task-label"><i class="fa-solid fa-pen-to-square"></i> 今日任务</div>
        <div class="lp-day-task-text">${d.task}</div>
        ${d.deliverable ? `<div class="lp-day-deliverable"><i class="fa-solid fa-file-export"></i> 产出物：${d.deliverable}</div>` : ''}
      </div>
    ` : '';
    return `
      <div class="lp-day ${done ? 'lp-day-done' : ''}" data-day="${d.day}">
        <div class="lp-day-marker">
          <button class="lp-check ${done ? 'checked' : ''}" onclick="event.stopPropagation(); toggleDayComplete('${pathId}', ${d.day})" title="${done ? '标记为未完成' : '标记为已完成'}">
            ${done ? '<i class="fa-solid fa-check"></i>' : d.day}
          </button>
          <div class="lp-day-line"></div>
        </div>
        <div class="lp-day-card" onclick="navigate('tutorials', '${t.id}')">
          <div class="lp-day-header">
            <span class="lp-day-label">Day ${d.day}</span>
            <span class="lp-day-theme">${d.theme}</span>
            <span class="lp-day-duration"><i class="fa-regular fa-clock"></i> ${t.duration}</span>
          </div>
          <div class="lp-day-title">${t.icon} ${t.title}</div>
          <div class="lp-day-goal"><i class="fa-solid fa-bullseye"></i> ${d.goal}</div>
          ${taskHTML}
          <div class="lp-day-footer">
            ${diffBadge(t.difficulty)}
            <span class="lp-day-steps"><i class="fa-solid fa-list-ol"></i> ${t.steps} 个步骤</span>
            <span class="lp-day-action">${done ? '已完成 ✓' : '开始这一天 →'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 完成桥接 — 路径完成时显示成果回顾
  const bridgeHTML = renderPathBridge(path, isComplete, progress);

  $('#pathContent').innerHTML = `
    <button class="back-btn" onclick="navigate('path')"><i class="fa-solid fa-arrow-left"></i> 全部学习路径</button>
    <div class="lp-header" style="--lp-accent:${path.accent}">
      <div class="lp-header-icon">${path.icon}</div>
      <div class="lp-header-info">
        <h1 class="lp-header-title">${path.title}</h1>
        <p class="lp-header-desc">${path.desc}</p>
        <div class="lp-header-meta">
          <span><i class="fa-solid fa-calendar-days"></i> ${totalDays} 天</span>
          <span><i class="fa-solid fa-clock"></i> 每天约 ${path.estimatedDaily}</span>
          <span><i class="fa-solid fa-signal"></i> ${path.difficulty}</span>
          <span><i class="fa-solid fa-users"></i> ${path.audience}</span>
        </div>
      </div>
    </div>
    ${overviewHTML}
    <div class="lp-progress-bar" style="--lp-accent:${path.accent}">
      <div class="lp-progress-fill ${isComplete ? 'lp-complete' : ''}" style="width:${progressPct}%"></div>
      <div class="lp-progress-text">${isComplete ? '🎉 全部完成，你做到了！' : `${completedCount}/${totalDays} 完成 · 不急，按你的节奏来`}</div>
    </div>
    <div class="lp-timeline">
      ${daysHTML}
    </div>
    ${bridgeHTML}
  `;
}

function renderPathBridge(path, isComplete, progress) {
  // 推荐的下一条路径
  const nextPathCards = (path.nextPaths || []).map(pid => {
    const np = LEARNING_PATHS[pid];
    if (!np) return '';
    const npProgress = getLearningProgress(pid);
    const npPct = Math.round((npProgress.length / np.days.length) * 100);
    return `
      <div class="lp-bridge-card" onclick="navigate('path', '${np.id}')" style="--lp-accent:${np.accent}">
        <div class="lp-bridge-card-icon">${np.icon}</div>
        <div class="lp-bridge-card-info">
          <div class="lp-bridge-card-title">${np.title}</div>
          <div class="lp-bridge-card-desc">${np.desc}</div>
          <div class="lp-bridge-card-meta">
            <span>${np.days.length} 天</span> · <span>${np.difficulty}</span>
            ${npPct > 0 ? ` · <span class="lp-bridge-progress">${npPct}% 进行中</span>` : ''}
          </div>
        </div>
        <div class="lp-bridge-card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
      </div>
    `;
  }).join('');

  // 成果回顾（完成时展示）
  const outcomesReviewHTML = isComplete && path.outcomes ? `
    <div class="lp-bridge-outcomes">
      <div class="lp-bridge-outcomes-title">这些能力，你已经拥有了</div>
      <ul>${path.outcomes.map(o => `<li><i class="fa-solid fa-circle-check"></i> ${o}</li>`).join('')}</ul>
    </div>
  ` : '';

  if (isComplete && nextPathCards) {
    return `
      <div class="lp-bridge lp-bridge-complete">
        <div class="lp-bridge-header"><span class="lp-bridge-emoji">🎉</span> 你完成了「${path.title}」——这些能力，现在属于你了</div>
        ${outcomesReviewHTML}
        <div class="lp-bridge-next-label">准备好走下一步了吗？</div>
        <div class="lp-bridge-cards">${nextPathCards}</div>
        <div class="lp-bridge-alt">
          <button class="btn-secondary" onclick="${path.nextFallback.action}"><i class="fa-solid fa-compass"></i> ${path.nextFallback.label}</button>
          <button class="btn-secondary" onclick="navigate('path')"><i class="fa-solid fa-route"></i> 浏览全部路径</button>
        </div>
      </div>
    `;
  }

  if (isComplete) {
    return `
      <div class="lp-bridge lp-bridge-complete">
        <div class="lp-bridge-header"><span class="lp-bridge-emoji">🎉</span> 你完成了「${path.title}」——这些能力，现在属于你了</div>
        ${outcomesReviewHTML}
        <div class="lp-bridge-alt">
          <button class="btn-primary" onclick="${path.nextFallback.action}"><i class="fa-solid fa-arrow-right"></i> ${path.nextFallback.label}</button>
          <button class="btn-secondary" onclick="navigate('path')"><i class="fa-solid fa-route"></i> 浏览全部路径</button>
        </div>
      </div>
    `;
  }

  // 未完成时，显示下一步预告
  if (nextPathCards) {
    return `
      <div class="lp-bridge">
        <div class="lp-bridge-header">完成后的下一步</div>
        <div class="lp-bridge-cards">${nextPathCards}</div>
      </div>
    `;
  }

  return `
    <div class="lp-bridge">
      <div class="lp-bridge-header">完成后的下一步</div>
      <div class="lp-bridge-alt">
        <button class="btn-secondary" onclick="${path.nextFallback.action}"><i class="fa-solid fa-arrow-right"></i> ${path.nextFallback.label}</button>
      </div>
    </div>
  `;
}

function renderPathIndex() {
  const paths = Object.values(LEARNING_PATHS);
  const cards = paths.map(p => {
    const progress = getLearningProgress(p.id);
    const pct = Math.round((progress.length / p.days.length) * 100);
    const isComplete = progress.length === p.days.length;
    return `
      <div class="pi-card" onclick="navigate('path', '${p.id}')" style="--lp-accent:${p.accent}">
        <div class="pi-card-accent"></div>
        <div class="pi-card-icon">${p.icon}</div>
        <div class="pi-card-body">
          <div class="pi-card-title">${p.title}</div>
          <div class="pi-card-desc">${p.desc}</div>
          <div class="pi-card-meta">
            <span><i class="fa-solid fa-calendar-days"></i> ${p.days.length} 天</span>
            <span><i class="fa-solid fa-clock"></i> 每天 ${p.estimatedDaily}</span>
            <span><i class="fa-solid fa-signal"></i> ${p.difficulty}</span>
          </div>
          ${pct > 0 ? `
            <div class="pi-card-progress">
              <div class="pi-card-progress-fill" style="width:${pct}%"></div>
            </div>
            <div class="pi-card-progress-text">${isComplete ? '已完成 ✓' : `${pct}% 进行中`}</div>
          ` : ''}
        </div>
        <div class="pi-card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
      </div>
    `;
  }).join('');

  $('#pathContent').innerHTML = `
    <button class="back-btn" onclick="navigate('home')"><i class="fa-solid fa-arrow-left"></i> 返回首页</button>
    ${renderPageHeader({
      icon: 'fa-solid fa-route',
      iconColor: 'var(--primary)',
      title: '学习路径',
      desc: '不知道先学什么？选一条路径，按顺序来——每一步都帮你安排好了',
      stats: [
        { value: paths.length, label: '条路径', icon: 'fa-solid fa-route' },
      ]
    })}
    <div class="pi-grid">${cards}</div>
  `;
}


// ===== 初始化 =====

document.addEventListener('DOMContentLoaded', async () => {
  // 加载数据
  try {
    await loadData();
  } catch (err) {
    document.getElementById('main').innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;padding:40px 20px;text-align:center;color:var(--text-secondary)">
        <div style="font-size:48px;margin-bottom:16px">⚠️</div>
        <h2 style="color:var(--text-primary);margin-bottom:8px">数据加载失败</h2>
        <p style="margin-bottom:20px;max-width:400px">网络连接异常，请检查网络后刷新页面重试。</p>
        <button onclick="location.reload()" style="padding:10px 24px;border-radius:8px;background:var(--primary);color:#fff;border:none;cursor:pointer;font-size:14px">刷新页面</button>
      </div>
    `;
    return;
  }

  // 导航点击
  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.section));
  });

  // 复制按钮事件委托（全局绑定一次）
  setupCopyButtonsDelegation();

  // 全局搜索
  setupGlobalSearch();

  // 滚动进度条
  setupScrollProgress();

  // 返回顶部
  setupBackToTop();

  // 键盘快捷键
  setupKeyboardShortcuts();

  // 移动端菜单
  setupMobileMenu();

  // 移动端搜索框 placeholder 适配
  const searchInput = $('#globalSearch');
  if (searchInput) {
    const updatePlaceholder = () => {
      searchInput.placeholder = window.innerWidth <= 480 ? '搜索…' : window.innerWidth <= 1024 ? '搜索工具、指南…' : '搜索工具、指南、Prompt 或资源…';
    };
    updatePlaceholder();
    window.addEventListener('resize', updatePlaceholder);
  }

  // 外部链接点击追踪
  document.body.addEventListener('click', e => {
    const a = e.target.closest('a[href^="http"]');
    if (a && a.hostname !== location.hostname) {
      trackEvent('outbound_link', { url: a.href });
    }
  });

  // 哈希路由
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
});
