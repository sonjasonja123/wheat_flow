const xss = require('xss');

const sanitizeText = value => {
  if (value === null || value === undefined) return value;
  const withoutExecutableBlocks = String(value).replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  return xss(withoutExecutableBlocks, { whiteList: {}, stripIgnoreTag: true }).trim();
};

module.exports = { sanitizeText };
