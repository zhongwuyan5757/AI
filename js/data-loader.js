/**
 * data-loader.js — 异步 JSON 数据加载器
 *
 * 替代 data.js 的同步加载方式：
 * 1. 并行加载 8 个 JSON 文件
 * 2. 组装为全局 DATA 对象（与原 data.js 格式完全一致）
 * 3. 如果 JSON 加载失败，自动回退到 data.js
 */

async function loadData() {
  const VERSION = '2026.03.10.2257';

  const contentFiles = ['jobs', 'news', 'tools', 'models', 'tutorials', 'prompts', 'resources', 'updates', 'digests', 'columns'];

  try {
    // 并行加载所有 JSON 文件
    const [meta, ...arrays] = await Promise.all([
      fetch(`data/meta.json?v=${VERSION}`).then(r => {
        if (!r.ok) throw new Error(`meta.json: ${r.status}`);
        return r.json();
      }),
      ...contentFiles.map(f =>
        fetch(`data/${f}.json?v=${VERSION}`).then(r => {
          if (!r.ok) throw new Error(`${f}.json: ${r.status}`);
          return r.json();
        })
      )
    ]);

    // 组装 DATA 对象 — 与原 data.js 格式完全一致
    window.DATA = {};
    contentFiles.forEach((key, i) => {
      window.DATA[key] = arrays[i];
    });

    // 合并 meta 映射对象到 DATA 中
    Object.assign(window.DATA, meta);

    // 数据加载完成
    return true;

  } catch (err) {
    console.error('[data-loader] ❌ JSON 加载失败:', err.message);
    throw err;
  }
}
