import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Uni from '@uni-helper/plugin-uni'
import autoprefixer from 'autoprefixer'

import { APP_TITLE, APP_DESC } from './config.js'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

/**
 * Vite 构建配置（uni-app → 微信小程序为主）
 *
 * - plugins：接入 uni 编译链路（页面、组件、多端产物）
 * - resolve.alias：`@` 指向 `src/`，便于绝对路径引用
 * - css.postcss：autoprefixer，补全浏览器前缀
 * - define：向业务代码注入应用标题/描述等编译期常量
 *
 * 未配置项说明：
 * - 无 env 文件：当前无多环境变量需求，常量见 `config.js`
 * - 无 server.proxy：暂无后端接口代理
 * - 无 px→rem：小程序布局使用 rpx
 * - 不改 build.outDir：由 uni 输出到 `dist/{dev|build}/mp-weixin`
 */
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    base: '/',

    plugins: [Uni()],

    resolve: {
      alias: {
        '@': srcDir,
      },
    },

    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },

    define: {
      __APP_TITLE__: JSON.stringify(APP_TITLE),
      __APP_DESC__: JSON.stringify(APP_DESC),
      __IS_BUILD__: JSON.stringify(isBuild),
    },
  }
})
