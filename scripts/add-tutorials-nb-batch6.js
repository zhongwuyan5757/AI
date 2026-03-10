#!/usr/bin/env node
/**
 * Batch 6: 专家工程化 t-nb-28, t-nb-29, t-nb-30
 */
const fs = require('fs');
const path = require('path');

const tutorialsPath = path.join(__dirname, '..', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

const newTutorials = [
  {
    "id": "t-nb-28",
    "title": "组织级 AI 视觉能力建设：从个人工具到团队基建",
    "desc": "将AI视觉生成从个别人的工具升级为组织级的基础能力，建立培训体系、流程标准和持续优化机制",
    "tier": "expert",
    "difficulty": "expert",
    "duration": "45分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🏗️",
    "editorPick": true,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 28,
    "prerequisite": ["t-nb-06", "t-nb-26"],
    "content": [
      {
        "title": "从「个人使用」到「组织能力」的差距",
        "body": "<p>大部分团队的 AI 出图现状是「个人英雄主义」：</p><ul><li>一两个人特别会用 → 所有出图需求都找他们</li><li>没有统一的流程 → 每个人用法不同，质量参差不齐</li><li>知识不传承 → 那个人离职了，AI 出图能力就断了</li><li>没有评估标准 → 不知道 AI 出图到底创造了多少价值</li></ul><p>真正的组织级 AI 能力需要：</p><ul><li><strong>全员可用</strong>：所有需要出图的人都有基础能力</li><li><strong>流程标准化</strong>：统一的出图流程和质量标准</li><li><strong>知识可传承</strong>：模板库、知识库不依赖个人</li><li><strong>持续优化</strong>：有评估、有迭代、有改进</li></ul>",
        "tip": "组织能力的判断标准：如果 AI 出图最好的那个人明天离职，团队的出图效率会下降多少？如果下降超过50%，说明还没建成组织能力"
      },
      {
        "title": "团队培训体系设计",
        "body": "<p>建立分层培训体系，让每个人达到该有的水平：</p><p><strong>Level 1：基础使用（全员必修）</strong></p><ul><li>培训时长：2 小时</li><li>内容：Gemini 注册、基础提示词、图片保存</li><li>达标标准：能独立生成满足基本需求的图片</li><li>对应教程：t-nb-07, t-nb-08, t-nb-09</li></ul><p><strong>Level 2：岗位实战（各岗位必修）</strong></p><ul><li>培训时长：3 小时</li><li>内容：岗位专属场景和模板使用</li><li>达标标准：能使用模板完成岗位日常出图</li><li>对应教程：t-nb-10 到 t-nb-16（选对应岗位）</li></ul><p><strong>Level 3：进阶技能（骨干选修）</strong></p><ul><li>培训时长：4 小时</li><li>内容：进阶提示词、风格控制、构图技巧</li><li>达标标准：能为团队创建和优化提示词模板</li></ul><p><strong>Level 4：系统管理（1-2 人专修）</strong></p><ul><li>培训时长：8 小时</li><li>内容：API 自动化、素材库管理、数据分析</li><li>达标标准：能搭建和维护团队级 AI 出图系统</li></ul>",
        "tip": "不要试图让所有人都达到 Level 4——Level 1-2 覆盖全员，Level 3-4 培养 2-3 个骨干就够了"
      },
      {
        "title": "流程标准化：SOP 建设",
        "body": "<p>建立覆盖全流程的 SOP 文档：</p><p><strong>SOP 1：日常出图流程</strong></p><ol><li>确认需求（用途、平台、尺寸、文字、风格）</li><li>搜索素材库是否有可复用素材</li><li>如无可复用，从模板库选择合适模板</li><li>填入变量，生成 2-3 张候选</li><li>按质检清单审核</li><li>保存到素材库（含标签和提示词）</li></ol><p><strong>SOP 2：批量生产流程</strong></p><ol><li>汇总本周素材需求清单</li><li>分类匹配模板</li><li>批量生成</li><li>分级审核</li><li>入库和分发</li></ol><p><strong>SOP 3：新模板创建流程</strong></p><ol><li>需求分析：什么场景需要新模板</li><li>提示词设计和测试（至少 5 次验证）</li><li>审核入库（记录作者、日期、使用说明）</li><li>团队通知和培训</li></ol>",
        "tip": "SOP 的核心价值不是「限制自由」，而是「让新人也能达到 80 分」——这才是组织能力"
      },
      {
        "title": "角色分工与组织架构",
        "body": "<p>明确 AI 出图相关的角色和职责：</p><table><tr><th>角色</th><th>职责</th><th>所需技能</th><th>人数</th></tr><tr><td>AI 出图管理员</td><td>系统搭建和维护、模板管理、培训</td><td>Level 4</td><td>1 人</td></tr><tr><td>模板审核员</td><td>审核新模板质量、维护知识库</td><td>Level 3</td><td>1-2 人</td></tr><tr><td>素材审核员</td><td>日常素材质检</td><td>Level 2+</td><td>1-2 人</td></tr><tr><td>出图使用者</td><td>日常使用 AI 出图</td><td>Level 1-2</td><td>全员</td></tr></table><p><strong>汇报关系建议</strong>：</p><ul><li>AI 出图管理员向运营负责人或品牌负责人汇报</li><li>模板和素材审核员是兼职角色（不需要全职）</li><li>定期（月度）向管理层汇报 AI 出图的效率和成本数据</li></ul>",
        "tip": "AI 出图管理员是整个体系的核心——选一个既懂业务又有技术学习能力的人来担任"
      },
      {
        "title": "知识管理与经验沉淀",
        "body": "<p>确保团队的 AI 出图知识持续积累，不因人员流动而丢失：</p><p><strong>知识库架构</strong>：</p><ul><li><strong>提示词模板库</strong>：按场景分类的标准化模板</li><li><strong>成功案例库</strong>：高效素材的提示词和效果数据</li><li><strong>避坑指南</strong>：常见问题和解决方案</li><li><strong>工具文档</strong>：API 使用、自动化脚本的文档</li><li><strong>培训材料</strong>：各 Level 的培训课件和练习材料</li></ul><p><strong>知识更新机制</strong>：</p><ul><li>每周：新增高效提示词和案例</li><li>每月：更新避坑指南和最佳实践</li><li>每季度：全面评审和优化知识库</li></ul><p><strong>知识传承测试</strong>：新人加入后，仅通过知识库和培训材料，能否在 1 周内达到 Level 2？如果能，说明知识管理到位。</p>",
        "tip": "知识库的「可用性」比「完整性」重要——宁可少但好用，不要多但找不到"
      },
      {
        "title": "阶段性建设路线图",
        "body": "<p>组织级 AI 视觉能力建设的阶段规划：</p><p><strong>第 1 个月：基础搭建</strong></p><ul><li>全员 Level 1 培训</li><li>建立基础 SOP 和文件夹结构</li><li>指定 AI 出图管理员</li><li>创建首批 10 个标准化模板</li></ul><p><strong>第 2-3 个月：流程运转</strong></p><ul><li>各岗位 Level 2 培训</li><li>素材库开始积累</li><li>质检流程上线</li><li>骨干 Level 3 培训</li></ul><p><strong>第 4-6 个月：优化成熟</strong></p><ul><li>数据驱动优化上线</li><li>API 自动化上线</li><li>知识库成型</li><li>首次 ROI 评估</li></ul><p><strong>第 7-12 个月：持续深化</strong></p><ul><li>全自动化工作流</li><li>跨项目经验复用</li><li>对外分享和影响力建设</li></ul>",
        "tip": "不要急于求成——第 1 个月打好基础、第 2-3 个月跑通流程、第 4-6 个月才开始优化，这个节奏最健康"
      },
      {
        "title": "常见建设误区与避坑",
        "body": "<p>组织级能力建设中常见的误区：</p><p><strong>误区 1：追求完美再推广</strong></p><ul><li>错误：等系统完美了再让团队使用</li><li>正确：先让大家用起来，边用边完善</li></ul><p><strong>误区 2：只关注工具，不关注流程</strong></p><ul><li>错误：买了最好的工具但没有配套流程</li><li>正确：先跑通流程，再选合适工具</li></ul><p><strong>误区 3：全员深度培训</strong></p><ul><li>错误：让所有人都学 API 和高级技巧</li><li>正确：分层培训，大部分人只需要 Level 1-2</li></ul><p><strong>误区 4：没有评估机制</strong></p><ul><li>错误：投入资源但不知道效果如何</li><li>正确：建立量化指标，定期评估</li></ul><p><strong>误区 5：依赖一个人</strong></p><ul><li>错误：所有 AI 知识在一个人脑子里</li><li>正确：知识库+文档+培训，不依赖任何个人</li></ul>",
        "tip": "组织能力建设最大的敌人是「完美主义」——先做到60分再持续迭代，比等到100分再推广快得多"
      }
    ],
    "solves": "AI出图能力集中在个别人身上，无法规模化，人员流动导致能力断层",
    "outcome": "一套完整的组织级AI视觉能力建设方案，包含培训体系、SOP和知识管理",
    "fitLevel": "团队负责人或AI工具管理员",
    "nextGuides": ["t-nb-29", "t-nb-30"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  },
  {
    "id": "t-nb-29",
    "title": "ROI 评估与汇报：向管理层展示 AI 出图的价值",
    "desc": "用量化数据评估AI出图的实际投入产出比，建立管理层汇报体系，确保AI出图项目获得持续支持",
    "tier": "expert",
    "difficulty": "expert",
    "duration": "35分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "💰",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 29,
    "prerequisite": ["t-nb-28"],
    "content": [
      {
        "title": "为什么 ROI 评估很重要",
        "body": "<p>AI 出图需要持续的投入（人力培训、工具费用、管理成本），管理层需要看到回报：</p><ul><li><strong>争取预算</strong>：证明 AI 出图值得继续投入</li><li><strong>扩大规模</strong>：用数据证明需要更多资源</li><li><strong>团队信心</strong>：量化成果让团队看到自己的价值</li><li><strong>行业影响力</strong>：可对外分享的成功案例</li></ul><p>如果你无法量化 AI 出图的价值，管理层就会质疑：「花这些时间学 AI，不如多做点别的」。</p><p><strong>ROI 评估的核心公式</strong>：</p><p><code>ROI = (AI 出图创造的价值 - AI 出图的成本) / AI 出图的成本 × 100%</code></p>",
        "tip": "ROI 评估不需要精确到个位数——管理层需要的是数量级的判断（省了几万还是几十万），而不是精确到元"
      },
      {
        "title": "成本端量化：AI 出图花了多少",
        "body": "<p>全面计算 AI 出图的各项成本：</p><p><strong>直接成本</strong>：</p><ul><li>工具费用：API 调用费、Midjourney 订阅费等</li><li>培训成本：培训时间 × 参与人数 × 人均时薪</li><li>管理成本：AI 管理员的时间投入</li></ul><p><strong>间接成本</strong>：</p><ul><li>学习曲线成本：新手上手期的效率损失</li><li>质检成本：审核不合格素材的时间</li><li>工具维护成本：模板更新、知识库维护</li></ul><p><strong>月度成本估算示例（10 人团队）</strong>：</p><table><tr><th>项目</th><th>月成本</th></tr><tr><td>API 费用</td><td>¥300</td></tr><tr><td>Midjourney 订阅</td><td>¥210</td></tr><tr><td>管理员时间（10 小时 × ¥100）</td><td>¥1,000</td></tr><tr><td>全员使用时间（不额外计算，替代了原有找图时间）</td><td>¥0</td></tr><tr><td><strong>总计</strong></td><td><strong>¥1,510/月</strong></td></tr></table>",
        "tip": "全员使用 AI 出图的时间不应该算作「额外成本」，因为它替代的是原本「找设计师/找素材库」的时间"
      },
      {
        "title": "收益端量化：AI 出图创造了多少价值",
        "body": "<p>从多个维度量化 AI 出图的收益：</p><p><strong>维度 1：时间节省</strong></p><ul><li>传统出图每张平均耗时 vs AI 出图每张平均耗时</li><li>月产出量 × 时间差 × 人均时薪 = 时间节省价值</li></ul><p><strong>维度 2：外包成本节省</strong></p><ul><li>之前每月外包设计费用</li><li>AI 上线后外包费用减少了多少</li></ul><p><strong>维度 3：投放效率提升</strong></p><ul><li>AI 出图使素材变体增加 → A/B 测试更充分 → CTR 提升 → CPA 降低</li><li>CPA 降低的金额 = 投放效率收益</li></ul><p><strong>维度 4：响应速度提升</strong></p><ul><li>热点借势从「错过」到「2 小时内上线」</li><li>活动素材从「等 3 天」到「当天完成」</li><li>这部分用「机会成本」来估算</li></ul>",
        "tip": "收益量化时，「保守估计」比「夸大」更好——保守的数字更有说服力，管理层也更信任"
      },
      {
        "title": "ROI 计算实例",
        "body": "<p>一个完整的 ROI 计算示例：</p><p><strong>前提</strong>：10 人发行团队，使用 AI 出图 3 个月</p><p><strong>成本</strong>：</p><ul><li>工具费用：¥1,530/月 × 3 = ¥4,590</li><li>初期培训（一次性）：10 人 × 5 小时 × ¥100 = ¥5,000</li><li>管理成本：¥1,000/月 × 3 = ¥3,000</li><li><strong>总成本：¥12,590</strong></li></ul><p><strong>收益</strong>：</p><ul><li>时间节省：每人每周节省 3 小时 → 10 人 × 3 小时 × 12 周 × ¥100 = ¥36,000</li><li>外包减少：月均减少 ¥8,000 → 3 个月 ¥24,000</li><li>投放效率：CTR 提升 15% → CPA 降低约 10% → 月省 ¥5,000 → 3 个月 ¥15,000</li><li><strong>总收益：¥75,000</strong></li></ul><p><strong>ROI = (75,000 - 12,590) / 12,590 × 100% = 496%</strong></p><p>即每投入 1 元，回报约 5 元。</p>",
        "tip": "ROI 计算公式可以根据团队实际情况调整——关键是思路，不是精确数字"
      },
      {
        "title": "管理层汇报模板",
        "body": "<p>一份清晰有力的管理层汇报结构：</p><p><strong>汇报结构（10 分钟）</strong>：</p><ol><li><strong>一句话总结</strong>（30秒）：「AI 出图项目运行 3 个月，ROI 达 496%」</li><li><strong>关键数据</strong>（2分钟）：成本、收益、ROI 的核心数字</li><li><strong>典型案例</strong>（3分钟）：1-2 个最有说服力的案例故事</li><li><strong>下一步计划</strong>（2分钟）：接下来要做什么，需要什么支持</li><li><strong>Q&A</strong>（2分钟）：回答管理层问题</li></ol><p><strong>关键说服点</strong>：</p><ul><li>用<strong>对比数据</strong>说话：之前 vs 现在</li><li>用<strong>具体案例</strong>打动人：「某个活动因为 AI 出图快速上线，带来了 XX 效果」</li><li>用<strong>竞争视角</strong>强调紧迫性：「竞品已经在使用 AI 出图」</li></ul>",
        "tip": "汇报的第一句话就要给出结论——管理层没有耐心听你铺垫 5 分钟再说结果"
      },
      {
        "title": "持续追踪的月度指标体系",
        "body": "<p>建立月度追踪的核心指标：</p><p><strong>效率指标</strong>：</p><ul><li>AI 素材月产出量</li><li>平均单张出图时间</li><li>素材库复用率</li></ul><p><strong>质量指标</strong>：</p><ul><li>S/A 级素材占比</li><li>投放素材平均 CTR</li><li>审核退回率</li></ul><p><strong>成本指标</strong>：</p><ul><li>月度 AI 工具费用</li><li>月度外包设计费用变化</li><li>单张素材综合成本</li></ul><p><strong>团队指标</strong>：</p><ul><li>各 Level 培训完成率</li><li>模板库活跃使用率</li><li>知识库更新频率</li></ul><p>每月更新这些指标，能清晰看到 AI 出图能力的成长趋势。</p>",
        "tip": "指标不要太多——5-8 个核心指标就够了。太多指标反而分散注意力"
      },
      {
        "title": "ROI 评估常见问题",
        "body": "<p>评估过程中常见的问题和解决方案：</p><p><strong>Q：很多收益很难精确量化怎么办？</strong></p><p>A：用保守估计和范围值。例如「响应速度提升带来的价值估计在 ¥5,000-10,000/月」。</p><p><strong>Q：管理层质疑「AI 出的图质量不够好」怎么办？</strong></p><p>A：展示 AI 出图 + 设计师精修的混合工作流。AI 负责效率，设计师负责品质。</p><p><strong>Q：ROI 数字看起来太好了，会不会不可信？</strong></p><p>A：用保守估计。即使打个 5 折，ROI 200%+ 也足够有说服力。</p><p><strong>Q：竞品都在用 AI，不用会怎样？</strong></p><p>A：这是最好的论据——不用 AI 出图意味着在效率上被竞品拉开差距。</p><p><strong>Q：AI 会不会替代设计师？需要裁员吗？</strong></p><p>A：AI 释放设计师的重复劳动时间，让他们做更有创造性的工作。不是替代，是赋能。</p>",
        "tip": "面对管理层的质疑时，准备好数据和案例——有数据的回答比口头解释有说服力 10 倍"
      }
    ],
    "solves": "无法量化AI出图的价值，管理层支持不足，难以争取持续投入",
    "outcome": "一套完整的ROI评估方法和管理层汇报体系",
    "fitLevel": "团队负责人或AI项目管理者",
    "nextGuides": ["t-nb-30"],
    "relatedPath": "Nano Banana 2 实战指南",
    "fitRoles": ["全岗位"]
  },
  {
    "id": "t-nb-30",
    "title": "未来展望：AI 图像生成的下一步与团队成长路径",
    "desc": "展望AI图像生成技术的发展趋势，规划团队的长期AI视觉能力成长路径，为下一阶段的技术变革做好准备",
    "tier": "expert",
    "difficulty": "expert",
    "duration": "30分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🔮",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-nano-banana",
    "columnOrder": 30,
    "prerequisite": ["t-nb-28"],
    "content": [
      {
        "title": "AI 图像生成的技术趋势",
        "body": "<p>了解未来趋势，提前布局：</p><p><strong>趋势 1：实时生成</strong></p><ul><li>当前：3-40 秒生成一张图</li><li>未来：实时生成，随手画随出结果，如同画笔一样</li><li>影响：创作流程从「输入-等待-输出」变成「实时交互」</li></ul><p><strong>趋势 2：视频生成融合</strong></p><ul><li>当前：图片和视频是分开的工具</li><li>未来：图片和视频生成融为一体，无缝切换</li><li>影响：从「出图」到「出视频」的门槛大幅降低</li></ul><p><strong>趋势 3：3D 生成</strong></p><ul><li>当前：主要生成 2D 图像</li><li>未来：从 2D 图像直接生成 3D 模型和场景</li><li>影响：游戏行业最直接受益，3D 资产生产效率革命</li></ul><p><strong>趋势 4：多模态融合</strong></p><ul><li>当前：文字→图片 为主</li><li>未来：文字+图片+音频+3D 全面融合</li><li>影响：创作者能同时调用所有模态的 AI 能力</li></ul>",
        "tip": "不需要追逐每一个新技术——关注与你业务最相关的趋势，提前准备"
      },
      {
        "title": "游戏行业 AI 视觉应用的演进",
        "body": "<p>AI 视觉在游戏行业的应用将经历三个阶段：</p><p><strong>阶段 1（当前）：辅助营销</strong></p><ul><li>AI 主要用于营销素材生产（海报、配图、投放素材）</li><li>不直接影响游戏产品本身</li><li>价值：效率提升 + 成本降低</li></ul><p><strong>阶段 2（1-2 年内）：融入制作</strong></p><ul><li>AI 用于游戏美术的前期概念设计</li><li>AI 辅助 UI/UX 设计</li><li>AI 生成游戏内临时素材和占位图</li><li>价值：制作效率提升 + 创意探索加速</li></ul><p><strong>阶段 3（2-5 年）：AI 原生制作</strong></p><ul><li>AI 直接生成游戏可用的 2D/3D 资产</li><li>AI 辅助关卡设计和场景搭建</li><li>游戏开发流程因 AI 而根本改变</li><li>价值：游戏制作的效率和规模发生质变</li></ul>",
        "tip": "当前处于阶段 1，但要为阶段 2 做准备——现在建立的 AI 使用习惯和能力基础，是进入阶段 2 的入场券"
      },
      {
        "title": "团队 AI 视觉能力成长路径",
        "body": "<p>规划团队未来 12 个月的成长路径：</p><p><strong>第 1-3 个月：基础期</strong></p><ul><li>目标：全员具备基础 AI 出图能力</li><li>重点：培训、SOP 建设、模板库</li><li>里程碑：月产出 100+ 张 AI 素材</li></ul><p><strong>第 4-6 个月：效率期</strong></p><ul><li>目标：AI 出图成为日常工作的一部分</li><li>重点：批量生产、数据驱动、自动化</li><li>里程碑：素材产出效率提升 3 倍，ROI > 300%</li></ul><p><strong>第 7-9 个月：精品期</strong></p><ul><li>目标：AI 出图质量接近专业设计水平</li><li>重点：进阶技巧深化、多工具协作、质量体系</li><li>里程碑：A 级素材占比 > 40%</li></ul><p><strong>第 10-12 个月：创新期</strong></p><ul><li>目标：探索 AI 视觉的新应用场景</li><li>重点：视频生成、3D 探索、跨模态融合</li><li>里程碑：完成 1-2 个创新应用案例</li></ul>",
        "tip": "成长路径要根据团队实际情况调整——有的团队基础好，可以加速；有的团队需要更多时间打基础"
      },
      {
        "title": "持续学习：保持 AI 能力的竞争力",
        "body": "<p>AI 领域变化极快，持续学习是保持竞争力的关键：</p><p><strong>学习渠道推荐</strong>：</p><ul><li><strong>官方渠道</strong>：Google AI Blog、Gemini 更新日志</li><li><strong>社区渠道</strong>：AI 图像生成相关的论坛和社群</li><li><strong>实验渠道</strong>：定期尝试新工具和新功能</li></ul><p><strong>团队学习机制</strong>：</p><ul><li>每周 15 分钟「AI 新知分享」（轮流主持）</li><li>每月 1 次「AI 出图技能交流会」</li><li>每季度 1 次「AI 工具评测」（评估是否需要引入新工具）</li></ul><p><strong>重点关注的技术方向</strong>：</p><ul><li>图片编辑能力的增强（更精确的局部控制）</li><li>视频生成的成熟度</li><li>3D 资产生成的可用性</li><li>多模态 AI 的融合应用</li></ul>",
        "tip": "学习 AI 最好的方式是「用」——每周花 30 分钟尝试一个新功能或新技巧，比看 10 篇文章更有效"
      },
      {
        "title": "风险与挑战预判",
        "body": "<p>提前识别可能的风险和挑战：</p><p><strong>技术风险</strong>：</p><ul><li>AI 工具可能更改定价或限制使用</li><li>应对：不过度依赖单一工具，保持多工具能力</li></ul><p><strong>合规风险</strong>：</p><ul><li>各国/地区可能出台 AI 生成内容的监管政策</li><li>应对：持续关注政策变化，建立合规审核流程</li></ul><p><strong>质量风险</strong>：</p><ul><li>团队过度依赖 AI 可能导致创意能力退化</li><li>应对：AI 做效率，人做创意——保持人的创造力</li></ul><p><strong>竞争风险</strong>：</p><ul><li>竞品也在用 AI，差异化越来越难</li><li>应对：比工具选择更重要的是「使用策略」——同一个工具，不同的用法效果天差地别</li></ul>",
        "tip": "最大的风险不是「AI 用错」，而是「不用 AI」——在竞品都在用的情况下，不用就是落后"
      },
      {
        "title": "从 AI 出图到 AI 全链路",
        "body": "<p>AI 出图只是游戏发行 AI 化的一个起点，未来的方向：</p><p><strong>AI 全链路展望</strong>：</p><ul><li><strong>AI + 文案</strong>：Claude 等工具已经非常成熟</li><li><strong>AI + 视觉</strong>：Nano Banana 2 等工具正在爆发（你已经掌握了）</li><li><strong>AI + 视频</strong>：Sora、Kling 等工具快速成熟中</li><li><strong>AI + 数据分析</strong>：AI 辅助投放优化和用户分析</li><li><strong>AI + 运营自动化</strong>：AI Agent 自动执行运营任务</li></ul><p>掌握 AI 出图能力后，你已经具备了向其他 AI 能力扩展的基础——核心思维模式（提示词思维、迭代思维、效率思维）是通用的。</p>",
        "tip": "AI 出图的经验和思维模式可以直接迁移到 AI 文案、AI 视频等领域——你已经走在了前面"
      },
      {
        "title": "专栏总结：从工具使用到能力建设",
        "body": "<p>回顾整个 Nano Banana 2 实战指南专栏的学习路径：</p><p><strong>你已经掌握的能力</strong>：</p><ul><li><strong>入门基础</strong>：从零开始独立使用 AI 出图</li><li><strong>岗位实战</strong>：将 AI 出图融入日常工作</li><li><strong>进阶技巧</strong>：精确控制图片的风格、构图、文字</li><li><strong>专业流水线</strong>：团队级的批量生产和质量管理</li><li><strong>专家工程化</strong>：组织级的能力建设和 ROI 评估</li></ul><p><strong>核心收获</strong>：</p><ol><li>AI 视觉生成的完整技能体系</li><li>一套可复用的提示词模板库</li><li>团队级的 SOP 和知识管理体系</li><li>数据驱动的持续优化方法论</li></ol><p><strong>下一步</strong>：把这些能力应用到实际工作中，持续积累经验，同时关注 AI 视觉领域的新发展。你已经准备好了。</p>",
        "tip": "学完不等于会了——真正的能力来自实践。从明天开始，把至少一项学到的技能用到实际工作中"
      }
    ],
    "solves": "缺乏对AI视觉技术趋势的了解，不知道团队AI能力的长期发展方向",
    "outcome": "对AI视觉发展趋势的清晰认知和团队12个月的成长路线图",
    "fitLevel": "已完成前期全部学习",
    "nextGuides": [],
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
console.log(`✅ 批次6完成：新增 ${newTutorials.length} 篇专家工程化教程 (t-nb-28~30)`);
console.log(`📊 tutorials.json 当前共 ${tutorials.length} 篇教程`);
