/**
 * 路由跳转封装 — Tab 页用 switchTab，非 Tab 用 navigateTo
 */

const TAB_PATHS = new Set([
  '/pages/home/index',
  '/pages/about/index',
  '/pages/pricing/index',
  '/pages/contact/index',
])

function normalizePath(url) {
  if (!url) return ''
  return url.startsWith('/') ? url : `/${url}`
}

/**
 * @param {string} url 如 /pages/contact/index
 */
export function goTab(url) {
  const path = normalizePath(url)
  return uni.switchTab({ url: path })
}

/**
 * @param {string} url
 */
export function goPage(url) {
  const path = normalizePath(url)
  if (TAB_PATHS.has(path.split('?')[0])) {
    return goTab(path)
  }
  return uni.navigateTo({ url: path })
}

export function goBack(delta = 1) {
  return uni.navigateBack({ delta })
}
