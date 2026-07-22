/**
 * 首页开场层会话记忆
 * 当次小程序进程内关闭后不再出现；杀进程 / 重新编译进入会再播
 */
let dismissedThisLaunch = false

export function hasHeroIntroBeenDismissed() {
  return dismissedThisLaunch
}

export function markHeroIntroDismissed() {
  dismissedThisLaunch = true
}
