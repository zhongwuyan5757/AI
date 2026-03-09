#!/usr/bin/env node
/**
 * 修复 GitHub 抓取的工具数据，补齐前端需要的字段
 */
const fs = require('fs');
const path = require('path');
const TOOLS_FILE = path.join(__dirname, '..', 'data', 'tools.json');
const tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));

const CATEGORY_COLORS = {
  text: '#69eacb', image: '#a78bfa', video: '#f472b6', code: '#38bdf8',
  audio: '#fbbf24', productivity: '#34d399',
};

let fixed = 0;
tools.forEach(t => {
  let changed = false;

  // suitableJobs
  if (!t.suitableJobs) {
    t.suitableJobs = t.targetJobs || ['all'];
    changed = true;
  }

  // desc (GitHub uses "description")
  if (!t.desc && t.description) {
    t.desc = t.description;
    changed = true;
  }
  if (!t.desc) { t.desc = t.name; changed = true; }

  // officialUrl (GitHub uses "url")
  if (!t.officialUrl && t.url) {
    t.officialUrl = t.url;
    changed = true;
  }
  if (!t.officialUrl) { t.officialUrl = '#'; changed = true; }

  // problemsSolved
  if (!t.problemsSolved || !Array.isArray(t.problemsSolved)) {
    t.problemsSolved = t.features ? t.features.slice(0, 3) : [t.category || '通用AI'];
    changed = true;
  }

  // color
  if (!t.color) {
    t.color = CATEGORY_COLORS[t.category] || '#69eacb';
    changed = true;
  }

  // tutorialId (optional, default null)
  if (t.tutorialId === undefined) {
    t.tutorialId = null;
    changed = true;
  }

  // editorPick (optional, default false)
  if (t.editorPick === undefined) {
    t.editorPick = false;
    changed = true;
  }

  if (changed) fixed++;
});

fs.writeFileSync(TOOLS_FILE, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Fixed ${fixed} tools, total: ${tools.length}`);
