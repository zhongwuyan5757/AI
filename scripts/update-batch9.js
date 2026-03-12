/**
 * Batch-9 内容扩展
 * 20 Prompt (p086-p105)
 * 覆盖场景: SOP生成、效率工具、投放优化、本地化、发行策划
 */
const fs = require('fs');
const path = require('path');

const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

const promptExtensions = {
  'p086': {
    taskCategory: '提效率',
    taskDesc: '生成危机公关应急处理的标准流程，快速响应负面事件',
    whenToUse: '建立危机预案、发生负面舆情时的应急响应、团队培训',
    whenNotToUse: '日常品牌运维，不涉及危机情景',
    inputGuide: {
      required: '游戏/品牌名称、潜在危机类型、团队规模和角色',
      optional: '历史危机案例、媒体关系资源、法务支持情况',
      tips: '危机分级是 SOP 的核心，不同级别对应不同响应速度'
    },
    exampleFull: {
      input: '品牌=幻想大陆，危机类型=数据泄露/游戏Bug/舆论争议，团队=PR+运营+法务+技术',
      outputPreview: '一级危机（数据泄露）：\n  T+0h：技术团队确认影响范围\n  T+1h：法务评估合规风险...'
    },
    commonFailures: ['响应速度太慢错过黄金4小时', '没有预设话术模板', '责任人不明确'],
    optimizationTips: ['预设3级危机响应标准', '准备通用声明模板可快速适配', '每季度做一次危机模拟演练'],
    versions: { lite: '危机分级标准 + 核心流程', advanced: '完整应急SOP + 话术模板库 + 责任矩阵 + 演练方案' },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p054', 'p085'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p087': {
    taskCategory: '提效率',
    taskDesc: '为团队新成员设计 AI 工具培训方案，快速提升 AI 使用能力',
    whenToUse: '新员工入职培训、团队AI技能提升、AI工具推广期',
    whenNotToUse: '团队已熟练掌握AI工具不需要基础培训',
    inputGuide: {
      required: '培训对象岗位、当前 AI 使用水平、培训目标和周期',
      optional: '可用 AI 工具列表、预算、培训形式偏好',
      tips: '培训核心是「场景化」——按工作场景教工具，不要按工具教功能'
    },
    exampleFull: {
      input: '岗位=游戏策划，水平=AI零基础，目标=独立使用AI辅助日常工作，周期=1周',
      outputPreview: 'Day1: AI基础认知 + ChatGPT 上手\nDay2: 提示词工程实战...'
    },
    commonFailures: ['内容过于理论缺少实操', '未与实际工作场景结合', '培训后缺乏持续支持'],
    optimizationTips: ['按「看→学→做→教」四阶段设计', '每天布置实际工作任务作为练习', '建立内部 AI 知识库持续更新'],
    versions: { lite: '1天快速入门课程大纲', advanced: '完整培训方案 + 课件 + 实操练习 + 考核标准 + 后续支持' },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p085'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p088': {
    taskCategory: '提效率',
    taskDesc: '生成游戏内容审核的标准流程和判定规则',
    whenToUse: '建立内容审核体系、UGC平台审核规范、出海合规审核',
    whenNotToUse: '不涉及用户内容或第三方内容的纯单机游戏',
    inputGuide: {
      required: '审核内容类型（文字/图片/视频/昵称）、目标市场、法规要求',
      optional: '现有审核工具、审核团队规模、历史违规案例',
      tips: '区分「机器自动审核」和「人工复审」的边界'
    },
    exampleFull: {
      input: '内容=玩家昵称+聊天+头像，市场=中国+东南亚，法规=中国网信办+各国本地法规',
      outputPreview: '审核标准分级：\nP0（自动封禁）：涉政敏感/色情/暴力/恐怖\nP1（人工复审）：擦边/引战/广告...'
    },
    commonFailures: ['审核标准模糊导致执行不一致', '误封率太高影响体验', '忽视不同市场的法规差异'],
    optimizationTips: ['建立可视化案例库辅助审核员判断', '设置申诉机制减少误封', '每月更新敏感词库'],
    versions: { lite: '审核分级标准 + 核心规则', advanced: '完整审核SOP + 案例库 + 敏感词策略 + 申诉流程 + 多地区适配' },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p098', 'p085'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p089': {
    taskCategory: '提效率',
    taskDesc: '生成各类工作邮件和消息的快速回复模板，提升沟通效率',
    whenToUse: '日常邮件处理、跨部门沟通、外部合作回复',
    whenNotToUse: '需要高度个性化回复的重要邮件/谈判',
    inputGuide: {
      required: '邮件/消息场景、语气风格、核心信息点',
      optional: '原始邮件内容、回复人角色、紧急程度',
      tips: '模板要留足「个性化填充位」避免机械感'
    },
    exampleFull: {
      input: '场景=商务合作初步回复，语气=专业友好，信息=感兴趣+需要更多信息+安排会议',
      outputPreview: '主题：Re: 合作机会探讨\n\nXX您好，\n\n感谢您的来信，我们对贵方提出的合作方向非常感兴趣...'
    },
    commonFailures: ['模板化太明显缺乏诚意', '遗漏关键信息点', '语气与场景不匹配'],
    optimizationTips: ['按场景分类建立模板库', '每个模板标注「必填项」和「可选项」', '定期收集好的回复案例更新模板'],
    versions: { lite: '10个高频场景回复模板', advanced: '完整模板库 + 场景分类 + 多语言版本 + 使用指南' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p090'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p090': {
    taskCategory: '提效率',
    taskDesc: '翻译和校对工作文档，确保多语言版本的准确性和一致性',
    whenToUse: '跨国团队协作、文档本地化、外部合作方沟通',
    whenNotToUse: '已有专业翻译团队覆盖的重要法律/合同文档',
    inputGuide: {
      required: '原文内容、源语言、目标语言、文档类型',
      optional: '术语表、语气偏好、格式要求',
      tips: '提供术语表可以大幅提升专业文档的翻译一致性'
    },
    exampleFull: {
      input: '原文=游戏设计文档，源=中文，目标=英文+日文，类型=技术文档',
      outputPreview: '英文版：\n[保持原文结构的英文翻译]\n\n日文版：\n[保持原文结构的日文翻译]'
    },
    commonFailures: ['专业术语翻译不一致', '直译导致不自然', '格式和排版混乱'],
    optimizationTips: ['先建立术语对照表再开始翻译', '用 Claude 做初译，再让母语者审校', '分段翻译确保长文档的一致性'],
    versions: { lite: '快速翻译 + 基础校对', advanced: '精校翻译 + 术语管理 + 多版本对比 + 审校报告' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p034', 'p099'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p091': {
    taskCategory: '提效率',
    taskDesc: '根据需求和资源自动生成项目排期表和里程碑',
    whenToUse: '新项目启动排期、版本计划、跨团队项目协调',
    whenNotToUse: '已有成熟项目管理工具且排期稳定的团队',
    inputGuide: {
      required: '项目/功能列表、团队资源、截止日期',
      optional: '任务依赖关系、历史工期数据、假期安排',
      tips: '预留 20-30% 缓冲时间是排期准确的关键'
    },
    exampleFull: {
      input: '功能=好友系统+公会系统+排行榜，团队=3策划2前端3后端2QA，截止=3个月',
      outputPreview: '排期：\nW1-W3: 好友系统（策划1+前端1+后端1+QA1）\nW2-W5: 公会系统（策划1+前端1+后端2+QA1）...'
    },
    commonFailures: ['估时过于乐观', '忽略任务依赖关系', '未考虑资源冲突'],
    optimizationTips: ['用「乐观/正常/悲观」三值估时法', '标注关键路径上的任务', '每周检查排期偏差并及时调整'],
    versions: { lite: '任务列表 + 时间分配', advanced: '完整排期表 + 甘特图 + 依赖关系 + 资源视图 + 风险标注' },
    relatedTools: ['claude', 'notion-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p044', 'p092'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p092': {
    taskCategory: '提效率',
    taskDesc: '帮助整理每日或每周工作内容，生成结构化复盘记录',
    whenToUse: '日报/周报撰写、OKR进度回顾、个人效率提升',
    whenNotToUse: '不需要工作记录或已有自动化记录工具',
    inputGuide: {
      required: '时间范围、完成的工作内容、遇到的问题',
      optional: 'OKR/KPI对齐、下周计划、需要协助的事项',
      tips: '用「完成/进行中/阻塞/计划」四象限组织最清晰'
    },
    exampleFull: {
      input: '周期=本周，工作=完成好友系统设计文档/推进UI评审/处理3个线上Bug',
      outputPreview: '【本周复盘】\n✅ 已完成：好友系统设计文档v1.0（含技术评审通过）\n🔄 进行中：UI评审（待设计确认3处修改）...'
    },
    commonFailures: ['记录太笼统缺乏具体产出', '只列做了什么没有反思', '未与目标对齐'],
    optimizationTips: ['每条记录标注「产出物」和「下一步」', '用 STAR 法则描述关键工作', '每周最后 30 分钟专门做复盘'],
    versions: { lite: '每日工作速记模板', advanced: '完整周报模板 + OKR对齐 + 效率分析 + 改进计划' },
    relatedTools: ['claude', 'notion-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p091'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p093': {
    taskCategory: '写方案',
    taskDesc: '为广告投放设计受众定向策略，精准触达目标玩家',
    whenToUse: '新广告活动启动、受众扩展测试、投放效率下降需优化',
    whenNotToUse: '投放预算极低不足以支撑受众细分测试',
    inputGuide: {
      required: '游戏类型、目标市场、投放平台、预算范围',
      optional: '现有用户画像、历史投放数据、竞品定向参考',
      tips: '先定「核心受众」再逐步「拓展受众」'
    },
    exampleFull: {
      input: '类型=二次元RPG，市场=日本+韩国，平台=Google+TikTok，预算=$5万/月',
      outputPreview: '核心受众（40%预算）：\n- 兴趣：动漫/RPG游戏/二次元文化\n- 年龄：18-30\n- 行为：最近安装过同类游戏...'
    },
    commonFailures: ['受众太宽泛浪费预算', '受众太窄规模不足', '未做受众排除（排除已安装用户）'],
    optimizationTips: ['3-5 个受众组同时测试', '每周分析各受众组 CPI 和留存', '善用 Lookalike 受众扩展'],
    versions: { lite: '核心受众定义 + 平台设置建议', advanced: '完整定向策略 + 受众矩阵 + 测试计划 + 优化节奏' },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: [],
    relatedPrompts: ['p094', 'p095'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p094': {
    taskCategory: '写方案',
    taskDesc: '基于数据反馈迭代优化广告创意素材方案',
    whenToUse: '素材效果衰减、CTR 下降、需要新一批创意素材',
    whenNotToUse: '首次投放还没有数据反馈的阶段',
    inputGuide: {
      required: '当前素材数据（CTR/CVR/CPI）、素材类型、优化目标',
      optional: '竞品素材参考、品牌限制、可用资源',
      tips: '每次迭代只改 1 个变量（画面/文案/CTA），方便归因'
    },
    exampleFull: {
      input: '当前数据=CTR 1.2%(行业1.8%)，类型=视频素材，目标=CTR提升50%',
      outputPreview: '优化方向：\n1. 开头3秒：当前过慢→改为角色技能特写+冲击文字\n2. CTA：「下载」→「免费领取SSR角色」...'
    },
    commonFailures: ['同时改太多变量无法归因', '只优化画面忽略文案', '素材更新频率太低导致疲劳'],
    optimizationTips: ['每周至少产出 3-5 组新素材', '建立素材数据库标注各元素效果', '关注「衰减周期」及时替换'],
    versions: { lite: '优化方向建议 + 3 组新素材方案', advanced: '完整创意迭代框架 + 素材矩阵 + 测试日历 + 数据追踪' },
    relatedTools: ['chatgpt', 'midjourney'],
    relatedTutorials: [],
    relatedPrompts: ['p093', 'p096'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p095': {
    taskCategory: '写方案',
    taskDesc: '制定广告投放的预算分配和出价策略，最大化投放 ROI',
    whenToUse: '新投放计划制定、预算重新分配、渠道调优',
    whenNotToUse: '投放刚起步数据不足以做策略优化',
    inputGuide: {
      required: '总预算、投放渠道、目标KPI（CPI/ROAS）、投放周期',
      optional: '历史数据、季节性因素、竞品投放情报',
      tips: '留 20% 预算做测试和新渠道探索'
    },
    exampleFull: {
      input: '预算=$10万/月，渠道=Facebook+Google+TikTok，目标CPI<$3，周期=3个月',
      outputPreview: '预算分配：\nFacebook 45%（$4.5万）：成熟渠道，稳定出量\nGoogle 30%（$3万）：搜索+UAC混合...'
    },
    commonFailures: ['预算分配过于均匀不够集中', '出价策略不适配投放阶段', '未考虑季节性波动'],
    optimizationTips: ['70% 预算给已验证渠道，30% 测试新渠道', '分「学习期/放量期/稳定期」调整出价', '建立周报监控各渠道 ROI 趋势'],
    versions: { lite: '预算分配方案 + 出价建议', advanced: '完整投放策略 + 预算矩阵 + 出价模型 + 调优节奏 + ROI 预测' },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p093', 'p069'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p096': {
    taskCategory: '做分析',
    taskDesc: '全面诊断广告账户健康状况，发现优化机会',
    whenToUse: 'ROI 下降排查、投放效率瓶颈分析、账户结构优化',
    whenNotToUse: '新开户还没有足够数据的阶段',
    inputGuide: {
      required: '投放平台、账户数据（花费/展示/点击/转化）、诊断目标',
      optional: '账户结构说明、历史优化记录、行业benchmark',
      tips: '从「账户结构→受众→素材→出价」四层诊断'
    },
    exampleFull: {
      input: '平台=Facebook，花费=$5万/月，CPI=$4.5(目标$3)，诊断=CPI过高原因',
      outputPreview: '诊断报告：\n1. 账户结构问题：广告组太多（50+）导致数据分散\n2. 受众重叠率35%（目标<15%）...'
    },
    commonFailures: ['只看结果指标不看过程指标', '诊断停留在数据层未追溯到原因', '改善措施优先级不清'],
    optimizationTips: ['用漏斗模型定位每个环节的转化率', '检查受众重叠率避免自竞价', '每次优化后等待 3-5 天再评估效果'],
    versions: { lite: '核心问题 TOP3 + 改善建议', advanced: '完整诊断报告 + 漏斗分析 + 优化路线图 + 效果预测' },
    relatedTools: ['chatgpt', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p069', 'p094'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p097': {
    taskCategory: '写方案',
    taskDesc: '设计流失用户的再营销和回流策略方案',
    whenToUse: '用户流失率偏高、大版本更新做回流活动、长期运营阶段',
    whenNotToUse: '游戏处于增长期，获新成本低于回流成本',
    inputGuide: {
      required: '流失用户定义、流失原因分析、可用触达渠道',
      optional: '历史回流数据、回流奖励预算、竞品回流策略',
      tips: '按流失时长分层（7天/30天/90天），策略要差异化'
    },
    exampleFull: {
      input: '定义=7天未登录，原因=内容消耗完/付费疲劳/竞品分流，渠道=推送+短信+广告',
      outputPreview: '分层回流策略：\n7-14天流失：推送（新内容预告+专属回归礼包）\n14-30天流失：短信+推送...'
    },
    commonFailures: ['回流奖励破坏付费生态', '触达频率过高引起反感', '回流后没有留存措施'],
    optimizationTips: ['回流奖励应为「体验新内容的钥匙」而非「直接发资源」', '设置回流后 7 天的特殊任务链', '追踪回流用户的二次流失率'],
    versions: { lite: '分层回流方案 + 奖励设计', advanced: '完整再营销策略 + 触达矩阵 + 自动化流程 + ROI 评估' },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p056', 'p059'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p098': {
    taskCategory: '做分析',
    taskDesc: '检查游戏内容的文化敏感性，避免在目标市场引发争议',
    whenToUse: '游戏出海前的文化审查、新内容上线前的敏感性检查',
    whenNotToUse: '纯国内市场不涉及跨文化传播的项目',
    inputGuide: {
      required: '审查内容范围、目标市场列表、内容类型',
      optional: '已知文化禁忌、历史争议案例、当地法规',
      tips: '用 Perplexity 搜索目标市场最新的文化敏感话题'
    },
    exampleFull: {
      input: '内容=角色服装+符号+对话文本，市场=中东+东南亚+欧美',
      outputPreview: '审查发现：\n🔴 高风险：角色A的服装在中东市场暴露度过高，需调整\n🟡 中风险：某符号在东南亚有宗教含义...'
    },
    commonFailures: ['只检查明显禁忌忽略微妙文化差异', '用同一标准审查所有市场', '修改后未让当地人复查'],
    optimizationTips: ['建立各市场的「红线清单」', '每次审查至少有当地文化顾问参与', '预留修改时间避免影响上线节奏'],
    versions: { lite: '核心风险项清单', advanced: '完整文化审查报告 + 分市场风险矩阵 + 修改建议 + 审核流程' },
    relatedTools: ['perplexity', 'claude'],
    relatedTutorials: [],
    relatedPrompts: ['p063', 'p088'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p099': {
    taskCategory: '产内容',
    taskDesc: '为游戏本地化创建标准化术语表和词汇表',
    whenToUse: '本地化项目启动、新语言版本开发、翻译质量管控',
    whenNotToUse: '已有成熟的术语管理系统且维护良好',
    inputGuide: {
      required: '游戏名称、目标语言、核心术语范围',
      optional: '已有翻译资源、风格指南、竞品术语参考',
      tips: '术语表要覆盖「UI文本+剧情文本+系统文本+营销文本」'
    },
    exampleFull: {
      input: '游戏=幻想大陆，语言=英/日/韩，范围=角色名+技能名+系统名称',
      outputPreview: '术语表（部分）：\n| 中文 | 英文 | 日文 | 韩文 |\n| 幻想大陆 | Fantasyland | ファンタジーランド | 환상대륙 |...'
    },
    commonFailures: ['术语不一致（同一名词多种翻译）', '遗漏新版本新增的术语', '术语表维护中断'],
    optimizationTips: ['术语表随版本更新同步维护', '用 CAT 工具（如 memoQ）管理术语库', '每次翻译前必须先同步最新术语表'],
    versions: { lite: '核心术语对照表（100条以内）', advanced: '完整术语管理方案 + 多语言术语库 + 维护流程 + 审核标准' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p090', 'p100'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p100': {
    taskCategory: '产内容',
    taskDesc: '生成本地化质量测试的测试用例和检查清单',
    whenToUse: '本地化 QA 阶段、新语言版本发布前、翻译质量审核',
    whenNotToUse: '不涉及多语言的纯单语言项目',
    inputGuide: {
      required: '测试范围、目标语言、测试平台和设备',
      optional: '历史 QA 问题列表、特殊字符/排版要求、截图需求',
      tips: '重点测试「文本截断」和「排版错乱」——这是本地化最常见的问题'
    },
    exampleFull: {
      input: '范围=全UI界面+对话系统，语言=阿拉伯语，平台=iOS+Android',
      outputPreview: 'TC001: 验证主菜单所有按钮文本完整显示（无截断）\nTC002: 验证阿拉伯语RTL排版正确...'
    },
    commonFailures: ['只测试翻译准确性忽略显示问题', '未覆盖边界情况（超长文本/特殊字符）', '忽视 RTL 语言的排版测试'],
    optimizationTips: ['按「功能区域」组织测试用例', '每种语言至少安排母语 QA', '建立截图基准库自动对比'],
    versions: { lite: '核心测试用例清单', advanced: '完整QA方案 + 测试用例库 + 缺陷分类标准 + 报告模板' },
    relatedTools: ['claude'],
    relatedTutorials: [],
    relatedPrompts: ['p099', 'p098'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p101': {
    taskCategory: '写文案',
    taskDesc: '生成多语言版本的客服话术模板，提升全球客服效率',
    whenToUse: '客服体系搭建、新市场客服部署、客服话术升级',
    whenNotToUse: '已有成熟的多语言客服知识库',
    inputGuide: {
      required: '客服场景列表、目标语言、品牌语气',
      optional: '常见问题列表(FAQ)、现有话术模板、客服工具',
      tips: '每种语言的语气和礼节不同，不能简单翻译'
    },
    exampleFull: {
      input: '场景=账号问题/充值问题/Bug反馈，语言=英/日，语气=友好专业',
      outputPreview: '场景：充值未到账\n中文：亲爱的玩家，我们已收到您的反馈...\n英文：Dear Player, thank you for reaching out...'
    },
    commonFailures: ['直译导致语气不自然', '未覆盖当地特有的问题场景', '话术更新滞后于版本'],
    optimizationTips: ['每种语言请母语者审校话术语气', '按「问题类型×语言」建立矩阵管理', '客服满意度数据反哺话术优化'],
    versions: { lite: '10个核心场景×目标语言', advanced: '完整话术库 + 多语言矩阵 + 培训材料 + 质检标准' },
    relatedTools: ['claude', 'deepseek'],
    relatedTutorials: [],
    relatedPrompts: ['p099', 'p034'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p102': {
    taskCategory: '写方案',
    taskDesc: '生成完整的游戏预注册推广全案，从策略到执行一站式覆盖',
    whenToUse: '新游上线前 2-3 个月启动预注册推广',
    whenNotToUse: '游戏已上线或不做预注册阶段的项目',
    inputGuide: {
      required: '游戏信息、目标预注册量、预算、推广渠道、时间线',
      optional: '竞品预注册数据、已有社区资源、KOL合作资源',
      tips: '预注册的核心是「低成本获取高意向用户」'
    },
    exampleFull: {
      input: '游戏=龙之觉醒，目标=50万预注册，预算=$20万，渠道=社媒+广告+KOL，周期=2个月',
      outputPreview: '阶段1（D-60~D-30）：造势期\n- 悬念预告片发布\n- 官方社媒账号开设...'
    },
    commonFailures: ['预注册到上线的转化率低', '推广节奏前后失衡', '预注册用户缺乏后续维护'],
    optimizationTips: ['设计「邀请好友」裂变机制扩大规模', '预注册期间持续喂内容保持关注度', '上线前 3 天集中推送提醒'],
    versions: { lite: '预注册核心策略 + 渠道分配', advanced: '完整推广全案 + 分阶段执行计划 + 预算明细 + KPI追踪' },
    relatedTools: ['claude', 'chatgpt'],
    relatedTutorials: [],
    relatedPrompts: ['p035', 'p103'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p103': {
    taskCategory: '写方案',
    taskDesc: '制定游戏首发日的完整运营方案，确保首发顺利',
    whenToUse: '游戏上线前 2-4 周开始准备',
    whenNotToUse: '游戏已运营一段时间的日常运营',
    inputGuide: {
      required: '游戏名称、上线日期、首发活动内容、团队分工',
      optional: '预注册用户量、服务器准备情况、媒体安排',
      tips: '首发日的核心是「稳定运行+玩家体验好+声量最大化」'
    },
    exampleFull: {
      input: '游戏=龙之觉醒，上线=2025年8月15日，活动=首充奖励+新手引导+开服竞赛',
      outputPreview: '首发日时间线：\nT-24h：服务器压测+客服就位+素材上线\nT-6h：应用商店上架确认...'
    },
    commonFailures: ['服务器压力预估不足', '上线活动太复杂影响新手体验', '首日 bug 响应速度慢'],
    optimizationTips: ['首发日人员 24 小时值班安排', '准备至少 3 套应急预案', '首日运营数据实时监控大屏'],
    versions: { lite: '首发日时间线 + 核心检查清单', advanced: '完整首发方案 + 分角色任务 + 应急预案 + 数据监控 + 复盘模板' },
    relatedTools: ['claude', 'notion-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p102', 'p085'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p104': {
    taskCategory: '写方案',
    taskDesc: '制定应用商店评分优化方案，提升游戏评分和下载转化率',
    whenToUse: '评分低于4.0需提升、大版本后评分下降、竞品评分压制',
    whenNotToUse: '评分已稳定在4.5+且无优化需求',
    inputGuide: {
      required: '当前评分、差评主要原因、目标评分、目标商店',
      optional: '评分趋势数据、回评策略、竞品评分对比',
      tips: '提升评分的核心是「减少差评」而非「刷好评」'
    },
    exampleFull: {
      input: '当前=TapTap 6.8/App Store 4.1，差评原因=BUG多/付费贵/客服慢，目标=TapTap 8.0',
      outputPreview: '优化策略：\n1.【减少差评】根治TOP3差评原因（BUG修复专项sprint）\n2.【引导好评】满意度高的时刻弹出评分引导...'
    },
    commonFailures: ['忽略差评问题只做好评引导', '评分引导时机不当引起反感', '官方回复模板化缺乏诚意'],
    optimizationTips: ['选择玩家满意的时刻弹出评分引导（如通关/获得奖励后）', '每条差评都要有官方回复', '定期发版解决评价中的高频问题'],
    versions: { lite: '评分现状分析 + 核心改善方向', advanced: '完整评分优化方案 + 引导策略 + 回评模板 + 监控追踪' },
    relatedTools: ['claude', 'perplexity'],
    relatedTutorials: [],
    relatedPrompts: ['p032', 'p039'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  },
  'p105': {
    taskCategory: '写方案',
    taskDesc: '规划游戏长期运营的内容节奏和活动日历',
    whenToUse: '游戏进入稳定期、年度运营规划、季度计划制定',
    whenNotToUse: '游戏处于快速迭代期节奏尚不稳定',
    inputGuide: {
      required: '游戏类型、当前运营阶段、规划周期、核心目标',
      optional: '历史活动数据、版本计划、行业节日日历',
      tips: '长线运营的核心是「节奏感」——有高潮有低谷有预期'
    },
    exampleFull: {
      input: '类型=RPG，阶段=运营第6个月，周期=未来6个月，目标=DAU稳定+付费增长10%',
      outputPreview: '月度节奏模板：\n第1周：新内容/版本更新\n第2-3周：配套活动（PVE/PVP赛季）...'
    },
    commonFailures: ['活动频率过高玩家疲劳', '内容断档导致活跃下降', '缺少长期目标感（赛季/成就）'],
    optimizationTips: ['建立「月度节奏模板」标准化运营', '大活动间隔 4-6 周，小活动填充间隙', '每个季度设置一个「里程碑事件」'],
    versions: { lite: '月度运营节奏模板', advanced: '完整长线运营方案 + 活动日历 + 内容规划 + 目标拆解 + 复盘机制' },
    relatedTools: ['claude', 'notion-ai'],
    relatedTutorials: [],
    relatedPrompts: ['p044', 'p059'],
    relatedPaths: [],
    lastUpdated: '2025-06-10'
  }
};

// ========== 执行升级 ==========
console.log('===== Batch-9 内容升级 =====\n');

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
console.log(`Prompt：${upgraded}/${verified.length} 已升级 (${(upgraded/verified.length*100).toFixed(1)}%)`);
console.log(`\n✅ Batch-9 数据更新完成`);
