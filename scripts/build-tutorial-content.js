#!/usr/bin/env node
/**
 * build-tutorial-content.js
 * 为所有教程生成详细步骤内容，写入 tutorials.json
 */
const fs = require('fs');
const path = require('path');

const TUTORIALS_FILE = path.join(__dirname, '..', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(TUTORIALS_FILE, 'utf8'));

// 每个教程的内容定义
const CONTENT_MAP = {
  t001: [
    { title: '认识 ChatGPT 界面', body: '<p>打开 <strong>chat.openai.com</strong>，注册账号后进入对话界面。左侧是历史对话列表，中间是对话区域，底部是输入框。</p><ul><li>每次对话都是一个独立的"上下文窗口"，ChatGPT会记住本次对话中所有内容</li><li>点击左上角可以新建对话，开始全新话题</li><li>支持 GPT-4o（最新）和 GPT-4o mini 等模型选择</li></ul>', tip: '建议用Chrome浏览器访问，体验最稳定' },
    { title: '写好你的第一个 Prompt', body: '<p>Prompt就是你给AI的指令。好的Prompt = 清晰的目标 + 足够的背景信息 + 明确的输出格式。</p><p>关键原则：<strong>越具体越好</strong>。不要说"帮我写个文案"，而要说"帮我写一条针对18-25岁手游玩家的新版本预告微博文案"。</p>', tip: '一开始写不好很正常，每次对话结束后回顾一下，哪些指令效果好，哪些不好', example: '你是一位资深游戏营销文案，请为我们的二次元手游新版本写一条微博预告文案。\n\n背景：\n- 游戏名：星辰幻想\n- 新版本主题：夏日海滩派对\n- 核心卖点：新SSR角色"海风"、海滩主题关卡、限定泳装皮肤\n- 目标用户：18-25岁二次元爱好者\n\n要求：\n- 150字以内\n- 语气活泼可爱\n- 包含1-2个emoji\n- 结尾带互动引导' },
    { title: '学会追问和迭代', body: '<p>ChatGPT的回答不满意？<strong>不要重新开始</strong>，直接在当前对话中追问和修改。这是AI对话最核心的技巧。</p><ul><li>"这个方向不错，但语气太正式了，请改成更口语化的风格"</li><li>"请保留第2段不变，把第1段改成提问式开头"</li><li>"请给出3个不同风格的版本让我选择"</li></ul>', tip: '把ChatGPT当作一个特别听话但需要明确指导的实习生——你越具体地说明你想要什么，它做得越好' },
    { title: '利用角色扮演提升质量', body: '<p>让ChatGPT扮演特定角色，能显著提升输出的专业性。在游戏行业，常用角色包括：</p><ul><li><strong>资深游戏策划</strong>：输出活动方案、玩法设计</li><li><strong>数据分析师</strong>：分析投放数据、用户行为</li><li><strong>品牌经理</strong>：撰写品牌策略、PR稿件</li><li><strong>玩家视角</strong>：模拟用户反馈和评测</li></ul>', example: '请你扮演一位拥有10年经验的手游运营专家。我是一名初级产品运营，请你帮我评估以下活动方案，指出存在的问题并给出优化建议。\n\n活动方案：[粘贴你的方案]' },
    { title: '使用 GPTs 和自定义指令', body: '<p>ChatGPT 提供了<strong>自定义指令</strong>功能，可以预设你的角色和偏好，避免每次重复说明。</p><p>设置路径：左下角头像 → 设置 → 自定义指令</p><ul><li>"关于你"栏填写：你的岗位、公司类型、常见工作场景</li><li>"回复偏好"栏填写：希望的输出风格和格式</li></ul><p>此外，GPT Store中有大量预制GPTs，可直接用于特定任务。</p>', tip: '自定义指令设置好后会影响所有新对话，建议填写最通用的信息' },
    { title: '文件上传与数据分析', body: '<p>ChatGPT支持上传文件（PDF、Excel、图片等），用于分析和处理：</p><ul><li><strong>上传Excel</strong>：让AI分析用户数据、生成图表、找出趋势</li><li><strong>上传截图</strong>：让AI分析竞品UI、广告素材</li><li><strong>上传PDF</strong>：让AI总结长文档要点</li></ul>', tip: '上传数据前，务必去除敏感信息（用户真实姓名、手机号等）', example: '我上传了一份最近7天的广告投放数据Excel。请帮我：\n1. 找出ROI最高的3个广告组\n2. 分析各渠道的CPA趋势\n3. 给出下周的预算分配建议' },
    { title: '联网搜索与实时信息', body: '<p>ChatGPT具备联网搜索能力，可以获取最新信息：</p><ul><li>竞品最新动态和市场消息</li><li>行业趋势和报告</li><li>特定话题的舆情概览</li></ul><p>使用时在提问中明确告诉它需要搜索最新信息。</p>', tip: '联网搜索的结果不一定100%准确，重要决策前请交叉验证' },
    { title: '实战练习：生成本周工作计划', body: '<p>现在用你学到的所有技巧，完成一个实战任务：让ChatGPT帮你生成本周工作计划。</p><ul><li>Step 1：设定角色（你的岗位对应的资深专家）</li><li>Step 2：提供背景（当前项目阶段、重点任务）</li><li>Step 3：要求具体格式（按天拆分、标注优先级）</li><li>Step 4：迭代优化（调整时间分配、增减任务）</li></ul>', tip: '练习完毕后，试着把你最满意的Prompt保存到笔记里，形成你自己的Prompt模板库' },
  ],

  t002: [
    { title: '为什么选择 Claude', body: '<p>Claude 在以下场景中表现特别出色：</p><ul><li><strong>长文档处理</strong>：支持超长上下文窗口，一次可以处理整本书或完整的策划文档</li><li><strong>深度分析</strong>：逻辑推理和结构化分析能力强，适合策略类工作</li><li><strong>严谨输出</strong>：回答更加谨慎，不容易"编造"信息</li><li><strong>写作质量</strong>：中英文写作质量高，适合正式文档</li></ul>', tip: '并不是Claude比ChatGPT"更好"，而是不同工具适合不同场景，关键是学会选择' },
    { title: '上手 Claude 对话界面', body: '<p>访问 <strong>claude.ai</strong> 注册登录。界面非常简洁：</p><ul><li>左侧是对话历史列表</li><li>中间是对话区域</li><li>底部输入框支持文字输入和文件上传</li><li>可以选择不同模型版本</li></ul><p>Claude 的对话体验与 ChatGPT 类似，但在长文本处理上有明显优势。</p>' },
    { title: '长文档一键总结与分析', body: '<p>Claude最强的功能之一是处理超长文本。你可以直接粘贴或上传：</p><ul><li>完整的市场调研报告（几万字）</li><li>竞品分析文档</li><li>用户调研原始记录</li><li>会议纪要合集</li></ul>', example: '请阅读以下完整的市场调研报告，然后按以下维度输出结构化分析：\n\n1. 核心发现（3-5个要点）\n2. 市场机会（按优先级排序）\n3. 风险提示\n4. 建议的下一步行动\n\n报告正文：\n[粘贴完整报告]', tip: '处理长文档时，先让Claude总结，然后针对感兴趣的部分追问细节，效率最高' },
    { title: '用 Claude 撰写策划方案', body: '<p>Claude非常擅长生成结构严谨的策划文档。关键在于给足背景信息：</p><ul><li>项目背景和目标</li><li>目标受众</li><li>预算和资源限制</li><li>参考案例（如果有）</li><li>期望的方案结构</li></ul>', example: '请帮我撰写一份游戏春节活动策划方案。\n\n背景：\n- 产品：已上线2年的SLG手游，日活15万\n- 目标：春节期间DAU提升30%，付费率提升至8%\n- 活动周期：1月25日-2月8日（15天）\n- 预算：运营成本50万以内\n\n请包含：\n1. 活动主题与核心玩法设计\n2. 每日活动日历\n3. 奖励设计与经济测算\n4. 推广渠道与素材计划\n5. 风险预案' },
    { title: '深度分析与逻辑推理', body: '<p>Claude在需要多步推理的分析任务中表现优异：</p><ul><li><strong>SWOT分析</strong>：给出产品信息，让Claude进行全面的SWOT分析</li><li><strong>因果推理</strong>：提供数据变化现象，让Claude推理可能的原因</li><li><strong>策略推演</strong>：描述市场格局，让Claude推演不同策略的可能结果</li></ul>', tip: '分析类任务中，让Claude"先列出分析框架，再逐个展开"，效果比一次性生成好得多' },
    { title: 'Projects 功能：团队知识库', body: '<p>Claude的Projects功能可以创建专属知识库，上传公司文档后，所有对话都能基于这些文档进行回答：</p><ul><li>上传产品文档、品牌指南、历史活动方案</li><li>设置项目级别的系统指令</li><li>团队成员共享同一个知识库</li></ul><p>这相当于为你的团队打造了一个"了解公司业务的AI助手"。</p>' },
    { title: '实战对比：ChatGPT vs Claude', body: '<p>最后，通过实际任务对比两个工具，找到各自的最佳使用场景：</p><ul><li><strong>快速创意生成</strong>：ChatGPT更灵活发散 → 选ChatGPT</li><li><strong>严谨方案撰写</strong>：Claude更结构化 → 选Claude</li><li><strong>数据分析可视化</strong>：ChatGPT有代码执行能力 → 选ChatGPT</li><li><strong>长文档处理</strong>：Claude上下文更长 → 选Claude</li></ul><p>最佳实践：两者结合使用，用ChatGPT做创意发散，用Claude做方案落地。</p>' },
  ],

  t003: [
    { title: '认识 Perplexity 的优势', body: '<p>Perplexity 是一款AI驱动的搜索引擎，与传统搜索最大的区别在于：</p><ul><li><strong>直接给答案</strong>：不需要你翻阅多个网页，直接生成结构化回答</li><li><strong>带引用来源</strong>：每个观点都标注了信息来源，便于验证</li><li><strong>支持追问</strong>：可以基于搜索结果继续深入提问</li></ul>', tip: 'Perplexity特别适合做前期调研，省去大量翻网页的时间' },
    { title: '基础搜索与高级搜索', body: '<p>两种搜索模式的使用场景：</p><ul><li><strong>Quick Search</strong>：快速获取简单事实性信息</li><li><strong>Pro Search</strong>：深度调研，AI会自动规划搜索策略、多轮检索</li></ul><p>Pro Search更适合复杂的市场调研和竞品分析任务。</p>', example: '帮我调研一下2024年中国手游出海东南亚市场的最新情况，包括：\n1. 市场规模和增长趋势\n2. 主要竞争者和市场份额\n3. 热门游戏品类\n4. 本地化要点和合规要求' },
    { title: '竞品快速调研实战', body: '<p>用Perplexity进行竞品调研的标准流程：</p><ul><li>Step 1：搜索竞品基本信息（上线时间、开发商、核心玩法）</li><li>Step 2：搜索竞品运营动态（最近活动、版本更新）</li><li>Step 3：搜索用户评价（应用商店评分、社区反馈）</li><li>Step 4：搜索商业数据（下载量、收入估算）</li></ul>', tip: '将Perplexity的搜索结果复制到Claude中做深度分析，形成完整的竞品报告' },
    { title: '行业趋势追踪', body: '<p>定期使用Perplexity追踪行业动态：</p><ul><li>每周搜索一次行业关键词，了解最新趋势</li><li>关注AI工具领域的新产品发布</li><li>追踪竞品的重大更新和运营动作</li></ul>' },
    { title: '信息验证与交叉核实', body: '<p>AI搜索也会出错，需要验证：</p><ul><li>检查引用来源是否权威可信</li><li>关键数据至少从2-3个来源交叉验证</li><li>时效性信息注意查看发布日期</li></ul>', tip: '重要决策引用的数据，一定要点击原文链接确认' },
    { title: '搭建个人调研工作流', body: '<p>将Perplexity融入你的日常工作流程：</p><ul><li><strong>晨间速览</strong>：用Perplexity搜索行业关键词，5分钟了解最新动态</li><li><strong>项目启动</strong>：用Pro Search做初步市场调研</li><li><strong>周报素材</strong>：搜索本周行业大事件汇总</li></ul>' },
  ],

  t004: [
    { title: '角色设定（Role Prompting）', body: '<p>角色设定是最基础也最有效的Prompt技巧。通过给AI一个专业身份，激活它在该领域的知识：</p><ul><li>明确角色的<strong>专业领域</strong>和<strong>经验年限</strong></li><li>描述角色的<strong>工作风格</strong>和<strong>价值观</strong></li><li>说明角色面对的<strong>具体场景</strong></li></ul>', example: '你是一位拥有15年经验的手游市场总监，曾成功操盘过多款日活百万级产品的品牌推广。你擅长数据驱动决策，注重ROI，对Z世代玩家群体有深入理解。\n\n现在请你以这个身份，评估以下营销方案...' },
    { title: '少样本学习（Few-Shot）', body: '<p>通过给AI 2-3个示例，让它精确理解你期望的输出格式和风格：</p><ul><li>示例要<strong>多样但一致</strong>——展示不同内容但相同格式</li><li>示例质量决定输出质量——确保示例本身是高质量的</li></ul>', example: '请按以下格式为游戏活动写推送文案：\n\n示例1：\n标题：限时返场！绝版皮肤等你来收\n正文：还记得去年夏天那套超人气的海洋之心皮肤吗？限时3天返场，错过再等一年！\nCTA：立即登录领取 →\n\n示例2：\n标题：新英雄驾到，战场格局将变\n正文：暗影刺客·月影正式加入战场！独特的隐身+暴击机制，团战中的致命杀手。\nCTA：抢先体验新英雄 →\n\n现在请用同样格式，为"春节限定活动"写3条推送文案。' },
    { title: '链式思考（Chain of Thought）', body: '<p>让AI先分析再给结论，大幅提升复杂任务的输出质量：</p><ul><li>在Prompt中加入"<strong>请一步一步分析</strong>"或"<strong>请先列出你的思考过程</strong>"</li><li>将复杂任务拆分为多个步骤要求</li></ul>', example: '请分析以下广告投放数据，并给出优化建议。\n\n要求：请按以下步骤分析\n1. 首先，识别数据中的关键指标变化趋势\n2. 然后，分析可能导致这些变化的原因\n3. 接着，对比行业基准评估表现\n4. 最后，给出具体的优化建议和优先级\n\n数据：[粘贴数据]' },
    { title: '结构化输出控制', body: '<p>通过明确指定输出格式，获得整齐一致的结果：</p><ul><li>使用<strong>Markdown格式</strong>要求（标题、列表、表格）</li><li>指定<strong>字数范围</strong>（"每条100-150字"）</li><li>要求<strong>特定结构</strong>（"请用表格对比"、"请分点列出"）</li></ul>', tip: '当你需要批量生成内容时，结构化输出控制尤其重要，能保证输出一致性' },
    { title: '约束与边界设定', body: '<p>告诉AI什么<strong>不要做</strong>，和告诉它做什么同样重要：</p><ul><li>"不要使用行业术语，面向普通玩家"</li><li>"不要编造数据，如果不确定请说明"</li><li>"不要超过200字"</li><li>"不要使用感叹号"</li></ul>', example: '请为我们的SLG游戏写一条品牌宣传语。\n\n要求：\n- 10字以内\n- 不要使用"王者""霸业""帝国"等已被大量使用的词\n- 不要使用感叹号\n- 体现策略深度而非暴力征服\n- 适合在地铁广告中使用' },
    { title: '分步拆解复杂任务', body: '<p>遇到复杂任务，不要一次性让AI完成所有事情。拆分为多个小任务，逐步推进：</p><ul><li>第一轮：让AI理解需求并提出方案框架</li><li>第二轮：确认框架后让AI展开具体内容</li><li>第三轮：针对性修改和优化</li></ul>', tip: '这种方法虽然需要多轮对话，但最终输出质量远高于一次性生成' },
    { title: '元提示（Meta Prompting）', body: '<p>让AI帮你写Prompt——这是高级用法：</p><ul><li>"我想让AI帮我做XX任务，请帮我设计一个效果最好的Prompt"</li><li>"以下Prompt效果不好，请帮我优化"</li></ul>', example: '我想让AI帮我生成游戏角色的背景故事。以下是我目前使用的Prompt，但生成的故事太平淡了：\n\n[当前Prompt]\n\n请帮我优化这个Prompt，使输出的故事更有戏剧张力和情感深度。请解释你做了哪些改动以及原因。' },
    { title: '温度和参数的影响', body: '<p>了解AI模型的关键参数如何影响输出：</p><ul><li><strong>Temperature（温度）</strong>：越高越有创造性，越低越稳定。创意任务用高温，分析任务用低温</li><li><strong>场景选择</strong>：写广告创意→高温；写数据报告→低温</li></ul><p>虽然在ChatGPT和Claude界面中不能直接调温度，但你可以通过Prompt语言来引导：</p><ul><li>"请大胆发挥创造力" → 类似高温效果</li><li>"请严格基于事实，不要推测" → 类似低温效果</li></ul>' },
    { title: '处理AI幻觉问题', body: '<p>"AI幻觉"是指AI编造看似合理但不真实的信息。在工作中这是一个严重风险：</p><ul><li>要求AI标注不确定的信息</li><li>关键数据必须人工验证</li><li>让AI引用来源</li></ul>', example: '请分析这款游戏的市场表现。\n\n重要要求：\n- 如果你不确定某个数据，请标注"[需验证]"\n- 不要编造具体的下载量或收入数字\n- 定性分析为主，定量数据请注明来源或标注为估计值' },
    { title: '建立你的 Prompt 模板库', body: '<p>将最有效的Prompt保存为模板，形成个人武器库：</p><ul><li>按使用场景分类（创意生成、数据分析、方案撰写...）</li><li>标注每个模板的适用场景和使用技巧</li><li>定期迭代优化表现最好的模板</li><li>与团队分享，建立团队Prompt库</li></ul>', tip: '好的Prompt模板是你的工作效率倍增器，值得花时间持续打磨' },
  ],

  t005: [
    { title: '认识 Midjourney 基本界面', body: '<p>Midjourney 通过 Discord 使用。加入官方服务器后：</p><ul><li>在 #newbies 频道或私信Bot来生成图片</li><li>使用 /imagine 命令输入Prompt</li><li>生成后有 U(放大) 和 V(变体) 按钮</li></ul>', tip: '建议私信Bot使用，避免公共频道信息干扰' },
    { title: '游戏概念设计 Prompt 基础', body: '<p>游戏美术Prompt的基本结构：<strong>主体 + 风格 + 氛围 + 技术参数</strong></p>', example: 'A fantasy game character, female warrior with glowing blue armor, dynamic battle pose, anime art style, dramatic lighting, 8K detailed --ar 16:9 --v 6' },
    { title: '风格关键词掌握', body: '<p>游戏美术常用风格关键词：</p><ul><li><strong>anime/manga style</strong>：二次元风格</li><li><strong>concept art</strong>：概念设计稿风格</li><li><strong>game UI design</strong>：游戏界面设计</li><li><strong>pixel art</strong>：像素风格</li><li><strong>cel shading</strong>：赛璐璐着色</li></ul>' },
    { title: '参数调优详解', body: '<p>核心参数：</p><ul><li><strong>--ar</strong>：宽高比（16:9适合横版，9:16适合竖版，1:1适合头像图标）</li><li><strong>--v</strong>：模型版本</li><li><strong>--s</strong>：风格化程度（0-1000，数值越高越艺术化）</li><li><strong>--c</strong>：混乱度（增加随机性和创意性）</li></ul>' },
    { title: '角色设计工作流', body: '<p>游戏角色设计的完整流程：</p><ul><li>Step 1：生成多个概念草图（低--s值，多变体）</li><li>Step 2：选中喜欢的方向，用V按钮生成变体</li><li>Step 3：用--iw参数加入参考图微调</li><li>Step 4：用U放大获取高清图</li></ul>', example: 'Game character concept sheet, a young mage with fire powers, multiple angles front side back, fantasy RPG style, clean white background --ar 3:2 --v 6' },
    { title: '场景与环境设计', body: '<p>游戏场景Prompt技巧：</p><ul><li>描述明确的空间关系和层次感</li><li>指定光照方向和时间氛围</li><li>使用建筑/自然风格参考</li></ul>', example: 'Fantasy game environment, ancient ruins overgrown with luminescent plants, mysterious fog, volumetric lighting, golden hour, wide angle establishing shot --ar 21:9 --v 6' },
    { title: '营销素材快速生成', body: '<p>用Midjourney生成游戏营销素材：</p><ul><li>社媒配图（--ar 1:1 或 4:5）</li><li>Banner广告（--ar 3:1 或 5:1）</li><li>应用商店截图（--ar 9:19.5）</li></ul>', tip: 'Midjourney生成的图片用于正式商用前，请确认符合公司版权使用规范' },
    { title: '图生图与风格迁移', body: '<p>使用参考图进行创作：</p><ul><li>上传参考图后使用 --iw 控制参考权重（0-2）</li><li>--iw 0.5：弱参考，保留风格</li><li>--iw 1.5：强参考，贴近原图</li></ul>' },
    { title: '批量生成与工作效率', body: '<p>提升批量出图效率：</p><ul><li>准备Prompt模板，只修改关键变量</li><li>使用Repeat功能批量生成</li><li>建立风格一致性的Prompt前缀</li></ul>' },
    { title: 'Niji模式：二次元专项', body: '<p>Midjourney的Niji模式专门针对动漫/二次元风格优化：</p><ul><li>使用 --niji 6 参数开启</li><li>对日式动画风格有更好的理解</li><li>适合二次元游戏角色和CG设计</li></ul>' },
    { title: '常见问题与解决方案', body: '<p>常见问题：</p><ul><li>生成质量不高→增加细节描述和风格参考</li><li>风格不一致→使用固定的Prompt前缀</li><li>画面构图差→明确描述构图和视角</li></ul>' },
    { title: '实战：制作游戏宣传海报', body: '<p>综合练习：为你的游戏项目制作一张宣传海报：</p><ul><li>确定海报主题和核心元素</li><li>编写详细的Prompt</li><li>通过V和U功能迭代优化</li><li>导出最终版本</li></ul>' },
  ],

  t006: [
    { title: '硬件需求与环境准备', body: '<p>运行Stable Diffusion的最低配置：</p><ul><li>显卡：NVIDIA RTX 3060 12GB 或更高（AMD显卡支持有限）</li><li>内存：16GB以上</li><li>存储：建议50GB SSD空余空间</li><li>系统：Windows 10/11 或 Linux</li></ul>', tip: '如果显卡不够强，可以使用Google Colab云端运行' },
    { title: '安装 WebUI（A1111/Forge）', body: '<p>推荐使用 Stable Diffusion WebUI Forge（A1111的优化分支）：</p><ul><li>下载安装包或使用Git克隆</li><li>运行 webui.bat 启动</li><li>首次启动会自动下载基础模型</li></ul>' },
    { title: '基础模型与出图', body: '<p>了解核心概念：</p><ul><li><strong>Checkpoint</strong>：基础模型，决定整体画风</li><li><strong>Prompt/Negative Prompt</strong>：正向和反向提示词</li><li><strong>采样器和步数</strong>：影响生成质量和速度</li></ul>' },
    { title: '游戏美术常用模型推荐', body: '<p>适合游戏美术的模型：</p><ul><li><strong>AnimagineXL</strong>：高质量二次元角色</li><li><strong>DreamShaper</strong>：通用写实+半写实风格</li><li><strong>Counterfeit</strong>：日式动画风格</li></ul>' },
    { title: 'ControlNet 精确控制', body: '<p>ControlNet让你精确控制图片构图和姿态：</p><ul><li><strong>OpenPose</strong>：控制角色姿势</li><li><strong>Canny/Depth</strong>：控制构图和景深</li><li><strong>Tile</strong>：高清放大</li></ul>', tip: 'ControlNet是实现从"随机生成"到"精确设计"的关键工具' },
    { title: 'LoRA 训练基础', body: '<p>LoRA（Low-Rank Adaptation）可以用少量图片微调模型风格：</p><ul><li>准备20-50张训练图片</li><li>使用Kohya_ss工具训练</li><li>训练时间约1-2小时</li></ul>' },
    { title: '训练公司专属风格LoRA', body: '<p>为公司游戏训练专属画风：</p><ul><li>收集游戏内现有美术素材作为训练数据</li><li>统一图片尺寸和质量</li><li>设置合适的训练参数</li></ul>' },
    { title: '批量生成工作流', body: '<p>搭建高效的批量生产流水线：</p><ul><li>使用X/Y/Z Plot批量测试参数</li><li>使用脚本批量生成多个变体</li><li>配合ControlNet保持构图一致性</li></ul>' },
    { title: 'ComfyUI 进阶工作流', body: '<p>ComfyUI是一个节点式的SD操作界面，适合搭建复杂工作流：</p><ul><li>可视化的节点连接方式</li><li>支持工作流保存和分享</li><li>适合需要重复执行的批量任务</li></ul>' },
    { title: 'SDXL 与最新模型', body: '<p>SDXL模型的优势：</p><ul><li>更高的图像质量和细节</li><li>更好的文字渲染能力</li><li>更准确的Prompt理解</li></ul>' },
    { title: 'Inpainting 局部修改', body: '<p>使用Inpainting对已生成图片进行局部修改：</p><ul><li>选中需要修改的区域</li><li>输入新的Prompt描述</li><li>AI只修改选中区域，保持其他部分不变</li></ul>' },
    { title: '图片放大与后期处理', body: '<p>将SD生成的图片提升到可用质量：</p><ul><li>使用Hires.fix进行高清放大</li><li>4x-UltraSharp等放大模型</li><li>配合Photoshop做最终调整</li></ul>' },
    { title: '团队协作与资产管理', body: '<p>在团队中管理SD资源：</p><ul><li>统一管理模型和LoRA文件</li><li>共享有效的Prompt模板</li><li>建立美术素材质量标准</li></ul>' },
    { title: 'API集成与自动化', body: '<p>将SD集成到生产流水线：</p><ul><li>使用WebUI API接口</li><li>编写Python脚本自动化生成</li><li>定时批量处理任务</li></ul>' },
    { title: '综合实战项目', body: '<p>完成一个综合项目：为游戏创建一套完整的角色立绘：</p><ul><li>训练角色风格LoRA</li><li>使用ControlNet控制姿势</li><li>批量生成多个角色变体</li><li>后期处理达到商用品质</li></ul>' },
  ],

  t007: [
    { title: '主流AI视频工具概览', body: '<p>当前主要的AI视频生成工具：</p><ul><li><strong>Runway Gen-3</strong>：功能最全面，支持文生视频、图生视频</li><li><strong>可灵(Kling)</strong>：快手出品，效果出色，国内可用</li><li><strong>Pika</strong>：简单易用，适合快速生成短视频</li><li><strong>Sora</strong>：OpenAI出品，画质最高但使用受限</li></ul>' },
    { title: '各工具优劣势对比', body: '<p>按使用场景选择：</p><ul><li><strong>游戏CG预告片</strong>：Runway（控制力强）或可灵（中文友好）</li><li><strong>社媒短视频素材</strong>：Pika（快速出片）</li><li><strong>概念演示视频</strong>：可灵（性价比高）</li></ul>' },
    { title: 'Runway 实战操作', body: '<p>Runway Gen-3 的基本使用流程：</p><ul><li>上传参考图或输入文字描述</li><li>调整运动强度和风格参数</li><li>生成、预览、选择最佳版本</li></ul>', example: 'A fantasy game character walking through a mystical forest, cinematic lighting, slow camera pan, epic atmosphere' },
    { title: '可灵(Kling)实战操作', body: '<p>可灵的核心优势是对中文的理解和生成质量：</p><ul><li>支持中文Prompt输入</li><li>运动控制和镜头语言丰富</li><li>国内访问无障碍</li></ul>', example: '一个游戏角色在古城废墟中行走，阳光从残破的穹顶洒落，电影级光影效果，缓慢推进镜头' },
    { title: '游戏宣传视频制作流程', body: '<p>用AI工具制作游戏宣传视频的完整流程：</p><ul><li>Step 1：策划分镜脚本（3-5个关键画面）</li><li>Step 2：用Midjourney生成关键帧图片</li><li>Step 3：用AI视频工具实现画面动态化</li><li>Step 4：用剪辑软件组装、加音乐和字幕</li></ul>' },
    { title: '图生视频技巧', body: '<p>从静态图片生成视频的关键技巧：</p><ul><li>选择构图简洁、主体明确的图片</li><li>运动描述要具体（"镜头从左向右平移"比"动起来"好）</li><li>控制生成时长（4秒效果通常优于10秒）</li></ul>', tip: '先用Midjourney生成高质量起始帧，再用AI视频工具让它动起来，效果最好' },
    { title: '视频拼接与后期', body: '<p>将AI生成的片段组装成完整视频：</p><ul><li>使用剪映/Premiere进行片段拼接</li><li>添加转场效果保证流畅性</li><li>配上BGM和音效增强感染力</li></ul>' },
    { title: '成本与效率考量', body: '<p>各工具的成本对比：</p><ul><li><strong>Runway</strong>：按秒计费，适合精品制作</li><li><strong>可灵</strong>：国内性价比最高</li><li><strong>Pika</strong>：免费额度适合小批量需求</li></ul><p>建议：先用免费额度测试效果，确定方案后再投入付费生成。</p>' },
    { title: '实战：制作15秒游戏推广短视频', body: '<p>综合实战练习：</p><ul><li>为一款游戏制作15秒的短视频广告</li><li>包含3-4个AI生成的画面</li><li>配上文字和音乐</li><li>导出适合投放的格式</li></ul>' },
  ],

  t008: [
    { title: '广告文案的核心要素', body: '<p>高转化广告文案 = <strong>精准痛点 + 清晰利益点 + 紧迫感 + 行动号召</strong></p><ul><li><strong>痛点</strong>：用户当前不满足的需求</li><li><strong>利益点</strong>：你的产品如何解决这个需求</li><li><strong>紧迫感</strong>：为什么现在就要行动</li><li><strong>CTA</strong>：清晰的行动引导</li></ul>' },
    { title: '用AI进行受众分析', body: '<p>写文案前先让AI分析目标受众：</p>', example: '我们的游戏是一款二次元卡牌手游，目标用户是18-28岁的ACG爱好者。\n\n请帮我深入分析这个用户群体：\n1. 他们在游戏中最看重什么（玩法？角色？社交？）\n2. 他们常见的决策顾虑是什么\n3. 什么样的文案风格最能引起他们共鸣\n4. 他们活跃在哪些平台和社区', tip: '好的受众分析是好文案的基础，花10分钟做分析能省1小时改稿' },
    { title: '批量生成文案变体', body: '<p>用AI一次生成多个文案版本进行A/B测试：</p>', example: '请为以下广告位生成5个不同角度的文案：\n\n产品：SLG手游《铁血征途》\n广告位：短视频信息流广告（5秒内抓住注意力）\n目标：提高点击率\n\n请分别从以下5个角度写：\n1. 强调策略深度（"用脑子打仗"）\n2. 强调社交/联盟（"兄弟并肩"）\n3. 强调成就感（"从小兵到王者"）\n4. 强调福利（"新人豪礼"）\n5. 强调竞技对抗（"真人对战"）\n\n每条文案25字以内，配10字以内的CTA。' },
    { title: '文案优化与迭代', body: '<p>已有文案效果不好？让AI帮你优化：</p><ul><li>提供当前文案和效果数据</li><li>说明问题所在（点击率低？转化率低？）</li><li>让AI提出优化方案和原因</li></ul>', example: '以下广告文案的CTR只有1.2%，行业平均是2.5%。请分析问题并优化：\n\n当前文案："下载铁血征途，体验最强SLG"\n\n已知信息：\n- 目标用户：25-35岁男性\n- 投放渠道：抖音信息流\n- 行业CTR均值：2.5%\n\n请提出3个优化版本并解释每个版本的改进思路。' },
    { title: '不同平台的文案适配', body: '<p>不同平台需要不同的文案风格：</p><ul><li><strong>B站</strong>：年轻化、玩梗、自嘲式幽默</li><li><strong>抖音</strong>：直接、冲击力强、前3秒抓眼球</li><li><strong>微信公众号</strong>：深度、故事化、情感共鸣</li><li><strong>微博</strong>：话题性、互动性、简短有力</li></ul>', tip: '同一个产品的文案，投放不同平台时一定要做风格适配' },
    { title: '竞品文案分析', body: '<p>让AI分析竞品的广告文案策略：</p>', example: '以下是竞品《王国纪元》最近一个月的5条高曝光广告文案。请分析：\n1. 他们主打的核心卖点是什么\n2. 文案的共同规律和套路\n3. 有哪些值得借鉴的技巧\n4. 他们可能忽略的差异化角度（我们可以切入的）\n\n竞品文案：\n[列出竞品文案]' },
    { title: '本地化文案技巧', body: '<p>游戏出海时的文案本地化不是简单翻译：</p><ul><li>让AI了解目标市场的文化背景</li><li>使用当地的流行表达和梗</li><li>避免文化禁忌和敏感内容</li></ul>', example: '请将以下中文游戏广告文案翻译并本地化为日语版本。不要直译，请根据日本手游玩家的习惯调整表达方式和卖点侧重。\n\n中文文案：[原文]\n\n注意事项：\n- 日本玩家更看重什么\n- 日语广告的常见表达习惯\n- 需要避免的表达方式' },
    { title: '实战：完整的文案投放方案', body: '<p>综合练习：为一款游戏制作完整的文案投放方案：</p><ul><li>Step 1：用AI分析目标受众画像</li><li>Step 2：生成10+条文案变体</li><li>Step 3：按平台分组适配</li><li>Step 4：为A/B测试设定假设和评估标准</li></ul>' },
  ],

  t009: [
    { title: '活动策划的AI辅助框架', body: '<p>AI可以在活动策划的每个环节提供辅助：</p><ul><li><strong>创意发散</strong>：生成活动主题和玩法创意</li><li><strong>方案撰写</strong>：结构化输出完整方案</li><li><strong>数值测算</strong>：辅助奖励和经济设计</li><li><strong>文案输出</strong>：生成活动相关的所有文案</li></ul>' },
    { title: '创意发散：生成活动主题', body: '<p>让AI基于游戏特点和节日节点发散活动创意：</p>', example: '我们的游戏是一款三国题材SLG，日活8万。请为即将到来的端午节设计5个不同方向的游戏活动主题创意。\n\n要求：\n- 结合三国文化和端午元素\n- 每个创意包含：主题名、核心玩法、预期效果\n- 考虑不同消费层级的玩家体验' },
    { title: '方案结构化输出', body: '<p>用AI快速生成结构完整的活动方案：</p><ul><li>活动概述（目标、时间、规模）</li><li>玩法设计（核心循环、参与路径）</li><li>奖励设计（道具、货币、限定物品）</li><li>推广计划（预热、开启、收尾）</li><li>风险预案</li></ul>', tip: '先让AI出一个完整框架，再逐个部分深入打磨，比从头到尾一次性写效率更高' },
    { title: '奖励数值设计', body: '<p>让AI辅助设计活动奖励的数值：</p>', example: '请帮我设计一个7天签到活动的奖励表。\n\n游戏背景：\n- 游戏内主要货币：金币、钻石\n- 当前玩家日均产出：金币5万，钻石50\n- 活动目标：提升7日留存\n\n要求：\n- 奖励逐日递增，制造坚持的动力\n- 第7天有一个高价值奖励作为锚点\n- 总发放量不超过正常产出的30%\n- 请给出具体数值和设计理由' },
    { title: '活动文案全套生成', body: '<p>一次性生成活动需要的所有文案：</p><ul><li>活动公告（游戏内弹窗）</li><li>规则说明</li><li>社媒预热文案</li><li>推送通知文案</li></ul>' },
    { title: '用户反馈预演', body: '<p>让AI模拟不同类型玩家的反应：</p>', example: '请分别从以下4种玩家视角评价这个活动方案：\n1. 重度付费玩家（月充值>500元）\n2. 中度付费玩家（月充值50-200元）\n3. 零氪玩家\n4. 回流玩家\n\n活动方案：[粘贴方案]\n\n请指出每种玩家可能的不满点和建议的调整。' },
    { title: '数据分析模板准备', body: '<p>提前准备活动复盘的数据分析框架：</p><ul><li>让AI设计数据埋点方案</li><li>确定关键指标和评估标准</li><li>准备数据分析报告模板</li></ul>' },
    { title: '活动复盘报告生成', body: '<p>活动结束后用AI快速生成复盘报告：</p><ul><li>输入原始数据</li><li>让AI分析达成情况</li><li>总结经验教训</li><li>输出改进建议</li></ul>' },
    { title: '实战：策划一场完整活动', body: '<p>综合练习：从零开始策划一场游戏活动</p><ul><li>使用所有学到的AI辅助技巧</li><li>输出一份完整的可执行方案</li><li>包含文案、数值、推广计划</li></ul>' },
  ],

  t010: [
    { title: '海外市场调研框架', body: '<p>使用AI进行海外市场调研的标准框架：</p><ul><li>市场规模与增长趋势</li><li>用户画像与消费习惯</li><li>竞争格局与头部产品</li><li>本地化要求与合规政策</li></ul>' },
    { title: '市场数据收集', body: '<p>用Perplexity和ChatGPT收集市场数据：</p>', example: '请调研2024年日本手游市场：\n1. 市场总规模和同比增长率\n2. 各品类（RPG、SLG、休闲等）的市场份额\n3. 头部产品TOP10及收入估算\n4. 主要分发渠道（App Store vs Google Play市场份额）\n\n请标注数据来源，区分确切数据和估算数据。' },
    { title: '玩家画像构建', body: '<p>让AI帮你构建目标市场的玩家画像：</p><ul><li>人口统计特征</li><li>游戏偏好和付费习惯</li><li>社交平台使用习惯</li><li>文化价值观特点</li></ul>' },
    { title: '竞品深度分析', body: '<p>对海外竞品进行系统化分析：</p><ul><li>产品功能对比矩阵</li><li>运营策略分析</li><li>用户评价情感分析</li><li>商业模式拆解</li></ul>', tip: '让AI阅读竞品应用商店的用户评论，进行情感分析和诉求提取' },
    { title: '本地化策略制定', body: '<p>基于调研结果制定本地化策略：</p><ul><li>语言和文化适配重点</li><li>运营节奏与当地节日同步</li><li>付费模型本地化调整</li><li>合规与审查要求</li></ul>' },
    { title: '调研报告输出', body: '<p>将所有调研结果整理为结构化报告：</p><ul><li>使用Claude整理大量调研素材</li><li>按标准模板输出完整报告</li><li>包含数据可视化建议</li></ul>' },
    { title: '持续监测机制', body: '<p>建立日常的海外市场监测：</p><ul><li>设定关键指标的追踪频率</li><li>使用AI定期搜索竞品动态</li><li>建立预警机制</li></ul>' },
    { title: '实战：输出一份完整的市场进入报告', body: '<p>为一款游戏的海外发行制作完整的市场分析报告，运用本教程学到的所有方法。</p>' },
  ],

  t011: [
    { title: '数值策划中的AI应用场景', body: '<p>AI可以在以下数值工作中提供辅助：</p><ul><li><strong>数值表检查</strong>：快速发现公式错误和异常值</li><li><strong>经济系统分析</strong>：模拟不同参数下的经济运行情况</li><li><strong>平衡性分析</strong>：检测角色/道具的强度偏差</li><li><strong>参数推演</strong>：预测调整参数后的影响</li></ul>' },
    { title: '数值表自动检查', body: '<p>将数值表数据粘贴给AI，让它进行自动检查：</p>', example: '以下是游戏角色升级经验需求表（1-100级）。请检查：\n1. 经验增长曲线是否平滑合理\n2. 是否存在明显的断层或跳变\n3. 到满级的预计时间是否合理（预期30天到满级）\n4. 给出优化建议\n\n数据：\n[粘贴数值表]' },
    { title: '经济系统建模', body: '<p>让AI帮你分析游戏经济系统：</p><ul><li>货币产出与消耗的平衡分析</li><li>通货膨胀/紧缩风险评估</li><li>不同付费层级的体验差异</li></ul>', tip: 'AI做数值分析的结果需要用Excel或专业工具验证，不要直接使用' },
    { title: '概率与随机系统设计', body: '<p>用AI辅助设计抽卡、掉落等概率系统：</p><ul><li>计算保底机制的期望消耗</li><li>模拟大量玩家的抽卡结果分布</li><li>评估不同概率方案的玩家体验</li></ul>' },
    { title: '平衡性快速评估', body: '<p>让AI对比分析不同角色或装备的数值，找出平衡性问题：</p>', example: '以下是5个角色的核心数值对比（攻击、防御、血量、技能倍率）。\n请分析：\n1. 是否存在明显的强弱差距\n2. 各角色的定位是否清晰\n3. 哪些角色需要调整，建议调整方向\n\n数据：[角色数值表]' },
    { title: '参数调整影响推演', body: '<p>在修改数值前，让AI帮你推演可能的影响：</p><ul><li>描述计划的数值调整</li><li>让AI分析对不同类型玩家的影响</li><li>预测可能引起的连锁反应</li></ul>' },
    { title: '实战：设计一个完整的道具成长体系', body: '<p>综合练习：设计一套装备强化数值体系，包含成长曲线、消耗资源、成功率等完整参数。</p>' },
  ],

  t012: [
    { title: '内容工厂的核心理念', body: '<p>"内容工厂"是指用AI工具搭建半自动化的内容生产流水线，核心理念：</p><ul><li><strong>流程标准化</strong>：每个环节有固定的模板和SOP</li><li><strong>工具自动化</strong>：最大化利用AI减少重复劳动</li><li><strong>质量可控</strong>：人工把关关键节点</li></ul>' },
    { title: '选题自动化', body: '<p>用AI自动发现内容选题：</p><ul><li>用Perplexity追踪行业热点</li><li>用ChatGPT分析竞品内容策略</li><li>基于数据反馈优化选题方向</li></ul>', example: '请基于以下游戏行业热点关键词，为我们的公众号生成下周5个选题建议：\n\n热点关键词：[本周热点]\n我们的定位：游戏行业AI应用分享\n目标读者：游戏从业者\n\n每个选题请包含：标题、角度、预计阅读量级、写作难度' },
    { title: '内容生产 SOP', body: '<p>标准化的内容生产流程：</p><ul><li>Step 1：AI生成大纲（3分钟）</li><li>Step 2：人工审核调整大纲（5分钟）</li><li>Step 3：AI生成初稿（5分钟）</li><li>Step 4：人工编辑润色（15分钟）</li><li>Step 5：AI生成配图和摘要（3分钟）</li></ul>', tip: '关键是人工把关"审核"环节，AI负责量产，人负责质量' },
    { title: '多平台内容适配', body: '<p>一篇内容适配多个平台的方法：</p><ul><li>长文→公众号原创文章</li><li>要点提取→微博/小红书短内容</li><li>核心观点→短视频脚本</li></ul>', example: '请将以下2000字文章改编为：\n1. 一条200字的微博\n2. 一条小红书笔记（含标题、正文、标签）\n3. 一条60秒短视频脚本\n\n原文：[粘贴原文]' },
    { title: '配图与视觉素材', body: '<p>用AI工具快速生成配图：</p><ul><li>Canva AI：模板化设计，快速出图</li><li>Midjourney：独特的概念配图</li><li>统一视觉风格保持品牌一致性</li></ul>' },
    { title: '排期与分发管理', body: '<p>建立内容日历和分发计划：</p><ul><li>使用表格管理内容排期</li><li>按平台特点安排发布时间</li><li>AI辅助撰写分发文案</li></ul>' },
    { title: '数据复盘与优化', body: '<p>用AI分析内容表现数据：</p><ul><li>阅读量/互动率趋势分析</li><li>高表现内容的共同特征</li><li>选题和发布时间的优化建议</li></ul>' },
    { title: '团队协作流程', body: '<p>多人协作的内容工厂运作：</p><ul><li>角色分工：选题人→写作人→审核人→分发人</li><li>使用共享的Prompt模板库</li><li>建立质量检查清单</li></ul>' },
    { title: 'Prompt模板库搭建', body: '<p>为内容生产搭建专属的Prompt模板库：</p><ul><li>按内容类型分类（新闻评论、教程、案例分析...）</li><li>每个模板包含变量和使用说明</li><li>定期根据效果迭代优化</li></ul>' },
    { title: '效率指标追踪', body: '<p>量化内容工厂的效率提升：</p><ul><li>单篇内容生产时间</li><li>每周内容产出量</li><li>内容质量评分</li></ul>' },
    { title: '实战：搭建你的内容生产流水线', body: '<p>综合练习：搭建一套可执行的内容工厂流程，输出一周的内容计划和第一篇完整内容。</p>' },
  ],

  t013: [
    { title: '为什么用AI写PRD', body: '<p>AI辅助写PRD的核心价值：</p><ul><li>大幅缩短初稿时间</li><li>确保结构完整不遗漏</li><li>帮助梳理逻辑和边界条件</li></ul>' },
    { title: '需求收集与整理', body: '<p>用AI辅助整理需求：</p>', example: '以下是最近两周的需求反馈汇总（来自运营、客服、用户评论）。请帮我：\n1. 对需求进行分类整理\n2. 按优先级排序（影响范围×紧急程度）\n3. 合并重复需求\n4. 标注可能的技术风险\n\n需求列表：[粘贴需求]' },
    { title: 'PRD结构模板', body: '<p>标准PRD结构：</p><ul><li>需求背景与目标</li><li>用户故事与场景</li><li>功能详细描述</li><li>交互流程与规则</li><li>异常处理与边界条件</li><li>数据埋点需求</li><li>排期与里程碑</li></ul>' },
    { title: '用AI生成用户故事', body: '<p>让AI帮你生成完整的用户故事：</p>', example: '我正在设计一个游戏内的好友系统。请帮我生成完整的用户故事，覆盖以下角色：\n1. 新玩家（想找人一起玩）\n2. 老玩家（管理好友列表）\n3. 公会玩家（通过好友系统招募）\n\n每个用户故事使用格式：\n作为[角色]，我想要[功能]，以便[价值]' },
    { title: '边界条件与异常处理', body: '<p>PRD最容易遗漏的部分，让AI帮你查漏补缺：</p><ul><li>输入极端值的处理</li><li>网络异常的处理</li><li>并发操作的冲突</li><li>版本兼容性考虑</li></ul>', tip: '让AI扮演"最爱找Bug的测试工程师"来审查你的PRD，效果特别好' },
    { title: 'AI辅助评审准备', body: '<p>用AI提前预演PRD评审可能遇到的质疑：</p>', example: '请阅读以下PRD，然后分别从以下角色的视角提出3个最可能的质疑：\n1. 开发Leader（关注技术可行性和工期）\n2. 运营负责人（关注用户体验和数据效果）\n3. QA负责人（关注测试覆盖和异常场景）\n\nPRD：[粘贴PRD]' },
    { title: '实战：用AI完成一份完整PRD', body: '<p>选择一个你工作中的真实需求，使用AI辅助完成完整的PRD文档。</p>' },
  ],

  t014: [
    { title: '数据隐私红线', body: '<p>使用AI工具时<strong>绝对不能输入</strong>的信息：</p><ul><li>用户真实个人信息（姓名、手机号、身份证）</li><li>公司核心财务数据和未公开信息</li><li>登录密码、API密钥等凭证</li><li>未公开的商业策略和核心技术</li></ul><p>所有输入AI的内容都可能被用于模型训练，务必脱敏处理。</p>', tip: '一个简单原则：如果这个信息发到公司全员群你会不安，那就不要给AI' },
    { title: '信息准确性验证', body: '<p>AI会"幻觉"——编造看似合理但不存在的信息：</p><ul><li><strong>数据类</strong>：AI给出的具体数字（市场份额、用户量等）务必交叉验证</li><li><strong>时效类</strong>：AI可能给出过时的信息</li><li><strong>专业类</strong>：行业特定的规则和政策需要确认</li></ul><p>原则：AI的输出是"初稿"，不是"定稿"。关键信息必须人工确认。</p>', example: '使用AI输出的正确流程：\n\n✅ 正确：AI生成分析报告初稿 → 人工核实数据 → 确认后使用\n❌ 错误：AI生成分析报告 → 直接发给领导\n\n✅ 正确：AI翻译合同内容 → 法务确认 → 使用\n❌ 错误：AI翻译合同 → 直接签署' },
    { title: '版权与知识产权', body: '<p>AI生成内容的版权风险：</p><ul><li>AI生成的文字内容目前版权归属不明确</li><li>AI生成的图片可能包含训练数据中的版权元素</li><li>商用前务必确认AI工具的使用条款</li></ul><p>最佳实践：AI生成的内容作为创作基础，经过人工大幅修改后使用。</p>' },
    { title: '公司AI使用规范', body: '<p>建立和遵守公司的AI使用规范：</p><ul><li>明确哪些场景可以使用AI</li><li>数据脱敏的标准操作流程</li><li>AI输出的审核和确认流程</li><li>对外发布AI生成内容的标注要求</li></ul>', tip: '如果公司还没有AI使用规范，主动向上级建议建立一套，这本身就是AI能力的体现' },
    { title: '安全使用的最佳实践', body: '<p>日常使用AI的安全checklist：</p><ul><li>✅ 输入前检查是否含敏感信息</li><li>✅ 输出后验证关键数据的准确性</li><li>✅ 商用内容检查版权合规</li><li>✅ 重要决策不完全依赖AI</li><li>✅ 保持对AI输出的批判性思维</li></ul>' },
  ],

  t015: [
    { title: '竞品分析的AI辅助框架', body: '<p>系统化竞品分析的标准流程：</p><ul><li>Step 1：确定竞品范围和分析维度</li><li>Step 2：信息收集（AI搜索+手动收集）</li><li>Step 3：结构化分析（AI辅助对比和归纳）</li><li>Step 4：洞察提取和策略建议</li></ul>' },
    { title: '竞品信息收集', body: '<p>用AI工具高效收集竞品信息：</p>', example: '请帮我收集以下3款竞品游戏的信息：\n[游戏A]、[游戏B]、[游戏C]\n\n每款游戏请收集：\n1. 基本信息（开发商、上线时间、平台）\n2. 核心玩法和特色功能\n3. 商业模式（付费方式、定价策略）\n4. 最近3个月的重大更新\n5. 应用商店评分和主要用户评价' },
    { title: '多维度对比分析', body: '<p>让AI帮你建立竞品对比矩阵：</p><ul><li>功能对比矩阵</li><li>用户体验对比</li><li>商业模式对比</li><li>技术实现对比</li></ul>' },
    { title: '用户评价深度分析', body: '<p>将竞品的应用商店评价交给AI分析：</p>', example: '以下是竞品[游戏名]最近100条应用商店评价。请分析：\n1. 用户最满意的3个方面\n2. 用户最不满的3个方面\n3. 用户提到最多的功能需求\n4. 我们可以借鉴的改进点\n\n评价内容：[粘贴评价]' },
    { title: '竞品运营策略分析', body: '<p>分析竞品的运营动作和策略：</p><ul><li>活动频率和类型分析</li><li>内容营销策略</li><li>社区运营方式</li><li>付费活动设计</li></ul>' },
    { title: '差异化机会识别', body: '<p>基于分析结果，让AI帮你找到差异化机会：</p><ul><li>竞品共同缺失的功能</li><li>用户未被满足的需求</li><li>可以差异化的方向</li></ul>' },
    { title: '竞品监测机制', body: '<p>建立持续的竞品监测：</p><ul><li>每周用AI搜索竞品动态</li><li>版本更新追踪</li><li>营销动作监控</li></ul>' },
    { title: '实战：输出竞品分析报告', body: '<p>选择你工作中的真实竞品，运用全部方法输出一份完整的竞品分析报告。</p>' },
  ],

  t016: [
    { title: '数据报告的AI生成原理', body: '<p>AI生成数据报告的核心流程：</p><ul><li>Step 1：输入结构化数据（表格/CSV）</li><li>Step 2：告诉AI分析维度和重点</li><li>Step 3：AI输出结构化分析和结论</li><li>Step 4：人工校验和润色</li></ul>' },
    { title: '数据准备与格式化', body: '<p>让AI高效分析数据的输入技巧：</p><ul><li>数据要有清晰的列名</li><li>数值数据保持一致的格式</li><li>去除无关列减少干扰</li></ul>', tip: '数据量大时，先给AI一个小样本和列说明，确认它理解后再输入完整数据' },
    { title: '分析维度设定', body: '<p>告诉AI你需要的分析角度：</p>', example: '以下是本月广告投放数据。请从以下维度分析：\n\n1. 渠道效率对比（CPA、ROI排名）\n2. 时间趋势（哪些天表现异常，可能原因）\n3. 素材效果（不同素材类型的CTR对比）\n4. 预算分配建议（基于ROI最优分配）\n\n数据：[粘贴数据]' },
    { title: '报告模板设计', body: '<p>设计标准化的报告模板，让AI每次都输出一致的格式：</p><ul><li>摘要（3句话概括核心发现）</li><li>关键指标看板</li><li>详细分析</li><li>结论与建议</li></ul>' },
    { title: '图表建议与可视化', body: '<p>让AI建议最适合的数据可视化方式：</p><ul><li>趋势数据→折线图</li><li>占比数据→饼图或堆叠图</li><li>对比数据→柱状图</li><li>相关性→散点图</li></ul>' },
    { title: '实战：生成一份周报', body: '<p>综合练习：用你的实际工作数据，通过AI生成一份完整的周报或月报，包含数据分析、结论和建议。</p>' },
  ],

  t017: [
    { title: '什么是AI Agent', body: '<p>AI Agent是能够<strong>自主完成复杂任务</strong>的AI系统，与普通AI对话的区别：</p><ul><li><strong>普通AI</strong>：你问一个问题，它给一个回答</li><li><strong>AI Agent</strong>：你给一个目标，它自主规划步骤、调用工具、迭代完成</li></ul><p>类比：普通AI是"计算器"，AI Agent是"实习生"。</p>' },
    { title: 'AI Agent的核心能力', body: '<p>Agent相比普通AI多了什么：</p><ul><li><strong>规划能力</strong>：将复杂任务拆解为步骤</li><li><strong>工具使用</strong>：可以搜索网页、读写文件、调用API</li><li><strong>记忆系统</strong>：记住长期信息和上下文</li><li><strong>自我反思</strong>：检查结果是否满足要求，自动修正</li></ul>' },
    { title: '当前AI Agent的能力边界', body: '<p>现阶段Agent能做什么和不能做什么：</p><ul><li>✅ 自动搜集和整理信息</li><li>✅ 按指令完成结构化任务</li><li>✅ 简单的多步骤工作流</li><li>⚠️ 复杂决策仍需人工把关</li><li>⚠️ 创造性工作需要人类引导</li></ul>' },
    { title: '对游戏行业的影响', body: '<p>AI Agent可能改变游戏行业的工作方式：</p><ul><li><strong>运营自动化</strong>：Agent自动监控数据、触发运营动作</li><li><strong>内容生产</strong>：Agent自动生产和分发内容</li><li><strong>用户服务</strong>：Agent处理大部分客服需求</li><li><strong>测试自动化</strong>：Agent自动发现和报告Bug</li></ul>' },
    { title: '如何准备AI Agent时代', body: '<p>提前为Agent时代做准备：</p><ul><li>学会"拆解任务"——这是与Agent协作的核心能力</li><li>建立标准化的工作流程（Agent需要明确的SOP）</li><li>培养"审核"能力——从执行者变为监督者</li></ul>' },
    { title: '展望与持续学习', body: '<p>AI Agent领域发展极快，保持学习：</p><ul><li>关注OpenAI、Anthropic、Google的Agent产品动态</li><li>尝试使用现有的Agent工具（Claude Artifacts、GPTs等）</li><li>思考自己工作中哪些环节可以被Agent化</li></ul>' },
  ],

  t018: [
    { title: '认识 Canva AI 功能', body: '<p>Canva内置了强大的AI功能：</p><ul><li><strong>Magic Design</strong>：输入文字自动生成完整设计</li><li><strong>Magic Edit</strong>：AI编辑和修改图片</li><li><strong>Magic Write</strong>：AI生成文案</li><li><strong>背景移除</strong>：一键去除图片背景</li><li><strong>Magic Resize</strong>：一键适配多种尺寸</li></ul>' },
    { title: '快速制作社媒配图', body: '<p>用Canva AI在5分钟内制作社媒配图：</p><ul><li>选择合适的尺寸模板（微博1:1、小红书3:4等）</li><li>使用Magic Design输入主题自动生成</li><li>调整文字和品牌色</li><li>导出</li></ul>', tip: '建立品牌模板Kit，保存公司的品牌色、Logo和常用字体，所有设计保持一致' },
    { title: '活动海报制作', body: '<p>用AI辅助制作游戏活动海报：</p><ul><li>选择游戏主题相关的模板</li><li>用AI生成活动标题文案</li><li>上传游戏素材和角色图</li><li>使用动效增强视觉吸引力</li></ul>' },
    { title: '批量尺寸适配', body: '<p>Magic Resize实现一图多用：</p><ul><li>设计一个主视觉</li><li>一键生成微博/公众号/朋友圈/Banner等多个尺寸</li><li>微调各尺寸的排版</li></ul>' },
    { title: '品牌一致性管理', body: '<p>使用Canva的品牌功能保持视觉一致：</p><ul><li>设置品牌色板和字体</li><li>上传Logo和品牌素材</li><li>创建品牌模板供团队使用</li></ul>' },
    { title: '实战：制作一周社媒内容配图', body: '<p>综合练习：为一周的社媒内容计划（5条内容）制作配套的视觉素材，保持风格统一，控制在30分钟内完成。</p>' },
  ],
};

// 应用内容到教程对象
tutorials.forEach(t => {
  if (CONTENT_MAP[t.id]) {
    t.content = CONTENT_MAP[t.id];
    t.steps = CONTENT_MAP[t.id].length; // 更新步骤数
  }
});

// 写入
fs.writeFileSync(TUTORIALS_FILE, JSON.stringify(tutorials, null, 2), 'utf8');
console.log(`✅ 已写入 ${TUTORIALS_FILE}`);
console.log(`📊 共 ${tutorials.length} 个教程，${tutorials.filter(t => t.content).length} 个有内容`);
tutorials.forEach(t => {
  console.log(`  ${t.id}: ${t.title} — ${t.content ? t.content.length + ' 步骤' : '无内容'}`);
});
