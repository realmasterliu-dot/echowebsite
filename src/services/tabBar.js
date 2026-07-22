/**
 * 自定义悬浮 Dock：选中态 + 开场锁定显隐 + 滚动自动收起
 *
 * 滚动规则：
 * - 手指按住期间：只可收起，不可回显
 * - 松手后：上滑意图 / 停滑 / 近顶或近底 → 较慢回显
 * - 开场层锁定期间：强制隐藏
 */
import { getCurrentInstance } from 'vue'

/** 松手后回显等待 */
const IDLE_SHOW_MS = 720
/** 判定滑动方向的最小位移 */
const DIR_DELTA = 8

let lockedByIntro = false
let fingerDown = false
let lastScrollTop = 0
/** 松手后是否应回显（上滑过 / 近底 / 近顶） */
let pendingReveal = false
let idleTimer = null
let bottomCheckTimer = null
let collapsed = false

function getTabBarInstance() {
  try {
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    if (page && typeof page.getTabBar === 'function') {
      const tabBar = page.getTabBar()
      if (tabBar) return tabBar
    }
  } catch {
    // ignore
  }
  try {
    const proxy = getCurrentInstance()?.proxy
    return proxy?.$scope?.getTabBar?.() || null
  } catch {
    return null
  }
}

function patchTabBar(data) {
  const tabBar = getTabBarInstance()
  if (tabBar && typeof tabBar.setData === 'function') {
    tabBar.setData(data)
  }
}

function applyCollapsed(next) {
  if (lockedByIntro) {
    patchTabBar({ hidden: true, collapsed: true })
    return
  }
  // 按住时禁止回显
  if (!next && fingerDown) return
  collapsed = !!next
  patchTabBar({ hidden: false, collapsed })
}

/**
 * @param {number} index tabList 下标 0–3
 */
export function setTabBarSelected(index) {
  patchTabBar({ selected: index })
}

/**
 * 开场层：false 强制隐藏并锁定；true 解锁并显示
 * @param {boolean} visible
 */
export function setTabBarVisible(visible) {
  lockedByIntro = !visible
  if (lockedByIntro) {
    clearTimeout(idleTimer)
    clearTimeout(bottomCheckTimer)
    idleTimer = null
    bottomCheckTimer = null
    fingerDown = false
    pendingReveal = false
    collapsed = true
    patchTabBar({ hidden: true, collapsed: true })
    return
  }
  fingerDown = false
  pendingReveal = false
  collapsed = false
  lastScrollTop = 0
  patchTabBar({ hidden: false, collapsed: false })
}

function scheduleIdleShow() {
  if (lockedByIntro || fingerDown) return
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    if (lockedByIntro || fingerDown) return
    applyCollapsed(false)
    pendingReveal = false
  }, IDLE_SHOW_MS)
}

function isNearBottom(scrollTop, done) {
  clearTimeout(bottomCheckTimer)
  bottomCheckTimer = setTimeout(() => {
    try {
      const wh =
        (typeof uni.getWindowInfo === 'function'
          ? uni.getWindowInfo().windowHeight
          : uni.getSystemInfoSync().windowHeight) || 667

      uni
        .createSelectorQuery()
        .selectViewport()
        .scrollOffset((res) => {
          if (!res) {
            done(false)
            return
          }
          const top = typeof res.scrollTop === 'number' ? res.scrollTop : scrollTop
          const sh = res.scrollHeight || 0
          done(sh > 0 && top + wh >= sh - 48)
        })
        .exec()
    } catch {
      done(false)
    }
  }, 40)
}

/** PageShell：手指按下 */
export function onDockTouchStart() {
  if (lockedByIntro) return
  fingerDown = true
  pendingReveal = false
  clearTimeout(idleTimer)
  idleTimer = null
}

/** PageShell：手指抬起后再允许回显 */
export function onDockTouchEnd() {
  if (lockedByIntro) return
  fingerDown = false

  const nearTop = lastScrollTop <= 20
  if (nearTop || pendingReveal) {
    scheduleIdleShow()
    return
  }

  isNearBottom(lastScrollTop, (near) => {
    if (near) {
      pendingReveal = true
      scheduleIdleShow()
      return
    }
    // 停滑回显（松手后）
    scheduleIdleShow()
  })
}

/**
 * 各 Tab 页 onPageScroll 中调用
 * @param {{ scrollTop?: number }} e
 */
export function handleDockPageScroll(e) {
  if (lockedByIntro) return

  const scrollTop = Math.max(0, e?.scrollTop || 0)
  const delta = scrollTop - lastScrollTop

  if (scrollTop <= 20) {
    lastScrollTop = scrollTop
    pendingReveal = true
    // 顶部：仅松手后回显
    if (!fingerDown) applyCollapsed(false)
    return
  }

  if (delta > DIR_DELTA) {
    // 下滑：立刻收起，取消回显意图
    pendingReveal = false
    clearTimeout(idleTimer)
    applyCollapsed(true)
  } else if (delta < -DIR_DELTA) {
    // 上滑：记下回显意图，按住时不展开
    pendingReveal = true
    if (!fingerDown) applyCollapsed(false)
  }

  lastScrollTop = scrollTop

  // 按住时不因 idle / 底部检测回显
  if (fingerDown) return

  scheduleIdleShow()
  isNearBottom(scrollTop, (near) => {
    if (near && !lockedByIntro && !fingerDown) {
      pendingReveal = true
      applyCollapsed(false)
    }
  })
}

/**
 * 点击 Tab / 页面 onShow：回到顶部，恢复为该页初始浏览起点
 */
export function scrollTabPageToTop() {
  lastScrollTop = 0
  fingerDown = false
  pendingReveal = false
  clearTimeout(idleTimer)
  clearTimeout(bottomCheckTimer)
  idleTimer = null
  bottomCheckTimer = null
  try {
    uni.pageScrollTo({ scrollTop: 0, duration: 0 })
  } catch {
    // ignore
  }
  if (!lockedByIntro) {
    collapsed = false
    patchTabBar({ hidden: false, collapsed: false })
  }
}

/** 切页时重置滚动记忆，避免方向判断错乱 */
export function resetDockScrollState() {
  lastScrollTop = 0
  fingerDown = false
  pendingReveal = false
  clearTimeout(idleTimer)
  clearTimeout(bottomCheckTimer)
  idleTimer = null
  bottomCheckTimer = null
  if (!lockedByIntro) {
    collapsed = false
    patchTabBar({ hidden: false, collapsed: false })
  }
}

/**
 * Tab 页 onShow 通用：选中态 + 回顶 + Dock 重置
 * @param {number} index
 * @param {{ keepHidden?: boolean }} [opts] 首页开场中 keepHidden=true
 */
export function onTabPageShow(index, opts = {}) {
  setTabBarSelected(index)
  if (opts.keepHidden) {
    setTabBarVisible(false)
  } else {
    setTabBarVisible(true)
    scrollTabPageToTop()
  }
}
