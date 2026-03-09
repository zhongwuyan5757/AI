#!/bin/bash
# setup-cron.sh — 一键设置自动抓取定时任务
#
# Usage:
#   bash scripts/setup-cron.sh           # 安装定时任务（每天8:00和20:00运行）
#   bash scripts/setup-cron.sh --remove  # 移除定时任务
#   bash scripts/setup-cron.sh --status  # 查看当前状态

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CRON_TAG="# fiveseven-ai-auto-fetch"
NODE_PATH="$(which node)"
SCRIPT_PATH="${PROJECT_DIR}/scripts/run_all.js"
LOG_PATH="${PROJECT_DIR}/logs/cron.log"

# 确保 logs 目录存在
mkdir -p "${PROJECT_DIR}/logs"

show_status() {
  echo "📋 FiveSeven AI — 定时任务状态"
  echo "================================"
  if crontab -l 2>/dev/null | grep -q "$CRON_TAG"; then
    echo "✅ 定时任务已安装"
    echo ""
    echo "当前计划："
    crontab -l 2>/dev/null | grep "$CRON_TAG" -A1 | grep -v "^#"
    echo ""
    echo "📂 项目路径: ${PROJECT_DIR}"
    echo "📝 日志路径: ${LOG_PATH}"
    if [ -f "$LOG_PATH" ]; then
      echo ""
      echo "最近运行日志（最后10行）："
      tail -10 "$LOG_PATH"
    fi
  else
    echo "❌ 定时任务未安装"
    echo ""
    echo "运行以下命令安装："
    echo "  bash scripts/setup-cron.sh"
  fi
}

install_cron() {
  echo "🚀 安装 FiveSeven AI 自动抓取定时任务..."
  echo ""

  # 先移除旧的（如果存在）
  remove_cron_silent

  # 构建 crontab 内容
  CRON_ENTRY="0 8,20 * * * cd ${PROJECT_DIR} && ${NODE_PATH} ${SCRIPT_PATH} >> ${LOG_PATH} 2>&1 ${CRON_TAG}"

  # 追加到 crontab
  (crontab -l 2>/dev/null; echo ""; echo "$CRON_ENTRY") | crontab -

  echo "✅ 定时任务安装成功！"
  echo ""
  echo "⏰ 运行计划: 每天 08:00 和 20:00 自动执行"
  echo "📂 项目路径: ${PROJECT_DIR}"
  echo "📝 日志路径: ${LOG_PATH}"
  echo ""
  echo "📌 常用命令："
  echo "  查看状态:  bash scripts/setup-cron.sh --status"
  echo "  手动运行:  npm run fetch:all"
  echo "  查看日志:  tail -f logs/cron.log"
  echo "  移除任务:  bash scripts/setup-cron.sh --remove"
}

remove_cron_silent() {
  crontab -l 2>/dev/null | grep -v "$CRON_TAG" | crontab - 2>/dev/null
}

remove_cron() {
  echo "🗑️  移除 FiveSeven AI 定时任务..."
  if crontab -l 2>/dev/null | grep -q "$CRON_TAG"; then
    remove_cron_silent
    echo "✅ 定时任务已移除"
  else
    echo "ℹ️  没有发现已安装的定时任务"
  fi
}

# 主逻辑
case "${1}" in
  --remove|--uninstall)
    remove_cron
    ;;
  --status)
    show_status
    ;;
  *)
    install_cron
    ;;
esac
