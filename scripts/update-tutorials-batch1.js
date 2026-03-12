#!/usr/bin/env node
/**
 * batch-1 Day 2: 更新 t001 和 t009 的扩展字段和内容
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// ===== t001 更新 =====
const t001 = tutorials.find(t => t.id === 't001');
if (!t001) { console.error('t001 not found'); process.exit(1); }

t001.title = '用 ChatGPT 完成你的第一个 AI 工作任务';
t001.desc = '从注册账号到产出第一份可用工作成果，45 分钟掌握 ChatGPT 的核心用法';
t001.steps = 6;
t001.solves = '让从未用过 AI 的人在 45 分钟内用 ChatGPT 完成一个真实工作任务';
t001.outcome = '一份用 AI 产出的真实工作交付物（周报/文案/方案大纲）';
t001.fitLevel = '零基础，从未用过 AI 工具';
t001.relatedPrompts = ['p001', 'p009'];
t001.relatedTools = ['chatgpt'];

t001.content = [
  {
    title: '注册并进入 ChatGPT（5 分钟）',
    body: '<p><strong>做什么</strong>：注册 ChatGPT 账号，进入对话界面。</p><ol><li>打开 chatgpt.com</li><li>用 Google 账号一键注册（或用邮箱注册）</li><li>进入对话界面后，顶部选择「GPT-5」模型</li></ol><p><strong>容易踩的坑</strong>：</p><ul><li>❌ 选错模型：顶部可能显示旧模型名称，确保选的是「GPT-5」。免费版 GPT-5 已经足够强，不需要付费。</li><li>❌ 页面加载慢：首次加载可能需要 10-20 秒，耐心等待。</li></ul>',
    tip: '免费版 GPT-5 每天可用 15-20 次，日常使用完全够了'
  },
  {
    title: '写好你的第一个 Prompt（10 分钟）',
    body: '<p><strong>做什么</strong>：学会写出一个清晰的工作指令（Prompt），让 AI 明白你要什么。</p><p><strong>为什么重要</strong>：Prompt 的质量直接决定 AI 输出的质量。一个好 Prompt 能让你省下 80% 的来回修改时间。</p><p><strong>核心公式</strong>：好 Prompt = 角色 + 任务 + 背景 + 要求 + 格式</p><p><strong>容易踩的坑</strong>：</p><ul><li>❌ 只说「帮我写个文案」——太模糊，AI 不知道写什么风格、给谁看、多长。</li><li>❌ 一次塞太多要求——先给核心需求，看到输出后再迭代。</li><li>❌ 忘记指定格式——不说格式，AI 可能输出长篇解释而不是你要的成品。</li></ul>',
    tip: '在 Prompt 开头加角色设定效果最佳，例如「你是一名资深游戏运营专家」',
    example: '角色：你是一名有 10 年经验的游戏运营主管\n任务：为我们的二次元 RPG 手游撰写一条新版本预告微博\n背景：\n- 目标用户：18-25 岁二次元爱好者\n- 新版本亮点：新 SSR 角色「月华」上线 + 新主线剧情第 7 章\n要求：\n- 语气轻松有趣，适当用梗\n- 120 字以内\n- 带 2 个话题标签\n格式：直接输出微博文案，不需要解释'
  },
  {
    title: '学会迭代——把 80 分改成 95 分（10 分钟）',
    body: '<p><strong>做什么</strong>：AI 的第一版输出通常是 80 分。用 2-3 轮追问把它改到 95 分。</p><p><strong>为什么这样做</strong>：AI 不是一次性工具，它是对话伙伴。越精确地告诉它哪里不对，输出越好。</p><p><strong>3 种最常用的迭代指令</strong>：</p><ol><li><strong>调风格</strong>：「语气再活泼一些，加 2 个 emoji」</li><li><strong>改细节</strong>：「保持整体不变，把第二句换一个角度，从玩家期待感出发」</li><li><strong>否定重来</strong>：「这个方向不对。换一个角度，从新角色的战斗特效出发」</li></ol><p><strong>容易踩的坑</strong>：</p><ul><li>❌ 每次都从头开始——不需要重新写 Prompt，直接在对话中追问。</li><li>❌ 说「改好一点」——太模糊。说清楚哪里不好、想要什么方向。</li></ul>',
    tip: '万能迭代句式：「保持 XXX 不变，只修改 YYY」——这是效率最高的迭代方式'
  },
  {
    title: '完成你的第一个真实工作任务（15 分钟）',
    body: '<p><strong>做什么</strong>：把前面学到的方法应用到一个你本周正在做的真实任务上。只有用在真实任务上，你才能记住这些技巧。</p><p><strong>按你的岗位选一个任务</strong>：</p><ul><li><strong>运营</strong>：本周数据周报 → 搭配数据周报 Prompt (p009)</li><li><strong>策划</strong>：一个需求的 PRD 大纲 → 搭配 PRD 生成 Prompt (p004)</li><li><strong>新媒体</strong>：下周 3 天的选题</li><li><strong>品牌</strong>：一段活动预热文案</li><li><strong>投放</strong>：5 条广告文案变体 → 搭配广告文案 Prompt (p002)</li></ul><p><strong>操作步骤</strong>：</p><ol><li>从上方选一个任务</li><li>用步骤 2 的公式写 Prompt（角色 + 任务 + 背景 + 要求 + 格式）</li><li>看到输出后，用步骤 3 的方法迭代 2-3 轮</li><li>产出一份你可以直接使用的工作交付物</li></ol>',
    tip: '第一次用 AI 选一个 30 分钟内能完成的小任务。AI 输出后花 2 分钟检查关键信息——AI 可能编造数据'
  },
  {
    title: '了解 ChatGPT 的边界——什么它做不好（3 分钟）',
    body: '<p><strong>ChatGPT 做得好的</strong>：</p><ul><li>✅ 文案撰写、方案大纲、数据整理、翻译改写、头脑风暴</li><li>✅ 从原始数据生成结构化报告</li><li>✅ 批量生成文案变体</li></ul><p><strong>ChatGPT 做不好的</strong>：</p><ul><li>⚠️ 精确数据计算——复杂数学用 Excel，AI 做定性分析</li><li>⚠️ 最新信息——联网搜索能力不如 Perplexity，实时数据建议交叉验证</li><li>⚠️ 超长文档——超过 3000 字的长方案，用 Claude 效果更好</li><li>⚠️ 事实判断——AI 会「一本正经编故事」，关键数据和结论必须人工核实</li></ul>',
    tip: '记住：AI 是高效助手，不是万能专家。把 AI 输出当作 80 分的起点，用你的专业判断把它提到 95 分'
  },
  {
    title: '建立你的 AI 工作习惯（2 分钟）',
    body: '<p>把 AI 融入日常工作流程，而不是「偶尔玩一下」。</p><p><strong>建议的日常 AI 使用时机</strong>：</p><ul><li><strong>每周一早上</strong>：用 AI 生成本周工作计划大纲（省 30 分钟）</li><li><strong>每次写文案前</strong>：用 AI 先出 3 个方向，再选一个细化（省 1 小时）</li><li><strong>每次写方案前</strong>：用 AI 搭框架，再逐节打磨（省 2 小时）</li><li><strong>每周五下午</strong>：用 AI 整理周报数据（省 1.5 小时）</li></ul><p><strong>一周后你应该达到的状态</strong>：每天至少用 AI 完成 1 个工作任务，每周累计节省 5-8 小时。</p>',
    tip: '在手机上也装 ChatGPT App，通勤路上也能用语音对话处理简单任务'
  }
];

console.log('✅ t001 updated:', t001.steps, 'steps,', t001.content.length, 'content items');

// ===== t009 更新 =====
const t009 = tutorials.find(t => t.id === 't009');
if (!t009) { console.error('t009 not found'); process.exit(1); }

t009.title = 'AI 辅助游戏活动策划全流程';
t009.desc = '7 步从活动创意到可交付方案，用 AI 把 2 天的策划工作压缩到 60 分钟';
t009.steps = 7;
t009.solves = '用 AI 在 60 分钟内完成一份可交付的游戏活动策划方案';
t009.outcome = '一份完整的活动策划方案（含主题、玩法、数值、文案、风险预案）';
t009.fitLevel = '已有基础 AI 工具使用经验';
t009.relatedPrompts = ['p001'];
t009.relatedTools = ['chatgpt', 'claude'];

t009.content = [
  {
    title: '先和 AI 聊一轮创意（10 分钟）',
    body: '<p><strong>做什么</strong>：让 AI 基于你的游戏特点和节点发散 5 个活动方向，选 1 个最靠谱的继续。</p><p><strong>为什么先发散</strong>：直接写方案容易陷入惯性思维。让 AI 先给你 5 个方向，有意想不到的灵感。</p>',
    tip: '不要让 AI 直接出完整方案——先聊方向，选定后再展开。这样省的修改时间远大于多花的聊天时间',
    example: '我们的游戏是一款三国题材 SLG，日活 8 万。请为即将到来的端午节设计 5 个不同方向的游戏活动创意。\n\n要求：\n- 结合三国文化和端午元素\n- 每个创意包含：主题名、核心玩法（一句话）、预期效果\n- 考虑免费玩家和付费玩家都有参与感'
  },
  {
    title: '让 AI 输出结构化活动方案（15 分钟）',
    body: '<p><strong>做什么</strong>：选定方向后，让 AI 输出一份结构完整的活动方案框架。</p><p><strong>方案应包含</strong>：</p><ul><li>活动概述（目标、时间、规模）</li><li>核心玩法设计（至少 2 种参与方式）</li><li>奖励体系设计</li><li>预期数据指标</li><li>风险点和应对措施</li><li>时间线排期</li></ul>',
    tip: '先让 AI 出完整框架，再逐个部分深入打磨——比从头到尾一次性写效率高 5 倍',
    example: '我选定「粽横天下」这个方向。请输出一份完整的 7 天活动方案。\n\n游戏背景：三国 SLG，日活 8 万，月活 25 万\n活动目标：7 日留存提升 5 个百分点\n预算：中等（100 万金币 + 1 个限定头像框）\n\n请包含：\n1. 活动主题和背景故事\n2. 核心玩法（至少 2 种参与方式）\n3. 奖励体系（按参与深度分档）\n4. 预期数据指标\n5. 风险点和应对\n6. 7 天排期表'
  },
  {
    title: '搞定数值设计（10 分钟）',
    body: '<p><strong>做什么</strong>：让 AI 帮你设计活动奖励的具体数值。</p><p><strong>关键原则</strong>：给 AI 你的游戏经济参数，它才能设计合理的数值。</p>',
    tip: '给出具体的日均产出数据和历史活动奖励量级，AI 的数值设计才不会「拍脑袋」',
    example: '请帮我设计 7 天签到活动的奖励表。\n\n游戏经济参数：\n- 日均产出：金币 5 万，钻石 50\n- 上次同级活动的总发放：金币 200 万 + 钻石 500\n- 活动目标：提升 7 日留存\n\n要求：\n- 奖励逐日递增，制造坚持动力\n- 第 7 天有高价值锚点\n- 总发放量不超过正常产出的 30%\n- 请给出具体数值和设计理由'
  },
  {
    title: '一次性生成全套文案（10 分钟）',
    body: '<p><strong>做什么</strong>：让 AI 一次性输出活动需要的所有文案。</p><p>包含：</p><ul><li>游戏内活动公告（弹窗 + 邮件）</li><li>活动规则说明</li><li>社媒预热文案（微博/微信/抖音各 1 条）</li><li>Push 推送通知（开服提醒 + 最后 1 天提醒）</li></ul>',
    tip: '在 Prompt 中明确每条文案的字数限制和风格要求——不同渠道的文案风格应该不同'
  },
  {
    title: '让 AI 模拟玩家反馈（10 分钟）',
    body: '<p><strong>做什么</strong>：让 AI 从不同玩家视角审视你的方案，提前发现问题。</p><p><strong>为什么有用</strong>：这不是预测，是预警。AI 模拟的是「常见玩家类型的典型反应」——如果它提出的质疑你已经考虑过了，说明方案周全；如果有你没想到的点，就值得去验证。</p>',
    example: '请分别从以下 4 种玩家视角评价这个活动方案：\n1. 重度付费玩家（月充值 > 500 元）\n2. 中度付费玩家（月充值 50-200 元）\n3. 零氪玩家\n4. 回流玩家（30 天未登录）\n\n活动方案：[粘贴方案]\n\n请指出每种玩家可能的不满点和建议的调整。',
    tip: '把 AI 的反馈当做 checklist 而不是结论——真实用户反馈比 AI 模拟更重要'
  },
  {
    title: '提前准备数据追踪模板（5 分钟）',
    body: '<p><strong>做什么</strong>：让 AI 帮你设计活动数据追踪方案，方便活动后复盘。</p><p>包含：</p><ul><li>关键数据埋点清单</li><li>每日数据追踪表格模板</li><li>活动复盘报告框架</li></ul>',
    tip: '活动上线前就准备好追踪方案——等活动结束了再想该追踪什么就来不及了'
  },
  {
    title: '整合定稿，输出可交付方案',
    body: '<p><strong>做什么</strong>：把步骤 1-6 的所有输出整合成一份正式的活动策划文档。</p><p><strong>容易踩的坑</strong>：</p><ul><li>❌ 直接把 AI 输出当成品交付——你需要通读一遍，检查数值是否合理、文案是否符合游戏调性、是否有遗漏。</li><li>AI 的方案是 80 分的起点，你的专业判断把它提到 95 分。</li></ul><p><strong>整个流程耗时约 60 分钟</strong>：创意 10 分钟 + 方案 15 分钟 + 数值 10 分钟 + 文案 10 分钟 + 反馈 10 分钟 + 追踪 5 分钟。传统方式约 2 天。</p>',
    tip: '交付前用 AI 做最后检查：「请以主管视角审查这份方案，指出 3 个可能被质疑的点」',
    example: '请将以下内容整合为一份正式的活动策划方案文档：\n\n{粘贴步骤 2 方案框架}\n{粘贴步骤 3 数值表}\n{粘贴步骤 4 文案}\n{粘贴步骤 5 反馈中你采纳的修改}\n\n输出要求：\n- 统一格式，使用 H1/H2/H3 层级\n- 开头加一页「方案摘要」（目标、周期、核心玩法、预期指标，半页纸内）\n- 末尾附上数据追踪表\n- 标注哪些内容需要主管确认'
  }
];

console.log('✅ t009 updated:', t009.steps, 'steps,', t009.content.length, 'content items');

// ===== 写回文件 =====
fs.writeFileSync(filePath, JSON.stringify(tutorials, null, 2), 'utf-8');
console.log('✅ tutorials.json written successfully');
console.log('   Total tutorials:', tutorials.length);
