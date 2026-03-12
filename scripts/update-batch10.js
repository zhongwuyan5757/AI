/**
 * Batch-10 内容扩展
 * 20 Prompt (p106-p125)
 * 覆盖场景: 视频制作、调研分析、音频制作、汇报展示、图像生成
 */
const fs = require('fs');
const path = require('path');

const PROMPTS_PATH = path.join(__dirname, '..', 'data', 'prompts.json');

const promptExtensions = {
  'p106': {
    taskCategory: '产内容',
    taskDesc: '为游戏录屏素材生成剪辑方案，提升视频质量和效率',
    whenToUse: '制作游戏实机演示、攻略视频、社媒短视频',
    whenNotToUse: '已有专业视频团队且流程成熟的项目',
    inputGuide: { required: '录屏素材描述、目标视频类型、时长、发布平台', optional: '现有素材时长、背景音乐偏好、品牌调性', tips: '先规划关键画面再补录缺失片段' },
    exampleFull: { input: '素材=2小时实机录屏，类型=60秒短视频，平台=抖音', outputPreview: '剪辑方案：\n0-3s：开场Hook（最精彩的操作瞬间）\n3-15s：核心玩法展示...' },
    commonFailures: ['剪辑节奏单调', '关键画面遗漏', '未适配平台尺寸'],
    optimizationTips: ['用 CapCut AI 自动识别精彩片段', '短视频前 3 秒决定完播率', '竖屏和横屏分别剪辑'],
    versions: { lite: '剪辑大纲 + 节奏规划', advanced: '完整剪辑方案 + 分镜脚本 + 字幕规划 + 配乐建议' },
    relatedTools: ['capcut-ai', 'descript'], relatedTutorials: [], relatedPrompts: ['p107', 'p109'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p107': {
    taskCategory: '产内容',
    taskDesc: '生成动态广告素材（视频广告）的脚本和制作方案',
    whenToUse: '视频广告投放、社媒视频广告制作、广告素材迭代',
    whenNotToUse: '仅投放静态图片广告的场景',
    inputGuide: { required: '游戏类型、广告目标、视频时长、投放平台', optional: '成功素材参考、品牌限制、可用资源（实机/CG/混合）', tips: '15秒和30秒是最通用的广告时长' },
    exampleFull: { input: '类型=SLG，目标=下载，时长=15秒，平台=Facebook+TikTok', outputPreview: '方案A（实机流）：0-3s城市建设加速→3-8s战争场面→8-12s胜利奖励→12-15s CTA\n方案B（故事流）...' },
    commonFailures: ['开头没有冲击力', 'CTA 不够强', '未做竖屏适配'],
    optimizationTips: ['每套素材至少准备 3 个不同开头', '文字字幕必须加（很多人静音观看）', '同一脚本做横/竖/方三个版本'],
    versions: { lite: '3 组 15 秒脚本', advanced: '完整素材矩阵 + 多版本脚本 + 制作指南 + A/B 方案' },
    relatedTools: ['chatgpt', 'runway', 'sora'], relatedTutorials: [], relatedPrompts: ['p094', 'p106'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p108': {
    taskCategory: '产内容',
    taskDesc: '为游戏 CG 动画生成详细的分镜头脚本',
    whenToUse: 'CG 制作外包前的脚本准备、内部 CG 项目立项',
    whenNotToUse: '不需要 CG 的项目或已有完整分镜的项目',
    inputGuide: { required: '故事概要、时长、角色列表、情绪基调', optional: '美术风格参考、制作预算、配乐方向', tips: '分镜要标注景别、运镜、时长、对白/旁白' },
    exampleFull: { input: '故事=主角觉醒力量拯救同伴，时长=60秒，角色=主角+反派+同伴，基调=热血燃向', outputPreview: 'Shot 01 (远景/2s)：暴风雨中的废墟城市\nShot 02 (中景/3s)：同伴们倒在地上...' },
    commonFailures: ['分镜数量与时长不匹配', '镜头语言单一', '情绪曲线平坦'],
    optimizationTips: ['每秒约 1-2 个镜头（快节奏段）或 3-5 秒一个镜头（慢节奏段）', '用 Sora/Runway 快速预览关键镜头', '情绪曲线要有「起承转合」'],
    versions: { lite: '故事板大纲 + 关键帧描述', advanced: '完整分镜脚本 + 运镜标注 + 音效提示 + 制作注意事项' },
    relatedTools: ['claude', 'sora', 'runway'], relatedTutorials: [], relatedPrompts: ['p045'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p109': {
    taskCategory: '产内容',
    taskDesc: '为视频内容生成高点击率的封面和缩略图创意方案',
    whenToUse: 'YouTube/B站视频封面设计、广告素材封面、信息流封面',
    whenNotToUse: '已有专业设计师且封面 CTR 稳定的情况',
    inputGuide: { required: '视频内容概要、目标平台、目标受众', optional: '品牌色彩规范、参考封面、CTR 数据', tips: '封面的本质是「用一张图说清楚视频价值」' },
    exampleFull: { input: '内容=新角色评测，平台=B站，受众=二次元RPG玩家', outputPreview: '方案A：角色全身立绘+大字标题「这角色强度逆天？」+评分标签\n方案B：实战截图+对比数据...' },
    commonFailures: ['文字太多画面杂乱', '风格与平台调性不符', '封面与内容不一致导致高退出率'],
    optimizationTips: ['文字不超过 5 个字，字号要大', '人脸/角色面部是最吸引注意的元素', '每次上传 3 个封面选择最佳的'],
    versions: { lite: '3 个封面创意方案', advanced: '封面设计规范 + 多方案 + AI 生图提示词 + A/B 测试指南' },
    relatedTools: ['midjourney', 'canva-ai'], relatedTutorials: [], relatedPrompts: ['p106', 'p124'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p110': {
    taskCategory: '写方案',
    taskDesc: '设计用户深度访谈的提纲和实施方案',
    whenToUse: '产品需求验证、用户体验优化、新功能调研',
    whenNotToUse: '需要大样本量化数据而非深度洞察的情况',
    inputGuide: { required: '访谈目标、用户类型、访谈时长', optional: '已知假设、历史调研数据、招募渠道', tips: '每次访谈控制在 30-45 分钟，问题不超过 15 个' },
    exampleFull: { input: '目标=了解付费用户决策过程，用户=月付费>$50的活跃玩家，时长=40分钟', outputPreview: '暖场（5min）：游戏习惯和经历\n核心问题（25min）：\nQ1: 你第一次付费的契机是什么？...' },
    commonFailures: ['引导性提问导致数据偏差', '问题太多来不及深入', '访谈者话太多主导了对话'],
    optimizationTips: ['多用「为什么」追问深层原因', '录音并用 AI 转写分析关键词', '每 5 场访谈做一次中期分析调整提纲'],
    versions: { lite: '访谈提纲 + 10 个核心问题', advanced: '完整方案 + 招募计划 + 提纲 + 分析框架 + 报告模板' },
    relatedTools: ['claude', 'descript'], relatedTutorials: [], relatedPrompts: ['p058', 'p112'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p111': {
    taskCategory: '写方案',
    taskDesc: '设计结构化的在线问卷调查方案',
    whenToUse: '大规模用户满意度调查、需求优先级排序、市场摸底',
    whenNotToUse: '样本量不足 100 人的小范围调研',
    inputGuide: { required: '调研目标、目标受众、问卷长度限制', optional: '已有假设、发放渠道、激励方案', tips: '完成率与问卷长度成反比，控制在 5 分钟内' },
    exampleFull: { input: '目标=新功能需求优先级排序，受众=全服活跃用户，长度=15题以内', outputPreview: 'Q1 [单选] 你最期望游戏新增哪类内容？\n A. 新地图/关卡 B. 新角色 C. PVP模式...' },
    commonFailures: ['问题之间逻辑不连贯', '选项不互斥或不完整', '缺少开放式问题'],
    optimizationTips: ['先放简单题再放复杂题', '必须有一道开放式问题收集意外洞察', '数据分析前先清洗无效问卷（完成时间过短等）'],
    versions: { lite: '10 题快速问卷', advanced: '完整调研方案 + 问卷 + 跳转逻辑 + 分析框架' },
    relatedTools: ['claude'], relatedTutorials: [], relatedPrompts: ['p058', 'p110'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p112': {
    taskCategory: '写方案',
    taskDesc: '为焦点小组讨论设计引导指南和实施流程',
    whenToUse: '新概念验证、广告创意测试、品牌认知调研',
    whenNotToUse: '需要大样本统计结论而非定性洞察的场景',
    inputGuide: { required: '讨论目标、参与者人数和画像、讨论时长', optional: '讨论材料（原型/视频/图片）、场地安排、激励方案', tips: '每组 6-8 人为最佳，超过 10 人讨论难以深入' },
    exampleFull: { input: '目标=测试新游概念反应，参与者=8位目标用户，时长=90分钟', outputPreview: '引导指南：\n暖场（15min）：自我介绍+近期游戏经历\n概念展示（20min）：展示概念视频+初步反应...' },
    commonFailures: ['讨论被个别人主导', '主持人过度引导', '结论主观性太强'],
    optimizationTips: ['用匿名投票避免从众效应', '记录面部表情和肢体语言', '至少做 2-3 组交叉验证'],
    versions: { lite: '讨论大纲 + 核心问题', advanced: '完整指南 + 材料清单 + 记录模板 + 分析框架' },
    relatedTools: ['claude'], relatedTutorials: [], relatedPrompts: ['p110', 'p111'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p113': {
    taskCategory: '做分析',
    taskDesc: '对调研数据进行交叉分析，发现隐藏的用户洞察',
    whenToUse: '问卷回收后的数据分析、多维度对比分析',
    whenNotToUse: '数据量太小不具备交叉分析条件（<100份）',
    inputGuide: { required: '调研数据描述、分析维度、核心问题', optional: '原始数据文件、分析工具偏好、假设验证方向', tips: '先定假设再做分析，避免「数据钓鱼」' },
    exampleFull: { input: '数据=500份满意度问卷，维度=付费水平×满意度×留存意愿，问题=付费用户和免费用户的痛点差异', outputPreview: '交叉分析发现：\n1. 付费用户TOP1痛点=内容更新速度（42%），免费用户TOP1=广告太多（38%）...' },
    commonFailures: ['混淆相关性和因果性', '忽略样本偏差', '呈现太多无意义的交叉组合'],
    optimizationTips: ['先做描述统计再做交叉分析', '关注差异显著的交叉组合', '用可视化呈现关键发现'],
    versions: { lite: '核心交叉分析结果 + TOP3 洞察', advanced: '完整分析报告 + 交叉表 + 可视化图表 + 建议清单' },
    relatedTools: ['claude', 'deepseek'], relatedTutorials: [], relatedPrompts: ['p058', 'p055'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p114': {
    taskCategory: '产内容',
    taskDesc: '生成游戏背景音乐的需求描述文档，对接音乐团队',
    whenToUse: '音乐外包需求沟通、内部音乐团队需求下达',
    whenNotToUse: '已有音乐总监且需求沟通流程成熟',
    inputGuide: { required: '场景名称、情绪/氛围、游戏类型', optional: '参考曲目、BPM 范围、乐器偏好、时长', tips: '用情绪词+参考曲目描述比技术术语更有效' },
    exampleFull: { input: '场景=主城日间BGM，情绪=温暖平和有活力，类型=幻想RPG', outputPreview: '需求描述：\n场景: 中世纪幻想风格主城的日间场景\n情绪关键词: 温暖/安心/有活力/略带冒险期待...' },
    commonFailures: ['描述过于抽象音乐团队无法执行', '忽略音乐循环点设计', '不同场景音乐风格不统一'],
    optimizationTips: ['用 Suno 生成参考 demo 辅助沟通', '标注音乐交互需求（战斗开始渐强等）', '建立项目音乐风格指南确保一致性'],
    versions: { lite: '单曲需求描述', advanced: '完整音乐需求文档 + 风格指南 + 参考列表 + 交互需求' },
    relatedTools: ['suno', 'claude'], relatedTutorials: [], relatedPrompts: ['p115'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p115': {
    taskCategory: '产内容',
    taskDesc: '设计游戏音效的完整方案，覆盖 UI 音效到环境音',
    whenToUse: '游戏音效设计阶段、音效资源规划、外包需求准备',
    whenNotToUse: '已有完整音效库且不需要新增',
    inputGuide: { required: '音效类型范围、游戏类型、音效风格', optional: '参考游戏、音效数量预估、技术限制', tips: '按「UI/环境/角色/战斗/系统」五大类组织音效列表' },
    exampleFull: { input: '范围=UI音效+战斗音效，类型=科幻FPS，风格=未来科技感', outputPreview: '音效清单：\nUI类（15个）：\n- 按钮点击（清脆电子音）\n- 菜单滑动（轻微气流音）...' },
    commonFailures: ['音效清单不完整遗漏场景', '音效风格不统一', '未考虑音效叠加和优先级'],
    optimizationTips: ['先列完整音效清单再逐个设计', '用 ElevenLabs 生成参考音效', '测试音效在不同设备上的表现'],
    versions: { lite: '音效清单 + 风格描述', advanced: '完整音效设计方案 + 资源清单 + 技术规格 + 优先级排序' },
    relatedTools: ['elevenlabs', 'claude'], relatedTutorials: [], relatedPrompts: ['p114'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p116': {
    taskCategory: '写方案',
    taskDesc: '策划游戏相关的播客或音频节目方案',
    whenToUse: '品牌内容矩阵拓展、游戏开发幕后分享、社区互动',
    whenNotToUse: '团队缺少持续产出音频内容的能力和意愿',
    inputGuide: { required: '节目定位、目标受众、更新频率、时长', optional: '嘉宾资源、录制设备、分发渠道', tips: '播客的核心是「持续性」，不如不做也别虎头蛇尾' },
    exampleFull: { input: '定位=游戏幕后开发故事，受众=核心玩家+游戏从业者，频率=双周，时长=30分钟', outputPreview: '节目名：「代码与像素」\n固定环节：开发周记(5min)+深度话题(20min)+Q&A(5min)...' },
    commonFailures: ['内容过于自我表达缺少听众视角', '更新频率不稳定', '录制质量差'],
    optimizationTips: ['用 Descript 做后期剪辑和降噪', '每期准备 3 倍于时长的素材', '前 10 期定好模板形成听众预期'],
    versions: { lite: '节目大纲 + 前 5 期选题', advanced: '完整策划书 + 节目模板 + 嘉宾邀请函 + 分发策略' },
    relatedTools: ['descript', 'claude'], relatedTutorials: [], relatedPrompts: ['p048'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p117': {
    taskCategory: '写方案',
    taskDesc: '生成结构化的项目复盘报告，沉淀经验教训',
    whenToUse: '项目完成后复盘、大版本上线后回顾、问题事后分析',
    whenNotToUse: '项目仍在进行中不适合全面复盘',
    inputGuide: { required: '项目名称、项目周期、核心成果、遇到的问题', optional: '原始目标/OKR、团队反馈、数据指标', tips: '复盘重点是「下次如何做得更好」而非「追责」' },
    exampleFull: { input: '项目=2.0版本开发，周期=3个月，成果=按时上线DAU增长20%，问题=后端延期2周/3个P0 Bug', outputPreview: '复盘报告：\n目标达成度：✅ 按时上线 ✅ DAU+20% ⚠️ Bug率偏高\n核心发现：...' },
    commonFailures: ['只说好的不提问题', '复盘结论太笼统不可执行', '缺少后续跟踪机制'],
    optimizationTips: ['用「继续做/停止做/开始做」框架总结', '每条改进措施指定责任人和完成日期', '下次项目启动时回顾上次复盘'],
    versions: { lite: '核心发现 + 改进清单', advanced: '完整复盘报告 + 时间线 + 数据分析 + 改进计划 + 跟踪机制' },
    relatedTools: ['claude', 'notion-ai'], relatedTutorials: [], relatedPrompts: ['p092', 'p118'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p118': {
    taskCategory: '写方案',
    taskDesc: '生成季度 OKR/KPI 总结报告，清晰展示目标达成情况',
    whenToUse: '季度末汇报、绩效评估准备、团队目标对齐',
    whenNotToUse: '不使用 OKR/KPI 管理体系的团队',
    inputGuide: { required: 'OKR/KPI 列表及完成数据、汇报周期、受众', optional: '超额/未达标原因分析、下季度目标草案', tips: '数据+故事结合，让报告既有说服力又有可读性' },
    exampleFull: { input: 'O1=提升用户留存(KR:7留30%→35%), O2=提升ARPU(KR:$12→$15), 周期=Q1', outputPreview: 'Q1 OKR 总结：\nO1: 提升用户留存 — 完成度 80%\n  KR1: 7日留存 30%→33%（目标35%，差2pp）...' },
    commonFailures: ['只列数据不分析原因', '未区分外部因素和内部努力', '下季度目标与复盘结论脱节'],
    optimizationTips: ['红绿灯标注各 KR 状态一目了然', '每个未达标 KR 给出「根因+改善措施」', '下季度目标从复盘中自然推导'],
    versions: { lite: 'OKR 完成度概览', advanced: '完整季度报告 + 趋势分析 + 根因分析 + 下季目标建议' },
    relatedTools: ['claude', 'notion-ai'], relatedTutorials: [], relatedPrompts: ['p117', 'p120'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p119': {
    taskCategory: '产内容',
    taskDesc: '生成产品路演或内部提案的 PPT 结构和内容大纲',
    whenToUse: '投资人路演、内部立项提案、跨部门需求宣讲',
    whenNotToUse: '已有标准化提案模板且内容已确定',
    inputGuide: { required: '提案目标、受众、核心论点、演讲时长', optional: '数据支撑、演示 demo、设计风格偏好', tips: '10 分钟路演不超过 15 页PPT，每页一个核心信息' },
    exampleFull: { input: '目标=新游戏立项提案，受众=公司管理层，论点=市场机会+团队能力+商业预期，时长=15分钟', outputPreview: 'PPT 结构：\n1. 开场Hook：市场机会数据（1页）\n2. 产品定位与核心卖点（2页）...' },
    commonFailures: ['信息过载每页内容太多', '逻辑线不清晰', '缺少有力的开场和结尾'],
    optimizationTips: ['用 Gamma 快速生成 PPT 初版', '每页 PPT 用「一句话测试」——能否一句话说清这页要传达什么', '准备 Q&A 预案'],
    versions: { lite: 'PPT 大纲 + 每页标题', advanced: '完整 PPT 内容 + 演讲者注释 + Q&A 预案 + 设计建议' },
    relatedTools: ['gamma', 'claude'], relatedTutorials: [], relatedPrompts: ['p120'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p120': {
    taskCategory: '产内容',
    taskDesc: '将复杂信息浓缩为管理层可快速阅读的汇报摘要',
    whenToUse: '向上汇报、跨部门沟通、需要高管决策的事项',
    whenNotToUse: '面向执行团队需要详细信息的场景',
    inputGuide: { required: '原始内容/数据、汇报目的、受众（谁需要做什么决策）', optional: '历史汇报模板、时间限制、关注重点', tips: '管理层汇报的核心公式：结论先行+数据支撑+行动建议' },
    exampleFull: { input: '内容=本月运营数据（DAU/留存/收入/投放），目的=月度review，受众=VP', outputPreview: '摘要：\n✅ 核心结论：本月收入目标达成103%，但新用户留存下降需关注\n📊 关键指标：...' },
    commonFailures: ['细节太多管理层没时间看', '缺少明确结论和建议', '数据没有与目标对比'],
    optimizationTips: ['摘要控制在 1 页以内', '用「红绿灯」标注各指标状态', '明确需要管理层做的决策是什么'],
    versions: { lite: '一页摘要', advanced: '摘要 + 附录详细数据 + 决策建议 + 后续跟进项' },
    relatedTools: ['claude', 'notion-ai'], relatedTutorials: [], relatedPrompts: ['p118', 'p119'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p121': {
    taskCategory: '产内容',
    taskDesc: '为游戏 UI 元素和图标生成 AI 绘图提示词',
    whenToUse: 'UI 设计灵感探索、图标批量生成、快速原型',
    whenNotToUse: '已有成熟的 UI 设计系统和图标库',
    inputGuide: { required: 'UI 元素类型、游戏风格、色彩方案', optional: '现有 UI 参考、技术限制（分辨率/格式）', tips: '提示词要指定「icon, flat design, game UI, transparent background」等关键词' },
    exampleFull: { input: '类型=RPG技能图标×20，风格=魔幻写实，色彩=深色底+金色边框', outputPreview: '提示词模板：\n「game skill icon, {技能名}, dark fantasy style, golden border, transparent background, highly detailed, 512x512」\n示例：fire ball spell icon...' },
    commonFailures: ['提示词太模糊效果不稳定', '生成的图标风格不统一', '分辨率不满足要求'],
    optimizationTips: ['建立统一的提示词模板确保风格一致', '用 Midjourney 的 --style 参数锁定风格', '批量生成后人工筛选+精修'],
    versions: { lite: '提示词模板 + 5 个示例', advanced: '完整UI提示词库 + 风格指南 + 批量生产流程' },
    relatedTools: ['midjourney', 'stable-diffusion'], relatedTutorials: [], relatedPrompts: ['p122', 'p123'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p122': {
    taskCategory: '产内容',
    taskDesc: '为游戏角色立绘生成详细的 AI 绘图描述和提示词',
    whenToUse: '角色概念设计阶段、美术方向探索、快速迭代',
    whenNotToUse: '需要高度精确控制的最终商用立绘',
    inputGuide: { required: '角色设定信息、画风方向、用途（概念/正式）', optional: '参考图、姿势/构图偏好、情绪表达', tips: '分「面部特写」和「全身立绘」两种提示词模板' },
    exampleFull: { input: '角色=冰系女法师/银白长发/优雅高冷，画风=二次元半写实，用途=概念探索', outputPreview: '全身立绘提示词：\n「1girl, ice mage, silver-white long hair, elegant cold expression, blue and white robe with frost patterns...」' },
    commonFailures: ['提示词缺少关键细节（服装/配饰）', '面部特征描述不够具体', '多次生成风格不一致'],
    optimizationTips: ['用 --seed 参数锁定角色特征', '分层描述：面部→服装→姿势→背景→氛围', '在 Midjourney 中用 /describe 反向学习提示词'],
    versions: { lite: '单角色提示词（全身+面部）', advanced: '角色提示词矩阵 + 多姿势/表情 + 风格变体 + 生产指南' },
    relatedTools: ['midjourney', 'stable-diffusion'], relatedTutorials: [], relatedPrompts: ['p071', 'p121'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p123': {
    taskCategory: '产内容',
    taskDesc: '为游戏场景概念图生成 AI 绘图提示词',
    whenToUse: '场景概念设计、世界观视觉化、环境美术参考',
    whenNotToUse: '需要精确尺寸和建筑细节的正式场景设计',
    inputGuide: { required: '场景描述、氛围/光影、游戏风格', optional: '参考图、时间/天气、特殊元素', tips: '场景提示词核心：构图+光影+氛围+建筑风格+细节元素' },
    exampleFull: { input: '场景=末日城市废墟，氛围=黄昏荒凉，风格=写实', outputPreview: '提示词：「post-apocalyptic ruined city, golden hour sunlight, overgrown vegetation, crumbling skyscrapers, dusty atmosphere...」' },
    commonFailures: ['缺少光影描述导致氛围平淡', '比例和透视问题', '细节元素不够丰富'],
    optimizationTips: ['用「远景/中景/近景」分层描述场景', '光影方向决定画面氛围', '加入叙事性元素（如废弃车辆/涂鸦）增加故事感'],
    versions: { lite: '单场景 3 个变体提示词', advanced: '场景提示词库 + 光影/天气变体 + 全套世界观场景' },
    relatedTools: ['midjourney', 'stable-diffusion'], relatedTutorials: [], relatedPrompts: ['p070', 'p121'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p124': {
    taskCategory: '产内容',
    taskDesc: '为营销海报和主视觉(KV)设计生成 AI 绘图提示词',
    whenToUse: '营销素材制作、活动海报设计、社媒视觉内容',
    whenNotToUse: '需要严格品牌规范的正式海报（需设计师把控）',
    inputGuide: { required: '海报主题、尺寸/比例、核心元素', optional: '品牌色彩、文字布局预留、参考海报', tips: '营销海报要为文字预留空间，不能让画面太满' },
    exampleFull: { input: '主题=春节限定活动，尺寸=16:9横版，元素=游戏角色+烟花+红色喜庆', outputPreview: '提示词：「game promotional poster, Chinese New Year theme, anime character in festive red costume, fireworks in background, warm golden lighting...」' },
    commonFailures: ['画面太满没有放文字的空间', '风格与品牌调性不符', '元素过多导致杂乱'],
    optimizationTips: ['明确标注 negative prompt 排除不需要的元素', '用 --ar 参数控制精确比例', '留出画面 1/3 区域作为文字区'],
    versions: { lite: '单张海报提示词', advanced: '海报系列提示词 + 尺寸变体 + 品牌风格指南' },
    relatedTools: ['midjourney', 'canva-ai'], relatedTutorials: [], relatedPrompts: ['p109', 'p125'], relatedPaths: [], lastUpdated: '2025-06-10'
  },
  'p125': {
    taskCategory: '写方案',
    taskDesc: '制定社交媒体配图的视觉风格指南，确保品牌视觉一致性',
    whenToUse: '社媒视觉体系建设、多人运营团队风格对齐',
    whenNotToUse: '社媒运营刚起步还没有确定品牌方向',
    inputGuide: { required: '品牌/游戏名称、核心平台、品牌色彩', optional: '现有视觉素材、竞品视觉参考、设计团队情况', tips: '风格指南要具体到「可以做/不能做」的示例' },
    exampleFull: { input: '品牌=幻想大陆，平台=微博+B站+小红书，色彩=蓝紫色系', outputPreview: '风格指南：\n色彩规范：主色#5B4FCF，辅色#8B7FE0，强调色#FFD700\n字体：标题=思源黑体Bold...' },
    commonFailures: ['规范太笼统无法执行', '没有「反面示例」', '不同平台没有差异化'],
    optimizationTips: ['提供模板文件（PSD/Figma）降低执行门槛', '标注各平台的尺寸和安全区', '每月更新一次风格库'],
    versions: { lite: '核心视觉规范（色彩/字体/排版）', advanced: '完整风格手册 + 模板库 + 平台适配 + Do/Don\'t 示例' },
    relatedTools: ['canva-ai', 'figma-ai'], relatedTutorials: [], relatedPrompts: ['p124', 'p109'], relatedPaths: [], lastUpdated: '2025-06-10'
  }
};

// ========== 执行升级 ==========
console.log('===== Batch-10 内容升级 =====\n');

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

console.log('\n--- 验证 ---');
const verified = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
const upgraded = verified.filter(p => !!p.taskCategory).length;
console.log(`Prompt：${upgraded}/${verified.length} 已升级 (${(upgraded/verified.length*100).toFixed(1)}%)`);
console.log(`\n✅ Batch-10 数据更新完成`);
