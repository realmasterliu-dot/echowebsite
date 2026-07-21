import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import Uni from '@uni-helper/plugin-uni'
import autoprefixer from 'autoprefixer'

import { APP_TITLE, APP_DESC } from './config.js'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

/** mp-weixin 用 base64 Data URL，无需再拷贝 woff2（约省 690KB，避免主包超 2MB） */
function stripWoff2OnMpWeixin() {
  return {
    name: 'strip-woff2-on-mp-weixin',
    closeBundle() {
      if (process.env.UNI_PLATFORM !== 'mp-weixin') return
      const roots = [
        path.resolve('dist/build/mp-weixin/static/fonts'),
        path.resolve('dist/dev/mp-weixin/static/fonts'),
      ]
      for (const dir of roots) {
        if (!fs.existsSync(dir)) continue
        for (const name of fs.readdirSync(dir)) {
          if (!/\.woff2$/i.test(name)) continue
          fs.unlinkSync(path.join(dir, name))
          console.log('[strip-woff2]', name)
        }
      }
    },
  }
}

/**
 * Vite 构建配置（uni-app → 微信小程序为主）
 */
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    base: '/',

    plugins: [Uni(), stripWoff2OnMpWeixin()],

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
