/**
 * Enter-viewport once helper for WeChat mini program.
 * Page must declare onPageScroll so component hooks receive scroll events.
 *
 * 策略：元素真正进入视口（有足够可见高度）后再触发；超时兜底仅防永久空白。
 */
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

/**
 * @param {object} options
 * @param {string} options.selector
 * @param {number} [options.triggerRatio=0.88] 顶边越过「视口高度×ratio」才算进入（越小越晚、越靠近中上部）
 * @param {number} [options.minVisiblePx=56] 最少可见高度（px），避免只露 1px 就播
 * @param {number} [options.minIntersection=0.12] IntersectionObserver 最小相交比例
 * @param {number} [options.fallbackMs=20000] 超时强制触发（仅兜底，勿设过短）
 * @param {() => void} options.onEnter
 */
export function useInViewOnce({
  selector,
  triggerRatio = 0.88,
  minVisiblePx = 56,
  minIntersection = 0.12,
  fallbackMs = 20000,
  onEnter,
}) {
  const entered = ref(false)
  const instance = getCurrentInstance()
  let observer = null
  let checking = false
  let pollTimer = null
  let attempts = 0

  function getWindowHeight() {
    try {
      return uni.getWindowInfo().windowHeight || 667
    } catch {
      return 667
    }
  }

  function enter() {
    if (entered.value) return
    entered.value = true
    stopWatch()
    onEnter?.()
  }

  function stopWatch() {
    if (observer) {
      try {
        observer.disconnect()
      } catch {
        // ignore
      }
    }
    observer = null
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  /** 是否有足够「在视口内」的可见区域 */
  function isMeaningfullyInView(rect) {
    if (!rect || rect.height <= 0) return false
    const wh = getWindowHeight()
    const line = wh * triggerRatio
    // 顶边需越过触发线；底边需进入屏幕（留一点边距）
    if (!(rect.top < line && rect.bottom > wh * 0.1)) return false

    const visibleTop = Math.max(rect.top, 0)
    const visibleBottom = Math.min(rect.bottom, wh)
    const visibleH = visibleBottom - visibleTop
    const need = Math.min(minVisiblePx, Math.max(24, rect.height * 0.25))
    return visibleH >= need
  }

  function createObserver(proxy) {
    const scope = proxy?.$scope
    const opts = {
      thresholds: [0, 0.05, 0.12, 0.2, 0.35],
      initialRatio: 0,
    }
    if (scope && typeof scope.createIntersectionObserver === 'function') {
      return scope.createIntersectionObserver(opts)
    }
    return uni.createIntersectionObserver(proxy, opts)
  }

  function checkByQuery() {
    if (entered.value || checking) return
    const proxy = instance?.proxy
    if (!proxy) return

    checking = true
    attempts += 1

    uni
      .createSelectorQuery()
      .in(proxy)
      .select(selector)
      .boundingClientRect((rect) => {
        checking = false
        if (entered.value) return

        if (!rect) {
          // 查询长期失败才兜底（防永久空白）；次数提高，避免过早误触
          if (attempts >= 40) enter()
          return
        }

        if (isMeaningfullyInView(rect)) enter()
      })
      .exec()
  }

  function startObserver() {
    const proxy = instance?.proxy
    if (!proxy || entered.value) return

    try {
      observer = createObserver(proxy)
      // 略收缩底部检测带：与 triggerRatio 对齐，避免「刚露头」就回调
      const bottom = -Math.round(getWindowHeight() * (1 - triggerRatio))
      observer.relativeToViewport({ bottom }).observe(selector, (res) => {
        if ((res.intersectionRatio || 0) >= minIntersection) enter()
      })
    } catch {
      // fall back to query + poll
    }
  }

  onPageScroll(() => {
    checkByQuery()
  })

  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        startObserver()
        checkByQuery()
      }, 60)
      setTimeout(checkByQuery, 200)
      setTimeout(checkByQuery, 500)

      pollTimer = setInterval(() => {
        if (entered.value) {
          stopWatch()
          return
        }
        checkByQuery()
      }, 400)

      // 仅兜底：长时间未进视口才强制显示（默认 20s）
      setTimeout(() => {
        if (!entered.value) enter()
      }, Math.max(3000, fallbackMs))
    })
  })

  onUnmounted(() => {
    stopWatch()
  })

  return { entered, enter, checkByQuery }
}
