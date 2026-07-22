<script setup>
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { initSystemInfo } from '@/utils/system'
import { SWITCH } from '../config.js'
// #ifdef MP-WEIXIN
import { loadBrandFonts } from '@/services/fonts.js'
// 兼容开发者工具偶发查找 services/font.js（单数）
import '@/services/font.js'
// #endif

onLaunch(() => {
  initSystemInfo()
  // #ifdef MP-WEIXIN
  if (SWITCH.USE_BRAND_FONT) {
    loadBrandFonts()
  }
  // #endif
})

onShow(() => {
  // 从后台回前台时可按需刷新系统信息（旋转 / 分屏）
})
</script>

<style lang="scss">
/* 品牌字体须先于 reset；H5 用 Zeoseven，小程序用 loadFontFace（勿把远程 CSS 打进 wxss） */
/* #ifdef H5 */
@import '@/styles/fonts-h5.scss';
/* #endif */
@import '@/styles/fonts.scss';
@import '@/styles/reset.scss';
@import '@/styles/responsive.scss';
@import '@/styles/animations.scss';
</style>
