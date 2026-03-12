/**
 * Batch-12 内容扩展
 * 20 Prompt (p146-p165)
 * 覆盖场景: 视频脚本、品牌营销、用户分析、市场调研、数据分析、数值校验、内容创作、运营文案、SOP生成
 */
const fs = require('fs');
const path = require('path');
const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

const promptExtensions = {
  'p146': {
    taskCategory: '产内容', taskDesc: '为游戏原声音乐(OST)宣传 MV 编写脚本', whenToUse: 'OST 发布宣传、音乐联动推广、品牌内容建设', whenNotToUse: '游戏没有原创音乐或不做音乐宣传',
    inputGuide: { required: '音乐信息（曲名/时长/风格）、MV 风格、核心主题', optional: '歌词内容、可用画面素材、发布平台', tips: 'MV 画面要与音乐情绪同步，节奏点对应画面转场' },
    exampleFull: { input: '曲名=「启程之歌」，时长=3:30，风格=史诗管弦+人声，主题=冒险的开始', outputPreview: '0:00-0:30 前奏：大陆远景航拍+日出\n0:30-1:00 主歌A：主角在村庄的日常...' },
    commonFailures: ['画面与音乐节奏脱节', '叙事过于复杂干扰音乐体验', '缺少高潮画面'], optimizationTips: ['先分析音乐结构（前奏/主歌/副歌/间奏）再匹配画面', '副歌段落用最精美的画面', '可以混合游戏实机+CG+概念画'],
    versions: { lite: 'MV 分段大纲', advanced: '完整 MV 脚本 + 画面标注 + 特效说明 + 制作指南' },
    relatedTools: ['sora', 'runway'], relatedTutorials: [], relatedPrompts: ['p045', 'p114'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p147': {
    taskCategory: '产内容', taskDesc: '为游戏新手教程或功能引导制作视频脚本', whenToUse: '新手引导视频制作、复杂功能教学、社区教学内容', whenNotToUse: '游戏内引导已足够清晰不需要额外视频',
    inputGuide: { required: '教程主题、目标用户水平、视频时长、教学目标', optional: '游戏截图/录屏素材、常见问题列表', tips: '教程视频最佳时长 3-5 分钟，每个视频只教一个主题' },
    exampleFull: { input: '主题=装备强化系统教程，水平=新手，时长=4分钟，目标=理解强化流程和最优策略', outputPreview: '0:00 开场：「今天教你用最少资源强化到最强装备」\n0:15 基础操作：强化界面介绍...' },
    commonFailures: ['信息量过大观众跟不上', '操作步骤不够清晰', '缺少实际演示'], optimizationTips: ['用「先说结论→再教步骤→最后总结」的结构', '关键操作加放大镜/箭头标注', '每个步骤配文字字幕'],
    versions: { lite: '教程脚本大纲', advanced: '完整脚本 + 录屏指南 + 字幕文本 + 配音稿' },
    relatedTools: ['capcut-ai', 'descript'], relatedTutorials: [], relatedPrompts: ['p072', 'p106'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p148': {
    taskCategory: '写方案', taskDesc: '规划游戏IP衍生品开发方案', whenToUse: 'IP 商业化拓展、周边商品开发、品牌授权合作', whenNotToUse: '游戏 IP 影响力不足以支撑衍生品市场',
    inputGuide: { required: 'IP 资产盘点、目标品类、预算范围、时间规划', optional: '粉丝需求调研、供应商资源、销售渠道', tips: '先做高需求低风险品类（手办/文具），再拓展高投入品类' },
    exampleFull: { input: 'IP=幻想大陆，品类=手办+服饰+文具，预算=50万，周期=6个月', outputPreview: '衍生品矩阵：\n第一梯队（优先）：Q版手办（5款核心角色）+亚克力立牌\n第二梯队：联名T恤+帆布包...' },
    commonFailures: ['SKU过多库存压力大', '品质不达标损害IP形象', '定价不合理'], optimizationTips: ['先用预售测试市场需求', '优先做粉丝社区呼声最高的角色', '线上线下结合的销售渠道'],
    versions: { lite: '衍生品品类建议 + 优先级', advanced: '完整开发方案 + 供应链 + 销售策略 + 财务预测' },
    relatedTools: ['claude', 'perplexity'], relatedTutorials: [], relatedPrompts: ['p050', 'p051'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p149': {
    taskCategory: '写方案', taskDesc: '设计粉丝社群的运营策略和日常管理方案', whenToUse: '社群搭建初期、社群活跃度提升、社群规模扩张', whenNotToUse: '不做社群运营的纯广告投放模式',
    inputGuide: { required: '社群平台（Discord/QQ群/微信群）、社群定位、目标规模', optional: '现有社群数据、管理团队规模、预算', tips: '社群运营的核心是「培养核心用户」而非追求规模' },
    exampleFull: { input: '平台=Discord，定位=官方粉丝社区，目标=1万人活跃社群', outputPreview: '社群架构：\n频道设计：#公告/#攻略/#二创/#水聊/#反馈\n角色体系：新人→活跃→核心→管理...' },
    commonFailures: ['缺少管理规则导致混乱', '只有官方发言缺乏互动', '管理员倦怠维护不足'], optimizationTips: ['培养核心用户志愿管理', '设计等级体系激励长期参与', '每周至少一次官方互动活动'],
    versions: { lite: '社群架构 + 基础规则', advanced: '完整运营方案 + 管理手册 + 活动日历 + 成长体系' },
    relatedTools: ['claude'], relatedTutorials: [], relatedPrompts: ['p073', 'p077'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p150': {
    taskCategory: '写方案', taskDesc: '制定游戏品牌全年营销日历', whenToUse: '年度营销规划、品牌战略制定、跨部门协作对齐', whenNotToUse: '游戏生命周期不足一年不适合做年度规划',
    inputGuide: { required: '游戏名称、年度目标、核心节日/节点列表', optional: '预算分配、历史营销数据、竞品营销参考', tips: '节日营销只是日历的一部分，还要包括版本、赛事、品牌事件' },
    exampleFull: { input: '游戏=幻想大陆，目标=DAU稳定+品牌知名度提升，节点=春节/周年庆/暑假/双11', outputPreview: '1月: 新年活动+预热周年庆\n2月: 春节限定活动（重点档期）\n3月: 周年庆（年度最大活动）...' },
    commonFailures: ['日历过于密集执行不过来', '忽略版本更新节奏的配合', '缺少留白休息期'], optimizationTips: ['区分S/A/B级活动分配资源', '大活动间隔不少于6周', '日历每季度review调整'],
    versions: { lite: '12个月营销时间线', advanced: '完整年度营销方案 + 预算分配 + 资源需求 + KPI体系' },
    relatedTools: ['claude', 'notion-ai'], relatedTutorials: [], relatedPrompts: ['p105', 'p052'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p151': {
    taskCategory: '做分析', taskDesc: '对玩家留存数据进行多维归因分析', whenToUse: '留存指标异常诊断、留存优化项目、版本效果评估', whenNotToUse: '留存数据采集尚不完善的早期阶段',
    inputGuide: { required: '留存数据（各周期）、用户分群维度、异常时段', optional: '漏斗数据、A/B测试结果、外部因素', tips: '区分「可控因素」和「外部因素」是归因的第一步' },
    exampleFull: { input: '数据=次留38%→32%下降6pp，分群=新手/回归/付费，时段=上周版本更新后', outputPreview: '归因分析：\n新手次留下降8pp（主因：新手引导改版延长了30%）\n回归次留无变化\n付费次留下降2pp...' },
    commonFailures: ['只看平均值不做分群分析', '混淆相关性和因果性', '未排除外部因素影响'], optimizationTips: ['至少按3个维度交叉分析', '用对照组/自然实验验证因果', '每条归因附带「验证方法」'],
    versions: { lite: '留存异常TOP3归因', advanced: '完整归因分析 + 分群明细 + 验证方案 + 改善优先级' },
    relatedTools: ['claude', 'deepseek'], relatedTutorials: [], relatedPrompts: ['p065', 'p056'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p152': {
    taskCategory: '写方案', taskDesc: '根据付费层级设计差异化运营策略', whenToUse: 'ARPU 提升项目、付费用户精细化运营、VIP 体系设计', whenNotToUse: '付费用户太少不足以支撑分层运营',
    inputGuide: { required: '付费分层标准、各层用户量级、运营目标', optional: '现有VIP体系、付费行为数据、竞品VIP方案', tips: '核心是让每层用户都感觉「被重视」' },
    exampleFull: { input: '分层=免费/月卡/中氪($50-200)/大R($200+)，目标=中氪提升和大R维护', outputPreview: '分层策略：\n免费用户：首充引导+限时试用高级功能\n月卡用户：专属每日奖励+月度抽奖...' },
    commonFailures: ['大R特权太明显引起免费玩家反感', '付费升档激励不足', '专属服务执行不到位'], optimizationTips: ['设计「感知差异」而非「能力差异」', '大R的核心需求是「被认可」而非「更多资源」', '每层设置向上流转的钩子'],
    versions: { lite: '分层模型 + 各层核心策略', advanced: '完整VIP运营方案 + 权益体系 + 升档机制 + ROI评估' },
    relatedTools: ['claude'], relatedTutorials: [], relatedPrompts: ['p059', 'p057'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p153': {
    taskCategory: '做分析', taskDesc: '分析玩家在游戏内的行为路径，发现优化机会', whenToUse: '新手漏斗优化、核心循环验证、用户体验改善', whenNotToUse: '缺少行为埋点数据无法做路径分析',
    inputGuide: { required: '分析目标、关键行为节点、数据来源', optional: '用户分群、时间范围、对比基准', tips: '关注「分叉点」——用户在哪里开始走向不同路径' },
    exampleFull: { input: '目标=新手首日路径分析，节点=注册→引导→首战→首抽→首日回归，数据=最近7天新增用户', outputPreview: '路径分析：\n注册→完成引导：92%（流失8%在创角阶段）\n完成引导→首战：85%...' },
    commonFailures: ['行为节点定义不清晰', '样本时间太短结论不稳定', '只看流失率不看原因'], optimizationTips: ['用桑基图可视化路径分支', '重点优化「流失率最高的环节」', '对比付费/非付费用户的路径差异'],
    versions: { lite: '核心路径漏斗 + 流失节点', advanced: '完整路径分析 + 桑基图 + 分群对比 + 优化方案' },
    relatedTools: ['claude', 'deepseek'], relatedTutorials: [], relatedPrompts: ['p055', 'p065'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p154': {
    taskCategory: '做分析', taskDesc: '对比分析竞品在各平台的用户口碑和评价', whenToUse: '竞品舆情监测、产品定位参考、营销策略调整', whenNotToUse: '已有专业舆情监测工具覆盖的情况',
    inputGuide: { required: '竞品列表、监测平台、分析维度', optional: '自家口碑数据、时间范围、特定关注话题', tips: '评价数据要结合评分趋势看，单一时间点的评分参考价值有限' },
    exampleFull: { input: '竞品=[原神/崩铁]，平台=TapTap+App Store，维度=整体评分+关键词', outputPreview: '口碑对比：\n原神 TapTap 5.8分（近3月下降0.3）关键词：内容干旱/体力不足/新区域好评\n崩铁 TapTap 7.2分...' },
    commonFailures: ['只看评分不分析评价内容', '未区分版本变化导致的评价波动', '样本量不足结论偏颇'], optimizationTips: ['追踪评分随版本更新的变化趋势', '用NLP分析评价关键词', '对比「好评关键词」找到竞品优势'],
    versions: { lite: '评分对比 + 关键词云', advanced: '完整口碑分析 + 趋势图 + 情感分析 + 竞争策略建议' },
    relatedTools: ['perplexity', 'claude'], relatedTutorials: [], relatedPrompts: ['p039', 'p064'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p155': {
    taskCategory: '做分析', taskDesc: '评估游戏市场的整体规模和未来趋势', whenToUse: '投资决策、立项评估、战略规划', whenNotToUse: '只需要特定品类分析（用p062更合适）',
    inputGuide: { required: '关注市场范围、分析周期、核心指标', optional: '数据来源偏好、关注细分领域', tips: '用 Perplexity 搜索最新行业报告获取权威数据' },
    exampleFull: { input: '范围=中国手游市场，周期=2024-2026，指标=市场规模/增速/细分占比', outputPreview: '市场概览：\n2024年中国手游市场规模约¥2800亿，同比增长8%\n预计2026年达¥3200亿...' },
    commonFailures: ['数据来源不可靠', '预测过于乐观', '忽略监管政策的影响'], optimizationTips: ['交叉验证至少2-3个数据来源', '区分乐观/中性/悲观三种预测场景', '重点分析影响趋势的驱动因素'],
    versions: { lite: '市场规模概览 + 趋势判断', advanced: '完整市场报告 + 细分分析 + 驱动因素 + 预测模型' },
    relatedTools: ['perplexity', 'claude'], relatedTutorials: [], relatedPrompts: ['p060', 'p062'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p156': {
    taskCategory: '做分析', taskDesc: '构建详细的目标用户画像，指导产品和营销决策', whenToUse: '产品定位、广告定向、内容策略制定', whenNotToUse: '已有数据驱动的精准画像系统',
    inputGuide: { required: '游戏类型、目标市场、画像构建维度', optional: '现有用户数据、竞品用户分析、调研数据', tips: '画像要具体到「这个人的一天是怎样的」' },
    exampleFull: { input: '类型=二次元RPG，市场=中国18-30岁，维度=人口统计+行为+心理', outputPreview: '目标用户画像A（小花，22岁）：\n大学生/女/二线城市/月生活费2500\n每天刷B站2小时...' },
    commonFailures: ['画像太宽泛不具体', '基于假设而非数据', '忽略非目标用户的潜在机会'], optimizationTips: ['创建3-5个具体的Persona并命名', '每个画像附带「一天的生活场景」', '用调研数据验证画像假设'],
    versions: { lite: '核心用户画像 x 3', advanced: '完整画像体系 + 用户旅程 + 触点分析 + 营销策略映射' },
    relatedTools: ['claude', 'perplexity'], relatedTutorials: [], relatedPrompts: ['p055', 'p061'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p157': {
    taskCategory: '提效率', taskDesc: '自动化生成游戏数据日报/周报', whenToUse: '建立数据汇报体系、运营日常监控、团队数据对齐', whenNotToUse: '已有 BI 系统自动生成报表',
    inputGuide: { required: '报告频率、核心指标列表、报告受众', optional: '数据来源、历史报告模板、异常阈值', tips: '日报精简（5个核心指标），周报详细（含分析和建议）' },
    exampleFull: { input: '频率=日报+周报，指标=DAU/付费/留存/新增/ARPU，受众=运营团队', outputPreview: '日报模板：\n📊 [日期] 运营日报\n- DAU: 52,341 (↑3.2%)\n- 新增: 1,205 (→持平)\n- 付费率: 4.8% (↑0.2pp)...' },
    commonFailures: ['指标太多失去焦点', '只有数据没有洞察', '报告格式不统一'], optimizationTips: ['用红绿灯标注指标健康度', '日报不超过5个指标', '周报加入「本周关键发现」和「下周关注点」'],
    versions: { lite: '日报/周报模板', advanced: '完整报告体系 + 模板 + 异常预警 + 自动化方案' },
    relatedTools: ['claude', 'notion-ai'], relatedTutorials: [], relatedPrompts: ['p092', 'p120'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p158': {
    taskCategory: '写方案', taskDesc: '设计游戏功能或运营策略的 A/B 测试方案', whenToUse: '功能效果验证、运营策略对比、定价测试', whenNotToUse: '流量不足以支撑实验（日新增<500）',
    inputGuide: { required: '测试假设、核心指标、可用流量', optional: '历史基线、技术方案、测试周期', tips: '每次只测一个变量' },
    exampleFull: { input: '假设=新版首充礼包可提升首充率3pp，指标=首充转化率，流量=日新增2000', outputPreview: '测试方案：\n对照组(50%)：当前首充礼包\n实验组(50%)：新版首充礼包\n统计显著性：95%置信度需约2000样本...' },
    commonFailures: ['同时改多个变量', '测试时间太短', '忽略网络效应'], optimizationTips: ['提前计算最小样本量', '跑满一个完整用户周期', '用贝叶斯方法可以更早得出结论'],
    versions: { lite: '测试方案 + 分组规则', advanced: '完整实验方案 + 样本计算 + 分析框架 + 决策标准' },
    relatedTools: ['claude'], relatedTutorials: [], relatedPrompts: ['p067'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p159': {
    taskCategory: '做分析', taskDesc: '诊断游戏经济系统的健康状况', whenToUse: '经济指标异常、通胀/通缩苗头、版本更新评估', whenNotToUse: '经济系统运行稳定无异常',
    inputGuide: { required: '经济核心数据（货币存量/产出/消耗/价格变化）', optional: '历史趋势数据、玩家投诉、付费数据关联', tips: '关注「中位数」而非「平均值」——避免大R数据干扰' },
    exampleFull: { input: '数据=服务器平均金币存量上月增长15%，金币产出日均10500/消耗8000', outputPreview: '诊断结论：\n⚠️ 通胀预警：金币日产出超消耗31%，月增长率15%\n预测：若不干预，3个月后物价上涨约50%...' },
    commonFailures: ['只看总量不看分布', '忽略玩家分层差异', '调整方案不考虑连锁反应'], optimizationTips: ['按玩家层级分析货币持有量分布', '监控「可交易货币」和「绑定货币」分别', '每次调整做经济沙盘推演'],
    versions: { lite: '经济健康度评分 + 核心风险', advanced: '完整诊断报告 + 预测模型 + 调优方案 + 监控仪表盘设计' },
    relatedTools: ['claude', 'deepseek'], relatedTutorials: [], relatedPrompts: ['p080', 'p141'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p160': {
    taskCategory: '做分析', taskDesc: '检验游戏战斗数值的平衡性', whenToUse: '新角色上线前测试、平衡性版本更新、玩家反馈回应', whenNotToUse: '不涉及战斗数值的游戏类型',
    inputGuide: { required: '战斗公式、角色/装备数值、检验目标', optional: '战斗日志、胜率数据、玩家反馈', tips: '用极限场景（最强/最弱组合）检验数值边界' },
    exampleFull: { input: '公式=伤害=(攻-防)×技能倍率，目标=验证新角色X不会破坏平衡', outputPreview: '检验结果：\n角色X满配DPS=15,200 → 当前TOP1(原14,500)增幅4.8%\n⚠️ 与特定装备组合后DPS异常拉升至18,000...' },
    commonFailures: ['只测平均情况不测极端情况', '忽略技能组合的协同效应', '未考虑PVP和PVE的差异'], optimizationTips: ['测试TOP10强力组合', '分PVP和PVE分别评估', '用蒙特卡洛模拟随机性影响'],
    versions: { lite: 'DPS排行 + 异常标记', advanced: '完整平衡性报告 + 极端场景 + 调优建议 + PVP/PVE分析' },
    relatedTools: ['claude', 'deepseek'], relatedTutorials: [], relatedPrompts: ['p081', 'p140'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p161': {
    taskCategory: '产内容', taskDesc: '根据游戏主题和目标生成内容创作灵感和选题', whenToUse: '内容团队选题困难、创作灵感枯竭、内容矩阵规划', whenNotToUse: '已有充足的选题储备',
    inputGuide: { required: '游戏名称、内容平台、目标用户', optional: '已发布内容列表、竞品热门内容、近期热点', tips: '好的选题来自「用户真实需求」而非「我们想说什么」' },
    exampleFull: { input: '游戏=幻想大陆，平台=B站+微博，用户=二次元RPG玩家', outputPreview: '选题矩阵（30个）：\n热门类：#角色CP组合投票 #版本排行榜\n攻略类：#新手避坑指南 #角色培养路线...' },
    commonFailures: ['选题同质化严重', '脱离用户兴趣', '产出频率不可持续'], optimizationTips: ['按「热门/攻略/互动/品牌」四象限规划', '关注社区高赞帖子提取选题灵感', '每月复盘内容数据指导下月选题'],
    versions: { lite: '20个选题创意', advanced: '完整内容矩阵 + 选题日历 + 内容模板 + 效果追踪' },
    relatedTools: ['chatgpt', 'claude'], relatedTutorials: [], relatedPrompts: ['p072', 'p073'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p162': {
    taskCategory: '产内容', taskDesc: '用结构化模板批量生成游戏攻略文章', whenToUse: '攻略内容矩阵建设、SEO内容生产、社区内容补充', whenNotToUse: 'UGC攻略已经很丰富不需要官方补充',
    inputGuide: { required: '攻略类型、游戏数据/素材、目标数量', optional: '风格参考、SEO关键词、发布平台', tips: '用模板确保质量一致，用具体数据增加可信度' },
    exampleFull: { input: '类型=角色养成攻略，数据=10个SSR角色的技能和推荐配装，数量=10篇', outputPreview: '模板结构：\n1. 角色简评（50字内给结论）\n2. 推荐装备/圣遗物（表格形式）\n3. 队伍搭配建议...' },
    commonFailures: ['模板感太强缺少个性', '数据不准确或过时', '缺少实战验证'], optimizationTips: ['每篇加入作者个人观点增加差异化', '配实战截图/视频增加可信度', '随版本更新即时修订'],
    versions: { lite: '攻略模板 + 3篇示范', advanced: '完整攻略体系 + 模板 + 批量脚本 + 更新维护流程' },
    relatedTools: ['chatgpt', 'claude'], relatedTutorials: [], relatedPrompts: ['p072', 'p161'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p163': {
    taskCategory: '写文案', taskDesc: '生成社区公告和版本预告文案', whenToUse: '版本更新预告、活动公告、功能上线通知', whenNotToUse: '紧急维护公告（用p078更合适）',
    inputGuide: { required: '公告类型、核心信息、发布平台', optional: '配图需求、发布时间、互动引导', tips: '预告文案核心是「制造期待」，公告核心是「信息清晰」' },
    exampleFull: { input: '类型=2.0版本预告，信息=新地图+新角色+新玩法，平台=TapTap+微博', outputPreview: 'TapTap版：\n「大陆彼端，新的故事正在展开——」\n2.0版本「破晓之章」即将于X月X日上线...' },
    commonFailures: ['预告信息剧透太多', '公告格式不统一', '各平台文案雷同未适配'], optimizationTips: ['预告分3次递进释放信息', '每条公告附带视觉素材', '不同平台调整文案风格和长度'],
    versions: { lite: '单条公告/预告文案', advanced: '完整预告序列 + 多平台适配 + 互动引导 + 发布时间表' },
    relatedTools: ['chatgpt', 'claude'], relatedTutorials: [], relatedPrompts: ['p076', 'p079'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p164': {
    taskCategory: '写文案', taskDesc: '批量生成游戏邮件和推送通知文案', whenToUse: '推送文案A/B测试、活动推送、自动化营销', whenNotToUse: '推送系统未搭建完成',
    inputGuide: { required: '推送场景列表、目标用户群、品牌语气', optional: '历史推送数据、推送频率限制', tips: '推送标题决定打开率，正文决定点击率' },
    exampleFull: { input: '场景=活动推送/召回推送/付费提醒，用户=全服，语气=活泼友好', outputPreview: '活动推送x5：\n1.「新活动上线！登录领100钻石→」\n2.「限时3天！SSR概率提升2倍」...' },
    commonFailures: ['推送太频繁被关闭', '文案千篇一律', '点击后落地体验不连贯'], optimizationTips: ['每种场景准备3-5个文案版本轮换', 'A/B测试至少跑1000人才有结论', '跟踪推送→打开→行为完整链路'],
    versions: { lite: '各场景x3条文案', advanced: '完整推送策略 + 文案库 + 频率规划 + A/B测试方案' },
    relatedTools: ['chatgpt'], relatedTutorials: [], relatedPrompts: ['p075', 'p076'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p165': {
    taskCategory: '提效率', taskDesc: '为各类工作流程生成标准作业流程(SOP)文档', whenToUse: '新流程规范化、团队扩张标准化、跨部门协作对齐', whenNotToUse: '流程极简不需要文档化',
    inputGuide: { required: '流程名称、涉及角色、关键步骤', optional: '现有流程描述、历史问题记录、工具列表', tips: '好的SOP要让新人看完就能执行' },
    exampleFull: { input: '流程=活动上线流程，角色=策划/开发/QA/运营，步骤=策划→开发→测试→上线→数据复盘', outputPreview: '活动上线SOP：\nD-14 策划提交活动方案（策划负责人）\n  □ 活动规则文档\n  □ 数值配置表...' },
    commonFailures: ['SOP太冗长没人看', '步骤之间缺少检查点', '未定期更新过时'], optimizationTips: ['用 checklist 格式最易执行', '每个步骤标注负责人和时间', '每季度review更新SOP'],
    versions: { lite: '核心步骤 checklist', advanced: '完整SOP + 责任矩阵 + 异常处理 + 培训材料' },
    relatedTools: ['claude', 'notion-ai'], relatedTutorials: [], relatedPrompts: ['p085', 'p091'], relatedPaths: [], lastUpdated: '2025-06-10'
  }
};

// ========== 执行升级 ==========
console.log('===== Batch-12 内容升级 =====\n');
const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
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

const verified = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
const upgraded = verified.filter(p => !!p.taskCategory).length;
console.log(`Prompt：${upgraded}/${verified.length} 已升级 (${(upgraded/verified.length*100).toFixed(1)}%)`);
console.log(`\n✅ Batch-12 数据更新完成`);
