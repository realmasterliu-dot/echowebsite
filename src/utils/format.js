/** 纯格式化工具，无 UI / 无 uni API */

export function formatPrice(value, options = {}) {
  const { prefix = '¥', fallback = '--' } = options
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback
  }
  const num = Number(value)
  return `${prefix}${num.toLocaleString('zh-CN')}`
}

export function splitLines(text = '') {
  return String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
