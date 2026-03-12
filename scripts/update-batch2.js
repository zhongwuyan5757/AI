#!/usr/bin/env node
/**
 * batch-2 内容升级脚本
 * 升级范围：3 个工具 (gemini, deepseek, perplexity) + 5 个 Prompt (p002, p003, p005, p007, p012)
 */
const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

// ===== 工具扩展数据 =====

const toolExtensions = {
  gemini: {
    verdict: '深度整合 Google 生态的全能 AI 助手。如果你重度使用 Gmail/Docs/Sheets，Gemini 是最自然的选择；否则 ChatGPT 功能更全面。',
    bestFor: '已在 Google Workspace 生态内工作、需要 Deep Research 深度调研、需要超长上下文（100 万 token）处理长文档的用户',
    notFor: '不使用 Google 生态、需要成熟插件市场和 GPTs 生态、或团队已标准化使用 ChatGPT/Claude 的用户',
    strengths: [
      'Deep Research 功能强大——自动多轮搜索、整合信息、生成带引用的完整报告',
      '100 万 token 上下文窗口，处理超长文档（如完整设计文档、合同）无需拆分',
      '与 Google Workspace 深度集成——直接在 Gmail 中总结邮件、在 Docs 中辅助写作',
      '多模态理解能力出色，图片、视频、音频均可处理',
    ],
    limitations: [
      '插件生态远不如 ChatGPT 的 GPTs 商店丰富',
      '中文创意写作能力略逊于 ChatGPT 和 Claude',
      '免费版使用次数限制较严，高峰期经常提示用量超限',
      'Ultra 套餐 $249.99/月 定价偏高，性价比不如 ChatGPT Pro',
    ],
    pricingAdvice: '免费版体验 Deep Research 和基本对话。如果频繁使用且在 Google 生态内，Pro（$19.99/月）值得订阅。Ultra 仅推荐给重度 AI 用户。',
    vsAlternatives: [
      {
        rival: 'chatgpt',
        verdict: 'Google 生态用户选 Gemini，功能全面性选 ChatGPT',
        pickThis: '重度 Google Workspace 用户、需要 Deep Research 深度调研功能',
        pickThat: '需要 GPTs 生态、图片生成、语音对话、或更成熟的插件市场',
      },
      {
        rival: 'claude',
        verdict: '长文档选 Gemini（上下文更长），深度写作选 Claude（质量更高）',
        pickThis: '需要处理超过 20 万字的文档、需要多模态分析（视频/音频）',
        pickThat: '需要高质量长文写作、代码辅助、或 Projects 知识库管理',
      },
      {
        rival: 'perplexity',
        verdict: '深度调研选 Gemini Deep Research，快速搜索选 Perplexity',
        pickThis: '需要自动化多轮调研生成完整报告、需要综合分析能力',
        pickThat: '需要快速精准搜索、需要实时信息且重视来源引用的场景',
      },
    ],
    quickStart: '1. 访问 gemini.google.com 用 Google 账号登录\n2. 试试 Deep Research：输入一个调研话题，让 Gemini 自动生成完整报告\n3. 在 Gmail 中点击 Gemini 图标，体验邮件总结功能',
    timeToValue: '5 分钟',
    relatedTutorials: ['t001', 't004'],
    relatedPrompts: ['p003', 'p008'],
    relatedPaths: ['ops-ai-path'],
    lastUpdated: '2026-03-12',
  },

  deepseek: {
    verdict: '中文能力顶尖的免费 AI 工具。推理和代码能力强，完全免费无限制。预算有限或主要用中文工作场景的首选。',
    bestFor: '预算有限想免费使用顶级 AI、中文内容创作和分析为主、需要强推理能力（数学/逻辑/代码）的用户',
    notFor: '需要多模态能力（图片/语音/视频）、需要插件生态和工作流集成、或对响应速度要求极高的用户',
    strengths: [
      '完全免费无限制——没有每日用量上限，可以放心大量使用',
      '中文理解和生成质量在免费工具中最佳，游戏文案、运营方案等中文场景表现突出',
      '深度思考（DeepThink）模式推理能力强，复杂逻辑分析和数学问题表现优异',
      '开源模型，支持私有化部署，数据安全可控',
    ],
    limitations: [
      '不支持图片生成、语音对话等多模态功能',
      '高峰期服务器压力大，偶尔响应较慢或排队',
      '没有插件/应用市场，无法扩展功能',
      '联网搜索能力有限，实时信息获取不如 Perplexity',
    ],
    pricingAdvice: '完全免费，直接使用即可。如果需要更稳定的服务和 API 调用，可以考虑充值 API 额度（按量计费，价格极低）。',
    vsAlternatives: [
      {
        rival: 'chatgpt',
        verdict: '预算有限选 DeepSeek（免费），功能全面选 ChatGPT（付费）',
        pickThis: '不想花钱、中文场景为主、需要强推理能力',
        pickThat: '需要多模态（图片/语音/视频）、GPTs 生态、或英文场景为主',
      },
      {
        rival: 'claude',
        verdict: '免费方案选 DeepSeek，付费深度写作选 Claude',
        pickThis: '零预算、短中文内容生成、数学和逻辑推理任务',
        pickThat: '需要写 1 万字以上长方案、需要 Projects 知识库、或代码辅助',
      },
      {
        rival: 'kimi',
        verdict: '通用中文对话选 DeepSeek（推理更强），长文档处理选 Kimi',
        pickThis: '需要深度思考和逻辑推理、免费无限制使用',
        pickThat: '需要处理超长 PDF/文档、需要更好的文件上传和解析体验',
      },
    ],
    quickStart: '1. 访问 chat.deepseek.com，注册账号（支持手机号）\n2. 开启"深度思考"模式，体验复杂推理能力\n3. 试着让它写一份活动策划方案，感受中文输出质量',
    timeToValue: '3 分钟',
    relatedTutorials: ['t001'],
    relatedPrompts: ['p001', 'p009'],
    relatedPaths: ['ops-ai-path'],
    lastUpdated: '2026-03-12',
  },

  perplexity: {
    verdict: 'AI 搜索的标杆产品。当你需要「快速搞清楚一件事」时，Perplexity 比传统搜索引擎和通用 AI 都更高效——每个回答自带来源引用。',
    bestFor: '需要快速调研并引用来源、做竞品分析和市场调研、写报告需要真实数据支撑的用户',
    notFor: '需要长文创意写作、需要图片/视频生成、或需要复杂多轮对话构建方案的用户',
    strengths: [
      '每个回答都附带来源链接——你可以验证信息准确性，用在报告里也有出处',
      '实时联网搜索，信息时效性远超 ChatGPT/Claude 的训练数据',
      'Pro Search 自动追问、多角度搜索，一个问题就能得到全面调研结果',
      '界面简洁高效，没有多余功能干扰，打开就搜、搜完就用',
    ],
    limitations: [
      '创意写作和长文生成能力明显弱于 ChatGPT/Claude',
      '不支持图片生成、语音对话等多模态功能',
      '免费版每天 Pro Search 次数有限（约 5 次），重度使用需付费',
      '中文搜索结果质量不如英文，中文来源的覆盖面有待提升',
    ],
    pricingAdvice: '免费版足够日常轻度搜索使用。如果每天需要做超过 5 次深度调研，Pro（$20/月）值得订阅——无限 Pro Search + 上传文件搜索。',
    vsAlternatives: [
      {
        rival: 'chatgpt',
        verdict: '快速调研选 Perplexity（带来源），创意生成选 ChatGPT（更全面）',
        pickThis: '需要带引用的调研结果、需要实时信息、写报告需要数据支撑',
        pickThat: '需要创意写作、图片生成、多轮对话构建复杂方案',
      },
      {
        rival: 'gemini',
        verdict: '快速精准搜索选 Perplexity，深度自动化调研选 Gemini Deep Research',
        pickThis: '需要即时搜索、每个回答要有来源引用、简洁高效',
        pickThat: '需要自动多轮深度调研并生成长报告、或需要 Google 生态集成',
      },
    ],
    quickStart: '1. 访问 perplexity.ai（无需注册即可使用）\n2. 输入一个调研问题，如"2026年中国手游市场规模"\n3. 查看回答底部的来源链接，验证信息准确性',
    timeToValue: '1 分钟',
    relatedTutorials: ['t004'],
    relatedPrompts: ['p003', 'p008'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },
};

// ===== Prompt 扩展数据 =====

const promptExtensions = {
  p002: {
    taskCategory: '写文案',
    taskDesc: '批量生成 5 条不同角度的游戏广告投放文案，覆盖不同卖点和受众心理',
    whenToUse: '当你需要快速产出一批投放素材进行 A/B 测试、或者当前文案创意枯竭需要新角度时',
    whenNotToUse: '当你需要写品牌层面的长文案（如品牌故事、TVC 脚本），AI 生成的短文案适合效果广告，不适合品牌广告',
    inputGuide: {
      '游戏名': { desc: '你推广的游戏名称', good: '原神、王者荣耀、明日方舟', bad: '我的游戏', tip: '用正式名称，AI 可能认识热门游戏并参考其风格' },
      '类型': { desc: '游戏核心玩法类型', good: '二次元卡牌RPG、开放世界冒险、SLG策略', bad: '手游', tip: '越具体越好，影响文案调性' },
      '卖点1-3': { desc: '你想在文案中突出的核心卖点', good: '150+可收集角色、全语音剧情、实时PVP', bad: '好玩', tip: '写 2-3 个具体卖点，每条文案会侧重不同卖点' },
      '目标用户': { desc: '这批文案面向的玩家群体', good: '18-25岁二次元爱好者、30+岁策略游戏老玩家', bad: '所有人', tip: '细分受众让文案更有针对性' },
      '平台': { desc: '投放的广告平台', good: '抖音信息流、B站、小红书', bad: '网上', tip: '不同平台文案风格差异大，抖音要短平快，B站可以玩梗' },
    },
    exampleFull: {
      input: '游戏名=明日方舟 类型=二次元塔防策略 卖点1=200+干员收集 卖点2=末日废土世界观 卖点3=高难关卡策略深度 目标用户=20-30岁策略游戏爱好者 平台=B站',
      outputSummary: '生成 5 条文案：① 收集向（"200+干员等你指挥"）② 世界观向（"末日之后，谁来守护最后的净土"）③ 策略向（"这关你能三星通关吗？"）④ 社交向（"你的练度够打危机合约吗"）⑤ 情感向（"博士，欢迎回来"），每条附投放建议。',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '5 条文案风格雷同，没有差异化角度', cause: '卖点只填了 1 个，AI 无法分化角度', fix: '至少提供 3 个不同维度的卖点（如玩法+剧情+社交）' },
      { symptom: '文案太像广告模板，不像真人写的', cause: '没有指定平台和受众', fix: '加上"平台=抖音，受众=大学生"等具体信息，让 AI 调整语气' },
      { symptom: '文案太长，不适合信息流投放', cause: '默认生成偏长文案', fix: '在 Prompt 末尾补充"每条文案控制在 30 字以内"' },
    ],
    optimizationTips: [
      '在 Prompt 末尾加"请同时为每条文案推荐一个配图方向"，一次性搞定文案+视觉',
      '要求"用第二人称写，制造紧迫感"——效果广告用"你"比"我们"转化率更高',
      '生成后让 AI 自评"这 5 条中哪条点击率最高？为什么？"——利用 AI 做初步筛选',
    ],
    versions: {
      lite: { label: '快速版', desc: '只需游戏名和类型，3 秒出 5 条文案', prompt: '你是广告文案专家。为{游戏名}（{类型}）写 5 条不同角度的广告文案，每条 30 字以内。' },
      advanced: { label: '精细版', desc: '完整控制受众、平台、卖点，输出附投放建议', promptDiff: '+ 指定目标平台和受众\n+ 每条附带推荐配图方向\n+ 标注适用投放位置（信息流/开屏/搜索）' },
    },
    relatedTools: ['chatgpt'],
    relatedTutorials: ['t008'],
    relatedPrompts: ['p005', 'p017'],
    relatedPaths: [],
  },

  p003: {
    taskCategory: '做分析',
    taskDesc: '基于竞品信息快速生成一份多维度竞品分析报告，包含功能对比、差异化策略和行动建议',
    whenToUse: '当你需要在立项评审、版本规划会或投资汇报前快速产出竞品分析时',
    whenNotToUse: '当你需要基于第一手数据（如竞品 DAU、收入）做分析时——AI 不掌握未公开数据，需要你提供',
    inputGuide: {
      '产品名': { desc: '你自己的产品名称', good: '幻塔、逆水寒手游', bad: '我们的游戏', tip: '用正式名称，AI 可能了解你的产品' },
      '产品类型': { desc: '产品的核心品类', good: '开放世界ARPG手游、SLG策略手游', bad: '游戏', tip: '品类信息帮助 AI 确定对比维度' },
      '竞品1-3': { desc: '你要分析的竞品名称', good: '原神、鸣潮、绝区零', bad: '竞品A', tip: '用真实竞品名，AI 可以调用已知信息' },
      '分析维度': { desc: '你关注的对比维度', good: '付费模型、用户留存策略、内容更新节奏', bad: '全面分析', tip: '指定 3-5 个维度比"全面分析"更有针对性' },
    },
    exampleFull: {
      input: '产品名=幻塔 产品类型=开放世界ARPG手游 竞品=原神、鸣潮、绝区零 分析维度=付费模型、内容更新节奏、玩家社区运营',
      outputSummary: '生成 3000 字报告：① 竞品概览表格 ② 三个维度逐一对比分析 ③ 差异化机会点（如：幻塔的 MMO 社交是原神没有的差异化优势）④ 行动建议清单',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '分析很泛，没有具体数据支撑', cause: 'AI 不掌握非公开数据', fix: '在 Prompt 中直接提供你掌握的数据（如畅销榜排名、公开财报数据），让 AI 基于真实数据分析' },
      { symptom: '分析维度太多太杂', cause: '没有指定具体分析维度', fix: '明确指定 3-5 个你最关心的维度，避免 AI 发散' },
      { symptom: '结论没有行动指导意义', cause: '缺乏"我方产品"的上下文', fix: '在 Prompt 中补充你的产品当前状态和面临的问题，让 AI 的建议更有针对性' },
    ],
    optimizationTips: [
      '用 Perplexity 先搜一轮竞品最新数据，把搜索结果作为补充材料粘贴进 Prompt',
      '要求"输出一张竞品对比矩阵表格"——表格比文字更适合在评审会上展示',
      '分析完后追问"基于以上分析，我们最应该优先做的 3 件事是什么？"——把分析转化为行动',
    ],
    versions: {
      lite: { label: '快速版', desc: '只需竞品名称，5 分钟出框架', prompt: '你是游戏行业分析师。对比{我方产品}和{竞品1}、{竞品2}的核心差异，给出 3 条差异化建议。' },
      advanced: { label: '深度版', desc: '多维度深度分析，输出完整报告', promptDiff: '+ 指定 3-5 个分析维度\n+ 要求输出对比矩阵表格\n+ 附带数据来源说明\n+ 结尾给出优先级排序的行动清单' },
    },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: ['t015'],
    relatedPrompts: ['p008', 'p004'],
    relatedPaths: [],
  },

  p005: {
    taskCategory: '产内容',
    taskDesc: '根据游戏信息和平台特性，生成一份包含分镜、台词、时间轴的完整短视频脚本',
    whenToUse: '当你需要快速产出短视频脚本初稿、或者视频选题和结构没有头绪需要 AI 帮忙破冰时',
    whenNotToUse: '当你做纯游戏实机录制剪辑（不需要脚本），或者需要高度创意的品牌大片脚本时',
    inputGuide: {
      '平台': { desc: '视频发布的平台', good: '抖音、B站、小红书', bad: '短视频', tip: '不同平台节奏差异大：抖音前3秒抓人，B站可以铺垫' },
      '视频类型': { desc: '视频的内容形式', good: '游戏实机+口播、纯口播测评、剧情短片', bad: '视频', tip: '形式决定脚本结构' },
      '视频时长': { desc: '目标视频时长', good: '30秒、60秒、3分钟', bad: '短的', tip: '时长直接决定内容密度' },
      '核心主题': { desc: '这条视频要传达什么', good: '新版本3个必玩内容、为什么这游戏值得回坑', bad: '宣传游戏', tip: '一条视频只讲一个核心观点' },
    },
    exampleFull: {
      input: '平台=抖音 视频类型=游戏实机+口播 视频时长=30秒 核心主题=原神5.0海岛地图3个隐藏彩蛋',
      outputSummary: '生成完整脚本：① 开头钩子（"这3个彩蛋99%的人没找到"）② 三段内容各8秒（彩蛋1→彩蛋2→彩蛋3）③ 结尾引导（"第3个你绝对想不到"）④ 附带画面指示和BGM建议',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '脚本读起来像文章，不像视频节奏', cause: '没有指定平台和时长', fix: '明确告诉 AI"这是抖音30秒视频"，并要求"标注每段时间轴"' },
      { symptom: '开头太平，没有吸引力', cause: 'AI 默认按逻辑顺序展开', fix: '要求"前3秒必须用悬念/反问/数字钩子开头"' },
      { symptom: '内容太多塞不进时长', cause: '核心主题太宽泛', fix: '把主题缩窄到"1个核心观点+3个支撑点"' },
    ],
    optimizationTips: [
      '生成后让 AI 自己读一遍并标注"预计每段耗时"——帮你判断时长是否合理',
      '要求"同时生成3个不同钩子开头的版本"——选择困难时让 AI 帮你做 A/B 方案',
      '追问"这个脚本的评论区预期是什么？怎么引导互动？"——把评论区运营也考虑进去',
    ],
    versions: {
      lite: { label: '快速版', desc: '一句话主题，出完整脚本', prompt: '你是短视频编导。为{平台}写一个{时长}的视频脚本，主题：{主题}。要求标注时间轴和画面指示。' },
      advanced: { label: '完整版', desc: '含分镜表、台词、BGM、引导语', promptDiff: '+ 输出分镜表格式（时间/画面/台词/音效）\n+ 3个备选开头钩子\n+ 评论区互动引导语\n+ 封面标题推荐' },
    },
    relatedTools: ['chatgpt'],
    relatedTutorials: ['t012'],
    relatedPrompts: ['p002', 'p010'],
    relatedPaths: [],
  },

  p007: {
    taskCategory: '做分析',
    taskDesc: '将一批用户反馈/评论自动分类、提取核心洞察，输出结构化分析报告',
    whenToUse: '当你有一批用户评论/反馈需要整理（如 App Store 评论、问卷回复、客服记录），人工分类太耗时时',
    whenNotToUse: '当反馈数据量超过 5000 条时——建议先用 Excel 预处理筛选后再分批给 AI 分析',
    inputGuide: {
      '反馈数据': { desc: '你要分析的原始反馈文本', good: '直接粘贴 20-100 条评论原文', bad: '用户说游戏不好', tip: '原始数据越多越好，至少 20 条才有统计意义' },
      '分类维度': { desc: '你希望反馈按什么维度分类', good: 'Bug反馈/功能建议/内容需求/体验问题/正面评价', bad: '帮我分类', tip: '预设分类维度让结果更可控，也可以让 AI 自动识别' },
      '重点关注': { desc: '你当前最关心的问题方向', good: '付费体验相关反馈、新手流失原因', bad: '所有问题', tip: '指定重点让 AI 对该类反馈做更深入分析' },
    },
    exampleFull: {
      input: '反馈数据=[粘贴50条App Store评论] 分类维度=Bug/功能建议/内容需求/体验问题/正面评价 重点关注=新手前7天流失相关',
      outputSummary: '生成分析报告：① 分类汇总表（各类数量和占比）② 每类 Top3 高频关键词 ③ 重点分析：新手流失相关反馈（12条，核心问题是"新手引导不清楚"和"前期太难"）④ 优先级排序的改进建议',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '分类太笼统，一半反馈都归入"其他"', cause: '分类维度不够细', fix: '预设 6-8 个具体分类，并要求"其他类不超过 10%，超过则细分"' },
      { symptom: '只列出了分类，没有深入洞察', cause: '没有要求分析结论', fix: '明确要求"每个类别给出 Top3 高频问题 + 建议"' },
      { symptom: 'AI 跳过了部分反馈没分析', cause: '一次性给的数据太多', fix: '每次粘贴 50-100 条，超过的分批处理后合并结果' },
    ],
    optimizationTips: [
      '先让 AI 阅读全部反馈后"先列出你发现的分类维度"，再让它按自己发现的维度分析——有时 AI 的分类比你预设的更合理',
      '分析完后追问"如果你是产品经理，基于这些反馈你会做的第一件事是什么？"——把洞察转化为行动',
      '要求"用表格输出，每行一条反馈，列包括：原文/分类/情绪/关键词/建议"——方便粘贴到 Excel 继续加工',
    ],
    versions: {
      lite: { label: '快速版', desc: '粘贴反馈，自动分类+统计', prompt: '你是用户研究专家。分析以下用户反馈，自动分类并统计各类数量和占比：\n\n{反馈数据}' },
      advanced: { label: '深度版', desc: '定制分类维度+深度洞察+行动建议', promptDiff: '+ 指定分类维度\n+ 每类提取 Top3 高频关键词\n+ 重点分析指定方向\n+ 输出表格格式便于二次加工\n+ 结尾附带优先级排序的行动建议' },
    },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p009', 'p003'],
    relatedPaths: ['ops-ai-path'],
  },

  p012: {
    taskCategory: '写文案',
    taskDesc: '将技术性的版本更新内容转化为玩家友好、有吸引力的版本公告',
    whenToUse: '当新版本要发公告/更新日志时，需要把开发给的 Changelog 转化为玩家看得懂、看了想玩的公告文案',
    whenNotToUse: '当你需要写技术文档给开发团队看时——这个 Prompt 是面向玩家的，不是面向技术人员的',
    inputGuide: {
      '游戏名': { desc: '你的游戏名称', good: '明日方舟、王者荣耀', bad: '游戏', tip: '帮助 AI 匹配语气风格' },
      '版本号': { desc: '本次更新的版本号', good: 'v3.2.0、2026年3月版本', bad: '新版本', tip: '版本号让公告更正式' },
      '更新内容': { desc: '开发给你的原始更新列表', good: '1. 新增角色"XX" 2. 优化匹配算法 3. 修复闪退bug', bad: '更新了一些东西', tip: '尽量详细，包含新增/优化/修复三类' },
      '公告语气': { desc: '想要的文案风格', good: '活泼可爱风、正式专业风、玩梗吐槽风', bad: '正常写', tip: '语气要和游戏调性一致' },
    },
    exampleFull: {
      input: '游戏名=明日方舟 版本号=v4.0.0 更新内容=[新增限定6星干员"伊芙利特·夏日"、新增夏日活动关卡8个、优化基建UI、修复13个已知Bug] 公告语气=活泼官方',
      outputSummary: '生成公告：① 标题钩子（"博士，夏日作战开始了"）② 亮点前置（新干员+活动介绍，配建议配图位置）③ 优化说明（基建UI，用"你们催了很久的终于来了"拉近距离）④ Bug修复（简要带过）⑤ 结尾引导（"记得领补偿合成玉"）',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '公告读起来像技术文档，不像给玩家看的', cause: '直接粘贴了开发给的 Changelog 没有加工', fix: '要求"用玩家听得懂的语言重写，把技术术语转化为玩家感知到的变化"' },
      { symptom: '所有更新内容篇幅一样，没有重点', cause: '没有告诉 AI 哪些是本版本亮点', fix: '在更新内容前标注"★重点"和"普通"，让 AI 分配篇幅' },
      { symptom: '语气和游戏风格不匹配', cause: '没有指定语气风格', fix: '明确指定"参考XX游戏的公告风格"或"用XX语气"' },
    ],
    optimizationTips: [
      '让 AI 同时生成"社交媒体精简版"——公告正文 + 适合发微博/TapTap 的 100 字摘要',
      '要求"标注建议配图位置和配图内容描述"——方便直接发给设计师出图',
      '追问"这份公告中哪些地方玩家可能会在评论区吐槽？提前准备回复话术"——预判舆情',
    ],
    versions: {
      lite: { label: '快速版', desc: '粘贴更新列表，直接出公告', prompt: '你是游戏运营文案。把以下更新内容写成一份玩家友好的版本公告：\n\n{更新内容}' },
      advanced: { label: '完整版', desc: '含公告+社媒摘要+配图指示+舆情预判', promptDiff: '+ 指定公告语气风格\n+ 同时输出社交媒体精简版\n+ 标注建议配图位置\n+ 预判评论区反应并准备回复话术' },
    },
    relatedTools: ['chatgpt'],
    relatedTutorials: ['t009'],
    relatedPrompts: ['p001', 'p014'],
    relatedPaths: ['ops-ai-path'],
  },
};

// ===== 执行更新 =====

function updateTools() {
  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf8'));
  let count = 0;
  for (const [id, ext] of Object.entries(toolExtensions)) {
    const tool = tools.find(t => t.id === id);
    if (!tool) { console.error(`  ✗ 工具 ${id} 未找到`); continue; }
    Object.assign(tool, ext);
    count++;
    console.log(`  ✓ ${id} (${tool.name}) — 添加 ${Object.keys(ext).length} 个扩展字段`);
  }
  fs.writeFileSync(TOOLS_PATH, JSON.stringify(tools, null, 2) + '\n', 'utf8');
  console.log(`\n工具更新完成：${count} 个工具已升级`);
  return count;
}

function updatePrompts() {
  const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
  let count = 0;
  for (const [id, ext] of Object.entries(promptExtensions)) {
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) { console.error(`  ✗ Prompt ${id} 未找到`); continue; }
    Object.assign(prompt, ext);
    count++;
    console.log(`  ✓ ${id} (${prompt.name}) — 添加 ${Object.keys(ext).length} 个扩展字段`);
  }
  fs.writeFileSync(PROMPTS_PATH, JSON.stringify(prompts, null, 2) + '\n', 'utf8');
  console.log(`\nPrompt 更新完成：${count} 个 Prompt 已升级`);
  return count;
}

// 执行
console.log('===== Batch-2 内容升级 =====\n');
console.log('--- 工具升级 ---');
const toolCount = updateTools();
console.log('\n--- Prompt 升级 ---');
const promptCount = updatePrompts();

// 验证
console.log('\n--- 验证 ---');
const toolsAfter = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf8'));
const promptsAfter = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
const upgradedTools = toolsAfter.filter(t => t.verdict).length;
const upgradedPrompts = promptsAfter.filter(p => p.taskCategory).length;
console.log(`工具：${upgradedTools}/35 已升级（batch-1: 3 + batch-2: ${toolCount} = ${upgradedTools}）`);
console.log(`Prompt：${upgradedPrompts}/525 已升级（batch-1: 3 + batch-2: ${promptCount} = ${upgradedPrompts}）`);
console.log('\n✅ Batch-2 数据更新完成');
