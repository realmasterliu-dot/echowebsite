# 品牌字体加载策略（江城圆体）

> 更新日期：2026-07-22  
> 适用范围：`echowebsite-wechat`（uni-app · H5 / 微信小程序）  
> 质量目标：字体真正生效；无渲染层 `ERR_CACHE_MISS`；主包（不含插件）**&lt; 1.5MB**

---

## 1. 现行定案

| 端 | 做法 |
| ---- | ---- |
| **H5** | **Zeoseven 官方嵌入**：`fonts-h5.scss` `@import` 其 CSS（unicode-range 分包） |
| **微信小程序** | **不能**用 Zeoseven 那套 CSS 嵌入；改为 `downloadFile(整档 woff2)` → `loadFontFace(临时本地路径)` |

字体族：`JiangChengYuanTi`。开关：`SWITCH.USE_BRAND_FONT`。

整档文件 CDN（与官网 `public/fonts/jiangcheng-*.woff2` 同源）：

```text
https://cdn.jsdelivr.net/gh/realmasterliu-dot/echowebsite@main/public/fonts/jiangcheng-{300|400|500|600|700}.woff2
```

downloadFile 合法域名：`cdn.jsdelivr.net`  
（开发者工具可临时勾选「不校验合法域名」。）

---

## 2. 为什么「不考虑 Zeoseven 嵌入」——其实 H5 在用，MP 用不了同一套

Zeoseven 页面上的「常规 CSS / HTML 强化」本质是：

```css
@import url("https://fontsapi.zeoseven.com/59/main/result.css");
font-family: "JiangChengYuanTi";
```

CSS 里是 **上百个** 带 `unicode-range` 的小 woff2。这对**浏览器**很好；对小程序不行：

| 能力 | 浏览器 / H5 | 微信小程序 |
| ---- | ---- | ---- |
| 远程 `@import` CSS + unicode-range | ✅ | ❌ wxss 不可靠；易把分包打进 `app.wxss` |
| 渲染层请求 `https://…woff2` | ✅ | ❌ 常 `ERR_CACHE_MISS` / Failed to load font |
| `loadFontFace` + unicode-range 多文件同 family | ✅（CSS） | ❌ API **不支持** unicode-range，后加载会覆盖 |

所以：

- **H5 → 继续用 Zeoseven**（`fonts-h5.scss`），完全按官网推荐。  
- **小程序 → 必须用「整档」字体文件**（本站已有子集化 woff2），不能用 Zeoseven 的 result.css 分包产品。

若坚持「域名也走 Zeoseven」：对方 FontsAPI **不提供**单文件整档 URL，无法直接替换 jsDelivr 链接。

---

## 3. 小程序现行链路（如何既生效又过包体）

```text
App.onLaunch
  → uni.downloadFile(CDN 上的 jiangcheng-400.woff2 …)   ← 逻辑层下载
  → uni.loadFontFace({ source: 'url("wxfile://tmp/…")' }) ← 本地临时路径
```

要点：

1. **不要** `loadFontFace({ source: 'url("https://…")' })`  
   那会让**渲染层**去拉 HTTPS → 你看到的 `ERR_CACHE_MISS`。  
2. **先 downloadFile 再 loadFontFace(临时路径)**  
   下载走逻辑层；注入用本地文件，渲染层不再请求远程字体。  
3. **字体二进制不进主包**（vite strip `*.woff2`）  
   主包约回到 **&lt; 400KB 量级**（视业务而定），远低于 **1.5MB** 建议线。  
4. 曾试「包内 woff2 + readFile + Data URL」→ 控制台 `done 0/5`：  
   小程序对 `assets/` 下文件的 `readFile` 往往失败，故已弃用为主路径。

### 包体对比（量级）

| 方案 | 字体相关 | 主包 | 字体是否生效 |
| ---- | ---- | ---- | ---- |
| wxss 内嵌 base64 | wxss ~900KB | 易 &gt;1.5MB | 勉强 |
| 五档 woff2 进主包 + readFile | ~692KB 进包 | ~0.96MB | **0/5 失败** |
| Zeoseven CSS 打进 wxss | CSS 大 + 狂请求 | 不定 | ERR_CACHE_MISS |
| **downloadFile + tempPath（现行）** | **不进包** | **易 &lt;1.5MB** | **应成功** |

---

## 4. 工程文件

| 路径 | 职责 |
| ---- | ---- |
| `styles/fonts-h5.scss` | H5：Zeoseven `@import`（仅 `App.vue` `#ifdef H5`） |
| `styles/fonts.scss` | MP 无远程 `@font-face` |
| `services/fonts.js` | downloadFile → loadFontFace(temp)；包内 readFile 仅 fallback |
| `config.js` → `BRAND_FONT` | family / weights / cdnBase / downloadFileHost |
| `vite.config.js` | MP **strip** `fonts/*.woff2`，避免无谓撑包 |

---

## 5. 验收

1. 控制台：`[fonts] loaded weight 400` … `[fonts] done 5/5 (… downloadFile→tempPath)`  
2. **不应**再对 `https://…woff2` 报渲染层 `ERR_CACHE_MISS`（若仍有一条 Failed to load font，以 success 回调为准；官方称工具提示可忽略，但现行路径本不应再请求 HTTPS 字体）  
3. 真机：公众平台配置 downloadFile 域名 `cdn.jsdelivr.net`  
4. 主包 `dist/build/mp-weixin` **&lt; 1.5MB**

---

## 6. 已弃用

| 方案 | 原因 |
| ---- | ---- |
| Zeoseven 分包写入小程序 wxss | 渲染失败 + 可能撑包 |
| `loadFontFace(url(https://…))` | 渲染层 ERR_CACHE_MISS |
| 包内 readFile → Data URL 作主路径 | 实测 `done 0/5` |
| wxss 超大 base64 | 主包超限风险 |
