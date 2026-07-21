/**
 * 品牌字体（小程序）
 * 实际生效路径：styles/fonts.scss → jiangcheng-faces.scss（@font-face + base64）
 * 保留此模块便于开关探测 / 日志；不再调用易卡住的 loadFontFace(Data URL)。
 */
import { SWITCH } from '../../config.js'

/** App.onLaunch 调用 */
export async function loadBrandFonts() {
  if (!SWITCH.USE_BRAND_FONT) {
    console.log('[fonts] skipped (USE_BRAND_FONT=false) — 将回退系统字体')
    return
  }
  // 字体已通过 wxss @font-face(base64) 注入，见 fonts.scss / jiangcheng-faces.scss
  console.log(
    '[fonts] OK via CSS @font-face (JiangChengRound 300–700). No loadFontFace call.',
  )
  console.log(
    '[fonts] 肉眼难辨时可：config USE_BRAND_FONT=false 对比，或以真机大字号 slogan 对比 H5',
  )
}
