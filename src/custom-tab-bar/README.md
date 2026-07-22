# 自定义 TabBar（Dock）

对齐 H5 `components/Dock.jsx`：圆角 + 半透明毛玻璃 + 底部悬浮。

- 配置：`pages.json` → `tabBar.custom: true`
- 实现：本目录微信原生四件套（uni 会拷到 `dist/.../custom-tab-bar`）
- 选中态：各 Tab 页 `onShow` 调用 `services/tabBar.js` → `setTabBarSelected(index)`

`backdrop-filter` 在部分安卓机可能弱化，半透明白底仍保持悬浮圆角观感。

滚动：下滑向下收起；手指按住期间不回显；松手后约 720ms 再展开（上滑意图 / 停滑 / 近顶底）。回显动画偏慢，收起偏快。
