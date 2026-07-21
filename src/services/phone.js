/**
 * 电话能力封装 — 页面/组件只调此层，不直接散落 uni.makePhoneCall
 */

/**
 * @param {string} phoneNumber 纯数字，如 18903073765
 */
export function callPhone(phoneNumber) {
  const normalized = String(phoneNumber || '').replace(/\s+/g, '')
  if (!normalized) {
    uni.showToast({ title: '号码无效', icon: 'none' })
    return
  }
  uni.makePhoneCall({
    phoneNumber: normalized,
    fail: () => {
      uni.showToast({ title: '无法拨号', icon: 'none' })
    },
  })
}

/**
 * @param {string} phoneNumber
 */
export function copyPhone(phoneNumber) {
  const normalized = String(phoneNumber || '').replace(/\s+/g, '')
  uni.setClipboardData({
    data: normalized,
    success: () => {
      uni.showToast({ title: '已复制号码', icon: 'success' })
    },
  })
}
