/**
 * 项目级常量（构建 / 品牌相关）
 * 业务文案放在 src/data，不要堆在这里
 */

export const APP_TITLE = 'écho 有求必应'
export const APP_DESC = '有求必应品牌策划 — 微信小程序'

/** 功能开关 */
export const SWITCH = {
  WX_SHARE: true,
  /**
   * 是否使用江城圆体。
   * - H5：Zeoseven FontsAPI CSS（官方嵌入方式）
   * - 微信小程序：downloadFile(整档 woff2 CDN) → loadFontFace(临时路径)
   *   （不能用 Zeoseven CSS 分包；见 docs/字体CDN策略.md）
   */
  USE_BRAND_FONT: true,
}

/**
 * 小程序品牌字体
 * 整档文件与官网 public/fonts 同源；经 jsDelivr 提供 HTTPS + CORS。
 */
export const BRAND_FONT = {
  family: 'JiangChengYuanTi',
  /** 先正文/标题，再其余 */
  weights: ['400', '500', '300', '600', '700'],
  cdnBase:
    'https://cdn.jsdelivr.net/gh/realmasterliu-dot/echowebsite@main/public/fonts',
  /** 微信公众平台 → downloadFile 合法域名（不含协议） */
  downloadFileHost: 'cdn.jsdelivr.net',
}
