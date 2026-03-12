/**
 * Batch-11 内容扩展
 * 20 Prompt (p126-p145)
 * 覆盖场景: 活动策划、广告文案、竞品分析、需求文档、视频脚本
 */
const fs = require('fs');
const path = require('path');
const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

const promptExtensions = {
  'p126': {
    taskCategory: '写方案', taskDesc: '为游戏内公会/社团设计活动方案，增强组织凝聚力', whenToUse: '公会系统上线、社交功能推广、公会活跃度下降', whenNotToUse: '游戏没有公会/社团系统',
    inputGuide: { required: '活动类型、公会规模范围、奖励预算', optional: '现有公会功能、活跃度数据、玩家反馈', tips: '公会活动核心是「协作」——需要成员共同参与才能完成' },
    exampleFull: { input: '类型=公会Boss挑战赛，规模=20-50人公会，奖励=排名奖+参与奖', outputPreview: '活动方案：\n名称：「公会试炼·众志成城」\n规则：公会成员协力挑战限时Boss...' },
    commonFailures: ['大R主导小号挂机', '奖励差距太大导致弱公会流失', '缺少公平性机制'], optimizationTips: ['设置个人贡献值避免搭便车', '分档位匹配避免强弱碾压', '活动后生成公会战报增加仪式感'],
    versions: { lite: '活动方案 + 规则设计', advanced: '完整策划 + 数值平衡 + 技术需求 + 运营节奏' },
    relatedTools: ['claude'], relatedTutorials: [], relatedPrompts: ['p028', 'p129'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p127': {
    taskCategory: '写方案', taskDesc: '设计回归/召回活动方案，激活流失玩家', whenToUse: '大版本更新拉回归、节日召回、流失率偏高需要干预', whenNotToUse: '自然流失率在合理范围内不需要专项召回',
    inputGuide: { required: '流失用户分层（时长）、召回目标、可用资源', optional: '历史召回数据、流失原因分析、竞品召回策略', tips: '召回奖励要让玩家「体验到新内容」而非简单「发资源」' },
    exampleFull: { input: '分层=7天/30天/90天未登录，目标=召回率15%，资源=专属礼包+新手引导', outputPreview: '分层策略：\n7天流失：推送「你的好友在等你」+轻量奖励\n30天流失：专属回归礼包+新内容导览...' },
    commonFailures: ['奖励太丰厚损害活跃玩家公平感', '召回后无留存措施导致二次流失', '推送频率引起反感'], optimizationTips: ['回归任务链引导体验新内容', '回归7天内设置专属体验', '追踪二次留存率评估效果'],
    versions: { lite: '分层召回方案 + 奖励设计', advanced: '完整召回方案 + 触达策略 + 奖励体系 + 效果追踪 + ROI评估' },
    relatedTools: ['claude', 'chatgpt'], relatedTutorials: [], relatedPrompts: ['p097', 'p056'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p128': {
    taskCategory: '写方案', taskDesc: '设计限时挑战活动，制造紧迫感提升活跃', whenToUse: '日常活跃度维护、新功能推广、版本间隙填充', whenNotToUse: '玩家已有疲劳感不宜增加更多活动',
    inputGuide: { required: '挑战类型、活动时长、奖励规模', optional: '历史活动数据、玩家反馈、技术限制', tips: '限时活动的核心是「可达成但有挑战」的目标设计' },
    exampleFull: { input: '类型=积分挑战赛，时长=7天，奖励=限定头像框+材料', outputPreview: '活动设计：\n「7日极限挑战」\nD1-D3: 基础任务积累积分\nD4-D5: 挑战难度提升，积分倍率增加...' },
    commonFailures: ['难度太高多数玩家放弃', '奖励吸引力不足', '与日常任务冲突导致负担感'], optimizationTips: ['设置多个里程碑奖励而非只有最终奖', '保证80%玩家能获得基础奖励', '用进度条展示完成度'],
    versions: { lite: '活动规则 + 奖励设计', advanced: '完整活动方案 + 数值平衡 + 进度设计 + 难度曲线' },
    relatedTools: ['claude'], relatedTutorials: [], relatedPrompts: ['p029', 'p126'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p129': {
    taskCategory: '写方案', taskDesc: '设计促进玩家社交互动的游戏内活动', whenToUse: '社交系统推广、玩家粘性提升、社区活跃度建设', whenNotToUse: '纯单机体验不鼓励社交的游戏设计',
    inputGuide: { required: '社交类型（合作/竞争/交易）、参与门槛、活动周期', optional: '现有社交功能、社交数据、用户画像', tips: '社交活动要「自然发生」而非「强制配对」' },
    exampleFull: { input: '类型=好友合作副本，门槛=等级20+有好友，周期=常驻周更', outputPreview: '活动设计：\n「双人默契挑战」\n- 2人组队完成专属副本\n- 根据配合度评分（S/A/B/C）...' },
    commonFailures: ['强制社交引起反感', '匹配机制不公平', '社恐玩家被排除在外'], optimizationTips: ['提供「随机匹配」选项降低社交门槛', '异步社交（助战/留言）也是社交', '奖励设计鼓励互利而非竞争'],
    versions: { lite: '活动方案 + 社交机制', advanced: '完整社交活动体系 + 匹配算法 + 防滥用 + 数据追踪' },
    relatedTools: ['claude'], relatedTutorials: [], relatedPrompts: ['p126', 'p073'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p130': {
    taskCategory: '写方案', taskDesc: '策划游戏赛事和电竞活动方案', whenToUse: 'PVP 赛事体系搭建、社区赛事运营、品牌电竞合作', whenNotToUse: '游戏没有竞技元素或 PVP 系统',
    inputGuide: { required: '赛制类型、参与门槛、奖池规模、赛事周期', optional: '直播平台、赛事合作方、历史赛事数据', tips: '赛事的核心价值是「观赏性」而非「参与数」' },
    exampleFull: { input: '赛制=淘汰赛，门槛=段位金以上，奖池=5万元等值道具，周期=月赛', outputPreview: '赛事方案：「巅峰对决·月度挑战赛」\n阶段1: 线上海选（64进16）\n阶段2: 8强淘汰赛（直播）...' },
    commonFailures: ['赛制过于复杂玩家看不懂', '赛事与游戏平衡版本冲突', '观赛体验差'], optimizationTips: ['赛事日历与版本更新错开', '配合直播解说提升观赛体验', '赛事皮肤/称号作为参与激励'],
    versions: { lite: '赛制设计 + 赛程安排', advanced: '完整赛事方案 + 直播计划 + 奖励体系 + 推广策略' },
    relatedTools: ['claude', 'chatgpt'], relatedTutorials: [], relatedPrompts: ['p029', 'p046'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p131': {
    taskCategory: '写文案', taskDesc: '批量生成适合短视频平台的游戏种草文案', whenToUse: 'KOL/KOC 投放、抖音/快手种草、短视频评论区营销', whenNotToUse: '不做短视频推广的项目',
    inputGuide: { required: '游戏卖点、目标平台、文案数量、语气风格', optional: '目标用户画像、竞品爆款文案参考、投放预算', tips: '种草文案要「像玩家在说话」而非「像官方在宣传」' },
    exampleFull: { input: '卖点=画面+剧情+免费SSR，平台=抖音，数量=20条，风格=真实玩家口吻', outputPreview: '1. 「玩了三天终于入坑了...这画面也太绝了吧 #游戏推荐」\n2. 「免费送的SSR居然比氪的还强？？」...' },
    commonFailures: ['文案太广告化一眼假', '不符合平台话语风格', '千篇一律没有差异化'], optimizationTips: ['研究平台真实用户的说话方式', '每条文案只突出一个卖点', '混合正面评价和「真实吐槽」增加可信度'],
    versions: { lite: '10 条种草文案', advanced: '30 条文案矩阵 + 评论区互动话术 + KOL 投放指南' },
    relatedTools: ['chatgpt', 'claude'], relatedTutorials: [], relatedPrompts: ['p031', 'p133'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p132': {
    taskCategory: '写文案', taskDesc: '生成买量素材文案矩阵，覆盖多种卖点和风格组合', whenToUse: '投放起量期、素材大批量生产、A/B 测试', whenNotToUse: '投放预算极小不需要大量素材测试',
    inputGuide: { required: '游戏核心卖点列表、素材形式、目标CPI', optional: '历史最佳素材数据、竞品素材风格、投放地区', tips: '用「卖点×风格×形式」三维矩阵穷举组合' },
    exampleFull: { input: '卖点=[画面/自由度/社交/福利]，形式=图片+视频，目标CPI<$2', outputPreview: '素材矩阵（16组）：\n1. 画面×热血→视频：实机大招合集+震撼BGM\n2. 画面×治愈→图片：唯美场景截图+文字...' },
    commonFailures: ['矩阵太大执行不过来', '只换文案不换视觉效果弱', '未追踪各组合效果数据'], optimizationTips: ['先测 4-6 组核心组合找到方向', '效果好的组合「深挖」，差的「快杀」', '每周淘汰效果最差的20%'],
    versions: { lite: '素材矩阵表 + 核心文案', advanced: '完整买量素材体系 + 矩阵 + 制作指南 + 效果追踪' },
    relatedTools: ['chatgpt', 'midjourney'], relatedTutorials: [], relatedPrompts: ['p094', 'p131'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p133': {
    taskCategory: '写文案', taskDesc: '生成游戏社区口碑种草文案，自然融入社区讨论', whenToUse: 'TapTap/NGA/贴吧等社区口碑运营、社区氛围建设', whenNotToUse: '社区已有强烈负面情绪不宜种草',
    inputGuide: { required: '社区平台、游戏卖点、文案角色（身份）', optional: '社区用户特征、当前热点话题、竞品口碑', tips: '社区用户对广告极其敏感，文案必须有「真实感」' },
    exampleFull: { input: '平台=TapTap，卖点=策略深度+无强制付费，角色=老玩家', outputPreview: '标题：「肝了两个月的真实体验，说说优缺点」\n正文：先说结论，7.5分的游戏...（附实机截图）' },
    commonFailures: ['被社区识破为软文反噬', '缺少真实感（太完美/太正面）', '评论区互动不够自然'], optimizationTips: ['文案必须包含「真实缺点」增加可信度', '多用截图和实际数据佐证', '评论区用多个角度讨论而非一味好评'],
    versions: { lite: '5 条社区种草帖', advanced: '完整口碑运营方案 + 多角色文案 + 评论区话术 + 风险管控' },
    relatedTools: ['chatgpt', 'claude'], relatedTutorials: [], relatedPrompts: ['p131', 'p077'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p134': {
    taskCategory: '写文案', taskDesc: '优化应用商店截图上的文案，提升商店页转化率', whenToUse: '商店页优化、A/B 测试截图文案、新版本更新截图', whenNotToUse: '不在应用商店分发的游戏',
    inputGuide: { required: '游戏核心卖点、截图数量（3-8张）、目标商店', optional: '当前截图数据、竞品截图参考、品牌规范', tips: '前 2 张截图决定 80% 的转化效果' },
    exampleFull: { input: '卖点=[沉浸剧情/自由战斗/社交系统]，数量=5张，商店=App Store', outputPreview: '截图1：「沉浸式剧情体验」— 剧情对话截图+大字标题\n截图2：「自由组合，百变战斗」— 技能释放截图...' },
    commonFailures: ['截图文案太长影响画面', '卖点排序不当', '各截图间缺少逻辑递进'], optimizationTips: ['每张截图只传达一个信息', '按「吸引→说服→行动」排序', '文案字号要在手机上清晰可读'],
    versions: { lite: '截图文案 + 排序建议', advanced: '完整截图优化方案 + 文案 + 排版建议 + A/B 测试计划' },
    relatedTools: ['chatgpt', 'canva-ai'], relatedTutorials: [], relatedPrompts: ['p032', 'p109'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p135': {
    taskCategory: '做分析', taskDesc: '对比分析竞品游戏的付费点设计和商业化差异', whenToUse: '商业化方案设计前的竞品调研、付费率优化参考', whenNotToUse: '只需要整体商业模式分析（用p036更合适）',
    inputGuide: { required: '竞品列表（2-3款）、分析维度（首充/月卡/活动付费等）', optional: '自家付费数据、目标ARPU、用户画像', tips: '从「玩家付费旅程」的角度分析而非单纯比较价格' },
    exampleFull: { input: '竞品=[原神/崩铁/鸣潮]，维度=首充/月卡/通行证/抽卡定价', outputPreview: '对比分析：\n首充：原神¥6(90晶石+额外奖励) vs 崩铁¥6(60星琼+额外) vs 鸣潮¥6(...)...' },
    commonFailures: ['只比价格不比价值感', '忽略活动折扣的影响', '未考虑不同市场定价差异'], optimizationTips: ['按「付费时间线」（首日→首周→首月）分析', '计算各付费点的「元/资源」单位价值', '关注竞品促销活动的频率和力度'],
    versions: { lite: '付费点对比表', advanced: '完整分析报告 + 付费旅程图 + 定价策略建议' },
    relatedTools: ['perplexity', 'claude'], relatedTutorials: [], relatedPrompts: ['p036', 'p083'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p136': {
    taskCategory: '做分析', taskDesc: '对比分析竞品游戏的新手体验流程，发现优化机会', whenToUse: '新手引导优化、次留提升、竞品体验研究', whenNotToUse: '新手引导已稳定且数据表现良好',
    inputGuide: { required: '竞品列表、分析维度（时长/节奏/教学）、自家新手数据', optional: '新手漏斗数据、用户反馈、A/B测试结果', tips: '亲自体验竞品新手流程是最有价值的调研' },
    exampleFull: { input: '竞品=[原神/明日方舟/崩铁]，维度=前30分钟体验+首日留存相关设计', outputPreview: '对比发现：\n原神：前5分钟直接进入战斗（即时反馈），引导时长约25分钟\n崩铁：剧情先行+教学融入剧情...' },
    commonFailures: ['分析停留在流程描述缺乏深度', '未结合数据评估效果', '照搬竞品不考虑自身特点'], optimizationTips: ['录屏竞品新手流程逐帧分析', '标注每个环节的「奖励/正反馈」时刻', '关注竞品的「首个AHA moment」在哪里'],
    versions: { lite: '新手流程对比表', advanced: '完整对比报告 + 流程图 + 节奏分析 + 优化建议' },
    relatedTools: ['claude', 'perplexity'], relatedTutorials: [], relatedPrompts: ['p039', 'p065'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p137': {
    taskCategory: '做分析', taskDesc: '对比分析竞品的运营活动日历和节奏', whenToUse: '制定运营活动计划、学习竞品运营节奏、行业趋势分析', whenNotToUse: '只关注单个竞品而非多竞品对比',
    inputGuide: { required: '竞品列表、对比周期、关注维度', optional: '自家活动日历、营收数据关联、用户活跃数据', tips: '用时间轴可视化对比最直观' },
    exampleFull: { input: '竞品=[原神/崩铁/鸣潮]，周期=近3个月，维度=活动类型/频率/奖励力度', outputPreview: '运营节奏对比：\n原神：每42天大版本，中间2个小活动+1个联动\n崩铁：每40天大版本...' },
    commonFailures: ['只记录活动名称不分析策略意图', '忽视活动之间的配合关系', '未关联营收变化'], optimizationTips: ['用日历工具可视化多竞品活动时间线', '标注竞品活动对应的营收变化', '识别「窗口期」——竞品都没有活动的时间'],
    versions: { lite: '活动日历对比表', advanced: '完整运营节奏分析 + 时间线 + 策略拆解 + 机会识别' },
    relatedTools: ['perplexity', 'claude'], relatedTutorials: [], relatedPrompts: ['p037', 'p105'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p138': {
    taskCategory: '做分析', taskDesc: '对比评估竞品的技术实现和性能表现', whenToUse: '技术选型参考、性能优化对标、技术竞争力评估', whenNotToUse: '非技术岗位不需要技术层面的竞品分析',
    inputGuide: { required: '竞品列表、分析维度（画面/帧率/包体/加载速度）', optional: '测试设备清单、自家技术数据、行业benchmark', tips: '用相同设备和网络环境测试才有对比意义' },
    exampleFull: { input: '竞品=[原神/鸣潮]，维度=帧率/画面/包体/内存，设备=iPhone 15 Pro', outputPreview: '技术对比：\n帧率：原神平均55fps vs 鸣潮平均52fps（高画质）\n包体大小：原神25GB vs 鸣潮22GB...' },
    commonFailures: ['测试条件不统一导致数据不可比', '只看参数不看实际体验', '忽略低端设备的表现'], optimizationTips: ['至少覆盖高/中/低端各一台设备', '用专业工具（PerfDog）采集帧率数据', '关注「帧率波动」而非平均帧率'],
    versions: { lite: '核心参数对比表', advanced: '完整技术评估 + 多设备测试 + 性能曲线 + 优化方向' },
    relatedTools: ['claude', 'perplexity'], relatedTutorials: [], relatedPrompts: ['p043', 'p040'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p139': {
    taskCategory: '写方案', taskDesc: '生成标准化的游戏功能规格说明书(FSD)', whenToUse: '功能开发启动前、跨团队功能交接、外包需求文档', whenNotToUse: '功能极其简单不需要正式文档',
    inputGuide: { required: '功能名称、功能目标、目标用户、核心流程', optional: '技术限制、交互原型、数据需求', tips: 'FSD 的核心是「开发读完就能开始写代码」的明确程度' },
    exampleFull: { input: '功能=每日签到系统，目标=提升日活，用户=全服玩家，流程=登录→签到→领奖', outputPreview: '1. 功能概述\n每日签到系统通过持续奖励激励玩家每日登录...\n2. 功能规格\n2.1 签到规则：每日0:00重置...' },
    commonFailures: ['边界条件不清晰', '缺少异常情况处理', '格式不规范导致理解歧义'], optimizationTips: ['使用统一的 FSD 模板', '每个功能点标注「优先级」', '附上状态流转图'],
    versions: { lite: '简版功能说明', advanced: '完整FSD + 状态机 + 接口定义 + 测试用例 + 验收标准' },
    relatedTools: ['claude', 'notion-ai'], relatedTutorials: [], relatedPrompts: ['p041', 'p042'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p140': {
    taskCategory: '写方案', taskDesc: '生成游戏平衡性调整方案文档，规范化调整流程', whenToUse: '版本更新前的平衡性调整、玩家反馈驱动的数值修正', whenNotToUse: '尚在开发期不需要正式调整流程',
    inputGuide: { required: '调整目标、影响范围、当前数据问题', optional: '玩家反馈汇总、战斗日志分析、竞品平衡参考', tips: '每次调整幅度控制在 10-20%，避免大刀阔斧' },
    exampleFull: { input: '目标=修复角色A过强问题，范围=角色A技能2+被动，数据=该角色PVP胜率68%(目标50-55%)', outputPreview: '调整方案：\n角色A·技能2：冷却时间8s→10s（+25%）\n角色A·被动：伤害加成20%→15%（-25%）...' },
    commonFailures: ['调整幅度过大引起玩家不满', '未评估连带影响', '缺少补偿方案'], optimizationTips: ['分步调整：先小幅修正观察一周再决定是否继续', '调整公告要说明「为什么调」而非只说「调了什么」', '给受影响角色的投资者提供重置/补偿选项'],
    versions: { lite: '调整方案 + 影响评估', advanced: '完整调整文档 + 模拟验证 + 公告文案 + 补偿方案 + 效果追踪' },
    relatedTools: ['claude'], relatedTutorials: [], relatedPrompts: ['p081', 'p080'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p141': {
    taskCategory: '写方案', taskDesc: '设计完整的游戏经济系统文档', whenToUse: '新游经济系统搭建、经济系统改版、长期运营经济调优', whenNotToUse: '无虚拟货币/交易系统的游戏',
    inputGuide: { required: '货币体系设计、产出来源、消耗渠道、经济目标', optional: '竞品经济系统参考、预期运营周期、付费设计', tips: '经济系统的核心是「产出=消耗」的动态平衡' },
    exampleFull: { input: '货币=金币(基础)+钻石(高级)+绑钻(活动)，产出=日常任务+活动+付费，消耗=强化+抽卡+商店', outputPreview: '经济系统设计：\n1. 货币体系\n  - 金币：基础消耗货币，日产出10000...' },
    commonFailures: ['产出>消耗导致通胀', '付费货币和免费货币界限模糊', '缺少长期通胀控制机制'], optimizationTips: ['建立经济沙盘模拟不同场景', '设计「货币回收坑」控制通胀', '每个版本做经济健康度审计'],
    versions: { lite: '经济系统概览', advanced: '完整经济设计文档 + 产消模型 + 模拟预测 + 监控指标' },
    relatedTools: ['claude', 'deepseek'], relatedTutorials: [], relatedPrompts: ['p080', 'p083'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p142': {
    taskCategory: '写方案', taskDesc: '制定系统性的用户增长策略文档', whenToUse: '增长团队搭建、年度增长规划、增长瓶颈突破', whenNotToUse: '产品 PMF 尚未验证不宜大规模增长',
    inputGuide: { required: '增长目标、当前用户数据、可用预算、增长渠道', optional: '历史增长数据、竞品增长策略、团队能力评估', tips: '增长策略要平衡「拉新」和「留存」——单纯拉新是漏桶' },
    exampleFull: { input: '目标=6个月DAU从5万增长到15万，预算=$30万/月，渠道=广告+ASO+社交+KOL', outputPreview: '增长策略：\n阶段1(M1-M2): 夯实基础——优化留存至行业top25%\n阶段2(M3-M4): 规模投放...' },
    commonFailures: ['只关注获客忽略留存', '渠道过于单一缺乏抗风险能力', '增长目标不切实际'], optimizationTips: ['先确保留存达标再放大获客', '建立增长实验框架快速试错', '至少布局3个以上获客渠道'],
    versions: { lite: '增长策略框架 + 渠道分配', advanced: '完整增长文档 + 渠道矩阵 + 实验计划 + 目标拆解 + 监控体系' },
    relatedTools: ['claude', 'perplexity'], relatedTutorials: [], relatedPrompts: ['p093', 'p069'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p143': {
    taskCategory: '产内容', taskDesc: '为游戏剧情和过场动画编写脚本', whenToUse: '剧情关卡制作、CG过场动画脚本、主线/支线剧情编写', whenNotToUse: '纯竞技/纯休闲游戏不需要剧情叙事',
    inputGuide: { required: '剧情概要、涉及角色、情感基调、时长/字数限制', optional: '世界观背景、前置剧情、配音需求、交互选择', tips: '游戏剧情要考虑「可跳过性」——不想看剧情的玩家不能被阻塞' },
    exampleFull: { input: '概要=主角发现同伴叛变并决定独自面对，角色=主角+叛变同伴+导师，基调=震惊→悲伤→坚定', outputPreview: '[场景：黄昏的城墙上]\n主角：...你说的是什么意思？\n同伴（背对主角）：我说的就是字面意思...' },
    commonFailures: ['对白太长拖慢游戏节奏', '角色声音不统一', '剧情与玩法脱节'], optimizationTips: ['对白控制在每段 3-5 句以内', '关键剧情用演出（镜头语言）而非纯文字', '预留玩家选择分支增加参与感'],
    versions: { lite: '剧情大纲 + 关键对白', advanced: '完整剧本 + 分镜指示 + 配音标注 + 演出说明' },
    relatedTools: ['claude', 'chatgpt'], relatedTutorials: [], relatedPrompts: ['p070', 'p045'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p144': {
    taskCategory: '写方案', taskDesc: '策划游戏实况/Let\'s Play 系列视频的内容方案', whenToUse: '官方实况频道建设、KOL 实况合作指引、内容营销', whenNotToUse: '不做视频内容营销的项目',
    inputGuide: { required: '游戏名称、实况定位、目标平台、更新频率', optional: '主播/解说者信息、竞品实况参考、设备清单', tips: '实况视频的核心吸引力是「主播个性」而非「游戏内容」' },
    exampleFull: { input: '游戏=幻想大陆，定位=轻松搞笑的探索实况，平台=B站，频率=周更', outputPreview: '系列名：「肝帝日记」\nEP01: 「开局选错职业怎么办」（新手引导+吐槽）\nEP02: 「第一次团灭就来了」...' },
    commonFailures: ['内容过于流水账缺少看点', '更新频率难以维持', '与游戏官方内容混淆'], optimizationTips: ['每期设定一个明确主题', '适当制造「事故」和冲突增加看点', '固定片头片尾建立系列感'],
    versions: { lite: '系列大纲 + 前5期选题', advanced: '完整策划方案 + 选题日历 + 脚本模板 + 推广计划' },
    relatedTools: ['chatgpt', 'capcut-ai'], relatedTutorials: [], relatedPrompts: ['p047', 'p106'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p145': {
    taskCategory: '产内容', taskDesc: '为游戏推广制作短剧/情景剧风格的广告脚本', whenToUse: '抖音/快手短剧广告制作、创意广告尝试', whenNotToUse: '预算不支持剧情类视频制作',
    inputGuide: { required: '游戏卖点、短剧风格、时长、目标受众', optional: '演员需求、拍摄预算、竞品短剧参考', tips: '短剧广告的核心是「故事吸引→自然植入→行动转化」' },
    exampleFull: { input: '卖点=无氪也能玩的良心游戏，风格=职场搞笑，时长=30秒，受众=上班族', outputPreview: '场景：办公室，加班中\n同事A（偷偷玩手机）：「又充钱了？」\n同事B：「这游戏不用充啊...」\n（展示游戏画面）...' },
    commonFailures: ['广告植入太生硬', '剧情与游戏无关联', '演员表演太尬'], optimizationTips: ['前 3 秒不能有广告感', '用「反转」结构增加记忆点', '结尾 CTA 简洁有力'],
    versions: { lite: '3 组短剧脚本', advanced: '完整短剧矩阵 + 拍摄指南 + 多风格版本 + 投放测试方案' },
    relatedTools: ['chatgpt', 'heygen'], relatedTutorials: [], relatedPrompts: ['p107', 'p131'], relatedPaths: [], lastUpdated: '2025-06-10'
  }
};

// ========== 执行升级 ==========
console.log('===== Batch-11 内容升级 =====\n');
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
console.log(`\n✅ Batch-11 数据更新完成`);
