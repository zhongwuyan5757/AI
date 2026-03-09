/**
 * validator.js — 字段校验模块
 * 根据 schema 校验数据条目，确保必填字段完整
 */

// 各数据类型的必填字段 schema
const SCHEMAS = {
  news: {
    required: ['title', 'url', 'source', 'date', 'category'],
    optional: ['summary', 'tags', 'relatedJobs', 'hot'],
  },
  tool: {
    required: ['id', 'name', 'category', 'url', 'description', 'targetJobs'],
    optional: ['icon', 'pricing', 'difficulty', 'features', 'pros', 'cons', 'editorPick'],
  },
  model: {
    required: ['id', 'name', 'vendor', 'type', 'capabilities', 'desc'],
    optional: ['icon', 'contextWindow', 'pricing', 'speed', 'bestFor', 'featured'],
  },
};

/**
 * 校验单条数据
 * @param {object} item - 数据条目
 * @param {string} type - 'news' | 'tool' | 'model'
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validate(item, type) {
  const schema = SCHEMAS[type];
  if (!schema) return { valid: false, errors: [`未知类型: ${type}`] };

  const errors = [];
  for (const field of schema.required) {
    if (item[field] === undefined || item[field] === null || item[field] === '') {
      errors.push(`缺少必填字段: ${field}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 批量校验并过滤
 * @param {Array} items
 * @param {string} type
 * @param {Logger} logger
 * @returns {Array} 有效条目
 */
function validateBatch(items, type, logger) {
  const valid = [];
  for (const item of items) {
    const result = validate(item, type);
    if (result.valid) {
      valid.push(item);
    } else {
      logger.warn(`校验失败 [${item.title || item.name || 'unknown'}]: ${result.errors.join(', ')}`);
      logger.addSkipped();
    }
  }
  return valid;
}

/**
 * 质量评分（0-100）
 * 基于字段完整度和内容长度
 */
function qualityScore(item, type) {
  const schema = SCHEMAS[type];
  if (!schema) return 0;

  let score = 0;
  const allFields = [...schema.required, ...schema.optional];
  const totalFields = allFields.length;

  for (const field of allFields) {
    if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
      score += (1 / totalFields) * 100;
    }
  }

  // 描述/摘要长度加分
  const desc = item.description || item.summary || item.desc || '';
  if (desc.length > 50) score = Math.min(100, score + 5);
  if (desc.length > 100) score = Math.min(100, score + 5);

  return Math.round(score);
}

module.exports = { validate, validateBatch, qualityScore, SCHEMAS };
