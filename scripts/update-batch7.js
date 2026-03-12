/**
 * Batch-7 内容扩展
 * 20 Prompt (p046-p065)
 * 覆盖场景: 视频脚本、品牌营销、用户分析、市场调研、数据分析
 */
const fs = require('fs');
const path = require('path');

const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

const promptExtensions = {
  'p046': {
    taskCategory: '产内容',
    taskDesc: '为游戏直播活动编写完整的策划脚本，覆盖流程、话术和互动环节',
    whenToUse: '新版本上线直播、周年庆直播、电竞赛事转播等活动准备期',
    whenNotToUse: '非计划性的日常闲聊直播或纯主播个人风格直播',
    inputGuide: {
      required: '直播主题、时长、平台（B站/抖音/YouTube）、核心目标',
      optional: '主播/嘉宾信息、互动道具预算、预期观众量',
      tips: '按时间轴编排脚本，每 10 分钟设置一个互动高潮点'
    },
    exampleFull: {
      input: '主题=2.0版本上线首播，时长=2小时，平台=B站，目标=展示新内容+预约引导',
      outputPreview: '0:00-0:10 开场暖场（主播自我介绍+版本亮点预告）\n0:10-0:30 新内容实机展示...'
    },
    commonFailures: ['节奏单一没有高低起伏', '互动环节设计太少', '未预留意外情况应对方案'],
    optimizationTips: ['在关键时刻设置抽奖/弹幕互动', '准备 B 计划应对技术问题', '提前彩排至少一次'],
    versions: { lite: '简版流程大纲', advanced: '完整分镜脚本 + 话术模板 + 互动机制 + 应急预案' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p045', 'p049'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p047': {
    taskCategory: '产内容',
    taskDesc: '生成游戏评测或解说类视频的脚本结构和文案',
    whenToUse: '制作官方评测视频、邀请 KOL 评测、内部试玩视频',
    whenNotToUse: '纯实机录像无需旁白解说的场景',
    inputGuide: {
      required: '游戏名称、视频类型（评测/解说/攻略）、时长、目标受众',
      optional: '视频风格参考、关注维度（画面/玩法/剧情）、平台',
      tips: '评测视频最佳时长 8-15 分钟，注意开头 30 秒抓住观众'
    },
    exampleFull: {
      input: '游戏=幻想大陆，类型=全面评测，时长=12分钟，受众=核心RPG玩家',
      outputPreview: '开场Hook（0:00-0:30）：「这可能是今年最被低估的RPG...」\n画面评测（0:30-3:00）...'
    },
    commonFailures: ['评测角度不全面', '缺少与竞品的对比', '节奏拖沓观众流失'],
    optimizationTips: ['开头用反直觉观点或疑问句吸引注意', '每 2-3 分钟切换话题维度', '结尾给明确推荐/不推荐结论'],
    versions: { lite: '评测大纲 + 关键观点', advanced: '完整逐字稿 + B-Roll 建议 + 数据引用' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p045', 'p048'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p048': {
    taskCategory: '产内容',
    taskDesc: '为游戏品牌纪录片或幕后制作视频编写脚本',
    whenToUse: '周年庆品牌回顾、GDC/TGA 等展会配套、团队招聘宣传',
    whenNotToUse: '时间紧迫只需要快速剪辑花絮的情况',
    inputGuide: {
      required: '主题方向、时长、核心叙事线、采访对象',
      optional: '已有素材清单、品牌调性、配乐风格偏好',
      tips: '纪录片核心是「人的故事」，不是产品功能介绍'
    },
    exampleFull: {
      input: '主题=「从零到一」创业故事，时长=8分钟，叙事=创始人+美术+程序三线并行',
      outputPreview: '序章（0:00-1:00）：工作室空镜+核心团队剪影\n第一章：起源...'
    },
    commonFailures: ['变成产品广告失去纪录片质感', '叙事线太多导致混乱', '缺少情感高潮'],
    optimizationTips: ['用「挑战-克服-成长」的叙事弧线', '真实采访比旁白更有感染力', '配乐决定 60% 的情绪'],
    versions: { lite: '故事大纲 + 采访问题列表', advanced: '完整分镜脚本 + 采访提纲 + 配乐建议 + 后期指导' },
    relatedTools: ['claude', 'sora'],
    relatedTutorials: [],
    relatedPrompts: ['p045', 'p047'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p049': {
    taskCategory: '写方案',
    taskDesc: '策划 UGC（用户生成内容）视频活动方案，激发玩家创作',
    whenToUse: '需要扩大社区声量、积累用户素材、提升品牌口碑',
    whenNotToUse: '游戏社区基数太小（DAU<1万）不足以支撑 UGC 活动',
    inputGuide: {
      required: '游戏名称、活动目标、目标平台、预算范围',
      optional: '过往 UGC 活动数据、KOL 资源、奖品方案',
      tips: '降低参与门槛是 UGC 活动成功的关键'
    },
    exampleFull: {
      input: '游戏=星际远征，目标=征集1000条UGC视频，平台=抖音+B站，预算=5万',
      outputPreview: '活动名称：「我的星际故事」短视频征集\n参与方式：拍摄15-60秒游戏相关视频...'
    },
    commonFailures: ['参与门槛太高', '奖励不够吸引力', '缺少传播裂变机制'],
    optimizationTips: ['提供模板降低创作门槛', '设置阶梯奖励（参与奖+人气奖+评委奖）', '邀请头部 KOL 首发带动'],
    versions: { lite: '活动规则和奖励方案', advanced: '完整策划书 + 传播路径 + KOL 合作 + 数据预估' },
    relatedTools: ['chatgpt', 'capcut-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p046', 'p052'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p050': {
    taskCategory: '写方案',
    taskDesc: '生成品牌联名合作方案，寻找跨界合作机会并规划执行计划',
    whenToUse: '品牌升级期、节日营销、新游上线需要破圈',
    whenNotToUse: '品牌知名度极低没有联名谈判筹码的阶段',
    inputGuide: {
      required: '自家品牌/游戏信息、目标联名方向、预算范围、时间节点',
      optional: '目标合作品牌列表、过往联名经验、IP 资源',
      tips: '优先选择用户画像重叠度高的品牌'
    },
    exampleFull: {
      input: '游戏=幻想大陆（二次元RPG），方向=快消品联名，预算=20万，时间=暑期',
      outputPreview: '推荐联名方向：1. 茶饮品牌（喜茶/奈雪）→ 限定饮品+角色杯套\n2. 便利店...'
    },
    commonFailures: ['联名仅停留在 logo 互放缺乏深度', '双方用户画像不匹配', '执行周期低估'],
    optimizationTips: ['用 Perplexity 调研潜在合作方的品牌调性', '设计双向引流机制', '预留 3-4 个月的执行周期'],
    versions: { lite: '联名方向建议 + 简要方案', advanced: '完整方案书 + 合作品牌分析 + 执行时间线 + ROI 预估' },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: [],
    relatedPrompts: ['p051', 'p053'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p051': {
    taskCategory: '写方案',
    taskDesc: '为游戏品牌或 IP 设计人格化形象方案，打造有温度的品牌人设',
    whenToUse: '品牌初建期、社媒账号运营定位、虚拟形象/吉祥物设计',
    whenNotToUse: '品牌人格已稳定运营且社区认可度高的情况',
    inputGuide: {
      required: '品牌/游戏名称、目标受众、品牌核心价值',
      optional: '现有品牌调性、竞品品牌人格分析、社媒运营团队情况',
      tips: '品牌人格需要在所有触点保持一致性'
    },
    exampleFull: {
      input: '游戏=星际远征，受众=18-30男性硬核玩家，价值=探索/自由/挑战',
      outputPreview: '品牌人格：「星际探索者」\n性格特征：冷静理性但偶尔幽默、知识丰富、尊重玩家...'
    },
    commonFailures: ['人格设定太模糊缺乏辨识度', '与实际运营脱节', '不同渠道人设不一致'],
    optimizationTips: ['创建「品牌人格手册」指导所有内容产出', '定义「绝不会说」的底线', '参考成功案例（如小米人格化运营）'],
    versions: { lite: '品牌人格画像 + 说话风格', advanced: '完整品牌人格手册 + 各平台适配 + 话术模板库' },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p050', 'p054'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p052': {
    taskCategory: '写方案',
    taskDesc: '策划社交媒体话题营销方案，制造传播热点',
    whenToUse: '版本更新宣传、节日营销、需要社交声量的关键节点',
    whenNotToUse: '预算不支持投放或社媒账号粉丝基数太低',
    inputGuide: {
      required: '话题目标、目标平台、预算、时间节点',
      optional: 'KOL 资源、过往话题数据、热点借势方向',
      tips: '话题需要有「参与感」和「争议性」才能引发讨论'
    },
    exampleFull: {
      input: '目标=新角色上线造势，平台=微博+B站，预算=10万，时间=发售前一周',
      outputPreview: '话题策略：#你选谁当队长#\n阶段1（D-7）：悬念海报引发猜测\n阶段2（D-3）...'
    },
    commonFailures: ['话题缺乏参与感成为单向宣传', '节奏把控不当热度过早消退', '未预备负面舆情应对方案'],
    optimizationTips: ['设计投票/站队机制增加参与感', '分 3 个阶段逐步升温', '准备话题引导 KOL 列表'],
    versions: { lite: '话题创意 + 发布节奏', advanced: '完整话题营销方案 + KOL 矩阵 + 传播路径 + 数据监控' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p049', 'p053'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p053': {
    taskCategory: '写方案',
    taskDesc: '策划线下活动或展会参展方案，打通线上线下体验',
    whenToUse: 'ChinaJoy/TGS/科隆等展会参展、粉丝见面会、城市巡回活动',
    whenNotToUse: '纯线上运营不涉及线下的项目',
    inputGuide: {
      required: '活动类型、场地信息、预算、预期参与人数',
      optional: '过往活动经验、合作方资源、周边商品计划',
      tips: '线下活动的核心是「可传播的体验」而非单纯品牌露出'
    },
    exampleFull: {
      input: '类型=ChinaJoy参展，场地=N2馆200平，预算=50万，预期日均5000人',
      outputPreview: '展区规划：\nA区-沉浸体验区（试玩+VR）\nB区-互动打卡区（拍照+周边兑换）...'
    },
    commonFailures: ['只有展示没有互动', '排队体验糟糕', '未打通线上传播'],
    optimizationTips: ['设计「拍照打卡→社交分享→线上奖励」闭环', '控制每个体验点的停留时长', '准备线上同步直播扩大覆盖'],
    versions: { lite: '活动大纲 + 展区规划', advanced: '完整策划书 + 动线设计 + 人员安排 + 预算明细 + 应急预案' },
    relatedTools: ['claude', 'gamma'],
    relatedTutorials: [],
    relatedPrompts: ['p050', 'p052'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p054': {
    taskCategory: '写方案',
    taskDesc: '制定品牌口碑和舆情管理方案，预防和应对公关危机',
    whenToUse: '游戏上线前的舆情预案、出现负面舆论时的应对、日常口碑维护',
    whenNotToUse: '已有专业 PR 团队且危机管理体系成熟的项目',
    inputGuide: {
      required: '品牌/游戏名称、当前舆情状况、主要社区平台',
      optional: '过往危机案例、竞品舆情分析、媒体关系资源',
      tips: '舆情管理重在「日常建设」而非「事后灭火」'
    },
    exampleFull: {
      input: '游戏=幻想大陆，状况=近期因付费调整出现大量差评，平台=TapTap+NGA',
      outputPreview: '紧急应对（24小时内）：\n1. 官方声明模板（承认问题+说明计划+补偿方案）...'
    },
    commonFailures: ['反应速度太慢错过黄金期', '声明官僚化缺少诚意', '承诺了却没兑现'],
    optimizationTips: ['建立舆情监控关键词列表', '预设不同等级的应对 SOP', '核心社区安排专人值守'],
    versions: { lite: '舆情应对 SOP 模板', advanced: '完整舆情管理体系 + 监控方案 + 危机分级 + 话术库' },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: [],
    relatedPrompts: ['p051', 'p038'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p055': {
    taskCategory: '做分析',
    taskDesc: '基于游戏数据构建多维用户画像，支撑精细化运营决策',
    whenToUse: '新游立项用户定位、运营策略制定、广告投放人群定向',
    whenNotToUse: '已有成熟的数据中台和画像系统的大团队',
    inputGuide: {
      required: '游戏类型、目标市场、已有用户数据维度',
      optional: '竞品用户分析、调研数据、社区反馈',
      tips: '画像要基于数据和行为，避免「我觉得用户是这样」的臆想'
    },
    exampleFull: {
      input: '类型=二次元RPG，市场=中国，数据=DAU/付费/留存/设备分布',
      outputPreview: '核心用户画像：\n- 人口统计：18-28岁，男性65%，一二线城市为主\n- 行为特征：日均在线40分钟...'
    },
    commonFailures: ['画像过于笼统缺乏可操作性', '混淆「现有用户」和「目标用户」', '忽视非付费用户的价值'],
    optimizationTips: ['用「场景+需求+行为」三维建模', '区分核心/活跃/沉默/流失四类用户', '定期更新画像（至少每季度）'],
    versions: { lite: '基础人口统计+行为画像', advanced: '多维画像 + 用户旅程地图 + 分层策略建议' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p056', 'p059'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p056': {
    taskCategory: '做分析',
    taskDesc: '分析用户流失原因，提出针对性的留存改善建议',
    whenToUse: '流失率异常升高、大版本后用户流失、流失预警触发',
    whenNotToUse: '游戏处于自然生命周期末期的正常衰退',
    inputGuide: {
      required: '流失数据（各时间点流失率）、流失用户特征、近期运营变更',
      optional: '用户反馈/差评内容、竞品上线信息、服务器/BUG 数据',
      tips: '区分「主动流失」和「自然流失」是分析的第一步'
    },
    exampleFull: {
      input: '数据=7日留存从45%降至32%，时间=版本更新后两周，变更=新手引导重做+付费调整',
      outputPreview: '流失原因分析：\n1.【高概率】新手引导过长导致次日留存下降（数据支撑：新用户30分钟流失率+15%）...'
    },
    commonFailures: ['归因过于简单化', '忽略外部因素（竞品上线/假期结束）', '改善措施缺乏优先级'],
    optimizationTips: ['按流失时间节点分类分析（首日/3日/7日/30日）', '结合定量数据和定性反馈', '每次改善措施要有对应的验证指标'],
    versions: { lite: '流失原因 TOP5 + 快速改善建议', advanced: '完整流失分析报告 + 归因模型 + 分阶段改善计划 + 效果预测' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p055', 'p065'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p057': {
    taskCategory: '做分析',
    taskDesc: '构建付费用户行为分析框架，优化商业化策略',
    whenToUse: '商业化方案优化、付费率/ARPU 异常分析、LTV 建模',
    whenNotToUse: '游戏尚未上线或没有付费数据的阶段',
    inputGuide: {
      required: '付费数据（ARPU/付费率/首充率）、付费档位分布、LTV 数据',
      optional: '付费用户行为日志、竞品付费模型、A/B 测试数据',
      tips: '重点关注「首充转化」和「大R培养」两个关键链路'
    },
    exampleFull: {
      input: '数据=付费率5.2%，ARPU=$12，首充率3.8%，大R占比0.3%贡献45%收入',
      outputPreview: '分析结论：\n1. 首充转化瓶颈在首充礼包吸引力不足（行业均值6%，当前3.8%）...'
    },
    commonFailures: ['只看整体数据忽略分层差异', '忽视付费深度（复购率和升档率）', '照搬竞品不考虑自身用户特征'],
    optimizationTips: ['将付费用户分为微氪/中氪/大R三层分析', '追踪首充后 7 日的二次付费率', '结合活动数据分析价格弹性'],
    versions: { lite: '核心付费指标分析 + 改善方向', advanced: '完整分析框架 + LTV 建模 + 分层策略 + A/B 测试方案' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p055', 'p059'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p058': {
    taskCategory: '产内容',
    taskDesc: '生成用户满意度调研问卷，覆盖核心体验维度',
    whenToUse: '大版本更新后收集反馈、季度满意度追踪、特定功能评估',
    whenNotToUse: '已有成熟的 NPS 体系且执行良好的项目',
    inputGuide: {
      required: '调研目的、游戏类型、目标受众范围',
      optional: '历史调研数据、关注的特定功能、调研发放渠道',
      tips: '问卷控制在 15 题以内，完成时间 5 分钟以内'
    },
    exampleFull: {
      input: '目的=2.0版本满意度调研，类型=MMORPG，范围=全服活跃用户',
      outputPreview: 'Q1 [NPS] 你有多大可能向朋友推荐这款游戏？（0-10分）\nQ2 [单选] 你对2.0版本整体满意度...'
    },
    commonFailures: ['问题太多导致完成率低', '引导性提问影响数据客观性', '缺少开放式问题'],
    optimizationTips: ['NPS 题放在第一位', '混合封闭式和开放式问题', '设计激励机制提高完成率（游戏内奖励）'],
    versions: { lite: '10 题快速满意度问卷', advanced: '完整调研方案 + 问卷 + 数据分析框架 + 报告模板' },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p055', 'p061'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p059': {
    taskCategory: '写方案',
    taskDesc: '根据用户分层设计差异化运营策略，提升各层用户价值',
    whenToUse: '运营体系搭建、用户精细化运营、LTV 提升项目',
    whenNotToUse: '游戏用户量太少不足以支撑分层运营的阶段',
    inputGuide: {
      required: '用户分层标准、各层用户量级、运营目标',
      optional: '现有运营策略、自动化工具、推送渠道',
      tips: '分层不宜超过 5 层，每层需要明确的运营目标和触达方式'
    },
    exampleFull: {
      input: '分层=按活跃度+付费分为核心/活跃/沉默/流失/鲸鱼五层，用户量=50万DAU',
      outputPreview: '鲸鱼用户（500人）：专属客服+内测邀请+线下见面会\n核心用户（2万）：社区特权+每周专属活动...'
    },
    commonFailures: ['分层过细执行成本过高', '各层策略同质化', '忽略分层之间的流转运营'],
    optimizationTips: ['先做 RFM 分析确定分层标准', '每层设计「向上流转」的激励机制', '自动化执行降低运营人力成本'],
    versions: { lite: '分层模型 + 各层核心策略', advanced: '完整分层运营方案 + 流转机制 + 自动化触发规则 + ROI 预估' },
    relatedTools: ['claude', 'notion-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p055', 'p057'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p060': {
    taskCategory: '做分析',
    taskDesc: '生成游戏行业趋势分析报告，把握市场动向和机会',
    whenToUse: '年度/季度战略规划、立项调研、投资人沟通准备',
    whenNotToUse: '只需要简单市场数据而非深度趋势分析',
    inputGuide: {
      required: '关注的游戏品类或市场、分析时间范围、报告用途',
      optional: '关注的特定趋势方向、数据来源偏好',
      tips: '用 Perplexity 联网搜索获取最新数据和报告'
    },
    exampleFull: {
      input: '品类=移动RPG，市场=全球，时间=2025年，用途=年度战略规划',
      outputPreview: '趋势1：AI生成内容降低开发成本，中小团队机会增多\n趋势2：跨平台（手游+PC+主机）成为标配...'
    },
    commonFailures: ['趋势过于宏观缺乏落地指导', '数据来源不可靠', '忽视技术趋势对行业的影响'],
    optimizationTips: ['用 Perplexity 搜集最新行业报告数据', '区分「短期热点」和「长期趋势」', '每个趋势附带对自身业务的影响评估'],
    versions: { lite: '5 大趋势概述', advanced: '完整趋势报告 + 数据图表 + 影响评估 + 战略建议' },
    relatedTools: ['perplexity', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p062', 'p064'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p061': {
    taskCategory: '写方案',
    taskDesc: '设计目标市场的用户调研方案，系统性收集用户洞察',
    whenToUse: '进入新市场前的用户调研、产品改版前的需求验证',
    whenNotToUse: '已有充分的市场数据且不需要一手调研的情况',
    inputGuide: {
      required: '调研目标、目标市场/用户群、调研预算和周期',
      optional: '已有用户数据、调研假设、竞品调研参考',
      tips: '结合定量（问卷）和定性（访谈）方法效果最佳'
    },
    exampleFull: {
      input: '目标=了解日本市场RPG玩家偏好，用户群=18-35岁日本玩家，周期=1个月',
      outputPreview: '阶段1（W1-W2）：桌面调研\n- 日本RPG市场规模和增长率\n- 头部产品分析...\n阶段2（W2-W3）：定量调研...'
    },
    commonFailures: ['样本量不足结论不可靠', '问卷翻译不当影响数据质量', '调研结论与实际决策脱节'],
    optimizationTips: ['先做桌面调研再设计问卷', '确保样本的代表性（年龄/地区/付费水平分布）', '调研报告附带明确的决策建议'],
    versions: { lite: '调研大纲 + 核心问题列表', advanced: '完整调研方案 + 问卷 + 访谈提纲 + 分析框架 + 报告模板' },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: [],
    relatedPrompts: ['p055', 'p063'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p062': {
    taskCategory: '做分析',
    taskDesc: '评估特定游戏品类的市场规模、增长潜力和竞争格局',
    whenToUse: '立项决策、投资评估、品类选择分析',
    whenNotToUse: '已确定品类方向只需要执行方案的阶段',
    inputGuide: {
      required: '目标品类、目标市场区域、评估维度',
      optional: '自身能力评估、预算限制、时间窗口',
      tips: '用 Perplexity 搜索 Newzoo/SensorTower 等数据来源'
    },
    exampleFull: {
      input: '品类=开放世界RPG，市场=东南亚，维度=规模+增速+头部产品+机会空间',
      outputPreview: '市场规模：2024年东南亚RPG市场约$18亿，同比增长12%\n头部产品：原神（35%份额）...'
    },
    commonFailures: ['数据来源不明确', '只看规模忽略增速和竞争', '未考虑进入壁垒'],
    optimizationTips: ['交叉验证至少 2-3 个数据来源', '评估市场集中度（CR5）', '识别「大品类中的蓝海细分」机会'],
    versions: { lite: '品类规模和增速概述', advanced: '完整市场评估报告 + 竞争格局 + 机会空间 + 进入策略建议' },
    relatedTools: ['perplexity', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p060', 'p064'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p063': {
    taskCategory: '做分析',
    taskDesc: '深度评估目标区域市场的本地化需求、文化禁忌和运营要点',
    whenToUse: '游戏出海决策、本地化方案制定、区域市场进入策略',
    whenNotToUse: '已有当地运营团队且经验丰富的市场',
    inputGuide: {
      required: '目标区域、游戏类型、本地化预算和周期',
      optional: '现有翻译资源、当地合作方、竞品本地化参考',
      tips: '用 Perplexity 搜索目标市场的游戏法规和文化禁忌'
    },
    exampleFull: {
      input: '区域=中东（沙特+阿联酋），类型=SLG，预算=50万，周期=3个月',
      outputPreview: '文化评估：\n- 必须处理：宗教符号/性别展示/暴力分级\n- 推荐调整：阿拉伯语右向排版...'
    },
    commonFailures: ['忽视宗教和文化禁忌', '本地化停留在翻译层面', '未调研当地支付习惯'],
    optimizationTips: ['先做文化敏感度审查再开始翻译', '找当地玩家做 beta 测试', '支付方式适配是出海收入的关键'],
    versions: { lite: '核心文化注意事项 + 本地化清单', advanced: '完整本地化评估报告 + 实施计划 + 供应商推荐 + 风险清单' },
    relatedTools: ['perplexity', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p034', 'p062'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p064': {
    taskCategory: '做分析',
    taskDesc: '生成竞争格局图谱，可视化分析市场主要玩家的定位和关系',
    whenToUse: '立项调研、战略规划、投资人沟通、竞品体系梳理',
    whenNotToUse: '只需要单一竞品对比而非全局视角的分析',
    inputGuide: {
      required: '目标品类/市场、需要分析的维度（规模/品质/题材等）',
      optional: '已知竞品列表、自身产品定位、数据来源',
      tips: '用二维矩阵图最直观（如：品质 vs 商业化强度）'
    },
    exampleFull: {
      input: '品类=二次元RPG，市场=中国，维度=画面品质 vs DAU规模',
      outputPreview: '第一象限（高品质+高DAU）：原神、崩铁\n第二象限（高品质+低DAU）：鸣潮...'
    },
    commonFailures: ['维度选择不合理', '遗漏重要竞品', '缺少动态变化视角（只看当前静态）'],
    optimizationTips: ['选择与决策最相关的 2 个维度', '标注各竞品的趋势方向（上升/下降）', '用 Perplexity 搜集最新排名数据'],
    versions: { lite: '竞品列表 + 简要定位分析', advanced: '完整竞争格局图谱 + 多维矩阵 + 趋势标注 + 机会空间识别' },
    relatedTools: ['perplexity', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p040', 'p062'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p065': {
    taskCategory: '做分析',
    taskDesc: '诊断游戏留存率异常变化的原因，提供数据驱动的改善方案',
    whenToUse: '留存指标低于行业基准、留存突然下降、新手漏斗优化',
    whenNotToUse: '留存数据正常且无优化需求的稳定期',
    inputGuide: {
      required: '留存数据（次日/3日/7日/30日）、异常时间段、近期变更记录',
      optional: '新手漏斗数据、用户设备分布、竞品留存对标',
      tips: '关注「哪个留存节点」下降最多，定位最优先的优化环节'
    },
    exampleFull: {
      input: '次留=38%（行业42%），3留=22%（行业28%），异常=上周开始，变更=新手引导改版',
      outputPreview: '诊断结论：\n核心问题：新手引导改版导致次留下降4pp\n证据链：新手引导完成率从85%降至62%...'
    },
    commonFailures: ['混淆相关性和因果性', '只看平均值不看分群差异', '改善措施没有优先级'],
    optimizationTips: ['按「新/老用户」和「付费/非付费」交叉分析', '设置留存预警阈值自动监控', '每次改善控制变量单独验证'],
    versions: { lite: '留存异常诊断 + TOP3 原因', advanced: '完整诊断报告 + 归因分析 + 改善方案 + 验证计划 + 预期效果' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p056', 'p055'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  }
};

// ========== 执行升级 ==========
console.log('===== Batch-7 内容升级 =====\n');

const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
console.log('--- Prompt 升级 ---');
let count = 0;
for (const [id, ext] of Object.entries(promptExtensions)) {
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) { console.log(`  ✗ ${id} — 未找到`); continue; }
  Object.assign(prompt, ext);
  console.log(`  ✓ ${id} (${prompt.name}) — 添加 13 个扩展字段`);
  count++;
}
fs.writeFileSync(PROMPTS_PATH, JSON.stringify(prompts, null, 2), 'utf8');
console.log(`\nPrompt 更新完成：${count} 个 Prompt 已升级`);

// 验证
console.log('\n--- 验证 ---');
const verified = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
const upgraded = verified.filter(p => !!p.taskCategory).length;
console.log(`Prompt：${upgraded}/${verified.length} 已升级`);
console.log(`\n✅ Batch-7 数据更新完成`);
