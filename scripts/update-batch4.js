#!/usr/bin/env node
/**
 * batch-4 内容升级脚本
 * 升级范围：5 个工具 (grok, elevenlabs, kling, notion-ai, canva-ai) + 8 个 Prompt (p013, p015, p018, p019, p020, p021, p022, p023)
 */
const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

// ===== 工具扩展数据 =====

const toolExtensions = {
  grok: {
    verdict: 'xAI 推出的实时信息 AI，深度整合 X（原 Twitter）平台。如果你需要实时追踪游戏行业热点、社媒舆情和玩家讨论趋势，Grok 是独家优势。',
    bestFor: '需要实时追踪社交媒体热点和舆情、关注行业动态和竞品社交表现、重度 X/Twitter 用户',
    notFor: '不使用 X 平台、需要长文写作或深度分析、需要中文社交媒体监控（Grok 主要覆盖 X 平台英文内容）',
    strengths: [
      '实时信息获取——直接接入 X 平台数据，追踪行业热点和玩家讨论的速度远超其他 AI',
      '社媒分析独家优势——可以分析 X 平台上的话题趋势、情绪走向、KOL 影响力',
      '推理能力强——Grok 4 在多项基准测试中表现优异，复杂逻辑分析不逊色于 GPT-5',
      '幽默和创意表达风格独特——生成的文案有辨识度，适合社交媒体内容',
    ],
    limitations: [
      '中文能力相对较弱，中文社交媒体（微博/小红书）的数据无法覆盖',
      '生态封闭——主要在 X 平台内使用，独立网页版功能受限',
      '图片生成能力一般，不如 Midjourney/ChatGPT 的图片生成',
      'SuperGrok 订阅价格偏高（$30/月），免费版功能受限',
    ],
    pricingAdvice: '免费版体验基础对话功能。如果你是 X Premium 订阅用户已包含 Grok 基础版。SuperGrok（$30/月）适合需要深度社媒分析和高级推理的市场团队。',
    vsAlternatives: [
      {
        rival: 'chatgpt',
        verdict: '实时社媒分析选 Grok，通用全能选 ChatGPT',
        pickThis: '需要 X 平台实时数据、社媒舆情监控、行业热点追踪',
        pickThat: '通用写作、图片生成、GPTs 生态、中文场景',
      },
      {
        rival: 'perplexity',
        verdict: '社媒热点选 Grok（X 平台独家数据），通用搜索选 Perplexity（全网来源引用）',
        pickThis: 'X/Twitter 平台数据分析、社交媒体趋势监控',
        pickThat: '全网信息搜索、需要来源引用、中文搜索',
      },
    ],
    quickStart: '1. 访问 x.com/i/grok 或下载 X 应用\n2. 使用 X 账号登录即可使用基础版\n3. 试试"分析最近一周关于XX游戏的讨论趋势"',
    timeToValue: '3 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p003', 'p007'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  elevenlabs: {
    verdict: '最强 AI 语音合成工具。声音克隆逼真度业界第一，支持 30+ 种语言，游戏角色配音、多语言旁白、有声内容制作的最佳方案。',
    bestFor: '需要游戏角色配音、多语言语音本地化、有声内容（播客/有声书/教程）制作的团队',
    notFor: '只需要基础文字转语音（系统自带 TTS 就够）、需要音乐/歌曲生成（选 Suno）',
    strengths: [
      '声音克隆逼真度最高——上传 1 分钟音频即可克隆声音，情感和语调高度还原',
      '30+ 种语言支持——同一个声音可以无缝切换不同语言，适合游戏多语言配音',
      '情感控制精准——可以调节语速、语调、情绪强度，比机械式 TTS 自然得多',
      '批量处理能力——支持脚本式批量生成，适合大规模配音项目',
    ],
    limitations: [
      '高质量语音消耗配额较快——Professional Voice Clone 每月字符数有限',
      '中文语音质量不如英文——中文语调和断句偶尔不够自然',
      '实时语音对话功能还在早期阶段，延迟较高',
      '价格较高——Creator 套餐 $22/月 仅 10 万字符，大项目需要更高套餐',
    ],
    pricingAdvice: '免费版 1 万字符/月体验基础功能。如果团队需要角色配音，Starter（$5/月）3 万字符够做 demo。正式项目推荐 Creator（$22/月）或 Pro（$99/月）。',
    vsAlternatives: [
      {
        rival: 'suno',
        verdict: '语音/配音选 ElevenLabs，音乐/歌曲选 Suno',
        pickThis: '游戏角色配音、多语言旁白、有声内容、语音克隆',
        pickThat: '游戏 BGM、营销视频配乐、歌曲创作',
      },
    ],
    quickStart: '1. 访问 elevenlabs.io 注册账号\n2. 选择 Text to Speech，选一个预设声音\n3. 输入一段游戏角色台词，体验语音合成效果',
    timeToValue: '2 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p023'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  kling: {
    verdict: '国产 AI 视频生成标杆。中文提示词效果最好、单次可生成更长视频、性价比高，中文用户做视频素材的首选。',
    bestFor: '以中文提示词为主的视频制作团队、预算有限但需要大量视频素材的运营团队、需要更长单次生成时长的用户',
    notFor: '对画面质量要求极高（如电影级宣传片）、以英文提示词为主的团队',
    strengths: [
      '中文提示词效果业界最佳——用中文描述就能准确生成想要的画面',
      '单次生成时长更长（最长 10 秒 1080p），减少拼接次数',
      '人物生成稳定性好——面部一致性和动作连贯性优于多数竞品',
      '价格友好——基础功能免费，付费套餐远低于 Runway 等海外工具',
    ],
    limitations: [
      '画面精细度和光影质感略逊于 Runway Gen-3 Alpha',
      '风格化能力有限——写实风格好但艺术风格（如赛博朋克、水墨画）不如 Runway 灵活',
      '导出分辨率有限，4K 输出还不支持',
      '国际化程度低，英文提示词效果不如中文',
    ],
    pricingAdvice: '免费版每天有生成额度，足够体验和轻度使用。标准版（¥66/月）适合日常使用，专业版（¥199/月）适合团队批量产出。',
    vsAlternatives: [
      {
        rival: 'runway',
        verdict: '中文场景+性价比选可灵，画面质量+英文场景选 Runway',
        pickThis: '中文提示词为主、预算有限、国内团队日常使用',
        pickThat: '追求最高画面质量、英文场景、需要 Motion Brush 精准控制',
      },
      {
        rival: 'sora',
        verdict: '现在能用选可灵（成熟稳定），期待顶级画质选 Sora',
        pickThis: '现在就需要大量产出视频素材、中文场景为主',
        pickThat: '不急于使用、关注 OpenAI 生态',
      },
    ],
    quickStart: '1. 访问 klingai.com 注册账号（支持手机号）\n2. 选择"文生视频"，用中文描述想要的画面\n3. 等待约 2 分钟，预览生成结果',
    timeToValue: '3 分钟',
    relatedTutorials: ['t010'],
    relatedPrompts: ['p021', 'p005'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  'notion-ai': {
    verdict: '最好的 AI 协作文档工具。直接在你的知识库中调用 AI，上下文理解能力远超独立 AI 工具——因为它能读懂你团队的所有文档。',
    bestFor: '团队已在用 Notion 管理知识库/项目/文档、需要在文档上下文中直接调用 AI、需要自动化工作流（如周报汇总）的团队',
    notFor: '不使用 Notion 的团队、需要长文深度写作（Claude 更强）、只需要对话式 AI 的个人用户',
    strengths: [
      '知识库级上下文——AI 能读懂你 Notion 中的所有文档和数据库，输出贴合团队实际',
      '行内 AI 编辑——选中文字即可让 AI 改写、翻译、总结、扩写，不离开文档',
      'AI 自动填充数据库——批量对数据库条目做分类、生成摘要、打标签',
      '与 Notion 工作流深度集成——自动化会议纪要、项目状态更新、团队周报汇总',
    ],
    limitations: [
      '只在 Notion 生态内有效——离开 Notion 就失去了上下文优势',
      '长文生成质量不如 Claude/ChatGPT——适合短段落编辑而非写 1 万字方案',
      'AI 功能需要额外付费——$10/人/月 在已有 Notion 订阅基础上叠加',
      '对中文的理解偶尔不如 ChatGPT 精准',
    ],
    pricingAdvice: '如果团队已在用 Notion，AI 附加功能（$10/人/月）非常值得——省去在 AI 工具和文档间来回复制的时间。如果还没用 Notion，不建议单独为 AI 功能迁移。',
    vsAlternatives: [
      {
        rival: 'chatgpt',
        verdict: '文档内编辑选 Notion AI（上下文好），通用对话选 ChatGPT（能力强）',
        pickThis: '在 Notion 文档中直接编辑、需要知识库上下文、团队协作场景',
        pickThat: '独立对话、需要图片生成、需要 GPTs 生态',
      },
      {
        rival: 'claude',
        verdict: '文档内快速编辑选 Notion AI，深度写作选 Claude',
        pickThis: '短段落改写/翻译/总结、数据库批量处理、团队工作流',
        pickThat: '写 1 万字完整方案、分析超长文档、需要 Projects 知识库',
      },
    ],
    quickStart: '1. 在 Notion 中打开任意页面\n2. 按空格键或输入 /ai 调出 AI 功能\n3. 试试"帮我总结这个页面的要点"或选中一段文字让 AI 改写',
    timeToValue: '1 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p016'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  'canva-ai': {
    verdict: '非设计师的最佳出图工具。AI 加持的 Canva 让不会 PS 的运营也能 5 分钟做出专业海报——模板+AI生图+智能排版的组合拳。',
    bestFor: '没有设计背景但需要快速出图的运营/市场人员、需要批量产出社媒配图/海报/Banner 的团队、小团队没有专职设计师',
    notFor: '需要精细化设计（如 UI 设计、品牌 VI）的专业设计师、需要 PSD 分层文件输出的场景',
    strengths: [
      '模板量业界最大——数十万专业模板一键套用，改文字和图片即可出稿',
      'Magic Design AI 设计——描述需求自动生成多个设计方案，选一个微调即可',
      'AI 一键抠图/扩图/去水印——以前需要 PS 的操作现在一键搞定',
      '品牌套件——上传品牌色+Logo+字体，所有模板自动适配品牌风格',
    ],
    limitations: [
      '设计自由度有限——高度依赖模板，很难做出完全自定义的复杂设计',
      'AI 图片生成质量不如 Midjourney——适合配图和素材，不适合做主视觉',
      '导出格式受限——免费版不能导出 SVG 和透明背景 PNG',
      '中文字体选择有限——部分中文字体需要 Pro 订阅',
    ],
    pricingAdvice: '免费版功能已经很强，足够个人轻度使用。Pro（$13/月）解锁全部模板+品牌套件+高级导出，团队使用强烈推荐。',
    vsAlternatives: [
      {
        rival: 'midjourney',
        verdict: '快速出设计稿选 Canva AI（模板+排版），AI 艺术创作选 Midjourney',
        pickThis: '需要完成品的设计稿（海报/Banner/社媒图）、不会设计软件、需要品牌一致性',
        pickThat: '需要高质量 AI 艺术图片、概念设计、创意视觉探索',
      },
      {
        rival: 'figma-ai',
        verdict: '营销物料选 Canva AI（效率高），产品设计选 Figma AI（专业深）',
        pickThis: '海报/Banner/社媒配图等营销物料、快速出稿',
        pickThat: 'UI/UX 设计、组件化设计系统、开发交付',
      },
    ],
    quickStart: '1. 访问 canva.com 注册账号\n2. 搜索"游戏海报"模板，选一个喜欢的\n3. 替换文字和图片，体验 Magic Design 的 AI 建议功能',
    timeToValue: '5 分钟',
    relatedTutorials: ['t006'],
    relatedPrompts: ['p025'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },
};

// ===== Prompt 扩展数据 =====

const promptExtensions = {
  p013: {
    taskCategory: '做分析',
    taskDesc: '对游戏数值表（如掉率、经济产出、角色属性）进行自动化异常检查，找出不合理的数值和潜在 Bug',
    whenToUse: '当你做完数值填表后需要交叉检查、或者线上出了数值相关 Bug 需要快速排查数值表时',
    whenNotToUse: '当你需要从零设计数值体系时——数值设计需要策划经验，AI 更适合"检查已有数值"而非"设计新数值"',
    inputGuide: {
      '数值表': { desc: '需要检查的数值表数据', good: '直接粘贴 Excel/CSV 格式的数值表（如角色属性表、掉率表）', bad: '帮我看看数值', tip: '表头要清晰，数据量在 500 行以内效果最好' },
      '检查规则': { desc: '你关注的异常类型', good: '掉率之和是否为100%、属性成长曲线是否平滑、经济产出是否溢出', bad: '看看有没有问题', tip: '给出具体规则让 AI 有据可查' },
      '上下文': { desc: '这份数值表的背景', good: '这是一个卡牌RPG的角色属性表，共50个角色分5个稀有度', bad: '游戏数据', tip: '背景信息帮助 AI 理解数值设计意图' },
    },
    exampleFull: {
      input: '数值表=[粘贴50行角色属性表:名称/稀有度/攻击/防御/生命/暴击率/暴击伤害] 检查规则=同稀有度角色属性差异不超过15%、暴击率+暴击伤害总和应随稀有度递增、总属性不应有断崖式跳跃 上下文=卡牌RPG，5个稀有度（N/R/SR/SSR/UR）',
      outputSummary: '生成检查报告：① 异常汇总（发现6处问题）② 详细问题列表（如"角色XX的SSR暴击率42%高于UR的38%，疑似填反"）③ 数值趋势图描述（各稀有度总属性分布）④ 修复建议',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: 'AI 说"数值看起来没问题"但其实有问题', cause: '没有给检查规则，AI 不知道你的设计意图', fix: '明确列出 3-5 条检查规则，如"SSR 总属性应在 X-Y 范围内"' },
      { symptom: 'AI 对数值格式理解错误', cause: '表格粘贴后格式错乱', fix: '用 CSV 格式粘贴，或在表头前加"以下是CSV格式数据，用逗号分隔"' },
      { symptom: '只发现了低级错误，没有发现设计问题', cause: '检查规则太表面', fix: '加入设计层面的规则，如"付费角色不应比免费角色弱""后期获取的角色应有数值优势"' },
    ],
    optimizationTips: [
      '先让 AI "阅读这份数值表并描述你理解的设计意图"——验证 AI 是否真正理解了你的数值体系',
      '要求"输出一份可以粘贴到 Excel 的异常标记表"——原数据+异常标注列，方便直接修改',
      '检查完后追问"基于这份数值表，如果新增一个UR角色，建议属性范围是？"——让 AI 辅助数值设计',
    ],
    versions: {
      lite: { label: '快速版', desc: '粘贴数值表，自动扫描异常', prompt: '你是游戏数值策划专家。检查以下数值表，找出不合理的数值、潜在异常和可能的填写错误：\n\n{数值表}' },
      advanced: { label: '深度版', desc: '含自定义规则、趋势分析、修复建议', promptDiff: '+ 指定检查规则清单\n+ 数值趋势分析（是否平滑递增）\n+ 异常程度分级（严重/注意/建议）\n+ 修复建议和参考值\n+ 可粘贴到Excel的标注表' },
    },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p009', 'p030'],
    relatedPaths: [],
  },

  p015: {
    taskCategory: '写方案',
    taskDesc: '生成一份结构化的品牌 Brief 文档，用于向代理公司/设计师/KOL 清晰传达品牌调性和合作要求',
    whenToUse: '当你需要给外部合作方（代理公司、设计师、KOL）提供品牌背景和创意要求时',
    whenNotToUse: '当你需要内部使用的完整品牌手册（Brand Book）时——Brief 是精简传达版，不是完整品牌体系',
    inputGuide: {
      '品牌名': { desc: '品牌或产品名称', good: '崩坏：星穹铁道、王者荣耀', bad: '我们的品牌', tip: 'AI 可能了解知名游戏品牌的调性' },
      'Brief 目的': { desc: '这份 Brief 给谁看、用于什么', good: '给 MCN 做 KOL 投放 Brief、给设计公司做周年庆主视觉', bad: '做品牌', tip: '目的决定 Brief 的侧重点' },
      '品牌调性': { desc: '品牌的核心调性关键词', good: '科幻+浪漫+冒险感、国风+热血+竞技', bad: '好的', tip: '3-5 个关键词足够，最好附带参考案例' },
    },
    exampleFull: {
      input: '品牌名=崩坏星穹铁道 Brief目的=给代理公司做2周年庆Campaign Brief 品牌调性=科幻浪漫+太空冒险+温暖治愈',
      outputSummary: '生成 Brief 文档：① 品牌概览（一段话介绍产品+受众+调性）② 受众画像（核心/扩展/潜力三层）③ 品牌 DO & DON\'T（视觉+文案+合作红线）④ 本次 Campaign 目标和 KPI ⑤ 创意方向指引 ⑥ 时间线和交付物要求',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: 'Brief 太泛，代理公司看完还是不知道要什么', cause: 'Brief 目的太模糊', fix: '明确"这份 Brief 的交付物是什么"（如：3 套主视觉方案+20条社媒文案）' },
      { symptom: '品牌调性描述太抽象', cause: '只给了关键词没给参考', fix: '附加"参考案例：XX品牌的XX Campaign 的视觉风格"' },
      { symptom: '缺少品牌红线', cause: '只写了"要什么"没写"不要什么"', fix: '要求"必须包含 DO & DON\'T 清单"——代理公司最怕的是踩雷' },
    ],
    optimizationTips: [
      '要求"输出为 PPT 大纲格式（每页标题+要点）"——方便直接做成 Brief PPT 发给代理公司',
      '让 AI "模拟代理公司的角度审视这份 Brief，列出 3 个可能的追问"——提前补全盲点',
      '追问"把品牌调性翻译成视觉语言：推荐色板、字体风格、图片风格"——从文字调性到视觉指引',
    ],
    versions: {
      lite: { label: '快速版', desc: '一段品牌信息，出简版 Brief', prompt: '你是品牌策略总监。为{品牌名}写一份{Brief目的}的品牌Brief，包含：品牌概览、受众画像、品牌调性、DO & DON\'T。' },
      advanced: { label: '完整版', desc: '含视觉指引、竞品参考、交付物清单', promptDiff: '+ 视觉风格指引（色板/字体/图片风格）\n+ 竞品参考案例\n+ 具体交付物清单和时间线\n+ 评审标准和验收条件' },
    },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p006', 'p011'],
    relatedPaths: [],
  },

  p018: {
    taskCategory: '做分析',
    taskDesc: '为广告投放设计一套 A/B 测试方案，明确测试变量、样本量、判定标准和执行排期',
    whenToUse: '当你要开始新一轮投放但不确定哪套素材/定向/出价效果更好时',
    whenNotToUse: '当你只有极少预算（日耗 <500 元）不足以支撑有效 A/B 测试时',
    inputGuide: {
      '投放平台': { desc: '广告投放的平台', good: '巨量引擎、广点通、Unity Ads', bad: '投放', tip: '不同平台的测试机制和指标体系不同' },
      '测试目标': { desc: '你想通过测试解决什么问题', good: '哪种创意素材的CPI更低、定向18-25 vs 25-35哪个LTV更高', bad: '测试效果', tip: '目标越具体，测试方案越有针对性' },
      '日预算': { desc: '可用于测试的日预算', good: '日预算5000元、测试周期7天', bad: '看效果', tip: '预算决定测试组数和样本量' },
    },
    exampleFull: {
      input: '投放平台=巨量引擎 测试目标=测试3种创意风格（实机录屏/CG混剪/真人口播）哪种CPI最低 日预算=1万元 测试周期=5天',
      outputSummary: '生成测试方案：① 测试矩阵（3组创意×2组定向=6个广告组）② 变量控制说明（除创意外其他条件相同）③ 预算分配（每组1667元/天）④ 数据采集指标（曝光/点击/安装/CPI/次留）⑤ 判定标准（95%置信度下CPI差异>15%才判定胜出）⑥ 每日检查 Checklist',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '测试组太多，预算分散导致样本量不足', cause: '同时测试了太多变量', fix: '一次只测一个核心变量，其他变量保持不变' },
      { symptom: '测试结果不显著，无法判定谁胜出', cause: '测试周期太短或预算太少', fix: '让 AI 根据你的预算计算"需要多少样本才能达到95%置信度"' },
      { symptom: '测试方案太理论化，不适合实际操作', cause: '没有指定投放平台', fix: '指定平台后 AI 会适配该平台的广告组结构和操作流程' },
    ],
    optimizationTips: [
      '要求"输出一份每日数据记录表模板"——用 Excel 格式，每天填数据、自动判定是否达到统计显著',
      '追问"如果第3天某组 CPI 明显偏高，是否应该提前关停？判定标准是什么？"——提前定好止损规则',
      '测试结束后把结果喂给 AI："基于以下测试数据，下一轮投放的策略建议是？"——从测试到优化的闭环',
    ],
    versions: {
      lite: { label: '快速版', desc: '给出测试目标，出基础方案', prompt: '你是效果广告投放专家。为以下测试目标设计一套 A/B 测试方案，包含测试组设计、预算分配、判定标准：\n\n{测试目标}' },
      advanced: { label: '完整版', desc: '含样本量计算、每日检查表、止损规则', promptDiff: '+ 统计显著性样本量计算\n+ 每日数据记录表模板\n+ 止损规则和调优建议\n+ 测试结束后的分析框架' },
    },
    relatedTools: ['chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p002', 'p030'],
    relatedPaths: [],
  },

  p019: {
    taskCategory: '提效率',
    taskDesc: '对游戏文本（UI/剧情/公告）的翻译稿进行审校，检查术语一致性、语境准确性和本地化适配度',
    whenToUse: '当你收到翻译稿需要审校、或者需要用 AI 对现有翻译做快速质检时',
    whenNotToUse: '当你需要从零翻译整份文档时——直接找翻译服务更好，AI 审校适合"检查和优化已有翻译"',
    inputGuide: {
      '原文': { desc: '需要审校的原始文本', good: '粘贴中文原文和对应的英文/日文翻译', bad: '帮我看看翻译', tip: '原文和译文一一对应效果最好' },
      '目标语言': { desc: '翻译的目标语言', good: '日语、英语（美式）、韩语', bad: '外语', tip: '指定地区变体（如美式英语vs英式英语）更精准' },
      '术语表': { desc: '游戏专用术语的统一翻译', good: '角色名:XX→XX、技能名:XX→XX', bad: '按正常翻译', tip: '术语表是审校的核心参考，一定要提供' },
    },
    exampleFull: {
      input: '原文=[20条游戏UI文本+对应日语翻译] 目标语言=日语 术语表=[角色名/技能名/系统名称的中日对照表]',
      outputSummary: '生成审校报告：① 术语一致性检查（发现3处术语不一致）② 语境准确性（2处语义偏差标注）③ 本地化适配（4处日语表达更自然的修改建议）④ 修改对照表（原译→建议译→原因）',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: 'AI 全部标注为"OK"，没发现问题', cause: '没有提供术语表，AI 无法判断术语是否正确', fix: '务必提供游戏术语表，这是审校的核心参考' },
      { symptom: '修改建议太多，分不清轻重', cause: '没有要求按严重程度分级', fix: '要求"按严重程度分3级：错误（必改）/建议（可改）/风格（锦上添花）"' },
      { symptom: '日语/韩语审校结果不够准确', cause: 'AI 的小语种能力有限', fix: 'AI 审校作为第一轮筛查，关键问题仍需母语审校员确认' },
    ],
    optimizationTips: [
      '把术语表常驻在 Claude Projects 中——每次审校自动参考，不用每次粘贴',
      '要求"输出为 Excel 格式：序号/原文/原译/建议译/问题类型/严重程度"——方便给翻译团队下修改单',
      '审校完后追问"这批翻译整体质量评分（1-10）和最需要注意的翻译倾向是什么？"——辅助翻译团队改进',
    ],
    versions: {
      lite: { label: '快速版', desc: '粘贴原文+译文，快速查错', prompt: '你是资深游戏本地化审校员。对以下翻译进行审校，检查术语一致性和语义准确性：\n\n{原文和译文}' },
      advanced: { label: '专业版', desc: '含术语表对照、问题分级、Excel输出', promptDiff: '+ 术语表对照检查\n+ 问题严重程度分级\n+ 本地化适配建议\n+ Excel格式输出\n+ 整体质量评分和改进建议' },
    },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p012'],
    relatedPaths: [],
  },

  p020: {
    taskCategory: '写方案',
    taskDesc: '生成一份游戏发行方案框架，覆盖市场定位、发行节奏、渠道策略、预算分配和里程碑规划',
    whenToUse: '当你在做游戏发行立项或版本发行规划，需要快速产出方案初稿给团队讨论时',
    whenNotToUse: '当你需要精确到每日的发行执行排期时——框架方案适合方向决策，详细排期需要基于实际资源',
    inputGuide: {
      '游戏名': { desc: '要发行的游戏', good: '项目代号"星海"，二次元卡牌RPG', bad: '我们的游戏', tip: '项目代号+品类信息即可' },
      '发行市场': { desc: '目标发行市场', good: '国内全渠道、日韩先行+全球', bad: '发行', tip: '国内和海外的发行策略差异巨大' },
      '发行阶段': { desc: '当前所处的阶段', good: '首发上线、周年庆大版本、付费测试', bad: '准备发行', tip: '不同阶段策略重点不同' },
      '预算范围': { desc: '发行预算', good: '200万首发、1000万全年', bad: '看情况', tip: '预算直接决定渠道组合和投入力度' },
    },
    exampleFull: {
      input: '游戏名=星海（二次元卡牌RPG） 发行市场=国内全渠道 发行阶段=首发上线 预算范围=500万',
      outputSummary: '生成发行方案：① 市场定位（核心受众+差异化卖点+竞品对标）② 发行节奏（预热期30天/爆发期7天/稳定期60天）③ 渠道策略表（各渠道预算占比和预期ROI）④ 内容营销日历 ⑤ KPI里程碑（预约量/首日下载/首周留存/首月收入）⑥ 风险和Plan B',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '方案太模板化，没有针对性', cause: '缺少游戏特色和差异化信息', fix: '补充"我们的核心差异化是XX""目标对标竞品是XX"' },
      { symptom: 'KPI 数字不合理', cause: 'AI 不掌握你的品类真实数据', fix: '提供参考："同品类竞品首月收入约XX万"让 AI 据此估算' },
      { symptom: '渠道建议过于分散', cause: '没有给预算约束', fix: '明确预算后要求"优先推荐ROI最高的3个渠道"' },
    ],
    optimizationTips: [
      '要求"为每个里程碑设定 Good/OK/Bad 三档数据标准"——让团队对齐成功标准',
      '追问"这个发行方案最可能失败的3个原因是什么？对应的预防措施？"——提前做风险管理',
      '把方案让 AI "用发行总监的视角审视，找出3个逻辑漏洞"——自审机制',
    ],
    versions: {
      lite: { label: '快速版', desc: '给出基本信息，出方案框架', prompt: '你是游戏发行总监。为{游戏名}制定一份{发行市场}的{发行阶段}方案框架，包含：市场定位、发行节奏、渠道策略、KPI目标。' },
      advanced: { label: '完整版', desc: '含预算分配、里程碑表、风险预案', promptDiff: '+ 预算分配表（按渠道+按阶段）\n+ KPI里程碑（Good/OK/Bad三档）\n+ 内容营销日历\n+ 风险清单和Plan B\n+ 团队分工建议' },
    },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: [],
    relatedPrompts: ['p006', 'p008'],
    relatedPaths: [],
  },

  p021: {
    taskCategory: '产内容',
    taskDesc: '从脚本到视频的一站式方案：先生成视频脚本，再为每个分镜推荐 AI 视频生成的提示词',
    whenToUse: '当你需要用 AI 工具（Runway/可灵/Sora）生成视频素材、但不确定提示词怎么写时',
    whenNotToUse: '当你做纯实拍视频不涉及 AI 生成画面时',
    inputGuide: {
      '视频目的': { desc: '这条视频用来做什么', good: '游戏宣传片、版本更新预告、社媒短视频', bad: '做个视频', tip: '目的决定视频风格和节奏' },
      '视频时长': { desc: '目标总时长', good: '30秒、60秒、2分钟', bad: '短视频', tip: 'AI 生成视频单段约5-10秒，需要规划分段数' },
      'AI工具': { desc: '你打算用哪个 AI 视频工具', good: 'Runway Gen-3、可灵、Sora', bad: 'AI', tip: '不同工具的提示词格式和最佳实践不同' },
      '视觉风格': { desc: '想要的画面风格', good: '赛博朋克、吉卜力动画风、电影级写实', bad: '好看的', tip: '风格关键词直接影响生成效果' },
    },
    exampleFull: {
      input: '视频目的=原神新地图宣传短视频 视频时长=30秒 AI工具=Runway Gen-3 视觉风格=吉卜力动画风+温暖治愈',
      outputSummary: '生成一体化方案：① 视频脚本（6段，每段5秒）② 每段分镜描述（画面/运镜/氛围）③ 对应的 Runway 英文提示词（含风格、光影、运镜关键词）④ 推荐的负面提示词 ⑤ 拼接顺序和转场建议 ⑥ 配乐/音效方向',
      model: 'ChatGPT + Runway',
    },
    commonFailures: [
      { symptom: 'AI 生成的画面和脚本描述不匹配', cause: '提示词太笼统', fix: '要求"提示词必须包含：主体+动作+环境+光影+运镜+风格 六要素"' },
      { symptom: '各段画面风格不统一', cause: '没有统一风格关键词', fix: '要求"所有提示词都包含统一的风格前缀，如 ghibli anime style, warm lighting"' },
      { symptom: '生成效果达不到预期', cause: '提示词中文', fix: 'AI 视频工具的提示词务必用英文——中文效果差很多' },
    ],
    optimizationTips: [
      '要求"每段提示词同时给出 Runway 版和可灵版"——两个工具的最佳提示词格式不同，可以对比选择',
      '追问"为每段推荐 3 种运镜方式（静态/平移/推进）的提示词变体"——方便选择最佳运镜',
      '生成后追问"如何用 CapCut 剪映将这 6 段拼接并加转场？推荐什么转场效果？"——完成后期流程闭环',
    ],
    versions: {
      lite: { label: '快速版', desc: '给出视频主题，出脚本+提示词', prompt: '你是 AI 视频制作专家。为"{视频目的}"创作一份{时长}的视频脚本，并为每个分镜生成{AI工具}的英文提示词。' },
      advanced: { label: '制片版', desc: '含负面提示词、运镜指导、后期建议', promptDiff: '+ 每段含正面+负面提示词\n+ 运镜方式建议\n+ 风格一致性控制词\n+ 转场和拼接建议\n+ 配乐/音效方向' },
    },
    relatedTools: ['runway', 'kling'],
    relatedTutorials: ['t010'],
    relatedPrompts: ['p005'],
    relatedPaths: [],
  },

  p022: {
    taskCategory: '做分析',
    taskDesc: '利用 Google NotebookLM 的多源分析能力，对一批资料进行深度研究并生成带引用的研究报告',
    whenToUse: '当你有 5-10 份资料（研报、文章、文档）需要综合分析并产出研究结论时',
    whenNotToUse: '当你只需要分析 1 份文档时（直接用 Claude/ChatGPT 就够了），NotebookLM 的优势在于多源交叉分析',
    inputGuide: {
      '研究主题': { desc: '你要研究什么', good: '2026年中国手游市场趋势、AI在游戏行业的应用现状', bad: '帮我研究', tip: '主题越聚焦，产出越有深度' },
      '资料来源': { desc: '你准备上传的资料', good: '5份行业研报+3篇深度文章+2份内部数据', bad: '一些资料', tip: 'NotebookLM 最多支持50个来源，建议5-15份最佳' },
      '产出形式': { desc: '你需要什么样的研究产出', good: '带引用的研究报告、播客式音频摘要、问答式知识库', bad: '分析一下', tip: 'NotebookLM 独特的音频摘要功能适合通勤时听' },
    },
    exampleFull: {
      input: '研究主题=2026年中国手游出海趋势 资料来源=[上传8份资料：3份券商研报+2份Sensor Tower报告+3篇行业分析文章] 产出形式=带引用的研究报告+关键发现摘要',
      outputSummary: '指导使用 NotebookLM 产出：① 笔记本设置步骤 ② 推荐提问清单（"各报告对2026年市场规模的预测差异？""主要出海目的地排名？"）③ 研究报告大纲（含引用来源标注）④ 音频摘要生成指引',
      model: 'Google NotebookLM',
    },
    commonFailures: [
      { symptom: '回答太泛，没有引用到上传的资料', cause: '上传的资料和提问主题不匹配', fix: '确保上传的资料都和研究主题直接相关，避免上传无关文档干扰' },
      { symptom: '不同资料的矛盾数据没被发现', cause: '没有要求交叉对比', fix: '提问"各资料来源在XX数据上的差异是什么？谁的数据更可信？"' },
      { symptom: '生成的音频摘要太表面', cause: '默认音频摘要是概览级别', fix: '先用文字提问深入分析，再基于分析结果生成音频' },
    ],
    optimizationTips: [
      '利用 NotebookLM 的"引用定位"功能——点击回答中的引用编号直接跳转到原文，验证 AI 是否断章取义',
      '研究完后导出笔记，把关键发现粘贴到 Claude 中"基于以上发现，帮我写一份给老板的研究摘要"——两个工具接力',
      '生成的播客式音频摘要可以发给团队——比发一份长报告更容易被消化',
    ],
    versions: {
      lite: { label: '快速版', desc: '给研究主题，出 NotebookLM 使用指南', prompt: '你是 AI 研究助手。我要用 Google NotebookLM 研究"{研究主题}"，请给我：上传什么资料、提什么问题、怎么组织产出。' },
      advanced: { label: '研究版', desc: '含提问清单、报告大纲、交叉验证指引', promptDiff: '+ 分阶段提问清单（概览→深入→交叉验证）\n+ 研究报告大纲模板\n+ 数据矛盾识别提问\n+ 与 Claude 接力的工作流' },
    },
    relatedTools: ['google-notebooklm', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p008', 'p003'],
    relatedPaths: [],
  },

  p023: {
    taskCategory: '产内容',
    taskDesc: '为游戏角色或内容生成 AI 配音方案，包含声音风格描述、ElevenLabs 参数设置和台词处理建议',
    whenToUse: '当你需要用 AI 为游戏角色/宣传视频/教程配音、但不确定如何选择和设置声音时',
    whenNotToUse: '当你需要专业声优级别的配音品质时——AI 配音适合 demo/原型/小规模内容，正式配音建议请真人声优',
    inputGuide: {
      '配音场景': { desc: '配音用在哪里', good: '游戏角色台词、宣传片旁白、教程解说', bad: '配音', tip: '场景决定声音风格和技术要求' },
      '角色描述': { desc: '需要什么样的声音', good: '20岁女性、温柔治愈系、日系动画风格', bad: '好听的声音', tip: '年龄+性别+性格+参考角色最好' },
      '台词样本': { desc: '需要配音的台词', good: '粘贴 5-10 条实际台词', bad: '帮我配音', tip: '有台词样本，AI 可以针对性推荐语音参数' },
      '语言': { desc: '配音的语言', good: '中文普通话、日语、英语（美式）', bad: '中文', tip: 'ElevenLabs 英文效果最好，中文需要微调' },
    },
    exampleFull: {
      input: '配音场景=RPG游戏女主角色台词 角色描述=18岁少女、活泼开朗偶尔傲娇、声线偏高清亮 台词样本=[10条游戏内台词] 语言=中文+日语双版本',
      outputSummary: '生成配音方案：① 推荐 ElevenLabs 预设声音（3个候选+试听建议）② 每条台词的语音参数设置（Stability/Similarity/Style）③ 情绪标注和语速建议 ④ 中文/日语版本的发音注意点 ⑤ 后期处理建议（混响/EQ/降噪）',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '选的声音和角色不匹配', cause: '角色描述太模糊', fix: '给出具体的年龄+性别+性格+参考（如"类似XX动画的XX角色声线"）' },
      { symptom: '不同台词的声音风格不一致', cause: '没有统一声音参数', fix: '确定基准参数后，只针对情绪变化微调 Style 值，Stability 和 Similarity 保持不变' },
      { symptom: '中文配音发音不自然', cause: 'ElevenLabs 中文模型限制', fix: '关键台词用拼音注音辅助，长句适当断句标点' },
    ],
    optimizationTips: [
      '先用 ElevenLabs Voice Library 搜索匹配的预设声音，找到后在本 Prompt 中补充"基于声音ID: XX 微调"',
      '要求"为每条台词标注情绪值（1-10）和建议语速"——批量设置参数时有据可依',
      '生成的配音发给团队做 A/B 盲听测试——让非策划的同事判断声音是否匹配角色形象',
    ],
    versions: {
      lite: { label: '快速版', desc: '给角色信息，推荐声音和基本参数', prompt: '你是 AI 配音指导。为以下角色推荐 ElevenLabs 声音方案：\n\n角色：{角色描述}\n场景：{配音场景}\n\n给出推荐声音类型和基本参数设置。' },
      advanced: { label: '制作版', desc: '含逐条台词参数、情绪标注、后期处理', promptDiff: '+ 3个候选声音对比\n+ 逐条台词参数设置表\n+ 情绪值和语速标注\n+ 多语言版本发音指导\n+ 后期混音建议' },
    },
    relatedTools: ['elevenlabs', 'suno'],
    relatedTutorials: [],
    relatedPrompts: ['p021'],
    relatedPaths: [],
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

console.log('===== Batch-4 内容升级 =====\n');
console.log('--- 工具升级 ---');
const toolCount = updateTools();
console.log('\n--- Prompt 升级 ---');
const promptCount = updatePrompts();

console.log('\n--- 验证 ---');
const toolsAfter = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf8'));
const promptsAfter = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
const upgradedTools = toolsAfter.filter(t => t.verdict).length;
const upgradedPrompts = promptsAfter.filter(p => p.taskCategory).length;
console.log(`工具：${upgradedTools}/35 已升级`);
console.log(`Prompt：${upgradedPrompts}/525 已升级`);
console.log('\n✅ Batch-4 数据更新完成');
