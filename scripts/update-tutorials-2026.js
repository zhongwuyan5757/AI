#!/usr/bin/env node
/**
 * update-tutorials-2026.js
 * 全面更新实战指南内容，替换过时模型引用为2026年3月最新模型
 * - GPT-4o → GPT-5 / GPT-5.4
 * - Claude 3.5 → Claude Opus 4.6 / Sonnet 4.6
 * - Gemini 1.5 → Gemini 3.1 Pro
 * - Midjourney v6 → Midjourney V7 + Niji 7
 * - SD 1.5/XL → SD 3.5 + FLUX.2
 * - 添加 Nano Banana 2、Sora 2、Kling 3.0 等最新工具
 */
const fs = require('fs');
const path = require('path');
const TUTS_FILE = path.join(__dirname, '..', 'data', 'tutorials.json');
const tuts = JSON.parse(fs.readFileSync(TUTS_FILE, 'utf8'));

// ========== t001: ChatGPT 从入门到精通 ==========
const t001 = tuts.find(t => t.id === 't001');
t001.title = 'ChatGPT (GPT-5) 从入门到精通';
t001.desc = '零基础学会使用最新GPT-5模型，掌握对话技巧、自适应推理和高级功能';
t001.content = [
  {
    title: '认识 ChatGPT 与 GPT-5 模型',
    body: '<p>打开 <strong>chatgpt.com</strong>，注册账号后进入对话界面。2026年ChatGPT已全面升级：</p><ul><li><strong>GPT-5</strong>（默认模型）：自适应推理，自动决定何时深度思考，196K上下文</li><li><strong>GPT-5.4</strong>（最新迭代）：更精确的响应，SWE-bench 77.2%</li><li>旧模型（GPT-4o、GPT-4.1）已于2026年2月正式退役</li></ul><p>免费用户可使用GPT-5基础版，Plus用户解锁GPT-5.4和更高配额。</p>',
    tip: 'GPT-5自带推理能力，不再需要手动切换o3/o4模型——它会自动判断是否需要深度推理'
  },
  {
    title: '写好你的第一个 Prompt',
    body: '<p>Prompt就是你给AI的指令。好的Prompt = 清晰的目标 + 足够的背景信息 + 明确的输出格式。</p><p>关键原则：<strong>越具体越好</strong>。不要说"帮我写个文案"，而要说"帮我写一条针对18-25岁手游玩家的新版本预告微博文案"。</p><p>GPT-5的幻觉率比GPT-4o降低45%，但仍需注意事实核验。</p>',
    tip: '在Prompt开头加上角色设定效果最佳，例如"你是一名资深游戏运营专家"',
    example: '角色：你是一名有10年经验的游戏市场总监\n任务：为我们的二次元RPG手游新版本撰写一条微博预告\n要求：\n- 目标用户：18-25岁二次元爱好者\n- 卖点：新SSR角色"月华"上线\n- 语气：轻松有趣、带梗\n- 字数：120字以内\n- 带2个相关话题标签'
  },
  {
    title: '学会追问和迭代',
    body: '<p>AI输出的第一版很少是完美的，关键在于<strong>迭代优化</strong>：</p><ul><li>追问细节："请更详细地展开第3点"</li><li>调整风格："语气再活泼一些，加入emoji"</li><li>限制范围："只保留与游戏行业相关的内容"</li><li>否定重来："这个方向不对，换一个角度，从玩家痛点出发"</li></ul><p>GPT-5的196K上下文窗口意味着整个长对话都不会丢失信息。</p>',
    tip: '善用"保持XXX不变，只修改YYY"这种精确迭代指令'
  },
  {
    title: '自适应推理与深度思考',
    body: '<p>GPT-5最大的突破是<strong>自适应推理（Adaptive Reasoning）</strong>：</p><ul><li>简单问题（翻译、改写）→ 秒速回复，不浪费tokens</li><li>复杂问题（数学推理、代码debug、策略分析）→ 自动启动深度推理链</li><li>比旧的o3模型输出tokens减少50-80%，但效果更好</li></ul><p>你也可以手动要求："请仔细想一想再回答"来触发深度推理。</p>',
    tip: '遇到需要严密逻辑的任务（数值平衡、竞品分析），在Prompt中加"step by step"仍然有效',
    example: '请仔细分析以下游戏经济系统是否存在通胀风险，step by step：\n- 日常任务产出金币：5000/天\n- 主线关卡产出：每章10000\n- 商店消耗：武器2000-50000\n- 抽卡消耗：单抽300钻石\n请给出定量分析和调整建议。'
  },
  {
    title: '使用 GPTs 和自定义指令',
    body: '<p>GPTs让你创建专属AI助手：</p><ul><li><strong>系统指令</strong>：设定AI的固定角色和行为规范</li><li><strong>知识库</strong>：上传公司文档、品牌指南，AI回答基于这些资料</li><li><strong>游戏运营GPT</strong>：上传活动SOP、历史数据模板，一键生成标准化方案</li></ul><p>GPT Store已有大量现成的游戏行业GPTs可直接使用。</p>',
    tip: '为团队创建统一的GPT，确保所有人用同样的品牌语气和标准输出'
  },
  {
    title: '多模态能力实战',
    body: '<p>GPT-5原生支持多模态（文字+图片+文件+语音）：</p><ul><li><strong>图片分析</strong>：上传游戏UI截图，让AI分析用户体验问题</li><li><strong>文件处理</strong>：上传Excel运营数据，自动生成分析报告和图表</li><li><strong>GPT Image 1.5</strong>：取代DALL-E 3的新一代图片生成，文字渲染能力最强</li><li><strong>语音对话</strong>：支持实时语音交互进行头脑风暴</li></ul>',
    tip: 'GPT Image 1.5 在LM Arena排名第一（1264分），特别擅长生成带精准文字的营销图',
    example: '上传一张竞品App Store截图，然后说：\n"请分析这个游戏的商店页面设计，从标题、副标题、截图排布、评分区域分别给出优劣势分析，并给出我们可以借鉴的3个具体建议。"'
  },
  {
    title: '联网搜索与实时信息',
    body: '<p>GPT-5内置联网搜索，可获取最新信息：</p><ul><li>游戏行业最新政策、版号动态</li><li>竞品最新版本更新和市场表现</li><li>行业报告和数据引用（带来源链接）</li></ul><p>搜索结果自动整合进回答中，引用原始来源。</p>',
    tip: '要求"搜索最近一周的数据"可以确保信息时效性'
  },
  {
    title: '实战练习：生成本周工作计划',
    body: '<p>综合运用上述技巧，完成一个实际工作任务：</p><ol><li>设定角色和背景："你是XX游戏的运营主管"</li><li>上传上周的运营数据表格</li><li>要求生成本周工作计划，包含优先级排序</li><li>让AI用Markdown表格输出，便于直接使用</li><li>迭代优化直到满意</li></ol>',
    example: '角色：你是一款SLG手游的运营主管\n背景：上周DAU下降8%，付费率持平，新版本将在下周三上线\n任务：请生成本周的工作计划\n要求：\n1. 按优先级P0/P1/P2排列\n2. 每项任务包含：任务名、负责人建议、预计耗时、完成标准\n3. 用Markdown表格输出\n4. 重点关注DAU回升策略和新版本预热'
  }
];
t001.steps = t001.content.length;

// ========== t002: Claude 高效使用指南 ==========
const t002 = tuts.find(t => t.id === 't002');
t002.title = 'Claude 4.6 高效使用指南';
t002.desc = '掌握Claude Opus 4.6和Sonnet 4.6的核心能力：长文档分析、深度推理、Projects知识库和Agent模式';
t002.content = [
  {
    title: '为什么选择 Claude 4.6',
    body: '<p>Claude 4.6是2026年2月发布的最新模型系列，在多项核心能力上领先：</p><ul><li><strong>Opus 4.6</strong>：SWE-bench 79.2%（#1）、文本竞技场排名#1，支持14.5小时长任务自主完成</li><li><strong>Sonnet 4.6</strong>：接近Opus性能但价格更低，70%开发者偏好（vs Sonnet 4.5）</li><li><strong>200K上下文</strong>（1M Beta），128K最大输出——一次处理整本书或大型代码库</li></ul><p>核心优势场景：长文档分析、深度推理、代码生成、策划方案撰写。</p>',
    tip: '免费用户默认使用Sonnet 4.6（已经很强），Pro用户解锁Opus 4.6和更高配额'
  },
  {
    title: '上手 Claude 对话界面',
    body: '<p>访问 <strong>claude.ai</strong> 进入对话界面：</p><ul><li>支持文字、图片、文件（PDF/Excel/代码等）多模态输入</li><li>自适应思考（Adaptive Thinking）：Claude自动决定思考深度</li><li>新增<strong>快速模式</strong>：Opus 4.6输出速度提升2.5倍（Pro用户）</li><li>联网搜索：内置动态过滤的网络搜索能力</li></ul>',
    tip: '对于需要深度分析的问题，可以在Prompt开头加"请深入思考"来激活扩展思维模式'
  },
  {
    title: '长文档一键总结与分析',
    body: '<p>Claude的200K上下文是<strong>真正可用的长文本能力</strong>（非截断填充）：</p><ul><li>上传完整的游戏策划文档（GDD），让Claude找出逻辑矛盾</li><li>上传竞品分析报告，提取关键发现并生成对比表</li><li>上传一个月的运营周报，总结趋势并预测下月重点</li></ul>',
    tip: '处理超长文档时，先让Claude"列出这份文档的关键要点"，再针对性深入',
    example: '请分析这份80页的游戏GDD文档：\n1. 首先列出10个最核心的设计要点\n2. 指出3个可能存在的逻辑矛盾或设计冲突\n3. 与市面上类似品类的标杆产品对比，指出差异化不足的地方\n4. 给出5条可操作的优化建议，按优先级排序'
  },
  {
    title: '用 Claude 撰写策划方案',
    body: '<p>Claude在长篇结构化写作上表现突出（128K最大输出）：</p><ul><li>游戏活动策划方案（含时间线、奖励设计、预算估算）</li><li>产品需求文档（PRD）完整输出</li><li>商业计划书和投资汇报材料</li></ul><p>技巧：先提供框架大纲，让Claude逐章展开，比一次性生成效果更好。</p>',
    example: '请根据以下框架撰写春节活动策划方案：\n\n一、活动概述（目标、时间、主题）\n二、活动设计（3个子活动详细玩法）\n三、奖励设计（资源预算表）\n四、运营节奏（每日任务+里程碑）\n五、风险预案\n六、数据追踪指标\n\n游戏类型：二次元卡牌RPG\n目标：DAU提升20%，付费率提升5%\n预算：100万钻石 + 1个限定SSR'
  },
  {
    title: '深度分析与逻辑推理',
    body: '<p>Opus 4.6的推理能力是目前大模型中最强的之一：</p><ul><li><strong>数值验证</strong>：上传游戏经济系统表格，让Claude检查是否存在通胀或资源溢出</li><li><strong>逻辑推导</strong>：分析用户留存漏斗中的关键流失节点</li><li><strong>多方案对比</strong>：给出多个方案让Claude从ROI、风险、可行性三维度打分</li></ul>',
    tip: '复杂推理任务中，让Claude先"列出关键假设和前提"再分析，结论会更可靠'
  },
  {
    title: 'Projects 功能：团队知识库',
    body: '<p>Projects是Claude最强大的团队功能：</p><ul><li>上传公司所有文档（品牌指南、SOP、历史方案），构建团队专属知识库</li><li>每次对话基于知识库回答，输出更贴合公司风格</li><li>团队成员共享同一个Project，确保信息一致性</li><li>支持自定义System Prompt，设定团队统一的AI行为规范</li></ul>',
    tip: '建议为每个业务线创建独立Project：如"品牌部-内容规范"、"运营部-活动模板"',
    example: '在Project中设置System Prompt：\n"你是FiveSeven Games的AI运营助手。回答基于以下规范：\n1. 品牌语气：专业但不刻板，适度幽默\n2. 目标用户：18-30岁核心玩家\n3. 数据敏感：不要在输出中暴露具体收入数据\n4. 输出格式：默认使用Markdown，表格优先"'
  },
  {
    title: '实战对比：ChatGPT GPT-5 vs Claude 4.6',
    body: '<p>两者各有优势，根据任务选择：</p><table><tr><th>场景</th><th>推荐</th><th>原因</th></tr><tr><td>超长文档分析</td><td>Claude 4.6</td><td>200K真实上下文，不丢信息</td></tr><tr><td>日常快速问答</td><td>GPT-5</td><td>自适应推理，响应更快</td></tr><tr><td>代码生成与调试</td><td>Claude Opus 4.6</td><td>SWE-bench #1</td></tr><tr><td>图片生成</td><td>GPT-5 (Image 1.5)</td><td>文字渲染能力最强</td></tr><tr><td>结构化方案撰写</td><td>Claude 4.6</td><td>128K输出无截断</td></tr><tr><td>联网搜索实时信息</td><td>两者均可</td><td>都内置联网搜索</td></tr></table>',
    tip: '最佳实践：用Perplexity做前期调研 → Claude撰写深度方案 → GPT-5做快速迭代和润色'
  }
];
t002.steps = t002.content.length;

// ========== t005: Midjourney 游戏美术应用 ==========
const t005 = tuts.find(t => t.id === 't005');
t005.title = 'Midjourney V7 游戏美术应用';
t005.desc = '系统学习Midjourney V7在游戏概念设计、角色场景设计和营销素材中的最新应用技巧';
t005.content = [
  {
    title: 'Midjourney V7 全新架构',
    body: '<p>2025年发布的<strong>Midjourney V7</strong>是一次完整的架构重构：</p><ul><li>坏图率降低30-40%，出图质量大幅提升</li><li><strong>Draft Mode</strong>：10倍速度、一半成本，适合快速概念探索</li><li>个性化（Personalization）默认开启，学习你的审美偏好</li><li>NeRF-like 3D建模能力，可生成简单3D物体</li><li><strong>Niji 7</strong>（2026年1月）：二次元风格专用模型</li></ul>',
    tip: '新项目先用Draft Mode快速探索10-20个方向，选定后再用标准模式精修'
  },
  {
    title: '游戏概念设计 Prompt 基础',
    body: '<p>V7的Prompt理解能力更强，但基本框架不变：</p><p><strong>主体 + 风格 + 媒介 + 光影 + 色调 + 构图</strong></p><ul><li>主体：描述你要生成的内容（角色、场景、道具）</li><li>风格：concept art, digital painting, cel shading, realistic rendering</li><li>媒介：Unreal Engine 5, watercolor, oil painting, pixel art</li></ul>',
    example: 'A fierce dragon warrior in crystalline armor, wielding a flame sword, standing on a cliff overlooking a futuristic cyberpunk city at sunset, concept art style, dramatic volumetric lighting, cinematic composition --ar 16:9 --v 7'
  },
  {
    title: '风格关键词速查',
    body: '<p>V7对风格关键词的响应更精准：</p><ul><li><strong>写实风</strong>：photorealistic, hyperdetailed, 8k, RAW photo</li><li><strong>赛博朋克</strong>：cyberpunk, neon-lit, holographic, chrome</li><li><strong>奇幻风</strong>：fantasy art, ethereal, magical atmosphere, mystical</li><li><strong>二次元</strong>：切换Niji 7模型 --niji 7 效果最佳</li><li><strong>复古像素</strong>：pixel art, retro game style, 16-bit, sprite sheet</li></ul>',
    tip: 'V7支持更长的自然语言描述，不再需要堆砌关键词——用完整句子描述效果更好'
  },
  {
    title: '参数调优详解',
    body: '<p>V7核心参数：</p><ul><li><strong>--ar</strong> 比例：16:9（横版）、9:16（竖版）、1:1（头像/图标）</li><li><strong>--s (stylize)</strong> 0-1000：越高越有艺术感，越低越贴合Prompt</li><li><strong>--c (chaos)</strong> 0-100：越高变化越大，适合探索阶段</li><li><strong>--q (quality)</strong> .25/.5/1：影响细节程度和生成时间</li><li><strong>--p (personalization)</strong>：应用你的个人审美模型</li><li><strong>--draft</strong>：开启草稿模式（10x速度）</li></ul>',
    example: '-- 探索阶段（快速、多变）：\ngame character design, cyberpunk samurai --ar 1:1 --draft --c 50 --s 200\n\n-- 精修阶段（高质量、稳定）：\ngame character design, cyberpunk samurai --ar 1:1 --q 1 --s 750 --c 10'
  },
  {
    title: '角色设计工作流',
    body: '<p>用Midjourney V7进行游戏角色设计的标准流程：</p><ol><li><strong>概念探索</strong>：Draft Mode + 高chaos生成20-30张草图</li><li><strong>方向选定</strong>：选取3-5个方向用标准模式精修</li><li><strong>变体生成</strong>：对满意的图用Vary(Subtle/Strong)生成变体</li><li><strong>角色三视图</strong>：添加"character turnaround sheet, front side back"</li><li><strong>细节放大</strong>：Upscale后截取局部用于设定集</li></ol>',
    example: '-- 角色三视图：\ncharacter turnaround sheet of a female elf mage, front view, side view, back view, full body, white background, game character design, cel shading style --ar 16:9 --v 7\n\n-- 表情集：\nemotion expression sheet of a cute cat warrior character, happy sad angry surprised, chibi style, game asset --niji 7 --ar 16:9'
  },
  {
    title: '场景与环境设计',
    body: '<p>V7在大场景渲染上进步最大：</p><ul><li><strong>游戏关卡场景</strong>：描述地形、建筑、光照、氛围</li><li><strong>主城设计</strong>：城市全貌、建筑细节、NPC活动</li><li><strong>战斗场景</strong>：特效、粒子、动态感</li></ul>',
    example: 'epic fantasy RPG battle scene, a dragon descending upon a medieval fortress, soldiers defending with magical barriers, fire and lightning effects, dramatic top-down perspective, game concept art, volumetric fog, golden hour lighting --ar 21:9 --v 7 --s 800'
  },
  {
    title: '营销素材快速生成',
    body: '<p>用V7快速制作游戏营销物料：</p><ul><li><strong>App Store截图背景</strong>：配合文字排版的场景图</li><li><strong>社交媒体banner</strong>：16:9横幅 + 品牌色调</li><li><strong>活动海报底图</strong>：节日主题、赛季主题</li></ul><p>注意：V7的文字渲染仍然较弱，文字部分建议后期用Canva/PS叠加。</p>',
    tip: '如果需要带精准文字的营销图，可以结合GPT Image 1.5（文字渲染最强）'
  },
  {
    title: '图生图与风格迁移',
    body: '<p>V7的图生图能力大幅增强：</p><ul><li><strong>Image Prompt</strong>：上传参考图 + 文字描述，融合生成</li><li><strong>Style Reference (--sref)</strong>：上传风格参考图，保持统一美术风格</li><li><strong>Character Reference (--cref)</strong>：保持角色一致性的关键功能</li></ul>',
    example: '-- 保持角色一致：\n[上传角色图] a warrior exploring an ancient temple, same character, different pose --cref [角色图URL] --cw 100 --v 7\n\n-- 统一美术风格：\n[上传风格参考] game scene design in this art style --sref [风格图URL] --sw 100 --v 7'
  },
  {
    title: 'Niji 7：二次元专项',
    body: '<p><strong>Niji 7</strong>（2026年1月发布）是专为动漫/二次元优化的模型：</p><ul><li>人物比例、表情、服装细节远超通用模型</li><li>支持各种二次元子风格：写实二次元、Q版、水墨风、厚涂</li><li>角色一致性更好，适合生成立绘和表情包</li></ul>',
    example: 'beautiful anime girl mage character, casting ice magic, flowing silver hair, detailed blue crystal staff, magical particles, vibrant colors, studio lighting --niji 7 --ar 2:3 --s 600'
  },
  {
    title: 'Nano Banana 2 与 FLUX.2 对比',
    body: '<p>2026年图片生成领域三足鼎立，根据需求选择：</p><table><tr><th>工具</th><th>优势</th><th>适合场景</th></tr><tr><td>Midjourney V7</td><td>艺术质感最强</td><td>概念设计、美术参考</td></tr><tr><td>Nano Banana 2 (Google)</td><td>角色一致性、文字精准</td><td>多角色场景、带文字素材</td></tr><tr><td>FLUX.2</td><td>Prompt跟随性最佳、开源</td><td>精确控制、本地部署</td></tr><tr><td>GPT Image 1.5</td><td>文字渲染#1</td><td>营销图、社交海报</td></tr></table>',
    tip: 'Nano Banana 2 可在 Gemini App 中免费使用，支持5个角色一致性和精准文字渲染，特别适合游戏角色宣传图'
  },
  {
    title: '常见问题与解决方案',
    body: '<ul><li><strong>出图模糊</strong>：使用--q 1参数，或Upscale后再下载</li><li><strong>人物变形</strong>：添加"anatomically correct, well-proportioned"</li><li><strong>文字渲染差</strong>：改用GPT Image 1.5或Nano Banana 2</li><li><strong>风格不一致</strong>：使用--sref统一风格参考</li><li><strong>生成太慢</strong>：使用--draft模式做初步探索</li></ul>',
    tip: '养成保存好的seed（--seed XXXX）的习惯，方便复现和微调'
  },
  {
    title: '实战：制作游戏宣传海报',
    body: '<p>综合运用V7功能制作一张游戏宣传海报：</p><ol><li>用Draft Mode探索10个构图方向</li><li>选择最佳方向，用标准模式精修</li><li>用--cref保持主角一致</li><li>Upscale输出高清版本</li><li>在Canva/PS中添加标题文字和logo</li></ol>',
    example: 'epic game launch poster, a legendary hero wielding dual elemental blades, standing atop a crystal mountain, ancient ruins in the background, energy particles swirling, cinematic wide shot, movie poster composition, dramatic rim lighting, dark fantasy color palette --ar 2:3 --v 7 --s 900 --q 1'
  }
];
t005.steps = t005.content.length;

// ========== t006: Stable Diffusion 本地部署与进阶 ==========
const t006 = tuts.find(t => t.id === 't006');
t006.title = 'Stable Diffusion 3.5 与 FLUX.2 本地部署';
t006.desc = '学习SD 3.5/FLUX.2本地部署、LoRA训练和ComfyUI工作流搭建，实现游戏素材流水线';
t006.content = [
  {
    title: '硬件需求与2026技术栈选择',
    body: '<p>2026年本地AI绘图有两大主力：</p><ul><li><strong>Stable Diffusion 3.5</strong>：三版本（8B Large / 2.5B Medium / Large Turbo），生态最成熟</li><li><strong>FLUX.2</strong>：Black Forest Labs出品，Prompt跟随性最佳，三版本（Pro / Dev / Klein）</li></ul><p>硬件建议：<ul><li>入门：RTX 4060 8GB（可跑SD 3.5 Medium）</li><li>推荐：RTX 4070Ti 12GB（流畅跑SD 3.5 Large + FLUX.2 Dev）</li><li>专业：RTX 4090 24GB（全模型无压力 + LoRA训练）</li></ul></p>',
    tip: 'SD 3.5 Medium只需约10GB显存，是性价比最高的入门选择'
  },
  {
    title: '安装 ComfyUI 环境',
    body: '<p>2026年<strong>ComfyUI</strong>已成为主流工具（取代A1111 WebUI）：</p><ul><li>节点式工作流，可视化搭建生成流水线</li><li>原生支持SD 3.5、FLUX.2、HunyuanImage等所有主流模型</li><li>社区工作流分享生态，一键导入复杂流程</li></ul><p>安装步骤：Python 3.11 + PyTorch → 克隆ComfyUI仓库 → 下载模型文件 → 启动。</p>',
    tip: '推荐使用ComfyUI Manager插件，一键安装缺失节点和模型'
  },
  {
    title: '基础出图与模型选择',
    body: '<p>根据游戏美术需求选模型：</p><ul><li><strong>SD 3.5 Large</strong>：通用高质量，社区模型/LoRA最丰富</li><li><strong>SD 3.5 Large Turbo</strong>：4-8步快速出图，适合批量生产</li><li><strong>FLUX.2 Dev</strong>：开源最佳，Prompt精确跟随，写实风强</li><li><strong>FLUX.2 Klein</strong>：亚秒级生成，实时预览</li></ul>',
    tip: '批量素材生产用SD 3.5 Turbo（速度快），精品制作用FLUX.2 Dev（质量高）'
  },
  {
    title: 'ControlNet 精确控制',
    body: '<p>ControlNet让你精确控制生成结果：</p><ul><li><strong>Canny边缘</strong>：保持轮廓线条，换风格不变形状</li><li><strong>Depth深度</strong>：保持空间层次，替换场景元素</li><li><strong>OpenPose姿态</strong>：精确控制人物动作和姿势</li><li><strong>Reference参考</strong>：保持角色/风格一致性</li></ul><p>在ComfyUI中，ControlNet作为节点接入工作流，可多个ControlNet叠加使用。</p>',
    example: '游戏角色设计工作流：\n1. 先用简笔画画出角色基本造型\n2. Canny ControlNet保持轮廓 + 文字Prompt描述风格\n3. 生成多种风格变体\n4. 选定风格后用img2img精修细节'
  },
  {
    title: 'LoRA训练：公司专属风格',
    body: '<p>LoRA训练让AI学习你公司的美术风格：</p><ul><li>准备20-50张公司游戏美术作品作为训练集</li><li>使用Kohya_ss训练工具，GPU训练约1-2小时</li><li>产出轻量LoRA文件（50-200MB），可叠加到任何基础模型</li></ul><p>训练后团队所有人出图都能保持统一的品牌视觉风格。</p>',
    tip: '训练图片质量 > 数量，选择最能代表公司美术风格的精品图'
  },
  {
    title: 'ComfyUI 批量生成工作流',
    body: '<p>搭建自动化批量生成流水线：</p><ul><li>Excel读取Prompt列表 → 批量生成 → 自动命名保存</li><li>多尺寸同时输出（App Store截图、社交媒体图、缩略图）</li><li>ControlNet + LoRA + 文生图一体化流水线</li></ul><p>一个成熟的ComfyUI工作流可以实现：<strong>一键生成一套完整的游戏营销素材包</strong>。</p>',
    tip: '将成熟的工作流导出为JSON，团队共享使用'
  },
  {
    title: 'HunyuanImage 3.0 与开源新势力',
    body: '<p>2026年开源图片生成百花齐放：</p><ul><li><strong>HunyuanImage 3.0</strong>（腾讯）：800亿参数MoE，最大开源图片模型</li><li><strong>FLUX.2</strong>（Black Forest Labs）：Meta合作伙伴，估值$32.5亿</li><li>这些模型都可以在ComfyUI中使用，与SD 3.5共享工作流生态</li></ul>',
    tip: '关注CivitAI社区获取最新的模型和LoRA资源'
  },
  {
    title: '实战：搭建游戏素材流水线',
    body: '<p>综合实战项目——搭建一条完整的游戏美术AI流水线：</p><ol><li>安装ComfyUI + SD 3.5 + FLUX.2 + ControlNet</li><li>训练公司风格LoRA</li><li>搭建批量生成工作流</li><li>输出一套包含10张的游戏宣传素材包</li><li>团队文档化和流程标准化</li></ol>'
  }
];
t006.steps = t006.content.length;

// ========== t007: AI视频生成工具对比与实战 ==========
const t007 = tuts.find(t => t.id === 't007');
t007.title = 'AI视频生成实战：Sora 2 / Kling 3.0 / Runway Gen-4.5';
t007.desc = '对比2026年最强AI视频工具Sora 2、Kling 3.0、Runway Gen-4.5等，掌握游戏短视频制作全流程';
t007.content = [
  {
    title: '2026 AI视频工具全景图',
    body: '<p>AI视频生成在2026年迎来爆发，六大主力工具：</p><ul><li><strong>Sora 2</strong>（OpenAI）：60秒视频、物理引擎最强、带音频</li><li><strong>Runway Gen-4.5</strong>：专业级商业制作，好莱坞级品质</li><li><strong>Kling 3.0</strong>（字节跳动）：最长120秒视频，性价比之王</li><li><strong>Veo 3.1</strong>（Google）：唯一原生4K、音频同步最强</li><li><strong>Pika 2.5</strong>：社交媒体向，最平易近人</li><li><strong>Wan 2.2</strong>（阿里巴巴）：最强开源视频模型</li></ul>',
    tip: '没有"最好的"工具，只有最适合你需求的——后面会详细对比'
  },
  {
    title: '各工具优劣势对比',
    body: '<table><tr><th>工具</th><th>时长</th><th>画质</th><th>价格/月</th><th>最适合</th></tr><tr><td>Sora 2</td><td>60秒</td><td>1080p</td><td>$20-200</td><td>物理真实感、电影级</td></tr><tr><td>Runway Gen-4.5</td><td>16秒</td><td>4K</td><td>$95</td><td>商业广告、专业制作</td></tr><tr><td>Kling 3.0</td><td>120秒</td><td>1080p</td><td>$6.99</td><td>长视频、预算有限</td></tr><tr><td>Veo 3.1</td><td>30秒</td><td>4K</td><td>Gemini订阅</td><td>4K需求、音效同步</td></tr><tr><td>Pika 2.5</td><td>10秒</td><td>1080p</td><td>$8</td><td>社交短视频、趣味特效</td></tr><tr><td>Wan 2.2</td><td>10秒</td><td>1080p</td><td>免费开源</td><td>本地部署、定制化</td></tr></table>',
    tip: '游戏营销推荐组合：Kling 3.0做长视频素材 + Runway做精品广告片'
  },
  {
    title: 'Sora 2 实战操作',
    body: '<p>Sora 2 是物理模拟最真实的AI视频工具：</p><ul><li>支持文生视频、图生视频、视频续写</li><li>物理引擎：真实的光影、流体、布料、碰撞效果</li><li>最长60秒，可生成带同步音效的视频</li><li>免费版30次/天（iOS，美国/加拿大），Pro版$200/月</li></ul>',
    example: 'Prompt：A majestic dragon emerging from a lava lake in a volcanic cave, spreading its wings with fire particles, cinematic camera slowly pulling back to reveal the full scale, dramatic orchestral music atmosphere, game trailer style, 60 seconds'
  },
  {
    title: 'Kling 3.0 实战操作',
    body: '<p>Kling 3.0 是性价比最强的选择：</p><ul><li><strong>120秒超长视频</strong>：是Sora 2的两倍时长</li><li>价格仅$6.99/月，适合日常大量产出</li><li>支持中文Prompt，对国内团队更友好</li><li>图生视频效果优秀，适合从概念图生成动态预览</li></ul>',
    tip: '用Midjourney V7先出静态概念图，再用Kling 3.0转为动态视频——这是成本最低的游戏预告片制作流程',
    example: 'Prompt：一位身穿水晶铠甲的战士在暴风雪中举起光剑，剑身上的符文依次亮起，周围的冰晶被能量冲击波震碎，镜头从特写慢慢拉远展现壮观的冰川战场，电影级画面，120秒'
  },
  {
    title: '游戏宣传视频制作流程',
    body: '<p>完整的AI辅助游戏视频制作流水线：</p><ol><li><strong>脚本策划</strong>：用Claude 4.6生成分镜脚本</li><li><strong>概念图</strong>：Midjourney V7 / Nano Banana 2 生成关键帧</li><li><strong>动态化</strong>：将概念图送入Kling 3.0 / Sora 2生成视频片段</li><li><strong>精修片段</strong>：重要镜头用Runway Gen-4.5提升品质</li><li><strong>剪辑合成</strong>：在剪映/Premiere中拼接、加字幕、配音乐</li></ol>',
    tip: '预算有限时：Kling 3.0做主力 + Pika 2.5做趣味片段，总成本不到$15/月'
  },
  {
    title: '图生视频高级技巧',
    body: '<p>从静态图生成视频是最实用的功能：</p><ul><li>游戏截图 → 生成场景展示动画</li><li>角色立绘 → 生成角色展示动态</li><li>海报设计 → 生成动态海报（用于社交媒体）</li></ul><p>关键技巧：上传图片时配合文字描述<strong>运动方向</strong>（镜头推进、角色转身、元素飘动）。</p>',
    example: '上传游戏角色立绘后添加Prompt：\n"角色缓缓转身面向镜头，斗篷在风中飘动，背景粒子特效流动，镜头缓慢环绕，3秒"'
  },
  {
    title: '成本与效率最优方案',
    body: '<p>根据团队预算选择方案：</p><ul><li><strong>低预算（<$20/月）</strong>：Kling 3.0 ($6.99) + Pika 2.5 ($8)</li><li><strong>中等预算（$50-100/月）</strong>：Kling 3.0 + Runway Gen-4.5 ($95)</li><li><strong>高预算（>$200/月）</strong>：Sora 2 Pro + Runway + Kling全覆盖</li></ul><p>开源替代：Wan 2.2（阿里巴巴）可本地部署，零边际成本但需要GPU。</p>',
    tip: '短视频营销场景下，Kling 3.0的120秒时长 + $6.99/月的价格是目前ROI最高的选择'
  },
  {
    title: '实战：制作15秒游戏推广短视频',
    body: '<p>实操练习：用AI生成一条完整的游戏推广短视频</p><ol><li>用Claude 4.6写3段分镜脚本（开场→高潮→结尾CTA）</li><li>用Midjourney V7生成3张关键帧概念图</li><li>用Kling 3.0将每张图转为5秒视频片段</li><li>在剪辑软件中拼接 + 添加BGM和文字</li><li>导出横版（YouTube/B站）和竖版（抖音/TikTok）两个版本</li></ol>'
  }
];
t007.steps = t007.content.length;

// ========== t017: AI Agent 基础概念与未来展望 ==========
const t017 = tuts.find(t => t.id === 't017');
t017.title = 'AI Agent 实战入门：从概念到落地';
t017.desc = '了解2026年AI Agent最新进展，掌握Claude Agent、GPT-5自主Agent等工具的实际应用';
t017.content = [
  {
    title: '什么是 AI Agent（2026版）',
    body: '<p>AI Agent已从概念进入<strong>实际应用阶段</strong>：</p><ul><li>Agent = 大模型 + 工具调用 + 自主规划 + 持续执行</li><li>不再是"聊天机器人"，而是能<strong>自主完成多步骤任务</strong>的数字员工</li><li>2026年标杆：Claude Opus 4.6可持续自主工作14.5小时完成复杂任务</li></ul>',
    tip: '理解Agent的关键：它不是回答问题，而是完成任务——包括搜索、分析、写作、调用API等一系列动作'
  },
  {
    title: '当前主流 Agent 平台',
    body: '<ul><li><strong>Claude Agent（Anthropic）</strong>：多Agent协作，16个Opus 4.6 Agent曾协作用Rust写C编译器</li><li><strong>GPT-5 Agent（OpenAI）</strong>：自适应推理驱动的自主Agent，GPT-5.3-Codex专精代码任务</li><li><strong>Gemini 3.1 Deep Think（Google）</strong>：多并行思维流的Agent推理</li><li><strong>开源Agent框架</strong>：LangChain、AutoGen、CrewAI等</li></ul>',
    tip: '目前最成熟的商用Agent是Claude Agent和ChatGPT的GPT Agent，建议从这两个开始'
  },
  {
    title: 'Agent 在游戏行业的应用',
    body: '<p>AI Agent在游戏公司的实际落地场景：</p><ul><li><strong>自动化市场监测Agent</strong>：每日自动收集竞品动态、行业新闻，生成简报</li><li><strong>数据分析Agent</strong>：自动拉取数据、生成报表、发现异常并预警</li><li><strong>内容生成Agent</strong>：根据日历自动生成社交媒体内容草稿</li><li><strong>QA测试Agent</strong>：自动进行游戏功能测试和bug报告</li><li><strong>玩家服务Agent</strong>：智能客服，处理常见问题和工单</li></ul>',
    example: '市场监测Agent工作流：\n每日8:00自动执行 →\n1. 搜索指定竞品的最新动态（App Store更新、社交媒体）\n2. 收集行业新闻和政策变化\n3. 分析数据变化（下载榜排名、评分变动）\n4. 生成1页A4的《每日竞品简报》\n5. 发送到企业微信/钉钉群'
  },
  {
    title: '动手搭建你的第一个Agent',
    body: '<p>用Claude Projects搭建一个简易"日报生成Agent"：</p><ol><li>创建Claude Project，上传公司报告模板和历史日报</li><li>设置System Prompt定义Agent的角色和输出格式</li><li>每日提供原始数据，Agent自动按模板生成日报</li><li>逐步添加更多数据源，扩展Agent能力</li></ol><p>从简单开始，验证价值后再升级为全自动化。</p>',
    tip: '先用"半自动"模式（人工提供数据 + AI生成报告）跑通流程，再逐步实现全自动'
  },
  {
    title: 'Agent安全与风险管理',
    body: '<p>使用Agent的注意事项：</p><ul><li><strong>权限控制</strong>：Agent可以调用工具，必须限制其可访问的范围</li><li><strong>人工审核</strong>：关键决策前必须有人工确认环节</li><li><strong>错误处理</strong>：Agent可能产生幻觉或误判，需要设置兜底机制</li><li><strong>数据安全</strong>：不要让Agent接触敏感数据（财务、个人信息等）</li></ul>',
    tip: '记住黄金法则：让Agent做"草稿"，人类做"审批"'
  },
  {
    title: 'Agent发展趋势与学习路径',
    body: '<p>AI Agent是2026年最重要的技术趋势：</p><ul><li><strong>多Agent协作</strong>：多个Agent分工合作完成复杂项目（如Claude Agent团队模式）</li><li><strong>跨平台Agent</strong>：一个Agent同时操作浏览器、邮件、文档等工具</li><li><strong>行业专属Agent</strong>：为游戏运营、美术设计等定制的专业Agent</li></ul><p>学习路径建议：先用好ChatGPT/Claude的Agent功能 → 学习Prompt Engineering → 了解Agent框架 → 尝试搭建自定义Agent</p>',
    tip: 'Agent不会取代你的工作，但会用Agent的人会取代不用Agent的人'
  }
];
t017.steps = t017.content.length;

// ========== t004: Prompt Engineering 进阶技巧 ==========
const t004 = tuts.find(t => t.id === 't004');
t004.desc = '掌握角色设定、少样本学习、链式思考等高级Prompt技巧，适配GPT-5/Claude 4.6等最新模型';
// Update specific content steps to reference new models
t004.content[0].body = '<p>角色设定（Role Prompting）是最基础也最有效的提升手段。给AI一个明确身份，它的输出质量会显著提升。</p><p>适用于所有主流模型：GPT-5、Claude Opus 4.6、Gemini 3.1 Pro。</p><ul><li>职业角色："你是一名有15年经验的游戏策划总监"</li><li>专家角色："你是数值平衡专家，精通F2P游戏经济系统设计"</li><li>用户角色："假设你是一名初次接触SLG的25岁女性玩家"</li></ul>';
t004.content[7].body = '<p>不同模型的参数特性（2026年最新）：</p><ul><li><strong>Temperature</strong>：0-2，越高越随机。GPT-5和Claude 4.6默认1.0</li><li><strong>Top-P</strong>：核采样参数，通常保持默认0.9-1.0</li><li><strong>自适应推理</strong>：GPT-5和Claude 4.6都支持自动调节推理深度</li><li><strong>最大输出</strong>：Claude Opus 4.6支持128K输出——可以一次性生成完整的长文档</li></ul><p>实用建议：创意任务Temp=0.9-1.2，分析任务Temp=0.3-0.7，代码任务Temp=0.1-0.3。</p>';
t004.content[8].body = '<p>AI幻觉（Hallucination）在2026年已大幅改善但未消除：</p><ul><li>GPT-5幻觉率比GPT-4o降低约45%</li><li>Claude 4.6更倾向于说"我不确定"而非编造</li><li>Gemini 3.1 Pro内置grounding（来源引用）功能</li></ul><p>应对策略：<ul><li>要求AI引用来源并标注可信度</li><li>关键数据让AI联网搜索验证</li><li>交叉验证：用两个不同模型回答同一问题</li><li>使用Perplexity做事实性查证</li></ul></p>';

// ========== t003: Perplexity 快速调研方法论 — minor update ==========
const t003 = tuts.find(t => t.id === 't003');
t003.content[0].body = '<p>Perplexity是AI搜索引擎，2026年核心优势：</p><ul><li><strong>AI+搜索结合</strong>：回答自动附带来源链接和引用</li><li>支持GPT-5和Claude 4.6作为底层推理模型（Pro版可选）</li><li><strong>实时性</strong>：搜索结果实时更新，不受训练截止日限制</li><li>Pages功能：一键将搜索结果转为结构化报告</li></ul><p>适用场景：市场调研、竞品分析、行业趋势追踪、政策法规查询。</p>';

// ========== t014: AI工具安全使用指南 — update ==========
const t014 = tuts.find(t => t.id === 't014');
t014.desc = '2026年AI工具安全使用规范：数据安全、版权合规和企业AI治理最佳实践';
t014.content[0].body = '<p>2026年所有主流AI工具（ChatGPT GPT-5、Claude 4.6、Gemini 3.1、Midjourney V7等）在安全方面都有改进，但仍需注意：</p><ul><li><strong>免费版对话可能用于训练</strong>：敏感数据不要在免费版中输入</li><li><strong>API和企业版不训练</strong>：正式工作数据使用企业版或API</li><li><strong>Claude Projects</strong>默认不用于训练，适合企业场景</li></ul>';

// ========== t018: Canva AI 快速设计入门 — minor update ==========
const t018 = tuts.find(t => t.id === 't018');
t018.content[0].body = '<p>Canva在2026年已全面AI化：</p><ul><li><strong>Magic Studio</strong>：AI一键生成完整设计方案</li><li><strong>Magic Write</strong>：基于大模型的智能文案生成</li><li><strong>Magic Edit</strong>：AI图片编辑（替换背景、删除元素、扩展画面）</li><li><strong>AI视频编辑</strong>：智能剪辑、自动字幕、一键竖版转横版</li></ul><p>Canva的优势是<strong>零门槛</strong>——不需要学PS/AI，模板+AI就能出专业素材。适合运营、市场、产品等非设计岗位。</p>';

// ========== 新增教程 t019: Nano Banana 2 与 Gemini 图片生成 ==========
const existingT019 = tuts.find(t => t.id === 't019');
const t019Data = {
  id: 't019',
  title: 'Nano Banana 2 & Gemini 图片生成实战',
  desc: '掌握Google最火的Nano Banana 2图片模型，学会角色一致性、文字渲染和多角色场景生成',
  tier: 'beginner',
  difficulty: 'beginner',
  duration: '30分钟',
  targetJobs: ['graphic-designer', 'new-media', 'brand-manager', 'ad-manager'],
  category: 'image',
  icon: '🍌',
  editorPick: true,
  steps: 7,
  content: [
    {
      title: '什么是 Nano Banana 2',
      body: '<p><strong>Nano Banana 2</strong>（2026年2月26日发布）是Google基于Gemini 3.1 Flash Image构建的AI图片模型，一经发布即在全网爆火：</p><ul><li>两周内吸引<strong>1000万+新用户</strong>，生成超过<strong>2亿张图片</strong></li><li>名字来源：最初以"Nano Banana"代号在Arena匿名测试时被发现</li><li>核心能力：角色一致性（5个角色）、精准文字渲染、快速编辑</li></ul><p>免费使用入口：<strong>gemini.google.com</strong> → 直接在对话中要求生成图片。</p>',
      tip: 'Nano Banana Pro（基于Gemini 3 Pro Image）是高质量版本，适合专业素材制作'
    },
    {
      title: '基础图片生成',
      body: '<p>在Gemini对话中直接用自然语言描述即可生成图片：</p><ul><li>支持中文和英文Prompt（英文效果略好）</li><li>可在一次对话中连续编辑和修改</li><li>自动识别你的意图（生成/编辑/变体）</li></ul>',
      example: '对Gemini说：\n"请生成一张游戏角色图：一位身穿蓝色水晶铠甲的精灵女战士，手持冰霜魔法杖，站在雪山之巅，动漫风格，高清细节"\n\n然后迭代：\n"把背景改成星空下的古堡"\n"让她的表情更自信一些"\n"添加飘舞的蓝色魔法粒子"'
    },
    {
      title: '角色一致性：多图保持同一角色',
      body: '<p>Nano Banana 2最强的功能——<strong>同一角色多场景</strong>：</p><ul><li>一次对话中最多维持<strong>5个不同角色</strong>的一致性</li><li>描述角色后可以在不同场景中重复使用</li><li>适合制作：角色展示图、故事连环画、多场景宣传图</li></ul>',
      example: '第一步：创建角色\n"创建一个游戏角色：黑发红瞳的少年剑客，穿着红黑色武士服"\n\n第二步：多场景生成\n"让这个角色在樱花树下冥想"\n"让这个角色在雨中与敌人对峙"\n"让这个角色站在悬崖边看日落"\n→ 三张图中角色外观保持一致！'
    },
    {
      title: '精准文字渲染',
      body: '<p>Nano Banana 2的文字渲染能力是图片AI中的顶级水平：</p><ul><li>可以在图片中生成清晰可读的中英文文字</li><li>适合直接生成带标题的海报、Banner</li><li>支持指定字体风格（手写风、像素风、赛博朋克风等）</li></ul>',
      tip: '生成带文字的营销图时，明确指定文字内容和位置，例如"顶部大字标题「新版本来袭」"',
      example: "生成一张游戏更新公告海报：\\n\"设计一张竖版海报，顶部写'暗影觉醒'四个大字（金色发光效果），中间是一个黑暗骑士角色，底部写'3月15日全服更新'，整体风格暗黑奇幻，粒子特效\""
    },
    {
      title: '游戏营销场景应用',
      body: '<p>Nano Banana 2 在游戏营销中的实用场景：</p><ul><li><strong>社交媒体内容</strong>：快速生成每日更新图、活动预告图</li><li><strong>角色宣传图</strong>：利用角色一致性生成系列宣传图</li><li><strong>3D风格手办图</strong>：Nano Banana 2擅长的"3D Figurine"风格曾爆火全网</li><li><strong>表情包/GIF素材</strong>：角色表情变体快速产出</li></ul>',
      example: "制作一套角色宣传系列图（3张）：\\n1. 游戏角色「月华」的3D手办风格展示图，白色背景，精致细节\\n2. 同一角色在游戏战斗场景中的动态图\\n3. 同一角色的Q版形象，可爱表情，适合做头像"
    },
    {
      title: '对比：Nano Banana 2 vs Midjourney V7 vs GPT Image 1.5',
      body: '<table><tr><th>特性</th><th>Nano Banana 2</th><th>Midjourney V7</th><th>GPT Image 1.5</th></tr><tr><td>艺术质感</td><td>★★★★</td><td>★★★★★</td><td>★★★★</td></tr><tr><td>角色一致性</td><td>★★★★★</td><td>★★★★</td><td>★★★</td></tr><tr><td>文字渲染</td><td>★★★★★</td><td>★★</td><td>★★★★★</td></tr><tr><td>速度</td><td>★★★★★</td><td>★★★</td><td>★★★★</td></tr><tr><td>免费额度</td><td>较多</td><td>无</td><td>有限</td></tr><tr><td>中文支持</td><td>★★★★★</td><td>★★★</td><td>★★★★</td></tr></table>',
      tip: '需要艺术感选MJ V7，需要角色一致性和文字选Nano Banana 2，需要极致文字精度选GPT Image 1.5'
    },
    {
      title: '实战：用Nano Banana 2制作游戏角色宣传套图',
      body: '<p>综合实操：</p><ol><li>在Gemini中创建游戏主角形象（描述外貌、服装、武器）</li><li>生成角色正面立绘</li><li>保持角色一致，生成战斗场景图</li><li>生成带游戏名称文字的宣传海报</li><li>生成Q版/手办风格的衍生图</li></ol><p>全程在同一对话中完成，角色始终保持一致。</p>'
    }
  ]
};
if (existingT019) {
  Object.assign(existingT019, t019Data);
} else {
  tuts.push(t019Data);
}

// ========== 新增教程 t020: Gemini 3.1 Pro 深度使用指南 ==========
const existingT020 = tuts.find(t => t.id === 't020');
const t020Data = {
  id: 't020',
  title: 'Gemini 3.1 Pro 深度使用指南',
  desc: '掌握Google最新Gemini 3.1 Pro的1M上下文、多模态能力和Deep Think深度推理模式',
  tier: 'intermediate',
  difficulty: 'intermediate',
  duration: '40分钟',
  targetJobs: ['all'],
  category: 'prompt',
  icon: '💎',
  editorPick: true,
  steps: 6,
  content: [
    {
      title: '认识 Gemini 3.1 Pro',
      body: '<p><strong>Gemini 3.1 Pro</strong>（2026年2月19日发布）让Google重回AI第一梯队：</p><ul><li>1M Token上下文窗口（约75万字），业界最大可用上下文</li><li>自适应推理（Adaptive Thinking），自动调节思考深度</li><li>原生多模态：文本+图片+视频+音频统一处理</li><li>Grounding（来源引用）：回答自动附带引用来源</li></ul><p>使用入口：<strong>gemini.google.com</strong> 或 <strong>Google AI Studio</strong>（开发者）。</p>',
      tip: 'Gemini 3.1 Flash-Lite（3月3日发布）是轻量版，适合低延迟高频调用场景'
    },
    {
      title: '1M 上下文的实际应用',
      body: '<p>1M上下文意味着你可以一次性输入：</p><ul><li>一整本游戏设计文档（GDD）+ 全部附录</li><li>一个季度的完整运营数据报告</li><li>多个竞品的分析材料同时对比</li><li>整个代码项目（数万行代码一次分析）</li></ul><p>与Claude的200K上下文相比，Gemini在<strong>超大规模文档处理</strong>上有独特优势。</p>',
      example: '上传3份竞品分析报告 + 公司Q4运营报告 + 行业白皮书，然后问：\n"请综合分析这5份文档，找出：\n1. 我们与竞品的核心差异点\n2. 行业趋势中我们尚未布局的机会\n3. 下个季度的3个战略建议"'
    },
    {
      title: 'Deep Think 深度推理模式',
      body: '<p><strong>Gemini 3 Deep Think</strong>是Google最强推理模式：</p><ul><li>多并行思维流：同时从多个角度思考问题</li><li>适合高风险技术决策和复杂分析</li><li>比普通模式消耗更多token，但推理质量显著提升</li></ul><p>适用场景：数值系统平衡验证、复杂商业决策、技术架构评审。</p>',
      tip: '日常任务用标准Gemini 3.1 Pro，遇到需要深度思考的关键决策时切换Deep Think'
    },
    {
      title: '多模态实战',
      body: '<p>Gemini的多模态能力是原生集成的：</p><ul><li><strong>图片理解</strong>：上传游戏UI，分析用户体验</li><li><strong>视频分析</strong>：上传游戏录屏，分析玩家行为模式</li><li><strong>音频处理</strong>：上传语音反馈，自动整理用户意见</li><li><strong>图片生成</strong>：通过Nano Banana 2生成高质量图片</li></ul>',
      example: '上传一段3分钟的游戏新手引导录屏，然后问：\n"请逐步分析这段新手引导视频：\n1. 指出3个可能导致玩家流失的设计问题\n2. 每个问题的严重程度和改进建议\n3. 与行业标杆产品的新手引导对比"'
    },
    {
      title: 'Google生态联动',
      body: '<p>Gemini与Google生态深度整合：</p><ul><li><strong>Google Workspace</strong>：在Docs/Sheets/Slides中直接调用Gemini</li><li><strong>Google Search</strong>：Grounding功能实时引用搜索结果</li><li><strong>NotebookLM</strong>：将文档转为AI播客/对话</li><li><strong>Google Colab</strong>：Gemini辅助数据分析和编程</li></ul>',
      tip: '如果团队使用Google Workspace，Gemini的生态联动是最大优势'
    },
    {
      title: 'ChatGPT vs Claude vs Gemini：三巨头对比',
      body: '<table><tr><th>特性</th><th>GPT-5</th><th>Claude 4.6</th><th>Gemini 3.1 Pro</th></tr><tr><td>上下文窗口</td><td>196K</td><td>200K (1M Beta)</td><td>1M</td></tr><tr><td>最大输出</td><td>~16K</td><td>128K</td><td>~64K</td></tr><tr><td>推理能力</td><td>★★★★★</td><td>★★★★★</td><td>★★★★★</td></tr><tr><td>代码生成</td><td>★★★★</td><td>★★★★★</td><td>★★★★</td></tr><tr><td>图片生成</td><td>GPT Image 1.5</td><td>无内置</td><td>Nano Banana 2</td></tr><tr><td>视频理解</td><td>有限</td><td>无</td><td>★★★★★</td></tr><tr><td>中文支持</td><td>★★★★</td><td>★★★★</td><td>★★★★★</td></tr><tr><td>免费额度</td><td>有限</td><td>较多</td><td>较多</td></tr></table><p>建议策略：三者各有所长，根据任务场景灵活切换。</p>',
      tip: '超长文档分析→Gemini 3.1 Pro，深度方案撰写→Claude 4.6，日常快速问答→GPT-5'
    }
  ]
};
if (existingT020) {
  Object.assign(existingT020, t020Data);
} else {
  tuts.push(t020Data);
}

// ========== 新增教程 t021: DeepSeek & 国产AI模型实战 ==========
const existingT021 = tuts.find(t => t.id === 't021');
const t021Data = {
  id: 't021',
  title: 'DeepSeek & 国产开源AI模型实战',
  desc: '了解DeepSeek V3/V4、通义千问Qwen3、Kimi K2.5等国产AI模型，掌握免费/低成本的AI使用方案',
  tier: 'intermediate',
  difficulty: 'intermediate',
  duration: '35分钟',
  targetJobs: ['all'],
  category: 'prompt',
  icon: '🐉',
  editorPick: false,
  steps: 6,
  content: [
    {
      title: '国产AI模型2026格局',
      body: '<p>2026年国产AI模型已达世界一流水平：</p><ul><li><strong>DeepSeek</strong>：V3.2已发布，V4即将发布（万亿参数、多模态、Apache 2.0开源）</li><li><strong>通义千问 Qwen3</strong>（阿里巴巴）：Qwen3-Coder-Next专精编程</li><li><strong>Kimi K2.5</strong>（月之暗面）：万亿参数开源多模态Agent模型</li><li><strong>Wan 2.2</strong>（阿里巴巴）：最强开源视频生成模型</li></ul><p>优势：免费或极低成本、中文优化好、可本地部署、开源可控。</p>',
      tip: 'DeepSeek和Kimi的免费配额非常慷慨，日常使用几乎不用花钱'
    },
    {
      title: 'DeepSeek 使用入门',
      body: '<p>DeepSeek是目前最受关注的国产AI：</p><ul><li>网页端：<strong>chat.deepseek.com</strong>（免费使用）</li><li>推理能力（R系列）与通用能力（V系列）双线发展</li><li>V4将合并两条产品线，成为统一的多模态模型</li><li>代码生成能力与Claude 4.6接近，且完全免费</li></ul>',
      example: '在DeepSeek中尝试：\n"请分析以下游戏数值表，找出可能的平衡性问题：\n[粘贴Excel数据]\n要求：\n1. 计算各角色的DPS理论值\n2. 找出高于均值30%的异常值\n3. 给出调整建议和调整幅度"'
    },
    {
      title: 'Kimi K2.5 长文档能力',
      body: '<p>Kimi（月之暗面）以超长上下文能力著称：</p><ul><li>支持超长文档处理（与Gemini竞争）</li><li>K2.5版本：万亿参数，多模态Agent能力</li><li>适合场景：超长文档分析、研究报告、竞品调研</li><li>网页端免费使用：<strong>kimi.moonshot.cn</strong></li></ul>',
      tip: '需要分析超长PDF报告时，Kimi是最好的免费选择之一'
    },
    {
      title: '开源模型本地部署',
      body: '<p>国产开源模型可以<strong>完全本地运行</strong>，保障数据安全：</p><ul><li><strong>Ollama</strong>：一键本地运行DeepSeek、Qwen等模型</li><li><strong>vLLM</strong>：高性能推理框架，适合团队部署</li><li>硬件需求：7B模型→16GB显存，14B模型→24GB显存</li></ul><p>适合场景：涉及公司机密数据的分析任务、无法使用外部API的安全环境。</p>',
      example: '用Ollama本地运行DeepSeek：\n# 安装\ncurl -fsSL https://ollama.ai/install.sh | sh\n\n# 运行DeepSeek\nollama run deepseek-v3\n\n# 开始对话\n>>> 请帮我分析这份游戏活动的ROI数据...'
    },
    {
      title: '国产AI工具矩阵',
      body: '<p>除了大模型，国产AI工具生态也在快速发展：</p><ul><li><strong>文心一格</strong>（百度）：中文理解最好的图片生成</li><li><strong>通义万相</strong>（阿里巴巴）：AI图片+视频生成</li><li><strong>可灵 Kling 3.0</strong>（字节跳动）：最强AI视频，120秒时长</li><li><strong>Wan 2.2</strong>（阿里巴巴）：开源视频模型，可本地部署</li><li><strong>讯飞星火</strong>：中文办公场景优化</li></ul>',
      tip: '如果团队预算有限，国产AI工具+开源模型可以覆盖90%的AI应用场景'
    },
    {
      title: '实战：零成本AI工作流搭建',
      body: '<p>用免费/开源工具搭建完整的AI工作流：</p><ol><li><strong>文案写作</strong>：DeepSeek（免费）或Kimi（免费）</li><li><strong>图片生成</strong>：Nano Banana 2（Gemini免费额度）</li><li><strong>视频生成</strong>：Kling 3.0（$6.99/月最低档）</li><li><strong>数据分析</strong>：DeepSeek（免费）+ Google Sheets</li><li><strong>调研搜索</strong>：Perplexity免费版 + Kimi搜索</li></ol><p>总成本：<strong>不到50元/月</strong>即可拥有完整的AI工作套件。</p>'
    }
  ]
};
if (existingT021) {
  Object.assign(existingT021, t021Data);
} else {
  tuts.push(t021Data);
}

// ========== Update t008, t009, t010, t012, t013 to reference latest models ==========
// t008: 用AI写出高转化广告文案
const t008 = tuts.find(t => t.id === 't008');
t008.content[0].body = '<p>高转化广告文案的核心要素（AIDA模型）：<strong>注意力→兴趣→欲望→行动</strong>。AI（GPT-5、Claude 4.6）可以在每个环节提供帮助，但人类的市场洞察和品牌理解不可替代。</p><ul><li>GPT-5擅长快速生成大量变体</li><li>Claude 4.6擅长深度分析和策略优化</li><li>Gemini 3.1 Pro擅长结合搜索数据的实时洞察</li></ul>';

// t009: AI辅助游戏活动策划全流程
const t009 = tuts.find(t => t.id === 't009');
t009.content[0].body = '<p>AI可以辅助活动策划的每个环节，2026年推荐工具搭配：</p><ul><li><strong>创意发散</strong>：GPT-5（自适应推理，创意+逻辑兼顾）</li><li><strong>方案撰写</strong>：Claude 4.6（128K输出，一次生成完整方案）</li><li><strong>数据分析</strong>：Gemini 3.1 Pro（Google Sheets联动）或DeepSeek（免费）</li><li><strong>素材生成</strong>：Midjourney V7 / Nano Banana 2（活动海报）</li><li><strong>视频素材</strong>：Kling 3.0（活动预告短视频）</li></ul>';

// t012: 新媒体AI内容工厂搭建
const t012 = tuts.find(t => t.id === 't012');
t012.content[0].body = '<p>2026年AI驱动的内容工厂标准工具链：</p><ul><li><strong>选题策划</strong>：Perplexity + GPT-5联网搜索（追踪热点）</li><li><strong>文案生成</strong>：Claude 4.6（深度长文）/ GPT-5（短文案快速迭代）</li><li><strong>配图生成</strong>：Nano Banana 2（免费、快速、带文字）/ Midjourney V7（高艺术质感）</li><li><strong>视频生成</strong>：Kling 3.0（120秒长视频、$6.99/月）/ Pika 2.5（趣味短视频）</li><li><strong>排版发布</strong>：Canva AI（一键设计）+ 各平台发布</li></ul><p>这套工具链的总月成本不到200元，即可支撑一个3-5人新媒体团队的全部AI需求。</p>';

// t013: AI时代的产品需求文档撰写
const t013 = tuts.find(t => t.id === 't013');
t013.content[0].body = '<p>AI让PRD撰写效率提升数倍，推荐工作流：</p><ul><li><strong>需求分析</strong>：用Gemini 3.1 Pro的1M上下文一次性分析所有历史PRD和竞品文档</li><li><strong>PRD撰写</strong>：用Claude 4.6的128K输出一次性生成完整PRD（无截断）</li><li><strong>评审模拟</strong>：让GPT-5扮演不同角色（开发、测试、运营）提出质疑</li><li><strong>原型图</strong>：用Nano Banana 2 / GPT Image 1.5快速生成UI概念图</li></ul>';

// ========== Write back ==========
fs.writeFileSync(TUTS_FILE, JSON.stringify(tuts, null, 2), 'utf8');

// Stats
console.log('✅ 教程更新完成!');
console.log('总教程数:', tuts.length);
tuts.forEach(t => {
  console.log(`  ${t.id}: ${t.title} (${t.content ? t.content.length : 0} steps)`);
});
