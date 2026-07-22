/**
 * Tab 动效重播：超过一段时间未访问该 Tab，再次进入时重挂载内容以重播入场
 */
const REPLAY_AFTER_MS = 15 * 60 * 1000

/** @type {Record<number, number>} tabIndex → 上次 onShow 时间戳 */
const lastVisitByTab = {}

/**
 * 在 Tab onShow 时调用。
 * @param {number} tabIndex 0–3
 * @returns {boolean} 是否应重播（递增内容 :key）
 */
export function consumeTabMotionReplay(tabIndex) {
  const now = Date.now()
  const last = lastVisitByTab[tabIndex]
  lastVisitByTab[tabIndex] = now
  if (last == null) return false
  return now - last >= REPLAY_AFTER_MS
}

export const MOTION_REPLAY_AFTER_MS = REPLAY_AFTER_MS
