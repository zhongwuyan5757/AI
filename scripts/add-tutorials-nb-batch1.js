#!/usr/bin/env node
/**
 * Batch 1: 入门基础教程 t-nb-07, t-nb-08, t-nb-09
 */
const fs = require('fs');
const path = require('path');

const tutorialsPath = path.join(__dirname, '..', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

const newTutorials = [
  {
    "id": "t-nb-07",
    "title": "Gemini 图片生成全流程：从注册到出图",
    "desc": "手把手操作指南，零基础10分钟内完成Gemini注册、界面熟悉、第一张AI图片生成，建立完整的操作肌肉记忆",
    "tier": "beginner",
    "difficulty": "beginner",
    "duration": "25分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🚀",
    "editorPick": true,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 7,
    "prerequisite": [],
    "content": [
      {
        "title": "准备工作：你需要什么",
        "body": "<p>开始之前，确认你有以下条件：</p><ul><li><strong>Google 账号</strong>：任意 Gmail 账号即可，无需付费升级</li><li><strong>网络环境</strong>：能正常访问 Google 服务（如需要可使用公司提供的网络工具）</li><li><strong>浏览器</strong>：推荐 Chrome，其他现代浏览器也可以</li></ul><p>不需要：安装任何软件、配置任何开发环境、具备任何编程知识。</p><p><strong>时间预期</strong>：首次注册 + 熟悉界面约 5 分钟，生成第一张图约 3 分钟，总计 10 分钟以内。</p>",
        "tip": "如果你已有 Google 账号（用过 Gmail、Google Drive 等），直接跳到第 2 步"
      },
      {
        "title": "步骤一：访问 Gemini 并登录",
        "body": "<p>打开浏览器，访问 <strong>gemini.google.com</strong>：</p><ol><li>点击右上角「Sign in」，使用你的 Google 账号登录</li><li>首次登录会看到服务条款，点击同意即可</li><li>登录后你会看到一个类似聊天窗口的界面——这就是 Gemini 的主界面</li></ol><p><strong>界面认识</strong>：</p><ul><li><strong>输入框</strong>：页面底部的文字输入区域，这是你和 AI 对话的地方</li><li><strong>对话区域</strong>：中间的大片空白，AI 的回复会显示在这里</li><li><strong>侧边栏</strong>：左侧可以查看历史对话记录</li><li><strong>模型选择</strong>：确认当前使用的是包含 Gemini 3.1 Flash 的模型</li></ul>",
        "tip": "建议将 gemini.google.com 加入浏览器书签，方便日后快速访问"
      },
      {
        "title": "步骤二：认识图片生成的两种方式",
        "body": "<p>在 Gemini 中生成图片有两种方式，了解区别后选择适合你的：</p><p><strong>方式 1：直接描述（推荐新手）</strong></p><ul><li>在输入框中直接用自然语言描述你想要的图片</li><li>例如：「帮我画一个可爱的游戏角色」</li><li>AI 会理解你的描述并生成图片</li></ul><p><strong>方式 2：结构化提示词（进阶用法）</strong></p><ul><li>按照固定格式描述风格、主体、背景、文字等</li><li>例如：「生成一张海报，风格：赛博朋克，主体：机械战士...」</li><li>控制力更强，结果更可预测</li></ul><p>新手先用方式 1 入门，熟悉后自然会过渡到方式 2。</p>",
        "tip": "不用担心「说错话」——AI 不会因为你的描述不完美就给出很差的结果，先大胆尝试"
      },
      {
        "title": "步骤三：生成你的第一张图",
        "body": "<p>现在动手生成第一张图片：</p><ol><li>在输入框中输入下方示例提示词（可以直接复制）</li><li>按回车发送</li><li>等待 3-15 秒，图片就会出现在对话区域中</li><li>Gemini 通常会生成多张图片供你选择</li></ol><p><strong>查看和保存图片</strong>：</p><ul><li>点击图片可以查看大图</li><li>右键点击可以「另存为」到本地</li><li>部分图片下方有「编辑」按钮，可以进一步修改</li></ul><p><strong>如果结果不满意</strong>：直接在对话中追加要求，比如「换成蓝色背景」「角色换成男性」，不需要重新写完整提示词。</p>",
        "tip": "第一次生成不追求完美，目标是完成从输入到出图的完整流程",
        "example": "在 Gemini 输入框中输入：\n\n请帮我生成一张游戏角色插画。一个穿着蓝色铠甲的骑士，手持发光的长剑，站在夕阳下的山顶。风格是二次元动漫风。"
      },
      {
        "title": "步骤四：学会追问和修改",
        "body": "<p>生成第一张图后，通过对话来调整——这是 Nano Banana 2 最强大的能力：</p><p><strong>常用追问句式</strong>：</p><ul><li>「把背景换成 XX」→ 只改背景，保留角色</li><li>「整体色调改为 XX」→ 调整画面氛围</li><li>「角色的表情换成 XX」→ 修改局部细节</li><li>「在画面中加上文字 XX」→ 添加文字</li><li>「重新生成，但更 XX 一些」→ 调整整体感觉</li></ul><p><strong>追问的技巧</strong>：</p><ul><li>一次只改一个方面，避免同时改太多导致画面大变</li><li>明确说「保持其他不变」可以减少不必要的变化</li><li>如果某一版特别满意，可以说「基于这一版继续调整」</li></ul>",
        "tip": "把 Gemini 当成一个「可以对话的设计师」，你不需要一次说完所有要求，慢慢聊就行",
        "example": "第一轮生成后，继续输入：\n\n不错！请基于这张图做以下修改：\n1. 背景换成星空和极光\n2. 剑的光芒颜色从白色改为金色\n3. 保持角色姿势和铠甲不变"
      },
      {
        "title": "步骤五：保存和管理你的作品",
        "body": "<p>养成良好的文件管理习惯，方便后续使用：</p><p><strong>保存方式</strong>：</p><ul><li>右键图片「另存为」→ 保存到本地文件夹</li><li>建议创建分类文件夹：按项目/按用途/按日期</li></ul><p><strong>命名规范建议</strong>：</p><ul><li><code>[日期]_[用途]_[风格]_[版本号].png</code></li><li>例如：<code>20260311_活动海报_赛博朋克_v2.png</code></li></ul><p><strong>Gemini 历史记录</strong>：</p><ul><li>所有对话会保存在左侧边栏的历史记录中</li><li>点击历史对话可以继续之前的生成和编辑</li><li>给重要对话起个名字（点击对话标题可以重命名）</li></ul>",
        "tip": "每次生成满意的图片后立即保存——Gemini 的历史记录虽然会保留，但直接保存到本地更可靠"
      },
      {
        "title": "常见问题速查",
        "body": "<p>新手最常遇到的问题和解决方案：</p><p><strong>Q：生成的图片有水印吗？</strong></p><p>A：Nano Banana 2 生成的图片带有不可见的 SynthID 数字水印和 C2PA 凭证，肉眼看不到，不影响使用。</p><p><strong>Q：一天能生成多少张？</strong></p><p>A：免费版有每日额度限制，通常足够个人日常使用。如果需要大量生成，可以使用 API。</p><p><strong>Q：能生成真实人物的图片吗？</strong></p><p>A：出于安全考虑，模型会限制生成可识别的真实人物图像。建议使用虚构角色。</p><p><strong>Q：生成的图片版权归谁？</strong></p><p>A：根据 Google 的使用条款，你可以将生成的图片用于商业用途，但建议查阅最新的服务协议以确认。</p><p><strong>Q：图片质量不够高怎么办？</strong></p><p>A：在提示词中加上「高质量」「高分辨率」「细节丰富」等关键词，或指定具体分辨率如「2K分辨率」。</p>",
        "tip": "遇到问题先不要急——大部分问题通过调整提示词就能解决，实在不行可以在后续进阶教程中找到答案"
      }
    ],
    "solves": "不知道怎么开始使用 Gemini 生成图片",
    "outcome": "完成从注册到出图的完整操作流程，能独立生成和编辑图片",
    "fitLevel": "零基础可开始",
    "nextGuides": ["t-nb-08", "t-nb-01"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  },
  {
    "id": "t-nb-08",
    "title": "提示词入门：写出 AI 能懂的画面描述",
    "desc": "掌握Nano Banana 2提示词的基本结构和写法，从随意描述进阶到有章法的画面控制，让AI准确理解你的需求",
    "tier": "beginner",
    "difficulty": "beginner",
    "duration": "30分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "📝",
    "editorPick": true,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 8,
    "prerequisite": ["t-nb-07"],
    "content": [
      {
        "title": "提示词 = 你和 AI 之间的沟通语言",
        "body": "<p>提示词（Prompt）就是你告诉 AI「我想要什么样的图片」的那段文字。写好提示词的本质是<strong>把脑中的画面翻译成文字</strong>。</p><p>为什么有人用同一个工具出图质量差距很大？90% 的原因在提示词。</p><p><strong>提示词的核心公式</strong>：</p><ul><li><code>好的提示词 = 主体 + 风格 + 场景 + 细节 + 要求</code></li></ul><p>不需要背模板，只需要记住：<strong>你说得越具体，AI 理解得越准确</strong>。</p><p><strong>坏的例子</strong>：「画一个战士」→ AI 不知道什么风格、什么场景、什么姿势</p><p><strong>好的例子</strong>：「画一个二次元风格的女战士，穿着银色铠甲，持剑站在城墙上，背景是夕阳」→ AI 能精确理解</p>",
        "tip": "写提示词时想象你在给一个没见过你脑中画面的人做描述——你觉得理所当然的细节，AI 并不知道"
      },
      {
        "title": "提示词五要素：主体、风格、场景、细节、要求",
        "body": "<p>掌握这 5 个要素，你就能写出 80 分的提示词：</p><p><strong>1. 主体（WHAT）</strong>：画面中最重要的东西是什么？</p><ul><li>人物：角色性别、年龄、服装、姿势、表情</li><li>物品：类型、颜色、材质、数量</li><li>场景：如果没有特定主体，场景本身就是主体</li></ul><p><strong>2. 风格（STYLE）</strong>：什么画风？</p><ul><li>常见风格词：二次元、写实、赛博朋克、水彩、像素风、扁平插画、国潮</li></ul><p><strong>3. 场景（WHERE）</strong>：发生在什么环境中？</p><ul><li>室内/室外、时间（白天/夜晚）、天气、地点</li></ul><p><strong>4. 细节（DETAIL）</strong>：让画面更生动的元素</p><ul><li>光影效果、色彩倾向、粒子效果、装饰元素</li></ul><p><strong>5. 要求（SPEC）</strong>：技术规格</p><ul><li>比例（1:1, 16:9, 9:16）、分辨率、是否包含文字</li></ul>",
        "tip": "不需要每次都写全 5 个要素——简单配图可能只需要主体和风格，复杂海报才需要全部"
      },
      {
        "title": "中文提示词 vs 英文提示词",
        "body": "<p>Nano Banana 2 的一大优势是<strong>对中文提示词的理解非常好</strong>，但了解中英文的差异有助于你做出更好的选择：</p><p><strong>中文提示词的优势</strong>：</p><ul><li>直觉自然，不需要翻译思维</li><li>中文文字渲染（海报标题等）必须用中文提示</li><li>描述中国文化元素更精准（如「国潮」「水墨风」「敦煌飞天」）</li></ul><p><strong>英文提示词的优势</strong>：</p><ul><li>部分艺术风格用英文关键词更精准（如 cyberpunk, art nouveau）</li><li>参考 Midjourney 等工具的提示词时方便迁移</li></ul><p><strong>实用建议</strong>：日常使用全中文即可。遇到特定艺术风格时，可以中英混用，例如：「赛博朋克（cyberpunk）风格的城市夜景」。</p>",
        "tip": "如果你不确定某个风格的中文描述是否准确，可以在括号里加上英文作为补充"
      },
      {
        "title": "实操练习：从差到好的提示词改造",
        "body": "<p>通过 3 个真实场景，练习如何把「差提示词」改造成「好提示词」：</p><p><strong>场景 1：社媒配图</strong></p><ul><li>差：「画一个游戏截图」</li><li>好：「生成一张二次元风格的手游战斗场景截图，3个角色在释放技能，画面有华丽的光效和粒子特效，16:9比例」</li></ul><p><strong>场景 2：活动海报</strong></p><ul><li>差：「做一张活动海报」</li><li>好：「为手游春节活动生成一张海报。风格：喜庆热烈，红金配色。主体：Q版角色穿着新年服装拜年。背景：烟花和灯笼。顶部文字「新春福利大派送」。比例 9:16」</li></ul><p><strong>场景 3：角色展示图</strong></p><ul><li>差：「画一个帅气的角色」</li><li>好：「生成一张二次元角色立绘。角色：20岁左右的男性剑士，黑色短发，穿着深蓝色战斗服，佩戴红色披风。表情冷酷自信。白色纯净背景。全身立绘，3:4比例」</li></ul>",
        "tip": "改造提示词的诀窍：每次补充一个维度的信息（风格→场景→细节），观察效果变化"
      },
      {
        "title": "提示词常用词汇速查表",
        "body": "<p>收藏这份速查表，需要时直接查找合适的关键词：</p><p><strong>风格类</strong>：二次元、写实、赛博朋克、蒸汽朋克、水彩、油画、像素风、扁平插画、国潮、低多边形、极简主义、波普艺术、哥特风、日系清新</p><p><strong>氛围类</strong>：热血、温馨、神秘、恐怖、梦幻、浪漫、史诗、搞笑、治愈、燃、孤独、壮丽</p><p><strong>光影类</strong>：逆光、柔光、霓虹光、月光、黄金时刻（日落光线）、聚光灯、漫射光、体积光</p><p><strong>色调类</strong>：暖色调、冷色调、高饱和、低饱和、单色、双色调、渐变色、马卡龙色系、莫兰迪色系</p><p><strong>构图类</strong>：居中构图、三分法、对角线、框架式、俯视、仰视、特写、全景、中景</p><p><strong>质量类</strong>：高质量、高分辨率、细节丰富、精致、专业级、8K、超清</p>",
        "tip": "不需要背这些词——保存这份表，用的时候查就行。随着使用次数增加，你会自然记住常用词"
      },
      {
        "title": "5 个提示词常见错误",
        "body": "<p>新手最容易犯的 5 个错误，避开就能快速进步：</p><p><strong>错误 1：描述太模糊</strong></p><ul><li>反例：「画一个好看的图」→ AI 不知道什么叫「好看」</li><li>修正：描述具体的画面内容和风格</li></ul><p><strong>错误 2：一次要求太多</strong></p><ul><li>反例：「画一张包含10个角色在打boss同时有爆炸和下雨还要有彩虹」</li><li>修正：先画核心元素，再通过对话追加细节</li></ul><p><strong>错误 3：矛盾的描述</strong></p><ul><li>反例：「极简风格，画面要非常复杂丰富」</li><li>修正：确保风格和内容描述不冲突</li></ul><p><strong>错误 4：忘记指定比例</strong></p><ul><li>反例：不指定比例 → 可能得到不适合使用场景的尺寸</li><li>修正：根据用途指定（社媒 1:1、手机壁纸 9:16、公众号封面 2.35:1）</li></ul><p><strong>错误 5：期望一次完美</strong></p><ul><li>反例：反复重写整个提示词试图一步到位</li><li>修正：先出方向，再通过对话迭代调整</li></ul>",
        "tip": "犯错是学习的一部分。记录你的「踩坑经历」，每个错误背后都是一个实用经验"
      },
      {
        "title": "课后练习：完成 3 张图的生成",
        "body": "<p>把今天学的内容用起来，完成以下 3 个练习：</p><p><strong>练习 1（简单）</strong>：为你当前负责的游戏生成一张社媒配图</p><ul><li>要求：包含至少 3 个五要素，1:1 比例</li><li>追问修改至少 1 次</li></ul><p><strong>练习 2（中等）</strong>：生成一张带文字的活动海报</p><ul><li>要求：包含全部 5 个要素，指定中文文字内容</li><li>追问修改至少 2 次</li></ul><p><strong>练习 3（挑战）</strong>：生成同一活动的 3 种不同风格海报</p><ul><li>要求：保持核心信息不变，只改变风格和色调</li><li>比较 3 种风格的效果差异</li></ul><p>完成这 3 个练习，你对提示词的感觉会提升一个层级。</p>",
        "tip": "做完练习后，把你写的提示词保存到一个文档中——这就是你的提示词库的起点"
      }
    ],
    "solves": "提示词写不好，AI 生成的图和预期差距大",
    "outcome": "掌握提示词五要素公式，能写出清晰有效的画面描述",
    "fitLevel": "已完成 Gemini 操作入门",
    "nextGuides": ["t-nb-09", "t-nb-01"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  },
  {
    "id": "t-nb-09",
    "title": "图片编辑 101：对话式修图的 5 个必会技巧",
    "desc": "掌握Nano Banana 2的图片编辑能力，学会通过对话进行局部修改、风格调整、元素增删，让每张图都能快速达标",
    "tier": "beginner",
    "difficulty": "beginner",
    "duration": "30分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🎨",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 9,
    "prerequisite": ["t-nb-08"],
    "content": [
      {
        "title": "为什么编辑能力比生成更重要",
        "body": "<p>很多人把注意力放在「生成完美图片」上，但真正的高手知道：<strong>编辑比生成更重要</strong>。</p><p>原因很简单：</p><ul><li>一次生成就完美的概率很低（大约 10-15%）</li><li>但通过 2-3 轮编辑达到满意的概率很高（约 70-80%）</li><li>编辑是把 70 分的图变成 90 分的关键步骤</li></ul><p>Nano Banana 2 的对话式编辑是它的核心差异化优势——你不需要学 Photoshop，只需要用自然语言告诉 AI 你想改什么。</p><p><strong>编辑 vs 重新生成的选择标准</strong>：</p><ul><li>构图和主体方向对 → 编辑调细节</li><li>整体方向错 → 重新生成</li><li>超过 5 轮编辑还不满意 → 换思路重新生成</li></ul>",
        "tip": "养成习惯：生成后先花 5 秒评估「方向对不对」，方向对就编辑，方向错就重来"
      },
      {
        "title": "技巧一：局部修改——只改你想改的部分",
        "body": "<p>局部修改是最常用的编辑技巧，核心是<strong>明确告诉 AI 改什么、不改什么</strong>：</p><p><strong>标准句式</strong>：「保持 [不变的部分] 不变，只修改 [需要改的部分] 为 [目标效果]」</p><p><strong>常见局部修改场景</strong>：</p><ul><li><strong>换背景</strong>：「保持角色不变，把背景从城市换成森林」</li><li><strong>换服装</strong>：「角色的衣服从蓝色改为红色，其他不变」</li><li><strong>换表情</strong>：「把角色的表情从严肃改为微笑」</li><li><strong>换天气/时间</strong>：「场景从白天改为夜晚，加上月光效果」</li></ul><p><strong>局部修改的成功率</strong>：</p><ul><li>换背景：成功率 ~85%</li><li>换颜色：成功率 ~90%</li><li>换表情：成功率 ~70%（可能会影响其他面部特征）</li><li>换姿势：成功率 ~50%（变化大时建议重新生成）</li></ul>",
        "tip": "描述越具体，AI 越不会改错地方。「保持角色的姿势、发型和铠甲完全不变」比「保持角色不变」更安全",
        "example": "【原图】二次元女战士在城堡前\n\n【修改请求】\n请保持角色的姿势、服装和表情完全不变，只做以下修改：\n1. 背景从城堡换成樱花林\n2. 天空加上粉色的晚霞\n3. 地面加上飘落的樱花花瓣"
      },
      {
        "title": "技巧二：风格调整——改变画面整体感觉",
        "body": "<p>有时图片内容对了，但「感觉」不对。风格调整帮你修正画面的整体氛围：</p><p><strong>色调调整</strong>：</p><ul><li>「整体色调更暖一些」→ 增加黄色/橙色倾向</li><li>「画面更冷一些」→ 增加蓝色/青色倾向</li><li>「降低饱和度，更文艺一些」→ 莫兰迪色调</li><li>「提高对比度，更有冲击力」→ 增强明暗对比</li></ul><p><strong>氛围调整</strong>：</p><ul><li>「更热血/更燃一些」→ 增加动态感和亮度</li><li>「更安静/更治愈」→ 柔化光线和色彩</li><li>「更神秘一些」→ 加深暗部，增加光影对比</li></ul><p><strong>画风调整</strong>：</p><ul><li>「风格再卡通一些」→ 增加卡通感</li><li>「更写实一点」→ 增加细节和真实感</li><li>「像水彩画一样」→ 增加笔触和颜料质感</li></ul>",
        "tip": "风格调整是渐进的过程，每次调整一个维度（色调 OR 氛围 OR 画风），不要同时改多个"
      },
      {
        "title": "技巧三：元素增删——添加或移除画面元素",
        "body": "<p>往画面中添加新元素或移除不需要的元素：</p><p><strong>添加元素</strong>：</p><ul><li>「在右上角加一个月亮」</li><li>「给角色加一把武器」</li><li>「背景中加上飘落的雪花」</li><li>「在画面底部加上文字：XXX」</li></ul><p><strong>移除元素</strong>：</p><ul><li>「去掉背景中的建筑物」</li><li>「把画面中的其他角色移除，只保留主角色」</li><li>「去掉文字，保持纯画面」</li></ul><p><strong>注意事项</strong>：</p><ul><li>添加比移除通常更容易成功</li><li>移除大面积元素后，AI 需要「填补」空白区域，结果可能不自然</li><li>如果移除效果不好，可以用「把 XX 替换为 YY」代替「移除 XX」</li></ul>",
        "tip": "添加元素时说清楚位置（左上/右下/居中）和大小（小图标/占画面30%），AI 才能放对地方",
        "example": "【添加元素示例】\n请在当前图片中做以下添加：\n1. 在画面顶部居中位置添加文字「限时活动」，字体要大且醒目\n2. 在角色脚下添加发光的魔法阵效果\n3. 在画面四角添加装饰性的星光粒子"
      },
      {
        "title": "技巧四：文字编辑——修改画面上的文字",
        "body": "<p>Nano Banana 2 的文字渲染能力是一大优势，但文字编辑有一些特殊技巧：</p><p><strong>添加文字</strong>：</p><ul><li>明确指定文字内容、位置、大小和风格</li><li>例如：「在画面顶部居中添加『新春特惠』四个大字，金色字体，有发光效果」</li></ul><p><strong>修改文字</strong>：</p><ul><li>「把画面上的文字从 XX 改为 YY」</li><li>「把文字颜色从白色改为金色」</li><li>「文字再大一些 / 再小一些」</li></ul><p><strong>文字编辑的注意事项</strong>：</p><ul><li>中文控制在 4-8 个字效果最好</li><li>文字太长时容易出错，可以分行显示</li><li>英文文字的准确率通常比中文更高</li><li>如果文字反复出错，尝试简化文字内容</li></ul>",
        "tip": "先生成不带文字的图片，最后一步再添加文字——这样可以避免文字影响整体画面的生成质量"
      },
      {
        "title": "技巧五：分辨率和比例调整",
        "body": "<p>根据不同用途调整图片的分辨率和比例：</p><p><strong>比例调整</strong>：</p><ul><li>「把这张图调整为 9:16 竖版」</li><li>「转换为 1:1 方形，适合微博九宫格」</li><li>「调整为 16:9 横版，适合公众号封面」</li></ul><p><strong>分辨率提升</strong>：</p><ul><li>「把这张图提高到 2K 分辨率」</li><li>「需要更高清的版本，4K 分辨率」</li></ul><p><strong>不同用途的推荐配置</strong>：</p><table><tr><th>用途</th><th>推荐比例</th><th>推荐分辨率</th></tr><tr><td>微博九宫格</td><td>1:1</td><td>1K</td></tr><tr><td>小红书</td><td>3:4</td><td>1K</td></tr><tr><td>公众号封面</td><td>2.35:1</td><td>1K</td></tr><tr><td>手机壁纸</td><td>9:16</td><td>2K</td></tr><tr><td>投放横版</td><td>16:9</td><td>1K-2K</td></tr><tr><td>投放竖版</td><td>9:16</td><td>1K-2K</td></tr><tr><td>线下海报</td><td>自定义</td><td>4K</td></tr></table>",
        "tip": "先用低分辨率（512px）快速迭代确认方向，满意后再提升到目标分辨率——这样更省时间"
      },
      {
        "title": "编辑工作流总结：从生成到定稿的 5 步",
        "body": "<p>把 5 个技巧串联成完整的编辑工作流：</p><p><strong>第 1 步：快速生成</strong>→ 用 512px 快速出稿，不追求细节</p><p><strong>第 2 步：确认方向</strong>→ 构图和主体方向对吗？对就继续，不对就重来</p><p><strong>第 3 步：局部修改</strong>→ 修正不满意的局部元素</p><p><strong>第 4 步：风格调整</strong>→ 微调色调和氛围到最佳状态</p><p><strong>第 5 步：终稿输出</strong>→ 添加文字、调整比例和分辨率</p><p>整个流程控制在 5-10 分钟内。如果超过 10 分钟还不满意，说明需要重新思考提示词方向。</p><p><strong>练习建议</strong>：用这个流程完成 3 张不同用途的图片（社媒配图、活动海报、投放素材），体会每一步的作用。</p>",
        "tip": "编辑的终极心法：70 分方向 + 30 分编辑 = 90 分成果。不要指望一次生成 100 分"
      }
    ],
    "solves": "生成的图片不够满意但不知道怎么通过编辑改进",
    "outcome": "掌握5种核心编辑技巧，能通过对话将AI生成的图片调整到满意状态",
    "fitLevel": "已完成提示词入门",
    "nextGuides": ["t-nb-02", "t-nb-10"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  }
];

// Find the index of the last t-nb tutorial
let lastNbIndex = -1;
for (let i = 0; i < tutorials.length; i++) {
  if (tutorials[i].id && tutorials[i].id.startsWith('t-nb-')) {
    lastNbIndex = i;
  }
}

// Insert new tutorials after the last t-nb tutorial
if (lastNbIndex >= 0) {
  tutorials.splice(lastNbIndex + 1, 0, ...newTutorials);
}

fs.writeFileSync(tutorialsPath, JSON.stringify(tutorials, null, 2), 'utf8');
console.log(`✅ 批次1完成：新增 ${newTutorials.length} 篇入门基础教程 (t-nb-07, t-nb-08, t-nb-09)`);
console.log(`📊 tutorials.json 当前共 ${tutorials.length} 篇教程`);
