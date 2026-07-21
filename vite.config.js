import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import Uni from '@uni-helper/plugin-uni'
import autoprefixer from 'autoprefixer'

import { APP_TITLE, APP_DESC } from './config.js'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))
const assetsSrc = path.join(srcDir, 'assets')

/** mp-weixin 不需要进包的字体产物（主包体积 / 运行时不用文件） */
const MP_STRIP_FONT = /\.(woff2)$/i
const MP_STRIP_NAMES = new Set([
  'jiangcheng-base64.js',
  'jiangcheng-faces.scss',
])

function walkFiles(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) walkFiles(full, base, out)
    else out.push({ full, rel: path.relative(base, full), mtimeMs: st.mtimeMs, size: st.size })
  }
  return out
}

function shouldSkipForMp(rel, platform) {
  if (platform !== 'mp-weixin') return false
  const base = path.basename(rel)
  if (MP_STRIP_NAMES.has(base)) return true
  if (rel.split(path.sep).includes('fonts') && MP_STRIP_FONT.test(base)) return true
  return false
}

/**
 * 仅当源文件相对目标有变化时才写入，避免每次 HMR 刷新 mtime
 * 导致微信开发者工具整包 assets 重传。
 */
function syncAssetsIncremental(srcRoot, destRoot, platform) {
  const files = walkFiles(srcRoot)
  let copied = 0
  let skipped = 0
  let omitted = 0

  for (const file of files) {
    if (shouldSkipForMp(file.rel, platform)) {
      omitted += 1
      // 若旧产物里还有被剥离文件，删掉（只做一次）
      const stale = path.join(destRoot, file.rel)
      if (fs.existsSync(stale)) {
        fs.unlinkSync(stale)
        console.log('[strip-fonts]', path.basename(stale))
      }
      continue
    }

    const dest = path.join(destRoot, file.rel)
    if (fs.existsSync(dest)) {
      const d = fs.statSync(dest)
      // 同尺寸且目标不比源旧 → 视为未改，不写盘（保留 mtime）
      if (d.size === file.size && d.mtimeMs >= file.mtimeMs) {
        skipped += 1
        continue
      }
      // 尺寸相同再比内容，避免无意义刷新时间戳
      if (d.size === file.size) {
        const a = fs.readFileSync(file.full)
        const b = fs.readFileSync(dest)
        if (Buffer.compare(a, b) === 0) {
          skipped += 1
          continue
        }
      }
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(file.full, dest)
    // 同步源 mtime，便于下次比较
    fs.utimesSync(dest, new Date(), new Date(file.mtimeMs))
    copied += 1
  }

  return { copied, skipped, omitted }
}

/**
 * uni-app 的 publicDir 固定为 static；源码使用 src/assets，
 * 构建后拷到 dist/{dev|build}/{platform}/assets（运行时 /assets/...）。
 * mp-weixin 跳过多余字体文件以控制主包体积。
 */
function copySrcAssetsAndStripMpFonts() {
  return {
    name: 'copy-src-assets-and-strip-mp-fonts',
    enforce: 'post',
    closeBundle() {
      const platform = process.env.UNI_PLATFORM
      if (!platform || !fs.existsSync(assetsSrc)) return

      const mode = process.env.NODE_ENV === 'production' ? 'build' : 'dev'
      const dest = path.resolve(`dist/${mode}/${platform}/assets`)
      fs.mkdirSync(dest, { recursive: true })

      const { copied, skipped, omitted } = syncAssetsIncremental(
        assetsSrc,
        dest,
        platform
      )

      if (copied > 0) {
        console.log(
          `[copy-assets] ${copied} updated, ${skipped} unchanged` +
            (omitted ? `, ${omitted} skipped(mp fonts)` : '') +
            ` → ${dest}`
        )
      } else {
        // 安静：未改 assets 时不刷屏，避免误以为又拷了一遍
        // 需要确认时可看 skipped 日志：偶发首次仍打印一次
        if (process.env.ASSETS_SYNC_VERBOSE === '1') {
          console.log(`[copy-assets] unchanged (${skipped} files) → ${dest}`)
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

    plugins: [Uni(), copySrcAssetsAndStripMpFonts()],

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
