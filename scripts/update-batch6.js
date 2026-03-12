/**
 * Batch-6 内容扩展
 * 14 工具（全部剩余）+ 14 Prompt (p032-p045)
 * 执行后工具 35/35 = 100%
 */
const fs = require('fs');
const path = require('path');

const TOOLS_PATH = path.join(__dirname, '..', 'data', 'tools.json');
const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

// ========== 14 工具扩展 ==========
const toolExtensions = {
  'google-imagen': {
    verdict: 'Google 生态里最强的图像生成器，Gemini 直接调用零门槛',
    bestFor: '需要在 Google 生态内快速生成高质量图片的团队',
    notFor: '需要精确控制构图细节或风格迁移的专业美术',
    strengths: ['与 Gemini 深度集成，对话式生图', '人物面部生成质量高', '支持文字渲染（英文）', '免费额度充裕'],
    limitations: ['中文文字渲染效果一般', '风格控制不如 Midjourney 精细', '独立编辑功能有限', '商用授权需确认'],
    pricingAdvice: '通过 Gemini Advanced 订阅使用性价比最高，AI Studio API 适合批量调用',
    vsAlternatives: ['vs Midjourney：Imagen 集成方便但风格控制弱', 'vs Stable Diffusion：Imagen 更易用但可定制性低', 'vs 即梦 AI：Imagen 全球化更强但中文支持弱'],
    quickStart: '打开 Gemini → 输入"生成一张…的图片" → 选择喜欢的结果 → 下载使用',
    timeToValue: '1 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p025'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'ideogram': {
    verdict: '文字渲染王者，Logo 和标题类图片的首选工具',
    bestFor: '需要在图片中渲染清晰文字的营销和设计场景',
    notFor: '不需要文字元素的纯插画或概念原画需求',
    strengths: ['文字渲染准确率业界领先', '支持中英文文字嵌入', 'Logo 和海报设计效果出色', '免费版额度慷慨'],
    limitations: ['非文字场景不如 Midjourney', '人物生成一致性偶有波动', '社区生态不如主流平台', '高级功能需付费'],
    pricingAdvice: '免费版每天 25 张已够日常使用，高频设计需求上 Plus',
    vsAlternatives: ['vs Midjourney：Ideogram 文字渲染强但整体美感弱', 'vs Stable Diffusion：Ideogram 文字能力碾压但开放性低', 'vs Canva AI：Ideogram 生图更专业但缺乏模板'],
    quickStart: '打开 ideogram.ai → 输入 prompt（含要渲染的文字）→ 选择风格 → 生成并下载',
    timeToValue: '2 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p025'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'jimeng': {
    verdict: '字节系国产 AI 绘图工具，中文提示词体验最佳',
    bestFor: '中文母语用户快速生成二次元、国潮风格图片',
    notFor: '需要高度精确控制或写实风格的商业项目',
    strengths: ['中文提示词理解最佳', '二次元和国潮风格出色', '免费使用门槛低', '移动端体验友好'],
    limitations: ['写实风格不如 Midjourney', '高分辨率输出受限', '商用授权条款需注意', '海外可用性低'],
    pricingAdvice: '免费版完全够用于日常测试，会员主要解锁更多风格和分辨率',
    vsAlternatives: ['vs Midjourney：即梦中文支持强但国际化和风格丰富度弱', 'vs Stable Diffusion：即梦更易用但可控性差', 'vs Google Imagen：即梦中文更好但技术底层弱'],
    quickStart: '打开即梦 App/网页 → 输入中文描述 → 选择风格 → 生成图片',
    timeToValue: '1 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p025'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'figma-ai': {
    verdict: 'UI/UX 设计师的 AI 助手，在设计工作流内直接使用',
    bestFor: '已使用 Figma 的团队，需要 AI 辅助设计的场景',
    notFor: '不使用 Figma 或需要独立 AI 绘图能力的场景',
    strengths: ['无缝集成 Figma 工作流', '自动布局和组件建议', '支持文本生成和填充', '团队协作设计中 AI 辅助'],
    limitations: ['必须有 Figma 付费订阅', '生图能力不如专业 AI 绘图工具', '功能仍在快速迭代', 'AI 功能覆盖面有限'],
    pricingAdvice: '已有 Figma Professional 以上订阅即可使用，无需额外付费',
    vsAlternatives: ['vs Midjourney：Figma AI 集成强但生图质量弱', 'vs Canva AI：Figma AI 更专业但学习门槛高', 'vs Photoshop AI：Figma AI 轻量但编辑能力弱'],
    quickStart: '在 Figma 中选择元素 → 右键使用 AI 功能 → 选择生成/修改操作 → 应用结果',
    timeToValue: '3 分钟',
    relatedTutorials: [],
    relatedPrompts: [],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'photoshop-ai': {
    verdict: '专业图像编辑的 AI 进化，生成式填充和扩展改变游戏规则',
    bestFor: '需要精确编辑和修图的美术、设计团队',
    notFor: '只需要简单 AI 生图、不需要精细编辑的场景',
    strengths: ['生成式填充效果业界顶级', '与 PS 传统工具无缝结合', '支持图像扩展（outpainting）', '专业级输出质量'],
    limitations: ['需要 Adobe 订阅（价格不低）', '学习曲线较陡', '对硬件有一定要求', 'AI 功能需联网使用'],
    pricingAdvice: '已有 Adobe 订阅的团队零成本使用；单独为 AI 功能订阅不划算',
    vsAlternatives: ['vs Midjourney：PS AI 编辑能力强但生图创意性弱', 'vs Stable Diffusion：PS AI 更易用但灵活性低', 'vs Canva AI：PS AI 更专业但门槛高'],
    quickStart: '在 PS 中选区 → 使用生成式填充 → 输入描述 → 选择最佳结果 → 继续编辑',
    timeToValue: '5 分钟',
    relatedTutorials: [],
    relatedPrompts: [],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'google-veo': {
    verdict: 'Google 视频生成旗舰，长时长 + 高分辨率 + 物理真实感',
    bestFor: '需要高质量、长时长 AI 视频的创意和营销团队',
    notFor: '预算有限或只需要简单短视频的场景',
    strengths: ['视频质量和一致性极高', '支持较长视频生成', '物理运动真实感强', '与 Google 生态整合'],
    limitations: ['仅通过 Gemini Ultra 或 API 访问', '生成速度较慢', '细粒度控制有限', '价格偏高'],
    pricingAdvice: 'Gemini Ultra 用户可直接使用；API 按量付费适合批量但成本需监控',
    vsAlternatives: ['vs Sora：Veo 可用性更高但创意控制弱', 'vs Runway：Veo 质量高但编辑灵活性低', 'vs Pika：Veo 质量强但价格高'],
    quickStart: '打开 Gemini → 输入"生成一段视频…" → 等待生成 → 预览并下载',
    timeToValue: '3 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p045'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'pika': {
    verdict: '轻量好用的 AI 视频工具，特效和风格化视频首选',
    bestFor: '快速制作风格化短视频、添加 AI 特效',
    notFor: '需要长时长、高复杂度叙事视频的制作',
    strengths: ['界面简洁上手快', '特效和风格化能力突出', '图生视频效果好', '免费版可体验核心功能'],
    limitations: ['视频时长受限', '复杂场景一致性不稳定', '细节控制不如 Runway', '商用需付费版'],
    pricingAdvice: '免费版适合测试效果，Standard $8/月性价比高',
    vsAlternatives: ['vs Runway：Pika 更轻量但专业度弱', 'vs Sora：Pika 更易用但质量差距大', 'vs 海螺 AI：Pika 特效强但中文支持弱'],
    quickStart: '打开 Pika → 上传图片或输入文字描述 → 选择特效/风格 → 生成视频',
    timeToValue: '2 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p045'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'hailuo': {
    verdict: 'MiniMax 出品的国产视频生成利器，中文场景表现优秀',
    bestFor: '中文场景短视频快速生成，特别是人物和动作表现',
    notFor: '需要精细后期编辑或超长视频的专业制作',
    strengths: ['人物动作和表情生成自然', '中文提示词理解准确', '生成速度快', '免费额度充足'],
    limitations: ['视频时长上限较短', '海外访问速度慢', '风格多样性不如国际工具', '高分辨率需等待'],
    pricingAdvice: '免费额度够日常测试，付费套餐适合批量生产',
    vsAlternatives: ['vs Sora：海螺免费更友好但质量差距明显', 'vs Runway：海螺中文强但编辑功能弱', 'vs Pika：海螺人物生成强但特效弱'],
    quickStart: '打开海螺 AI → 输入视频描述（中文）→ 选择参数 → 等待生成 → 下载',
    timeToValue: '2 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p045'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'capcut-ai': {
    verdict: '字节系全能剪辑工具，AI 功能让视频编辑效率翻倍',
    bestFor: '快速剪辑、字幕生成、模板化视频制作',
    notFor: '需要从零 AI 生成视频内容的场景（它是编辑工具，不是生成工具）',
    strengths: ['AI 字幕和翻译极其准确', '海量模板一键套用', '移动端+桌面端+网页三端同步', '基础功能完全免费'],
    limitations: ['AI 生成视频能力不如专业工具', '高级特效需要 Pro', '素材库偏模板化', '导出水印需付费去除'],
    pricingAdvice: '基础版免费且功能丰富，Pro 版适合日常大量视频产出',
    vsAlternatives: ['vs Descript：CapCut 模板多但文字编辑弱', 'vs Runway：CapCut 剪辑强但 AI 生成弱', 'vs 海螺 AI：CapCut 编辑强但生成能力不同赛道'],
    quickStart: '导入素材 → AI 自动字幕 → 选择模板 → 调整剪辑 → 导出',
    timeToValue: '5 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p045'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'descript': {
    verdict: '用编辑文档的方式编辑视频，AI 让视频剪辑像改 Word 一样简单',
    bestFor: '播客、教程、访谈类视频的快速剪辑和润色',
    notFor: '需要复杂特效或高度视觉化的创意视频制作',
    strengths: ['文字即视频：编辑转写文本就能剪辑视频', 'AI 去除口头禅和停顿', '声音克隆补录音频', '多人协作剪辑'],
    limitations: ['不适合特效密集的视频', '中文转写准确度待提升', '高级功能价格不低', '渲染速度受网络影响'],
    pricingAdvice: '免费版适合体验，制作播客或教程视频建议 Pro $24/月',
    vsAlternatives: ['vs CapCut：Descript 文字编辑强但模板少', 'vs Runway：Descript 剪辑效率高但生成能力弱', 'vs 剪映：Descript 英文体验好但中文弱'],
    quickStart: '上传视频 → AI 自动转写 → 编辑文本（=编辑视频）→ 去除填充词 → 导出',
    timeToValue: '5 分钟',
    relatedTutorials: [],
    relatedPrompts: [],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'google-flow': {
    verdict: 'Google 电影级 AI 视频工具，主打叙事连贯性和镜头语言',
    bestFor: '需要多镜头叙事连贯性的创意视频和广告',
    notFor: '简单短视频或不需要复杂镜头语言的场景',
    strengths: ['镜头语言和叙事连贯性强', '支持多镜头脚本生成', '画面质量精美', '与 Google 视频生态整合'],
    limitations: ['需要 Gemini Ultra 订阅', '生成速度较慢', '功能仍在早期迭代', '可用性受地区限制'],
    pricingAdvice: '通过 Gemini Ultra 订阅使用，目前无独立定价',
    vsAlternatives: ['vs Sora：Flow 叙事性强但可用性受限', 'vs Runway：Flow 连贯性好但编辑灵活性弱', 'vs Google Veo：Flow 侧重叙事、Veo 侧重单镜头质量'],
    quickStart: '在 Google AI Studio 中 → 编写多镜头脚本 → 设置参数 → 生成并预览',
    timeToValue: '10 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p045'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'lovable': {
    verdict: '对话式全栈开发平台，不写代码也能做出完整 Web 应用',
    bestFor: '快速搭建 MVP、内部工具和原型验证',
    notFor: '需要高性能或高度定制化的大型项目',
    strengths: ['自然语言描述即可生成完整应用', '前后端+数据库一站式', '支持 Supabase 集成', '可导出源代码继续开发'],
    limitations: ['复杂业务逻辑仍需人工干预', '生成代码质量参差不齐', '对中文支持一般', '免费版功能受限'],
    pricingAdvice: '免费版适合原型验证，Pro $20/月适合持续开发小型项目',
    vsAlternatives: ['vs Cursor：Lovable 更无代码但灵活性低', 'vs v0：Lovable 全栈但 UI 精细度弱', 'vs Bolt.new：Lovable 集成更完整但价格更高'],
    quickStart: '描述你想做的应用 → Lovable 生成代码 → 预览和调整 → 部署上线',
    timeToValue: '10 分钟',
    relatedTutorials: [],
    relatedPrompts: [],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'napkin-ai': {
    verdict: '文字秒变图表，让复杂信息一目了然的可视化神器',
    bestFor: '快速将文字内容转化为信息图、流程图、示意图',
    notFor: '需要精确数据图表或专业统计可视化的场景',
    strengths: ['粘贴文字一键生成图表', '图表风格美观专业', '支持多种图表类型', '导出格式丰富（PNG/SVG/PDF）'],
    limitations: ['数据图表精确度有限', '定制化程度不如专业工具', '中文排版偶有问题', '复杂图表仍需手动调整'],
    pricingAdvice: '免费版满足偶尔使用，频繁制作图表建议 Pro $15/月',
    vsAlternatives: ['vs Gamma：Napkin 图表强但演示功能弱', 'vs Canva：Napkin 自动化强但模板少', 'vs Miro：Napkin AI 生成强但协作弱'],
    quickStart: '粘贴文字内容 → AI 自动分析并建议图表 → 选择样式 → 调整细节 → 导出',
    timeToValue: '2 分钟',
    relatedTutorials: [],
    relatedPrompts: ['p024'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'n8n': {
    verdict: '开源自动化编排平台，AI 工作流的瑞士军刀',
    bestFor: '需要连接多个 AI 工具和服务、构建自动化流程的技术团队',
    notFor: '不具备基本技术能力或只需要单一 AI 工具的个人用户',
    strengths: ['开源可自部署，数据可控', '500+ 集成节点', '可视化工作流编辑', 'AI Agent 节点支持'],
    limitations: ['需要一定技术基础', '自部署需要运维', '社区版功能相对有限', '复杂流程调试不直观'],
    pricingAdvice: '社区版免费且功能完整，Cloud 版 $24/月适合不想运维的团队',
    vsAlternatives: ['vs Zapier：n8n 开源可控但易用性弱', 'vs Make：n8n 灵活性高但学习曲线陡', 'vs Dify：n8n 通用性强但 AI 专注度弱'],
    quickStart: '安装 n8n → 创建工作流 → 拖拽节点连接服务 → 设置触发器 → 激活',
    timeToValue: '30 分钟',
    relatedTutorials: [],
    relatedPrompts: [],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  }
};

// ========== 14 Prompt 扩展 (p032-p045) ==========
const promptExtensions = {
  'p032': {
    taskCategory: '写文案',
    taskDesc: '优化游戏在各应用商店的ASO（应用商店优化）展示内容，提升搜索排名和转化率',
    whenToUse: '新游上线、大版本更新、ASO 优化周期、商店审核通过后的文案调整',
    whenNotToUse: '不适合已有成熟 ASO 团队且数据驱动优化的项目',
    inputGuide: {
      required: '游戏名称、游戏类型、目标商店、目标市场',
      optional: '当前描述、核心关键词、竞品列表',
      tips: '不同商店字符限制不同：App Store 标题 30 字符、Google Play 50 字符'
    },
    exampleFull: {
      input: '游戏名=幻想大陆，类型=二次元RPG，商店=App Store，市场=中国',
      outputPreview: '标题：幻想大陆 - 沉浸式二次元冒险RPG\n短描述：百万玩家的幻想世界...\n关键词：二次元RPG、冒险手游、幻想大陆...'
    },
    commonFailures: ['忽略不同商店的字符限制差异', '关键词堆砌导致可读性下降', '描述与实际游戏体验不符'],
    optimizationTips: ['先用 Perplexity 调研竞品 ASO 策略', '每次提交记录 A/B 测试版本', '结合 App Annie 等工具数据反馈'],
    versions: {
      lite: '只生成标题和短描述',
      advanced: '包含完整关键词矩阵 + 截图文案 + 竞品对比'
    },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p033', 'p035'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p033': {
    taskCategory: '写文案',
    taskDesc: '为游戏广告投放生成高转化的落地页文案，覆盖标题、卖点、CTA 等完整结构',
    whenToUse: '新广告活动启动、落地页 A/B 测试、推广渠道新增',
    whenNotToUse: '落地页已有稳定高转化率且无需迭代的情况',
    inputGuide: {
      required: '游戏名称、核心卖点、目标用户画像、推广渠道',
      optional: '当前转化率、竞品落地页链接、品牌调性要求',
      tips: '明确渠道差异：Facebook 落地页和 TikTok 落地页风格完全不同'
    },
    exampleFull: {
      input: '游戏=星际远征，卖点=开放世界太空探索，用户=18-35男性硬核玩家，渠道=Facebook',
      outputPreview: '主标题：探索无限宇宙 | 你的星际冒险从这里开始\n副标题：百万玩家的开放世界太空MMO...'
    },
    commonFailures: ['卖点过多导致焦点分散', 'CTA 不够明确', '未针对渠道特性优化'],
    optimizationTips: ['每个落地页只聚焦 1-2 个核心卖点', '用 Claude 生成多个版本做 A/B 测试', 'CTA 按钮文案比正文更重要'],
    versions: {
      lite: '仅生成标题和 CTA',
      advanced: '完整落地页结构 + 多版本对比 + 渠道适配'
    },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p032', 'p035'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p034': {
    taskCategory: '写文案',
    taskDesc: '将广告素材文案适配为多语言版本，保留原意的同时符合当地文化',
    whenToUse: '游戏海外发行、多地区同步推广、本地化素材制作',
    whenNotToUse: '已有专业本地化团队处理且不需要 AI 辅助初稿',
    inputGuide: {
      required: '原始文案（中文/英文）、目标语言、游戏类型',
      optional: '目标市场文化禁忌、品牌调性、竞品参考',
      tips: '提供游戏内专有名词的官方翻译对照表'
    },
    exampleFull: {
      input: '原始文案=「修仙问道，一剑破苍穹」，目标=日/韩/英，类型=仙侠RPG',
      outputPreview: '日语：修仙の道を歩み、一剣で蒼穹を切り裂け\n韩语：수선의 길, 한 검으로 창궁을 가르다\n英语：Walk the Path of Immortality...'
    },
    commonFailures: ['直译导致文化不适配', '忽略当地广告法规限制', '游戏术语翻译不一致'],
    optimizationTips: ['用 Claude 做初步翻译，再让母语者审校', '建立术语表确保全渠道一致', '先用 Perplexity 了解目标市场文化偏好'],
    versions: {
      lite: '单语言快速翻译',
      advanced: '多语言 + 文化适配说明 + 广告法规提示'
    },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p032', 'p033'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p035': {
    taskCategory: '写文案',
    taskDesc: '为游戏预注册/预约阶段生成吸引玩家提前关注的广告文案',
    whenToUse: '游戏上线前 1-3 个月的预热推广期',
    whenNotToUse: '游戏已上线或预注册阶段已结束',
    inputGuide: {
      required: '游戏名称、类型、核心卖点、预计上线时间',
      optional: '预注册奖励内容、目标预注册数量、竞品参考',
      tips: '预注册文案核心是「制造期待感」而非「介绍功能」'
    },
    exampleFull: {
      input: '游戏=龙之觉醒，类型=3D ARPG，卖点=次世代画面+操作手感，上线=2025Q3，奖励=预注册送SSR角色',
      outputPreview: '标题：龙之觉醒 — 次世代 ARPG 即将震撼来袭\n利益点：预注册即送 SSR 限定角色「龙骑士·艾拉」...'
    },
    commonFailures: ['缺少明确的预注册奖励激励', '紧迫感不足', '与上线后素材风格脱节'],
    optimizationTips: ['倒计时元素增强紧迫感', '奖励分阶梯设计（10万/50万/100万预注册）', '配合社交分享机制放大传播'],
    versions: {
      lite: '基础预注册标题 + CTA',
      advanced: '完整预注册推广方案 + 阶梯奖励文案 + 社交传播话术'
    },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p032', 'p033'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p036': {
    taskCategory: '做分析',
    taskDesc: '深度分析竞品游戏的商业化模式，提炼可借鉴的变现策略',
    whenToUse: '商业化方案设计前期、竞品调研阶段、付费数据异常需要参考时',
    whenNotToUse: '只需要表面信息而非深度分析的快速扫描',
    inputGuide: {
      required: '竞品游戏名称、游戏类型、分析重点',
      optional: '自家游戏现有商业化模式、目标 ARPU、用户画像',
      tips: '提供竞品近期活动截图或商店更新记录效果更好'
    },
    exampleFull: {
      input: '竞品=原神，类型=开放世界RPG，重点=角色售卖和抽卡模式',
      outputPreview: '核心模型：限定角色+武器双池轮替\n定价策略：保底机制（90抽硬保底）降低心理门槛...'
    },
    commonFailures: ['只看表面定价忽略运营节奏', '忽视不同市场的差异化定价', '照搬竞品模式不考虑自身用户特征'],
    optimizationTips: ['用 Perplexity 搜集竞品最新财报和收入数据', '对比至少 3 款竞品形成矩阵', '结合自身 LTV 数据做可行性评估'],
    versions: {
      lite: '单竞品核心商业化模式概述',
      advanced: '多竞品矩阵对比 + 收入估算 + 可借鉴策略清单'
    },
    relatedTools: ['perplexity', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p037', 'p040'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p037': {
    taskCategory: '做分析',
    taskDesc: '追踪和分析竞品游戏的版本更新节奏、内容方向和运营策略',
    whenToUse: '制定版本规划时参考竞品、行业趋势分析、季度复盘',
    whenNotToUse: '只需要单次版本对比而非持续追踪的情况',
    inputGuide: {
      required: '竞品名称、追踪时间范围、关注维度',
      optional: '自家版本更新计划、商店更新日志链接',
      tips: '用 Perplexity 联网搜索可以获取最新版本信息'
    },
    exampleFull: {
      input: '竞品=崩坏：星穹铁道，时间=近6个月，关注=新角色投放节奏和活动类型',
      outputPreview: '版本节奏：每 42 天一个大版本，中间穿插 2 个小更新\n角色投放：交替投放限定/常驻...'
    },
    commonFailures: ['只关注内容更新忽略运营活动', '未记录时间线导致节奏判断偏差', '忽视用户社区反馈变化'],
    optimizationTips: ['建立竞品版本追踪表格（更新日期/内容/营收变化）', '结合 SensorTower 等工具获取下载和收入数据', '关注竞品社区（TapTap/NGA）了解玩家反馈'],
    versions: {
      lite: '近期版本更新列表和简要分析',
      advanced: '完整版本时间线 + 节奏分析 + 内容方向预测'
    },
    relatedTools: ['perplexity', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p036', 'p038'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p038': {
    taskCategory: '做分析',
    taskDesc: '分析竞品在各社交媒体平台的运营策略、内容方向和用户互动',
    whenToUse: '制定社媒运营策略、分析竞品传播打法、学习优秀案例',
    whenNotToUse: '已有专业社媒监测工具覆盖且数据完善的情况',
    inputGuide: {
      required: '竞品名称、目标平台（微博/B站/TikTok等）、分析时间段',
      optional: '自家社媒数据、竞品官方账号链接',
      tips: '关注互动率（评论/转发）而非粉丝数'
    },
    exampleFull: {
      input: '竞品=王者荣耀，平台=B站+微博，时间=近3个月',
      outputPreview: '内容策略：B站侧重攻略和赛事高光，微博侧重话题互动和新皮肤预告\n发布节奏：...'
    },
    commonFailures: ['只看粉丝数忽略互动质量', '未区分不同平台的内容策略差异', '忽视 KOL 合作和用户 UGC 分析'],
    optimizationTips: ['用 Perplexity 搜集竞品各平台近期热门内容', '制作「内容日历」可视化竞品发布节奏', '重点分析爆款内容的共性特征'],
    versions: {
      lite: '单平台运营概况',
      advanced: '多平台矩阵分析 + KOL 合作梳理 + 爆款内容拆解'
    },
    relatedTools: ['perplexity', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p037', 'p039'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p039': {
    taskCategory: '做分析',
    taskDesc: '对竞品游戏的用户评价进行深度挖掘，提炼玩家痛点和需求',
    whenToUse: '产品立项调研、功能优化参考、用户体验改进',
    whenNotToUse: '竞品评价样本量太小不具备统计意义的情况',
    inputGuide: {
      required: '竞品名称、评价来源（TapTap/App Store/Google Play）、分析维度',
      optional: '评分筛选范围、时间范围、特定功能关注点',
      tips: '重点关注 2-4 星评价，这些往往包含最有价值的建设性反馈'
    },
    exampleFull: {
      input: '竞品=明日方舟，来源=TapTap，维度=近期差评集中反馈的问题',
      outputPreview: '核心痛点TOP5：\n1. 体力系统过于限制（提及率35%）\n2. 新角色强度膨胀...'
    },
    commonFailures: ['只看总分忽略评分分布变化', '被水军评论干扰判断', '未区分不同版本的评价变化'],
    optimizationTips: ['用 Claude 批量分析评价文本提取关键词', '关注评分随版本更新的趋势变化', '交叉对比不同平台的评价差异'],
    versions: {
      lite: '评价摘要和主要痛点列表',
      advanced: '完整情感分析 + 痛点分类 + 版本趋势 + 可借鉴改进建议'
    },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: [],
    relatedPrompts: ['p036', 'p040'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p040': {
    taskCategory: '做分析',
    taskDesc: '为竞品游戏生成结构化的 SWOT 分析，辅助战略决策',
    whenToUse: '立项评审、季度战略复盘、投资尽调中的竞品分析',
    whenNotToUse: '只需要简单竞品信息收集而非战略级分析',
    inputGuide: {
      required: '竞品名称、所属品类、分析目的',
      optional: '自家产品信息（用于对比）、市场数据、最新财报',
      tips: '提供自家产品的 SWOT 可以让对比分析更有针对性'
    },
    exampleFull: {
      input: '竞品=原神，品类=开放世界RPG，目的=立项参考',
      outputPreview: 'Strengths: 跨平台覆盖、持续高质量内容更新...\nWeaknesses: 端游运营模式在移动端受限...'
    },
    commonFailures: ['SWOT 各象限信息量不均衡', '只列表面现象缺乏深层分析', 'Threats 和 Opportunities 混淆'],
    optimizationTips: ['用 Perplexity 搜集最新行业数据填充分析', '每个维度列 3-5 条，附证据支撑', 'SO/WO/ST/WT 交叉策略是核心产出'],
    versions: {
      lite: '标准四象限 SWOT 框架',
      advanced: 'SWOT + 交叉策略矩阵 + 行业对标 + 战略建议'
    },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: [],
    relatedPrompts: ['p036', 'p039'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p041': {
    taskCategory: '写方案',
    taskDesc: '根据需求描述自动生成标准化的系统功能设计文档',
    whenToUse: '新功能设计阶段、需求评审前的文档准备、技术方案对齐',
    whenNotToUse: '需求尚未明确、还在脑暴阶段不宜过早文档化',
    inputGuide: {
      required: '功能名称、功能描述、目标用户/角色',
      optional: '关联系统、性能要求、交互原型、参考实现',
      tips: '先用一句话说清楚「这个功能解决什么问题」'
    },
    exampleFull: {
      input: '功能=好友系统，描述=支持添加好友/私聊/组队，角色=全服玩家',
      outputPreview: '1. 功能概述\n好友系统提供玩家间社交连接...\n2. 功能规格\n2.1 好友添加（搜索/推荐/扫码）...'
    },
    commonFailures: ['边界条件描述不清晰', '遗漏异常流程', '缺少数据流向说明'],
    optimizationTips: ['让 Claude 先列大纲再展开细节', '同步提供交互稿可以生成更准确的文档', '明确「不做什么」和「做什么」同样重要'],
    versions: {
      lite: '简版功能说明（1-2 页）',
      advanced: '完整功能设计文档 + 数据结构 + 接口定义 + 测试用例'
    },
    relatedTools: ['claude', 'notion-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p042', 'p044'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p042': {
    taskCategory: '写方案',
    taskDesc: '为已确认的功能设计生成交互设计说明文档，供设计师和前端参考',
    whenToUse: '功能设计完成后、UI/UX 设计前的交互定义阶段',
    whenNotToUse: '功能需求尚未确认或已有完整交互稿的情况',
    inputGuide: {
      required: '功能名称、用户操作流程、页面/界面列表',
      optional: '现有交互稿/线框图、设计规范、参考 App',
      tips: '用「用户+动作+反馈」的三元组描述每个交互节点'
    },
    exampleFull: {
      input: '功能=抽卡系统，流程=进入商店→选择卡池→确认消耗→播放动画→展示结果',
      outputPreview: '页面1: 卡池选择页\n- 展示当前UP角色立绘\n- 显示保底进度（距上次出金X抽）...'
    },
    commonFailures: ['遗漏加载态和错误态', '缺少动效/转场描述', '未考虑不同设备适配'],
    optimizationTips: ['按页面/弹窗为单位组织交互说明', '每个交互节点标注「正常/异常/边界」三种情况', '附上竞品截图辅助理解'],
    versions: {
      lite: '核心流程交互说明',
      advanced: '完整交互文档 + 状态流转图 + 动效说明 + 适配方案'
    },
    relatedTools: ['claude', 'figma-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p041', 'p043'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p043': {
    taskCategory: '做分析',
    taskDesc: '评估策划方案的技术可行性，识别潜在技术风险和实现难点',
    whenToUse: '策划案完成后提交技术评审前、跨部门可行性讨论前',
    whenNotToUse: '策划方案本身还在概念阶段，细节不够充分',
    inputGuide: {
      required: '策划案内容、目标平台、当前技术栈',
      optional: '团队技术能力评估、时间限制、性能要求',
      tips: '提供现有系统架构说明可以让评估更准确'
    },
    exampleFull: {
      input: '策划案=开放世界无缝大地图，平台=移动端，技术栈=Unity',
      outputPreview: '可行性评估：中高难度\n核心技术挑战：\n1. 内存管理：移动端 2GB 限制下的地图分块加载...'
    },
    commonFailures: ['只评估能否做到忽略性能代价', '未考虑测试和维护成本', '低估多人同步的技术难度'],
    optimizationTips: ['让 Claude 按「确定可行/有风险/需预研」三级评估', '每个风险点给出替代方案', '附上时间估算帮助决策'],
    versions: {
      lite: '可行性快速判断 + 核心风险点',
      advanced: '完整可行性报告 + 风险矩阵 + 替代方案 + 工期估算'
    },
    relatedTools: ['claude', 'cursor'],
    relatedTutorials: [],
    relatedPrompts: ['p041', 'p044'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p044': {
    taskCategory: '写方案',
    taskDesc: '生成可视化的版本规划路线图，清晰展示功能排期和里程碑',
    whenToUse: '季度/年度规划、项目立项、汇报版本计划',
    whenNotToUse: '规划周期过短（1-2周）不值得做路线图',
    inputGuide: {
      required: '产品名称、规划周期、已确定的功能列表',
      optional: '团队规模、技术限制、外部依赖（版号/节日/商务合作）',
      tips: '先按优先级排序功能，再分配到时间线'
    },
    exampleFull: {
      input: '产品=幻想大陆，周期=2025H2，功能=好友系统/公会战/赛季Pass/新地图',
      outputPreview: 'Q3 里程碑：好友系统 + 赛季 Pass\n  - 7月：好友系统开发（4周）...\nQ4 里程碑：公会战 + 新地图...'
    },
    commonFailures: ['排期过于乐观不留缓冲', '忽略外部依赖（版号、节日）', '功能之间的依赖关系未标注'],
    optimizationTips: ['用 Mermaid 语法让 Claude 输出甘特图', '每个里程碑标注「Go/No-Go」决策点', '预留 20% 缓冲时间应对不确定性'],
    versions: {
      lite: '简版时间线（功能+月份）',
      advanced: '完整路线图 + 甘特图 + 依赖关系 + 风险标注'
    },
    relatedTools: ['claude', 'notion-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p041', 'p043'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p045': {
    taskCategory: '产内容',
    taskDesc: '为游戏 PV（宣传视频）或 CG 动画编写分镜脚本',
    whenToUse: 'PV/CG 制作立项、与外包团队沟通分镜、内部创意评审',
    whenNotToUse: '已有完成的分镜稿只需要微调的情况',
    inputGuide: {
      required: '游戏名称、视频类型（PV/CG/实机）、核心表达主题、时长',
      optional: '角色设定、世界观背景、参考视频、配乐风格',
      tips: '每个镜头用「景别+动作+情绪+时长」四要素描述'
    },
    exampleFull: {
      input: '游戏=暗夜编年史，类型=CG预告片，主题=世界末日后的希望，时长=90秒',
      outputPreview: '镜头1（远景/3秒）：荒废的城市废墟全景，阴云密布...\n镜头2（特写/2秒）：主角手握破碎的项链...'
    },
    commonFailures: ['镜头描述缺少技术细节（景别/运镜）', '节奏平淡没有高潮', '脚本超出制作预算可行性'],
    optimizationTips: ['先让 AI 生成故事大纲再展开分镜', '标注关键帧方便美术理解', '用 Sora/Runway 快速测试分镜效果'],
    versions: {
      lite: '故事大纲 + 关键帧描述',
      advanced: '完整分镜脚本 + 镜头语言标注 + 配乐建议 + 制作提示'
    },
    relatedTools: ['chatgpt', 'sora', 'runway'],
    relatedTutorials: [],
    relatedPrompts: ['p029'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  }
};

// ========== 执行升级 ==========
console.log('===== Batch-6 内容升级 =====\n');

// 工具升级
const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf8'));
console.log('--- 工具升级 ---');
let toolCount = 0;
for (const [id, ext] of Object.entries(toolExtensions)) {
  const tool = tools.find(t => t.id === id);
  if (!tool) { console.log(`  ✗ ${id} — 未找到`); continue; }
  Object.assign(tool, ext);
  console.log(`  ✓ ${id} (${tool.name}) — 添加 13 个扩展字段`);
  toolCount++;
}
fs.writeFileSync(TOOLS_PATH, JSON.stringify(tools, null, 2), 'utf8');
console.log(`\n工具更新完成：${toolCount} 个工具已升级`);

// Prompt 升级
const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
console.log('\n--- Prompt 升级 ---');
let promptCount = 0;
for (const [id, ext] of Object.entries(promptExtensions)) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) { console.log(`  ✗ ${id} — 未找到`); continue; }
  Object.assign(prompt, ext);
  console.log(`  ✓ ${id} (${prompt.name}) — 添加 13 个扩展字段`);
  promptCount++;
}
fs.writeFileSync(PROMPTS_PATH, JSON.stringify(prompts, null, 2), 'utf8');
console.log(`\nPrompt 更新完成：${promptCount} 个 Prompt 已升级`);

// 验证
console.log('\n--- 验证 ---');
const verifiedTools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf8'));
const verifiedPrompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
const upgradedTools = verifiedTools.filter(t => !!t.verdict).length;
const upgradedPrompts = verifiedPrompts.filter(p => !!p.taskCategory).length;
console.log(`工具：${upgradedTools}/${verifiedTools.length} 已升级`);
console.log(`Prompt：${upgradedPrompts}/${verifiedPrompts.length} 已升级`);

if (upgradedTools === verifiedTools.length) {
  console.log('\n🎉 所有工具 100% 升级完成！');
}

console.log('\n✅ Batch-6 数据更新完成');
