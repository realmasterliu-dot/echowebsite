# 静态字体

## 策略

| 项 | 决策 |
|----|------|
| 字体 | 江城圆体 `JiangChengRound`（与 H5 一致） |
| 嵌入字重 | **300 / 400 / 500 / 600 / 700**（全五档） |
| H5 | `fonts.scss` 本地 `@font-face` → woff2 |
| 微信小程序 | **方案 C**：`uni.loadFontFace` + **base64 Data URL**（无需 CDN） |
| 回退 | PingFang SC / 微软雅黑 等系统字体 |
| 体积 | woff2 合计约 690KB；base64 JS ≈ 923KB。mp 构建会 **剔除 woff2**（只留 base64），主包约 1.6MB |

## 文件

- `jiangcheng-{300,400,500,600,700}.woff2` — 源文件
- `jiangcheng-base64.js` — **自动生成**，供小程序 `loadFontFace` 使用

重新生成 base64：

```bash
npm run fonts:encode
```

加载逻辑：`src/services/fonts.js`，在 `App.vue` `onLaunch` 调用（受 `config.js` → `SWITCH.USE_BRAND_FONT` 控制）。

Token 映射（`variables.scss`）：`$fw-light` 300 · `$fw-regular` 400 · `$fw-medium` 500 · `$fw-semibold` 600 · `$fw-bold` 700。

## 注意

- 基础库建议 **≥ 3.7.9**
- 五档全开后主包会明显变大；超限时可关 `USE_BRAND_FONT` 或只 encode 部分字重
- 工具里偶发 Failed to load font 可忽略，以真机为准
