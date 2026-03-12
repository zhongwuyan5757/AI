#!/usr/bin/env node
/**
 * batch-5 内容升级脚本
 * 工具 (+6): doubao, stable-diffusion, sora, heygen, gamma, google-notebooklm
 * Prompt (+8): p024, p025, p026, p027, p028, p029, p030, p031
 */
const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

// ===== 工具扩展数据 =====

const toolExtensions = {
  doubao: {
    verdict: '字节跳动推出的国产全能 AI 助手。中文能力强、响应快、免费无限用，且背靠字节生态可连接豆包 MarsCode（代码）和即梦（图片）。',
    bestFor: '需要免费中文对话 AI、偏好快速响应、在字节系产品生态中工作的用户',
    notFor: '以英文场景为主、需要超长文档分析（Kimi 更强）、需要深度推理（DeepSeek 更强）',
    strengths: [
      '中文对话流畅自然——日常对话、翻译、写短文案的中文体验舒适',
      '响应速度极快——同类国产 AI 中响应延迟最低',
      '完全免费无限制——不限对话次数、不限功能',
      '字节生态联动——可调用即梦生图、MarsCode 写代码，一站式多能力',
    ],
    limitations: [
      '深度推理和复杂逻辑分析不如 DeepSeek 和 Claude',
      '长文档处理能力不如 Kimi（上下文窗口较短）',
      '方案类长文生成质量不如 Claude/ChatGPT，结构化程度偏低',
      '英文能力明显弱于 ChatGPT/Claude',
    ],
    pricingAdvice: '完全免费，直接使用。移动端体验尤其好，下载豆包 App 即可。',
    vsAlternatives: [
      {
        rival: 'deepseek',
        verdict: '日常中文对话选豆包（响应快），推理和代码选 DeepSeek（能力强）',
        pickThis: '轻量日常对话、需要字节生态联动、偏好移动端体验',
        pickThat: '需要深度思考和推理、需要代码辅助、对输出质量要求高',
      },
      {
        rival: 'kimi',
        verdict: '快速日常对话选豆包，长文档处理选 Kimi',
        pickThis: '短对话、翻译、快速问答、移动端使用',
        pickThat: '需要分析超长文档（20万字+）、PDF/Word 文件解析',
      },
    ],
    quickStart: '1. 下载豆包 App 或访问 doubao.com\n2. 用手机号注册即可使用\n3. 试试日常对话和翻译功能，体验响应速度',
    timeToValue: '1 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p001'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  'stable-diffusion': {
    verdict: '开源 AI 图片生成的基石。完全免费、可本地运行、无内容限制、模型可自由微调——适合有技术能力且需要高度定制化的团队。',
    bestFor: '有技术能力的团队（能配置本地环境）、需要训练自定义风格模型（如统一游戏美术风格）、对数据隐私要求极高的项目',
    notFor: '不想折腾技术环境的非技术用户、只需要偶尔出几张图（用 Midjourney 更省事）',
    strengths: [
      '完全开源免费——模型权重公开，本地部署零成本（除硬件外）',
      '定制化能力最强——LoRA/DreamBooth 微调可以训练出专属风格模型',
      '本地运行数据安全——所有数据不离开你的电脑，适合保密项目',
      '社区生态丰富——CivitAI 上数万个社区模型和 LoRA 可直接使用',
    ],
    limitations: [
      '上手门槛高——需要安装 Python 环境、配置 GPU、理解采样器等概念',
      '需要独立显卡——至少 8GB VRAM（如 RTX 3060），Mac 用户需要额外配置',
      '默认出图质量不如 Midjourney——需要大量调参和模型选择才能出好图',
      '没有官方客服和技术支持，遇到问题靠社区和自行排查',
    ],
    pricingAdvice: '模型完全免费。成本只有硬件（需要好显卡）和学习时间。如果没有 GPU，可以使用云端服务（如 RunPod $0.4/小时）。',
    vsAlternatives: [
      {
        rival: 'midjourney',
        verdict: '定制化和免费选 SD，简单好用出图快选 Midjourney',
        pickThis: '需要训练自定义模型、本地运行保密、大批量生成不限次数',
        pickThat: '不想折腾技术、只需要高质量出图、偶尔使用',
      },
    ],
    quickStart: '1. 安装方式推荐 ComfyUI 或 Stable Diffusion WebUI（A1111）\n2. 从 CivitAI 下载一个热门 Checkpoint 模型\n3. 输入提示词生成第一张图',
    timeToValue: '30-60 分钟（含环境配置）',
    relatedTutorials: ['t005'],
    relatedPrompts: ['p025'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  sora: {
    verdict: 'OpenAI 推出的 AI 视频生成工具。画面质量和物理真实性令人惊艳，但目前仅限 ChatGPT Plus/Pro 用户使用，额度有限。',
    bestFor: '已订阅 ChatGPT Plus/Pro、追求最高画面质量的概念预览和创意探索、OpenAI 生态用户',
    notFor: '需要大量批量生成视频素材（额度太少）、预算有限不想为 ChatGPT Plus 付费的用户',
    strengths: [
      '物理真实性最好——光影、材质、运动物理的拟真度目前最高',
      '理解复杂场景——对长文本描述的理解能力强，能生成叙事性画面',
      '与 ChatGPT 深度集成——直接在 ChatGPT 对话中生成视频，工作流顺畅',
      '持续快速迭代——OpenAI 的更新速度意味着功能会不断增强',
    ],
    limitations: [
      '额度非常有限——Plus 用户每月仅约 50 个视频额度（720p 5秒）',
      '生成速度较慢——一段视频可能需要等待数分钟',
      '需要 ChatGPT Plus（$20/月）才能使用，没有独立免费版',
      '不支持中文提示词——必须用英文描述',
    ],
    pricingAdvice: '包含在 ChatGPT Plus（$20/月）中，但额度有限。如果你已订阅 Plus 可以直接体验。专门为视频付费不划算——同价位 Runway 额度更多。',
    vsAlternatives: [
      {
        rival: 'runway',
        verdict: '画面拟真选 Sora，量产和工具链选 Runway',
        pickThis: '追求最高画面质量、已有 ChatGPT Plus、创意概念探索',
        pickThat: '需要大量生成、需要 Motion Brush 等专业工具、独立视频工作流',
      },
      {
        rival: 'kling',
        verdict: '英文顶级画质选 Sora，中文日常量产选可灵',
        pickThis: '追求物理拟真度、英文提示词、偶尔使用',
        pickThat: '中文提示词为主、需要大量生成、预算有限',
      },
    ],
    quickStart: '1. 订阅 ChatGPT Plus（$20/月）\n2. 在 ChatGPT 中描述你想要的视频画面\n3. 等待生成（约 1-5 分钟），预览和下载',
    timeToValue: '5 分钟（已有 Plus 订阅的情况下）',
    relatedTutorials: ['t010'],
    relatedPrompts: ['p021'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  heygen: {
    verdict: '最成熟的 AI 数字人视频工具。上传照片即可生成逼真的"真人出镜"视频，适合做产品解说、多语言宣传和虚拟代言人内容。',
    bestFor: '需要"真人出镜"但没有演员/拍摄条件的团队、多语言视频本地化、数字人直播和虚拟代言人',
    notFor: '需要纯 CG/动画风格视频（选 Runway/可灵）、对口型自然度要求极高的正式品牌片',
    strengths: [
      '数字人逼真度业界最高——支持自定义形象，口型和表情同步自然',
      '多语言一键翻译——一段视频自动翻译成 40+ 种语言并匹配口型',
      '模板丰富——数百个预设场景和数字人形象，快速出片',
      '支持自定义数字人——上传 2 分钟视频即可克隆你自己的数字形象',
    ],
    limitations: [
      '数字人仍有"恐怖谷"效应——近距离特写时偶尔不够自然',
      '动作幅度有限——数字人主要做上半身讲述，全身动作和走动支持有限',
      '价格偏高——Creator 套餐 $24/月 仅 15 分钟视频额度',
      '定制数字人需要 Business 套餐（$180/月+），个人用户成本高',
    ],
    pricingAdvice: '免费版 1 分钟视频体验。如果每周需要出 1-2 条产品解说视频，Creator（$24/月）够用。团队需要定制数字人和大量产出需要 Business 套餐。',
    vsAlternatives: [
      {
        rival: 'runway',
        verdict: '数字人视频选 HeyGen，创意画面生成选 Runway',
        pickThis: '需要"真人出镜"效果、产品解说、多语言翻译视频',
        pickThat: '需要纯 AI 生成的创意画面、游戏概念预览',
      },
    ],
    quickStart: '1. 访问 heygen.com 注册账号\n2. 选择一个预设数字人和模板\n3. 输入解说文案，选择语言，一键生成视频',
    timeToValue: '5 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p021'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  gamma: {
    verdict: '最快的 AI 演示文稿工具。输入主题自动生成完整 PPT，含排版、配图和动画——把"做 PPT"从 2 小时压缩到 5 分钟。',
    bestFor: '经常需要做汇报/提案 PPT 但不擅长排版设计的人、需要快速出方案演示的场景、内部分享和会议展示',
    notFor: '需要精细化品牌设计的正式对外演示（如投资人路演 PPT）、需要复杂动画和交互效果的展示',
    strengths: [
      '一句话生成完整 PPT——输入主题自动生成 10-20 页含内容和配图的演示文稿',
      '排版质量远超 AI 竞品——默认模板就好看，不需要手动调整版式',
      '支持导入文档——上传 Word/PDF 自动转换为演示文稿',
      '在线协作——支持团队实时协同编辑和评论',
    ],
    limitations: [
      '设计风格偏西式——中文排版偶尔不够紧凑',
      '内容深度有限——AI 生成的内容适合做框架，核心论据需要手动补充',
      '免费版有 Gamma 水印——正式场合需要付费去除',
      '导出 PPT 格式后排版可能轻微变形',
    ],
    pricingAdvice: '免费版每月 400 AI 积分（约 10 份 PPT），足够轻度使用。Plus（$10/月）无限 AI 生成 + 去水印，经常做 PPT 的人强烈推荐。',
    vsAlternatives: [
      {
        rival: 'canva-ai',
        verdict: 'PPT 选 Gamma（更智能），海报/社媒图选 Canva AI（模板多）',
        pickThis: '需要 AI 自动生成完整演示文稿、输入文字出 PPT',
        pickThat: '需要海报/Banner/社媒配图、需要更多设计模板',
      },
    ],
    quickStart: '1. 访问 gamma.app 注册账号\n2. 点击 Create → Presentation\n3. 输入主题（如"2026年Q2游戏运营复盘"），等待 30 秒出完整 PPT',
    timeToValue: '2 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p024'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  'google-notebooklm': {
    verdict: 'Google 推出的 AI 研究助手。上传多份资料后自动建立知识库，支持带引用的问答和独家的播客式音频摘要——做深度研究的最佳伴侣。',
    bestFor: '需要综合分析多份资料（研报/文章/文档）的研究工作、喜欢用听的方式消化信息、需要带来源引用的分析结论',
    notFor: '只需要分析单份文档（用 Claude 就够）、需要实时联网信息（NotebookLM 只分析上传资料）、需要生成创意内容',
    strengths: [
      '多源交叉分析——上传多份资料后自动找出关联、矛盾和关键洞察',
      '所有回答带引用——点击引用编号直接跳转原文，可验证 AI 是否准确',
      '独家音频摘要——自动生成播客式双人对话摘要，通勤时可以听研究结论',
      '完全免费——Google 账号登录即可使用全部功能',
    ],
    limitations: [
      '只能分析上传的资料——不能联网搜索，信息局限于你提供的文档',
      '每个笔记本最多 50 个来源——大规模文献综述受限',
      '不擅长生成创意内容——更适合分析和提炼，不适合写方案',
      '中文资料处理偶尔不如英文资料精准',
    ],
    pricingAdvice: '完全免费，用 Google 账号登录即可使用全部功能包括音频摘要。',
    vsAlternatives: [
      {
        rival: 'claude',
        verdict: '多源研究选 NotebookLM（带引用+音频），深度写作选 Claude',
        pickThis: '需要分析 5+ 份资料并交叉引用、需要音频摘要、需要引用溯源',
        pickThat: '需要基于分析结论写完整方案、单份文档深度分析、创意写作',
      },
      {
        rival: 'perplexity',
        verdict: '分析已有资料选 NotebookLM，搜索新信息选 Perplexity',
        pickThis: '已有一批资料需要综合分析、需要引用溯源、需要音频摘要',
        pickThat: '需要实时联网搜索新信息、快速调研、数据验证',
      },
    ],
    quickStart: '1. 访问 notebooklm.google.com 用 Google 账号登录\n2. 创建新笔记本，上传 3-5 份相关资料（PDF/网页/文本）\n3. 在对话框提问"这些资料的核心结论是什么？有没有矛盾的地方？"',
    timeToValue: '5 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p022', 'p008'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },
};

// ===== Prompt 扩展数据 =====

const promptExtensions = {
  p024: {
    taskCategory: '提效率',
    taskDesc: '将数据转化为专业可视化图表（柱状图、折线图、饼图、热力图等），直接生成可用于汇报的图表',
    whenToUse: '当你需要做数据汇报但手动做图太耗时、或者想用 AI 推荐最适合数据特征的图表类型时',
    whenNotToUse: '当你需要交互式 Dashboard（用 Tableau/PowerBI）、或者需要符合企业 BI 规范的标准化报表时',
    inputGuide: {
      '数据': { desc: '需要可视化的数据', good: '直接粘贴 CSV/表格数据', bad: '帮我画图', tip: '数据量在 100 行以内效果最好' },
      '图表目的': { desc: '这张图要说明什么', good: '展示近12个月DAU趋势、对比5个渠道的ROI', bad: '做个图', tip: '目的决定图表类型选择' },
      '使用场景': { desc: '图表用在哪里', good: '周报PPT、老板汇报、运营日报', bad: '看看数据', tip: '场景影响图表风格和详细程度' },
    },
    exampleFull: {
      input: '数据=[12个月的DAU和收入数据CSV] 图表目的=展示DAU和收入的关联趋势+标出异常月份 使用场景=季度复盘PPT',
      outputSummary: '生成方案：① 推荐双Y轴折线图（左轴DAU右轴收入）② 完整的图表代码（Python matplotlib 或 HTML Chart.js）③ 异常月份标注和说明 ④ PPT适配的配色方案 ⑤ 图表标题和注释建议',
      model: 'ChatGPT（含代码执行）',
    },
    commonFailures: [
      { symptom: '图表类型不合适（如用饼图展示趋势）', cause: '没有说明图表目的', fix: '明确"我要展示XX趋势/对比/占比"，AI 会推荐最合适的图表类型' },
      { symptom: '图表太复杂，看不懂', cause: '一张图塞了太多维度', fix: '要求"一张图只表达一个核心观点"，多维度拆成多张图' },
      { symptom: '代码运行报错', cause: '数据格式问题', fix: '用 CSV 格式粘贴数据，确保列名清晰无特殊字符' },
    ],
    optimizationTips: [
      '使用 ChatGPT 的代码执行功能可以直接在对话中生成并预览图表',
      '要求"同时生成数据洞察文字说明（3句话）"——图+文字一次搞定汇报内容',
      '追问"这份数据还有什么有趣的发现？"——让 AI 做探索性分析，可能发现你没注意到的规律',
    ],
    versions: {
      lite: { label: '快速版', desc: '粘贴数据，AI选图表类型并生成', prompt: '你是数据可视化专家。将以下数据转化为最合适的图表，输出可运行的代码：\n\n{数据}' },
      advanced: { label: '汇报版', desc: '含图表选型建议、配色方案、洞察文字', promptDiff: '+ 图表类型选择理由\n+ 企业风格配色方案\n+ 数据洞察文字说明\n+ 异常值标注\n+ PPT/报告适配建议' },
    },
    relatedTools: ['chatgpt', 'gamma'],
    relatedTutorials: [],
    relatedPrompts: ['p009', 'p013'],
    relatedPaths: [],
  },

  p025: {
    taskCategory: '产内容',
    taskDesc: '为 AI 图片生成工具（Midjourney/SD/Gemini Imagen）优化提示词，从模糊描述变成高质量出图提示词',
    whenToUse: '当你知道想要什么画面但不会写提示词、或者出图效果总是不理想需要优化提示词时',
    whenNotToUse: '当你已经是提示词老手、或者只需要简单配图不追求画面质量时',
    inputGuide: {
      '画面描述': { desc: '你想要的画面', good: '一个赛博朋克风格的游戏城市夜景，霓虹灯倒映在雨水中', bad: '好看的图', tip: '用中文描述即可，AI 会翻译并优化为英文提示词' },
      '用途': { desc: '图片用在哪里', good: '游戏宣传海报、社媒配图、概念设计', bad: '看看', tip: '用途决定图片风格和分辨率需求' },
      'AI工具': { desc: '你使用哪个生成工具', good: 'Midjourney v6、Stable Diffusion XL、Gemini Imagen 3', bad: 'AI画图', tip: '不同工具的提示词语法和最佳实践不同' },
    },
    exampleFull: {
      input: '画面描述=一个可爱的猫耳少女坐在樱花树下看书，二次元动漫风格 用途=游戏角色立绘概念设计 AI工具=Midjourney v6',
      outputSummary: '生成优化提示词：① 英文主提示词（含主体、动作、环境、光影、风格关键词）② 参数设置（--ar 3:4 --stylize 150 --chaos 10）③ 3个变体版本（日系/韩系/国风）④ 负面提示词建议 ⑤ 迭代建议（如何根据第一轮结果微调）',
      model: 'ChatGPT / Claude',
    },
    commonFailures: [
      { symptom: '出图和描述不匹配', cause: '提示词缺少关键要素', fix: '完整提示词需包含：主体+动作+环境+光影+风格+镜头 六要素' },
      { symptom: '风格不稳定，每次出图差异大', cause: '缺少风格锚定词', fix: '加入明确的风格参考（如"in the style of Studio Ghibli"）和种子值固定' },
      { symptom: '画面太杂乱', cause: '提示词塞了太多元素', fix: '遵循"少即是多"——一张图不超过 3 个核心元素' },
    ],
    optimizationTips: [
      '让 AI 同时输出"简洁版（30词）和详细版（80词）"——简洁版出大方向，详细版精细化',
      '要求"分析一张参考图的提示词"——上传你喜欢的图让 AI 反推提示词',
      '迭代工作流：出图→截图给 AI→"基于这张图，哪些地方需要调整提示词？"→微调→再出图',
    ],
    versions: {
      lite: { label: '快速版', desc: '中文描述转英文提示词', prompt: '你是 AI 图片生成提示词专家。将以下中文描述优化为{AI工具}的英文提示词，包含风格、光影、构图关键词：\n\n{画面描述}' },
      advanced: { label: '专业版', desc: '含参数设置、变体版本、迭代指南', promptDiff: '+ 工具特定参数设置\n+ 3个风格变体\n+ 负面提示词\n+ 迭代优化指南\n+ 参考图反推提示词' },
    },
    relatedTools: ['midjourney', 'stable-diffusion'],
    relatedTutorials: ['t005'],
    relatedPrompts: ['p021'],
    relatedPaths: [],
  },

  p026: {
    taskCategory: '写方案',
    taskDesc: '围绕特定节日/时间节点，生成一套活动主题创意方案，包含主题概念、视觉方向和玩法框架',
    whenToUse: '当你开始筹备节日活动但主题创意还没方向、或者想一次性看到多个主题方向做选择时',
    whenNotToUse: '当主题已确定只需要细化执行时——用 p001 活动策划方案更合适',
    inputGuide: {
      '游戏名': { desc: '你的游戏', good: '明日方舟、原神', bad: '游戏', tip: '帮 AI 匹配游戏调性' },
      '节日/时间节点': { desc: '围绕什么节点', good: '春节、万圣节、周年庆、暑假', bad: '节日', tip: '具体节日让创意更聚焦' },
      '创意数量': { desc: '需要几个创意方向', good: '3-5个', bad: '一些', tip: '3个适合快速筛选，5个适合广泛探索' },
    },
    exampleFull: {
      input: '游戏名=明日方舟 节日=万圣节 创意数量=3个主题方向',
      outputSummary: '生成3个主题方向：① "乌尔比斯暗夜狂欢"（世界观融合型，干员变装+地图皮肤）② "罗德岛怪谈录"（剧情向，限时解谜关卡+恐怖美学）③ "甜蜜魔药实验室"（萌系轻松向，收集+合成玩法），每个方向附视觉参考、核心玩法和预期受众反应',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '创意太通用，没有游戏特色', cause: '没有提供游戏世界观信息', fix: '补充"游戏世界观关键词：XX"让创意融入游戏设定' },
      { symptom: '几个方向差异不大', cause: '没有要求差异化', fix: '要求"3个方向必须在风格上有明显差异：如一个搞笑/一个正经/一个猎奇"' },
      { symptom: '创意很好但不可执行', cause: '缺少执行约束', fix: '补充"开发周期2周""美术资源预算有限"等约束条件' },
    ],
    optimizationTips: [
      '要求"为每个方向生成一张概念海报的文字描述"——可以直接丢给 Midjourney 出概念图',
      '追问"从数据角度，哪个方向最可能提升 DAU？为什么？"——让 AI 评估商业价值',
      '把 3 个方向发给团队投票后，把投票结果和理由反馈给 AI："团队选了方向 B，请细化为完整活动方案"',
    ],
    versions: {
      lite: { label: '快速版', desc: '给节日和游戏，出创意方向', prompt: '你是游戏活动创意总监。为{游戏名}的{节日}活动设计{数量}个不同风格的主题方向，每个包含：主题名、核心概念、视觉方向、推荐玩法。' },
      advanced: { label: '评审版', desc: '含商业价值评估、执行难度、团队投票建议', promptDiff: '+ 每个方向的商业价值预估\n+ 执行难度和资源需求\n+ 概念海报描述\n+ 团队评审评分表模板' },
    },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: ['t009'],
    relatedPrompts: ['p001', 'p027'],
    relatedPaths: ['ops-ai-path'],
  },

  p027: {
    taskCategory: '写方案',
    taskDesc: '为游戏活动设计一套完整的奖励体系，包含奖励层次、产出量、对经济系统的影响评估',
    whenToUse: '当你设计活动的奖励部分不确定该发什么、发多少、怎么分层时',
    whenNotToUse: '当你需要精确计算对游戏经济的量化影响时——需要结合你的经济模型，AI 只能做框架估算',
    inputGuide: {
      '游戏类型': { desc: '游戏的核心品类', good: '二次元卡牌RPG、SLG策略、休闲三消', bad: '手游', tip: '品类决定奖励体系的复杂度' },
      '活动类型': { desc: '什么类型的活动', good: '7天登录活动、限时挑战、周年庆抽奖', bad: '活动', tip: '活动类型决定奖励节奏' },
      '目标': { desc: '奖励体系要达成什么目标', good: '提升7日留存、刺激首充、拉动回流', bad: '给奖励', tip: '目标决定奖励策略重心' },
    },
    exampleFull: {
      input: '游戏类型=二次元卡牌RPG 活动类型=周年庆14天庆典 目标=拉动回流+刺激中R付费',
      outputSummary: '生成奖励方案：① 免费层（每日登录+任务累积，覆盖全体玩家）② 付费层（限定礼包3档：6元/68元/328元）③ 重度层（排行榜+成就，满足大R展示需求）④ 回流层（专属回流礼包+追赶机制）⑤ 经济影响估算表（各奖励的资源产出总量 vs 日常产出）',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '奖励太豪华，怕打破经济平衡', cause: '没有提供日常产出量参考', fix: '补充"日常每日产出约XX货币/XX体力"让 AI 评估活动奖励是否超标' },
      { symptom: '奖励分层不明确', cause: '没有指定目标人群', fix: '明确"免费玩家/小R/中R/大R 各需要什么奖励"' },
      { symptom: '付费礼包定价不合理', cause: 'AI 不了解你的付费生态', fix: '补充"当前月卡X元/战令X元/首充X元"让 AI 对齐定价体系' },
    ],
    optimizationTips: [
      '要求"输出一份奖励清单表格（奖励名/数量/获取方式/折算价值）"——方便直接录入系统',
      '追问"这套奖励体系的最大风险是什么？"——让 AI 帮你检查是否有经济溢出风险',
      '设计完后让 AI "模拟一个中R玩家14天的活动体验路径"——验证奖励节奏是否合理',
    ],
    versions: {
      lite: { label: '快速版', desc: '给活动类型，出奖励框架', prompt: '你是游戏活动策划专家。为{游戏类型}的{活动类型}设计奖励体系，目标是{目标}，包含免费层和付费层。' },
      advanced: { label: '经济版', desc: '含产出量计算、经济影响评估、分人群策略', promptDiff: '+ 各层奖励的资源产出量化\n+ 与日常产出的比值分析\n+ 分人群奖励策略\n+ 付费礼包定价建议\n+ 经济影响风险评估' },
    },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p001', 'p013'],
    relatedPaths: ['ops-ai-path'],
  },

  p028: {
    taskCategory: '写方案',
    taskDesc: '设计一套签到/打卡活动方案，包含签到规则、奖励递进、防流失机制和数据监控点',
    whenToUse: '当你需要做一个提升日活和留存的签到/打卡活动时',
    whenNotToUse: '当你做的是一次性限时活动（如节日活动）——签到更适合长期留存场景',
    inputGuide: {
      '活动周期': { desc: '签到持续多久', good: '7天、14天、30天月签', bad: '签到', tip: '周期影响奖励递进曲线' },
      '核心目标': { desc: '签到活动要解决什么', good: '提升首周留存率、拉动日活、培养登录习惯', bad: '让玩家签到', tip: '不同目标的签到策略差异大' },
      '补签机制': { desc: '是否允许补签', good: '允许1次免费补签+花钻石补签', bad: '看情况', tip: '补签机制直接影响玩家体验和活动严格度' },
    },
    exampleFull: {
      input: '活动周期=7天新手签到 核心目标=提升新玩家首周留存率 补签机制=允许1次免费补签',
      outputSummary: '生成方案：① 签到奖励表（7天递增，第7天终极大奖）② 里程碑奖励（连续3天/5天/7天额外奖励）③ 补签规则（1次免费+50钻石补签）④ 防流失设计（第3天push提醒+断签挽回邮件）⑤ 数据监控指标（每日签到率、断签率、补签率、最终完成率）',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '奖励递进感不够，玩家第3天就不想签了', cause: '奖励曲线太平坦', fix: '要求"奖励价值指数级递增，第7天价值=第1天的5倍+"' },
      { symptom: '签到活动和其他活动奖励重复', cause: '没有考虑活动体系全局', fix: '补充"当前已有的活动和奖励类型"让 AI 做差异化设计' },
      { symptom: '没有考虑不同活跃度的玩家', cause: '设计过于一刀切', fix: '要求"区分轻度（只签到）/中度（签到+完成1个任务）/重度（全部完成）三档"' },
    ],
    optimizationTips: [
      '要求"同时设计签到提醒推送文案（每天不同）"——签到+Push 一次搞定',
      '追问"历史上签到活动的行业最佳实践是什么？哪些游戏的签到设计值得参考？"',
      '让 AI 模拟"100个玩家的签到行为分布"——验证设计的预期完成率是否合理',
    ],
    versions: {
      lite: { label: '快速版', desc: '给周期和目标，出签到方案', prompt: '你是游戏活动策划。设计一个{活动周期}的签到活动，目标：{核心目标}，包含奖励表和补签规则。' },
      advanced: { label: '运营版', desc: '含推送文案、数据监控、防流失机制', promptDiff: '+ 每日推送提醒文案\n+ 断签挽回机制\n+ 多档次奖励路径\n+ 数据监控指标清单\n+ 预期完成率估算' },
    },
    relatedTools: ['chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p001', 'p026'],
    relatedPaths: ['ops-ai-path'],
  },

  p029: {
    taskCategory: '写方案',
    taskDesc: '设计跨服/赛季制活动方案，包含赛制结构、匹配机制、赛季奖励和内容更新节奏',
    whenToUse: '当你需要设计一个跨服竞技或赛季更新活动、需要平衡竞技性和参与度时',
    whenNotToUse: '当你做的是单服内部的小活动——跨服/赛季适合大型周期性活动',
    inputGuide: {
      '游戏类型': { desc: '游戏品类', good: 'MOBA、SLG、卡牌RPG', bad: '游戏', tip: '品类决定赛制模式' },
      '赛季周期': { desc: '一个赛季多长', good: '30天、45天、2个月', bad: '一个赛季', tip: '周期影响内容密度和奖励节奏' },
      '核心目标': { desc: '赛季活动要解决什么', good: '提升中后期玩家活跃、创造社交话题、刺激付费', bad: '活跃', tip: '目标决定赛制侧重点' },
    },
    exampleFull: {
      input: '游戏类型=SLG策略手游 赛季周期=45天 核心目标=提升中后期玩家活跃+创造联盟社交话题',
      outputSummary: '生成赛季方案：① 赛制结构（预选赛/小组赛/淘汰赛/总决赛 四阶段）② 匹配规则（按战力分段+联盟人数加权）③ 赛季奖励体系（个人排名+联盟贡献+赛季通行证）④ 内容更新日历（每周解锁新玩法） ⑤ 社交设计（联盟战报/赛况直播/观战功能建议）',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '大R碾压小R，参与度断崖式下降', cause: '匹配机制没有做好分段', fix: '要求"必须有实力分段匹配，确保每个分段内的对局有竞技性"' },
      { symptom: '赛季中期玩家流失', cause: '中期缺少内容刺激', fix: '要求"赛季中期有转折机制（如赛道变化/新规则解锁）保持新鲜感"' },
      { symptom: '奖励感不够', cause: '只有最终排名奖', fix: '设计"过程奖励（每周里程碑）+排名奖（赛季结算）+成就奖（特殊表现）"三条线' },
    ],
    optimizationTips: [
      '要求"模拟一个中等战力玩家的45天赛季体验时间线"——验证活动节奏是否合理',
      '追问"如何让淘汰的玩家还愿意留在赛季内？"——设计失败者激励机制',
      '参考成功案例："分析皇室战争的赛季制和守望先锋的赛季通行证，哪些设计值得借鉴？"',
    ],
    versions: {
      lite: { label: '快速版', desc: '给出品类和周期，出赛制框架', prompt: '你是资深竞技活动策划。为{游戏类型}设计一个{赛季周期}的跨服赛季方案，包含赛制结构、匹配规则和奖励体系。' },
      advanced: { label: '完整版', desc: '含社交设计、内容日历、数据监控', promptDiff: '+ 分阶段内容更新日历\n+ 社交功能建议\n+ 实力分段匹配算法建议\n+ 失败者激励机制\n+ 赛季数据监控指标' },
    },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p001', 'p027'],
    relatedPaths: [],
  },

  p030: {
    taskCategory: '做分析',
    taskDesc: '基于历史数据和活动参数，预估限时促销活动的收入、参与率和对经济系统的影响',
    whenToUse: '当你在设计限时促销（如限时折扣/限定礼包）需要预估收入和风险时',
    whenNotToUse: '当你需要精确到个位数的收入预测时——AI 预估是量级估算，精确预测需要你的历史数据模型',
    inputGuide: {
      '促销类型': { desc: '什么类型的促销', good: '限时6折礼包、首充双倍、限定角色UP卡池', bad: '促销', tip: '不同促销类型的参与率模型不同' },
      '历史数据': { desc: '过往类似活动的数据', good: '上次6折礼包购买率15%、ARPU=8元', bad: '之前还行', tip: '有历史数据预估才准确' },
      '活动参数': { desc: '本次促销的具体设置', good: '价格68元→39元、限购3份、持续3天', bad: '折扣', tip: '价格/限购/时长三要素必须提供' },
    },
    exampleFull: {
      input: '促销类型=限定角色UP卡池 历史数据=[上期UP卡池：参与率22%、人均抽卡68次、ARPU=204元、DAU=50万] 活动参数=本期UP角色热度更高、卡池持续14天、新增天井系统(180抽保底)',
      outputSummary: '生成预估报告：① 参与率预估（25-30%，因角色热度+天井系统提升）② 收入预估区间（保守2800万/基准3500万/乐观4200万）③ 敏感度分析（参与率每变化5%对收入影响）④ 经济影响（预估消耗XX水晶，对游戏储蓄率影响）⑤ 风险提示（天井成本核算、免费石头消耗预估）',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '预估数字偏差太大', cause: '缺少历史数据参考', fix: '务必提供上期同类活动的数据——有参照基准 AI 预估才有意义' },
      { symptom: '只给了收入预估没有风险分析', cause: '没有要求风险评估', fix: '要求"同时分析最大风险和最坏情况下的收入"' },
      { symptom: '预估过于乐观', cause: 'AI 倾向给积极预估', fix: '要求"给出保守/基准/乐观三档预估，并说明每档的假设条件"' },
    ],
    optimizationTips: [
      '要求"输出一份 Excel 友好的敏感度分析表"——调参数看收入变化，方便做决策',
      '追问"如果实际数据偏离预估20%，应该做什么调整？"——提前准备应急方案',
      '活动结束后把真实数据喂回 AI："预估 vs 实际对比，偏差原因分析"——校准未来预估准确度',
    ],
    versions: {
      lite: { label: '快速版', desc: '给活动参数，出量级预估', prompt: '你是游戏商业化分析师。基于以下活动参数，预估收入和参与率：\n\n{促销类型}\n{活动参数}' },
      advanced: { label: '决策版', desc: '含三档预估、敏感度分析、经济影响', promptDiff: '+ 保守/基准/乐观三档预估\n+ 敏感度分析表\n+ 经济系统影响评估\n+ 风险提示和应急方案\n+ 与历史数据的对比框架' },
    },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p013', 'p009'],
    relatedPaths: ['ops-ai-path'],
  },

  p031: {
    taskCategory: '写文案',
    taskDesc: '批量生成信息流广告标题（15-30字），覆盖多种吸引点击的标题公式，适合投放 A/B 测试',
    whenToUse: '当你需要大量信息流广告标题做 A/B 测试、或者标题点击率一直上不去需要新方向时',
    whenNotToUse: '当你做品牌广告（需要品牌调性而非点击率）、或做长文案（用 p002）时',
    inputGuide: {
      '游戏/产品': { desc: '推广什么', good: '原神5.0版本、某SLG手游', bad: '游戏', tip: '具体到版本/活动更好' },
      '投放平台': { desc: '信息流平台', good: '巨量引擎、广点通、快手', bad: '投放', tip: '不同平台的标题字数和风格不同' },
      '标题数量': { desc: '需要多少条', good: '20条、30条、50条', bad: '一些', tip: '建议20-30条，够做一轮充分的A/B测试' },
      '核心卖点': { desc: '标题要突出什么', good: '新角色超强、首充1元、不肝不氪', bad: '好玩', tip: '每个卖点可以有多种表达方式' },
    },
    exampleFull: {
      input: '游戏=某二次元卡牌RPG 投放平台=巨量引擎 标题数量=20条 核心卖点=新SSR角色+不用花钱也能抽到+画质超好',
      outputSummary: '生成20条标题：分为5类公式各4条——① 数字型（"3天白嫖SSR，零氪党狂喜"）② 疑问型（"不充钱真能抽到SSR？我试了一下..."）③ 对比型（"别人花了3000抽到，我0元就拿到了"）④ 悬念型（"这个SSR的技能看完我直接充了"）⑤ 证言型（"玩了200个手游，只有这个让我卸载了原神"），每条标注适用的投放位置',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '标题都差不多，缺少变化', cause: '没有要求不同公式', fix: '要求"用5种不同的标题公式，每种4条"' },
      { symptom: '标题太长，被信息流截断', cause: '没有控制字数', fix: '明确"每条控制在15-25字以内"（巨量引擎建议不超过25字）' },
      { symptom: '标题夸大其词可能被审核驳回', cause: 'AI 追求点击率忽略了合规', fix: '加上"避免绝对化用词（最、第一、100%）和虚假承诺"' },
    ],
    optimizationTips: [
      '要求"为每条标题标注预估点击率等级（S/A/B）和适合的素材类型"——选标题时有参考',
      '生成后追问"这20条中哪5条你最有信心？为什么？"——AI 帮你缩小范围',
      '测试后把数据反馈："以下5条标题的点击率分别是X%，为什么第3条效果最好？基于此再生成10条类似的"',
    ],
    versions: {
      lite: { label: '快速版', desc: '给产品和卖点，批量出标题', prompt: '你是效果广告文案专家。为{游戏}生成{数量}条信息流广告标题，每条15-25字，覆盖不同标题公式，核心卖点：{卖点}' },
      advanced: { label: '投放版', desc: '含公式分类、合规检查、效果预估', promptDiff: '+ 按标题公式分组\n+ 合规检查（避免审核驳回）\n+ 点击率预估等级\n+ 适配投放位置建议\n+ 配套素材方向' },
    },
    relatedTools: ['chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p002', 'p018'],
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

console.log('===== Batch-5 内容升级 =====\n');
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
console.log('\n✅ Batch-5 数据更新完成');
