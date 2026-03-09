/**
 * config.js — 自动化脚本统一配置
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const LOGS_DIR = path.join(ROOT, 'logs');

module.exports = {
  // 路径
  ROOT,
  DATA_DIR,
  LOGS_DIR,

  // API Keys
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  PRODUCTHUNT_TOKEN: process.env.PRODUCTHUNT_TOKEN || '',

  // AI Enrichment 开关
  AI_ENABLED: !!process.env.ANTHROPIC_API_KEY,

  // 新闻数据源（扩充至12个源，覆盖中英文AI资讯）
  NEWS_SOURCES: [
    // 中文源
    { name: '36kr', type: 'rss', url: 'https://36kr.com/feed', category: 'ops' },
    { name: '少数派-AI', type: 'rss', url: 'https://sspai.com/feed', category: 'ops' },
    // 英文源
    { name: 'The Verge AI', type: 'rss', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
    { name: 'TechCrunch-AI', type: 'rss', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
    { name: 'Ars-AI', type: 'rss', url: 'https://arstechnica.com/ai/feed/' },
    { name: 'VentureBeat-AI', type: 'rss', url: 'https://venturebeat.com/category/ai/feed/' },
    { name: 'MIT-Tech-AI', type: 'rss', url: 'https://www.technologyreview.com/feed/' },
    // HackerNews API（多关键词扩大覆盖）
    { name: 'HackerNews-AI', type: 'api', url: 'https://hn.algolia.com/api/v1/search?query=AI+tools&tags=story&hitsPerPage=30' },
    { name: 'HackerNews-LLM', type: 'api', url: 'https://hn.algolia.com/api/v1/search?query=LLM+generative+AI&tags=story&hitsPerPage=25' },
    { name: 'HackerNews-GPT', type: 'api', url: 'https://hn.algolia.com/api/v1/search?query=GPT+Claude+Gemini&tags=story&hitsPerPage=20' },
    { name: 'HackerNews-Diffusion', type: 'api', url: 'https://hn.algolia.com/api/v1/search?query=Midjourney+Stable+Diffusion+DALL-E&tags=story&hitsPerPage=15' },
    { name: 'HackerNews-Agent', type: 'api', url: 'https://hn.algolia.com/api/v1/search?query=AI+agent+automation&tags=story&hitsPerPage=15' },
  ],

  // 工具发现源
  TOOLS_SOURCES: [
    { name: 'GitHub Trending', type: 'github-trending', url: 'https://api.github.com/search/repositories?q=AI+tools+created:>2026-01-01&sort=stars&per_page=20' },
  ],

  // 模型追踪源
  MODELS_SOURCES: [
    { name: 'HuggingFace Top', type: 'api', url: 'https://huggingface.co/api/models?sort=likes&direction=-1&limit=20' },
  ],

  // 质量控制
  QUALITY: {
    // 新闻最低标题长度
    minTitleLength: 8,
    // 描述最低长度
    minDescLength: 20,
    // 最大保留条目数（防止JSON过大）
    maxNewsItems: 200,
    maxToolsItems: 50,
    maxModelsItems: 30,
  },

  // 分类映射（与前端 DATA.newsCategories 保持一致）
  NEWS_CATEGORIES: {
    'model-update': '模型更新',
    'tools-workflow': '工具与工作流',
    'industry-product': '行业与产品',
    'deep-insight': '深度观点',
  },

  // 工具类别映射
  TOOL_CATEGORIES: {
    'text': '文本对话',
    'image': '图像设计',
    'video': '视频制作',
    'code': '代码辅助',
    'audio': '音频创作',
    'productivity': '效率工具',
  },

  // 岗位ID列表（用于标签匹配）
  JOB_IDS: [
    'graphic-designer', 'video-designer', 'product-ops',
    'numerical-planner', 'product-planner', 'brand-manager',
    'new-media', 'ad-optimizer', 'publishing-manager',
  ],

  // Source Whitelist（扩充至30+可信AI域名）
  SOURCE_WHITELIST: [
    // 中文媒体
    '36kr.com', 'jiqizhixin.com', 'sspai.com', 'ithome.com',
    'pingwest.com', 'geekpark.net', 'leiphone.com',
    // 英文科技媒体
    'theverge.com', 'techcrunch.com', 'arstechnica.com',
    'venturebeat.com', 'technologyreview.com', 'wired.com',
    'engadget.com', 'zdnet.com', 'tomsguide.com',
    // AI公司官方
    'openai.com', 'anthropic.com', 'google.com', 'deepmind.google',
    'meta.com', 'ai.meta.com', 'stability.ai', 'midjourney.com',
    'runway.com', 'nvidia.com', 'nvidianews.nvidia.com',
    // 开发者社区
    'github.com', 'huggingface.co', 'producthunt.com',
    'ycombinator.com', 'news.ycombinator.com',
    // 创意与设计
    'creativebloq.com', 'petapixel.com',
  ],
};
