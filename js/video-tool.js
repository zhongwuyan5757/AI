/* ============================================
   FiveSeven AI — YouTube 视频学习工具
   独立模块：URL 解析、播放器、AI 面板
   ============================================ */

// ===== YouTube URL 解析 =====

function parseYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtube\.com\/watch\/)([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/v\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function isValidYouTubeUrl(url) {
  return parseYouTubeUrl(url) !== null;
}

// ===== 视频工具状态 =====

const _videoToolState = {
  currentVideoId: null,
  transcript: '',
  isTranscriptManual: false,
  aiLoading: false,
  lastTaskType: null,
  lastResult: '',
};

// ===== 渲染入口 =====

function renderVideoTool() {
  const container = document.querySelector('#videoToolContent');
  if (!container) return;

  container.innerHTML = `
    <div class="vt-page">
      ${_renderVtHeader()}
      <div class="vt-layout">
        <div class="vt-left">
          ${_renderVtUrlInput()}
          ${_renderVtPlayer()}
          ${_renderVtTranscript()}
        </div>
        <div class="vt-right">
          ${_renderVtAiPanel()}
          ${_renderVtResult()}
        </div>
      </div>
    </div>
  `;

  _setupVtEvents();
}

// ===== 页面头部 =====

function _renderVtHeader() {
  return `
    <div class="vt-header">
      <div class="vt-header-top">
        <span class="vt-badge"><i class="fa-solid fa-flask"></i> 学习工具</span>
      </div>
      <h1 class="vt-title">YouTube 视频学习助手</h1>
      <p class="vt-subtitle">粘贴任意 YouTube 链接，用 AI 帮你精简、提炼、翻译视频内容——把长视频变成可消化的知识</p>
      <div class="vt-feature-tags">
        <span class="vt-feature-tag"><i class="fa-solid fa-compress"></i> 快速精简</span>
        <span class="vt-feature-tag"><i class="fa-solid fa-gem"></i> 核心提炼</span>
        <span class="vt-feature-tag"><i class="fa-solid fa-language"></i> 智能翻译</span>
      </div>
    </div>
  `;
}

// ===== URL 输入区 =====

function _renderVtUrlInput() {
  return `
    <div class="vt-input-section">
      <label class="vt-label" for="vtUrlInput">
        <i class="fa-brands fa-youtube" style="color:#ff4444"></i> 粘贴 YouTube 链接
      </label>
      <div class="vt-input-row">
        <input
          type="url"
          id="vtUrlInput"
          class="vt-url-input"
          placeholder="https://www.youtube.com/watch?v=..."
          autocomplete="off"
          spellcheck="false"
        />
        <button id="vtLoadBtn" class="vt-load-btn" disabled>
          <i class="fa-solid fa-play"></i> 加载视频
        </button>
      </div>
      <div id="vtUrlHint" class="vt-url-hint"></div>
    </div>
  `;
}

// ===== 播放器区域 =====

function _renderVtPlayer() {
  const videoId = _videoToolState.currentVideoId;
  if (videoId) {
    return `
      <div class="vt-player-wrap">
        <div class="vt-player-container">
          <iframe
            id="vtPlayerIframe"
            src="https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1"
            title="YouTube 视频播放器"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    `;
  }

  return `
    <div class="vt-player-empty">
      <div class="vt-empty-icon">
        <i class="fa-brands fa-youtube"></i>
      </div>
      <div class="vt-empty-title">粘贴链接，开始学习</div>
      <div class="vt-empty-desc">支持标准 YouTube 链接、短链接、嵌入链接等多种格式</div>
      <div class="vt-empty-examples">
        <div class="vt-example">youtube.com/watch?v=xxxx</div>
        <div class="vt-example">youtu.be/xxxx</div>
        <div class="vt-example">youtube.com/shorts/xxxx</div>
      </div>
    </div>
  `;
}

// ===== 字幕输入区 =====

function _renderVtTranscript() {
  return `
    <div class="vt-transcript-section" id="vtTranscriptSection" style="display:${_videoToolState.currentVideoId ? 'block' : 'none'}">
      <div class="vt-transcript-header">
        <label class="vt-label" for="vtTranscriptInput">
          <i class="fa-solid fa-file-lines"></i> 视频文字稿
        </label>
        <span class="vt-transcript-hint">AI 分析需要视频文字稿。请粘贴字幕或文字稿内容</span>
      </div>
      <textarea
        id="vtTranscriptInput"
        class="vt-transcript-textarea"
        placeholder="粘贴视频的字幕或文字稿内容…&#10;&#10;获取方式：&#10;1. YouTube 视频下方 → 点击「...更多」→「显示转录稿」&#10;2. 使用浏览器插件获取字幕&#10;3. 手动记录视频关键内容"
        rows="6"
      >${escapeHtml(_videoToolState.transcript)}</textarea>
      <div class="vt-transcript-footer">
        <span class="vt-char-count" id="vtCharCount">0 字符</span>
        <button class="vt-clear-transcript" id="vtClearTranscript" style="display:none">
          <i class="fa-solid fa-xmark"></i> 清空
        </button>
      </div>
    </div>
  `;
}

// ===== AI 工具面板 =====

function _renderVtAiPanel() {
  const hasTranscript = _videoToolState.transcript.trim().length >= 10;
  const disabledClass = hasTranscript ? '' : 'disabled';
  const disabledAttr = hasTranscript ? '' : 'disabled';

  return `
    <div class="vt-ai-panel">
      <div class="vt-panel-header">
        <div class="vt-panel-title"><i class="fa-solid fa-wand-magic-sparkles"></i> AI 工具</div>
        <div class="vt-panel-desc">${hasTranscript ? '选择一个功能，AI 将为你处理视频内容' : '请先加载视频并粘贴文字稿'}</div>
      </div>
      <div class="vt-ai-buttons">
        <button class="vt-ai-btn vt-ai-simplify ${disabledClass}" data-task="simplify" ${disabledAttr}>
          <div class="vt-ai-btn-icon"><i class="fa-solid fa-compress"></i></div>
          <div class="vt-ai-btn-content">
            <div class="vt-ai-btn-title">精简</div>
            <div class="vt-ai-btn-desc">3~6 条核心摘要，一眼看懂</div>
          </div>
        </button>
        <button class="vt-ai-btn vt-ai-extract ${disabledClass}" data-task="extract" ${disabledAttr}>
          <div class="vt-ai-btn-icon"><i class="fa-solid fa-gem"></i></div>
          <div class="vt-ai-btn-content">
            <div class="vt-ai-btn-title">提炼</div>
            <div class="vt-ai-btn-desc">核心观点 + 方法 + 行动建议</div>
          </div>
        </button>
        <button class="vt-ai-btn vt-ai-translate ${disabledClass}" data-task="translate" ${disabledAttr}>
          <div class="vt-ai-btn-icon"><i class="fa-solid fa-language"></i></div>
          <div class="vt-ai-btn-content">
            <div class="vt-ai-btn-title">翻译</div>
            <div class="vt-ai-btn-desc">自然专业的中文翻译</div>
          </div>
        </button>
      </div>
    </div>
  `;
}

// ===== 结果区域 =====

function _renderVtResult() {
  if (_videoToolState.aiLoading) {
    return `
      <div class="vt-result-section">
        <div class="vt-result-loading">
          <div class="vt-loading-spinner"></div>
          <div class="vt-loading-text">AI 正在${_getTaskLabel(_videoToolState.lastTaskType)}中…</div>
          <div class="vt-loading-hint">通常需要 5~15 秒</div>
        </div>
      </div>
    `;
  }

  if (_videoToolState.lastResult) {
    const taskLabel = _getTaskLabel(_videoToolState.lastTaskType);
    return `
      <div class="vt-result-section">
        <div class="vt-result-header">
          <div class="vt-result-title">
            <i class="fa-solid fa-sparkles" style="color:var(--primary)"></i>
            ${taskLabel}结果
          </div>
          <div class="vt-result-actions">
            <button class="vt-result-action" id="vtCopyResult" title="复制结果">
              <i class="fa-regular fa-copy"></i> 复制
            </button>
            <button class="vt-result-action" id="vtRetryResult" title="重新生成">
              <i class="fa-solid fa-arrow-rotate-right"></i> 重新生成
            </button>
            <button class="vt-result-action" id="vtClearResult" title="清空结果">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        <div class="vt-result-body" id="vtResultBody">
          ${_renderMarkdownLite(_videoToolState.lastResult)}
        </div>
      </div>
    `;
  }

  if (!_videoToolState.currentVideoId) {
    return `
      <div class="vt-result-section">
        <div class="vt-result-empty">
          <div class="vt-result-empty-icon"><i class="fa-solid fa-lightbulb"></i></div>
          <div class="vt-result-empty-title">用 AI 看懂任何视频</div>
          <div class="vt-result-empty-desc">
            适合学习教程、行业研究、工具评测、技术分享等各类 YouTube 视频。
            <br>英文视频也能轻松翻译成专业中文。
          </div>
          <div class="vt-tips">
            <div class="vt-tip"><span class="vt-tip-num">1</span> 粘贴 YouTube 链接</div>
            <div class="vt-tip"><span class="vt-tip-num">2</span> 添加视频文字稿</div>
            <div class="vt-tip"><span class="vt-tip-num">3</span> 选择 AI 功能</div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="vt-result-section">
      <div class="vt-result-empty">
        <div class="vt-result-empty-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
        <div class="vt-result-empty-title">视频已加载</div>
        <div class="vt-result-empty-desc">粘贴文字稿后，点击上方 AI 工具按钮开始分析</div>
      </div>
    </div>
  `;
}

// ===== 简易 Markdown 渲染 =====

function _renderMarkdownLite(text) {
  if (!text) return '';
  let html = escapeHtml(text);

  // ## 标题
  html = html.replace(/^## (.+)$/gm, '<h3 class="vt-md-h3">$1</h3>');
  // **加粗**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // • 列表项
  html = html.replace(/^[•·\-\*] (.+)$/gm, '<li class="vt-md-li">$1</li>');
  // 数字列表
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="vt-md-li vt-md-ol">$1</li>');
  // 换行
  html = html.replace(/\n\n/g, '</p><p class="vt-md-p">');
  html = html.replace(/\n/g, '<br>');
  // 包裹 li
  html = html.replace(/(<li class="vt-md-li[^"]*">.*?<\/li>)(?:\s*<br>)?/g, '$1');

  return `<div class="vt-md-content"><p class="vt-md-p">${html}</p></div>`;
}

// ===== 辅助函数 =====

function _getTaskLabel(taskType) {
  const labels = { simplify: '精简', extract: '提炼', translate: '翻译' };
  return labels[taskType] || '处理';
}

// ===== 事件绑定 =====

function _setupVtEvents() {
  const urlInput = document.querySelector('#vtUrlInput');
  const loadBtn = document.querySelector('#vtLoadBtn');
  const urlHint = document.querySelector('#vtUrlHint');
  const transcriptInput = document.querySelector('#vtTranscriptInput');
  const charCount = document.querySelector('#vtCharCount');
  const clearTranscript = document.querySelector('#vtClearTranscript');

  if (!urlInput || !loadBtn) return;

  // URL 输入实时验证
  urlInput.addEventListener('input', function() {
    const val = this.value.trim();
    if (!val) {
      loadBtn.disabled = true;
      urlHint.textContent = '';
      urlHint.className = 'vt-url-hint';
      return;
    }
    if (isValidYouTubeUrl(val)) {
      loadBtn.disabled = false;
      urlHint.textContent = '链接格式正确，点击加载视频';
      urlHint.className = 'vt-url-hint vt-hint-success';
    } else {
      loadBtn.disabled = true;
      urlHint.textContent = '请输入有效的 YouTube 链接';
      urlHint.className = 'vt-url-hint vt-hint-error';
    }
  });

  // 粘贴时自动加载
  urlInput.addEventListener('paste', function() {
    setTimeout(() => {
      const val = this.value.trim();
      if (isValidYouTubeUrl(val)) {
        _loadVideo(val);
      }
    }, 50);
  });

  // 回车加载
  urlInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && isValidYouTubeUrl(this.value.trim())) {
      _loadVideo(this.value.trim());
    }
  });

  // 加载按钮
  loadBtn.addEventListener('click', function() {
    const val = urlInput.value.trim();
    if (isValidYouTubeUrl(val)) {
      _loadVideo(val);
    }
  });

  // 字幕输入
  if (transcriptInput) {
    transcriptInput.addEventListener('input', function() {
      _videoToolState.transcript = this.value;
      _videoToolState.isTranscriptManual = true;
      const len = this.value.length;
      if (charCount) charCount.textContent = `${len} 字符`;
      if (clearTranscript) clearTranscript.style.display = len > 0 ? 'inline-flex' : 'none';
      _updateAiButtonStates();
    });
  }

  if (clearTranscript) {
    clearTranscript.addEventListener('click', function() {
      if (transcriptInput) {
        transcriptInput.value = '';
        _videoToolState.transcript = '';
        if (charCount) charCount.textContent = '0 字符';
        this.style.display = 'none';
        _updateAiButtonStates();
      }
    });
  }

  // AI 按钮点击（事件委托）
  const panel = document.querySelector('.vt-ai-buttons');
  if (panel) {
    panel.addEventListener('click', function(e) {
      const btn = e.target.closest('.vt-ai-btn');
      if (!btn || btn.disabled || btn.classList.contains('disabled')) return;
      const taskType = btn.dataset.task;
      if (taskType) _runAiTask(taskType);
    });
  }

  // 结果区按钮（事件委托）
  const resultSection = document.querySelector('.vt-result-section');
  if (resultSection) {
    resultSection.addEventListener('click', function(e) {
      if (e.target.closest('#vtCopyResult')) {
        copyToClipboard(_videoToolState.lastResult);
        showToast('已复制到剪贴板');
      }
      if (e.target.closest('#vtRetryResult') && _videoToolState.lastTaskType) {
        _runAiTask(_videoToolState.lastTaskType);
      }
      if (e.target.closest('#vtClearResult')) {
        _videoToolState.lastResult = '';
        _videoToolState.lastTaskType = null;
        _refreshVtResult();
      }
    });
  }
}

// ===== 加载视频 =====

function _loadVideo(url) {
  const videoId = parseYouTubeUrl(url);
  if (!videoId) return;

  _videoToolState.currentVideoId = videoId;
  _videoToolState.lastResult = '';
  _videoToolState.lastTaskType = null;

  trackEvent('video_tool_load', { videoId });

  // 重新渲染
  renderVideoTool();

  showToast('视频加载成功');
}

// ===== 更新 AI 按钮状态 =====

function _updateAiButtonStates() {
  const hasTranscript = _videoToolState.transcript.trim().length >= 10;
  document.querySelectorAll('.vt-ai-btn').forEach(btn => {
    if (hasTranscript) {
      btn.classList.remove('disabled');
      btn.disabled = false;
    } else {
      btn.classList.add('disabled');
      btn.disabled = true;
    }
  });
  // 更新面板描述
  const desc = document.querySelector('.vt-panel-desc');
  if (desc) {
    desc.textContent = hasTranscript
      ? '选择一个功能，AI 将为你处理视频内容'
      : '请先加载视频并粘贴文字稿';
  }
}

// ===== 刷新结果区 =====

function _refreshVtResult() {
  const right = document.querySelector('.vt-right');
  if (!right) return;
  // 保留 AI 面板，只刷新结果
  const oldResult = right.querySelector('.vt-result-section');
  if (oldResult) {
    const newHtml = _renderVtResult();
    const temp = document.createElement('div');
    temp.innerHTML = newHtml;
    oldResult.replaceWith(temp.firstElementChild);
    // 重新绑定结果区事件
    const newResult = document.querySelector('.vt-result-section');
    if (newResult) {
      newResult.addEventListener('click', function(e) {
        if (e.target.closest('#vtCopyResult')) {
          copyToClipboard(_videoToolState.lastResult);
          showToast('已复制到剪贴板');
        }
        if (e.target.closest('#vtRetryResult') && _videoToolState.lastTaskType) {
          _runAiTask(_videoToolState.lastTaskType);
        }
        if (e.target.closest('#vtClearResult')) {
          _videoToolState.lastResult = '';
          _videoToolState.lastTaskType = null;
          _refreshVtResult();
        }
      });
    }
  }
}

// ===== 执行 AI 任务 =====

async function _runAiTask(taskType) {
  const transcript = _videoToolState.transcript.trim();
  if (transcript.length < 10) {
    showToast('请先粘贴视频文字稿（至少 10 个字符）', 'error');
    return;
  }

  _videoToolState.aiLoading = true;
  _videoToolState.lastTaskType = taskType;
  _refreshVtResult();

  trackEvent('video_tool_ai', { taskType, videoId: _videoToolState.currentVideoId });

  try {
    const response = await fetch('/api/video-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript,
        taskType,
        videoTitle: ''
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || '请求失败');
    }

    _videoToolState.lastResult = data.result;

  } catch (err) {
    console.error('[video-tool] AI task failed:', err);
    _videoToolState.lastResult = '';

    // 友好错误提示
    const errorMsg = err.message || '请求失败';
    if (errorMsg.includes('ANTHROPIC_API_KEY') || errorMsg.includes('未配置')) {
      showToast('AI 服务未配置，请联系管理员设置 API Key', 'error');
    } else {
      showToast(`AI 处理失败：${errorMsg}`, 'error');
    }
  } finally {
    _videoToolState.aiLoading = false;
    _refreshVtResult();
  }
}
