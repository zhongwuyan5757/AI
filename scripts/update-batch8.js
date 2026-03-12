/**
 * Batch-8 内容扩展
 * 20 Prompt (p066-p085)
 * 覆盖场景: 数据分析、内容创作、运营文案、数值校验、SOP生成
 */
const fs = require('fs');
const path = require('path');

const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

const promptExtensions = {
  'p066': {
    taskCategory: '做分析',
    taskDesc: '深度分析游戏付费数据，发现商业化优化机会',
    whenToUse: '月度/季度付费数据复盘、ARPU 下降排查、商业化方案迭代',
    whenNotToUse: '数据采集尚不完善或样本量太小的早期阶段',
    inputGuide: {
      required: '付费核心数据（收入/ARPU/付费率/LTV）、分析周期、分析目标',
      optional: '付费档位分布、首充转化漏斗、活动付费数据',
      tips: '按付费层级（免费/微氪/中氪/大R）分群分析效果最好'
    },
    exampleFull: {
      input: '数据=月流水500万，付费率4.8%，ARPU=$15，首充转化3.2%，周期=上月',
      outputPreview: '核心发现：\n1. 首充转化率（3.2%）低于品类均值（5.5%），缺口=2.3pp\n2. 大R（ARPU>$500）仅占0.2%但贡献38%收入...'
    },
    commonFailures: ['只看总量不做分群分析', '付费行为归因过于简单', '改善建议缺乏优先级排序'],
    optimizationTips: ['用漏斗模型定位付费转化瓶颈', '对比活动期 vs 日常期的付费行为差异', '每条建议标注预期收益和实施难度'],
    versions: { lite: '核心付费指标概览 + TOP3 发现', advanced: '完整付费分析报告 + 分群洞察 + 漏斗分析 + 改善路线图' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p057', 'p065'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p067': {
    taskCategory: '写方案',
    taskDesc: '设计严谨的 A/B 测试方案，确保实验结论可靠',
    whenToUse: '功能改版验证、付费策略优化、UI/UX 改进',
    whenNotToUse: '流量不足以支撑统计显著性的小游戏',
    inputGuide: {
      required: '测试假设、测试指标、预计样本量、测试周期',
      optional: '历史基线数据、技术限制、分流方式',
      tips: '每次只测一个变量，确保因果关系清晰'
    },
    exampleFull: {
      input: '假设=新首充礼包可提升首充率2pp，指标=首充转化率，样本=日新增3000人',
      outputPreview: '实验设计：\n- 对照组A：当前首充礼包（6元=100钻+10体力）\n- 实验组B：新首充礼包（6元=120钻+SSR碎片×5）...'
    },
    commonFailures: ['样本量不足导致结论不可靠', '测试周期太短未覆盖完整用户周期', '同时改多个变量无法归因'],
    optimizationTips: ['用统计功效计算器确定最小样本量', '测试周期至少覆盖一个完整的用户留存周期', '提前定义「成功标准」避免事后改目标'],
    versions: { lite: '测试假设 + 分组方案 + 成功标准', advanced: '完整实验方案 + 样本计算 + 数据采集方案 + 分析模板' },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p065', 'p068'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p068': {
    taskCategory: '做分析',
    taskDesc: '设计 LTV（用户生命周期价值）预测模型框架，支撑投放决策',
    whenToUse: '广告投放 ROI 评估、用户获取预算规划、渠道效率对比',
    whenNotToUse: '游戏运营不满3个月，历史数据不足以建模',
    inputGuide: {
      required: '留存曲线数据、付费数据、用户获取成本（CPI/CPA）',
      optional: '分渠道数据、分地区数据、历史 LTV 预测误差',
      tips: 'LTV 预测的关键是留存曲线拟合和付费率演变'
    },
    exampleFull: {
      input: '留存=D1:40%/D7:20%/D30:10%，ARPDAU=$0.15，CPI=$2.5',
      outputPreview: 'LTV模型：\n- D30 LTV = $1.8（留存曲线拟合+付费率×ARPPU）\n- D180 LTV（预测）= $4.2\n- ROI拐点 = D45...'
    },
    commonFailures: ['留存曲线外推误差大', '未区分自然量和广告量的 LTV 差异', '忽视宏观因素（季节性/竞品影响）'],
    optimizationTips: ['用对数或幂函数拟合留存曲线', '分渠道建立独立 LTV 模型', '每月用实际数据回测模型准确率'],
    versions: { lite: 'LTV 快速估算 + ROI 拐点', advanced: '完整 LTV 建模框架 + 分渠道预测 + 置信区间 + 回测方案' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p057', 'p069'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p069': {
    taskCategory: '做分析',
    taskDesc: '分析各获客渠道的 ROI 表现，优化投放预算分配',
    whenToUse: '月度投放复盘、预算重新分配、新渠道评估',
    whenNotToUse: '单一渠道投放不涉及渠道选择的情况',
    inputGuide: {
      required: '各渠道数据（花费/新增/CPI/留存/付费）、分析周期',
      optional: '素材类型、投放策略、行业 benchmark',
      tips: '渠道 ROI 对比要用统一的 LTV 周期（如 D30 或 D90）'
    },
    exampleFull: {
      input: '渠道=Facebook($5万/CPI$3)/Google($3万/CPI$2.5)/TikTok($2万/CPI$1.8)，周期=上月',
      outputPreview: 'ROI 排名：\n1. Google：D30 ROI=85%，预计D90回本\n2. TikTok：D30 ROI=70%，CPI最低但留存偏低...'
    },
    commonFailures: ['只看 CPI 不看后端质量', '归因窗口不统一', '忽视自然量被渠道量影响'],
    optimizationTips: ['统一归因窗口（建议7天点击+1天展示）', '用增量测试验证渠道真实贡献', '预算重新分配后设 2 周观察期'],
    versions: { lite: '渠道 ROI 排名 + 预算建议', advanced: '完整渠道分析报告 + 增量分析 + 预算优化方案 + 预测模型' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p068', 'p066'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p070': {
    taskCategory: '产内容',
    taskDesc: '为游戏构建完整的世界观设定，包括历史、地理、势力、文明等',
    whenToUse: '新游立项世界观搭建、DLC/新地图世界观扩展、IP化建设',
    whenNotToUse: '轻度休闲游戏不需要复杂世界观的场景',
    inputGuide: {
      required: '游戏类型、题材方向、世界观基调、核心冲突',
      optional: '已有设定素材、参考作品、目标受众偏好',
      tips: '世界观的核心是「冲突」，没有冲突就没有故事'
    },
    exampleFull: {
      input: '类型=开放世界RPG，题材=赛博朋克+东方幻想，基调=黑暗浪漫，冲突=科技vs灵力',
      outputPreview: '世界名称：「灵械纪元」\n核心设定：在灵力与科技并存的世界，六大城邦围绕「源核」展开争夺...'
    },
    commonFailures: ['设定过于复杂玩家难以理解', '世界观与玩法脱节', '缺少「可延展」的设计空间'],
    optimizationTips: ['用「一句话」能概括世界观核心冲突', '预留未来扩展的「空白区域」', '先定宏观框架再填充细节'],
    versions: { lite: '世界观概要（1-2页）', advanced: '完整世界观圣经 + 年表 + 地图概念 + 势力关系图' },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p071'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p071': {
    taskCategory: '产内容',
    taskDesc: '生成游戏角色的完整设定文档，包括背景、性格、技能等',
    whenToUse: '新角色开发、角色池扩展、IP衍生角色设计',
    whenNotToUse: '角色设定已由专业编剧团队完成只需微调',
    inputGuide: {
      required: '角色定位（职业/稀有度）、所属世界观、核心特点',
      optional: '角色关系网、视觉参考、配音方向、角色弧线',
      tips: '好角色需要有「矛盾」和「成长空间」'
    },
    exampleFull: {
      input: '定位=SSR火系法师，世界观=灵械纪元，特点=冷面话少但内心温暖',
      outputPreview: '角色名：焰心·洛绯\n基础信息：女/22岁/灵械城出身\n性格标签：冷面热心/完美主义者/猫控...'
    },
    commonFailures: ['角色扁平化缺少层次感', '设定与世界观割裂', '性格特征与战斗风格不匹配'],
    optimizationTips: ['用「愿望/恐惧/秘密」三要素塑造角色深度', '每个角色至少有一个「反差萌」特质', '设计角色关系网增加叙事张力'],
    versions: { lite: '基础角色卡（外貌/性格/技能）', advanced: '完整角色圣经 + 台词集 + 关系网 + 角色弧线 + 运营建议' },
    relatedTools: ['claude', 'midjourney'],
    relatedTutorials: [],
    relatedPrompts: ['p070'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p072': {
    taskCategory: '产内容',
    taskDesc: '批量生成游戏攻略文章，覆盖新手到进阶的完整内容矩阵',
    whenToUse: '游戏上线初期内容铺设、大版本更新后攻略补充、SEO内容建设',
    whenNotToUse: '已有活跃的UGC攻略社区不需要官方产出',
    inputGuide: {
      required: '游戏名称、攻略类型（新手/角色/关卡/系统）、目标数量',
      optional: '已有攻略列表、SEO关键词、内容风格偏好',
      tips: '新手攻略>角色攻略>系统攻略，按优先级排序产出'
    },
    exampleFull: {
      input: '游戏=幻想大陆，类型=角色攻略，数量=10篇，风格=专业但易懂',
      outputPreview: '攻略1：「焰心·洛绯」全面养成攻略\n  - 推荐装备/圣遗物搭配\n  - 队伍搭配建议\n  - 技能优先级...'
    },
    commonFailures: ['攻略内容与游戏实际版本不同步', '过于专业新手看不懂', '批量感太强缺乏个性'],
    optimizationTips: ['建立攻略模板确保质量一致', '每篇攻略配「快速版」和「详细版」', '定期根据版本更新修订攻略'],
    versions: { lite: '攻略大纲列表 + 3 篇示范', advanced: '完整内容矩阵 + 批量攻略 + SEO优化 + 更新维护计划' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p073', 'p074'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p073': {
    taskCategory: '产内容',
    taskDesc: '为游戏社区策划互动活动并生成配套文案',
    whenToUse: '社区日常活跃度维护、节日社区活动、新功能推广',
    whenNotToUse: '社区人数太少（<500活跃用户）不足以支撑活动',
    inputGuide: {
      required: '活动目标、社区平台、预算/奖品、活动周期',
      optional: '过往活动数据、社区用户特征、KOL资源',
      tips: '降低参与门槛、增加趣味性、奖励即时反馈'
    },
    exampleFull: {
      input: '目标=提升社区活跃度30%，平台=Discord+TapTap，预算=1000元游戏内道具',
      outputPreview: '活动方案：「每周挑战赛」\n- 每周发布一个趣味挑战（截图/攻略/二创）\n- 投票选出TOP3获奖...'
    },
    commonFailures: ['活动规则太复杂', '奖励不够吸引力', '活动结束后社区恢复冷淡'],
    optimizationTips: ['设计系列活动而非一次性活动', '利用社区UGC降低内容生产成本', '活动数据复盘指导下次优化'],
    versions: { lite: '活动方案 + 文案模板', advanced: '完整活动策划书 + 执行时间表 + 文案库 + 数据追踪方案' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p049', 'p077'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p074': {
    taskCategory: '产内容',
    taskDesc: '撰写游戏行业新闻稿或媒体通稿，传递品牌/产品信息',
    whenToUse: '版本更新发布、里程碑达成、合作官宣、重大活动',
    whenNotToUse: '日常社媒运营内容不需要正式新闻稿格式',
    inputGuide: {
      required: '新闻事件、核心信息点、目标媒体类型、发布时间',
      optional: '引用数据、高管/制作人语录、配图说明',
      tips: '标题和第一段决定80%的传播效果'
    },
    exampleFull: {
      input: '事件=幻想大陆全球下载突破1000万，核心=感恩玩家+预告新内容，媒体=游戏媒体+综合媒体',
      outputPreview: '标题：《幻想大陆》全球下载破千万，制作人致信感恩并公布年度路线图\n[城市，日期] — ...'
    },
    commonFailures: ['标题平淡无吸引力', '信息点过多焦点不清', '语气过于官僚缺少温度'],
    optimizationTips: ['一稿多版：核心媒体长版+社交媒体短版', '包含可直接引用的高管语录', '附带高清图片和视频素材'],
    versions: { lite: '短版新闻稿（500字内）', advanced: '完整新闻通稿 + 媒体Q&A + 图片素材说明 + 分发渠道列表' },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p072', 'p078'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p075': {
    taskCategory: '写文案',
    taskDesc: '生成游戏内推送通知和邮件系统的文案，提升玩家回流和活跃',
    whenToUse: '推送/邮件文案A/B测试、新活动推送、召回流失玩家',
    whenNotToUse: '游戏没有推送/邮件系统的情况',
    inputGuide: {
      required: '推送/邮件目的、目标用户群、触发时机',
      optional: '历史推送数据（打开率/点击率）、推送限制、品牌调性',
      tips: '推送标题<15字，邮件主题<30字，开头1秒决定是否被打开'
    },
    exampleFull: {
      input: '目的=召回7日未登录用户，用户=全服沉默用户，时机=新版本上线日',
      outputPreview: '推送标题：「主人，新大陆已开放，你的同伴在等你！」\n推送正文：2.0版本重磅更新，专属回归礼包等你领取→'
    },
    commonFailures: ['推送频率太高被用户关闭', '文案与落地体验不一致', '未区分不同用户群的文案'],
    optimizationTips: ['每周推送不超过 3 次', '用 A/B 测试持续优化标题', '紧迫感（限时）+利益点（奖励）= 高打开率'],
    versions: { lite: '5 条推送标题+正文', advanced: '完整推送策略 + 分群文案 + A/B 测试方案 + 频率规划' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p076', 'p079'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p076': {
    taskCategory: '写文案',
    taskDesc: '生成游戏内弹窗、公告和系统通知的文案',
    whenToUse: '新功能上线公告、活动弹窗、系统维护通知、版本更新说明',
    whenNotToUse: '纯UI界面文本（按钮/菜单）等标准化文案',
    inputGuide: {
      required: '公告类型、核心内容、目标行为（关闭/点击/参与）',
      optional: '弹窗样式限制、字数限制、配图需求',
      tips: '弹窗文案要在 3 秒内传达核心信息，CTA 按钮文案至关重要'
    },
    exampleFull: {
      input: '类型=新活动弹窗，内容=限时抽卡活动上线，目标=引导玩家进入活动页面',
      outputPreview: '标题：🔥 限定召唤·焰心降临\n正文：SSR火系法师「焰心·洛绯」限时UP！\n前10抽必出SR以上...\nCTA：「立即召唤」'
    },
    commonFailures: ['文案太长玩家直接关闭', 'CTA 不明确', '弹窗出现频率太高引起反感'],
    optimizationTips: ['标题不超过10字', '正文不超过30字', 'CTA 用动词开头（立即/前往/领取）'],
    versions: { lite: '单条弹窗/公告文案', advanced: '完整公告体系 + 多类型模板 + A/B 测试 + 展示策略' },
    relatedTools: ['chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p075', 'p078'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p077': {
    taskCategory: '写文案',
    taskDesc: '生成社区/论坛中引导讨论的话题帖子，提升社区活跃度',
    whenToUse: '社区日常运营、新功能讨论引导、收集用户反馈',
    whenNotToUse: '社区已有大量自发讨论不需要引导',
    inputGuide: {
      required: '话题方向、目标平台、互动目标（讨论/投票/分享）',
      optional: '社区用户特征、当前热点、过往热帖参考',
      tips: '好的话题帖需要有「争议性」或「参与感」'
    },
    exampleFull: {
      input: '方向=新角色讨论，平台=TapTap论坛，目标=引发角色强度讨论',
      outputPreview: '标题：「焰心·洛绯到底值不值得抽？来投票！」\n正文：各位大佬，新角色上线了！看了下技能...'
    },
    commonFailures: ['话题过于官方缺乏讨论价值', '无法引发用户真实表达', '回复互动少帖子沉底'],
    optimizationTips: ['用「投票/排名/对比」机制降低回复门槛', '在帖子中@活跃用户带动氛围', '运营人员用小号参与讨论不要暴露身份'],
    versions: { lite: '5 条话题帖文案', advanced: '完整社区话题矩阵 + 发布排期 + 互动策略 + 效果追踪' },
    relatedTools: ['chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p073', 'p079'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p078': {
    taskCategory: '写文案',
    taskDesc: '撰写服务器维护、停机和紧急修复的公告文案',
    whenToUse: '定期维护公告、紧急停服、Bug修复通知、补偿公告',
    whenNotToUse: '无需对外通知的内部维护操作',
    inputGuide: {
      required: '维护类型（定期/紧急）、预计时长、影响范围、补偿内容',
      optional: '具体修复内容、维护后新增功能、历史公告参考',
      tips: '维护公告的核心是「什么时候开、有什么补偿」'
    },
    exampleFull: {
      input: '类型=紧急维护，时长=2小时，范围=全服，补偿=100钻石+5体力药',
      outputPreview: '【紧急维护公告】\n亲爱的冒险者：\n我们将于今日XX:XX-XX:XX进行紧急维护...\n维护补偿：100钻石+5体力药...'
    },
    commonFailures: ['维护时间不准确（延长了没更新）', '补偿方案被认为不够', '语气冷漠缺乏诚意'],
    optimizationTips: ['预留30分钟缓冲避免延时公告', '维护公告+完成公告成套准备', '紧急维护补偿适当高于常规维护'],
    versions: { lite: '维护公告模板', advanced: '完整维护通知体系 + 各类型模板 + 补偿标准 + 延时应对预案' },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p076', 'p085'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p079': {
    taskCategory: '写文案',
    taskDesc: '为节日和重要时间节点生成成套运营文案（推送+弹窗+社区+邮件）',
    whenToUse: '春节/情人节/周年庆等节日运营、赛季开启/结束等游戏节点',
    whenNotToUse: '非节日期间的日常运营',
    inputGuide: {
      required: '节日/节点名称、活动内容概要、文案渠道列表',
      optional: '品牌调性、历史节日运营数据、配图风格',
      tips: '所有渠道文案风格要统一但长度和格式需适配各平台'
    },
    exampleFull: {
      input: '节日=春节，活动=限定皮肤+红包雨+新春副本，渠道=推送/弹窗/微博/B站',
      outputPreview: '推送：「恭喜发财！新春限定皮肤免费领→」\n弹窗：「🧧新春大礼·红包雨降临！」...'
    },
    commonFailures: ['各渠道文案风格不统一', '节日氛围不够浓厚', '错过最佳发布时间'],
    optimizationTips: ['提前 2 周准备节日文案套装', '设计「预热→爆发→收尾」三阶段节奏', '每个渠道至少准备 2 个版本做 A/B'],
    versions: { lite: '核心渠道文案各 1 条', advanced: '全渠道文案套装 + 发布时间表 + A/B 版本 + 数据追踪' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p075', 'p076'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p080': {
    taskCategory: '做分析',
    taskDesc: '检查游戏经济系统的平衡性，识别通胀/通缩风险和漏洞',
    whenToUse: '经济系统设计评审、版本更新后经济指标异常、长期运营健康度检查',
    whenNotToUse: '游戏没有虚拟经济系统（如纯竞技游戏）',
    inputGuide: {
      required: '经济系统结构（货币/产出/消耗）、当前经济数据',
      optional: '经济模型公式、历史通胀数据、竞品经济系统参考',
      tips: '重点关注「产出源」和「消耗坑」的平衡关系'
    },
    exampleFull: {
      input: '货币=金币+钻石，日产出=金币10000/钻石50，主要消耗=强化/抽卡/商店',
      outputPreview: '平衡性诊断：\n⚠️ 金币系统：日产出>日消耗，预计30天后出现通胀\n✅ 钻石系统：产出与消耗基本平衡...'
    },
    commonFailures: ['只看静态数据忽略动态变化', '忽视不同玩家阶段的经济差异', '添加新消耗坑时未评估连带影响'],
    optimizationTips: ['建立经济仪表盘监控核心指标', '模拟不同玩家档位的经济状况', '每次版本更新必须做经济影响评估'],
    versions: { lite: '经济健康度快速检查', advanced: '完整经济系统审计 + 模拟预测 + 调优建议 + 监控方案' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p081', 'p083'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p081': {
    taskCategory: '做分析',
    taskDesc: '模拟和分析游戏战斗数值的平衡性，发现数值设计问题',
    whenToUse: '新角色/技能数值调校、战斗平衡版本更新前、玩家投诉数值问题',
    whenNotToUse: '非数值驱动的游戏（纯操作/纯解谜类）',
    inputGuide: {
      required: '战斗公式、角色/装备数值表、分析目标',
      optional: '战斗日志数据、玩家反馈、竞品数值参考',
      tips: '用 DPS 和 TTK（Time to Kill）作为核心平衡指标'
    },
    exampleFull: {
      input: '公式=伤害=(攻击-防御)×技能倍率×暴击，角色=5个SSR的满级数值表',
      outputPreview: '数值分析：\n- DPS排名：角色A>角色C>角色B>角色E>角色D\n- 极端情况：角色A满配暴击后DPS是角色D的3.2倍（差距过大）...'
    },
    commonFailures: ['只算理论值忽略实战变量', '未考虑角色组合的协同效应', '平衡调整幅度过大导致翻车'],
    optimizationTips: ['用蒙特卡洛模拟考虑随机性影响', '关注「最强 vs 最弱」的差距倍率', '调整幅度每次不超过 15%'],
    versions: { lite: 'DPS 对比表 + 关键问题', advanced: '完整战斗模拟报告 + 平衡性矩阵 + 调优方案 + 影响预估' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p080', 'p084'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p082': {
    taskCategory: '做分析',
    taskDesc: '验证抽卡和概率系统的公平性，确保符合法规和玩家预期',
    whenToUse: '抽卡系统设计、概率公示审查、玩家质疑概率时的验证',
    whenNotToUse: '游戏没有随机概率系统的情况',
    inputGuide: {
      required: '概率设计（各档位概率）、保底机制、抽卡池结构',
      optional: '实际抽卡数据、法规要求（中国/日本不同）、玩家反馈',
      tips: '中国要求公示概率，日本有 gacha 法规限制'
    },
    exampleFull: {
      input: 'SSR概率=1.6%，保底=90抽硬保底+50%概率UP角色，池子=角色池+武器池分离',
      outputPreview: '公平性分析：\n✅ SSR基础概率1.6%符合行业标准（1-3%）\n⚠️ 50%UP概率意味着歪的概率较高...'
    },
    commonFailures: ['概率标注与实际实现不一致', '保底机制设计不透明', '忽视不同地区的法规差异'],
    optimizationTips: ['用大样本模拟验证实际概率分布', '保底机制需明确告知玩家', '定期审计服务器端概率实现'],
    versions: { lite: '概率合规性快速检查', advanced: '完整概率审计 + 模拟分布 + 法规合规 + 玩家体验分析' },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p080', 'p083'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p083': {
    taskCategory: '写方案',
    taskDesc: '设计游戏内购商品的定价策略，优化付费转化和收入',
    whenToUse: '商业化方案设计、定价调优、新商品上线前的价格测试',
    whenNotToUse: '免费游戏不涉及付费或买断制游戏',
    inputGuide: {
      required: '商品类型、目标用户群、竞品定价参考、目标市场',
      optional: '历史付费数据、价格敏感度测试数据、促销策略',
      tips: '首充和月卡是最重要的付费入口，需要最精细的定价'
    },
    exampleFull: {
      input: '商品=首充礼包+月卡+通行证，用户=全球，竞品=原神/崩铁定价参考',
      outputPreview: '定价建议：\n首充礼包：$0.99（心理门槛最低，转化率最高）\n月卡：$4.99（日均0.17美元，对标竞品）...'
    },
    commonFailures: ['定价不考虑不同市场购买力', '价格锚点设计不当', '促销折扣伤害正价销售'],
    optimizationTips: ['用「价格锚点效应」提升高价商品转化', '不同市场做差异化定价', '促销频率控制（建议月度不超过2次）'],
    versions: { lite: '核心商品定价建议', advanced: '完整定价策略 + 价格弹性分析 + 促销日历 + A/B测试方案' },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: [],
    relatedPrompts: ['p080', 'p082'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p084': {
    taskCategory: '做分析',
    taskDesc: '设计和分析游戏中的数值增长曲线（等级/属性/难度等）',
    whenToUse: '等级系统设计、难度曲线调优、长期运营的数值膨胀控制',
    whenNotToUse: '非数值驱动的游戏类型',
    inputGuide: {
      required: '增长类型（经验/属性/难度）、目标曲线形状、设计目标',
      optional: '当前曲线数据、玩家进度分布、竞品曲线参考',
      tips: '好的增长曲线应该「前快后慢」，给新手成就感给老手挑战'
    },
    exampleFull: {
      input: '类型=等级经验曲线，等级上限=60，设计目标=前20级1周内达到',
      outputPreview: '推荐曲线模型：改良指数曲线\nLv1→Lv10：累计经验5000（日均700可达）\nLv10→Lv20：累计经验25000...'
    },
    commonFailures: ['曲线太陡导致中期玩家流失', '数值膨胀失控', '未考虑付费加速对曲线的影响'],
    optimizationTips: ['用对数/S型/分段线性等曲线模型对比', '设置「体验节点」（如每10级解锁新内容）', '每个版本审查数值膨胀率'],
    versions: { lite: '增长曲线公式 + 关键节点数据', advanced: '完整曲线设计 + 多模型对比 + 模拟验证 + 长期可持续性分析' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p080', 'p081'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p085': {
    taskCategory: '提效率',
    taskDesc: '生成版本发布的标准操作流程（SOP），确保发布质量和效率',
    whenToUse: '建立发布流程、优化现有流程、新团队成员培训',
    whenNotToUse: '已有成熟且运行良好的发布SOP',
    inputGuide: {
      required: '发布类型（大版本/热更新/紧急修复）、团队角色、技术栈',
      optional: '当前发布流程、历史故障记录、审批流程',
      tips: '好的 SOP 要有明确的「检查点」和「回滚方案」'
    },
    exampleFull: {
      input: '类型=大版本发布，角色=策划/开发/QA/运维/运营，技术栈=Unity+自研服务器',
      outputPreview: '阶段1: 预发布（D-7）\n  □ 版本分支冻结（开发负责人）\n  □ 全量回归测试（QA 负责人）...'
    },
    commonFailures: ['流程过于冗长没人执行', '缺少回滚方案', '责任人不明确'],
    optimizationTips: ['用 checklist 格式方便逐项确认', '区分大版本/热更新/紧急修复三套 SOP', '每次发布后做 post-mortem 优化流程'],
    versions: { lite: '发布检查清单', advanced: '完整 SOP + 角色职责矩阵 + 回滚方案 + 沟通模板 + post-mortem 模板' },
    relatedTools: ['claude', 'notion-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p078', 'p044'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  }
};

// ========== 执行升级 ==========
console.log('===== Batch-8 内容升级 =====\n');

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
console.log(`\n✅ Batch-8 数据更新完成`);
