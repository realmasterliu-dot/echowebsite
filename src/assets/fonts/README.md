# 品牌字体（江城圆体）

完整策略：**[docs/字体CDN策略.md](../../docs/字体CDN策略.md)**

| 端 | 方式 |
|----|------|
| H5 | **Zeoseven** `@import`（`fonts-h5.scss`） |
| 小程序 | `downloadFile`(整档 CDN) → `loadFontFace`(临时路径)；**不用** Zeoseven CSS 分包 |
| 域名 | downloadFile：`cdn.jsdelivr.net` |
| 开关 | `SWITCH.USE_BRAND_FONT` |
