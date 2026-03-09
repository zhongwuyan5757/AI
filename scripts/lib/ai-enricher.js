/**
 * ai-enricher.js — AI 智能分类与标签模块
 *
 * 使用 Claude API 对新闻/工具/模型进行智能分类和内容增强。
 * 如果没有 API Key，自动使用基于关键词的 heuristic 规则。
 */
const config = require('../config');

let anthropicClient = null;

// 惰性初始化 Anthropic Client
function getClient() {
  if (!config.AI_ENABLED) return null;
  if (anthropicClient) return anthropicClient;
  try {
    const Anthropic = require('@anthropic-ai/sdk');
    anthropicClient = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
    return anthropicClient;
  } catch {
    console.warn('[ai-enricher] @anthropic-ai/sdk 未安装，使用 heuristic 模式');
    return null;
  }
}

// ============ 新闻分类 ============

/**
 * 新闻分类 + 关联岗位
 * @param {{ title: string, summary: string }} item
 * @returns {Promise<{ category: string, relatedJobs: string[], tags: string[] }>}
 */
async function classifyNews(item) {
  const client = getClient();
  if (client) {
    return classifyNewsAI(client, item);
  }
  return classifyNewsHeuristic(item);
}

async function classifyNewsAI(client, item) {
  const categories = Object.keys(config.NEWS_CATEGORIES);
  const jobs = config.JOB_IDS;

  try {
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `对以下 AI 新闻进行分类。

标题: ${item.title}
摘要: ${item.summary || ''}

请返回 JSON（不要 markdown）：
{
  "category": "从这些中选一个: ${categories.join(', ')}",
  "relatedJobs": ["从这些中选0-3个相关岗位: ${jobs.join(', ')}"],
  "tags": ["1-3个关键词标签"]
}`,
      }],
    });

    const text = resp.content[0]?.text || '';
    const json = JSON.parse(text);
    return {
      category: categories.includes(json.category) ? json.category : 'industry-product',
      relatedJobs: (json.relatedJobs || []).filter(j => jobs.includes(j)),
      tags: (json.tags || []).slice(0, 3),
    };
  } catch (err) {
    console.warn(`[ai-enricher] AI 分类失败，回退 heuristic: ${err.message}`);
    return classifyNewsHeuristic(item);
  }
}

function classifyNewsHeuristic(item) {
  const text = `${item.title} ${item.summary || ''}`.toLowerCase();

  // 意图导向分类规则（与前端 tabs 对齐）
  const rules = [
    // 模型更新 — model releases, benchmarks, capabilities
    { keywords: ['模型', 'gpt', 'claude', 'gemini', 'llama', 'deepseek', '发布', '更新', '版本', 'benchmark', 'release', 'launch', 'parameter', '参数', 'finetune', '微调', 'mistral', 'qwen', '千问'], category: 'model-update', jobs: [] },
    // 工具与工作流 — tools, plugins, workflow automation
    { keywords: ['midjourney', '图像', '设计', 'stable diffusion', 'photoshop', 'canva', 'figma', '出图', '画图', '视频', 'runway', 'sora', 'kling', '可灵', '剪辑', 'video', '工具', 'tool', 'cursor', 'copilot', 'workflow', '工作流', 'automation', '自动化', 'plugin', '插件', 'notion', 'perplexity', 'chatbot', 'playground', 'app'], category: 'tools-workflow', jobs: ['graphic-designer', 'video-designer', 'product-ops'] },
    // 深度观点 — analysis, opinion, trends
    { keywords: ['观点', '分析', '趋势', '展望', '评论', '解读', '深度', '影响', '变革', 'transform', 'future', '未来', '挑战', 'insight', '洞察', '伦理', 'ethics', '监管', 'regulation'], category: 'deep-insight', jobs: [] },
    // 行业与产品 — company news, products, investments, ops
    { keywords: ['运营', '活动', '用户增长', '数据分析', '报告', '策划', '玩法', '游戏设计', '增长', '广告', '投放', 'roi', '买量', '发行', '融资', '收购', '合作', '公司', 'startup', '产品', 'product'], category: 'industry-product', jobs: ['product-ops', 'ad-optimizer', 'publishing-manager'] },
  ];

  for (const rule of rules) {
    if (rule.keywords.some(k => text.includes(k))) {
      return {
        category: rule.category,
        relatedJobs: rule.jobs,
        tags: extractTags(text),
      };
    }
  }

  return { category: 'industry-product', relatedJobs: [], tags: extractTags(text) };
}

// ============ 工具分类 ============

/**
 * 工具分类
 * @param {{ name: string, description: string }} item
 * @returns {Promise<{ category: string, targetJobs: string[], difficulty: string }>}
 */
async function classifyTool(item) {
  const client = getClient();
  if (client) {
    return classifyToolAI(client, item);
  }
  return classifyToolHeuristic(item);
}

async function classifyToolAI(client, item) {
  const categories = Object.keys(config.TOOL_CATEGORIES);
  const jobs = config.JOB_IDS;

  try {
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `对以下 AI 工具进行分类和评估。

工具名: ${item.name}
描述: ${item.description || ''}

请返回 JSON（不要 markdown）：
{
  "category": "从这些中选: ${categories.join(', ')}",
  "targetJobs": ["从这些中选1-4个适用岗位: ${jobs.join(', ')}"],
  "difficulty": "beginner | intermediate | advanced",
  "features": ["3-5个核心功能"],
  "pros": ["2-3个优点"],
  "cons": ["1-2个不足"]
}`,
      }],
    });

    const json = JSON.parse(resp.content[0]?.text || '{}');
    return {
      category: categories.includes(json.category) ? json.category : 'productivity',
      targetJobs: (json.targetJobs || []).filter(j => jobs.includes(j)),
      difficulty: ['beginner', 'intermediate', 'advanced'].includes(json.difficulty) ? json.difficulty : 'beginner',
      features: (json.features || []).slice(0, 5),
      pros: (json.pros || []).slice(0, 3),
      cons: (json.cons || []).slice(0, 2),
    };
  } catch (err) {
    console.warn(`[ai-enricher] AI 分类失败: ${err.message}`);
    return classifyToolHeuristic(item);
  }
}

function classifyToolHeuristic(item) {
  const text = `${item.name} ${item.description || ''}`.toLowerCase();

  if (/image|图像|设计|draw|paint|diffusion|midjourney/i.test(text)) {
    return { category: 'image', targetJobs: ['graphic-designer'], difficulty: 'beginner', features: [], pros: [], cons: [] };
  }
  if (/video|视频|剪辑|runway|sora/i.test(text)) {
    return { category: 'video', targetJobs: ['video-designer'], difficulty: 'intermediate', features: [], pros: [], cons: [] };
  }
  if (/code|编程|开发|github|cursor|copilot/i.test(text)) {
    return { category: 'code', targetJobs: ['product-planner'], difficulty: 'intermediate', features: [], pros: [], cons: [] };
  }
  if (/audio|音乐|音频|suno|music/i.test(text)) {
    return { category: 'audio', targetJobs: ['video-designer'], difficulty: 'beginner', features: [], pros: [], cons: [] };
  }
  if (/chat|对话|写作|文案|gpt|claude/i.test(text)) {
    return { category: 'text', targetJobs: ['product-ops', 'brand-manager'], difficulty: 'beginner', features: [], pros: [], cons: [] };
  }

  return { category: 'productivity', targetJobs: ['product-ops'], difficulty: 'beginner', features: [], pros: [], cons: [] };
}

// ============ 编辑智能增强（Phase 2） ============

/**
 * 为新闻生成编辑智能字段：why_it_matters, fit_for, recommended_path, editor_note
 * @param {{ title: string, summary: string, category: string, tags: string[] }} item
 * @returns {Promise<{ why_it_matters: string, fit_for: string[], recommended_path: string, editor_note: string }>}
 */
async function enrichNewsEditorial(item) {
  const client = getClient();
  if (client) {
    return enrichNewsEditorialAI(client, item);
  }
  return enrichNewsEditorialHeuristic(item);
}

async function enrichNewsEditorialAI(client, item) {
  const ROLES = ['设计', '视频', '运营', '策划', '品牌', '新媒体', '投放', '发行', '数值'];
  const PATHS = ['7day-beginner', '5day-efficiency', '5day-advanced'];

  try {
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `你是游戏行业AI学习平台的编辑。为以下新闻生成编辑智能字段。

标题: ${item.title}
摘要: ${item.summary || ''}
分类: ${item.category}

返回JSON（不要markdown）：
{
  "why_it_matters": "一句话说明为什么值得关注（8-20字，面向游戏行业从业者）",
  "fit_for": ["从这些角色中选1-3个最相关的: ${ROLES.join(', ')}，如果所有角色都相关则返回['全员']"],
  "recommended_path": "从 ${PATHS.join(', ')} 中选一个最适合的学习路径，如果都不太适合则返回空字符串",
  "editor_note": "如果这条新闻有特别值得关注的看点（如重大融资、行业转折、技术突破），写一句编辑点评（10-25字），否则返回空字符串"
}`,
      }],
    });

    const json = JSON.parse(resp.content[0]?.text || '{}');
    return {
      why_it_matters: (json.why_it_matters || '').substring(0, 40),
      fit_for: (json.fit_for || []).filter(r => ROLES.includes(r) || r === '全员').slice(0, 3),
      recommended_path: PATHS.includes(json.recommended_path) ? json.recommended_path : '',
      editor_note: (json.editor_note || '').substring(0, 50),
    };
  } catch (err) {
    console.warn(`[ai-enricher] AI编辑增强失败，回退heuristic: ${err.message}`);
    return enrichNewsEditorialHeuristic(item);
  }
}

function enrichNewsEditorialHeuristic(item) {
  const text = `${item.title} ${item.summary || ''}`.toLowerCase();

  // === why_it_matters 规则 ===
  const WHY_RULES = [
    { test: /融资|收购|invest|acqui|funding|ipo|估值/i, why: '影响行业资本走向与竞争格局' },
    { test: /发布|launch|release|更新|upgrade|新版/i, why: '新工具/模型可能改变现有工作流' },
    { test: /开源|open.?source/i, why: '开源资源可直接提升团队能力' },
    { test: /agent|智能体|自动化|automation|workflow/i, why: '自动化趋势将重塑岗位协作模式' },
    { test: /benchmark|评测|对比|排名|性能/i, why: '影响模型选型策略' },
    { test: /监管|regulation|合规|伦理|ethic|政策|law/i, why: '合规政策影响产品上线与市场策略' },
    { test: /图像|image|视频|video|设计|design|创意/i, why: '创意生产工具直接影响内容效率' },
    { test: /游戏|game|玩法|引擎|unity|unreal/i, why: '直接关联游戏行业生产流程' },
  ];

  let why_it_matters = '值得了解的行业动态';
  for (const rule of WHY_RULES) {
    if (rule.test.test(text)) { why_it_matters = rule.why; break; }
  }

  // === fit_for 规则 ===
  const FIT_RULES = [
    { test: /图像|image|设计|design|midjourney|diffusion|photoshop|canva|figma|画/i, roles: ['设计'] },
    { test: /视频|video|runway|sora|kling|可灵|剪辑|capcut/i, roles: ['视频'] },
    { test: /运营|用户|增长|数据分析|留存|社区|活跃/i, roles: ['运营'] },
    { test: /策划|玩法|系统|游戏设计|关卡|叙事/i, roles: ['策划'] },
    { test: /品牌|品宣|市场|marketing|公关/i, roles: ['品牌'] },
    { test: /新媒体|社交|短视频|自媒体|内容|小红书|抖音/i, roles: ['新媒体'] },
    { test: /投放|广告|买量|roi|cpa|cpc|素材|ad/i, roles: ['投放'] },
    { test: /发行|海外|上线|渠道|分发|本地化|locali/i, roles: ['发行'] },
    { test: /数值|数据|平衡|经济|付费|monetiz|analytics/i, roles: ['数值'] },
  ];

  let fit_for = [];
  for (const rule of FIT_RULES) {
    if (rule.test.test(text)) fit_for.push(...rule.roles);
  }
  fit_for = [...new Set(fit_for)].slice(0, 3);
  if (fit_for.length === 0) fit_for = ['全员'];

  // === recommended_path 规则 ===
  let recommended_path = '';
  if (/入门|基础|beginner|教程|tutorial|学习|怎么用|getting.?start/i.test(text)) {
    recommended_path = '7day-beginner';
  } else if (/效率|workflow|自动化|automation|批量|工具链|提效/i.test(text)) {
    recommended_path = '5day-efficiency';
  } else if (/进阶|advanced|深度|定制|fine.?tun|api|架构|prompt.?engineer/i.test(text)) {
    recommended_path = '5day-advanced';
  }

  // === editor_note 规则（仅重大事件） ===
  let editor_note = '';
  if (/\$\d+[mb]|亿|billion|million|融资|收购|acqui/i.test(text)) {
    editor_note = '大额资本事件，反映行业信心方向';
  } else if (/首次|first|突破|breakthrough|世界第一|state.?of.?the.?art|新纪录/i.test(text)) {
    editor_note = '里程碑事件，值得重点关注';
  } else if (/争议|controversy|安全|safety|风险|risk|禁止|ban/i.test(text)) {
    editor_note = '争议性话题，关注行业治理走向';
  }

  return { why_it_matters, fit_for, recommended_path, editor_note };
}

// ============ 辅助函数 ============

function extractTags(text) {
  const tagMap = [
    'ChatGPT', 'Claude', 'Gemini', 'GPT-4', 'Midjourney', 'Stable Diffusion',
    'Runway', 'Sora', 'DeepSeek', 'LLM', 'AIGC', 'Cursor', 'Copilot',
    'HuggingFace', 'OpenAI', 'Anthropic', 'Google', 'Meta',
  ];
  const lower = text.toLowerCase();
  return tagMap.filter(t => lower.includes(t.toLowerCase())).slice(0, 3);
}

module.exports = { classifyNews, classifyTool, enrichNewsEditorial };
