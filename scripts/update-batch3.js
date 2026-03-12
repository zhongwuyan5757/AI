#!/usr/bin/env node
/**
 * batch-3 内容升级脚本
 * 升级范围：4 个工具 (cursor, suno, runway, kimi) + 7 个 Prompt (p006, p008, p010, p011, p014, p016, p017)
 */
const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

// ===== 工具扩展数据 =====

const toolExtensions = {
  cursor: {
    verdict: '目前最好的 AI 编程 IDE。如果你写代码（哪怕只是数据处理脚本），Cursor 能让你的效率翻倍——它不只是补全，而是理解你的整个项目。',
    bestFor: '日常写代码的开发者、需要写数据处理脚本的运营/策划、想用 AI 快速搭建工具和自动化流程的人',
    notFor: '完全不涉及代码的纯文案/设计岗位、只需要简单对话式 AI 而不写代码的用户',
    strengths: [
      'Codebase 级理解能力——不只是补全当前行，而是理解你的整个项目结构和上下文',
      'Tab 智能补全极其流畅，比 GitHub Copilot 更准确、更少废代码',
      'Composer 模式可以一次性修改多个文件，适合重构和新功能开发',
      '内置终端 + AI 调试，报错直接让 AI 分析和修复，调试效率极高',
    ],
    limitations: [
      '免费版额度有限（每月约 2000 次补全），重度使用需要 Pro 订阅',
      '对非代码文件（如 Markdown、文档）的辅助不如 Claude/ChatGPT 对话模式',
      '底层模型切换（GPT-4o/Claude）时偶尔出现不一致的代码风格',
      '大项目（10 万行+）索引较慢，初次打开需要等待',
    ],
    pricingAdvice: '免费版体验 Tab 补全和基础 Chat 功能。如果你每天写 2 小时以上代码，Pro（$20/月）绝对值——单 Composer 功能就能省大量重构时间。',
    vsAlternatives: [
      {
        rival: 'chatgpt',
        verdict: '写代码选 Cursor（项目级理解），问问题选 ChatGPT（通用对话）',
        pickThis: '在 IDE 中边写边改、需要项目级代码理解、多文件同时修改',
        pickThat: '不写代码只是想问编程问题、需要生成独立代码片段、学习编程概念',
      },
      {
        rival: 'claude',
        verdict: 'IDE 内编码选 Cursor，长文档分析选 Claude',
        pickThis: '写代码、调试、重构——在 IDE 中实时辅助',
        pickThat: '分析长文档、写策划方案、非代码类深度写作任务',
      },
    ],
    quickStart: '1. 访问 cursor.com 下载安装（支持 Mac/Windows/Linux）\n2. 打开你的项目文件夹，等待索引完成\n3. 按 Tab 体验智能补全，按 Cmd+K 试试内联编辑',
    timeToValue: '10 分钟',
    relatedTutorials: ['t003'],
    relatedPrompts: ['p013'],
    relatedPaths: ['5day-advanced'],
    lastUpdated: '2026-03-12',
  },

  suno: {
    verdict: '最好用的 AI 音乐生成工具。输入一段文字描述就能生成完整歌曲（含人声+编曲），游戏 BGM、营销视频配乐、活动主题曲的快速出demo利器。',
    bestFor: '需要快速产出游戏 BGM demo、营销视频配乐、活动主题曲的游戏/市场团队，不需要专业音乐制作能力',
    notFor: '需要精细混音和母带处理的专业音乐人、需要精确控制每个音轨的场景',
    strengths: [
      '文字描述直接出歌——输入风格+情绪+歌词就能生成完整歌曲，含人声和编曲',
      '音乐质量显著领先——v4 版本的人声自然度和编曲丰富度远超同类工具',
      '风格覆盖广——流行、摇滚、电子、古风、二次元等几十种风格都能生成',
      '生成速度快——一首 3 分钟歌曲约 30 秒出结果，非常适合快速出 demo',
    ],
    limitations: [
      '中文歌词生成的咬字和韵律有时不够自然，英文明显更好',
      '免费版每天只有 5 首的额度，做比选需要付费',
      '不能精确控制编曲细节（如指定某个乐器的演奏方式）',
      '商用授权需要 Pro 或以上套餐，免费版不能商用',
    ],
    pricingAdvice: '免费版每天 5 首，足够体验和偶尔使用。如果团队需要频繁出 BGM demo，Pro（$10/月）500 首额度很划算。Premier（$30/月）适合每周都要产音乐的团队。',
    vsAlternatives: [
      {
        rival: 'elevenlabs',
        verdict: '做歌曲/BGM 选 Suno，做配音/语音选 ElevenLabs',
        pickThis: '需要完整歌曲（人声+编曲）、游戏 BGM、活动配乐',
        pickThat: '需要角色配音、多语言语音克隆、游戏角色台词配音',
      },
    ],
    quickStart: '1. 访问 suno.com 注册账号\n2. 点击 Create，输入歌曲描述（如"轻快的电子游戏背景音乐，8bit 风格"）\n3. 30 秒后试听生成结果，不满意可以重新生成',
    timeToValue: '2 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p023'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  runway: {
    verdict: 'AI 视频生成的行业标杆。Gen-3 Alpha 的画面质量和运动连贯性目前最好，适合制作游戏宣传片片段、社媒短视频素材、概念预览动画。',
    bestFor: '需要快速产出视频素材的市场/运营团队、游戏宣传片概念预览、社媒短视频批量产出',
    notFor: '需要长视频完整叙事（目前单次生成 10 秒）、需要精确控制角色表情和口型的场景',
    strengths: [
      'Gen-3 Alpha 画面质量业界最佳——光影、材质、运动连贯性都领先竞品',
      '支持图片转视频（Image-to-Video）——上传游戏截图即可生成动态宣传素材',
      'Motion Brush 精准控制运动区域——指定画面中哪些部分动、怎么动',
      '一站式工作流——从文字/图片生成到剪辑、字幕、绿幕抠像都在一个平台内完成',
    ],
    limitations: [
      '单次生成最长 10 秒，长视频需要分段生成后拼接',
      '人物面部细节和手部还原偶尔不自然',
      '价格偏高——Standard 套餐 $12/月 仅 625 积分（约 25 个 10 秒视频）',
      '中文提示词效果不如英文，建议用英文描述画面',
    ],
    pricingAdvice: '免费版有 125 积分体验基本功能。Standard（$12/月）适合偶尔使用。如果市场团队每周产视频素材，Pro（$28/月）的 2250 积分更划算。',
    vsAlternatives: [
      {
        rival: 'kling',
        verdict: '画面质量选 Runway，性价比和中文支持选可灵',
        pickThis: '对画面质量要求高、需要 Motion Brush 精准控制、英文场景为主',
        pickThat: '预算有限、中文提示词为主、需要更长的单次生成时长',
      },
      {
        rival: 'sora',
        verdict: '目前可用性选 Runway（已商用），期待值选 Sora（仍在迭代）',
        pickThis: '现在就需要用、需要稳定的商用视频生成工具',
        pickThat: '不急于使用、关注 OpenAI 生态、等待 Sora 正式开放',
      },
    ],
    quickStart: '1. 访问 runwayml.com 注册账号\n2. 选择 Generate → Text/Image to Video\n3. 输入英文画面描述（如"A spaceship flying through a colorful nebula, cinematic lighting"）\n4. 等待约 90 秒，预览生成结果',
    timeToValue: '5 分钟',
    relatedTutorials: ['t010'],
    relatedPrompts: ['p021'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },

  kimi: {
    verdict: '国产长文档处理首选工具。200 万字超长上下文 + 联网搜索 + 文件解析，处理中文长文档（合同、报告、研报）的体验比 ChatGPT/Claude 更流畅。',
    bestFor: '需要处理超长中文文档（合同、研报、政策文件）、需要联网搜索中文信息、偏好中文界面和交互的用户',
    notFor: '以英文场景为主、需要图片/视频生成、需要代码辅助的开发者',
    strengths: [
      '200 万字超长上下文——真正可用于完整合同、研报、长篇小说的一次性分析',
      '中文文件解析体验最佳——PDF、Word、PPT 上传即解析，排版识别准确',
      '联网搜索能力强——实时搜索中文互联网信息，比 ChatGPT 中文搜索结果更全面',
      '完全免费无限制——不限对话次数，无需付费即可使用完整功能',
    ],
    limitations: [
      '英文能力明显弱于 ChatGPT/Claude，英文场景不推荐',
      '创意写作和方案策划能力不如 Claude，输出结构化程度偏低',
      '不支持图片生成、语音对话等多模态功能',
      '高峰期偶尔响应较慢，长文档处理时等待时间较长',
    ],
    pricingAdvice: '完全免费，直接使用。目前不需要付费即可使用全部功能包括超长上下文。',
    vsAlternatives: [
      {
        rival: 'chatgpt',
        verdict: '中文长文档选 Kimi（更长上下文+更好中文解析），通用场景选 ChatGPT',
        pickThis: '处理中文长文档、需要免费无限使用、中文联网搜索',
        pickThat: '英文场景、需要图片生成、需要 GPTs 生态和插件',
      },
      {
        rival: 'deepseek',
        verdict: '中文长文档选 Kimi（上下文更长），推理和代码选 DeepSeek（推理更强）',
        pickThis: '需要处理超长文档（20 万字+）、需要中文文件解析',
        pickThat: '需要深度思考和逻辑推理、需要代码辅助',
      },
    ],
    quickStart: '1. 访问 kimi.moonshot.cn，用手机号注册\n2. 上传一份 PDF 或 Word 文档（如一份行业研报）\n3. 输入"帮我总结这份文档的核心观点和数据"，体验长文档分析能力',
    timeToValue: '3 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p008', 'p016'],
    relatedPaths: [],
    lastUpdated: '2026-03-12',
  },
};

// ===== Prompt 扩展数据 =====

const promptExtensions = {
  p006: {
    taskCategory: '写方案',
    taskDesc: '从 0 到 1 生成一份完整的品牌 Campaign 创意方案，包含主题概念、传播策略、渠道组合和执行排期',
    whenToUse: '当你需要在品牌会议前快速产出 Campaign 初稿、或者创意枯竭需要 AI 提供不同方向的灵感时',
    whenNotToUse: '当你已有明确的创意方向只需要细化执行细节时——直接用 p001 活动策划更合适',
    inputGuide: {
      '品牌名': { desc: '品牌或产品名称', good: '原神、王者荣耀、崩坏：星穹铁道', bad: '我们品牌', tip: '用正式名称，AI 可能了解品牌调性' },
      'Campaign 目标': { desc: '这次 Campaign 要达成什么', good: '提升新版本首周 DAU 50%、拉动回流用户 30%', bad: '做品牌', tip: '目标越量化，方案越有针对性' },
      '目标受众': { desc: '这次 Campaign 的核心用户群', good: '18-25 岁二次元女性玩家、30+ 岁策略老玩家', bad: '玩家', tip: '越细分越好，影响创意方向和渠道选择' },
      '预算范围': { desc: '大概的预算区间', good: '50-100 万、200 万+', bad: '不限', tip: '有预算限制时 AI 会推荐更有性价比的渠道组合' },
      '时间节点': { desc: '关键时间点', good: '暑期档7月、周年庆12月、春节期间', bad: '尽快', tip: '时间节点影响传播策略和热点借势方向' },
    },
    exampleFull: {
      input: '品牌名=原神 Campaign目标=5.0版本首周DAU提升50% 目标受众=18-25岁二次元玩家+泛游戏用户 预算范围=200万 时间节点=暑假7月',
      outputSummary: '生成完整方案：① 主题概念3选1（"夏日冒险季""纳塔狂欢节""五洲同庆"）② 传播时间线（预热/爆发/长尾三阶段）③ 渠道组合表（B站+抖音+小红书+线下快闪）④ KOL合作矩阵 ⑤ 预算分配建议 ⑥ 效果预估',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '方案太泛，像教科书不像实战方案', cause: 'Campaign 目标太模糊（如"做品牌"）', fix: '把目标改成可量化的指标，如"首周 DAU 提升 X%"或"社交媒体话题量 X 万"' },
      { symptom: '渠道建议和预算不匹配', cause: '没有给预算范围', fix: '明确预算区间，让 AI 据此推荐最有性价比的渠道组合' },
      { symptom: '创意方向和品牌调性不搭', cause: 'AI 不了解你的品牌调性', fix: '在 Prompt 中补充"品牌调性：XX，过往成功案例：XX"' },
    ],
    optimizationTips: [
      '生成后追问"从竞品角度审视这个方案，有什么漏洞？"——AI 帮你做方案自审',
      '要求"同时给出保守版（50万预算）和激进版（200万预算）"——给决策者更多选择',
      '让 AI "为每个渠道列出 3 个创意内容方向"——一次性搞定渠道策略+内容策略',
    ],
    versions: {
      lite: { label: '快速版', desc: '一句话需求，出 Campaign 框架', prompt: '你是品牌营销总监。为{品牌名}设计一个{目标}的 Campaign 方案，包含：主题概念、目标受众、渠道选择、时间线。' },
      advanced: { label: '完整版', desc: '含预算分配、KOL 矩阵、效果预估', promptDiff: '+ 预算分配建议表\n+ KOL 合作矩阵（头/腰/尾部达人）\n+ 分渠道内容策略\n+ 数据追踪指标和效果预估' },
    },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: ['t009'],
    relatedPrompts: ['p001', 'p011'],
    relatedPaths: [],
  },

  p008: {
    taskCategory: '做分析',
    taskDesc: '生成一份结构化的海外市场调研报告，覆盖市场规模、竞品格局、用户画像和进入策略',
    whenToUse: '当你需要评估某个海外市场是否值得进入、或者为出海立项提供数据支持时',
    whenNotToUse: '当你需要精确到具体国家的收入数据或用户量时——AI 不掌握非公开数据，需要配合 Sensor Tower 等工具',
    inputGuide: {
      '目标市场': { desc: '你想调研的国家/地区', good: '日本市场、东南亚（印尼+泰国+越南）、北美', bad: '海外', tip: '指定具体国家比泛指"海外"更有价值' },
      '产品类型': { desc: '你的游戏/产品品类', good: '二次元卡牌RPG、休闲三消、SLG策略', bad: '手游', tip: '品类决定目标市场的竞争格局和用户偏好' },
      '重点关注': { desc: '你最想了解的维度', good: '付费习惯、获客成本、监管政策', bad: '全面了解', tip: '指定 2-3 个重点维度让报告更聚焦' },
    },
    exampleFull: {
      input: '目标市场=日本 产品类型=二次元卡牌RPG 重点关注=付费模型偏好、主要竞品的运营策略、本地化要点',
      outputSummary: '生成调研报告：① 市场概览（日本手游市场规模、增速、品类份额）② 竞品分析（FGO、蓝色档案、碧蓝航线的运营策略对比）③ 用户付费特征（日本二次元玩家ARPU、付费节奏、氪金动机）④ 本地化要点（声优配音、节日运营、社区运营）⑤ 进入建议',
      model: 'Perplexity + Claude',
    },
    commonFailures: [
      { symptom: '数据太旧，引用的市场规模是两年前的', cause: 'AI 训练数据有时效性', fix: '先用 Perplexity 搜最新数据，再粘贴到 Claude 中做深度分析' },
      { symptom: '分析太表面，没有竞品细节', cause: '没有指定具体竞品', fix: '在 Prompt 中列出 3-5 个你关注的竞品名称' },
      { symptom: '建议太笼统，无法指导决策', cause: '没有说明你的产品定位', fix: '补充你的产品核心差异点和预算范围，让建议更有针对性' },
    ],
    optimizationTips: [
      '两步法效果最佳：第一步用 Perplexity 搜集最新市场数据，第二步把搜索结果喂给 Claude 做深度分析',
      '要求输出"进入该市场的 Go/No-Go 决策矩阵"——把分析结论转化为可决策的格式',
      '追问"如果只有 100 万美元预算进入这个市场，你建议怎么分配？"——把调研转化为行动方案',
    ],
    versions: {
      lite: { label: '快速版', desc: '指定市场和品类，出调研框架', prompt: '你是海外游戏市场分析师。分析{目标市场}的{产品类型}市场现状，包含：市场规模、主要竞品、用户特征、进入建议。' },
      advanced: { label: '深度版', desc: '含数据引用、竞品矩阵、Go/No-Go 决策', promptDiff: '+ 数据来源标注\n+ 竞品运营策略对比矩阵\n+ 用户付费模型分析\n+ 本地化 Checklist\n+ Go/No-Go 决策矩阵' },
    },
    relatedTools: ['perplexity', 'claude'],
    relatedTutorials: ['t015'],
    relatedPrompts: ['p003', 'p020'],
    relatedPaths: [],
  },

  p010: {
    taskCategory: '产内容',
    taskDesc: '基于热点趋势和平台特性，批量生成小红书或公众号的选题方向，含标题、切入角度和内容框架',
    whenToUse: '当你需要做下周/下月的内容排期但选题没灵感，或者想测试新的内容方向时',
    whenNotToUse: '当你已经有明确选题只需要写正文时——直接写或者用 p017 宣传文案生成更合适',
    inputGuide: {
      '平台': { desc: '内容发布平台', good: '小红书、微信公众号、B站专栏', bad: '自媒体', tip: '不同平台的爆款逻辑完全不同' },
      '账号定位': { desc: '你的账号是什么类型', good: '游戏攻略号、二次元安利号、游戏行业观察号', bad: '游戏号', tip: '定位越清晰，选题越精准' },
      '目标受众': { desc: '内容面向谁', good: '大学生二次元玩家、30+岁策略游戏老玩家', bad: '游戏玩家', tip: '受众画像决定选题切入角度' },
      '选题数量': { desc: '需要几个选题', good: '10个、20个、30个', bad: '一些', tip: '建议一次生成 15-20 个，再筛选 5-8 个进排期' },
    },
    exampleFull: {
      input: '平台=小红书 账号定位=游戏安利+攻略 目标受众=18-28岁女性二次元玩家 选题数量=15个',
      outputSummary: '生成 15 个选题：分为 3 类——① 攻略类 5 个（"原神5.0必做的3件事"）② 安利种草类 5 个（"冷门但超好玩的5款手游"）③ 互动讨论类 5 个（"你入坑最久的游戏是？"），每个选题附标题、封面方向、预计互动类型',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '选题太泛，没有小红书/公众号的平台特色', cause: '没有指定平台', fix: '明确平台后 AI 会适配该平台的爆款规律（如小红书重封面和标题，公众号重深度）' },
      { symptom: '选题和账号定位不搭', cause: '没有说明账号定位', fix: '补充账号定位和过往爆款方向，让 AI 延续已验证的内容路线' },
      { symptom: '标题不够吸引人', cause: 'AI 的标题风格偏保守', fix: '追问"用小红书爆款标题公式重写所有标题"——如数字+痛点+悬念' },
    ],
    optimizationTips: [
      '要求"每个选题标注预估流量等级（S/A/B/C）和制作难度"——帮你做投入产出比排序',
      '生成后追问"这 15 个选题中最容易爆的 3 个是哪些？为什么？"——利用 AI 做初筛',
      '要求"同时生成配套的封面文案（控制在 6 个字内）"——一步到位出封面方案',
    ],
    versions: {
      lite: { label: '快速版', desc: '指定平台和定位，批量出选题', prompt: '你是{平台}内容运营专家。为一个{账号定位}的账号生成{数量}个选题，每个选题包含：标题、切入角度、内容类型（攻略/种草/互动）。' },
      advanced: { label: '排期版', desc: '含流量预估、制作难度、发布排期建议', promptDiff: '+ 每个选题标注流量预估等级\n+ 制作难度和所需素材\n+ 建议发布时间和频率\n+ 封面方向描述' },
    },
    relatedTools: ['chatgpt'],
    relatedTutorials: ['t008'],
    relatedPrompts: ['p005', 'p017'],
    relatedPaths: [],
  },

  p011: {
    taskCategory: '写方案',
    taskDesc: '根据 Campaign 需求，生成一份 KOL/达人合作方案，包含达人筛选标准、合作形式、报价参考和效果预估',
    whenToUse: '当你开始筹备一轮 KOL 投放、需要快速产出合作方案给领导审批或给代理公司 brief 时',
    whenNotToUse: '当你需要具体达人的联系方式和真实报价时——这些需要通过 MCN 或达人平台获取',
    inputGuide: {
      '品牌/产品': { desc: '要推广的品牌或产品', good: '崩坏：星穹铁道 2.0 版本', bad: '我们的游戏', tip: '具体到版本/活动更好' },
      '投放目标': { desc: '这轮 KOL 投放要达成什么', good: '版本曝光量 500 万+、带动下载转化 2 万+', bad: '推广', tip: '量化目标帮助 AI 匹配达人量级' },
      '预算': { desc: 'KOL 投放预算', good: '总预算 50 万、单个达人 5-10 万', bad: '看情况', tip: '预算直接决定达人量级和数量组合' },
      '目标平台': { desc: '投放在哪些平台', good: 'B站+抖音、小红书、快手', bad: '社交媒体', tip: '不同平台的达人生态和报价体系差异大' },
    },
    exampleFull: {
      input: '品牌=崩坏星穹铁道2.0 投放目标=版本曝光500万+下载转化2万 预算=80万 目标平台=B站+抖音',
      outputSummary: '生成合作方案：① 达人筛选矩阵（B站头部1-2人/腰部5-8人/尾部20-30人 + 抖音对应配比）② 合作形式建议（定制视频/直播联动/二创激励）③ 单平台预算分配 ④ 内容Brief模板 ⑤ 效果预估表（曝光/互动/转化）⑥ 风控要点',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '达人推荐太笼统，只说"找头部游戏达人"', cause: '没有指定平台和预算', fix: '明确平台和预算后 AI 会给出具体的达人量级配比和选号标准' },
      { symptom: '报价估算偏差大', cause: 'AI 的达人报价数据不一定准确', fix: '把 AI 方案当框架，实际报价对照蝉妈妈/新榜等平台数据修正' },
      { symptom: '合作形式太单一（全是视频植入）', cause: '没有说明品牌调性和内容偏好', fix: '补充"我们偏好XX形式"或"过往效果最好的合作方式是XX"' },
    ],
    optimizationTips: [
      '要求"为每个量级的达人设计不同的合作Brief模板"——头部要品牌调性，腰部要转化效果，尾部要内容量',
      '追问"这个方案的最大风险是什么？如何规避？"——让 AI 帮你做风控',
      '要求"输出一份给代理公司的 RFP（需求征集书）"——直接可以发给供应商',
    ],
    versions: {
      lite: { label: '快速版', desc: '指定产品和预算，出达人配比', prompt: '你是 KOL 营销专家。为{品牌}设计一套 KOL 合作方案，预算{预算}，投放在{平台}，包含达人量级配比和合作形式。' },
      advanced: { label: '完整版', desc: '含选号标准、Brief模板、效果预估、风控', promptDiff: '+ 达人筛选标准清单\n+ 分量级 Brief 模板\n+ 单达人 ROI 预估\n+ 风控要点和应急预案\n+ 可输出给代理公司的 RFP 格式' },
    },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p006', 'p002'],
    relatedPaths: [],
  },

  p014: {
    taskCategory: '写文案',
    taskDesc: '根据常见玩家问题场景，生成标准化客服回复话术，包含不同情绪等级的应对方式',
    whenToUse: '当你需要为客服团队建立话术库、或者遇到新类型的玩家投诉需要快速准备回复模板时',
    whenNotToUse: '当你需要处理个案级的严重投诉（如充值未到账、账号被盗）时——这类需要具体排查，不适合模板化',
    inputGuide: {
      '游戏名': { desc: '你的游戏名称', good: '王者荣耀、明日方舟', bad: '游戏', tip: '帮助 AI 适配游戏特有术语' },
      '问题场景': { desc: '玩家咨询/投诉的具体场景', good: '抽卡保底机制咨询、匹配等待时间太长投诉、活动兑换码无效', bad: '玩家有问题', tip: '越具体越好，直接贴真实工单更佳' },
      '回复风格': { desc: '客服的语言风格', good: '温暖亲切、专业严谨、活泼可爱（配合游戏世界观）', bad: '正常回复', tip: '风格要和游戏调性一致' },
    },
    exampleFull: {
      input: '游戏名=明日方舟 问题场景=玩家抽卡300抽没出限定6星 回复风格=温暖专业（符合方舟世界观）',
      outputSummary: '生成 3 级话术：① 普通咨询版（解释保底机制+安抚）② 不满情绪版（共情+详细说明+补偿引导）③ 强烈投诉版（道歉+升级处理+后续跟进承诺），每版附带世界观化的称呼（"博士"）和语气',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '话术太官方太冷，像机器人回复', cause: '没有指定回复风格', fix: '要求"用XX风格"并给一条现有好话术作为参考' },
      { symptom: '不同情绪等级的话术差异不大', cause: '没有要求分级', fix: '明确要求"按玩家情绪分3级：咨询/不满/投诉，话术策略递进"' },
      { symptom: '话术不符合游戏世界观', cause: 'AI 不了解你的游戏世界观', fix: '在 Prompt 中补充"我们称玩家为XX，客服角色是XX"' },
    ],
    optimizationTips: [
      '批量生成：一次性给 AI 10 个常见问题场景，要求输出完整话术库——适合做客服培训手册',
      '要求"每条话术标注：① 预计处理时长 ② 是否需要转人工 ③ 关联FAQ链接"——方便做客服工作流',
      '追问"玩家最可能的后续追问是什么？预备回复是什么？"——把话术从单轮扩展到多轮对话流',
    ],
    versions: {
      lite: { label: '快速版', desc: '给场景，出标准话术', prompt: '你是{游戏名}的资深客服。针对以下玩家问题场景，写一条温暖专业的回复话术：\n\n{问题场景}' },
      advanced: { label: '话术库版', desc: '含情绪分级、多轮话术、FAQ关联', promptDiff: '+ 按玩家情绪分3级\n+ 每级话术含核心策略说明\n+ 预判后续追问和预备回复\n+ 标注转人工条件\n+ 世界观化用语' },
    },
    relatedTools: ['chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p012', 'p007'],
    relatedPaths: [],
  },

  p016: {
    taskCategory: '提效率',
    taskDesc: '将会议录音或零散笔记转化为结构化会议纪要，含决议、待办、负责人和截止日期',
    whenToUse: '当你刚开完会需要出纪要但懒得整理、或者会议内容太杂需要 AI 帮你提炼重点时',
    whenNotToUse: '当会议内容涉及高度机密信息不能粘贴到 AI 工具时',
    inputGuide: {
      '会议内容': { desc: '原始笔记或录音转写文本', good: '直接粘贴飞书妙记/腾讯会议的转写文本', bad: '我们开了个会', tip: '原始内容越详细，纪要越准确。可以直接粘贴语音转文字的原始文本' },
      '会议类型': { desc: '这是什么类型的会议', good: '版本评审会、周例会、头脑风暴会', bad: '会议', tip: '不同类型会议的纪要侧重点不同' },
      '输出格式': { desc: '你想要的纪要格式', good: '飞书文档格式、企业微信格式', bad: '整理一下', tip: '指定格式方便直接粘贴到工作平台' },
    },
    exampleFull: {
      input: '会议内容=[粘贴30分钟版本评审会的语音转写文本] 会议类型=版本评审会 输出格式=飞书文档格式',
      outputSummary: '生成结构化纪要：① 会议基本信息（时间/参会人/主持人）② 讨论议题摘要（3个议题各 2-3 句核心结论）③ 关键决议（明确的YES/NO/待定）④ 待办事项表格（任务/负责人/截止日期/优先级）⑤ 分歧记录（未达成一致的点）',
      model: 'Claude Sonnet 4.6',
    },
    commonFailures: [
      { symptom: '纪要太冗长，像是把原文重新排版了一遍', cause: '没有指定会议类型和侧重点', fix: '明确"重点提取决议和待办"，并指定"纪要控制在原文 1/5 篇幅内"' },
      { symptom: '待办事项没有明确负责人', cause: '原始内容中没有提到负责人', fix: '如果会上没明确负责人，让 AI 标注"待确认"并列出可能的负责人' },
      { symptom: '关键决议遗漏', cause: '语音转写文本中决议表达不够明确', fix: '在粘贴前手动标注已知的关键决议，让 AI 在此基础上补充' },
    ],
    optimizationTips: [
      '要求"同时生成一份 100 字版邮件摘要"——方便发给没参会的人快速了解',
      '追问"这些待办中哪 3 项优先级最高？为什么？"——AI 帮你做优先级排序',
      '要求"标注会议中的分歧点和未达成一致的事项"——避免遗漏需要后续跟进的争议',
    ],
    versions: {
      lite: { label: '快速版', desc: '粘贴内容，出结构化纪要', prompt: '你是会议记录专家。将以下会议内容整理为结构化纪要，包含：讨论摘要、关键决议、待办事项（含负责人和截止日期）：\n\n{会议内容}' },
      advanced: { label: '完整版', desc: '含邮件摘要、优先级排序、分歧记录', promptDiff: '+ 100字邮件摘要版\n+ 待办优先级排序\n+ 分歧和待跟进事项\n+ 会议效果简评（决议达成率）\n+ 下次会议建议议题' },
    },
    relatedTools: ['claude', 'kimi'],
    relatedTutorials: [],
    relatedPrompts: ['p009'],
    relatedPaths: [],
  },

  p017: {
    taskCategory: '写文案',
    taskDesc: '根据游戏信息和推广目标，生成一套覆盖多平台的游戏宣传文案组合（长文+短文+标题）',
    whenToUse: '当新版本/新活动需要全渠道宣传但文案人力不够、或者需要快速产出多平台适配文案时',
    whenNotToUse: '当你做单平台精细化投放时——用 p002（广告文案）或 p005（短视频脚本）更针对性',
    inputGuide: {
      '游戏名': { desc: '游戏名称', good: '王者荣耀、原神', bad: '游戏', tip: '用正式名称，AI 可能了解游戏特色' },
      '宣传主题': { desc: '这波宣传的核心主题', good: 'S30赛季更新、3周年庆典、新英雄上线', bad: '宣传游戏', tip: '一次一个主题最好，多主题容易分散' },
      '目标平台': { desc: '文案需要适配的平台', good: '微博+TapTap+B站+小红书', bad: '全平台', tip: '列出具体平台，AI 会为每个平台调整语气和长度' },
      '核心卖点': { desc: '最想传达的 1-3 个卖点', good: '新英雄技能颠覆玩法、3周年返场皮肤投票', bad: '好玩', tip: '有具体卖点，文案才有抓手' },
    },
    exampleFull: {
      input: '游戏名=王者荣耀 宣传主题=S30赛季更新 目标平台=微博+TapTap+B站+小红书 核心卖点=新英雄"沧溟"水系法师+全新对局机制"潮汐战场"',
      outputSummary: '生成文案组合：① 微博（3条：预热悬念+正式官宣+互动话题）② TapTap（版本更新公告长文，2000字，含更新详情和社区互动）③ B站（动态文案+视频标题5选1）④ 小红书（种草帖：标题+正文+Tag），每条附带最佳发布时间建议',
      model: 'ChatGPT',
    },
    commonFailures: [
      { symptom: '各平台文案风格一样，只是长短不同', cause: '没有说明各平台的差异化需求', fix: '要求"微博要短平快、TapTap要详细专业、B站要玩梗、小红书要种草感"' },
      { symptom: '文案缺乏游戏特色，像通用模板', cause: '卖点描述太模糊', fix: '给出具体的游戏特色和本次更新亮点，让 AI 围绕卖点创作' },
      { symptom: '标题都差不多，缺少变化', cause: 'AI 倾向于用类似句式', fix: '要求"每个平台至少3个标题备选，风格不同：悬念式/数字式/疑问式/玩梗式"' },
    ],
    optimizationTips: [
      '要求"按发布时间排序输出一份宣传排期表"——时间+平台+内容一目了然',
      '追问"这套文案的整体传播节奏是什么？预热→爆发→长尾各阶段重点平台是？"——从文案升级到传播策略',
      '要求"为每条文案标注建议配图/视频方向"——文案+视觉一次性规划',
    ],
    versions: {
      lite: { label: '快速版', desc: '一个主题，出全平台文案', prompt: '你是游戏市场文案主管。为{游戏名}的{宣传主题}写一套宣传文案，覆盖{平台}，每个平台 2-3 条。' },
      advanced: { label: '传播版', desc: '含发布排期、配图方向、互动引导', promptDiff: '+ 按时间线编排发布排期\n+ 每条标注建议配图/视频方向\n+ 互动引导语（话题、投票、转发抽奖）\n+ 分平台标题备选（3选1）\n+ 预判评论区反应' },
    },
    relatedTools: ['chatgpt'],
    relatedTutorials: ['t008'],
    relatedPrompts: ['p002', 'p012'],
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

// 执行
console.log('===== Batch-3 内容升级 =====\n');
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
console.log(`工具：${upgradedTools}/35 已升级（batch-1: 3 + batch-2: 3 + batch-3: ${toolCount} = ${upgradedTools}）`);
console.log(`Prompt：${upgradedPrompts}/525 已升级（batch-1: 3 + batch-2: 5 + batch-3: ${promptCount} = ${upgradedPrompts}）`);
console.log('\n✅ Batch-3 数据更新完成');
