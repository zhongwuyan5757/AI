# FiveSeven AI — 游戏行业 AI 能力成长平台

自动化内容系统：每日抓取 AI 行业动态，自动分类、翻译、去重，部署到 Vercel。

## 快速开始

```bash
# 安装依赖
npm install

# 本地启动开发服务器
npm run serve          # http://localhost:8080

# 手动抓取最新内容 (50篇)
npm run fetch:latest

# 抓取全量内容 (200篇)
npm run fetch:all

# 预览模式 (不写入文件)
npm run fetch:latest -- --dry-run
```

## 自动化架构

```
GitHub Actions (每天 08:00 北京时间)
  ├── npm run fetch:latest
  │   ├── fetch_news.js   → 12个RSS/API源 → AI分类 → 翻译 → 去重
  │   ├── fetch_tools.js  → GitHub Trending AI仓库
  │   └── fetch_models.js → HuggingFace 热门模型
  ├── 裁剪 news.json 到最新 50 篇
  ├── SHA-256 哈希对比，无变化则跳过提交
  ├── 有变化 → git commit + push
  └── Vercel GitHub 集成 → 自动部署到生产
```

## npm scripts

| 命令 | 说明 |
|------|------|
| `npm run fetch:latest` | **推荐** — 抓取最新50篇，带哈希对比 |
| `npm run fetch:all` | 抓取全量200篇 (原始编排器) |
| `npm run fetch:news` | 仅抓取新闻 |
| `npm run fetch:tools` | 仅抓取工具 |
| `npm run fetch:models` | 仅抓取模型 |
| `npm run serve` | 本地开发服务器 :8080 |

## GitHub Actions 工作流

**文件**: `.github/workflows/update-content.yml`

### 触发方式
- **定时**: 每天 UTC 00:00 (北京 08:00)
- **手动**: GitHub → Actions → Run workflow

### 执行逻辑
1. 检出代码 + 安装依赖
2. 运行 `npm run fetch:latest` (抓取12个源 → 清洗 → 分类 → 翻译 → 去重 → 裁剪50篇)
3. 更新 `data-loader.js` 中的 VERSION 时间戳（缓存破坏）
4. `git diff` 检测 data/ 目录是否有变化
5. 有变化 → 提交 + 推送 → Vercel 自动部署
6. 无变化 → 跳过，不产生空提交

### 并发控制
- `concurrency.group: content-update` 确保同一时间只有一个实例运行
- 后触发的排队等待，不会取消正在运行的任务

## GitHub Secrets 配置

在 GitHub 仓库 → Settings → Secrets and variables → Actions 中配置：

| Secret | 必须 | 说明 |
|--------|------|------|
| `ANTHROPIC_API_KEY` | 可选 | Claude API Key，用于AI智能分类和翻译。不设置则降级为关键词规则 |
| `VERCEL_DEPLOY_HOOK_URL` | 可选 | Vercel Deploy Hook URL。已连接 Git 集成时不需要 |

### 如何获取 Deploy Hook (仅备用)
1. Vercel Dashboard → 项目 → Settings → Git → Deploy Hooks
2. 创建 Hook，复制 URL
3. 添加到 GitHub Secrets: `VERCEL_DEPLOY_HOOK_URL`

## 数据文件

| 文件 | 内容 | 最大条数 |
|------|------|---------|
| `data/news.json` | AI行业新闻 | 7天内累积（每次更新100条，超7天自动清理） |
| `data/tools.json` | AI工具库 | 50 |
| `data/models.json` | AI模型库 | 30 |
| `data/tutorials.json` | 实战教程 | 手动维护 |
| `data/prompts.json` | Prompt模板 | 手动维护 |

## 验证流程是否跑通

```bash
# 1. 本地验证
npm run fetch:latest
# 检查输出：应看到 "fetch:latest 完成" 和数据变更文件列表

# 2. GitHub Actions 验证
gh workflow run update-content.yml
gh run watch                          # 监控运行状态

# 3. 线上验证
# 访问 https://fiveseven-ai.vercel.app → AI Pulse 页面
# 确认新闻日期为当天
```

## 技术栈

- **前端**: Vanilla JS SPA + CSS
- **数据**: JSON 文件 (零后端)
- **抓取**: Node.js (rss-parser + 原生 fetch)
- **AI增强**: Anthropic Claude API (可选)
- **CI/CD**: GitHub Actions + Vercel
- **部署**: Vercel 静态托管
