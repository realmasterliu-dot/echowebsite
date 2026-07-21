/**
 * Enter-viewport once helper for WeChat mini program.
 * Page must declare onPageScroll so component hooks receive scroll events.
 */
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

/**
 * @param {object} options
 * @param {string} options.selector
 * @param {number} [options.triggerRatio=0.85]
 * @param {() => void} options.onEnter
 */
export function useInViewOnce({ selector, triggerRatio = 0.85, onEnter }) {
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
      observer = null
    }
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  function createObserver(proxy) {
    const scope = proxy?.$scope
    if (scope && typeof scope.createIntersectionObserver === 'function') {
      return scope.createIntersectionObserver({
        thresholds: [0, 0.01, 0.2],
        initialRatio: 0,
      })
    }
    return uni.createIntersectionObserver(proxy, {
      thresholds: [0, 0.01, 0.2],
      initialRatio: 0,
    })
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
          // Avoid permanent blank if node query keeps failing
          if (attempts >= 12) enter()
          return
        }

        const line = getWindowHeight() * triggerRatio
        if (rect.top < line && rect.bottom > 0) {
          enter()
        }
      })
      .exec()
  }

  function startObserver() {
    const proxy = instance?.proxy
    if (!proxy || entered.value) return

    try {
      observer = createObserver(proxy)
      const bottom = -Math.round(getWindowHeight() * (1 - triggerRatio))
      observer.relativeToViewport({ bottom }).observe(selector, (res) => {
        if (res.intersectionRatio > 0) enter()
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

      // Hard fallback: never leave content blank forever
      setTimeout(() => {
        if (!entered.value) enter()
      }, 8000)
    })
  })

  onUnmounted(() => {
    stopWatch()
  })

  return { entered, enter, checkByQuery }
}
