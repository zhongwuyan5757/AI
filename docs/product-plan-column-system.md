# FiveSeven AI -- "专栏"体系产品方案

> 文档版本：v1.0 | 日期：2026-03-10 | 作者：产品经理

---

## 一、需求背景与目标

### 1.1 现状分析

当前 FiveSeven AI 的"实战指南"模块（tutorials）是一个**扁平列表**，所有教程并列展示，通过 `tier`（入门基础 / 岗位提效 / 进阶应用）和 `targetJobs`（岗位）进行筛选。现有教程约 20 篇，覆盖 ChatGPT、Claude、Perplexity、Midjourney 等多个工具，但每个工具只有 1-2 篇入门级内容。

**核心问题**：
- 缺乏"由浅入深"的系统学习路径：用户学完入门后没有进阶内容
- 无法围绕单一工具形成完整知识体系
- 难以承载未来新工具/新模型的深度内容扩展
- 教程之间的关联性（nextGuides）是弱连接，不构成体系

### 1.2 目标

| 目标 | 衡量指标 |
|------|---------|
| 用户能围绕单个工具/技术系统学习 | 专栏完读率 >= 40% |
| 支持从入门到专家的完整进阶路径 | 每个专栏至少 8 篇、覆盖 4 个难度等级 |
| 框架可复用，新技术可快速开专栏 | 新专栏从规划到上线 <= 2 周 |
| 不破坏现有 tutorials 模块体验 | 现有用户路径零影响 |

---

## 二、产品结构设计

### 2.1 方案对比

| 维度 | 方案 A：tutorials 内增加分类 | 方案 B：新建独立"专栏"模块 | 方案 C（推荐）：tutorials 内嵌专栏子系统 |
|------|--------------------------|-------------------------|--------------------------------------|
| 改动范围 | 小 | 大 | 中等 |
| 用户体验 | 混杂在教程列表中，体感不明显 | 独立入口，但割裂感强 | 专栏有独立入口和聚合页，同时出现在 tutorials 筛选中 |
| 数据结构 | 只加 seriesId 字段 | 全新数据文件和渲染逻辑 | 新增 columns.json + tutorials 增加 columnId 字段 |
| 导航 | 无需改动 | 需新增顶部 nav 按钮 | tutorials 页面增加"专栏"tab，首页增加专栏推荐位 |
| 可扩展性 | 差（专栏无法有独立封面、介绍等） | 好 | 好 |
| 开发成本 | 0.5 人天 | 3-5 人天 | 1.5-2 人天 |

**推荐方案 C**：在现有 tutorials 体系内，通过新增 `columns.json` 数据文件和 tutorials 中的 `columnId` 关联字段，实现专栏聚合，既保持统一入口，又有独立的专栏浏览体验。

### 2.2 数据结构设计

#### 2.2.1 新增文件：`data/columns.json`

```json
[
  {
    "id": "col-claude",
    "title": "Claude 深度专栏",
    "subtitle": "从入门到专家的完整进阶之路",
    "desc": "围绕 Anthropic Claude 系列模型，从基础使用到高级工程化应用的系统教程。覆盖对话技巧、长文档分析、Projects 知识库、Agent 模式、Claude Code、API 集成等全链路能力。",
    "icon": "✨",
    "color": "#D97706",
    "coverImage": "",
    "tool": "claude",
    "author": "FiveSeven AI 编辑部",
    "startDate": "2026-03-15",
    "status": "active",
    "tutorialIds": ["t002", "t-claude-02", "t-claude-03", "t-claude-04", "t-claude-05", "t-claude-06", "t-claude-07", "t-claude-08", "t-claude-09", "t-claude-10"],
    "targetJobs": ["all"],
    "tags": ["Claude", "Anthropic", "深度推理", "Agent", "长文档"],
    "difficulty": {
      "min": "beginner",
      "max": "expert"
    },
    "totalDuration": "约 8 小时",
    "learningPath": [
      { "phase": "入门基础", "difficulty": "beginner", "tutorialIds": ["t002", "t-claude-02"] },
      { "phase": "进阶应用", "difficulty": "intermediate", "tutorialIds": ["t-claude-03", "t-claude-04", "t-claude-05"] },
      { "phase": "高级实战", "difficulty": "advanced", "tutorialIds": ["t-claude-06", "t-claude-07", "t-claude-08"] },
      { "phase": "专家工程化", "difficulty": "expert", "tutorialIds": ["t-claude-09", "t-claude-10"] }
    ]
  }
]
```

#### 2.2.2 修改：`data/meta.json` 新增字段

```json
{
  "tutorialTiers": {
    "all": "全部",
    "beginner": "入门基础",
    "job-specific": "岗位提效",
    "advanced": "进阶应用",
    "expert": "专家级"
  },
  "difficultyMap": {
    "beginner": { "label": "入门", "cssClass": "beginner" },
    "easy": { "label": "简单", "cssClass": "beginner" },
    "intermediate": { "label": "中级", "cssClass": "intermediate" },
    "medium": { "label": "中等", "cssClass": "intermediate" },
    "advanced": { "label": "高级", "cssClass": "advanced" },
    "hard": { "label": "高级", "cssClass": "advanced" },
    "expert": { "label": "专家", "cssClass": "expert" }
  },
  "columnStatus": {
    "active": "连载中",
    "complete": "已完结",
    "planned": "即将开始"
  }
}
```

#### 2.2.3 修改：tutorials.json 中教程新增字段

现有教程结构保持不变，仅新增可选字段：

```json
{
  "id": "t-claude-03",
  "columnId": "col-claude",
  "columnOrder": 3,
  "prerequisite": ["t002", "t-claude-02"],
  "title": "...",
  "tier": "advanced",
  "difficulty": "intermediate",
  "...": "（其他字段不变）"
}
```

| 新字段 | 类型 | 说明 |
|--------|------|------|
| `columnId` | string / null | 所属专栏 ID，null 表示独立教程 |
| `columnOrder` | number | 在专栏内的排序序号 |
| `prerequisite` | string[] | 前置教程 ID 列表（可选） |

#### 2.2.4 数据加载修改

`data-loader.js` 的 `contentFiles` 数组新增 `'columns'`：

```javascript
const contentFiles = ['jobs', 'news', 'tools', 'models', 'tutorials', 'prompts', 'resources', 'updates', 'digests', 'columns'];
```

### 2.3 前端交互设计

#### 2.3.1 实战指南页面改造

在现有 tutorials 页面顶部（意图导航下方），新增"专栏推荐区"：

```
[页面头部 - 实战指南]
[意图导航：不知道怎么开始 | 让工作更快 | 搞定具体任务 | 更进一步]
[专栏推荐区 - 横向滑动卡片]  <-- 新增
  [Claude 深度专栏] [Nano Banana 2 专栏] [...]
[筛选区：教程级别 / 适用岗位]
[教程卡片网格]
```

专栏推荐卡片样式：大卡片、带渐变背景色、显示标题/进度/教程数量。

#### 2.3.2 专栏详情页

点击专栏卡片进入专栏详情页，复用 `#section-tutorials` 容器：

```
[返回按钮：返回全部指南]
[专栏头部]
  - 图标 + 标题 + 副标题
  - 描述文字
  - 标签：教程数量 / 总时长 / 难度范围 / 连载状态
[学习路径时间线]
  Phase 1: 入门基础 --------
    [教程卡片 1] -> [教程卡片 2]
  Phase 2: 进阶应用 --------
    [教程卡片 3] -> [教程卡片 4] -> [教程卡片 5]
  Phase 3: 高级实战 --------
    [教程卡片 6] -> [教程卡片 7] -> [教程卡片 8]
  Phase 4: 专家工程化 ------
    [教程卡片 9] -> [教程卡片 10]
```

#### 2.3.3 路由设计

```
#tutorials                    -> 教程列表（含专栏推荐区）
#tutorials/col-claude         -> Claude 专栏详情页
#tutorials/t002               -> 教程详情页（不变）
#tutorials/t-claude-03        -> 教程详情页（增加专栏面包屑导航）
```

#### 2.3.4 教程详情页增强

属于专栏的教程，在详情页中增加：
- 面包屑：`实战指南 > Claude 深度专栏 > 第 3 篇：XXX`
- 侧边栏：当前专栏目录，高亮当前教程
- 上/下一篇：替代现有的 `nextGuides` 展示专栏内的前后导航
- 前置提示：如果有 `prerequisite`，提示"建议先学完 XX"

---

## 三、Claude 深度专栏内容规划

### 3.1 内容体系总览

| 序号 | ID | 标题 | 难度 | 阶段 | 时长 | 核心内容 |
|------|----|------|------|------|------|---------|
| 1 | t002 (现有) | Claude 4.6 高效使用指南 | beginner | 入门基础 | 40 分钟 | 基础对话、长文档分析、Projects 概览（已有，小幅更新） |
| 2 | t-claude-02 | Claude 对话进阶：Prompt 工程与思维链 | beginner | 入门基础 | 50 分钟 | Claude 特有的 Prompt 技巧、思维链控制、输出格式化、温度/风格调节 |
| 3 | t-claude-03 | Claude Projects 深度实战：团队知识库搭建 | intermediate | 进阶应用 | 60 分钟 | Projects 架构设计、System Prompt 高级写法、文档组织策略、多 Project 管理 |
| 4 | t-claude-04 | Claude 长文档分析大师课 | intermediate | 进阶应用 | 60 分钟 | 200K 上下文实战、GDD 全文分析、多文档交叉对比、提取-分析-输出工作流 |
| 5 | t-claude-05 | Claude 数据分析与报表生成 | intermediate | 进阶应用 | 50 分钟 | Excel/CSV 数据处理、运营数据分析、自动生成图表和报告、Artifacts 实战 |
| 6 | t-claude-06 | Claude Agent 模式实战 | advanced | 高级实战 | 70 分钟 | Computer Use、Agent 自主执行多步骤任务、工具调用、Browser 自动化 |
| 7 | t-claude-07 | Claude Code 开发者指南 | advanced | 高级实战 | 80 分钟 | Claude Code CLI 安装与配置、代码库分析、自动化重构、Git 集成、团队开发流 |
| 8 | t-claude-08 | Claude 游戏行业工作流 | advanced | 高级实战 | 70 分钟 | 活动策划全流程、竞品分析框架、数值平衡验证、本地化翻译、QA 测试用例生成 |
| 9 | t-claude-09 | Claude API 与系统集成 | expert | 专家工程化 | 90 分钟 | API 调用、Streaming、Tool Use、Function Calling、批量处理、成本优化 |
| 10 | t-claude-10 | Claude 企业级部署与治理 | expert | 专家工程化 | 80 分钟 | 企业安全策略、数据合规、团队权限管理、使用量监控、ROI 评估框架 |

### 3.2 各篇详细内容概要

#### 第 1 篇：Claude 4.6 高效使用指南（现有 t002，小幅优化）

**调整方向**：在现有 7 步内容基础上，增加"本教程是 Claude 深度专栏的起点"引导，末尾增加"下一篇预告"。

**P0 优先级** -- 已有内容，仅需微调。

---

#### 第 2 篇：Claude 对话进阶 -- Prompt 工程与思维链

**难度**：beginner | **时长**：50 分钟 | **步骤**：8 步

**核心内容**：
1. Claude 与 GPT-5 的 Prompt 差异（Claude 更偏好自然语言、XML 标签、分段指令）
2. System Prompt vs User Prompt 的分工策略
3. 思维链控制："请先思考再回答" vs "直接给我结论"
4. XML 标签结构化：`<context>`, `<task>`, `<format>`, `<constraints>` 的使用
5. 输出格式精确控制：Markdown 表格、JSON、分级标题
6. Few-shot 在 Claude 上的最佳实践
7. 多轮对话的上下文管理技巧
8. 实战练习：为运营日报搭建一个可复用的 Prompt 模板

**P0 优先级** -- 入门用户最需要的进阶内容。

---

#### 第 3 篇：Claude Projects 深度实战 -- 团队知识库搭建

**难度**：intermediate | **时长**：60 分钟 | **步骤**：8 步

**核心内容**：
1. Projects 架构思维：何时建新 Project vs 复用现有
2. 文档上传策略：哪些文档值得放、格式建议、大小限制
3. System Prompt 高级写法：角色设定 + 行为约束 + 输出规范 + 禁止事项
4. 多 Project 管理：品牌部 Project / 运营部 Project / 策划部 Project
5. 团队协作模式：共享 Project 的权限和使用规范
6. 知识库更新策略：文档版本管理、过期内容清理
7. 与工具库联动：在 Project 中引用公司内部工具和流程
8. 实战：为你的团队搭建第一个生产级 Project

**P0 优先级** -- Projects 是团队采用 Claude 的核心功能。

---

#### 第 4 篇：Claude 长文档分析大师课

**难度**：intermediate | **时长**：60 分钟 | **步骤**：8 步

**核心内容**：
1. 200K 上下文的实际边界：什么任务真正需要全量、什么可以分段
2. 多文档同时上传：交叉引用、对比分析的 Prompt 结构
3. GDD（游戏设计文档）全文分析实战：逻辑矛盾检测、设计盲点发现
4. 长报告总结框架：三级总结法（一句话 / 要点 / 详细）
5. 表格数据提取：从 PDF/Word 中抽取结构化信息
6. 1M Beta 上下文的使用场景和限制
7. 输出控制：128K 最大输出的有效利用（分章输出 vs 一次性输出）
8. 实战：分析一份完整的竞品调研报告并输出决策建议

**P1 优先级** -- 长文档是 Claude 核心差异化能力。

---

#### 第 5 篇：Claude 数据分析与报表生成

**难度**：intermediate | **时长**：50 分钟 | **步骤**：7 步

**核心内容**：
1. 上传 Excel/CSV 数据的注意事项（格式、大小、编码）
2. 让 Claude 理解你的数据：先描述数据结构再提问
3. 运营数据分析：DAU 趋势、留存漏斗、付费转化
4. Artifacts 功能：实时生成可交互的图表和可视化
5. 自动化报告生成：从数据到周报的一键流程
6. 数值平衡验证：经济系统通胀检测、概率验证
7. 实战：上传一周运营数据，生成完整的运营周报

**P1 优先级** -- 数据分析是游戏团队高频需求。

---

#### 第 6 篇：Claude Agent 模式实战

**难度**：advanced | **时长**：70 分钟 | **步骤**：8 步

**核心内容**：
1. 什么是 Agent 模式：从"问答"到"自主完成任务"的范式转变
2. Computer Use：让 Claude 操作浏览器和桌面应用
3. 多步骤任务编排：任务拆解、执行监控、结果验证
4. 工具调用（Tool Use）：搜索、计算、文件操作
5. 安全边界：Agent 模式下的权限控制和风险管理
6. 14.5 小时自主任务：适用场景和实际案例
7. Agent vs 传统对话：何时使用 Agent 模式
8. 实战：用 Agent 模式完成一次完整的竞品信息采集

**P1 优先级** -- Agent 是 2026 年 AI 应用的核心趋势。

---

#### 第 7 篇：Claude Code 开发者指南

**难度**：advanced | **时长**：80 分钟 | **步骤**：9 步

**核心内容**：
1. Claude Code 是什么：命令行 AI 编程助手
2. 安装与配置：环境搭建、API Key、权限设置
3. 代码库分析：让 Claude Code 理解你的整个项目
4. 代码生成与重构：从需求到代码的高效流程
5. Git 集成：自动生成 commit message、PR description
6. 自动化测试：生成测试用例、运行测试、修复 bug
7. `.claude/` 配置：agents、commands、CLAUDE.md 的使用
8. 团队开发流：多人协作中的 Claude Code 最佳实践
9. 实战：用 Claude Code 完成一个完整的功能开发流程

**P2 优先级** -- 面向有技术背景的用户，覆盖面较窄。

---

#### 第 8 篇：Claude 游戏行业工作流

**难度**：advanced | **时长**：70 分钟 | **步骤**：8 步

**核心内容**：
1. 活动策划全流程：从创意构思到方案输出，一个 Claude 对话搞定
2. 竞品分析框架：标准化的竞品调研模板 + Claude 深度分析
3. 数值平衡验证：经济系统建模、概率计算、通胀预警
4. 本地化翻译：游戏文本多语言翻译的专业 Prompt 设计
5. QA 测试用例：自动生成测试矩阵、边界条件覆盖
6. 用户画像构建：从数据到人物画像的分析流程
7. 舆情分析：社区评论 / 商店评价的批量情感分析
8. 实战：为一款即将上线的手游搭建完整的 Claude 工作流

**P0 优先级** -- 直接对应目标用户（游戏发行团队）的核心场景。

---

#### 第 9 篇：Claude API 与系统集成

**难度**：expert | **时长**：90 分钟 | **步骤**：10 步

**核心内容**：
1. Anthropic API 概览：模型选择、定价、配额
2. API 基础调用：Python/Node.js SDK 快速上手
3. Streaming（流式输出）：实时显示 Claude 回复
4. Tool Use / Function Calling：让 Claude 调用外部服务
5. 图片和文件上传：多模态 API 调用
6. 批量处理：Message Batches API 大规模任务处理
7. Token 优化：Prompt Caching、上下文管理、成本控制
8. 错误处理与重试策略
9. 安全最佳实践：API Key 管理、请求限流
10. 实战：搭建一个游戏运营自动化报告生成服务

**P2 优先级** -- 面向技术团队，属于工程化深水区。

---

#### 第 10 篇：Claude 企业级部署与治理

**难度**：expert | **时长**：80 分钟 | **步骤**：8 步

**核心内容**：
1. 企业版 Claude 功能概览
2. 数据安全与隐私合规：数据流向、存储策略、GDPR/等保
3. 团队权限管理：角色分级、使用配额、审计日志
4. 使用量监控与成本管控：Dashboard 配置、预算告警
5. 统一 Prompt 治理：全公司 Prompt 模板库管理
6. AI 输出质量保障：人工审核流程、事实核验机制
7. ROI 评估框架：如何量化 Claude 对团队效率的提升
8. 实战：制定你们公司的 AI 使用规范文档

**P2 优先级** -- 面向管理层和 IT 团队，需求明确但优先级靠后。

---

### 3.3 内容发布节奏

| 周 | 发布内容 | 说明 |
|----|---------|------|
| 第 1 周 | t002 优化 + t-claude-02 | 入门基础阶段完成，专栏框架上线 |
| 第 2 周 | t-claude-03 + t-claude-04 | 进阶应用前两篇 |
| 第 3 周 | t-claude-05 + t-claude-08 | 数据分析 + 游戏行业工作流（P0 内容优先） |
| 第 4 周 | t-claude-06 | Agent 模式 |
| 第 5 周 | t-claude-07 | Claude Code |
| 第 6 周 | t-claude-09 + t-claude-10 | 专家级内容，专栏完结 |

---

## 四、Nano Banana 2 专栏建议

> 注：Nano Banana 2 为示例名称，实际可替换为任何新模型。

### 4.1 专栏定位

围绕新模型的核心差异化能力，帮助游戏发行团队快速评估"这个新模型对我有什么用"，并给出可落地的使用方案。

### 4.2 建议内容方向（6-8 篇）

| 序号 | 标题方向 | 难度 | 核心内容 |
|------|---------|------|---------|
| 1 | Nano Banana 2 快速上手指南 | beginner | 注册、基础对话、核心能力概览、与 GPT-5/Claude 的定位差异 |
| 2 | Nano Banana 2 的独特能力深度体验 | beginner | 该模型的差异化优势（如多模态、推理、速度等）详细实战 |
| 3 | Nano Banana 2 在游戏运营中的应用 | intermediate | 针对游戏行业的具体使用场景和最佳实践 |
| 4 | Nano Banana 2 vs 主流模型对比评测 | intermediate | 多维度横评，帮助用户选择最合适的工具 |
| 5 | Nano Banana 2 高级功能与进阶技巧 | advanced | 高级 Prompt 技巧、API 使用、自动化集成 |
| 6 | Nano Banana 2 团队部署与工作流 | advanced | 团队协作、权限管理、与现有工作流集成 |

### 4.3 专栏模板

每个新模型专栏应至少包含以下标准模块：
1. **快速上手**（beginner）-- 让用户 30 分钟内产出第一个有价值的结果
2. **核心能力深度体验**（beginner）-- 该模型最强的 2-3 个能力详细实战
3. **游戏行业场景适配**（intermediate）-- 与目标用户（游戏发行）直接相关的使用场景
4. **横向对比**（intermediate）-- 与同类模型的客观对比，帮助用户做选择
5. **进阶技巧**（advanced）-- 高级功能、API、自动化
6. **团队落地**（advanced）-- 从个人使用到团队规模化

---

## 五、可扩展框架设计

### 5.1 专栏创建标准流程

```
1. 评估：新技术/模型是否值得开专栏？
   - 目标用户（游戏发行团队）是否会用到？
   - 是否有足够的深度内容可以写 6 篇以上？
   - 是否与现有专栏有明显差异化？

2. 规划：按标准模板规划内容
   - 使用 columns.json 的数据结构创建专栏元数据
   - 按 beginner -> intermediate -> advanced -> expert 规划教程
   - 确保每篇都有游戏行业的实战案例

3. 开发：按周迭代发布
   - 第 1 周上线入门 2 篇 + 专栏框架
   - 后续每周 1-2 篇

4. 迭代：基于数据优化
   - 追踪完读率、跳出率
   - 根据用户反馈调整后续内容
```

### 5.2 未来可能的专栏方向

| 专栏方向 | 优先级 | 理由 |
|---------|--------|------|
| Claude 深度专栏 | P0 | 核心需求，立即启动 |
| ChatGPT / GPT-5 深度专栏 | P1 | 用户量最大的 AI 工具 |
| Midjourney + AI 设计专栏 | P1 | 设计岗位高频需求 |
| AI 视频制作专栏（Sora/Runway/Kling） | P1 | 视频岗位新兴需求 |
| Perplexity 深度调研专栏 | P2 | 调研场景覆盖 |
| AI 编程工具专栏（Cursor/Claude Code/Copilot）| P2 | 技术团队需求 |
| 新模型速评系列（非专栏，快速响应） | P1 | 对新发布模型的快速 1-2 篇评测 |

---

## 六、优先级总览

### P0 -- 必须做（第 1-2 周完成）

| 事项 | 说明 | 工作量 |
|------|------|--------|
| 创建 `data/columns.json` 数据结构 | 专栏元数据，首期仅 Claude 专栏 | 0.5 天 |
| `data-loader.js` 加载 columns 数据 | 新增 columns 文件加载 | 0.5 小时 |
| `meta.json` 新增 expert 难度等级和专栏状态 | 扩展难度体系 | 0.5 小时 |
| tutorials 页面新增专栏推荐区 | 横向卡片展示专栏入口 | 1 天 |
| 专栏详情页渲染逻辑 | 学习路径时间线 + 教程列表 | 1 天 |
| Claude 专栏第 1-2 篇内容 | t002 优化 + t-claude-02 | 2 天内容 |
| Claude 专栏第 8 篇（游戏行业工作流）| 目标用户最关心的内容 | 1.5 天内容 |

### P1 -- 应该做（第 3-4 周完成）

| 事项 | 说明 | 工作量 |
|------|------|--------|
| 教程详情页专栏导航增强 | 面包屑 + 上下篇 + 目录侧栏 | 1 天 |
| Claude 专栏第 3-6 篇内容 | Projects、长文档、数据分析、Agent | 4 天内容 |
| 首页专栏推荐位 | 在首页总览增加专栏入口 | 0.5 天 |
| 专栏进度追踪 | localStorage 记录已读教程 | 0.5 天 |

### P2 -- 可以做（第 5-6 周及以后）

| 事项 | 说明 | 工作量 |
|------|------|--------|
| Claude 专栏第 7、9、10 篇 | Claude Code、API、企业部署 | 3 天内容 |
| Nano Banana 2 / 其他新模型专栏 | 按模板扩展 | 每专栏 1-2 周 |
| 专栏完读率数据追踪 | 简单 analytics 事件 | 0.5 天 |
| 专栏间交叉推荐 | "学完 Claude 专栏，推荐看 GPT-5 专栏" | 0.5 天 |

---

## 七、MVP 方案

### 7.1 MVP 范围定义

**最小可行产品 = 专栏框架 + Claude 专栏首批 3 篇内容**

具体包含：

1. **数据层**
   - 创建 `data/columns.json`，包含 Claude 专栏元数据
   - `data-loader.js` 支持加载 columns 数据
   - `meta.json` 新增 `expert` 难度等级

2. **展示层**
   - tutorials 页面顶部增加专栏横向推荐区（1 个专栏卡片）
   - 专栏详情页：显示学习路径 + 已有教程列表 + "即将上线"占位
   - 教程详情页：属于专栏的教程增加面包屑导航和"下一篇"链接

3. **内容**
   - t002（现有）优化：增加专栏引导
   - t-claude-02（新）：对话进阶与 Prompt 工程
   - t-claude-08（新）：游戏行业工作流（跳过中间篇目，优先产出用户最关心的内容）

### 7.2 MVP 不包含

- 进度追踪（localStorage）
- 首页推荐位
- 其他专栏
- 专栏间交叉推荐
- 数据分析追踪

### 7.3 MVP 预计工期

| 任务 | 人天 |
|------|------|
| 数据结构设计与实现 | 1 天 |
| 专栏推荐区 + 详情页 UI | 1.5 天 |
| 教程详情页增强（面包屑等） | 0.5 天 |
| 内容撰写：t-claude-02 | 1 天 |
| 内容撰写：t-claude-08 | 1 天 |
| 测试与调整 | 0.5 天 |
| **合计** | **5.5 天** |

### 7.4 MVP 验证指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 专栏入口点击率 | >= 15% | tutorials 页面访问者中点击专栏的比例 |
| 专栏详情页停留时间 | >= 2 分钟 | 用户是否在浏览学习路径 |
| 专栏教程开始率 | >= 30% | 进入专栏后开始学习第一篇的比例 |
| 教程完读率 | >= 50% | 打开教程后滚动到底部的比例 |

---

## 八、技术实现要点

### 8.1 关键代码修改清单

| 文件 | 修改内容 |
|------|---------|
| `data/columns.json` | 新建文件 |
| `data/meta.json` | 新增 expert 难度、columnStatus |
| `data/tutorials.json` | 现有 t002 增加 columnId 字段；新增教程数据 |
| `js/data-loader.js` | contentFiles 数组增加 'columns' |
| `js/app.js` | renderTutorials() 增加专栏推荐区；新增 renderColumnDetail()；renderTutorialDetail() 增加面包屑 |
| `css/style.css` | 新增专栏卡片、详情页、时间线样式 |
| `index.html` | 无需改动（复用 section-tutorials） |

### 8.2 向后兼容

- 所有新增字段为可选字段（`columnId`、`columnOrder`、`prerequisite`）
- 没有 `columnId` 的教程行为完全不变
- `columns.json` 加载失败不影响其他数据
- 路由兼容：`#tutorials/t002` 仍然直接打开教程详情

---

## 九、风险与应对

| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|---------|
| 内容产出速度跟不上发布节奏 | 中 | 高 | 专栏标注"连载中"，已有内容先上线，后续逐步补充 |
| 用户对深度内容需求不足 | 低 | 中 | MVP 先上线 3 篇验证，数据不好则暂停后续 |
| 模型更新导致内容过时 | 中 | 中 | 教程增加"最后更新日期"字段，建立季度复查机制 |
| 专栏太多导致信息过载 | 低 | 低 | 控制专栏数量上限（首年不超过 6 个），质量优先 |

---

## 十、总结

本方案的核心思路是**在现有 tutorials 体系内引入"专栏"聚合层**，通过最小的架构改动实现最大的内容组织升级：

1. **不新建顶级模块**：专栏作为 tutorials 的子系统，降低用户认知成本
2. **数据驱动**：通过 `columns.json` + `columnId` 关联实现，无需改动核心架构
3. **内容优先**：Claude 专栏 10 篇教程的完整规划，覆盖入门到专家全链路
4. **MVP 快速验证**：5.5 人天完成框架 + 3 篇内容，用数据验证方向
5. **可复用框架**：新模型/新技术专栏可按模板快速创建
