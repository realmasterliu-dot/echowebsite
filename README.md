# écho 有求必应 · 微信小程序

uni-app + Vue 3 + Vite，编译目标为 **微信小程序**。

## 快速开始

```bash
npm install
npm run dev:mp-weixin
```

环境与构建常量见 `config.js`；Vite 说明见 `vite.config.js` 顶部注释。

代码格式化（Prettier）：

```bash
npm run format        # 写入格式化
npm run format:check  # 仅检查
```

编译产物目录（用微信开发者工具打开）：

```
dist/dev/mp-weixin
```

生产构建：

```bash
npm run build:mp-weixin
# 产物：dist/build/mp-weixin
```

在 `src/manifest.json` → `mp-weixin.appid` 填入你的小程序 AppID（测试号亦可）。

## 目录约定

| 目录              | 职责                            |
| ----------------- | ------------------------------- |
| `src/pages/`      | 页面组装（薄）                  |
| `src/components/` | 跨页可复用 UI                   |
| `src/data/`       | 业务文案与配置（无 UI）         |
| `src/services/`   | 拨号、跳转、分享等能力          |
| `src/utils/`      | 纯工具 / 系统信息 / 响应式      |
| `src/styles/`     | 设计 Token、mixin、响应式工具类 |
| `src/static/`     | 图片、Tab 图标、字体            |
| `docs/`           | 迁移方案等文档                  |

## 响应式说明

- 布局单位以 **rpx** 为主（750rpx = 屏宽）
- `utils/system.js` 根据窗口宽度划分 `compact / regular / wide / tablet`
- `PageShell` 自动挂载 `is-compact` / `is-wide` / `is-tablet`，配合 `styles/responsive.scss`

## 文档

详见 [`docs/迁移方案.md`](./docs/迁移方案.md)
