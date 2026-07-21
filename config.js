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
   * 是否使用江城圆体（300–700 五档）。
   * - H5：fonts.scss 本地 @font-face
   * - 微信小程序：App.onLaunch → loadFontFace + base64 Data URL（无需 CDN）
   * 关闭时仅用系统字体栈，可减小主包体积。
   */
  USE_BRAND_FONT: true,
}
