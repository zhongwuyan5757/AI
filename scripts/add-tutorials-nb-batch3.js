#!/usr/bin/env node
/**
 * Batch 3: 岗位场景实战 t-nb-14, t-nb-15, t-nb-16
 */
const fs = require('fs');
const path = require('path');

const tutorialsPath = path.join(__dirname, '..', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

const newTutorials = [
  {
    "id": "t-nb-14",
    "title": "新媒体岗实战：社媒日更配图效率革命",
    "desc": "解决新媒体运营每天配图的痛点，用Nano Banana 2建立社媒配图的批量生产体系，从每天找图1小时到每周批量20分钟",
    "tier": "intermediate",
    "difficulty": "intermediate",
    "duration": "35分钟",
    "targetJobs": ["media"],
    "category": "prompt",
    "icon": "📱",
    "editorPick": true,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 14,
    "prerequisite": ["t-nb-01", "t-nb-08"],
    "content": [
      {
        "title": "新媒体配图的日常困境",
        "body": "<p>新媒体运营每天面临的配图挑战：</p><ul><li><strong>频率高</strong>：微博、小红书、公众号、抖音、B站，每个平台每天 1-3 条内容</li><li><strong>风格多变</strong>：日常推送、热点借势、活动宣传、用户互动，每种类型风格不同</li><li><strong>尺寸各异</strong>：微博方形、小红书竖版、公众号横版、抖音全屏</li><li><strong>时效性强</strong>：热点借势需要 2 小时内出图，不能等设计排期</li></ul><p>现实：大部分新媒体运营花在「找图、等图、改图」上的时间，比写文案还多。</p><p><strong>AI 解决方案</strong>：每周一批量生成全周配图，热点场景即时生成，彻底告别「配图焦虑」。</p>",
        "tip": "新媒体用 AI 配图最大的改变是思维模式——从「写完文案再找图」变成「先生成图再配文案」"
      },
      {
        "title": "7 大平台配图规格速查",
        "body": "<p>不同平台的配图要求一览，生成时直接对照：</p><table><tr><th>平台</th><th>最佳比例</th><th>推荐分辨率</th><th>风格偏好</th></tr><tr><td>微博</td><td>1:1 / 16:9</td><td>1K</td><td>吸睛、信息量大</td></tr><tr><td>小红书</td><td>3:4 / 1:1</td><td>1K</td><td>精致、有设计感</td></tr><tr><td>微信公众号</td><td>2.35:1</td><td>1K</td><td>简洁、专业</td></tr><tr><td>抖音</td><td>9:16</td><td>1K</td><td>冲击力强、色彩鲜明</td></tr><tr><td>B站</td><td>16:9</td><td>1K</td><td>二次元友好</td></tr><tr><td>TapTap</td><td>16:9 / 1:1</td><td>1K</td><td>游戏感、社区感</td></tr><tr><td>Twitter/X</td><td>16:9</td><td>1K</td><td>简洁国际化</td></tr></table>",
        "tip": "建立一个平台规格速查文档，生成图片时直接复制对应平台的尺寸要求到提示词末尾"
      },
      {
        "title": "内容日历配图法：一次出一周",
        "body": "<p>把每周的配图需求集中在周一批量解决：</p><p><strong>步骤 1：梳理本周内容日历</strong></p><ul><li>确认每天的内容主题和发布平台</li><li>标记哪些需要配图（通常 70-80% 的内容需要）</li></ul><p><strong>步骤 2：分类配图需求</strong></p><ul><li>日常内容配图（游戏日常、角色故事、玩家互动）</li><li>固定栏目配图（每周的固定栏目有固定模板）</li><li>活动宣传配图（跟随活动节奏）</li></ul><p><strong>步骤 3：批量生成</strong></p><ul><li>每个配图需求生成 2-3 张候选</li><li>快速筛选最佳，标记备用</li><li>全周约 15-25 张配图，40 分钟完成</li></ul>",
        "tip": "固定栏目（如「每日一抽」「攻略推荐」）建立固定模板后，每次只改文字内容即可",
        "example": "【周一 - 版本爆料】\n生成游戏社媒配图。1:1比例。画面中央有一个被迷雾包裹的宝箱，宝箱缝隙透出金色光芒。背景深色，氛围神秘。文字「本周爆料 敬请期待」。二次元游戏感风格。\n\n【周三 - 攻略分享】\n生成游戏攻略配图。3:4比例（小红书）。干净的信息图风格，浅蓝色背景。画面分为上下两部分：上半部是角色战斗场景，下半部留白区域用于后期添加攻略文字。边框有科技感装饰线。\n\n【周五 - 玩家互动话题】\n生成游戏互动话题配图。1:1比例。轻松Q版风格，马卡龙色系。3个Q版角色围坐讨论，头顶有大大的问号和感叹号气泡。文字「周末话题：你最想给角色换什么新皮肤？」。"
      },
      {
        "title": "热点借势配图：2 小时内出图",
        "body": "<p>追热点是新媒体的必备技能，AI 让你不再因为「没图」而错过热点窗口：</p><p><strong>热点借势 3 步法</strong>：</p><ol><li><strong>判断关联性</strong>（5分钟）：这个热点和游戏/品牌有什么关联？</li><li><strong>找到创意点</strong>（10分钟）：游戏元素 × 热点元素 = 创意画面</li><li><strong>快速生成</strong>（15分钟）：出 3 版选最好的一张</li></ol><p><strong>常见热点类型及配图思路</strong>：</p><ul><li><strong>节日热点</strong>：角色 + 节日装扮/场景</li><li><strong>天气热点</strong>：角色 + 天气场景互动</li><li><strong>流行语/梗</strong>：角色 + 梗的视觉化表达</li><li><strong>赛事/大事件</strong>：角色 + 事件元素融合</li></ul><p>热点配图原则：<strong>速度 > 精度</strong>。512px 快速出图就够用，不需要高分辨率。</p>",
        "tip": "提前准备 10 个「万能热点模板」，覆盖节日、天气、情感、赛事等大类，遇到热点直接套"
      },
      {
        "title": "社媒配图风格库建设",
        "body": "<p>建立团队共享的配图风格库，让所有新媒体运营都能快速出图：</p><p><strong>风格库分类</strong>：</p><ul><li><strong>日常类</strong>：轻松、可爱、温馨的配图模板</li><li><strong>活动类</strong>：热烈、喜庆、紧迫感的配图模板</li><li><strong>攻略类</strong>：信息图风格、清晰简洁的配图模板</li><li><strong>互动类</strong>：Q版、搞笑、参与感强的配图模板</li><li><strong>品牌类</strong>：高级感、品牌调性强的配图模板</li></ul><p><strong>风格库文档格式</strong>：</p><ul><li>每个模板包含：模板名称、使用场景、完整提示词、示例图片链接</li><li>按使用频率排序，高频模板放最前面</li><li>定期更新：每月淘汰效果差的模板，新增高效模板</li></ul>",
        "tip": "风格库的核心价值是「新人也能出好图」——有了模板库，实习生也能在 10 分钟内产出合格配图"
      },
      {
        "title": "小红书专项：爆款配图的 AI 技巧",
        "body": "<p>小红书对图片质量要求最高，也是 AI 配图最能体现价值的平台：</p><p><strong>小红书爆款配图特点</strong>：</p><ul><li>色彩饱满、有设计感、信息密度适中</li><li>风格统一的系列图更容易被推荐</li><li>文字标题直接印在图上效果更好</li></ul><p><strong>AI 出小红书配图的技巧</strong>：</p><ul><li>比例固定 3:4 或 1:1</li><li>提示词中加「精致」「有设计感」「杂志风格」</li><li>文字标题要醒目：大字号、高对比、有装饰</li><li>多图时保持统一色系和风格</li></ul><p><strong>高效操作</strong>：一组小红书笔记通常需要 3-9 张图。先出第一张定调，然后「保持这个风格，生成其他几张」。</p>",
        "tip": "小红书的首图决定点击率——首图一定要花最多精力调整到最吸引眼球的状态",
        "example": "【小红书游戏攻略配图组 - 首图】\n生成小红书风格的游戏攻略首图。3:4比例。\n背景：渐变的深蓝到紫色。\n主体：游戏角色的半身像在画面右侧。\n文字排版：左侧竖排大字「月华攻略｜从零到满级只需3天」，白色字体有淡金色光效描边。\n装饰：角落有星光粒子和几何装饰线。\n整体风格精致、有设计感。"
      },
      {
        "title": "新媒体配图效率体系总结",
        "body": "<p>建立可持续的新媒体配图体系：</p><p><strong>效率目标</strong>：</p><ul><li>日常配图：3-5 分钟/张</li><li>热点配图：15-20 分钟/张（含构思）</li><li>活动宣传配图：10 分钟/张</li><li>一周全平台配图：40-60 分钟批量完成</li></ul><p><strong>质量标准</strong>：</p><ul><li>A级（直接发布）：约 30-40% 命中率</li><li>B级（微调后发布）：约 30-40%</li><li>C级（重做）：约 20-30%</li></ul><p><strong>持续优化</strong>：</p><ul><li>每月统计各平台配图的互动数据</li><li>高互动配图的提示词纳入风格库</li><li>低效模板及时淘汰或优化</li></ul><p>关键心态：不要追求每张都是精品，<strong>日常配图的目标是「及格以上」而不是「满分」</strong>。把精力留给真正重要的品牌大图。</p>",
        "tip": "记住：社媒内容的核心是「文案 + 配图」，AI 解决配图效率后，你可以把更多时间花在写好文案上"
      }
    ],
    "solves": "社媒日更配图耗时、热点配图跟不上、多平台适配麻烦",
    "outcome": "一套可持续的社媒配图批量生产体系和风格库",
    "fitLevel": "已完成提示词入门",
    "nextGuides": ["t-nb-15", "t-nb-02"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["新媒体"]
  },
  {
    "id": "t-nb-15",
    "title": "策划岗实战：原型展示与方案可视化",
    "desc": "策划岗如何用Nano Banana 2将文字方案转化为视觉概念图，让策划提案更有说服力，减少与团队的沟通成本",
    "tier": "intermediate",
    "difficulty": "intermediate",
    "duration": "30分钟",
    "targetJobs": ["planning"],
    "category": "prompt",
    "icon": "💡",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 15,
    "prerequisite": ["t-nb-01", "t-nb-08"],
    "content": [
      {
        "title": "策划的视觉化痛点",
        "body": "<p>游戏策划在工作中经常遇到「说不清楚」的问题：</p><ul><li><strong>文字方案缺乏直观感</strong>：写了 10 页策划案，评审时大家理解各不相同</li><li><strong>新玩法难以描述</strong>：「这个界面大概是这个感觉」说了半天没人懂</li><li><strong>角色设定对不齐</strong>：策划脑中的角色和设计师理解的完全不同</li><li><strong>活动效果预想</strong>：活动方案缺乏视觉参照，讨论效率低</li></ul><p>AI 解决方案：用 Nano Banana 2 把文字方案<strong>快速转化为概念图</strong>，让每次讨论都有视觉参照。</p><p><strong>关键认知</strong>：策划生成的图不是「终稿」，而是「沟通工具」。目标是让团队「看到」你脑中的画面。</p>",
        "tip": "策划用 AI 出图的核心价值不是出好图，而是让「对齐」更高效——有图的方案比纯文字方案评审效率高 3 倍"
      },
      {
        "title": "策划案配图：让文字方案更有说服力",
        "body": "<p>在策划案中加入 AI 生成的概念图，大幅提升方案的说服力：</p><p><strong>适合配图的策划案内容</strong>：</p><ul><li>新角色提案：角色概念图 + 不同姿态展示</li><li>新场景提案：场景氛围图 + 不同时间/天气变体</li><li>新活动提案：活动主视觉 + 关键节点的画面概念</li><li>新玩法提案：玩法界面概念图 + 核心操作的示意图</li></ul><p><strong>策划案配图的质量要求</strong>：</p><ul><li>不需要精品质量，能传达概念即可</li><li>一张图配一段说明文字：「角色的核心设计理念是 XXX，参考效果如上图」</li><li>多出几版展示不同方向，让决策者有选择余地</li></ul>",
        "tip": "策划案配图标注「AI概念图，仅供方向参考」——管理团队期望很重要",
        "example": "【新角色提案配图】\n场景：提案一个新的治愈系辅助角色\n\n为游戏生成角色概念图。\n角色设定：17岁少女，温柔治愈系。\n外貌：浅绿色长发，翡翠色眼瞳，穿着白绿配色的轻盈法袍。\n特征元素：手持一本发光的古书，身边环绕着小型光精灵。\n表情：温柔微笑，给人安心感。\n背景：纯白色。\n风格：二次元，精致可爱。\n要求：全身立绘，3:4比例。"
      },
      {
        "title": "玩法界面概念图",
        "body": "<p>新玩法提案时，界面概念图比文字描述更直观：</p><p><strong>适合用 AI 做的界面概念</strong>：</p><ul><li>大厅/主界面的整体氛围概念</li><li>战斗界面的视觉风格方向</li><li>社交系统的界面氛围</li><li>新功能的入口展示效果</li></ul><p><strong>不适合用 AI 做的界面内容</strong>：</p><ul><li>精确的按钮位置和交互布局（用 Figma）</li><li>可点击的交互原型（用 Axure/Figma）</li><li>数值和文字的精确展示</li></ul><p><strong>界面概念图的提示词要点</strong>：</p><ul><li>指定「游戏 UI 界面设计风格」</li><li>描述大致的区域分布（上中下/左中右）</li><li>指定参考风格（如「参考崩坏星穹铁道的 UI 风格」）</li></ul>",
        "tip": "界面概念图只用来「对齐方向」，实际的 UI 设计一定要交给 UI 设计师用专业工具完成"
      },
      {
        "title": "活动方案可视化",
        "body": "<p>活动策划方案中加入视觉概念，让决策者一目了然：</p><p><strong>活动方案视觉化清单</strong>：</p><ul><li><strong>活动主视觉概念</strong>：定义活动的整体视觉方向</li><li><strong>登录弹窗效果</strong>：玩家进入游戏后看到的第一个画面</li><li><strong>活动页面氛围</strong>：活动主界面的整体感觉</li><li><strong>奖励展示效果</strong>：核心奖励的视觉呈现方式</li></ul><p><strong>活动提案的视觉化模板</strong>：</p><ol><li>先生成活动主视觉（确定整体氛围和色调）</li><li>基于主视觉生成 2-3 个关键画面</li><li>排列成方案 PPT 的配图</li></ol>",
        "tip": "活动概念图的氛围比细节重要——让看的人「感受到」活动的情绪和基调就够了"
      },
      {
        "title": "竞品分析配图",
        "body": "<p>策划做竞品分析时，经常需要大量配图来辅助说明：</p><p><strong>竞品分析中常用的配图类型</strong>：</p><ul><li><strong>竞品对比图</strong>：对比不同游戏的视觉风格差异（截图 + 标注）</li><li><strong>市场定位象限图</strong>：将竞品按维度映射到坐标系上（用 AI 生成示意图）</li><li><strong>用户画像配图</strong>：代表不同用户群体的视觉人物</li><li><strong>市场趋势配图</strong>：表达市场趋势的概念图（如「从端游到移动端的演变」）</li></ul><p><strong>竞品分析配图的要点</strong>：</p><ul><li>信息图风格比插画风格更合适</li><li>色彩清晰、层次分明、文字可读</li><li>尺寸适合 PPT 展示（16:9）</li></ul>",
        "tip": "竞品分析配图的目标是「辅助理解」而非「好看」——清晰的信息传达比艺术性更重要"
      },
      {
        "title": "角色设定与世界观概念图",
        "body": "<p>角色和世界观设定是策划的核心工作，视觉化能大幅减少与设计团队的沟通成本：</p><p><strong>角色设定概念图</strong>：</p><ul><li>不同角色的外观概念（3-5 版供讨论）</li><li>同一角色的不同情绪/姿态展示</li><li>角色与角色之间的关系示意图</li><li>角色进化/变装的阶段展示</li></ul><p><strong>世界观概念图</strong>：</p><ul><li>不同地区/势力的视觉风格差异</li><li>世界地图的氛围概念</li><li>关键场景/地标的视觉概念</li><li>不同时代/时间线的视觉区分</li></ul><p><strong>操作建议</strong>：角色概念图按「基础形象 → 装备细节 → 场景融合」分步生成，每步确认后再下一步。</p>",
        "tip": "角色概念图一定要附上文字设定说明——AI 生成的图是参考方向，具体设定还是以文字策划案为准"
      },
      {
        "title": "策划岗 AI 出图工作流总结",
        "body": "<p>策划岗使用 AI 出图的核心场景和效率提升：</p><table><tr><th>场景</th><th>传统耗时</th><th>AI 辅助耗时</th><th>效率提升</th></tr><tr><td>策划案配图</td><td>找参考 2 小时</td><td>生成概念图 20 分钟</td><td>6x</td></tr><tr><td>玩法概念展示</td><td>文字描述 + 画草图 1 天</td><td>AI 概念图 30 分钟</td><td>16x</td></tr><tr><td>活动方案视觉化</td><td>等设计师出概念 2-3 天</td><td>AI 概念图 1 小时</td><td>10x+</td></tr><tr><td>竞品分析配图</td><td>截图整理 3 小时</td><td>AI 示意图 40 分钟</td><td>4.5x</td></tr></table><p><strong>工作习惯建议</strong>：</p><ul><li>每次写策划案时，先用 AI 出 3-5 张概念图</li><li>在方案评审前准备好视觉参照</li><li>角色设定文档都配上概念图</li></ul>",
        "tip": "策划岗的 AI 出图不是额外工作，而是让你的本职工作（策划案）更有质量和说服力"
      }
    ],
    "solves": "策划方案缺乏视觉参照、与设计团队沟通效率低、方案评审说不清楚",
    "outcome": "策划方案视觉化的方法论，让每次提案都有概念图支撑",
    "fitLevel": "已完成提示词入门",
    "nextGuides": ["t-nb-16", "t-nb-12"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["策划"]
  },
  {
    "id": "t-nb-16",
    "title": "商务岗实战：提案 PPT 与商务素材专业化",
    "desc": "商务团队如何用Nano Banana 2快速产出高质量的提案配图、合作方案视觉和商务展示素材",
    "tier": "intermediate",
    "difficulty": "intermediate",
    "duration": "30分钟",
    "targetJobs": ["business"],
    "category": "prompt",
    "icon": "💼",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 16,
    "prerequisite": ["t-nb-01", "t-nb-08"],
    "content": [
      {
        "title": "商务素材的核心需求",
        "body": "<p>游戏行业的商务团队需要大量视觉素材来支撑商务活动：</p><ul><li><strong>商务提案 PPT</strong>：合作方案、代理洽谈、投资汇报的配图</li><li><strong>渠道素材包</strong>：给渠道商的游戏介绍素材</li><li><strong>媒体资源包</strong>：给媒体的高质量宣传素材</li><li><strong>合作概念展示</strong>：跨界合作、联运合作的视觉概念</li></ul><p>商务素材的特殊要求：<strong>专业感和品质感</strong>。给合作方的素材代表公司形象，不能粗糙。</p><p>AI 在商务素材中的定位：<strong>快速出专业级初稿</strong>，让商务不再因为「没有好看的配图」而降低提案质量。</p>",
        "tip": "商务素材宁可简洁也不要花哨——简洁专业的 AI 配图比复杂但粗糙的手动 P 图好得多"
      },
      {
        "title": "提案 PPT 配图：让每页都有专业视觉",
        "body": "<p>PPT 配图决定了提案的第一印象：</p><p><strong>PPT 常见页面类型及配图方案</strong>：</p><ul><li><strong>封面页</strong>：游戏主视觉 + 标题 → 用 AI 生成高品质封面图</li><li><strong>数据页</strong>：信息图风格的背景 → 用 AI 生成抽象科技感背景</li><li><strong>产品介绍页</strong>：游戏截图/角色展示 → 用 AI 生成展示效果图</li><li><strong>市场分析页</strong>：市场示意图 → 用 AI 生成概念配图</li><li><strong>合作方案页</strong>：合作效果预览 → 用 AI 生成联合视觉概念</li></ul><p><strong>PPT 配图的质量标准</strong>：</p><ul><li>分辨率至少 1K（投影或大屏展示需要 2K）</li><li>风格统一（全部使用同一色系和画风）</li><li>留白得当（要给文字留出位置）</li></ul>",
        "tip": "PPT 配图要给文字留空间——在提示词中加「画面右侧/下方留出 30% 的空白区域」",
        "example": "【PPT封面配图】\n生成一张商务提案PPT的封面配图。16:9横版。\n风格：科技感，深蓝色主调，精致专业。\n主体：游戏中的标志性场景，远景透视构图，有纵深感。\n光效：画面中有柔和的蓝色科技光线和微弱的粒子效果。\n构图：主要画面集中在左侧60%区域，右侧40%留出深色渐变空白（用于放标题文字）。\n氛围：高级、专业、有科技感。2K分辨率。"
      },
      {
        "title": "渠道素材包：标准化产出",
        "body": "<p>给渠道商的素材包需要标准化且高质量：</p><p><strong>渠道素材包标准内容</strong>：</p><ul><li><strong>游戏 LOGO</strong>（多种背景版本）</li><li><strong>核心角色展示图</strong>（3-5 个主角的立绘）</li><li><strong>游戏场景展示图</strong>（3-5 张不同场景的高清图）</li><li><strong>宣传横幅</strong>（多种尺寸的 Banner）</li><li><strong>商店页截图</strong>（模拟应用商店的展示效果）</li></ul><p><strong>用 AI 快速补充素材包</strong>：</p><ul><li>角色展示图的不同姿态变体</li><li>场景图的不同时间/天气变体</li><li>宣传横幅的多尺寸适配</li><li>节日/活动版本的特殊素材</li></ul>",
        "tip": "渠道素材包要附上使用规范（尺寸、场景建议、禁止事项），提升渠道方的使用体验"
      },
      {
        "title": "合作方案视觉概念",
        "body": "<p>谈合作时，有视觉概念图比纯文字描述说服力强 10 倍：</p><p><strong>常见合作类型的视觉概念</strong>：</p><ul><li><strong>联运合作</strong>：双方品牌 LOGO 融合的概念图、联合推广活动的视觉概念</li><li><strong>IP 授权</strong>：IP 在游戏中的呈现效果预览</li><li><strong>跨界联名</strong>：双方产品结合的视觉概念（联名皮肤、联名商品等）</li><li><strong>媒体合作</strong>：在合作媒体上的展示效果模拟</li></ul><p><strong>合作概念图的制作要点</strong>：</p><ul><li>体现双方品牌元素的融合</li><li>突出合作的差异化价值</li><li>画面专业、品质感强</li><li>附上「效果示意，实际以最终设计为准」的标注</li></ul>",
        "tip": "合作概念图不需要完美——重要的是让合作方「看到可能性」，激发合作兴趣"
      },
      {
        "title": "媒体资源包与新闻稿配图",
        "body": "<p>给媒体的素材质量直接影响报道的视觉效果：</p><p><strong>媒体资源包内容</strong>：</p><ul><li>高分辨率游戏场景图（2K-4K）</li><li>角色高清立绘</li><li>游戏 LOGO 的多种格式</li><li>开发团队/工作室的品牌图</li></ul><p><strong>新闻稿配图类型</strong>：</p><ul><li><strong>版本更新稿</strong>：新内容的精美展示图</li><li><strong>里程碑稿</strong>：庆祝性质的华丽配图（如「下载量突破千万」）</li><li><strong>采访稿</strong>：游戏品牌形象图或团队概念图</li><li><strong>奖项稿</strong>：获奖展示的品牌图</li></ul><p>媒体素材要求<strong>高分辨率</strong>，至少 2K，重要稿件 4K。在提示词中明确指定「4K 高分辨率，适合媒体发布」。</p>",
        "tip": "媒体资源包准备好后存到云盘，给媒体发一个下载链接——比每次单独发素材效率高 10 倍"
      },
      {
        "title": "商务展示的专业化技巧",
        "body": "<p>让 AI 生成的素材看起来更「商务化」和「专业化」：</p><p><strong>提升专业感的关键词</strong>：</p><ul><li>「专业级」「商务风格」「简洁大气」</li><li>「高级质感」「品质感」「精致」</li><li>「适合商务展示」「PPT 配图风格」</li></ul><p><strong>色彩选择</strong>：</p><ul><li>安全色：深蓝、深灰、白色、金色</li><li>避免：过于饱和的颜色、太多颜色混搭</li><li>建议：2-3 种颜色为主，保持简洁</li></ul><p><strong>排版建议</strong>：</p><ul><li>留足文字空间（至少 30% 画面作为留白）</li><li>主体不要太复杂（一个核心元素就够）</li><li>背景要干净（纯色渐变或简单纹理）</li></ul>",
        "tip": "商务素材的黄金法则：「少即是多」——越简洁越专业"
      },
      {
        "title": "商务岗 AI 出图工作流总结",
        "body": "<p>商务岗的 AI 出图场景和效率：</p><p><strong>核心场景</strong>：</p><ul><li>提案 PPT 配图：每个项目节省 3-5 小时找图时间</li><li>渠道素材包更新：每次更新节省 1-2 天</li><li>合作概念展示：从无到有，10 分钟出概念</li><li>媒体资源包补充：批量生成多角度展示图</li></ul><p><strong>工作习惯建议</strong>：</p><ol><li>每次写提案前，先用 AI 出 5 张配图方案</li><li>建立公司级的「商务素材模板库」</li><li>重要场合的素材由设计师在 AI 初稿基础上精修</li><li>渠道素材包每季度用 AI 更新一次</li></ol><p><strong>注意事项</strong>：给外部合作方的素材如果完全由 AI 生成，建议标注「概念图」；正式合作后使用设计师精修版。</p>",
        "tip": "商务岗用 AI 出图的终极目标：让每次商务沟通都有专业的视觉支撑，而不是纯文字「空对空」"
      }
    ],
    "solves": "提案PPT缺乏专业配图、商务素材产出慢、合作方案无法可视化展示",
    "outcome": "商务岗专属的AI素材生产方法和专业化展示技巧",
    "fitLevel": "已完成提示词入门",
    "nextGuides": ["t-nb-13", "t-nb-05"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["商务"]
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
console.log(`✅ 批次3完成：新增 ${newTutorials.length} 篇岗位场景实战教程 (t-nb-14~16)`);
console.log(`📊 tutorials.json 当前共 ${tutorials.length} 篇教程`);
