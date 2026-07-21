# 静态字体

## 策略

| 项 | 决策 |
|----|------|
| 字体 | 江城圆体 `JiangChengRound` |
| 字重 | **300–700** 五档 |
| H5 | 本地 woff2 `@font-face` |
| 微信小程序 | `src/styles/generated/jiangcheng-faces.scss`（`@font-face` + base64） |
| 已弃用 | `loadFontFace` + 超大 Data URL（会卡住，只有 loading 无回调） |

```bash
npm run fonts:encode
```

生成 `styles/generated/jiangcheng-faces.scss`（由 `fonts.scss` 在 MP 下引入）。

## 如何确认

控制台应出现：`[fonts] OK via CSS @font-face ...`  
对比：临时注释该 import 后看 slogan 差异；以真机为准。
