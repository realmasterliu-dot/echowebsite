/**
 * 图标 key → 本地静态资源
 * 约定：PNG 放到 `src/assets/icons/content/{iconKey}.png`
 * 资源未就绪时 resolveIcon 返回空字符串，UI 可回退为文字/色块
 */

const ICON_DIR = '/assets/icons/content'

/** @type {Record<string, string>} */
export const iconMap = {
  // services
  'object-ungroup': `${ICON_DIR}/object-ungroup.png`,
  'photo-film': `${ICON_DIR}/photo-film.png`,
  user: `${ICON_DIR}/user.png`,
  'users-between-lines': `${ICON_DIR}/users-between-lines.png`,
  'wand-magic-sparkles': `${ICON_DIR}/wand-magic-sparkles.png`,
  compass: `${ICON_DIR}/compass.png`,
  'square-rss': `${ICON_DIR}/square-rss.png`,
  message: `${ICON_DIR}/message.png`,
  // why / values
  donate: `${ICON_DIR}/donate.png`,
  redo: `${ICON_DIR}/redo.png`,
  'arrow-up-wide-short': `${ICON_DIR}/arrow-up-wide-short.png`,
  'broadcast-tower': `${ICON_DIR}/broadcast-tower.png`,
  cubes: `${ICON_DIR}/cubes.png`,
  heart: `${ICON_DIR}/heart.png`,
  'arrow-trend-up': `${ICON_DIR}/arrow-trend-up.png`,
  'dollar-sign': `${ICON_DIR}/dollar-sign.png`,
  handshake: `${ICON_DIR}/handshake.png`,
  bolt: `${ICON_DIR}/bolt.png`,
  bed: `${ICON_DIR}/bed.png`,
  'list-check': `${ICON_DIR}/list-check.png`,
  // process
  clipboard: `${ICON_DIR}/clipboard.png`,
  'magnifying-glass-chart': `${ICON_DIR}/magnifying-glass-chart.png`,
  'network-wired': `${ICON_DIR}/network-wired.png`,
  clapperboard: `${ICON_DIR}/clapperboard.png`,
  'share-nodes': `${ICON_DIR}/share-nodes.png`,
  'chart-bar': `${ICON_DIR}/chart-bar.png`,
  // contact
  phone: `${ICON_DIR}/phone.png`,
  'paper-plane': `${ICON_DIR}/paper-plane.png`,
  'paper-plane-white': `${ICON_DIR}/paper-plane-white.png`,
}

/**
 * @param {string} [iconKey]
 * @returns {string}
 */
export function resolveIcon(iconKey) {
  if (!iconKey) return ''
  return iconMap[iconKey] || `${ICON_DIR}/${iconKey}.png`
}
