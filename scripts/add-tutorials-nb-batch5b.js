#!/usr/bin/env node
/**
 * Batch 5b: 专业流水线 t-nb-26, t-nb-27
 */
const fs = require('fs');
const path = require('path');

const tutorialsPath = path.join(__dirname, '..', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

const newTutorials = [
  {
    "id": "t-nb-26",
    "title": "素材资产管理：团队级视觉素材库建设",
    "desc": "建立团队共享的AI视觉素材管理体系，包括素材分类、标签系统、搜索复用和提示词知识库",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "35分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "📂",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 26,
    "prerequisite": ["t-nb-02", "t-nb-24"],
    "content": [
      {
        "title": "为什么需要素材资产管理",
        "body": "<p>团队使用 AI 出图一段时间后，会遇到以下问题：</p><ul><li><strong>找不到之前的好图</strong>：「上周那张海报在哪？」→ 翻遍文件夹找不到</li><li><strong>重复生成</strong>：同样的需求不同人各做一遍，浪费时间</li><li><strong>提示词丢失</strong>：效果好的提示词没有保存，下次想复用找不到</li><li><strong>素材散落</strong>：微信群、邮件、本地文件夹，素材分散在各处</li></ul><p>解决方案：建立团队级的<strong>AI 视觉素材库</strong>——统一存储、统一标签、统一搜索。</p><p><strong>素材库的核心价值</strong>：让团队任何人都能在 30 秒内找到需要的素材或提示词。</p>",
        "tip": "素材库不需要专业的 DAM 系统——飞书文档/Notion + 规范的文件夹命名就能解决 80% 的问题"
      },
      {
        "title": "素材分类体系设计",
        "body": "<p>建立清晰的分类体系，让素材井井有条：</p><p><strong>一级分类（按用途）</strong>：</p><ul><li>投放素材 / 社媒配图 / 活动物料 / 品牌素材 / 角色资产 / 场景资产</li></ul><p><strong>二级分类（按项目/活动）</strong>：</p><ul><li>投放素材 → 新角色投放 / 版本更新投放 / 常规买量</li><li>活动物料 → 春节活动 / 周年庆 / 联动活动</li></ul><p><strong>三级分类（按状态）</strong>：</p><ul><li>待审核 / 已审核-可用 / 已发布 / 已淘汰</li></ul><p><strong>文件夹命名规范</strong>：</p><ul><li><code>/素材库/[一级分类]/[项目名_日期]/[分级_序号_描述].png</code></li><li>例如：<code>/素材库/投放素材/月华上线_20260310/A_01_角色特写赛博风.png</code></li></ul>",
        "tip": "分类不要太细（3 级足够）——太细的分类反而增加管理成本，降低使用效率"
      },
      {
        "title": "标签系统：让每张素材可搜索",
        "body": "<p>标签是素材搜索和复用的关键：</p><p><strong>标签维度</strong>：</p><ul><li><strong>风格标签</strong>：赛博朋克 / 日系 / 国潮 / 写实 / 像素</li><li><strong>用途标签</strong>：投放 / 社媒 / 海报 / 配图 / 品牌</li><li><strong>平台标签</strong>：微博 / 小红书 / 抖音 / 公众号</li><li><strong>角色标签</strong>：月华 / 星刃 / 全角色</li><li><strong>情绪标签</strong>：热血 / 治愈 / 神秘 / 喜庆</li><li><strong>比例标签</strong>：1:1 / 16:9 / 9:16 / 3:4</li></ul><p><strong>标签管理规则</strong>：</p><ul><li>每张素材 5-8 个标签</li><li>标签用预定义的词库（不要自由发挥）</li><li>新标签需要审批后才能加入词库</li></ul>",
        "tip": "标签的核心价值是「搜索」——每次打标签时想想「别人会用什么关键词来找这张图」"
      },
      {
        "title": "提示词知识库：团队最宝贵的 AI 资产",
        "body": "<p>提示词知识库比素材本身更有价值——好的提示词可以无限复用：</p><p><strong>知识库结构</strong>：</p><ul><li><strong>模板库</strong>：经过验证的通用提示词模板</li><li><strong>成功案例库</strong>：效果好的完整提示词 + 生成结果</li><li><strong>失败案例库</strong>：踩坑经历 + 解决方案</li><li><strong>变量词典</strong>：常用的风格词、氛围词、构图词</li></ul><p><strong>知识库条目格式</strong>：</p><ul><li>模板名称和使用场景</li><li>完整提示词</li><li>生成结果示例图</li><li>注意事项和已知限制</li><li>适用的分辨率和比例</li><li>贡献者和更新日期</li></ul>",
        "tip": "每次有人生成了特别好的图，第一时间把提示词录入知识库——过了一周你就记不清了"
      },
      {
        "title": "素材复用工作流",
        "body": "<p>让已有素材发挥最大价值：</p><p><strong>复用场景 1：直接复用</strong></p><ul><li>搜索素材库 → 找到完全匹配的素材 → 直接使用</li><li>适用：标准配图、固定栏目图等</li></ul><p><strong>复用场景 2：基于已有素材变体</strong></p><ul><li>找到接近的素材 → 用同一提示词生成新变体</li><li>适用：需要类似但不完全相同的素材</li></ul><p><strong>复用场景 3：基于模板创新</strong></p><ul><li>找到接近的提示词模板 → 修改部分变量 → 生成新素材</li><li>适用：新项目、新活动的素材生产</li></ul><p><strong>复用效率提升</strong>：</p><ul><li>有素材库：从需求到找到可用素材 30 秒</li><li>无素材库：从需求到生成新素材 10-30 分钟</li><li>效率提升：20-60 倍</li></ul>",
        "tip": "素材复用率是衡量素材库建设是否成功的核心指标——目标是 30% 以上的需求可以直接复用"
      },
      {
        "title": "工具选择与实施方案",
        "body": "<p>根据团队规模选择合适的素材管理工具：</p><p><strong>小团队（3-10 人）</strong>：</p><ul><li>工具：飞书云盘 + 飞书文档</li><li>素材存云盘，标签和提示词记录在文档中</li><li>成本：免费</li></ul><p><strong>中团队（10-30 人）</strong>：</p><ul><li>工具：Notion + Google Drive / 阿里云盘</li><li>Notion 做素材数据库（含标签和搜索），云盘存文件</li><li>成本：Notion 团队版 ~$10/人/月</li></ul><p><strong>大团队（30+ 人）</strong>：</p><ul><li>工具：专业 DAM 系统（Eagle、Brandfolder 等）</li><li>专业的数字资产管理，含自动标签和高级搜索</li><li>成本：根据系统不同</li></ul>",
        "tip": "不要一上来就用最复杂的工具——从飞书文档+云盘开始，验证流程后再升级"
      },
      {
        "title": "素材库建设路线图",
        "body": "<p>分阶段建设素材库，避免一步到位的完美主义：</p><p><strong>第 1 周：最小可用版</strong></p><ul><li>建立文件夹结构</li><li>定义命名规范</li><li>把现有素材整理入库</li></ul><p><strong>第 2-4 周：标签上线</strong></p><ul><li>定义标签词库</li><li>为库内素材打标签</li><li>建立搜索入口</li></ul><p><strong>第 2 月：知识库上线</strong></p><ul><li>整理已有的好用提示词</li><li>建立模板库和案例库</li><li>团队培训使用方法</li></ul><p><strong>第 3 月+：持续运营</strong></p><ul><li>每周更新素材和提示词</li><li>月度统计复用率</li><li>季度优化分类和标签体系</li></ul>",
        "tip": "素材库是「越用越有价值」的资产——坚持3个月，它就会成为团队不可或缺的基础设施"
      }
    ],
    "solves": "AI素材散落无序、重复生成浪费、好的提示词不断丢失",
    "outcome": "一套完整的团队级AI素材管理体系和提示词知识库",
    "fitLevel": "已有批量生成经验",
    "nextGuides": ["t-nb-27", "t-nb-28"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  },
  {
    "id": "t-nb-27",
    "title": "数据驱动优化：基于投放数据反哺 AI 出图策略",
    "desc": "用投放效果数据指导AI素材生产方向，建立从数据到素材的反馈闭环，持续提升素材的转化效率",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "40分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "📈",
    "editorPick": true,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 27,
    "prerequisite": ["t-nb-11", "t-nb-02"],
    "content": [
      {
        "title": "为什么素材效果需要数据驱动",
        "body": "<p>AI 出图解决了「量」的问题，但「质」需要数据来指导：</p><ul><li><strong>主观判断不靠谱</strong>：团队觉得好看的图不一定用户爱点</li><li><strong>用户偏好在变化</strong>：上个月高 CTR 的风格这个月可能失效</li><li><strong>不同渠道不同偏好</strong>：微博上火的图不一定在抖音也火</li></ul><p><strong>数据驱动出图的核心理念</strong>：让用户的真实行为数据告诉你「该生成什么样的图」。</p><p><strong>数据反馈闭环</strong>：AI 生成素材 → 投放/发布 → 收集效果数据 → 分析高效特征 → 指导下一轮 AI 生成。</p>",
        "tip": "数据驱动不是让数据替代创意，而是让数据告诉你「哪个方向的创意更有效」"
      },
      {
        "title": "素材标签与效果数据关联",
        "body": "<p>让每张素材的标签和效果数据对应起来：</p><p><strong>素材标签体系（用于归因）</strong>：</p><ul><li>风格标签：赛博 / 日系 / 国潮 / 写实</li><li>构图标签：居中 / 三分法 / 特写 / 全景</li><li>色调标签：暖色 / 冷色 / 高饱和 / 低饱和</li><li>CTA 类型：利益型 / 紧迫型 / 好奇型 / 社交型</li><li>角色标签：有角色 / 无角色 / 特定角色</li></ul><p><strong>效果数据指标</strong>：</p><ul><li>投放素材：CTR、CVR、CPA、CPI、素材生命周期</li><li>社媒配图：互动率、转发率、收藏率</li><li>活动海报：点击率、页面停留时长</li></ul><p><strong>关联方法</strong>：在素材命名或管理工具中，同时记录标签和效果数据。</p>",
        "tip": "标签的颗粒度要适中——太粗（如只标「投放素材」）无法归因，太细（标10个标签）管理成本太高"
      },
      {
        "title": "周度数据分析：找到高效素材特征",
        "body": "<p>每周分析投放和社媒数据，提取高效素材的共同特征：</p><p><strong>分析流程</strong>：</p><ol><li>导出本周所有素材的效果数据</li><li>按 CTR/互动率排序，取 Top 10 和 Bottom 10</li><li>对比 Top 和 Bottom 素材的标签差异</li><li>提取高效素材的共同特征</li><li>输出「本周素材洞察」指导下周生产</li></ol><p><strong>分析维度</strong>：</p><ul><li>什么风格的素材 CTR 最高？</li><li>什么构图方式效果最好？</li><li>什么色调的互动率最高？</li><li>有角色 vs 无角色的效果差异？</li><li>什么类型的 CTA 转化最好？</li></ul>",
        "tip": "数据样本量很重要——至少需要 20 张以上的素材数据才能做出有意义的分析",
        "example": "【周度素材洞察报告模板】\n\n本周素材数据概览：\n- 总投放素材：{X}张\n- 平均CTR：{X}%\n- Top 5 素材CTR：{X}%\n\n高效素材共同特征：\n1. 风格：{赛博朋克和暗色系CTR比日系高25%}\n2. 构图：{角色特写比全身图CTR高15%}\n3. CTA：{利益型CTA转化率最高}\n4. 色调：{高对比度比柔和色调表现好}\n\n下周素材生产建议：\n- 增加赛博朋克风格素材比例到40%\n- 优先生成角色特写构图\n- CTA统一使用利益型\n- 色调以高对比度为主"
      },
      {
        "title": "A/B 测试框架：系统化验证假设",
        "body": "<p>用 A/B 测试验证数据分析得出的假设：</p><p><strong>A/B 测试设计原则</strong>：</p><ul><li>每次只测试一个变量（风格 OR 构图 OR 色调）</li><li>控制其他变量不变</li><li>每组至少 3 张素材（避免单张偶然因素）</li><li>测试周期至少 3 天（数据稳定后再下结论）</li></ul><p><strong>常见 A/B 测试场景</strong>：</p><ul><li>A 组：赛博风格 vs B 组：日系风格（测试风格偏好）</li><li>A 组：角色特写 vs B 组：全身展示（测试构图偏好）</li><li>A 组：暖色调 vs B 组：冷色调（测试色调偏好）</li><li>A 组：「限时领取」vs B 组：「立即下载」（测试 CTA）</li></ul><p><strong>用 AI 加速 A/B 测试</strong>：传统方式出 2 组变体需要 1 周，AI 可以在 1 小时内出 10 组变体同时测试。</p>",
        "tip": "A/B 测试最重要的是「控制变量」——如果同时改了风格和构图，就无法判断是哪个因素在起作用"
      },
      {
        "title": "素材生命周期管理",
        "body": "<p>每张素材都有生命周期，管理好生命周期才能持续保持高效：</p><p><strong>素材生命周期阶段</strong>：</p><ol><li><strong>新生期</strong>（第 1-2 天）：刚上线，数据不稳定</li><li><strong>成长期</strong>（第 3-5 天）：效果达到峰值</li><li><strong>衰退期</strong>（第 5-7 天）：CTR 开始下降</li><li><strong>淘汰期</strong>（第 7+ 天）：效果明显衰减</li></ol><p><strong>生命周期管理策略</strong>：</p><ul><li>新生期：观察数据，不急于下结论</li><li>成长期：放大预算，最大化利用</li><li>衰退期：准备替代素材，逐步切换</li><li>淘汰期：关停，分析成功因素归档</li></ul><p><strong>素材补给节奏</strong>：按「每周补充 30% 新素材」的节奏，确保始终有新鲜素材。</p>",
        "tip": "不要等素材效果明显衰减才准备新素材——在成长期就开始准备替代品，无缝切换"
      },
      {
        "title": "从数据到提示词的自动化",
        "body": "<p>将数据洞察自动转化为 AI 出图策略的进阶方法：</p><p><strong>半自动化方案</strong>：</p><ol><li>每周数据分析输出「高效特征清单」</li><li>基于特征清单更新提示词模板</li><li>用更新后的模板批量生成新一批素材</li></ol><p><strong>更高级的自动化</strong>：</p><ul><li>Claude 自动分析投放数据，提取高效特征</li><li>Claude 基于特征自动生成新的提示词变体</li><li>API 自动调用 Nano Banana 2 批量生成</li><li>新素材自动上传到投放平台</li></ul><p>这是一个<strong>「数据 → 洞察 → 创意 → 生产 → 投放 → 数据」</strong>的完整闭环。</p>",
        "tip": "全自动化是终极目标，但先从半自动化开始——手动执行每个步骤来积累经验和验证流程"
      },
      {
        "title": "数据驱动出图体系总结",
        "body": "<p>建立数据驱动的 AI 出图体系：</p><p><strong>核心流程</strong>：</p><ol><li><strong>生成</strong>：基于提示词模板批量出图</li><li><strong>筛选</strong>：审核流程筛选可用素材</li><li><strong>发布</strong>：投放/发布到各平台</li><li><strong>监测</strong>：收集效果数据</li><li><strong>分析</strong>：每周分析高效特征</li><li><strong>优化</strong>：基于分析更新提示词模板</li><li><strong>循环</strong>：回到第 1 步</li></ol><p><strong>关键指标</strong>：</p><ul><li>素材平均 CTR 趋势（应该逐月提升）</li><li>Top 素材 CTR 与平均 CTR 的差距（应该逐步缩小）</li><li>素材淘汰率（应该逐步降低）</li></ul>",
        "tip": "数据驱动体系需要 2-3 个月的数据积累才能显现效果——坚持每周分析，效果会越来越好"
      }
    ],
    "solves": "AI素材生产方向靠主观判断，缺乏数据反馈指导，素材转化效率提升无路径",
    "outcome": "建立数据驱动的AI素材优化闭环，素材转化效率持续提升",
    "fitLevel": "已有投放和批量生成经验",
    "nextGuides": ["t-nb-28", "t-nb-23"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  }
];

let lastNbIndex = -1;
for (let i = 0; i < tutorials.length; i++) {
  if (tutorials[i].id && tutorials[i].id.startsWith('t-nb-')) {
    lastNbIndex = i;
  }
}

if (lastNbIndex >= 0) {
  tutorials.splice(lastNbIndex + 1, 0, ...newTutorials);
}

fs.writeFileSync(tutorialsPath, JSON.stringify(tutorials, null, 2), 'utf8');
console.log(`✅ 批次5b完成：新增 ${newTutorials.length} 篇专业流水线教程 (t-nb-26~27)`);
console.log(`📊 tutorials.json 当前共 ${tutorials.length} 篇教程`);
