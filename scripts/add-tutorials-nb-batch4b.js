#!/usr/bin/env node
/**
 * Batch 4b: 进阶技巧 t-nb-20, t-nb-21, t-nb-22
 */
const fs = require('fs');
const path = require('path');

const tutorialsPath = path.join(__dirname, '..', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

const newTutorials = [
  {
    "id": "t-nb-20",
    "title": "风格控制术：精准复刻指定画风",
    "desc": "学会用精确的关键词组合控制Nano Banana 2的画面风格，从模糊的「好看」到精准的风格复刻",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "35分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🎨",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 20,
    "prerequisite": ["t-nb-17"],
    "content": [
      {
        "title": "理解「风格」的组成维度",
        "body": "<p>「风格」不是一个单一的属性，而是由多个维度共同决定的：</p><ul><li><strong>画风</strong>：二次元 / 写实 / 像素 / 水彩 / 油画 / 扁平 / 3D渲染</li><li><strong>色调</strong>：暖色 / 冷色 / 高饱和 / 低饱和 / 莫兰迪 / 马卡龙</li><li><strong>光影</strong>：柔光 / 硬光 / 逆光 / 霓虹 / 体积光 / 自然光</li><li><strong>质感</strong>：光滑 / 粗糙 / 金属 / 布料 / 玻璃 / 木质</li><li><strong>时代感</strong>：复古 / 现代 / 未来 / 古典 / 蒸汽朋克</li><li><strong>情绪</strong>：热血 / 治愈 / 恐怖 / 神秘 / 温暖 / 冰冷</li></ul><p>精准控制风格 = 同时控制这 6 个维度。只说「赛博朋克」控制了画风和时代感，但色调、光影、质感和情绪还是随机的。</p>",
        "tip": "风格控制的精度取决于你控制的维度数量——控制 3 个维度就比只控制 1 个维度精准得多"
      },
      {
        "title": "风格关键词组合系统",
        "body": "<p>建立系统化的风格关键词组合，每种组合对应一种明确的视觉效果：</p><p><strong>组合 1：赛博霓虹</strong></p><ul><li>画风：赛博朋克 + 色调：霓虹紫蓝 + 光影：霓虹灯光 + 质感：金属反光 + 情绪：酷炫</li></ul><p><strong>组合 2：日系治愈</strong></p><ul><li>画风：日式插画 + 色调：柔和暖色 + 光影：柔光 + 质感：水彩边缘 + 情绪：温暖治愈</li></ul><p><strong>组合 3：暗黑史诗</strong></p><ul><li>画风：写实奇幻 + 色调：深沉暗色 + 光影：戏剧性对比光 + 质感：粗糙金属 + 情绪：肃穆震撼</li></ul><p><strong>组合 4：国潮新锐</strong></p><ul><li>画风：国潮插画 + 色调：红金黑 + 光影：平面化光影 + 质感：传统纹样 + 情绪：大气时尚</li></ul><p><strong>组合 5：极简科技</strong></p><ul><li>画风：极简几何 + 色调：蓝白灰 + 光影：均匀柔光 + 质感：光滑磨砂 + 情绪：冷静专业</li></ul>",
        "tip": "把你常用的风格组合存成模板，每次直接粘贴——不需要每次都从头想关键词"
      },
      {
        "title": "参考游戏风格复刻",
        "body": "<p>游戏行业最常见的需求是「参考某个游戏的视觉风格」：</p><p><strong>如何描述参考风格</strong>：</p><ul><li>不要只说「参考原神」——太宽泛</li><li>要说「参考原神角色立绘的画风：精致二次元，高饱和色彩，面部细节丰富，发丝层次分明，服装有大量装饰细节」</li></ul><p><strong>常见游戏风格拆解</strong>：</p><ul><li><strong>原神风格</strong>：精致二次元，高饱和，角色比例偏写实，服装装饰丰富</li><li><strong>崩铁风格</strong>：二次元偏酷炫，光影对比强，角色姿态戏剧化</li><li><strong>明日方舟风格</strong>：硬派写实二次元，低饱和，工业感，军事元素</li><li><strong>阴阳师风格</strong>：日式和风，精致华丽，大量传统纹样</li><li><strong>王者荣耀风格</strong>：国风混搭，高饱和，角色形象夸张化</li></ul>",
        "tip": "复刻风格时把参考拆解为具体的视觉特征描述，而不是只提游戏名——AI 对具体描述的理解比游戏名更准确",
        "example": "【复刻明日方舟风格】\n生成游戏角色立绘。\n风格参考明日方舟的视觉特征：\n- 画风：硬派写实二次元，线条利落\n- 色调：低饱和度，以灰色、深蓝、暗橙为主\n- 质感：军事工业感，布料和金属材质写实\n- 角色气质：沉稳、专业、有军事感\n- 服装设计：功能性战术装备，有科技元素但不花哨\n\n角色：女性狙击手，短发，戴战术护目镜在头顶，穿深灰色战术服，背着狙击步枪。表情冷静专注。白色背景。3:4比例。"
      },
      {
        "title": "色调精准控制",
        "body": "<p>色调是决定画面「感觉」的最关键因素：</p><p><strong>色调控制的 3 个层次</strong>：</p><ol><li><strong>基础层</strong>：暖色 / 冷色 / 中性色</li><li><strong>进阶层</strong>：具体色系（蓝紫系、橙红系、粉白系）</li><li><strong>精确层</strong>：具体颜色值或参考（「主色调为深蓝 #1a1a3e」）</li></ol><p><strong>色调与情绪的对应关系</strong>：</p><table><tr><th>色调</th><th>对应情绪</th><th>适用场景</th></tr><tr><td>红金暖色</td><td>喜庆、热烈、紧迫</td><td>节日活动、限时促销</td></tr><tr><td>蓝紫冷色</td><td>神秘、高贵、科技</td><td>新版本预告、科幻场景</td></tr><tr><td>粉白柔色</td><td>治愈、可爱、浪漫</td><td>女性向、治愈系内容</td></tr><tr><td>暗色低饱和</td><td>沉稳、严肃、高级</td><td>品牌物料、商务素材</td></tr><tr><td>高饱和多彩</td><td>活力、年轻、欢快</td><td>周年庆、嘉年华活动</td></tr></table>",
        "tip": "如果你有明确的品牌色，可以用十六进制色值（如 #FF6B00）来指定——虽然 AI 不会精确到像素级，但会非常接近"
      },
      {
        "title": "光影氛围营造",
        "body": "<p>光影是让画面从「还行」到「出色」的关键：</p><p><strong>常用光影效果及提示词</strong>：</p><ul><li><strong>体积光/丁达尔效应</strong>：「光线从窗户射入，形成可见的光柱和尘埃粒子」</li><li><strong>逆光/轮廓光</strong>：「角色背后有强光源，形成发光的轮廓边缘」</li><li><strong>霓虹光</strong>：「场景中有多种颜色的霓虹灯光，在角色皮肤和衣服上形成彩色反射」</li><li><strong>黄金时刻</strong>：「夕阳的金色光线从画面左侧 30 度角照射，整体氛围温暖」</li><li><strong>月光/夜光</strong>：「月光从上方洒下，呈现冷蓝色调，投下清晰的影子」</li></ul><p><strong>光影描述的关键三要素</strong>：</p><ol><li>光源位置和方向</li><li>光的颜色和强度</li><li>投影效果</li></ol>",
        "tip": "光影描述不需要很长——一句「逆光剪影效果，光源在角色正后方」就能产生巨大的视觉差异"
      },
      {
        "title": "风格一致性：保持系列素材统一",
        "body": "<p>当你需要生成一系列风格统一的素材时：</p><p><strong>保持一致的方法</strong>：</p><ol><li><strong>建立风格前缀</strong>：把风格描述固定为一段标准文字，每次生成都粘贴</li><li><strong>参照首图</strong>：先生成一张满意的基准图，后续所有图都说「保持与之前相同的视觉风格」</li><li><strong>锁定色板</strong>：明确指定 3-4 种主要颜色，每次都使用同样的色板</li></ol><p><strong>系列素材的典型场景</strong>：</p><ul><li>同一活动的多张宣传图</li><li>角色系列立绘</li><li>社媒固定栏目配图</li><li>品牌系列物料</li></ul>",
        "tip": "风格一致性的捷径：把第一张满意的图的「成功提示词」保存为模板，后续只改内容不改风格描述"
      },
      {
        "title": "风格控制实战总结",
        "body": "<p>风格控制的核心方法论：</p><p><strong>3 步风格定义法</strong>：</p><ol><li><strong>明确目标</strong>：这张图要给人什么感觉？</li><li><strong>拆解维度</strong>：这种感觉对应什么画风、色调、光影、质感？</li><li><strong>组合关键词</strong>：用精确的关键词组合描述每个维度</li></ol><p><strong>风格控制能力分级</strong>：</p><ul><li><strong>初级</strong>：能说出「赛博朋克」等基础风格词</li><li><strong>中级</strong>：能控制画风+色调+情绪 3 个维度</li><li><strong>高级</strong>：能控制 5 个以上维度，生成结果高度可预测</li><li><strong>专家</strong>：能复刻任意参考图的风格，并在此基础上创新</li></ul><p>从初级到高级的路径：多看优秀作品 → 练习拆解风格维度 → 积累关键词组合 → 建立个人风格库。</p>",
        "tip": "风格控制是一项需要积累的技能——每次生成好图后，记录下成功的风格关键词组合，半年后你就有一个强大的风格武器库"
      }
    ],
    "solves": "生成的图片风格不可控，想要的画面感觉总是差一些",
    "outcome": "掌握6维度风格控制法，能精准复刻指定画风和氛围",
    "fitLevel": "已有基础提示词经验",
    "nextGuides": ["t-nb-21", "t-nb-22"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  },
  {
    "id": "t-nb-21",
    "title": "构图与排版：像设计师一样思考画面布局",
    "desc": "学会在提示词中控制画面构图和元素布局，让AI生成的图片不只是内容对了，而且构图专业、视觉舒适",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "35分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "📐",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 21,
    "prerequisite": ["t-nb-17"],
    "content": [
      {
        "title": "为什么构图决定图片的「专业感」",
        "body": "<p>同样的内容，不同的构图给人的感觉完全不同：</p><ul><li><strong>好构图</strong>：画面有重点、有层次、视觉路径清晰、看起来「舒服」</li><li><strong>差构图</strong>：元素堆砌、没有主次、视线无处安放、看起来「乱」</li></ul><p>大部分人用 AI 出图时只关注「画什么」，不关注「怎么摆」——这就是为什么 AI 图总是「内容对了但看起来不专业」。</p><p><strong>构图的本质</strong>：引导观众的视线，让他们先看到最重要的信息，再依次看到次要信息。</p><p>好消息：你不需要学完整的设计理论，掌握 5 种基础构图就能覆盖 90% 的场景。</p>",
        "tip": "构图是「无声的说服力」——好构图让人多看两秒，而投放素材中多看两秒就可能带来点击"
      },
      {
        "title": "5 种基础构图及使用场景",
        "body": "<p>掌握这 5 种构图，覆盖绝大部分需求：</p><p><strong>1. 居中构图</strong>：主体放在画面正中央</p><ul><li>适用：角色立绘、头像、产品展示</li><li>提示词：「角色在画面正中央」</li></ul><p><strong>2. 三分法构图</strong>：画面分为 3x3 网格，主体放在交叉点</p><ul><li>适用：风景场景、日常配图</li><li>提示词：「角色位于画面左侧三分之一处」</li></ul><p><strong>3. 对角线构图</strong>：主体沿对角线分布</p><ul><li>适用：动态场景、战斗画面</li><li>提示词：「角色从画面左下冲向右上方」</li></ul><p><strong>4. 框架构图</strong>：用前景元素框住主体</p><ul><li>适用：氛围感场景、窥探感画面</li><li>提示词：「透过石拱门看到远处的城市」</li></ul><p><strong>5. 对称构图</strong>：画面左右/上下对称</p><ul><li>适用：庄严场景、品牌物料、建筑展示</li><li>提示词：「画面完全左右对称」</li></ul>",
        "tip": "不确定用什么构图时，默认用居中构图——它是最安全、最不容易出错的选择"
      },
      {
        "title": "留白的艺术：给文字和呼吸空间",
        "body": "<p>留白是区分「AI图」和「专业设计」的关键因素：</p><p><strong>为什么需要留白</strong>：</p><ul><li>给后期添加文字留出位置</li><li>让画面不那么拥挤、更有呼吸感</li><li>引导视线聚焦到主体上</li></ul><p><strong>留白的提示词技巧</strong>：</p><ul><li>「画面上方 30% 区域保持简洁，用于放置标题文字」</li><li>「画面右侧留出 40% 的空白区域，背景为纯色渐变」</li><li>「主体集中在画面中下方，上方有大面积天空/留白」</li></ul><p><strong>各场景的留白建议</strong>：</p><table><tr><th>用途</th><th>建议留白位置</th><th>留白比例</th></tr><tr><td>海报（需加文字）</td><td>上方或下方</td><td>30-40%</td></tr><tr><td>PPT配图</td><td>右侧或左侧</td><td>30-50%</td></tr><tr><td>社媒配图</td><td>少量即可</td><td>10-20%</td></tr><tr><td>壁纸</td><td>根据设备UI布局</td><td>中心区域</td></tr></table>",
        "tip": "一张图如果你觉得「有点满」「有点挤」，很可能就是缺少留白——让 AI 把部分区域简化就好"
      },
      {
        "title": "视觉层次与焦点控制",
        "body": "<p>好的画面有清晰的视觉层次——观众知道先看什么、再看什么：</p><p><strong>建立视觉层次的方法</strong>：</p><ul><li><strong>大小对比</strong>：最重要的元素最大</li><li><strong>明暗对比</strong>：焦点区域最亮，其他区域偏暗</li><li><strong>虚实对比</strong>：焦点清晰，背景模糊（景深效果）</li><li><strong>色彩对比</strong>：焦点用对比色或高饱和色，背景用中性色</li></ul><p><strong>焦点控制提示词</strong>：</p><ul><li>「角色是画面的绝对焦点，背景模糊处理（大光圈景深效果）」</li><li>「角色身上的光线最强，周围环境偏暗」</li><li>「角色使用暖色调，背景使用冷色调，形成色彩对比」</li></ul>",
        "tip": "一张图只需要一个焦点——如果什么都是重点，就等于什么都不是重点"
      },
      {
        "title": "海报构图专项：信息层次排布",
        "body": "<p>海报是游戏行业最常见的构图需求，信息层次排布至关重要：</p><p><strong>海报三层信息结构</strong>：</p><ol><li><strong>第一层（抓眼球）</strong>：视觉主体 + 主标题 → 占画面 60%</li><li><strong>第二层（传信息）</strong>：副标题 + 活动信息 → 占画面 25%</li><li><strong>第三层（辅助）</strong>：LOGO + 日期 + 合规信息 → 占画面 15%</li></ol><p><strong>竖版海报（9:16）标准布局</strong>：</p><ul><li>顶部 20%：主标题区域</li><li>中部 50%：视觉主体（角色/场景）</li><li>下部 20%：副标题和活动信息</li><li>底部 10%：LOGO 和合规文字</li></ul><p><strong>横版海报（16:9）标准布局</strong>：</p><ul><li>左侧 40%：文字信息区域</li><li>右侧 60%：视觉主体</li><li>或反过来，取决于视觉重心</li></ul>",
        "tip": "海报构图的核心：信息有层次，视线有路径。让观众 3 秒内获取到核心信息"
      },
      {
        "title": "多图排布：系列图的构图统一",
        "body": "<p>系列图（如社媒九宫格、多张活动图）需要考虑整体排布效果：</p><p><strong>九宫格策略</strong>：</p><ul><li>9 张图合在一起要有整体感</li><li>选择统一的色调和风格</li><li>每张图的构图重心可以变化，但风格一致</li></ul><p><strong>系列图构图方法</strong>：</p><ul><li><strong>统一构图法</strong>：所有图用相同构图（如全部居中），整体感最强</li><li><strong>对称变化法</strong>：奇数图居中，偶数图三分法，有变化但不凌乱</li><li><strong>渐进变化法</strong>：从远景到近景、从暗到亮、从静到动</li></ul><p><strong>提示词示例</strong>：生成系列图时，先定义一个通用的「风格 + 构图」前缀，每张图只改内容部分。</p>",
        "tip": "系列图的构图统一性比单张图的构图完美更重要——统一感让整体效果加分"
      },
      {
        "title": "构图能力提升路径",
        "body": "<p>从「不懂构图」到「构图自如」的成长路径：</p><p><strong>阶段 1（现在）</strong>：记住 5 种基础构图，默认用居中构图</p><p><strong>阶段 2（1-2 周）</strong>：根据用途选择合适的构图，开始关注留白</p><p><strong>阶段 3（1 个月）</strong>：能控制视觉层次和焦点，海报构图有信息层次</p><p><strong>阶段 4（2-3 个月）</strong>：能为系列图设计统一的构图策略</p><p><strong>日常练习建议</strong>：</p><ul><li>看到好的游戏海报/广告，分析它的构图方式</li><li>每次用 AI 出图时，先想 2 秒「这张图用什么构图」</li><li>生成后评估构图效果，记录成功的构图提示词</li></ul>",
        "tip": "构图的「直觉」来自大量的观察积累——多看优秀作品比多学理论更有效"
      }
    ],
    "solves": "AI生成的图片内容对了但构图杂乱、不够专业",
    "outcome": "掌握5种构图方法和留白技巧，AI出图的构图质量接近专业水平",
    "fitLevel": "已有基础提示词经验",
    "nextGuides": ["t-nb-22", "t-nb-20"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  },
  {
    "id": "t-nb-22",
    "title": "多分辨率输出策略：从 512px 到 4K 的使用指南",
    "desc": "根据不同使用场景选择最优分辨率策略，平衡生成速度、图片质量和成本，建立高效的分辨率工作流",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "25分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "📏",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 22,
    "prerequisite": ["t-nb-08"],
    "content": [
      {
        "title": "分辨率选择的核心逻辑",
        "body": "<p>分辨率不是越高越好——而是<strong>用途决定分辨率</strong>：</p><table><tr><th>分辨率</th><th>生成时间</th><th>适用场景</th><th>文件大小</th></tr><tr><td>512px</td><td>3-8 秒</td><td>快速草稿、A/B测试、内部讨论</td><td>~100KB</td></tr><tr><td>1K (1024px)</td><td>5-15 秒</td><td>社媒配图、信息流广告、活动海报</td><td>~500KB</td></tr><tr><td>2K (2048px)</td><td>10-25 秒</td><td>高质量海报、商店页截图、媒体素材</td><td>~2MB</td></tr><tr><td>4K (4096px)</td><td>15-40 秒</td><td>线下印刷、展会物料、超大屏展示</td><td>~8MB</td></tr></table><p><strong>核心原则</strong>：</p><ul><li>速度优先的场景 → 512px 或 1K</li><li>质量优先的场景 → 2K 或 4K</li><li>不确定时 → 先 1K，需要时再提升</li></ul>",
        "tip": "80% 的日常需求用 1K 就够了。不要养成什么都用 4K 的习惯——浪费时间和存储空间"
      },
      {
        "title": "512px 快速模式：速度即正义",
        "body": "<p>512px 是你的「草稿利器」，用得好能大幅提升效率：</p><p><strong>512px 最佳使用场景</strong>：</p><ul><li><strong>概念探索</strong>：一次生成 10 个方向，快速筛选</li><li><strong>提示词调试</strong>：验证提示词效果，满意后再出高分辨率</li><li><strong>A/B 变体预览</strong>：快速看多种变体的大致效果</li><li><strong>内部沟通</strong>：发给团队做方向确认</li></ul><p><strong>512px 的局限</strong>：</p><ul><li>细节不够清晰，不适合最终发布</li><li>文字渲染质量会下降</li><li>放大后明显模糊</li></ul><p><strong>高效用法</strong>：先用 512px 快速迭代 3-5 轮找到满意的方向和构图，然后用同一个提示词生成 2K/4K 终稿。</p>",
        "tip": "512px 快速模式是「省时间」的关键——用 3 秒出一张草图比用 40 秒出一张高清图，效率高 13 倍"
      },
      {
        "title": "1K 标准模式：日常主力分辨率",
        "body": "<p>1K 是性价比最高的分辨率，覆盖大部分日常需求：</p><p><strong>1K 适用的具体平台</strong>：</p><ul><li>微博配图：1K 绰绰有余</li><li>小红书配图：1K 满足要求</li><li>公众号封面：1K 满足要求</li><li>信息流广告：1K 是主流尺寸</li><li>应用内弹窗/横幅：1K 足够</li></ul><p><strong>1K 出图质量提升技巧</strong>：</p><ul><li>在提示词中加上「高质量」「细节丰富」</li><li>画面不要太复杂（元素越少，单个元素的质量越高）</li><li>文字用 1K 渲染效果好，字号不要太小</li></ul>",
        "tip": "1K 是「速度和质量的最佳平衡点」——5-15 秒的等待时间不影响工作节奏，质量也满足发布要求"
      },
      {
        "title": "2K-4K 高清模式：品质场景专用",
        "body": "<p>2K 和 4K 用于质量要求高的正式场景：</p><p><strong>2K 适用场景</strong>：</p><ul><li>正式活动海报（线上发布）</li><li>商店页主图和截图</li><li>媒体资源包中的高清素材</li><li>PPT 大屏演示的配图</li></ul><p><strong>4K 适用场景</strong>：</p><ul><li>线下印刷物料（海报、展架、易拉宝）</li><li>展会大屏展示</li><li>超高清壁纸</li><li>媒体发布用的旗舰素材</li></ul><p><strong>高清模式注意事项</strong>：</p><ul><li>生成时间显著增加，做好等待准备</li><li>高分辨率下 AI 会增加更多细节，有时反而引入更多瑕疵</li><li>建议先 1K 确认满意，再提升到高分辨率</li></ul>",
        "tip": "4K 出图时偶尔会出现 1K 没有的小瑕疵——生成后仔细检查边缘和细节区域"
      },
      {
        "title": "分辨率升级策略：从低到高的渐进式工作流",
        "body": "<p>最高效的分辨率工作流是<strong>渐进式升级</strong>：</p><p><strong>标准工作流</strong>：</p><ol><li><strong>512px 探索</strong>（3-5 轮）→ 确定方向和构图</li><li><strong>1K 定稿</strong>（1-2 轮）→ 确认所有细节满意</li><li><strong>2K/4K 终稿</strong>（1 轮）→ 用满意的提示词出终稿</li></ol><p><strong>跳过步骤的场景</strong>：</p><ul><li>已有成熟模板 → 直接 1K 出稿</li><li>紧急出图 → 直接 1K 出稿发布</li><li>线下物料 → 1K 确认后直接出 4K</li></ul><p><strong>从低分辨率升级到高分辨率</strong>：</p><ul><li>用完全相同的提示词重新生成高分辨率版本</li><li>或者在对话中说「把这张图提高到 2K/4K 分辨率」</li></ul>",
        "tip": "千万不要一上来就用 4K——花 40 秒出一张不满意的 4K 图，不如花 3 秒出一张 512px 看看方向对不对"
      },
      {
        "title": "不同分辨率的成本对比",
        "body": "<p>如果使用 API，分辨率直接影响成本：</p><table><tr><th>分辨率</th><th>单张成本（API）</th><th>月产100张</th><th>月产500张</th></tr><tr><td>512px</td><td>~¥0.15</td><td>¥15</td><td>¥75</td></tr><tr><td>1K</td><td>~¥0.33</td><td>¥33</td><td>¥165</td></tr><tr><td>2K</td><td>~¥0.66</td><td>¥66</td><td>¥330</td></tr><tr><td>4K</td><td>~¥1.30</td><td>¥130</td><td>¥650</td></tr></table><p><strong>成本优化策略</strong>：</p><ul><li>探索和调试阶段全部用 512px → 节省 80% 成本</li><li>日常发布用 1K → 性价比最高</li><li>只有必要场景才用 4K → 控制高成本产出</li></ul><p>通过合理的分辨率策略，月度 AI 出图成本可以控制在<strong>几百元以内</strong>，同时满足所有质量要求。</p>",
        "tip": "分辨率策略本质上是「成本管理」——用最低的分辨率满足当前场景的质量要求"
      },
      {
        "title": "分辨率策略速查表",
        "body": "<p>保存这份速查表，遇到任何出图需求直接查：</p><table><tr><th>场景</th><th>推荐分辨率</th><th>原因</th></tr><tr><td>提示词调试</td><td>512px</td><td>速度最快，省成本</td></tr><tr><td>概念探索</td><td>512px</td><td>看方向不看细节</td></tr><tr><td>内部讨论</td><td>512px-1K</td><td>传达意思即可</td></tr><tr><td>微博/小红书</td><td>1K</td><td>平台压缩后差异不大</td></tr><tr><td>信息流广告</td><td>1K</td><td>缩略图展示，1K够用</td></tr><tr><td>公众号封面</td><td>1K</td><td>标准需求</td></tr><tr><td>正式活动海报</td><td>2K</td><td>需要清晰细节</td></tr><tr><td>商店页截图</td><td>2K</td><td>需要高质量展示</td></tr><tr><td>媒体新闻稿</td><td>2K</td><td>媒体质量标准</td></tr><tr><td>线下海报印刷</td><td>4K</td><td>印刷要求高分辨率</td></tr><tr><td>展会大屏</td><td>4K</td><td>超大尺寸展示</td></tr></table>",
        "tip": "这份表打印出来贴在工位旁边——每次出图前扫一眼就能选对分辨率，避免浪费"
      }
    ],
    "solves": "不知道什么场景用什么分辨率，要么浪费时间出太高清的图，要么质量不够用",
    "outcome": "建立分辨率选择的决策框架，每次出图都用最优分辨率",
    "fitLevel": "已有基础提示词经验",
    "nextGuides": ["t-nb-23", "t-nb-06"],
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
console.log(`✅ 批次4b完成：新增 ${newTutorials.length} 篇进阶技巧教程 (t-nb-20~22)`);
console.log(`📊 tutorials.json 当前共 ${tutorials.length} 篇教程`);
