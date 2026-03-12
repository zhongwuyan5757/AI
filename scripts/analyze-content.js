const tutorials = require('../data/tutorials.json');
const prompts = require('../data/prompts.json');
const tools = require('../data/tools.json');
const models = require('../data/models.json');
const columns = require('../data/columns.json');
const jobs = require('../data/jobs.json');

// 1. 教程按岗位覆盖
const jobCoverage = {};
tutorials.forEach(t => {
  (t.targetJobs || []).forEach(j => {
    if (jobCoverage[j] === undefined) jobCoverage[j] = [];
    jobCoverage[j].push(t.id);
  });
});
console.log('=== 教程按岗位覆盖 ===');
Object.entries(jobCoverage).forEach(([k, v]) => console.log(k + ': ' + v.length));

// 2. 教程按 category
const catCount = {};
tutorials.forEach(t => {
  const c = t.category || 'unknown';
  catCount[c] = (catCount[c] || 0) + 1;
});
console.log('\n=== 教程按分类 ===');
Object.entries(catCount).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(k + ': ' + v));

// 3. 独立教程(无columnId)
const standalone = tutorials.filter(t => t.columnId === undefined || t.columnId === null);
console.log('\n=== 独立教程数 ===', standalone.length);

// 4. Prompt 按场景
const scenarioCount = {};
prompts.forEach(p => {
  scenarioCount[p.scenario] = (scenarioCount[p.scenario] || 0) + 1;
});
console.log('\n=== Prompt 场景分布 ===');
Object.entries(scenarioCount).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(k + ': ' + v));

// 5. Prompt 按岗位
const promptJobCount = {};
prompts.forEach(p => {
  (p.targetJobs || []).forEach(j => {
    promptJobCount[j] = (promptJobCount[j] || 0) + 1;
  });
});
console.log('\n=== Prompt 岗位覆盖 ===');
Object.entries(promptJobCount).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(k + ': ' + v));

// 6. 工具按分类
const toolCat = {};
tools.forEach(t => { toolCat[t.category] = (toolCat[t.category] || 0) + 1; });
console.log('\n=== 工具分类 ===');
Object.entries(toolCat).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(k + ': ' + v));

// 7. 专栏教程vs独立教程
const colTutorials = tutorials.filter(t => t.columnId !== undefined && t.columnId !== null);
console.log('\n=== 专栏 vs 独立 ===');
console.log('专栏教程:', colTutorials.length);
console.log('独立教程:', standalone.length);
console.log('总教程:', tutorials.length);

// 8. 岗位内容完整度
const jobIds = jobs.map(j => j.id);
console.log('\n=== 岗位内容完整度 ===');
jobIds.forEach(j => {
  const tCount = (jobCoverage[j] || []).length;
  const pCount = promptJobCount[j] || 0;
  const tTools = tools.filter(t => (t.suitableJobs || []).includes(j)).length;
  console.log(j + ': 教程=' + tCount + ' Prompt=' + pCount + ' 工具=' + tTools);
});

// 9. 高密度交叉主题识别
console.log('\n=== 潜在高密度专题方向 ===');
const themes = [
  { name: 'AI写方案(策划/运营)', tutorials: tutorials.filter(t => /策划|方案|活动|PRD|需求/.test(t.title)).length, prompts: prompts.filter(p => /策划|方案|活动|需求文档/.test(p.scenario)).length },
  { name: 'AI做内容(文案/视频/设计)', tutorials: tutorials.filter(t => /文案|视频|设计|内容|创作|营销/.test(t.title)).length, prompts: prompts.filter(p => /文案|视频|脚本|内容创作|品牌营销|广告/.test(p.scenario)).length },
  { name: 'AI数据分析', tutorials: tutorials.filter(t => /数据|分析|报表|指标/.test(t.title)).length, prompts: prompts.filter(p => /数据|分析|数值|用户分析|留存/.test(p.scenario)).length },
  { name: 'AI提效工作流', tutorials: tutorials.filter(t => /效率|自动化|批量|工作流|流程/.test(t.title)).length, prompts: prompts.filter(p => /效率|自动化|流程|批量/.test(p.scenario)).length },
  { name: 'AI辅助决策(竞品/市场/用户)', tutorials: tutorials.filter(t => /竞品|市场|调研|决策|用户/.test(t.title)).length, prompts: prompts.filter(p => /竞品|市场|调研|用户分析/.test(p.scenario)).length },
  { name: 'Prompt工程进阶', tutorials: tutorials.filter(t => /[Pp]rompt|提示词/.test(t.title)).length, prompts: prompts.filter(p => /提示词|Prompt/.test(p.scenario)).length },
];
themes.forEach(t => console.log(t.name + ': 教程=' + t.tutorials + ' Prompt=' + t.prompts + ' 总=' + (t.tutorials + t.prompts)));

// 10. 现有专栏覆盖分析
console.log('\n=== 现有专栏信息 ===');
columns.forEach(c => {
  console.log(c.name + ' (' + c.id + '): ' + (c.learningPath || []).length + '阶段');
  (c.learningPath || []).forEach(phase => {
    console.log('  ' + phase.phase + ': ' + (phase.tutorialIds || []).length + '篇');
  });
});

// 11. 教程标题列表(独立教程)
console.log('\n=== 独立教程标题 ===');
standalone.forEach(t => console.log(t.id + ': ' + t.title + ' [' + t.difficulty + '] [' + (t.targetJobs || []).join(',') + ']'));
