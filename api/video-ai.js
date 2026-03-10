/**
 * Vercel Serverless Function — 视频 AI 处理
 * POST /api/video-ai
 *
 * 接收：{ transcript, taskType, videoTitle? }
 * taskType: 'simplify' | 'extract' | 'translate'
 * 返回：{ success, result, taskType }
 */

const TASK_PROMPTS = {
  simplify: `你是一个视频内容精简专家。请将以下视频字幕/文字稿精简为 3~6 条核心摘要。
要求：
- 每条摘要用一句话概括一个关键信息
- 使用中文输出
- 去除冗余、口语化内容，只保留核心信息
- 用 "•" 作为列表符号
- 如果视频有明确的步骤或流程，按顺序列出

请直接输出摘要列表，不要加额外说明。`,

  extract: `你是一个知识提炼专家。请从以下视频字幕/文字稿中提炼结构化知识。
请按以下格式输出（使用中文）：

## 核心观点
用 2~3 句话总结视频的核心论点或主题

## 关键方法
列出视频中提到的具体方法、技巧或步骤（用 "•" 列表）

## 适用场景
说明这些知识适用于什么情况（用 "•" 列表）

## 行动建议
给出 2~3 条可以立即执行的建议（用 "•" 列表）

请保持专业但易读，避免学术化表述。`,

  translate: `你是一个专业的视频内容翻译专家，擅长英译中。请将以下视频字幕/文字稿翻译成自然、专业、可读的中文。
要求：
- 保持原文的逻辑结构和段落划分
- 专业术语要准确，必要时在括号内保留英文原文
- 翻译要流畅自然，避免生硬的机翻感
- 适当分段，每段不超过 3~4 句话
- 如果原文已经是中文，请润色并优化表达

请直接输出翻译结果，不要加额外说明。`
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '仅支持 POST 请求' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: '服务端未配置 ANTHROPIC_API_KEY，请联系管理员'
    });
  }

  const { transcript, taskType, videoTitle } = req.body || {};

  if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: '请提供有效的视频文字稿（至少 10 个字符）'
    });
  }

  if (!TASK_PROMPTS[taskType]) {
    return res.status(400).json({
      success: false,
      error: `无效的任务类型。支持：${Object.keys(TASK_PROMPTS).join(', ')}`
    });
  }

  const systemPrompt = TASK_PROMPTS[taskType];
  const titleContext = videoTitle ? `\n\n视频标题：${videoTitle}` : '';
  const userMessage = `${titleContext}\n\n以下是视频文字稿：\n\n${transcript.slice(0, 15000)}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[video-ai] Anthropic API error:', response.status, errBody);
      return res.status(502).json({
        success: false,
        error: 'AI 服务暂时不可用，请稍后重试'
      });
    }

    const data = await response.json();
    const resultText = data.content?.[0]?.text || '';

    return res.status(200).json({
      success: true,
      result: resultText,
      taskType
    });

  } catch (err) {
    console.error('[video-ai] Request failed:', err);
    return res.status(500).json({
      success: false,
      error: '处理请求时出错，请稍后重试'
    });
  }
}
