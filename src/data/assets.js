/**
 * 静态资源路径常量 — 页面/组件统一引用，避免散落硬编码
 * 对应 src/assets 下文件（构建后位于小程序包 /assets/）
 *
 * 品牌字体已改走 Zeoseven CDN（见 styles/fonts.scss），不再引用本地 woff2 路径。
 */

export const images = {
  logoHorizontal: '/assets/images/logo-horizontal.png',
  mockupIntro: '/assets/images/mockup-intro.jpg',
}
