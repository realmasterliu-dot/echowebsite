# shared

跨页面复用的视觉/交互组件。

| 文件 | 说明 |
|------|------|
| `grainientGl.js` | WebGL1 着色器与渲染器 |
| `useGrainient.js` | Hero 用：驱动页面内 `type="2d"` canvas（离屏 WebGL blit / 2d 兜底） |

## Hero 层级结论（微信）

`type="2d"` **默认同层渲染** → 用普通 `view` 覆盖，不用 cover-view。

```text
view.hero (position:relative; height:100vh)
  ├── canvas.type="2d" (absolute; z-index:0)
  └── view.hero__content (relative; z-index:1)
```

独立组件 `Grainient.vue` 已移除（避免 dist 残留引用）；动效统一走 `useGrainient.js`。
