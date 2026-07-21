import { defineConfig } from '@uni-helper/unh'

/**
 * unh 配置 — 默认编译微信小程序，便于对接微信开发者工具
 * @see https://uni-helper.js.org/unh/
 */
export default defineConfig({
  platform: {
    default: 'mp-weixin',
    alias: {
      h5: ['w', 'h'],
      'mp-weixin': 'wx',
    },
  },
})
