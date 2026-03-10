#!/usr/bin/env node
/**
 * Append OpenClaw tutorials t-oc-17 through t-oc-21 to tutorials.json
 * Waits 20 seconds before writing to avoid file write conflicts with other agents.
 */

const fs = require('fs');
const path = require('path');

const TUTORIALS_PATH = path.join(__dirname, '..', 'data', 'tutorials.json');

const newTutorials = [
  {
    "id": "t-oc-17",
    "title": "跨系统集成：打通飞书、Slack 与项目管理工具",
    "desc": "用 Webhook 和 Channel 机制实现飞书、Slack、Jira 等多平台信息自动同步，搭建事件驱动的协作工作流",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "50分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🔗",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-openclaw",
    "columnOrder": 17,
    "prerequisite": ["t-oc-06"],
    "nextGuides": ["t-oc-18"],
    "relatedPath": "OpenClaw 自动化实战",
    "fitRoles": ["全岗位"],
    "solves": "信息散落在飞书、Slack、Jira 等多个系统，手动搬运效率低",
    "outcome": "跨平台信息自动同步与协作工作流",
    "fitLevel": "已有 OpenClaw 基础，了解 Webhook 概念",
    "content": [
      {
        "title": "跨系统集成的常见场景与挑战",
        "body": "<p>游戏发行团队的日常工作横跨多个系统，信息搬运成为隐性成本：</p><ul><li><strong>飞书</strong>：内部审批、文档协作、日常沟通</li><li><strong>Slack/Discord</strong>：海外团队协作、社区管理</li><li><strong>Jira/Linear</strong>：任务管理、Bug 跟踪</li><li><strong>企业微信</strong>：国内团队即时通讯</li></ul><p>典型痛点场景：</p><ol><li>海外QA在Slack报了一个Bug → 运营手动复制到Jira → 再在飞书通知开发 → 三个平台三次手动操作</li><li>投放数据更新 → 运营手动截图 → 分别发到飞书群和Slack频道 → 格式不统一、容易遗漏</li><li>版本发布 → PM在Jira改状态 → 需要同步通知飞书审批群、Slack开发群、企业微信运营群</li></ol><p><strong>核心挑战</strong>：不同平台的 API 格式不同、认证方式不同、消息结构不同。手动集成维护成本极高。</p>",
        "tip": "在启动集成前先画一张「信息流向图」：哪些信息从哪来、到哪去、谁需要看到。这能帮你识别最高价值的集成点"
      },
      {
        "title": "Webhook 入门——事件驱动的 Agent 触发",
        "body": "<p>Webhook 是跨系统集成的核心机制——<strong>当A系统发生事件时，自动通知B系统</strong>。</p><p><strong>Webhook 工作原理：</strong></p><ol><li>你在A系统注册一个 URL（回调地址）</li><li>A系统发生指定事件时，向该 URL 发送 HTTP POST 请求</li><li>你的服务（OpenClaw Agent）接收请求并执行后续操作</li></ol><p><strong>OpenClaw 的 Webhook 接收能力：</strong></p><p>OpenClaw Gateway 内置 Webhook 接收端点，可以直接作为各平台的回调地址：</p><ul><li>接收到 Webhook 后自动触发关联的 Agent</li><li>Webhook 数据作为上下文传递给 Agent，Agent 可解析并决策</li><li>支持 HMAC 签名验证，确保请求来源可信</li></ul>",
        "tip": "测试 Webhook 时先用 webhook.site 或 ngrok 暴露本地端口，确认能收到请求后再接入 OpenClaw",
        "example": "# OpenClaw Webhook 接收配置\n\n# 1. 启用 Gateway 的 Webhook 端点\nopenclaw config set webhook.enabled true\nopenclaw config set webhook.port 8080\nopenclaw config set webhook.secret \"your-hmac-secret\"\n\n# 2. 注册一个 Webhook 触发器\nopenclaw webhook create \\\n  --name jira-bug-created \\\n  --path /hooks/jira \\\n  --agent bug-router-agent \\\n  --secret \"jira-webhook-secret\"\n\n# 3. 测试 Webhook\ncurl -X POST http://localhost:8080/hooks/jira \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"event\":\"issue_created\",\"issue\":{\"key\":\"BUG-123\",\"summary\":\"闪退\"}}'\n\n# Gateway 日志应显示：\n# [webhook] Received POST /hooks/jira -> triggering bug-router-agent"
      },
      {
        "title": "飞书集成：消息推送/文档创建/审批流触发",
        "body": "<p>飞书是国内游戏团队最常用的协作平台。OpenClaw 通过飞书开放平台 API 实现深度集成：</p><p><strong>三大集成方向：</strong></p><table><tr><th>能力</th><th>用途</th><th>API 类型</th></tr><tr><td>消息推送</td><td>Agent 执行结果发送到飞书群</td><td>群机器人 Webhook / 消息 API</td></tr><tr><td>文档创建</td><td>自动生成飞书文档（周报、分析报告）</td><td>文档 API</td></tr><tr><td>审批流触发</td><td>Agent 检测到异常后自动发起审批</td><td>审批 API</td></tr></table><p><strong>飞书群机器人配置步骤：</strong></p><ol><li>在飞书群设置中添加「自定义机器人」</li><li>获取 Webhook URL（格式：https://open.feishu.cn/open-apis/bot/v2/hook/xxx）</li><li>在 OpenClaw 中将该 URL 配置为 Channel 输出端</li></ol><p><strong>飞书消息格式支持：</strong></p><ul><li>纯文本消息</li><li>富文本消息（支持加粗、链接、@人）</li><li>卡片消息（Interactive Card，支持按钮和表单）</li><li>图片和文件消息</li></ul>",
        "tip": "飞书卡片消息（Interactive Card）是最推荐的格式——可以在消息内嵌入按钮，让接收者直接在飞书中操作（如「确认」「驳回」），无需跳转",
        "example": "# OpenClaw 飞书 Channel 配置\n\nchannel:\n  name: feishu-ops-group\n  type: feishu_webhook\n  config:\n    webhook_url: \"https://open.feishu.cn/open-apis/bot/v2/hook/xxx\"\n    msg_type: interactive  # 使用卡片消息\n    template: |\n      {\n        \"msg_type\": \"interactive\",\n        \"card\": {\n          \"header\": {\n            \"title\": {\"tag\": \"plain_text\", \"content\": \"{{title}}\"},\n            \"template\": \"{{color}}\"\n          },\n          \"elements\": [\n            {\"tag\": \"div\", \"text\": {\"tag\": \"lark_md\", \"content\": \"{{body}}\"}},\n            {\"tag\": \"action\", \"actions\": [\n              {\"tag\": \"button\", \"text\": {\"tag\": \"plain_text\", \"content\": \"查看详情\"}, \"url\": \"{{link}}\"}\n            ]}\n          ]\n        }\n      }"
      },
      {
        "title": "Slack 集成：频道通知/Interactive Message/Slash Command",
        "body": "<p>Slack 是海外团队协作的核心工具。OpenClaw 原生支持 Slack Channel，提供三种集成层级：</p><p><strong>Level 1：单向通知（最简单）</strong></p><ul><li>Agent 执行完任务后向 Slack 频道发送消息</li><li>只需要一个 Incoming Webhook URL</li><li>适合：日报推送、告警通知、状态更新</li></ul><p><strong>Level 2：Interactive Message（推荐）</strong></p><ul><li>消息中包含按钮和下拉菜单</li><li>用户点击后触发 Agent 后续操作</li><li>适合：审批流、Bug确认、任务分配</li></ul><p><strong>Level 3：Slash Command（高级）</strong></p><ul><li>用户在 Slack 中输入 <code>/openclaw 查询今日DAU</code> 直接触发 Agent</li><li>Agent 处理后将结果返回到 Slack</li><li>适合：即席查询、手动触发自动化</li></ul><p><strong>Block Kit 消息格式：</strong></p><p>Slack 使用 Block Kit 构建富消息，支持 Section、Divider、Image、Action 等区块，可以构建类似小程序的交互体验。</p>",
        "tip": "Slack App 需要在 api.slack.com 创建并安装到工作区。Bot Token Scopes 至少需要 chat:write、channels:read、commands",
        "example": "# OpenClaw Slack Channel 配置\n\nchannel:\n  name: slack-game-ops\n  type: slack\n  config:\n    bot_token: \"xoxb-your-bot-token\"\n    default_channel: \"#game-ops\"\n    \n# Slash Command 配置\nslash_commands:\n  - command: /report\n    description: \"生成即时运营报告\"\n    agent: report-generator\n    \n  - command: /bug\n    description: \"提交Bug到Jira\"\n    agent: bug-router-agent\n\n# Interactive Message 回调\ninteractivity:\n  request_url: \"https://your-server.com/slack/interactions\"\n  agent_mapping:\n    approve_release: release-manager-agent\n    reject_release: release-manager-agent"
      },
      {
        "title": "Jira/Linear 集成：自动创建任务/状态同步",
        "body": "<p>项目管理工具是游戏团队的任务中枢。OpenClaw 可以双向打通 Jira 和 Linear：</p><p><strong>从 Agent 到 Jira（写入方向）：</strong></p><ul><li>Agent 检测到玩家反馈的 Bug → 自动在 Jira 创建 Issue</li><li>自动填充字段：标题、描述、优先级、标签、负责人</li><li>附带原始反馈截图和上下文</li></ul><p><strong>从 Jira 到 Agent（读取/监听方向）：</strong></p><ul><li>Jira Issue 状态变更 → Webhook 通知 Agent → Agent 同步到飞书/Slack</li><li>Sprint 完成 → Agent 自动生成 Sprint 总结报告</li></ul><p><strong>字段映射配置：</strong></p><table><tr><th>Agent 输出</th><th>Jira 字段</th><th>映射规则</th></tr><tr><td>bug_title</td><td>Summary</td><td>直接映射</td></tr><tr><td>bug_description</td><td>Description</td><td>Markdown→Jira格式</td></tr><tr><td>severity</td><td>Priority</td><td>critical→P1, major→P2, minor→P3</td></tr><tr><td>category</td><td>Labels</td><td>直接映射</td></tr><tr><td>source_platform</td><td>Custom Field</td><td>来源平台标记</td></tr></table>",
        "tip": "Jira 创建 Issue 时尽量填充完整的字段（优先级、标签、组件），减少开发人员的手动补充工作",
        "example": "# OpenClaw Jira Tool 配置\n\ntools:\n  jira:\n    type: jira_cloud\n    config:\n      base_url: \"https://your-team.atlassian.net\"\n      email: \"agent@company.com\"\n      api_token: \"${JIRA_API_TOKEN}\"\n      project_key: \"GAME\"\n      \n# Agent 创建 Jira Issue 的 Prompt 模板\nprompt: |\n  收到一条玩家Bug反馈，请分析并创建Jira工单：\n  \n  反馈内容：{{feedback_text}}\n  来源平台：{{source}}\n  \n  请执行：\n  1. 判断Bug类型（闪退/卡顿/UI异常/数据异常/其他）\n  2. 评估严重等级（P1紧急/P2重要/P3一般）\n  3. 调用 jira.create_issue 创建工单\n  4. 将工单链接发送到 #bug-tracking 频道"
      },
      {
        "title": "消息路由——一个事件触发多平台响应",
        "body": "<p>跨系统集成的精髓是<strong>消息路由</strong>——一个事件发生后，Agent 根据规则将信息分发到不同平台。</p><p><strong>消息路由的三种模式：</strong></p><ol><li><strong>广播模式</strong>：同一消息发送到所有平台（如版本发布通知）</li><li><strong>条件路由</strong>：根据消息内容决定发送目标（如P1 Bug→飞书+Slack+短信，P3 Bug→仅Jira）</li><li><strong>转换路由</strong>：同一事件在不同平台用不同格式呈现（飞书用卡片、Slack用Block Kit、邮件用HTML）</li></ol><p><strong>路由规则引擎：</strong></p><p>OpenClaw 的 Agent 本身就是最灵活的路由引擎——用自然语言描述路由逻辑，Agent 理解并执行：</p><ul><li>支持基于内容的路由（关键词、情感分析结果）</li><li>支持基于时间的路由（工作时间→飞书，非工作时间→短信）</li><li>支持基于角色的路由（技术问题→开发群，运营问题→运营群）</li><li>支持基于优先级的路由（紧急→即时推送+@人，普通→汇总后推送）</li></ul>",
        "tip": "避免过度通知。P3级别的事件汇总为每日摘要推送，只有P1/P2才即时推送，否则团队会产生「通知疲劳」"
      },
      {
        "title": "实战：搭建「Bug报告→Jira工单→飞书通知→跟进提醒」全链路",
        "body": "<p>综合运用前6步知识，搭建一条<strong>完整的跨系统自动化链路</strong>：</p><p><strong>全链路流程：</strong></p><ol><li><strong>触发</strong>：玩家在 Discord/TapTap 提交 Bug 反馈</li><li><strong>接收</strong>：OpenClaw Agent 通过 Webhook 接收反馈</li><li><strong>分析</strong>：Agent 分析 Bug 类型、严重等级、复现步骤</li><li><strong>创建工单</strong>：自动在 Jira 创建 Issue，附带完整信息</li><li><strong>通知</strong>：飞书卡片通知相关开发人员，含工单链接</li><li><strong>跟进</strong>：24小时后检查工单状态，未处理则升级提醒</li></ol><p><strong>关键设计要点：</strong></p><ul><li>去重机制：相似 Bug 合并到同一工单，避免重复创建</li><li>兜底策略：任何环节失败都有告警，不会静默丢失</li><li>审计日志：全链路操作记录可追溯</li></ul><p><strong>预期效果：</strong></p><table><tr><th>指标</th><th>手动流程</th><th>自动化后</th></tr><tr><td>Bug 响应时间</td><td>4-8 小时</td><td>5 分钟</td></tr><tr><td>信息完整度</td><td>60%（常漏填字段）</td><td>95%</td></tr><tr><td>跟进遗漏率</td><td>30%</td><td>0%</td></tr><tr><td>人工耗时/周</td><td>5 小时</td><td>30 分钟（审核）</td></tr></table>",
        "tip": "上线前用2周的历史Bug数据做回测，验证Agent的分类准确率和工单质量，达到90%准确率再正式上线",
        "example": "# 完整的 Bug 全链路 Agent 配置\n\nagent:\n  name: bug-lifecycle-agent\n  model: claude-sonnet-4-20250514\n  \n  # 触发方式：Webhook + 定时检查\n  triggers:\n    - type: webhook\n      path: /hooks/bug-report\n    - type: heartbeat\n      schedule: \"0 10,16 * * 1-5\"  # 工作日10点和16点检查未处理工单\n  \n  # 工具权限\n  tools:\n    - jira_create_issue\n    - jira_search_issues\n    - jira_update_issue\n    - feishu_send_card\n    - slack_send_message\n  \n  prompt: |\n    你是一个Bug全生命周期管理Agent。\n    \n    当收到新的Bug反馈时：\n    1. 先搜索Jira中是否有相似Issue（用关键词匹配）\n    2. 如果有相似Issue，追加评论而非创建新的\n    3. 如果是新Bug，创建Issue并分配优先级\n    4. 通过飞书卡片通知对应开发组\n    \n    当执行定时检查时：\n    1. 搜索超过24小时未处理的P1/P2 Issue\n    2. 对未处理的Issue发送升级提醒\n    3. 生成未关闭Bug的状态汇总"
      }
    ]
  },
  {
    "id": "t-oc-18",
    "title": "批量任务处理：千级并发的自动化流水线",
    "desc": "设计支持千级并发的批量任务处理架构，掌握任务队列、Worker Pool、进度追踪和容错机制",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "50分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🏭",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-openclaw",
    "columnOrder": 18,
    "prerequisite": ["t-oc-06"],
    "nextGuides": ["t-oc-19"],
    "relatedPath": "OpenClaw 自动化实战",
    "fitRoles": ["全岗位"],
    "solves": "需要批量处理数千个相似任务（翻译/审核/生成），逐个跑太慢",
    "outcome": "支持千级并发的批量任务处理架构",
    "fitLevel": "有 OpenClaw 实战经验，了解 Lobster 流水线",
    "content": [
      {
        "title": "批量任务的类型与挑战",
        "body": "<p>游戏发行团队经常遇到<strong>批量处理</strong>需求——数百到数千个相似任务需要用 AI 处理：</p><table><tr><th>场景</th><th>规模</th><th>单任务耗时</th><th>串行总耗时</th></tr><tr><td>多语言翻译（游戏文本）</td><td>2000 条文本</td><td>3 秒</td><td>100 分钟</td></tr><tr><td>玩家评论情绪分析</td><td>5000 条评论</td><td>2 秒</td><td>167 分钟</td></tr><tr><td>素材文案批量生成</td><td>500 组素材</td><td>5 秒</td><td>42 分钟</td></tr><tr><td>竞品评论爬取分析</td><td>3000 条评论</td><td>2 秒</td><td>100 分钟</td></tr><tr><td>本地化质检</td><td>1000 条翻译</td><td>4 秒</td><td>67 分钟</td></tr></table><p><strong>核心挑战：</strong></p><ol><li><strong>速度</strong>：串行处理太慢，2000条翻译要跑100分钟</li><li><strong>可靠性</strong>：第998条失败了，前997条不能白跑</li><li><strong>成本控制</strong>：并发太高会触发 API 限流，还可能产生高额费用</li><li><strong>质量监控</strong>：批量输出质量参差不齐，需要自动质检</li></ol>",
        "tip": "批量任务的第一步永远是「小规模验证」——先用10条数据跑通全流程，确认质量和成本后再扩大到全量"
      },
      {
        "title": "任务队列设计——生产者/消费者模式",
        "body": "<p>批量处理的核心架构是<strong>生产者/消费者模式</strong>：</p><ul><li><strong>生产者（Producer）</strong>：读取数据源，将每条数据封装为独立任务，放入队列</li><li><strong>队列（Queue）</strong>：存储待处理任务，支持优先级、重试、死信队列</li><li><strong>消费者（Worker）</strong>：从队列取出任务，调用 AI 处理，将结果写入输出</li></ul><p><strong>OpenClaw 的批量任务实现：</strong></p><p>OpenClaw 通过 Lobster 流水线的 <code>batch</code> 节点原生支持批量处理：</p><ol><li>输入节点：读取 CSV/JSON/数据库中的批量数据</li><li>拆分节点：将批量数据拆分为单条任务</li><li>处理节点：Agent 处理每条任务（支持并行）</li><li>聚合节点：收集所有结果，合并输出</li></ol><p><strong>队列持久化：</strong></p><p>任务队列存储在本地 SQLite 中，即使 Gateway 重启，未完成的任务也不会丢失。</p>",
        "tip": "数据源建议使用 CSV 格式——Excel 导出 CSV 最方便，且 Agent 解析 CSV 比 Excel 更快更稳定",
        "example": "# Lobster 批量处理流水线配置\n\npipeline:\n  name: batch-translation\n  \n  nodes:\n    - id: input\n      type: file_reader\n      config:\n        path: \"./data/texts_to_translate.csv\"\n        format: csv\n        encoding: utf-8\n    \n    - id: splitter\n      type: batch_split\n      config:\n        batch_size: 1  # 每条单独处理\n        id_field: \"text_id\"  # 用于追踪的唯一ID\n    \n    - id: translator\n      type: agent\n      config:\n        agent: translation-agent\n        concurrency: 20  # 最多20个并行\n        timeout: 30000   # 单任务30秒超时\n    \n    - id: aggregator\n      type: batch_merge\n      config:\n        output_path: \"./output/translated.csv\"\n        format: csv\n  \n  edges:\n    - from: input -> splitter -> translator -> aggregator"
      },
      {
        "title": "并发控制——Worker Pool 与速率限制",
        "body": "<p>并发控制是批量处理的关键——<strong>并发太低浪费时间，并发太高触发限流</strong>。</p><p><strong>主流 AI API 限流规则：</strong></p><table><tr><th>API</th><th>RPM 限制</th><th>TPM 限制</th><th>建议并发数</th></tr><tr><td>Claude Sonnet</td><td>4000</td><td>400K</td><td>30-50</td></tr><tr><td>GPT-4.1</td><td>10000</td><td>800K</td><td>50-80</td></tr><tr><td>GPT-4.1-mini</td><td>30000</td><td>10M</td><td>100-200</td></tr><tr><td>Ollama 本地</td><td>无限制</td><td>受GPU限制</td><td>取决于硬件</td></tr></table><p><strong>Worker Pool 设计：</strong></p><ul><li><strong>固定大小池</strong>：预设 N 个 Worker，每个 Worker 处理完一个任务后取下一个</li><li><strong>自适应池</strong>：根据 API 返回的限流头（X-RateLimit-Remaining）动态调整并发数</li><li><strong>令牌桶算法</strong>：每秒释放固定数量令牌，Worker 获取令牌后才能发起请求</li></ul><p><strong>退避策略：</strong></p><p>当收到 429（限流）响应时：</p><ol><li>第1次重试：等待 1 秒</li><li>第2次重试：等待 2 秒</li><li>第3次重试：等待 4 秒</li><li>第N次重试：等待 min(2^N, 60) 秒</li></ol>",
        "tip": "建议初始并发设为 API RPM 限制的 50%，运行稳定后再逐步提高。宁可慢一点也不要频繁被限流"
      },
      {
        "title": "进度追踪——实时监控批量任务完成状态",
        "body": "<p>批量任务运行时，你需要知道：<strong>跑了多少、还剩多少、预计多久完成</strong>。</p><p><strong>OpenClaw 批量任务的状态模型：</strong></p><ul><li><code>pending</code>：在队列中等待处理</li><li><code>processing</code>：Worker 正在处理</li><li><code>completed</code>：成功完成</li><li><code>failed</code>：处理失败（可重试）</li><li><code>dead</code>：多次重试后仍失败（需人工干预）</li></ul><p><strong>进度追踪面板：</strong></p><p>Mission Control 提供实时进度看板：</p><ul><li>总任务数 / 完成数 / 失败数</li><li>当前处理速率（tasks/min）</li><li>预计剩余时间</li><li>失败任务列表（可一键重试）</li></ul><p><strong>进度通知：</strong></p><p>可配置在关键节点推送通知：</p><ol><li>任务开始 → 飞书通知「批量翻译已启动，共2000条」</li><li>50% 完成 → 中间状态报告</li><li>全部完成 → 最终结果汇总</li><li>异常率超阈值 → 紧急告警</li></ol>",
        "tip": "设置一个异常率阈值（如 5%），当失败任务占比超过阈值时自动暂停整批，避免在错误配置下浪费全部预算",
        "example": "# 批量任务进度追踪配置\n\nbatch_tracking:\n  # 进度通知\n  notifications:\n    - at: start\n      channel: feishu-ops-group\n      message: \"批量任务 {{batch_id}} 已启动，共 {{total}} 条\"\n    - at: 50%\n      channel: feishu-ops-group\n      message: \"进度 50%：已完成 {{completed}}/{{total}}，失败 {{failed}} 条\"\n    - at: complete\n      channel: feishu-ops-group\n      message: \"批量任务完成！成功 {{completed}}，失败 {{failed}}，耗时 {{duration}}\"\n  \n  # 异常熔断\n  circuit_breaker:\n    failure_threshold: 5%   # 失败率超5%暂停\n    window_size: 100         # 每100条检查一次\n    action: pause_and_alert  # 暂停并告警"
      },
      {
        "title": "错误处理——单个任务失败不影响整体",
        "body": "<p>批量任务中最重要的设计原则：<strong>单个任务的失败不应该中断整批</strong>。</p><p><strong>错误分类与处理策略：</strong></p><table><tr><th>错误类型</th><th>示例</th><th>处理策略</th></tr><tr><td>可重试错误</td><td>API超时、429限流、网络抖动</td><td>自动重试，最多3次</td></tr><tr><td>数据错误</td><td>输入文本为空、格式异常</td><td>跳过并记录，不重试</td></tr><tr><td>逻辑错误</td><td>AI输出格式不符合预期</td><td>重新 prompt 或跳过</td></tr><tr><td>致命错误</td><td>API Key无效、账户欠费</td><td>立即暂停整批，告警</td></tr></table><p><strong>死信队列（Dead Letter Queue）：</strong></p><p>多次重试仍失败的任务进入死信队列，特点：</p><ul><li>不阻塞后续任务的处理</li><li>完整保留失败上下文（输入、错误信息、重试次数）</li><li>支持人工审核后一键重试或标记跳过</li><li>可导出为 CSV 用于手动处理</li></ul><p><strong>幂等性保证：</strong></p><p>每个任务都有唯一 ID，重试时用相同 ID，避免产生重复输出。即使整个批次因故障重启，已完成的任务不会被重新处理。</p>",
        "tip": "在批量任务的 Prompt 中加入输出格式校验指令，如「输出必须是JSON格式，包含 translated_text 和 confidence 字段」，方便程序化解析和质检"
      },
      {
        "title": "结果聚合——批量输出的合并与质检",
        "body": "<p>所有单个任务完成后，需要将结果<strong>聚合、格式化、质检</strong>。</p><p><strong>聚合步骤：</strong></p><ol><li><strong>收集</strong>：将所有成功完成的单任务输出按原始顺序排列</li><li><strong>格式化</strong>：统一输出格式（CSV/JSON/Excel）</li><li><strong>质检</strong>：对输出结果进行自动化质量检查</li><li><strong>报告</strong>：生成批量处理的统计报告</li></ol><p><strong>自动质检规则示例（翻译场景）：</strong></p><ul><li><strong>长度校验</strong>：翻译结果与原文长度比在 0.5x-2x 之间（超出标记为异常）</li><li><strong>术语一致性</strong>：游戏专有名词必须使用术语表中的对应翻译</li><li><strong>格式保留</strong>：原文中的变量占位符（如 {player_name}）必须保留在翻译中</li><li><strong>语言校验</strong>：翻译结果确实是目标语言（避免 AI 返回原语言）</li><li><strong>重复检测</strong>：标记翻译完全相同但原文不同的条目</li></ul><p><strong>质检不通过的处理：</strong></p><ul><li>自动标记为「需人工审核」</li><li>可配置自动重新翻译（用不同 prompt 或不同模型）</li><li>最终仍不通过的导出为审核列表</li></ul>",
        "tip": "翻译类批量任务一定要配置术语表（Glossary），否则同一个游戏角色名可能被翻译成不同的版本",
        "example": "# 结果聚合与质检配置\n\naggregation:\n  output:\n    format: csv\n    path: \"./output/batch_{{batch_id}}_results.csv\"\n    columns: [\"id\", \"source_text\", \"translated_text\", \"confidence\", \"qc_status\"]\n  \n  quality_check:\n    rules:\n      - name: length_ratio\n        check: \"len(translated) / len(source) between 0.5 and 2.0\"\n        on_fail: flag_review\n      \n      - name: glossary_match\n        glossary_path: \"./data/game_glossary.csv\"\n        on_fail: auto_retry_with_glossary\n      \n      - name: placeholder_preserved\n        pattern: \"\\\\{\\\\w+\\\\}\"\n        check: \"all source placeholders exist in translated\"\n        on_fail: auto_retry\n      \n      - name: target_language\n        expected: \"ja\"  # 日语\n        on_fail: flag_review\n  \n  report:\n    generate: true\n    channel: feishu-ops-group\n    template: |\n      批量翻译完成报告\n      总计：{{total}} 条\n      成功：{{passed}} 条（{{pass_rate}}%）\n      需审核：{{flagged}} 条\n      失败：{{failed}} 条"
      },
      {
        "title": "实战：1000条游戏评论的批量情绪分析",
        "body": "<p>综合运用前6步，搭建一个<strong>完整的批量情绪分析流水线</strong>：</p><p><strong>业务目标：</strong></p><p>分析 App Store 和 TapTap 上最近1000条玩家评论，输出情绪分布、核心问题分类、行动建议。</p><p><strong>流水线步骤：</strong></p><ol><li><strong>数据准备</strong>：从 CSV 导入1000条评论（id, platform, rating, text, date）</li><li><strong>批量拆分</strong>：每条评论作为一个独立任务</li><li><strong>并行分析</strong>：20个 Worker 并发处理，每条输出 JSON 结构化结果</li><li><strong>结果聚合</strong>：合并所有结果到输出 CSV</li><li><strong>统计报告</strong>：生成情绪分布图表和关键问题排名</li></ol><p><strong>单任务输出结构：</strong></p><pre><code>{\n  \"id\": \"review_001\",\n  \"sentiment\": \"negative\",\n  \"score\": -0.7,\n  \"category\": [\"performance\", \"crash\"],\n  \"key_issues\": [\"新版本闪退\", \"加载时间过长\"],\n  \"action_suggestion\": \"需要紧急修复闪退问题\",\n  \"language\": \"zh-CN\"\n}</code></pre><p><strong>预期效果：</strong></p><table><tr><th>指标</th><th>数值</th></tr><tr><td>处理速度</td><td>1000条 / 约8分钟（20并发）</td></tr><tr><td>API 成本</td><td>约 ¥15（Claude Sonnet）</td></tr><tr><td>分析准确率</td><td>92%+（经人工抽检验证）</td></tr><tr><td>人工耗时节省</td><td>从3天 → 10分钟</td></tr></table>",
        "tip": "批量情绪分析的结果可以直接导入 BI 工具（如 Metabase）生成可视化看板，让团队每周都能看到玩家声音的变化趋势",
        "example": "# 完整的批量情绪分析流水线\n\npipeline:\n  name: batch-sentiment-analysis\n  description: \"1000条游戏评论批量情绪分析\"\n  \n  nodes:\n    - id: input\n      type: file_reader\n      config:\n        path: \"./data/reviews_1000.csv\"\n        columns: [\"id\", \"platform\", \"rating\", \"text\", \"date\"]\n    \n    - id: split\n      type: batch_split\n      config:\n        batch_size: 1\n        id_field: \"id\"\n    \n    - id: analyze\n      type: agent\n      config:\n        agent: sentiment-analyzer\n        concurrency: 20\n        timeout: 15000\n        retry: 3\n        prompt: |\n          分析以下游戏玩家评论的情绪，输出JSON：\n          评论：{{text}}\n          评分：{{rating}}/5\n          平台：{{platform}}\n          \n          输出格式（严格JSON）：\n          {\"sentiment\":\"positive/neutral/negative\",\n           \"score\":-1.0到1.0,\n           \"category\":[\"bug/performance/content/pricing/other\"],\n           \"key_issues\":[\"具体问题\"],\n           \"action_suggestion\":\"建议\"}\n    \n    - id: merge\n      type: batch_merge\n      config:\n        output_path: \"./output/sentiment_results.csv\"\n    \n    - id: report\n      type: agent\n      config:\n        agent: report-generator\n        prompt: |\n          基于 ./output/sentiment_results.csv 的分析结果，\n          生成一份玩家情绪分析报告，包含：\n          1. 情绪分布（正面/中性/负面占比）\n          2. Top 10 高频问题\n          3. 各平台对比\n          4. 本周 vs 上周变化\n          5. 行动建议（按优先级排列）"
      }
    ]
  },
  {
    "id": "t-oc-19",
    "title": "定时任务编排：Cron Agent 与事件驱动",
    "desc": "掌握 Heartbeat 定时器的高级用法，配置复杂 Cron 调度规则，构建混合触发的任务依赖管理体系",
    "tier": "advanced",
    "difficulty": "advanced",
    "duration": "40分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🕐",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-openclaw",
    "columnOrder": 19,
    "prerequisite": ["t-oc-06"],
    "nextGuides": ["t-oc-20"],
    "relatedPath": "OpenClaw 自动化实战",
    "fitRoles": ["全岗位"],
    "solves": "很多自动化任务需要定时执行或按事件触发，手动启动不现实",
    "outcome": "基于 Heartbeat 的完整定时任务管理体系",
    "fitLevel": "有 OpenClaw 实战经验，了解基本 Heartbeat 配置",
    "content": [
      {
        "title": "定时 vs 事件驱动——选择触发策略",
        "body": "<p>自动化任务有两种触发方式，选择正确的方式直接影响效率和资源消耗：</p><table><tr><th>维度</th><th>定时触发（Cron）</th><th>事件驱动（Webhook/Watch）</th></tr><tr><td>触发条件</td><td>到达指定时间</td><td>发生指定事件</td></tr><tr><td>延迟</td><td>最长等一个周期</td><td>秒级响应</td></tr><tr><td>资源消耗</td><td>固定（周期性执行）</td><td>按需（有事件才触发）</td></tr><tr><td>适用场景</td><td>日报、周报、定期检查</td><td>Bug 报告、紧急告警</td></tr><tr><td>可预测性</td><td>高（知道何时执行）</td><td>低（不确定何时有事件）</td></tr></table><p><strong>选择指南：</strong></p><ul><li><strong>用定时</strong>：汇总类任务（日报）、定期巡检（监控）、批量处理（每晚跑批）</li><li><strong>用事件驱动</strong>：需要即时响应的场景（Bug、告警、审批）</li><li><strong>混合使用</strong>：事件触发为主，定时兜底（如：Webhook 收到 Bug 立即处理 + 每天定时扫描遗漏）</li></ul>",
        "tip": "如果你不确定选哪种，先问自己：「这件事晚2小时做有没有影响？」有影响用事件驱动，没影响用定时"
      },
      {
        "title": "Heartbeat 定时器配置详解",
        "body": "<p>Heartbeat 是 OpenClaw 的定时触发机制，让 Agent 像心跳一样<strong>按节奏自动执行任务</strong>。</p><p><strong>Heartbeat 配置参数：</strong></p><table><tr><th>参数</th><th>说明</th><th>示例</th></tr><tr><td>enabled</td><td>是否启用</td><td>true</td></tr><tr><td>schedule</td><td>Cron 表达式</td><td>\"0 9 * * 1-5\"</td></tr><tr><td>timezone</td><td>时区</td><td>\"Asia/Shanghai\"</td></tr><tr><td>prompt</td><td>每次触发时执行的指令</td><td>\"生成今日运营日报\"</td></tr><tr><td>timeout</td><td>单次执行超时（秒）</td><td>300</td></tr><tr><td>retry_on_failure</td><td>失败后是否重试</td><td>true</td></tr><tr><td>max_retries</td><td>最大重试次数</td><td>3</td></tr><tr><td>overlap_policy</td><td>上次未完成时的策略</td><td>skip / queue / parallel</td></tr></table><p><strong>overlap_policy 的三种策略：</strong></p><ul><li><strong>skip</strong>：如果上次还没执行完，跳过本次（适合日报——晚了就不用跑了）</li><li><strong>queue</strong>：排队等上次完成后再执行（适合数据处理——每次都要跑）</li><li><strong>parallel</strong>：同时运行多个实例（谨慎使用——可能产生重复数据）</li></ul>",
        "tip": "一定要设置 timeout。没有超时限制的定时任务可能因为 AI 幻觉而无限循环，持续消耗 API 费用",
        "example": "# Heartbeat 完整配置示例\n\nagent:\n  name: daily-report-agent\n  \n  heartbeat:\n    enabled: true\n    schedule: \"0 9 * * 1-5\"  # 工作日早上9点\n    timezone: \"Asia/Shanghai\"\n    timeout: 300  # 5分钟超时\n    retry_on_failure: true\n    max_retries: 2\n    overlap_policy: skip\n    \n    # 触发时的提示词\n    prompt: |\n      现在是工作日早上9点，请执行以下任务：\n      1. 从 ./data/metrics/ 读取昨日运营数据\n      2. 与前日数据对比，计算变化率\n      3. 生成简洁的日报摘要（300字以内）\n      4. 推送到 #daily-report 频道\n      5. 如果任何指标变化超过10%，额外推送告警"
      },
      {
        "title": "Cron 表达式进阶——复杂调度规则",
        "body": "<p>Cron 表达式是定时任务的灵魂，掌握进阶用法可以实现任意复杂的调度规则。</p><p><strong>Cron 表达式格式（5字段）：</strong></p><pre><code>分钟  小时  日  月  星期\n  *     *    *   *    *\n  0     9    *   *   1-5   → 工作日每天9点</code></pre><p><strong>特殊字符：</strong></p><table><tr><th>字符</th><th>含义</th><th>示例</th><th>说明</th></tr><tr><td>*</td><td>每个</td><td>* * * * *</td><td>每分钟</td></tr><tr><td>,</td><td>列举</td><td>0 9,12,18 * * *</td><td>每天9点、12点、18点</td></tr><tr><td>-</td><td>范围</td><td>0 9 * * 1-5</td><td>周一到周五9点</td></tr><tr><td>/</td><td>间隔</td><td>*/15 * * * *</td><td>每15分钟</td></tr><tr><td>L</td><td>最后</td><td>0 18 L * *</td><td>每月最后一天18点</td></tr></table><p><strong>游戏发行团队常用调度规则：</strong></p><ul><li><code>0 9 * * 1-5</code> — 工作日早报（周一至周五9点）</li><li><code>0 18 * * 5</code> — 周报（每周五18点）</li><li><code>0 */2 * * *</code> — 竞品监控（每2小时检查一次）</li><li><code>30 10 1 * *</code> — 月报（每月1号10:30）</li><li><code>0 9,14,18 * * 1-5</code> — 一天三次投放数据检查</li><li><code>*/30 * * * *</code> — 差评预警（每30分钟扫描一次）</li></ul>",
        "tip": "用 crontab.guru 网站在线验证 Cron 表达式是否正确。输入表达式后会显示未来几次的执行时间"
      },
      {
        "title": "事件驱动：Webhook→Agent→Action",
        "body": "<p>事件驱动是定时触发的互补——<strong>有事件发生时立即响应，没有事件就不消耗资源</strong>。</p><p><strong>OpenClaw 支持的事件源：</strong></p><ul><li><strong>Webhook</strong>：外部系统推送事件（Jira状态变更、GitHub PR、飞书审批）</li><li><strong>Channel 消息</strong>：Slack/Discord 中 @Agent 或特定关键词触发</li><li><strong>文件监听</strong>：监控特定目录，有新文件时触发处理</li><li><strong>API 轮询</strong>：定期检查 API（某些不支持 Webhook 的系统的降级方案）</li></ul><p><strong>事件处理链路：</strong></p><ol><li><strong>接收</strong>：Gateway 接收到事件（Webhook POST / 消息 / 文件变更）</li><li><strong>路由</strong>：根据事件类型和来源匹配对应的 Agent</li><li><strong>解析</strong>：Agent 接收事件 payload，提取关键信息</li><li><strong>执行</strong>：Agent 根据事件内容执行相应操作</li><li><strong>反馈</strong>：将结果推送到指定 Channel</li></ol><p><strong>事件过滤：</strong></p><p>不是所有事件都需要处理。配置过滤规则，只处理符合条件的事件：</p><ul><li>只处理特定项目的 Jira Issue</li><li>只响应特定 Slack 频道的消息</li><li>只处理特定文件类型的变更</li></ul>",
        "tip": "事件驱动的 Agent 一定要配置去重机制——同一事件可能因为网络重试被收到多次，Agent 应该识别并跳过重复事件",
        "example": "# 事件驱动 Agent 配置\n\nagent:\n  name: event-responder\n  \n  triggers:\n    # Webhook 触发\n    - type: webhook\n      path: /hooks/jira-update\n      filter:\n        event_type: \"issue_updated\"\n        project: \"GAME\"\n        status_changed_to: [\"Done\", \"Closed\"]\n    \n    # Channel 消息触发\n    - type: channel_message\n      channel: slack-game-ops\n      filter:\n        contains: [\"紧急\", \"urgent\", \"P0\"]\n    \n    # 文件变更触发\n    - type: file_watch\n      path: \"./data/incoming/\"\n      filter:\n        extension: [\".csv\", \".json\"]\n  \n  # 去重配置\n  deduplication:\n    enabled: true\n    window: 300  # 5分钟内相同事件ID只处理一次\n    id_field: \"event_id\""
      },
      {
        "title": "混合触发——定时+条件判断",
        "body": "<p>实际业务中，很多任务需要<strong>定时 + 事件的混合触发策略</strong>。</p><p><strong>三种混合模式：</strong></p><p><strong>模式一：事件触发 + 定时兜底</strong></p><ul><li>正常情况：Webhook 收到 Bug 报告后立即处理</li><li>兜底机制：每天 22 点检查是否有遗漏的 Bug 未处理</li><li>适用场景：不能容忍遗漏的关键业务</li></ul><p><strong>模式二：定时触发 + 条件判断</strong></p><ul><li>每 2 小时触发一次 Agent</li><li>Agent 先检查是否有新数据，有才执行处理，没有则跳过</li><li>适用场景：数据更新频率不固定的场景</li></ul><p><strong>模式三：定时 + 事件 + 手动</strong></p><ul><li>日常定时生成日报</li><li>突发事件触发实时报告</li><li>管理者随时可以通过 Slash Command 手动触发</li></ul><p><strong>条件判断逻辑：</strong></p><p>在 Heartbeat prompt 中加入条件判断指令，让 Agent 自己决定是否需要执行：</p><ul><li>数据量检查：新增数据 < 10 条则跳过</li><li>时间窗口：距离上次执行不足 1 小时则跳过</li><li>状态检查：如果已有未完成的任务则排队</li></ul>",
        "tip": "混合触发时注意避免重复执行。用一个共享的「上次执行时间」标记，无论哪种方式触发都检查这个标记"
      },
      {
        "title": "任务依赖管理——A完成后触发B",
        "body": "<p>复杂的自动化工作流中，任务之间存在<strong>依赖关系</strong>——A 必须在 B 之前完成。</p><p><strong>常见依赖场景：</strong></p><ol><li><strong>串行依赖</strong>：拉取数据 → 清洗数据 → 生成报告 → 推送通知</li><li><strong>扇出依赖</strong>：数据准备完成后 → 同时触发日报、周报、告警检查</li><li><strong>扇入依赖</strong>：日报 + 投放数据 + 竞品分析都完成后 → 生成综合晨会材料</li><li><strong>条件依赖</strong>：只有当日报中发现 DAU 异常时，才触发深度分析</li></ol><p><strong>OpenClaw 的依赖管理：</strong></p><p>通过 Lobster 流水线的 DAG（有向无环图）定义任务依赖：</p><ul><li>每个节点可以声明依赖的前置节点</li><li>前置节点全部完成后才会触发当前节点</li><li>支持并行执行不相互依赖的节点</li><li>某个节点失败时，下游节点自动跳过</li></ul><p><strong>跨 Agent 的依赖：</strong></p><p>如果 A 和 B 是不同的 Agent，可以通过以下方式实现依赖：</p><ul><li>Agent A 完成后发送一条消息到指定 Channel</li><li>Agent B 监听该 Channel，收到消息后开始执行</li><li>或者 Agent A 直接触发 Agent B 的 Webhook</li></ul>",
        "tip": "任务依赖链不要超过5层。超过5层意味着流程太复杂，应该拆分为多个独立流水线，用消息队列串联"
      },
      {
        "title": "监控与告警——确保定时任务从不遗漏",
        "body": "<p>定时任务最怕的不是失败，而是<strong>静默失败——任务没执行，也没有人知道</strong>。</p><p><strong>必须监控的指标：</strong></p><table><tr><th>指标</th><th>告警条件</th><th>告警渠道</th></tr><tr><td>任务执行状态</td><td>预定时间±10分钟未启动</td><td>飞书 + 短信</td></tr><tr><td>执行时长</td><td>超过 timeout 设定值</td><td>飞书</td></tr><tr><td>执行结果</td><td>连续2次失败</td><td>飞书 + @负责人</td></tr><tr><td>输出质量</td><td>输出为空或格式异常</td><td>飞书</td></tr><tr><td>API 费用</td><td>单次执行费用超过预算</td><td>飞书 + 邮件</td></tr></table><p><strong>Dead Man's Switch（死人开关）：</strong></p><p>这是一种反向监控机制——如果定时任务正常运行，它会定期发送「我还活着」信号。如果超过预期时间没有收到信号，说明任务出问题了。</p><ul><li>每次任务完成后发送一个心跳信号到监控系统</li><li>监控系统检测到心跳中断后发出告警</li><li>适合关键的定时任务（如日报生成、数据备份）</li></ul><p><strong>历史执行记录：</strong></p><p>保留所有定时任务的执行历史，便于排查问题：</p><ul><li>触发时间、开始时间、结束时间</li><li>执行状态（成功/失败/超时/跳过）</li><li>输入参数和输出摘要</li><li>API 调用次数和费用</li></ul>",
        "tip": "所有定时任务都应该有一个「责任人」。Mission Control 支持为每个 Agent 指定 Owner，任务异常时自动 @Owner"
      }
    ]
  },
  {
    "id": "t-oc-20",
    "title": "Agent 团队治理：从个人工具到组织资产",
    "desc": "建立 Agent 模板化、版本管理、内部市场和权限体系，将个人 Agent 转化为可复用的组织级资产",
    "tier": "expert",
    "difficulty": "expert",
    "duration": "50分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "🏛️",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-openclaw",
    "columnOrder": 20,
    "prerequisite": ["t-oc-06"],
    "nextGuides": ["t-oc-21"],
    "relatedPath": "OpenClaw 自动化实战",
    "fitRoles": ["全岗位"],
    "solves": "个人搭的 Agent 无法被团队复用，缺乏标准化管理",
    "outcome": "一套完整的 Agent 资产管理与团队协作体系",
    "fitLevel": "有团队管理经验，已有多个运行中的 Agent",
    "content": [
      {
        "title": "个人 Agent vs 团队 Agent 的差距",
        "body": "<p>个人搭建的 Agent 和团队级 Agent 之间存在巨大差距，这些差距决定了 Agent 能否从「个人玩具」变成「组织资产」：</p><table><tr><th>维度</th><th>个人 Agent</th><th>团队 Agent</th></tr><tr><td>配置管理</td><td>本地文件，只有自己知道怎么改</td><td>Git 管理，有版本历史和变更审核</td></tr><tr><td>可发现性</td><td>只有创建者知道它存在</td><td>内部市场，所有人可搜索和使用</td></tr><tr><td>可复用性</td><td>硬编码参数，换个场景就不能用</td><td>模板化设计，参数化配置</td></tr><tr><td>可靠性</td><td>创建者休假就没人维护</td><td>有文档、有 Owner、有 SLA</td></tr><tr><td>安全性</td><td>API Key 写在配置里</td><td>密钥集中管理，权限分级</td></tr><tr><td>可观测性</td><td>不知道谁在用、效果如何</td><td>完整的使用统计和效果评估</td></tr></table><p><strong>典型痛点故事：</strong></p><p>运营小A搭了一个超好用的「日报 Agent」，但小A离职后，没人知道怎么维护。Agent 的 API Key 过期了，日报停了一周才被发现。Team Lead 想让其他人也用这个 Agent，但配置文件只在小A的电脑上。</p>",
        "tip": "判断标准：如果创建者明天离职，这个 Agent 还能正常运行并被其他人维护吗？如果不能，它就不是团队 Agent"
      },
      {
        "title": "Agent 模板化——从一次性脚本到可复用模板",
        "body": "<p>模板化是让 Agent 可复用的第一步——将<strong>固定逻辑</strong>和<strong>可变参数</strong>分离。</p><p><strong>模板结构设计：</strong></p><pre><code>agent-templates/\n├── daily-report/\n│   ├── template.yaml       # Agent 配置模板\n│   ├── README.md            # 使用说明\n│   ├── params.schema.json   # 参数定义（JSON Schema）\n│   ├── examples/            # 示例配置\n│   │   ├── game-ops.yaml    # 游戏运营版\n│   │   └── marketing.yaml   # 市场版\n│   └── tests/               # 测试用例\n│       └── test_report.yaml</code></pre><p><strong>参数化设计原则：</strong></p><ul><li><strong>数据源可配</strong>：CSV 路径、API 地址、数据库连接，全部用变量</li><li><strong>输出目标可配</strong>：飞书群、Slack 频道、邮件地址，用户自选</li><li><strong>业务逻辑可配</strong>：报告模板、分析维度、告警阈值，可自定义</li><li><strong>模型可配</strong>：使用 Claude 还是 GPT，根据预算和需求选择</li></ul><p><strong>模板继承：</strong></p><p>支持基础模板 + 覆盖模式——团队有一个标准模板，各个项目可以覆盖特定参数：</p><ul><li>base: daily-report-template（标准日报模板）</li><li>override: data_source, output_channel, alert_threshold</li></ul>",
        "tip": "好的模板应该让使用者只需要填3-5个参数就能跑起来。如果需要填10个以上参数，说明模板拆分粒度不够",
        "example": "# Agent 模板示例：daily-report-template\n# template.yaml\n\ntemplate:\n  name: daily-report\n  version: \"2.0\"\n  description: \"通用日报生成模板\"\n  author: \"ops-team\"\n  tags: [\"report\", \"daily\", \"metrics\"]\n  \n  # 可配置参数\n  params:\n    data_source:\n      type: string\n      required: true\n      description: \"数据文件路径或API地址\"\n    output_channel:\n      type: string\n      required: true\n      description: \"输出频道名称\"\n    report_sections:\n      type: array\n      default: [\"overview\", \"metrics\", \"alerts\"]\n      description: \"报告包含的章节\"\n    alert_threshold:\n      type: number\n      default: 10\n      description: \"指标变化百分比告警阈值\"\n  \n  # 基于模板创建实例\n  # openclaw agent create --from-template daily-report \\\n  #   --param data_source=./data/metrics.csv \\\n  #   --param output_channel=feishu-ops-group"
      },
      {
        "title": "Agent 版本管理——Git 化配置与变更追踪",
        "body": "<p>Agent 配置必须像代码一样进行版本管理——<strong>每次变更都有记录、可回滚、可审核</strong>。</p><p><strong>Git 化管理实践：</strong></p><ol><li><strong>仓库结构</strong>：所有 Agent 配置存储在专用 Git 仓库中</li><li><strong>分支策略</strong>：main 分支是生产配置，feature 分支用于测试新配置</li><li><strong>PR 审核</strong>：任何配置变更必须提交 PR，至少1人审核后合并</li><li><strong>CI/CD</strong>：合并到 main 后自动部署到 Gateway</li></ol><p><strong>仓库目录结构：</strong></p><pre><code>openclaw-configs/\n├── agents/\n│   ├── daily-report-agent.yaml\n│   ├── bug-router-agent.yaml\n│   └── sentiment-analyzer.yaml\n├── pipelines/\n│   ├── batch-translation.yaml\n│   └── review-analysis.yaml\n├── channels/\n│   ├── feishu-ops.yaml\n│   └── slack-dev.yaml\n├── templates/\n│   └── (模板目录)\n└── .github/\n    └── workflows/\n        └── deploy.yaml  # 自动部署</code></pre><p><strong>变更日志规范：</strong></p><ul><li>每次 PR 必须说明：改了什么、为什么改、影响范围</li><li>重大变更（新增 Agent、修改工具权限）需要额外审批</li><li>紧急修复可以先合并后审核，但必须在24小时内补充审核</li></ul>",
        "tip": "为 Agent 配置仓库设置 CODEOWNERS 文件，确保特定 Agent 的配置修改必须由对应 Owner 审核"
      },
      {
        "title": "团队 Agent 市场——内部 Agent 共享与发现",
        "body": "<p>当团队有了10个以上 Agent 后，需要一个「<strong>内部市场</strong>」来帮助成员发现和使用已有的 Agent。</p><p><strong>Agent 市场的核心功能：</strong></p><ul><li><strong>浏览和搜索</strong>：按类别、标签、岗位筛选 Agent</li><li><strong>详情页</strong>：每个 Agent 的功能说明、使用方法、示例输出</li><li><strong>一键部署</strong>：从模板创建个人实例，填几个参数就能用</li><li><strong>评分和反馈</strong>：使用者对 Agent 效果评分和反馈</li><li><strong>使用统计</strong>：看到最热门、最高评分的 Agent</li></ul><p><strong>Agent 元信息规范：</strong></p><p>每个上架的 Agent 必须包含以下元信息：</p><table><tr><th>字段</th><th>说明</th><th>示例</th></tr><tr><td>name</td><td>Agent 名称</td><td>每日运营日报生成器</td></tr><tr><td>description</td><td>功能描述（100字内）</td><td>自动拉取运营数据，生成日报推送到飞书群</td></tr><tr><td>category</td><td>分类</td><td>运营/投放/品牌/技术</td></tr><tr><td>owner</td><td>维护者</td><td>@ops-team</td></tr><tr><td>sla</td><td>服务等级</td><td>工作日1小时内响应</td></tr><tr><td>cost</td><td>单次运行成本</td><td>约 ¥0.5</td></tr><tr><td>rating</td><td>用户评分</td><td>4.5/5</td></tr></table><p><strong>实现方式：</strong></p><p>Agent 市场可以用 Mission Control 的扩展页面实现，或者简单地用一个 Notion/飞书文档维护 Agent 目录。</p>",
        "tip": "Agent 市场最重要的不是技术实现，而是「运营」——定期推荐优秀 Agent，分享使用案例，鼓励团队成员贡献",
        "example": "# Agent 市场目录条目示例\n# agents/daily-report-agent.yaml\n\nmetadata:\n  name: \"每日运营日报生成器\"\n  id: daily-report-agent\n  version: \"2.1.0\"\n  category: operations\n  tags: [\"report\", \"daily\", \"metrics\", \"automation\"]\n  owner: \"@zhang-san\"\n  team: ops-team\n  \n  # 上架信息\n  marketplace:\n    status: published        # draft / published / deprecated\n    rating: 4.5\n    total_users: 8\n    total_runs: 1240\n    avg_cost_per_run: 0.3    # 元\n    success_rate: 98.5       # %\n    \n  # 使用说明\n  documentation:\n    quick_start: |\n      1. 从模板创建实例：openclaw agent create --from daily-report-template\n      2. 配置数据源路径\n      3. 配置输出飞书群 Webhook\n      4. 启用 Heartbeat 定时执行\n    \n    example_output: |\n      [示例日报截图或文本]\n    \n    faq:\n      - q: \"数据源支持哪些格式？\"\n        a: \"支持 CSV、JSON、以及直连数据库（需额外配置）\""
      },
      {
        "title": "权限分级——谁能创建/修改/执行 Agent",
        "body": "<p>团队使用 Agent 后，权限管理成为安全和治理的关键——<strong>不是每个人都应该有修改生产 Agent 的权限</strong>。</p><p><strong>四级权限模型：</strong></p><table><tr><th>角色</th><th>创建 Agent</th><th>修改配置</th><th>执行 Agent</th><th>管理权限</th><th>查看日志</th></tr><tr><td>Admin</td><td>全部</td><td>全部</td><td>全部</td><td>全部</td><td>全部</td></tr><tr><td>Developer</td><td>需审批</td><td>自己的 + 被授权的</td><td>全部</td><td>无</td><td>自己的</td></tr><tr><td>User</td><td>从模板创建</td><td>自己的参数</td><td>被授权的</td><td>无</td><td>自己的</td></tr><tr><td>Viewer</td><td>无</td><td>无</td><td>无</td><td>无</td><td>被授权的</td></tr></table><p><strong>关键权限控制点：</strong></p><ol><li><strong>工具权限</strong>：哪些 Agent 可以使用 shell_exec、file_write 等敏感工具</li><li><strong>Channel 权限</strong>：哪些 Agent 可以向外部平台（Slack、飞书）发送消息</li><li><strong>数据权限</strong>：哪些 Agent 可以访问哪些数据目录</li><li><strong>API Key 权限</strong>：不同 Agent 使用不同的 API Key，便于成本追踪和权限隔离</li></ol><p><strong>审批流程：</strong></p><ul><li>新增 Agent → Developer 提交 PR → Admin 审核</li><li>修改工具权限 → 必须经过安全审核</li><li>添加外部 Channel → 必须经过信息安全审核</li></ul>",
        "tip": "权限管理的原则是「最小权限」——Agent 只拥有完成任务所需的最少权限。日报 Agent 不需要 shell_exec，翻译 Agent 不需要访问财务数据"
      },
      {
        "title": "Agent 审计——使用日志与效果评估",
        "body": "<p>Agent 上线后需要持续跟踪<strong>使用情况和业务效果</strong>，用数据驱动优化。</p><p><strong>审计日志记录内容：</strong></p><ul><li><strong>执行日志</strong>：每次 Agent 执行的触发原因、开始/结束时间、耗时</li><li><strong>工具调用日志</strong>：Agent 调用了哪些工具、输入/输出摘要</li><li><strong>API 消耗日志</strong>：每次调用的模型、token数、费用</li><li><strong>用户操作日志</strong>：谁创建/修改/执行了哪个 Agent</li></ul><p><strong>效果评估框架：</strong></p><table><tr><th>评估维度</th><th>指标</th><th>衡量方法</th></tr><tr><td>效率提升</td><td>节省的人工时间</td><td>对比自动化前后的工时</td></tr><tr><td>质量影响</td><td>输出准确率</td><td>人工抽检（每周10%）</td></tr><tr><td>成本效益</td><td>API 费用 vs 节省的人力成本</td><td>月度费用报表</td></tr><tr><td>可靠性</td><td>执行成功率</td><td>成功次数 / 总执行次数</td></tr><tr><td>用户满意度</td><td>使用者评分</td><td>季度调研</td></tr></table><p><strong>月度 Agent 健康报告：</strong></p><p>每月自动生成各 Agent 的健康报告，包含上述所有指标，发送给 Agent Owner 和 Admin。对于连续2个月评分低于3分或使用次数为0的 Agent，建议下线。</p>",
        "tip": "审计最重要的产出不是日志本身，而是「优化建议」。每月根据审计数据给出3条可执行的优化建议",
        "example": "# Agent 审计配置\n\naudit:\n  # 日志存储\n  storage:\n    type: sqlite\n    path: \"./data/audit.db\"\n    retention: 90  # 保留90天\n  \n  # 记录级别\n  log_level:\n    execution: full      # 记录完整执行过程\n    tool_calls: summary  # 记录工具调用摘要\n    api_usage: detailed  # 记录详细API消耗\n  \n  # 月度报告\n  monthly_report:\n    enabled: true\n    schedule: \"0 10 1 * *\"  # 每月1号10点生成\n    recipients:\n      - channel: feishu-admin-group\n      - email: admin@company.com\n    \n    sections:\n      - agent_usage_ranking       # Agent 使用排名\n      - cost_breakdown            # 费用明细\n      - success_rate_trend        # 成功率趋势\n      - inactive_agents_alert     # 不活跃Agent告警\n      - optimization_suggestions  # 优化建议"
      },
      {
        "title": "建立 Agent CoE（卓越中心）——推动组织级采用",
        "body": "<p>要让 Agent 成为组织级能力而非个人兴趣，需要建立 <strong>Agent CoE（Center of Excellence，卓越中心）</strong>。</p><p><strong>CoE 的职责：</strong></p><ol><li><strong>标准制定</strong>：定义 Agent 开发规范、模板标准、安全基线</li><li><strong>能力建设</strong>：培训团队成员使用和创建 Agent</li><li><strong>技术支持</strong>：解决复杂的集成和调优问题</li><li><strong>最佳实践</strong>：收集和推广成功案例</li><li><strong>成本治理</strong>：监控和优化 AI API 支出</li></ol><p><strong>CoE 团队构成（兼职即可）：</strong></p><table><tr><th>角色</th><th>人数</th><th>职责</th></tr><tr><td>CoE Lead</td><td>1人</td><td>总体策略、跨部门协调</td></tr><tr><td>Agent 架构师</td><td>1-2人</td><td>技术方案、模板设计</td></tr><tr><td>Agent 运营</td><td>1人</td><td>市场运营、培训、案例收集</td></tr><tr><td>安全审核</td><td>1人</td><td>安全评审、权限管理</td></tr></table><p><strong>CoE 的关键产出：</strong></p><ul><li><strong>Agent 开发手册</strong>：从零到上线的完整指南</li><li><strong>模板库</strong>：10+ 个开箱即用的 Agent 模板</li><li><strong>培训课程</strong>：每月1次的 Agent Workshop</li><li><strong>月度报告</strong>：组织 Agent 使用情况和 ROI 分析</li><li><strong>Roadmap</strong>：下季度 Agent 自动化优先级规划</li></ul>",
        "tip": "CoE 的成功关键是「产出驱动」——不是建一个空架子，而是在前3个月就交付5个以上实际可用的 Agent，用实际效果赢得组织的支持",
        "example": "# Agent CoE 季度 OKR 模板\n\n# Objective: 建立Agent卓越中心，推动组织级AI自动化\n\nKR1: 产出\n  - 完成 Agent 开发手册 v1.0\n  - 上线 10 个标准 Agent 模板\n  - 建立内部 Agent 市场（至少20个 Agent 上架）\n\nKR2: 采用\n  - 培训覆盖率 80%（所有业务团队）\n  - 月活跃 Agent 用户 ≥ 15 人\n  - 每周自动化执行次数 ≥ 500 次\n\nKR3: 效果\n  - 团队每月节省总工时 ≥ 100 小时\n  - Agent 执行成功率 ≥ 95%\n  - API 月支出控制在 ¥5000 以内\n\nKR4: 治理\n  - 100% Agent 配置 Git 化管理\n  - 0 安全事件（API Key 泄露、数据越权）\n  - Agent 审计覆盖率 100%"
      }
    ]
  },
  {
    "id": "t-oc-21",
    "title": "AI Agent 成熟度模型：从试验到组织级规模化",
    "desc": "掌握 AI Agent 成熟度五级模型，制定分阶段的组织落地路线图，用成熟度评估表诊断当前阶段并规划下一步",
    "tier": "expert",
    "difficulty": "expert",
    "duration": "45分钟",
    "targetJobs": ["all"],
    "category": "prompt",
    "icon": "📈",
    "editorPick": false,
    "steps": 7,
    "columnId": "col-openclaw",
    "columnOrder": 21,
    "prerequisite": ["t-oc-20"],
    "nextGuides": [],
    "relatedPath": "OpenClaw 自动化实战",
    "fitRoles": ["全岗位"],
    "solves": "知道 Agent 好用，但不知道如何推动全团队/公司采用",
    "outcome": "分阶段的 AI Agent 组织落地路线图",
    "fitLevel": "团队管理者或技术负责人",
    "content": [
      {
        "title": "AI Agent 成熟度五级模型",
        "body": "<p>组织采用 AI Agent 不是一蹴而就的，需要经历<strong>五个成熟度阶段</strong>。每个阶段都有明确的特征、目标和关键动作：</p><table><tr><th>等级</th><th>名称</th><th>特征</th><th>Agent 数量</th><th>典型周期</th></tr><tr><td>L1</td><td>试验期</td><td>1-2个人探索，验证可行性</td><td>1-3个</td><td>1-2个月</td></tr><tr><td>L2</td><td>个人级</td><td>10个种子用户，个人效率提升</td><td>5-15个</td><td>2-3个月</td></tr><tr><td>L3</td><td>团队级</td><td>团队共享 Agent 库，标准化管理</td><td>15-50个</td><td>3-6个月</td></tr><tr><td>L4</td><td>部门级</td><td>跨团队协作，自动化覆盖率 KPI</td><td>50-200个</td><td>6-12个月</td></tr><tr><td>L5</td><td>企业级</td><td>Agent First 文化，全面渗透</td><td>200+</td><td>12个月+</td></tr></table><p><strong>关键认知：</strong></p><ul><li>跳级几乎不可能——每个阶段都有必须解决的问题，跳过会埋下隐患</li><li>大多数团队卡在 L2→L3——个人用得好不等于团队能用好</li><li>L4 和 L5 的关键不是技术，而是组织文化和流程变革</li></ul>",
        "tip": "诚实评估当前等级。80%的团队自我评估会高估1-2个等级。用下面的成熟度评估表做客观评估"
      },
      {
        "title": "Level 1 试验期：选对第一个自动化场景",
        "body": "<p>L1 阶段的唯一目标：<strong>用最小成本验证「Agent 确实能解决我们的实际问题」</strong>。</p><p><strong>L1 的关键动作：</strong></p><ol><li><strong>选1个痛点场景</strong>：团队中最多人抱怨的重复性工作</li><li><strong>找1-2个先锋</strong>：技术敏感度高、愿意尝试新工具的人</li><li><strong>搭建最小可用环境</strong>：一台电脑 + Docker + 一个 API Key</li><li><strong>用2周跑通全流程</strong>：从安装到产出有用结果</li><li><strong>记录效果数据</strong>：节省了多少时间、输出质量如何</li></ol><p><strong>场景选择评分表：</strong></p><table><tr><th>评分维度</th><th>权重</th><th>说明</th></tr><tr><td>痛感强度</td><td>30%</td><td>团队多少人受这个问题困扰？</td></tr><tr><td>频率</td><td>25%</td><td>多久做一次？（日>周>月）</td></tr><tr><td>标准化程度</td><td>20%</td><td>步骤是否固定？（固定>半固定>灵活）</td></tr><tr><td>风险可控</td><td>15%</td><td>做错了后果严重吗？（低>中>高）</td></tr><tr><td>可量化</td><td>10%</td><td>效果能用数字衡量吗？</td></tr></table><p><strong>推荐的第一个场景（游戏发行）：</strong></p><p>「每日运营日报生成」——痛感强（每天都要做）、频率高（每天）、步骤固定（拉数据→分析→写报告→推送）、风险低（错了重跑就行）、可量化（节省X分钟/天）。</p>",
        "tip": "L1 阶段不要追求完美。80分的自动化方案比100分的手动方案更有价值——因为它不会忘记、不会请假、不会出错"
      },
      {
        "title": "Level 2 个人级：培养10个种子用户",
        "body": "<p>L1 验证成功后，目标是将 Agent 推广到 <strong>10 个种子用户</strong>，让更多人体验到 AI 自动化的价值。</p><p><strong>种子用户选择标准：</strong></p><ul><li><strong>有意愿</strong>：对 AI 工具有兴趣，愿意花时间学习</li><li><strong>有场景</strong>：日常工作中有明确的重复性任务</li><li><strong>有影响力</strong>：在团队中有话语权，能影响其他人</li><li><strong>分布广</strong>：来自不同岗位（运营、投放、品牌、策划），验证跨场景能力</li></ul><p><strong>L2 阶段的关键活动：</strong></p><ol><li><strong>1对1培训</strong>：先锋为每个种子用户做30分钟入门培训</li><li><strong>场景陪跑</strong>：帮每个种子用户找到并搭建第一个 Agent</li><li><strong>建立交流群</strong>：种子用户微信/飞书群，互相分享经验和问题</li><li><strong>周会分享</strong>：每周一个种子用户分享自己的 Agent 使用故事</li><li><strong>收集反馈</strong>：每2周做一次简短调研，了解使用障碍</li></ol><p><strong>L2 毕业标准：</strong></p><ul><li>10个种子用户中至少8个持续使用 Agent</li><li>累计有15个以上 Agent 在运行</li><li>每周自动化任务执行次数 ≥ 100</li><li>种子用户的平均满意度 ≥ 4/5</li></ul>",
        "tip": "种子用户的第一个 Agent 一定要在1小时内跑起来。如果第一次体验太痛苦，他们就不会再尝试了。提前准备好模板和配置"
      },
      {
        "title": "Level 3 团队级：建立共享 Agent 库",
        "body": "<p>L3 是关键转折点——从「每个人有自己的 Agent」变成「<strong>团队有一套共享的 Agent 资产</strong>」。</p><p><strong>L3 需要建设的基础设施：</strong></p><ol><li><strong>共享 Gateway</strong>：部署团队级 OpenClaw 服务器（不再是各人电脑上运行）</li><li><strong>Agent 模板库</strong>：10个以上标准化模板，新人可以一键使用</li><li><strong>内部 Agent 市场</strong>：浏览、搜索、评分、反馈</li><li><strong>Mission Control</strong>：统一的管理和监控面板</li><li><strong>配置 Git 仓库</strong>：所有配置版本化管理</li></ol><p><strong>L3 的组织变化：</strong></p><ul><li>指定 Agent Owner——每个 Agent 有明确的维护者</li><li>建立 SLA——关键 Agent 的可用性承诺（如日报 Agent 99.9%可用）</li><li>制定治理 SOP——命名规范、变更流程、安全审核</li><li>成本预算——为 Agent 运行费用设立独立预算</li></ul><p><strong>L3 毕业标准：</strong></p><table><tr><th>指标</th><th>目标值</th></tr><tr><td>共享 Agent 模板数</td><td>≥ 10</td></tr><tr><td>团队 Agent 使用率</td><td>≥ 70% 成员使用</td></tr><tr><td>配置 Git 化率</td><td>100%</td></tr><tr><td>Agent 执行成功率</td><td>≥ 95%</td></tr><tr><td>月度节省总工时</td><td>≥ 100 小时</td></tr></table>",
        "tip": "L3 最大的阻力是「标准化」。每个人都觉得自己的 Agent 最好用，不愿意改成标准模板。关键是让标准模板比个人版本更好用"
      },
      {
        "title": "Level 4 部门级：自动化覆盖率 KPI",
        "body": "<p>L4 的标志是将 Agent 自动化纳入<strong>部门级 KPI</strong>——不再是「可选的效率工具」，而是「必须达成的工作方式」。</p><p><strong>自动化覆盖率的计算方法：</strong></p><pre><code>自动化覆盖率 = 已自动化的标准流程数 / 可自动化的标准流程总数 x 100%</code></pre><p><strong>分步骤实施：</strong></p><ol><li><strong>流程盘点</strong>：列出部门所有标准化工作流程（通常30-80个）</li><li><strong>可行性评估</strong>：标记哪些可以自动化（通常40-60%）</li><li><strong>优先级排序</strong>：按 ROI 排序，优先自动化高频低创意任务</li><li><strong>设定 KPI</strong>：如「Q2 自动化覆盖率从 20% 提升到 45%」</li><li><strong>持续跟踪</strong>：每月更新覆盖率数据和效果报告</li></ol><p><strong>跨团队 Agent 协作：</strong></p><p>L4 阶段开始出现跨团队的 Agent 协作链路：</p><ul><li>运营 Agent 生成的日报 → 自动触发投放 Agent 调整出价策略</li><li>品牌 Agent 监控到竞品动态 → 自动通知策划 Agent 准备应对方案</li><li>QA Agent 收集到玩家反馈 → 自动分发到运营/开发/客服各团队的 Agent</li></ul><p><strong>L4 毕业标准：</strong></p><ul><li>部门自动化覆盖率 ≥ 50%</li><li>跨团队 Agent 协作链路 ≥ 5 条</li><li>月度 ROI ≥ 3x（节省的人力成本 / AI 支出）</li></ul>",
        "tip": "自动化覆盖率 KPI 要设得合理。100%不是目标——总有些任务不适合或不值得自动化。50-70% 是大多数部门的合理上限"
      },
      {
        "title": "Level 5 企业级：Agent First 的工作文化",
        "body": "<p>L5 是最终形态——<strong>Agent First</strong> 成为组织的默认工作思维。</p><p><strong>Agent First 的含义：</strong></p><ul><li>任何新工作流程，首先考虑「能不能用 Agent 做」</li><li>招聘时考察候选人的 AI 工具使用能力</li><li>OKR 中包含 Agent 相关的效率指标</li><li>Agent 运行数据是日常管理决策的数据来源之一</li></ul><p><strong>L5 组织的特征：</strong></p><table><tr><th>维度</th><th>传统组织</th><th>Agent First 组织</th></tr><tr><td>新流程设计</td><td>先考虑谁来做</td><td>先考虑 Agent 能否做</td></tr><tr><td>人才要求</td><td>会做这件事</td><td>会设计 Agent 做这件事</td></tr><tr><td>数据利用</td><td>人工拉数据→分析→决策</td><td>Agent 实时监控→异常告警→辅助决策</td></tr><tr><td>知识管理</td><td>文档/Wiki</td><td>Agent Memory + 知识库</td></tr><tr><td>协作方式</td><td>人与人协作</td><td>人-Agent-人协作</td></tr></table><p><strong>建设 Agent First 文化的方法：</strong></p><ol><li><strong>领导层带头</strong>：管理者公开使用 Agent，分享效果</li><li><strong>培训常态化</strong>：新人入职必修 Agent 使用课程</li><li><strong>激励机制</strong>：设立「最佳 Agent 创新奖」，奖励优秀的自动化方案</li><li><strong>知识沉淀</strong>：所有最佳实践沉淀为 Agent 模板和文档</li></ol>",
        "tip": "Agent First 不意味着消灭人工工作。最好的模式是「Agent 处理标准化部分，人处理创意和决策部分」——人做人擅长的，Agent 做 Agent 擅长的"
      },
      {
        "title": "游戏发行公司的 Agent 落地案例分析",
        "body": "<p>以一家 50 人的游戏发行公司为例，展示<strong>从 L1 到 L4 的完整落地过程</strong>：</p><p><strong>背景：</strong></p><ul><li>公司规模：50 人（运营15人、投放10人、品牌8人、策划7人、技术10人）</li><li>发行产品：3 款手游（1款SLG、1款二次元RPG、1款休闲）</li><li>起点状态：L0（完全没有 Agent 经验）</li></ul><p><strong>落地时间线：</strong></p><p><strong>第 1-2 月（L0→L1）</strong>：技术总监和1名运营主管搭建 OpenClaw，为 SLG 产品做日报 Agent。效果：日报从每天 30 分钟 → 5 分钟审核。</p><p><strong>第 3-4 月（L1→L2）</strong>：推广到10人种子组，覆盖日报、差评预警、竞品监控。月节省工时 80 小时。</p><p><strong>第 5-8 月（L2→L3）</strong>：部署团队级服务器，建立模板库和 Agent 市场，40人中32人使用。月节省工时 300 小时。</p><p><strong>第 9-12 月（L3→L4）</strong>：自动化覆盖率达到 45%，跨团队 Agent 链路 8 条。月度 ROI 达到 5x。</p><p><strong>关键数据：</strong></p><table><tr><th>指标</th><th>落地前</th><th>12个月后</th></tr><tr><td>月度人工重复工时</td><td>600 小时</td><td>200 小时</td></tr><tr><td>日报产出时间</td><td>30 分钟/天</td><td>5 分钟/天（审核）</td></tr><tr><td>Bug 响应时间</td><td>8 小时</td><td>15 分钟</td></tr><tr><td>竞品监控覆盖</td><td>5 个竞品/周</td><td>20 个竞品/实时</td></tr><tr><td>AI Agent 月支出</td><td>¥0</td><td>¥4,500</td></tr><tr><td>节省的人力成本等价</td><td>—</td><td>¥60,000/月</td></tr></table>",
        "tip": "12 个月从 L0 到 L4 是比较快的节奏。正常情况下 18 个月更合理。不要急于求成，每个阶段的基础打扎实比快速推进更重要",
        "example": "# AI Agent 成熟度评估表（自评工具）\n# 每项打分 1-5 分，总分判断当前等级\n\n评估维度:\n  基础设施 (权重 20%):\n    - 是否有专用 Gateway 服务器运行？\n    - Agent 配置是否 Git 化管理？\n    - 是否有监控和告警系统？\n    - 是否有成本追踪和预算控制？\n  \n  使用深度 (权重 25%):\n    - 团队 Agent 使用率（使用人数/总人数）？\n    - 每周自动化执行次数？\n    - 覆盖了多少标准化工作流程？\n    - 是否有跨团队 Agent 协作？\n  \n  治理成熟度 (权重 25%):\n    - 是否有 Agent 命名和配置规范？\n    - 是否有权限分级和审批流程？\n    - 是否有 Agent Owner 和 SLA？\n    - 是否有月度审计和效果评估？\n  \n  组织文化 (权重 15%):\n    - 管理层是否支持和使用？\n    - 是否有培训和知识分享机制？\n    - 新流程是否会首先考虑自动化？\n    - 是否有 Agent 相关的激励机制？\n  \n  效果验证 (权重 15%):\n    - 是否有可量化的效率提升数据？\n    - ROI 是否大于 2x？\n    - Agent 执行成功率是否 ≥ 95%？\n    - 用户满意度是否 ≥ 4/5？\n\n等级判定:\n  L1 (10-20分): 试验期\n  L2 (21-35分): 个人级\n  L3 (36-55分): 团队级\n  L4 (56-75分): 部门级\n  L5 (76-100分): 企业级"
      }
    ]
  }
];

async function main() {
  console.log('准备追加教程 t-oc-17 至 t-oc-21...');
  console.log('等待 20 秒以避免文件写入冲突...');

  await new Promise(resolve => setTimeout(resolve, 20000));

  console.log('等待完毕，开始读取文件...');

  // Read current file
  const raw = fs.readFileSync(TUTORIALS_PATH, 'utf-8');
  const tutorials = JSON.parse(raw);

  // Check for duplicates
  const existingIds = new Set(tutorials.map(t => t.id));
  const toAdd = newTutorials.filter(t => {
    if (existingIds.has(t.id)) {
      console.log(`跳过已存在的教程: ${t.id}`);
      return false;
    }
    return true;
  });

  if (toAdd.length === 0) {
    console.log('所有教程已存在，无需追加。');
    return;
  }

  // Append new tutorials
  const updated = [...tutorials, ...toAdd];

  // Write back
  fs.writeFileSync(TUTORIALS_PATH, JSON.stringify(updated, null, 2) + '\n', 'utf-8');

  console.log(`成功追加 ${toAdd.length} 篇教程: ${toAdd.map(t => t.id).join(', ')}`);
  console.log(`tutorials.json 现在共有 ${updated.length} 篇教程。`);
}

main().catch(err => {
  console.error('追加教程失败:', err);
  process.exit(1);
});
