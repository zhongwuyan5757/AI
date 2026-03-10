#!/usr/bin/env node
/**
 * Batch 5a: 专业流水线 t-nb-23, t-nb-24, t-nb-25
 */
const fs = require('fs');
const path = require('path');

const tutorialsPath = path.join(__dirname, '..', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

const newTutorials = [
  {
    "id": "t-nb-23",
    "title": "API 自动化入门：从手动操作到自动化流水线",
    "desc": "学会使用Nano Banana 2的API接口，从Gemini手动操作进阶到程序化批量生成，构建团队级自动化出图系统",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "45分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🔧",
    "editorPick": true,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 23,
    "prerequisite": ["t-nb-02", "t-nb-05"],
    "content": [
      {
        "title": "为什么需要从手动切换到 API",
        "body": "<p>在 Gemini 手动操作的局限性：</p><ul><li><strong>速度瓶颈</strong>：一次只能生成一张，需要等待后手动操作下一张</li><li><strong>无法批量</strong>：50 张图需要手动操作 50 次</li><li><strong>不可复现</strong>：无法精确复现之前的生成参数</li><li><strong>无法集成</strong>：不能和其他工具/系统串联</li></ul><p><strong>API 能做什么</strong>：</p><ul><li>程序化调用，一个脚本生成 100 张图</li><li>精确控制参数，结果可复现</li><li>与 Claude、飞书、Slack 等工具串联</li><li>定时任务，每天自动生成当日所需素材</li></ul><p><strong>谁需要学 API</strong>：有一定技术基础的同事（运营中的技术向、增长团队、有编程经验的策划），或者团队中指定的「AI 工具管理员」。</p>",
        "tip": "不是所有人都需要学 API——团队中有 1-2 个人掌握 API 自动化，就能为整个团队提供批量生产能力"
      },
      {
        "title": "API 准备工作：获取密钥和环境配置",
        "body": "<p>开始使用 API 前的准备工作：</p><p><strong>第 1 步：获取 API 密钥</strong></p><ul><li>访问 Google AI Studio (aistudio.google.com)</li><li>创建项目并获取 API Key</li><li>免费额度通常足够测试和小规模使用</li></ul><p><strong>第 2 步：了解计费</strong></p><ul><li>免费层：每分钟有一定的请求限制</li><li>付费层：约 $0.045/张（¥0.33/张）</li><li>建议先用免费额度验证流程</li></ul><p><strong>第 3 步：环境准备</strong></p><ul><li>安装 Python 3.8+ 或 Node.js 16+</li><li>安装 Google AI SDK：<code>pip install google-generativeai</code></li><li>设置 API Key 环境变量</li></ul><p><strong>安全提醒</strong>：API Key 不要写在代码中，使用环境变量存储。</p>",
        "tip": "API Key 的安全非常重要——泄露会导致他人用你的额度，一定要通过环境变量管理"
      },
      {
        "title": "第一次 API 调用：生成单张图片",
        "body": "<p>从最简单的单张图片生成开始：</p><p><strong>基本调用流程</strong>：</p><ol><li>导入 SDK 并初始化客户端</li><li>构建图片生成请求（包含提示词和参数）</li><li>发送请求并等待响应</li><li>保存返回的图片</li></ol><p><strong>核心参数说明</strong>：</p><ul><li><strong>prompt</strong>：图片生成的提示词（与 Gemini 中使用的相同）</li><li><strong>model</strong>：模型名称（使用支持图片生成的最新模型）</li><li><strong>response_format</strong>：返回格式（通常为 base64 编码的图片）</li></ul><p><strong>错误处理</strong>：</p><ul><li>频率限制：添加重试逻辑和延迟</li><li>内容安全：提示词触发安全过滤时会返回错误</li><li>网络问题：添加超时和重试机制</li></ul>",
        "tip": "第一次调用建议用 Gemini 中已经验证过的提示词——确保提示词本身没问题，排除 API 使用层面的问题"
      },
      {
        "title": "批量生成：一个脚本产出 50 张图",
        "body": "<p>批量生成是 API 的核心价值，将提示词模板和变量组合自动化：</p><p><strong>批量生成的核心思路</strong>：</p><ol><li>准备提示词模板（固定的风格和结构描述）</li><li>准备变量列表（不同的内容、风格、文字等）</li><li>模板 × 变量 = 批量提示词</li><li>循环调用 API 生成每张图</li><li>自动保存并命名</li></ol><p><strong>批量生成的注意事项</strong>：</p><ul><li>控制并发数：不要同时发太多请求，容易触发频率限制</li><li>添加延迟：每次请求之间间隔 1-2 秒</li><li>断点续传：记录已完成的任务，中断后可以继续</li><li>自动命名：按模板自动生成有意义的文件名</li></ul>",
        "tip": "批量生成前先用 3-5 张小批量测试，确认提示词和参数没问题后再跑大批量"
      },
      {
        "title": "提示词模板系统的程序化实现",
        "body": "<p>将提示词模板系统从「手动替换」升级为「程序自动生成」：</p><p><strong>模板结构设计</strong>：</p><ul><li>固定部分：风格描述、质量要求、通用设置</li><li>变量部分：内容主体、文字内容、色调变化、比例</li></ul><p><strong>变量管理</strong>：</p><ul><li>用 CSV 或 JSON 文件管理变量列表</li><li>每行一组变量，对应一张图的生成参数</li><li>支持批量修改和快速扩展</li></ul><p><strong>输出管理</strong>：</p><ul><li>自动创建输出文件夹（按日期/项目分类）</li><li>命名规则：<code>[项目]_[风格]_[序号]_[时间戳].png</code></li><li>生成日志记录：每张图的提示词、参数、生成时间</li></ul>",
        "tip": "变量管理用 JSON 文件比 CSV 更灵活——可以嵌套结构化数据，未来扩展也更方便"
      },
      {
        "title": "与 Claude 串联：文案 + 视觉的自动化工作流",
        "body": "<p>将 Claude 的文案能力和 Nano Banana 2 的图片能力串联，实现端到端自动化：</p><p><strong>串联工作流示例</strong>：</p><ol><li>Claude 根据活动方案生成 10 组广告文案</li><li>Claude 为每组文案生成对应的图片提示词</li><li>脚本调用 Nano Banana 2 API 批量生成图片</li><li>文案 + 图片自动配对，输出完整素材包</li></ol><p><strong>更复杂的串联场景</strong>：</p><ul><li>从飞书文档读取活动方案 → Claude 拆解为素材需求 → API 批量出图 → 自动上传到素材库</li><li>从数据看板读取投放数据 → Claude 分析高效素材特征 → 基于特征批量生成新素材</li></ul><p>这是真正的「AI 工作流」——多个 AI 工具串联，形成自动化流水线。</p>",
        "tip": "串联工作流的核心是「接口标准化」——确保 Claude 输出的提示词格式和 API 接受的格式完全匹配"
      },
      {
        "title": "API 自动化工作流总结与进阶路径",
        "body": "<p>API 自动化的成长路径：</p><p><strong>阶段 1：单张 API 调用</strong></p><ul><li>掌握基本的 API 调用方法</li><li>能通过代码生成单张图片</li></ul><p><strong>阶段 2：批量生成</strong></p><ul><li>掌握模板 + 变量的批量生成方法</li><li>能一次性产出 50-100 张图</li></ul><p><strong>阶段 3：工具串联</strong></p><ul><li>与 Claude API 串联实现文案+视觉自动化</li><li>与团队工具（飞书/Slack）集成</li></ul><p><strong>阶段 4：完整自动化系统</strong></p><ul><li>定时任务自动生产素材</li><li>数据反馈驱动自动优化</li><li>全团队共用的自动化平台</li></ul><p><strong>团队分工建议</strong>：1 名「AI 工具管理员」负责搭建和维护自动化系统，其他人通过简单的界面/命令使用。</p>",
        "tip": "API 自动化不需要每个人都会——但团队中至少有 1 个人掌握，就能把全团队的效率提升一个量级"
      }
    ],
    "solves": "手动操作效率有上限，无法实现批量生产和系统集成",
    "outcome": "掌握API调用和批量生成方法，能搭建基础的自动化出图流水线",
    "fitLevel": "已有基础编程经验或愿意学习",
    "nextGuides": ["t-nb-24", "t-nb-25"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  },
  {
    "id": "t-nb-24",
    "title": "素材审核流水线：AI 生成 + 人工质检的高效协作",
    "desc": "建立AI素材从生成到发布的完整质检流程，确保AI产出的素材符合品牌标准、平台规范和合规要求",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "35分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "✅",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 24,
    "prerequisite": ["t-nb-02"],
    "content": [
      {
        "title": "为什么 AI 素材需要审核流程",
        "body": "<p>AI 生成的素材不能直接发布的原因：</p><ul><li><strong>质量波动</strong>：AI 生成质量不稳定，需要筛选</li><li><strong>文字错误</strong>：中文渲染可能有错别字或乱码</li><li><strong>品牌一致性</strong>：可能偏离品牌调性</li><li><strong>合规风险</strong>：可能违反广告法或平台规则</li><li><strong>版权风险</strong>：可能无意中生成与已有作品相似的内容</li></ul><p>建立审核流程不是「不信任 AI」，而是<strong>保障质量的标准化流程</strong>——就像设计师出稿后也需要审核一样。</p>",
        "tip": "审核流程的目标是「效率与质量的平衡」——既不能每张图花 10 分钟审核，也不能完全不审核"
      },
      {
        "title": "三级审核体系",
        "body": "<p>建立快速、标准、深度三级审核体系：</p><p><strong>一级审核：5 秒快筛（自动/半自动）</strong></p><ul><li>缩略图状态下快速浏览</li><li>明显不合格的直接淘汰（画面崩坏、完全偏题）</li><li>通过率：约 60-70% 进入二级审核</li></ul><p><strong>二级审核：30 秒细查（人工）</strong></p><ul><li>放大查看文字是否正确</li><li>检查有无 AI 常见瑕疵（多余手指、比例失调）</li><li>确认风格和品牌一致性</li><li>通过率：约 50-60% 进入三级或直接发布</li></ul><p><strong>三级审核：2 分钟深审（人工）</strong></p><ul><li>合规检查（广告法、平台规范）</li><li>与现有素材的去重/去相似</li><li>最终品质确认</li><li>仅对重要素材（如品牌 KV、线下物料）执行</li></ul>",
        "tip": "日常社媒配图只需一二级审核（35秒），品牌重点素材才需要三级全审核"
      },
      {
        "title": "AI 素材质检清单",
        "body": "<p>标准化的质检清单，审核时逐项检查：</p><p><strong>画面质量</strong>：</p><ul><li>整体构图是否合理</li><li>主体是否清晰完整</li><li>有无明显 AI 瑕疵（多余手指、融合错误、比例失调）</li><li>分辨率是否满足目标用途</li></ul><p><strong>文字检查</strong>：</p><ul><li>文字内容是否完整正确（逐字对照）</li><li>文字是否清晰可读</li><li>文字位置是否合适</li></ul><p><strong>品牌一致性</strong>：</p><ul><li>色调是否符合品牌规范</li><li>风格是否与品牌调性一致</li><li>角色形象是否与官方设定一致</li></ul><p><strong>合规检查</strong>：</p><ul><li>是否包含广告法敏感词（最、第一、绝对等）</li><li>是否符合目标平台的素材规范</li><li>是否有版权风险</li></ul>",
        "tip": "把这份清单做成表格工具或飞书模板，审核时打勾就行——标准化流程比临场判断更可靠"
      },
      {
        "title": "素材分级与存储管理",
        "body": "<p>审核后的素材按等级分类存储：</p><p><strong>素材分级标准</strong>：</p><ul><li><strong>S 级</strong>：高质量，可直接用于品牌和重要投放</li><li><strong>A 级</strong>：良好质量，可直接用于社媒和日常投放</li><li><strong>B 级</strong>：基本可用，微调后可使用（PS 修正文字、调色等）</li><li><strong>C 级</strong>：不可用，需重新生成</li></ul><p><strong>存储目录结构建议</strong>：</p><ul><li><code>/素材库/[项目名]/[日期]/[分级]/[文件名].png</code></li><li>每张素材配一个同名 JSON 记录元数据（提示词、生成参数、审核结果）</li></ul><p><strong>素材复用规则</strong>：</p><ul><li>S 级素材进入「精品素材库」，全团队可搜索复用</li><li>A 级素材进入日常素材池</li><li>B 级素材标记待修改项，分配给设计师快速修正</li></ul>",
        "tip": "素材的元数据（提示词、生成参数）一定要保存——以后想生成类似素材时直接复用，效率翻倍"
      },
      {
        "title": "AI 素材合规要点",
        "body": "<p>使用 AI 生成的素材发布前需要关注的合规问题：</p><p><strong>1. AI 生成标识</strong></p><ul><li>Nano Banana 2 自动添加 SynthID 水印（不可见）和 C2PA 凭证</li><li>部分平台可能要求标注「AI 生成内容」</li></ul><p><strong>2. 广告法合规</strong></p><ul><li>禁用词：最、第一、绝对、100%、万能等</li><li>避免虚假宣传：AI 生成的游戏画面不能暗示为实际游戏画面</li><li>版号合规：投放素材需要展示版号信息</li></ul><p><strong>3. 平台规范</strong></p><ul><li>各广告平台对 AI 生成素材的最新政策（持续关注）</li><li>部分平台对 AI 素材有额外审核要求</li></ul><p><strong>4. 版权与知识产权</strong></p><ul><li>AI 生成的内容版权归属遵循 Google 使用条款</li><li>避免生成与已知作品高度相似的内容</li><li>不要在提示词中指定复制具体的受版权保护的作品</li></ul>",
        "tip": "合规是红线问题——宁可多花 1 分钟检查，也不要冒发布违规素材的风险"
      },
      {
        "title": "团队审核角色分工",
        "body": "<p>在团队中明确审核角色和职责：</p><table><tr><th>角色</th><th>职责</th><th>审核级别</th><th>处理量</th></tr><tr><td>素材生成者</td><td>生成并完成一级快筛</td><td>一级</td><td>全部素材</td></tr><tr><td>审核专员</td><td>质量和品牌一致性检查</td><td>二级</td><td>通过一级的素材</td></tr><tr><td>品牌负责人</td><td>品牌调性和合规终审</td><td>三级</td><td>重点素材</td></tr></table><p><strong>审核节奏</strong>：</p><ul><li>日常素材（社媒配图）：生成者自审即可（一级+二级合并）</li><li>投放素材：审核专员二级审核</li><li>品牌重点素材：三级全审</li></ul><p><strong>效率目标</strong>：一级审核 5 秒/张，二级审核 30 秒/张，三级审核 2 分钟/张。100 张素材的完整审核在 1 小时内完成。</p>",
        "tip": "审核不是瓶颈——通过分级审核，把深度审核的精力集中在最重要的素材上"
      },
      {
        "title": "审核流程持续优化",
        "body": "<p>让审核流程越来越高效：</p><p><strong>优化方向 1：提升 AI 输出质量</strong></p><ul><li>记录 C 级（不可用）素材的常见问题</li><li>优化提示词模板，从源头减少不合格率</li><li>目标：C 级率从 30% 降到 15% 以下</li></ul><p><strong>优化方向 2：标准化审核工具</strong></p><ul><li>建立审核打分表（在线协作文档）</li><li>审核结果自动统计和分析</li><li>高频不合格原因的自动化检测</li></ul><p><strong>优化方向 3：知识积累</strong></p><ul><li>记录审核中发现的典型问题和解决方案</li><li>定期更新质检清单</li><li>新人可以通过「审核案例库」快速上手</li></ul><p><strong>月度复盘指标</strong>：S/A/B/C 级比例、平均审核耗时、合规问题次数。</p>",
        "tip": "审核流程最大的优化是「在生成端」——提示词越好，C 级率越低，审核工作量越少"
      }
    ],
    "solves": "AI素材质量不稳定，缺乏标准化的审核流程，合规风险控制不足",
    "outcome": "一套三级审核体系和标准化质检流程，确保AI素材的质量和合规性",
    "fitLevel": "已有批量生成经验",
    "nextGuides": ["t-nb-25", "t-nb-26"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  },
  {
    "id": "t-nb-25",
    "title": "多工具协作：Nano Banana 2 + Midjourney + SD 混合工作流",
    "desc": "学会根据不同需求选择最合适的AI图像工具，建立多工具协作的混合工作流，最大化整体产出效率",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "40分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🔄",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 25,
    "prerequisite": ["t-nb-01"],
    "content": [
      {
        "title": "为什么需要多工具协作",
        "body": "<p>没有一个 AI 图像工具能完美解决所有问题——每个工具都有自己的最佳场景：</p><table><tr><th>工具</th><th>最强能力</th><th>弱项</th><th>最佳场景</th></tr><tr><td>Nano Banana 2</td><td>速度、文字渲染、免费</td><td>极致艺术性</td><td>批量素材、带字海报</td></tr><tr><td>Midjourney</td><td>艺术性、美感、风格化</td><td>速度、成本、文字</td><td>品牌KV、精品素材</td></tr><tr><td>Stable Diffusion</td><td>可控性、本地部署、隐私</td><td>易用性、部署成本</td><td>特定风格LoRA、大批量</td></tr><tr><td>DALL-E / GPT Image</td><td>理解力、多轮编辑</td><td>风格多样性</td><td>创意概念、复杂场景</td></tr></table><p><strong>混合工作流的核心理念</strong>：让每个工具做它最擅长的事。</p>",
        "tip": "不要执着于用一个工具解决所有问题——组合使用多个工具的总效率 > 任何单一工具"
      },
      {
        "title": "工具选择决策树",
        "body": "<p>用决策树快速判断该用哪个工具：</p><p><strong>第 1 步：需要速度还是质量？</strong></p><ul><li>速度优先 → Nano Banana 2</li><li>质量优先 → 继续判断</li></ul><p><strong>第 2 步（质量优先时）：需要文字吗？</strong></p><ul><li>需要中文文字 → Nano Banana 2</li><li>不需要文字 → 继续判断</li></ul><p><strong>第 3 步：需要什么风格？</strong></p><ul><li>极致艺术性/独特风格 → Midjourney</li><li>特定品牌风格（已有 LoRA）→ Stable Diffusion</li><li>通用高质量 → Nano Banana 2 或 DALL-E</li></ul><p><strong>第 4 步：预算和基础设施？</strong></p><ul><li>零预算 → Nano Banana 2（免费）</li><li>有预算无GPU → Midjourney</li><li>有GPU服务器 → Stable Diffusion</li></ul>",
        "tip": "把这个决策树打印出来贴在工位上——每次出图前花 5 秒看一眼就能选对工具"
      },
      {
        "title": "混合工作流场景一：活动视觉套件",
        "body": "<p>一个大型游戏活动的完整视觉套件，用不同工具负责不同部分：</p><p><strong>品牌 KV（Midjourney）</strong>：</p><ul><li>最高品质要求，需要极致的艺术表现力</li><li>用 Midjourney 生成 → 设计师精修</li></ul><p><strong>活动海报系列（Nano Banana 2）</strong>：</p><ul><li>需要带中文文字的多张海报</li><li>基于 KV 的风格方向，用 NB2 批量生成变体</li></ul><p><strong>投放素材变体（Nano Banana 2 + API）</strong>：</p><ul><li>大量变体，速度和成本优先</li><li>API 批量生成 20-50 个变体</li></ul><p><strong>特殊风格素材（Stable Diffusion）</strong>：</p><ul><li>如果游戏有独特的品牌风格 LoRA</li><li>用 SD 生成精准品牌风格的特殊素材</li></ul>",
        "tip": "混合工作流的关键是「风格统一」——虽然用不同工具，但要保持整体视觉一致性"
      },
      {
        "title": "混合工作流场景二：日常内容生产",
        "body": "<p>日常运营的内容生产中，不同内容类型适合不同工具：</p><p><strong>社媒日常配图 → Nano Banana 2</strong></p><ul><li>量大、时效性强、质量要求中等</li><li>批量出图效率最高</li></ul><p><strong>精品内容配图 → Midjourney</strong></p><ul><li>特别推送、品牌故事等需要高质量配图</li><li>每周 2-3 张精品图</li></ul><p><strong>角色系列图 → Stable Diffusion（如有 LoRA）</strong></p><ul><li>如果已有角色的 LoRA 模型</li><li>角色一致性最好</li></ul><p><strong>创意概念图 → DALL-E / Nano Banana 2</strong></p><ul><li>新创意的快速概念验证</li><li>需要对复杂描述的理解力</li></ul>",
        "tip": "日常内容 80% 用 Nano Banana 2（速度+免费），20% 用 Midjourney（品质），就是最佳组合"
      },
      {
        "title": "跨工具的风格传递技巧",
        "body": "<p>不同工具之间如何保持风格一致：</p><p><strong>方法 1：风格关键词标准化</strong></p><ul><li>建立一套所有工具通用的风格描述</li><li>例如：「二次元，高饱和，紫金色调，华丽装饰」</li><li>这套描述在不同工具中可能需要微调措辞</li></ul><p><strong>方法 2：参考图传递</strong></p><ul><li>用 Midjourney 生成的高质量参考图</li><li>在 Nano Banana 2 中描述参考图的风格特征</li><li>用风格描述作为「桥梁」在不同工具间传递</li></ul><p><strong>方法 3：色板统一</strong></p><ul><li>提取品牌主色板（3-5 种颜色的十六进制值）</li><li>在所有工具中使用同一套色板</li><li>色彩一致是视觉统一最重要的基础</li></ul>",
        "tip": "跨工具风格统一最简单的方法：固定色板。颜色一致了，风格差异感就会大幅降低"
      },
      {
        "title": "工具成本对比与预算规划",
        "body": "<p>不同工具的成本结构差异很大，合理分配预算：</p><table><tr><th>工具</th><th>月成本（中等使用量）</th><th>适合</th></tr><tr><td>Nano Banana 2（免费版）</td><td>¥0</td><td>个人日常使用</td></tr><tr><td>Nano Banana 2（API）</td><td>¥50-300</td><td>团队批量使用</td></tr><tr><td>Midjourney</td><td>¥70-420</td><td>精品素材生产</td></tr><tr><td>Stable Diffusion</td><td>¥500-2000（GPU）</td><td>大批量+特定风格</td></tr></table><p><strong>预算分配建议（中小团队）</strong>：</p><ul><li>Nano Banana 2 API：¥200/月（覆盖 80% 的日常需求）</li><li>Midjourney 标准版：¥210/月（覆盖精品需求）</li><li>总计：¥410/月，覆盖全部 AI 出图需求</li></ul>",
        "tip": "先用免费工具（NB2免费版）验证需求，确认有量的需求后再升级到付费方案"
      },
      {
        "title": "多工具工作流总结",
        "body": "<p>建立多工具协作的团队级工作流：</p><p><strong>工具角色分配</strong>：</p><ul><li><strong>主力工具</strong>：Nano Banana 2（80% 的任务）</li><li><strong>精品工具</strong>：Midjourney（15% 的高品质需求）</li><li><strong>特殊工具</strong>：Stable Diffusion / DALL-E（5% 的特殊需求）</li></ul><p><strong>团队技能要求</strong>：</p><ul><li>全员掌握：Nano Banana 2 基本使用</li><li>进阶人员掌握：Midjourney + NB2 混合使用</li><li>专业人员掌握：SD 本地部署 + 全工具链</li></ul><p><strong>月度复盘指标</strong>：</p><ul><li>各工具的使用量和成本</li><li>各工具产出素材的质量分级分布</li><li>整体素材产出效率趋势</li></ul>",
        "tip": "多工具协作的目标不是用更多工具，而是用最合适的工具做最合适的事——极致的工具选择效率"
      }
    ],
    "solves": "单一工具无法满足所有场景需求，不知道什么场景该用什么工具",
    "outcome": "建立多工具协作的混合工作流和工具选择决策框架",
    "fitLevel": "已熟练使用Nano Banana 2",
    "nextGuides": ["t-nb-26", "t-nb-23"],
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
console.log(`✅ 批次5a完成：新增 ${newTutorials.length} 篇专业流水线教程 (t-nb-23~25)`);
console.log(`📊 tutorials.json 当前共 ${tutorials.length} 篇教程`);
