#!/usr/bin/env node
/**
 * translate-news.js — 为英文新闻添加高质量中文翻译
 */
const fs = require('fs');
const path = require('path');

const NEWS_FILE = path.join(__dirname, '..', 'data', 'news.json');
const news = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));

// 手工翻译映射表
const TRANSLATIONS = {
  'The AI Doc is an overwrought hype piece for doomers and accelerationists alike':
    'AI纪录片过度渲染：末日论者和加速派都不满意',
  'Microsoft, Google, Amazon say Anthropic Claude remains available to non-defense customers':
    '微软、谷歌、亚马逊表示Anthropic Claude对非国防客户仍然可用',
  "Anthropic's Claude found 22 vulnerabilities in Firefox over two weeks":
    'Anthropic的Claude在两周内发现Firefox 22个漏洞',
  "Anthropic's Pentagon deal is a cautionary tale for startups chasing federal contracts":
    'Anthropic与五角大楼的交易给追逐政府合同的初创公司敲响警钟',
  'Anthropic vs. the Pentagon, the SaaSpocalypse, and why competitions is good, actually':
    'Anthropic与五角大楼之争、SaaS末日论，以及为什么竞争是好事',
  "Claude's consumer growth surge continues after Pentagon deal debacle":
    '五角大楼交易风波后Claude消费端增长继续飙升',
  'City Detect, which uses AI to help cities stay safe and clean, raises $13M Series A':
    'AI城市管理公司City Detect获1300万美元A轮融资',
  'After Europe, WhatsApp will let rival AI companies offer chatbots in Brazil':
    '继欧洲之后WhatsApp将允许竞争对手的AI聊天机器人在巴西上线',
  'Anthropic to challenge DOD\'s supply-chain label in court':
    'Anthropic将在法庭上挑战美国防部的供应链风险标签',
  'The Pentagon formally labels Anthropic a supply-chain risk':
    '五角大楼正式将Anthropic列为供应链风险',
  'Netflix is buying Ben Affleck\'s AI startup':
    'Netflix收购本·阿弗莱克的AI初创公司',
  "OpenAI's new GPT-5.4 model is a big step toward autonomous agents":
    'OpenAI新发布GPT-5.4模型：迈向自主智能体的重要一步',
  "Meta's AI glasses reportedly send sensitive footage to human reviewers in Kenya":
    'Meta AI眼镜被曝将敏感画面发送给肯尼亚人工审核员',
  'Apple Music adds optional labels for AI songs and visuals':
    'Apple Music新增AI生成歌曲和视觉内容的可选标注',
  'AI tools can unmask anonymous accounts':
    'AI工具可以揭露匿名账户的真实身份',
  'Anthropic makes last-ditch effort to salvage deal with Pentagon after blowup':
    'Anthropic在风波后最后努力挽救与五角大楼的合作',
  "Seven tech giants signed Trump's pledge to keep electricity costs from spiking around data centers":
    '七大科技巨头签署特朗普的承诺：防止数据中心周边电费飙升',
  'DiligenceSquared uses AI, voice agents to make M&A research affordable':
    'DiligenceSquared用AI语音代理让并购尽调更加经济实惠',
  'AWS launches a new AI agent platform specifically for healthcare':
    'AWS推出专为医疗行业打造的AI智能体平台',
  "It's official: The Pentagon has labeled Anthropic a supply-chain risk":
    '官方确认：五角大楼已将Anthropic列为供应链风险',
  "Luma launches creative AI agents powered by its new 'Unified Intelligence' models":
    'Luma发布基于"统一智能"模型的创意AI智能体',
  'OpenAI launches GPT-5.4 with Pro and Thinking versions':
    'OpenAI发布GPT-5.4：推出Pro版和思维推理版',
  'Cursor is rolling out a new kind of agentic coding tool':
    'Cursor推出新型AI智能编程工具',
  "Meta sued over AI smart glasses' privacy concerns, after workers reviewed nudity, sex, and other footage":
    'Meta因AI智能眼镜隐私问题被起诉：员工曾审核裸露、性等敏感画面',
  'Anthropic CEO Dario Amodei could still be trying to make a deal with Pentagon':
    'Anthropic CEO达里奥·阿莫代仍在尝试与五角大楼达成协议',
  'Netflix buys Ben Affleck\'s AI filmmaking company InterPositive':
    'Netflix收购本·阿弗莱克的AI电影制作公司InterPositive',
  'How 1,000+ customer calls shaped a breakout enterprise AI startup':
    '1000+次客户通话如何造就一家突破性企业AI初创公司',
  'Lio raises $30M from Andreessen Horowitz and others to automate enterprise procurement':
    'Lio从a16z等机构融资3000万美元，用AI自动化企业采购',
  'Show HN: I\'m a teacher and built an AI presentation tool':
    'HN展示：一位教师开发了AI演示文稿工具',
  'Ask HN: Most unique usages of LLMs/Generative AI you\'ve seen?':
    'HN讨论：你见过最独特的大模型/生成式AI应用是什么？',
  'Ask HN: Resources to brush up from \'Intro to ML\' to current LLMs/generative AI?':
    'HN讨论：从"机器学习入门"到当前大模型/生成式AI的学习资源推荐',
  'An open source AI tool to animate children\'s drawings':
    '一款让儿童画动起来的开源AI工具',
  'Ask HN: Have LLM or generative AI made you more productive?':
    'HN讨论：大语言模型或生成式AI让你更高效了吗？',
};

// 统一弯引号→直引号 + 空格规范化
function norm(s) {
  return s
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u00a0\u2002\u2003\u2009\u200a]/g, ' ')   // 各种空格→普通空格
    .replace(/\s+/g, ' ')
    .trim();
}

// 先清除所有坏翻译（中文比例太低的 titleZh）
news.forEach(n => {
  if (!n.titleZh) return;
  const zhChars = (n.titleZh.match(/[\u4e00-\u9fff]/g) || []).length;
  if (zhChars / n.titleZh.length < 0.2) {
    delete n.titleZh;           // 移除质量不合格的翻译
  }
});

let translated = 0;
news.forEach(n => {
  if (n.titleZh) return;        // 已有合格翻译，跳过
  const normTitle = norm(n.title);

  // 精确匹配翻译（规范化引号后比较）
  for (const [en, zh] of Object.entries(TRANSLATIONS)) {
    if (normTitle === norm(en)) {
      n.titleZh = zh;
      translated++;
      return;
    }
  }

  // 模糊匹配（标题可能被截断）
  for (const [en, zh] of Object.entries(TRANSLATIONS)) {
    const normEn = norm(en);
    if (normTitle.startsWith(normEn.substring(0, 50)) || normEn.startsWith(normTitle.substring(0, 50))) {
      n.titleZh = zh;
      translated++;
      return;
    }
  }
});

fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2), 'utf8');
console.log(`✅ 翻译完成: ${translated} 条`);
console.log(`📊 有中文标题: ${news.filter(n => n.titleZh).length}/${news.length}`);

// 检查遗漏
const missing = news.filter(n => {
  const isEn = /[a-zA-Z]{4,}/.test(n.title);
  return isEn && !n.titleZh;
});
if (missing.length > 0) {
  console.log(`\n⚠️ 还有 ${missing.length} 条未翻译:`);
  missing.forEach(n => console.log(`  - ${n.title.substring(0, 80)}`));
}
