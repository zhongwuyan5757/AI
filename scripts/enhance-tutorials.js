#!/usr/bin/env node
/**
 * 为 tutorials.json 中的每个教程添加增强字段：
 * solves, outcome, fitLevel, fitRoles, nextGuides, relatedPath
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// 岗位ID → 中文名映射
const JOB_MAP = {
  'all': '全岗位',
  'graphic-designer': '设计师',
  'brand-manager': '品牌经理',
  'product-planner': '策划',
  'product-ops': '运营',
  'publishing-manager': '发行',
  'ad-manager': '投放',
  'video-designer': '视频制作',
  'new-media': '新媒体',
  'numerical-planner': '数值策划'
};

// 每个教程的增强数据
const ENHANCEMENTS = {
  t001: { solves: '快速掌握最强通用AI对话工具', outcome: '一套ChatGPT高效使用方法和Prompt模板', fitLevel: '零基础可开始', nextGuides: ['t002', 't004'], relatedPath: '7天AI入门之旅' },
  t002: { solves: '掌握长文档分析和深度推理最强工具', outcome: '一套Claude高效使用方法和Projects知识库', fitLevel: '零基础可开始', nextGuides: ['t001', 't004'], relatedPath: '7天AI入门之旅' },
  t003: { solves: '用AI搜索引擎快速完成市场调研', outcome: '一套高效AI调研方法和工作流', fitLevel: '零基础可开始', nextGuides: ['t015', 't010'], relatedPath: '7天AI入门之旅' },
  t004: { solves: '让AI输出质量翻倍的进阶Prompt技巧', outcome: '一套可复用的高级Prompt模板库', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t048', 't028'], relatedPath: '5天AI效率提升' },
  t005: { solves: '用AI快速生成游戏概念图和美术素材', outcome: '一套Midjourney游戏美术生成工作流', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t006', 't071'], relatedPath: '5天AI效率提升' },
  t006: { solves: '搭建本地AI图片生成流水线', outcome: '一条可批量生产的ComfyUI美术流水线', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t071', 't038'], relatedPath: 'AI进阶工作流' },
  t007: { solves: '用AI快速制作游戏宣传视频', outcome: '一条AI视频制作全流程和工具选型方案', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t032', 't034'], relatedPath: '5天AI效率提升' },
  t008: { solves: '快速产出高转化率的广告文案', outcome: '一套高转化广告文案模板和迭代方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t047', 't049'], relatedPath: '5天AI效率提升' },
  t009: { solves: '用AI加速游戏活动策划全流程', outcome: '一份完整的AI辅助活动策划方案', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t046', 't097'], relatedPath: '5天AI效率提升' },
  t010: { solves: '快速完成海外市场调研和分析', outcome: '一份结构化的海外市场调研报告', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t077', 't027'], relatedPath: '5天AI效率提升' },
  t011: { solves: '用AI辅助游戏数值设计和平衡验证', outcome: '一套数值策划AI辅助工作方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t073', 't016'], relatedPath: '5天AI效率提升' },
  t012: { solves: '搭建高效的AI内容批量生产体系', outcome: '一套新媒体AI内容工厂工作流', fitLevel: '想搭建系统工作流的进阶用户', nextGuides: ['t049', 't037'], relatedPath: 'AI进阶工作流' },
  t013: { solves: '用AI高效撰写专业产品需求文档', outcome: '一份完整的AI辅助PRD文档', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t050', 't083'], relatedPath: '5天AI效率提升' },
  t014: { solves: '了解AI工具安全使用规范和注意事项', outcome: '一套AI工具安全使用清单', fitLevel: '零基础可开始', nextGuides: ['t079', 't001'], relatedPath: '7天AI入门之旅' },
  t015: { solves: '用AI系统化分析竞品优劣势', outcome: '一份完整的AI辅助竞品分析报告', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t040', 't074'], relatedPath: '5天AI效率提升' },
  t016: { solves: '用AI自动生成数据分析报告', outcome: '一套自动化数据报告生成流程', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t064', 't063'], relatedPath: '5天AI效率提升' },
  t017: { solves: '理解AI Agent概念并搭建第一个Agent', outcome: '一个可运行的AI Agent原型', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t092', 't037'], relatedPath: 'AI进阶工作流' },
  t018: { solves: '零基础快速制作专业设计素材', outcome: '一套Canva AI快速设计工作方法', fitLevel: '零基础可开始', nextGuides: ['t025', 't044'], relatedPath: '7天AI入门之旅' },
  t019: { solves: '用Google最新AI模型生成高质量图片', outcome: '一套Imagen图片生成实操方法', fitLevel: '零基础可开始', nextGuides: ['t005', 't044'], relatedPath: '7天AI入门之旅' },
  t020: { solves: '掌握Google最强AI模型的深度用法', outcome: '一套Gemini高效使用方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t042', 't067'], relatedPath: '5天AI效率提升' },
  t021: { solves: '掌握国产开源AI模型的实战用法', outcome: '一套国产AI模型选型和使用指南', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t080', 't067'], relatedPath: '5天AI效率提升' },
  t022: { solves: '用AI快速消化和总结研究资料', outcome: '一套NotebookLM研究助手使用方法', fitLevel: '零基础可开始', nextGuides: ['t003', 't023'], relatedPath: '7天AI入门之旅' },
  t023: { solves: '掌握AI搜索引擎的深度使用技巧', outcome: '一套Perplexity深度搜索方法论', fitLevel: '零基础可开始', nextGuides: ['t003', 't074'], relatedPath: '7天AI入门之旅' },
  t024: { solves: '用AI实现专业级配音和声音克隆', outcome: '一条AI配音制作全流程', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t035', 't036'], relatedPath: '5天AI效率提升' },
  t025: { solves: '零基础快速上手Canva AI设计', outcome: '一套Canva AI快速设计技能', fitLevel: '零基础可开始', nextGuides: ['t018', 't044'], relatedPath: '7天AI入门之旅' },
  t026: { solves: '用AI一键生成专业演示文稿', outcome: '一份AI生成的专业PPT', fitLevel: '零基础可开始', nextGuides: ['t070', 't087'], relatedPath: '7天AI入门之旅' },
  t027: { solves: '用AI高效完成多语言翻译和本地化', outcome: '一套AI翻译与本地化工作流', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t077', 't010'], relatedPath: '5天AI效率提升' },
  t028: { solves: '掌握全场景AI文案写作技巧', outcome: '一套覆盖多场景的AI文案模板', fitLevel: '已有基础Prompt技巧的用户', nextGuides: ['t008', 't061'], relatedPath: '5天AI效率提升' },
  t029: { solves: '快速上手国产AI对话工具豆包', outcome: '一套豆包AI高效使用方法', fitLevel: '零基础可开始', nextGuides: ['t001', 't021'], relatedPath: '7天AI入门之旅' },
  t030: { solves: '用AI把Excel数据变成可执行洞察', outcome: '一套AI数据分析入门方法', fitLevel: '零基础可开始', nextGuides: ['t016', 't063'], relatedPath: '7天AI入门之旅' },
  t031: { solves: '让Midjourney出图从"能看"到"精品"', outcome: '一套Midjourney精品出图技巧', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t005', 't071'], relatedPath: '5天AI效率提升' },
  t032: { solves: '用Sora生成电影级AI视频', outcome: '一条Sora视频制作实操流程', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t034', 't033'], relatedPath: '5天AI效率提升' },
  t033: { solves: '用Runway实现专业级视频特效', outcome: '一套Runway视频特效制作方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t032', 't034'], relatedPath: '5天AI效率提升' },
  t034: { solves: '用可灵低成本制作高质量AI视频', outcome: '一条可灵AI视频制作全流程', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t007', 't096'], relatedPath: '5天AI效率提升' },
  t035: { solves: '用AI创建逼真数字人视频', outcome: '一条数字人视频制作工作流', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t024', 't007'], relatedPath: '5天AI效率提升' },
  t036: { solves: '用AI创作游戏音乐和音效', outcome: '一套AI音乐音效创作方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t024', 't007'], relatedPath: '5天AI效率提升' },
  t037: { solves: '搭建无代码AI自动化工作流', outcome: '一个可运行的n8n自动化工作流', fitLevel: '想搭建系统工作流的进阶用户', nextGuides: ['t092', 't017'], relatedPath: 'AI进阶工作流' },
  t038: { solves: '将AI融入Photoshop设计工作流', outcome: '一套AI+PS高效设计工作方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t005', 't071'], relatedPath: '5天AI效率提升' },
  t039: { solves: '用AI辅助创作游戏剧情和角色文案', outcome: '一套AI辅助游戏文案创作方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t028', 't013'], relatedPath: '5天AI效率提升' },
  t040: { solves: '用AI系统化完成竞品分析全流程', outcome: '一份完整的竞品分析报告和方法论', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t015', 't074'], relatedPath: '5天AI效率提升' },
  t041: { solves: '用AI深度挖掘用户画像和需求洞察', outcome: '一份用户画像分析报告', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t082', 't065'], relatedPath: '5天AI效率提升' },
  t042: { solves: '掌握Google Gemini 2.5 Pro核心能力', outcome: '一套Gemini深度使用方法', fitLevel: '零基础可开始', nextGuides: ['t020', 't001'], relatedPath: '7天AI入门之旅' },
  t043: { solves: '用Grok获取实时信息和热点趋势', outcome: '一套Grok实时信息使用方法', fitLevel: '零基础可开始', nextGuides: ['t023', 't088'], relatedPath: '7天AI入门之旅' },
  t044: { solves: '用AI生成带精准文字的设计素材', outcome: '一套AI文字设计实操技巧', fitLevel: '已有基础Prompt技巧的用户', nextGuides: ['t025', 't005'], relatedPath: '5天AI效率提升' },
  t045: { solves: '用AI快速剪辑制作短视频', outcome: '一套剪映AI剪辑工作方法', fitLevel: '零基础可开始', nextGuides: ['t034', 't096'], relatedPath: '7天AI入门之旅' },
  t046: { solves: '用AI辅助策划完整的游戏活动方案', outcome: '一份AI辅助的完整活动策划案', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t009', 't097'], relatedPath: '5天AI效率提升' },
  t047: { solves: '用AI优化广告投放素材提升ROI', outcome: '一套广告素材AI优化方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t008', 't076'], relatedPath: '5天AI效率提升' },
  t048: { solves: '掌握高级Prompt工程技术', outcome: '一套高级Prompt工程方法论', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t067', 't092'], relatedPath: 'AI进阶工作流' },
  t049: { solves: '用AI系统化运营社交媒体', outcome: '一套社交媒体AI运营全攻略', fitLevel: '已有基础Prompt技巧的用户', nextGuides: ['t084', 't085'], relatedPath: '5天AI效率提升' },
  t050: { solves: '用AI高效撰写标准化PRD文档', outcome: '一份完整的AI辅助PRD', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t013', 't083'], relatedPath: '5天AI效率提升' },
  t051: { solves: '用AI快速生成专业会议纪要', outcome: '一套AI会议纪要生成工作流', fitLevel: '零基础可开始', nextGuides: ['t089', 't075'], relatedPath: '7天AI入门之旅' },
  t052: { solves: '用AI辅助团队知识管理', outcome: '一套AI知识库搭建方案', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t093', 't022'], relatedPath: '5天AI效率提升' },
  t053: { solves: '用AI快速制作信息图表', outcome: '一套AI信息图表制作方法', fitLevel: '零基础可开始', nextGuides: ['t064', 't026'], relatedPath: '7天AI入门之旅' },
  t054: { solves: '用AI深度分析用户评价和口碑', outcome: '一份用户口碑分析报告', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t041', 't090'], relatedPath: '5天AI效率提升' },
  t055: { solves: '用AI辅助游戏版本更新公告撰写', outcome: '一套版本公告AI撰写模板', fitLevel: '已有基础Prompt技巧的用户', nextGuides: ['t039', 't028'], relatedPath: '5天AI效率提升' },
  t056: { solves: '用AI辅助游戏教程和新手引导设计', outcome: '一套AI辅助新手引导设计方案', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t081', 't039'], relatedPath: '5天AI效率提升' },
  t057: { solves: '用Google最新Imagen 4生成高质量素材', outcome: '一套Imagen 4图片生成方法', fitLevel: '零基础可开始', nextGuides: ['t019', 't005'], relatedPath: '7天AI入门之旅' },
  t058: { solves: '用AI批量生成游戏图标和UI素材', outcome: '一条AI图标批量生成流水线', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t071', 't006'], relatedPath: '5天AI效率提升' },
  t059: { solves: '用AI辅助搭建品牌视觉识别体系', outcome: '一套品牌视觉指南文档', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t038', 't005'], relatedPath: '5天AI效率提升' },
  t060: { solves: '用AI优化应用商店展示提升下载转化', outcome: '一套ASO优化方案和关键词策略', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t047', 't077'], relatedPath: '5天AI效率提升' },
  t061: { solves: '用AI快速编写爆款短视频脚本', outcome: '一批可直接拍摄的短视频脚本', fitLevel: '已有基础Prompt技巧的用户', nextGuides: ['t076', 't049'], relatedPath: '5天AI效率提升' },
  t062: { solves: '用AI搭建智能客服自动化系统', outcome: '一套AI客服自动化方案', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t037', 't092'], relatedPath: 'AI进阶工作流' },
  t063: { solves: '用自然语言生成SQL查询提取数据', outcome: '一套AI辅助SQL查询方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t016', 't064'], relatedPath: '5天AI效率提升' },
  t064: { solves: '用AI快速将数据转化为专业图表', outcome: '一套AI数据可视化工作方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t016', 't053'], relatedPath: '5天AI效率提升' },
  t065: { solves: '用AI进行用户分群和精准推送', outcome: '一套AI用户分层推送方案', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t066', 't091'], relatedPath: 'AI进阶工作流' },
  t066: { solves: '用AI科学设计A/B测试方案', outcome: '一套AI辅助A/B测试设计方法', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t091', 't065'], relatedPath: 'AI进阶工作流' },
  t067: { solves: '让多个AI模型协同发挥最大价值', outcome: '一套多AI模型协同使用策略', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t080', 't092'], relatedPath: 'AI进阶工作流' },
  t068: { solves: '用AI快速撰写和回复商务邮件', outcome: '一套AI邮件沟通模板', fitLevel: '零基础可开始', nextGuides: ['t089', 't028'], relatedPath: '7天AI入门之旅' },
  t069: { solves: '零代码用AI开发完整Web应用', outcome: '一个AI生成的可运行Web应用', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t078', 't037'], relatedPath: 'AI进阶工作流' },
  t070: { solves: '用AI高效准备演讲和PPT', outcome: '一套完整的演讲PPT和讲稿', fitLevel: '零基础可开始', nextGuides: ['t026', 't087'], relatedPath: '7天AI入门之旅' },
  t071: { solves: '建立AI角色设计标准流水线', outcome: '一套从设定到多视图的角色设计流程', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t072', 't058'], relatedPath: '5天AI效率提升' },
  t072: { solves: '用AI生成游戏场景概念和环境设计', outcome: '一批游戏场景概念图和设计方案', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t071', 't006'], relatedPath: '5天AI效率提升' },
  t073: { solves: '用AI进行游戏数值设计和平衡验证', outcome: '一套AI辅助数值策划工作方法', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t011', 't066'], relatedPath: 'AI进阶工作流' },
  t074: { solves: '用AI快速完成市场调研全流程', outcome: '一份完整的AI辅助市场调研报告', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t010', 't040'], relatedPath: '5天AI效率提升' },
  t075: { solves: '用AI提升项目管理和任务协调效率', outcome: '一套AI辅助项目管理方法', fitLevel: '零基础可开始', nextGuides: ['t089', 't083'], relatedPath: '7天AI入门之旅' },
  t076: { solves: '用AI快速生成营销短视频脚本', outcome: '一批可直接使用的营销视频脚本', fitLevel: '已有基础Prompt技巧的用户', nextGuides: ['t061', 't047'], relatedPath: '5天AI效率提升' },
  t077: { solves: '用AI制定完整的游戏出海策略', outcome: '一份游戏出海策略方案', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t010', 't027'], relatedPath: 'AI进阶工作流' },
  t078: { solves: '用AI编写工作中常用的自动化脚本', outcome: '一套可复用的自动化脚本', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t037', 't069'], relatedPath: 'AI进阶工作流' },
  t079: { solves: '建立企业AI使用安全规范体系', outcome: '一套企业AI安全合规管理方案', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t014', 't100'], relatedPath: 'AI进阶工作流' },
  t080: { solves: '科学选择最适合的AI模型', outcome: '一套AI模型选型决策框架', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t067', 't099'], relatedPath: 'AI进阶工作流' },
  t081: { solves: '用AI分析和优化游戏界面体验', outcome: '一份游戏UI/UX评审报告和优化建议', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t098', 't056'], relatedPath: '5天AI效率提升' },
  t082: { solves: '用AI设计科学的用户调研问卷', outcome: '一份专业的用户调研问卷', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t041', 't054'], relatedPath: '5天AI效率提升' },
  t083: { solves: '用AI辅助制定产品路线图', outcome: '一份产品路线图和版本规划', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t013', 't050'], relatedPath: 'AI进阶工作流' },
  t084: { solves: '用AI制定SEO内容策略提升流量', outcome: '一套SEO内容策略和执行方案', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t049', 't060'], relatedPath: '5天AI效率提升' },
  t085: { solves: '用AI辅助游戏直播运营和互动', outcome: '一套直播运营AI辅助方案', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t049', 't061'], relatedPath: '5天AI效率提升' },
  t086: { solves: '用AI辅助审阅和起草商务合同', outcome: '一套AI合同审阅工作方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t068', 't028'], relatedPath: '5天AI效率提升' },
  t087: { solves: '用AI快速制作内部培训课件', outcome: '一套完整的培训课件和测验', fitLevel: '零基础可开始', nextGuides: ['t026', 't070'], relatedPath: '7天AI入门之旅' },
  t088: { solves: '搭建AI自动化行业情报收集系统', outcome: '一套行业情报自动监控方案', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t037', 't015'], relatedPath: 'AI进阶工作流' },
  t089: { solves: '用AI打通跨部门协作沟通壁垒', outcome: '一套跨部门AI协作工作方法', fitLevel: '零基础可开始', nextGuides: ['t075', 't051'], relatedPath: '7天AI入门之旅' },
  t090: { solves: '用AI快速应对游戏危机事件', outcome: '一套危机公关AI响应方案', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t054', 't049'], relatedPath: 'AI进阶工作流' },
  t091: { solves: '用AI进行数据预测和趋势分析', outcome: '一套AI预测分析方法和模型', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t066', 't073'], relatedPath: 'AI进阶工作流' },
  t092: { solves: '搭建智能AI工作助手自动处理任务', outcome: '一个可运行的AI Agent工作流', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t017', 't037'], relatedPath: 'AI进阶工作流' },
  t093: { solves: '搭建企业级AI知识库系统', outcome: '一套RAG知识库搭建方案', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t092', 't052'], relatedPath: 'AI进阶工作流' },
  t094: { solves: '用AI提升招聘筛选和面试效率', outcome: '一套AI辅助招聘工作方法', fitLevel: '已有基础Prompt技巧的用户', nextGuides: ['t028', 't082'], relatedPath: '5天AI效率提升' },
  t095: { solves: '用AI高效完成年度总结和规划', outcome: '一份完整的年度总结和规划文档', fitLevel: '零基础可开始', nextGuides: ['t075', 't026'], relatedPath: '7天AI入门之旅' },
  t096: { solves: '用Pika创作趣味短视频特效', outcome: '一套Pika视频特效制作方法', fitLevel: '已有基础Prompt技巧的用户', nextGuides: ['t034', 't045'], relatedPath: '5天AI效率提升' },
  t097: { solves: '用AI系统化复盘游戏活动效果', outcome: '一份活动复盘分析报告', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t009', 't046'], relatedPath: '5天AI效率提升' },
  t098: { solves: '用AI快速制作产品原型和设计稿', outcome: '一套AI快速原型制作方法', fitLevel: '已有基础AI工具使用经验', nextGuides: ['t081', 't069'], relatedPath: '5天AI效率提升' },
  t099: { solves: '科学评测对比不同AI工具的效果', outcome: '一套AI工具评测方法论', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t080', 't067'], relatedPath: 'AI进阶工作流' },
  t100: { solves: '将AI从个人工具升级为组织能力', outcome: '一套团队AI赋能方案和培训计划', fitLevel: '有一定AI实战经验的进阶用户', nextGuides: ['t079', 't092'], relatedPath: 'AI进阶工作流' }
};

// 处理每个教程
let updated = 0;
tutorials.forEach(t => {
  const enhance = ENHANCEMENTS[t.id];
  if (enhance) {
    t.solves = enhance.solves;
    t.outcome = enhance.outcome;
    t.fitLevel = enhance.fitLevel;
    t.nextGuides = enhance.nextGuides;
    t.relatedPath = enhance.relatedPath;
    // 生成 fitRoles
    if (t.targetJobs.includes('all')) {
      t.fitRoles = ['全岗位'];
    } else {
      t.fitRoles = t.targetJobs.map(id => JOB_MAP[id] || id).filter(Boolean);
    }
    updated++;
  }
});

fs.writeFileSync(FILE, JSON.stringify(tutorials, null, 2), 'utf-8');
console.log(`✅ 已更新 ${updated} / ${tutorials.length} 篇教程的增强字段`);
