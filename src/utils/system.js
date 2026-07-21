/**
 * 系统信息 / 响应式断点
 * 优先用新 API（getWindowInfo / getDeviceInfo），避免 getSystemInfoSync 弃用告警
 */

/** @typedef {'compact' | 'regular' | 'wide' | 'tablet'} LayoutTier */

const BP = {
  compact: 375,
  wide: 414,
  tablet: 768,
}

/** @type {Record<string, any> | null} */
let cachedInfo = null

/** @type {LayoutTier} */
let cachedTier = 'regular'

function safeCall(fn) {
  try {
    if (typeof fn === 'function') return fn()
  } catch (_) {
    /* ignore */
  }
  return null
}

function readWindowInfo() {
  const win = safeCall(uni.getWindowInfo)
  if (win) return win
  return safeCall(uni.getSystemInfoSync) || {}
}

function readDeviceInfo() {
  const device = safeCall(uni.getDeviceInfo)
  if (device) return device
  const legacy = safeCall(uni.getSystemInfoSync)
  return legacy || {}
}

export function initSystemInfo() {
  try {
    const win = readWindowInfo()
    const device = readDeviceInfo()
    cachedInfo = {
      windowWidth: win.windowWidth || 375,
      windowHeight: win.windowHeight || 667,
      statusBarHeight: win.statusBarHeight || 20,
      safeAreaInsets: win.safeAreaInsets || { top: 0, bottom: 0, left: 0, right: 0 },
      pixelRatio: win.pixelRatio || 2,
      platform: device.platform || '',
    }
    cachedTier = resolveTier(cachedInfo.windowWidth)
  } catch (e) {
    cachedInfo = null
    cachedTier = 'regular'
  }
  return getSystemSnapshot()
}

/**
 * @param {number} widthPx
 * @returns {LayoutTier}
 */
export function resolveTier(widthPx) {
  if (widthPx >= BP.tablet) return 'tablet'
  if (widthPx >= BP.wide) return 'wide'
  if (widthPx <= BP.compact) return 'compact'
  return 'regular'
}

export function getSystemSnapshot() {
  if (!cachedInfo) {
    initSystemInfo()
  }
  const info = cachedInfo || {}
  return {
    windowWidth: info.windowWidth || 375,
    windowHeight: info.windowHeight || 667,
    statusBarHeight: info.statusBarHeight || 20,
    safeAreaInsets: info.safeAreaInsets || { top: 0, bottom: 0, left: 0, right: 0 },
    pixelRatio: info.pixelRatio || 2,
    platform: info.platform || '',
    tier: cachedTier,
  }
}

/** 供页面根节点绑定的响应式 class */
export function getLayoutFlags() {
  const { tier } = getSystemSnapshot()
  return {
    'is-compact': tier === 'compact',
    'is-wide': tier === 'wide' || tier === 'tablet',
    'is-tablet': tier === 'tablet',
  }
}

/** px → rpx（基于当前屏宽，750 设计宽） */
export function pxToRpx(px) {
  const { windowWidth } = getSystemSnapshot()
  return (750 / windowWidth) * px
}

export function rpxToPx(rpx) {
  const { windowWidth } = getSystemSnapshot()
  return (windowWidth / 750) * rpx
}
