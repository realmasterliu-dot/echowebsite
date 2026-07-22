/**
 * 品牌字体（微信小程序）
 *
 * 为何不用 Zeoseven 官方「嵌入」CSS：
 *   那是 unicode-range 分包，给浏览器用的；小程序 loadFontFace 不支持 unicode-range，
 *   且渲染层直接请求 HTTPS 字体会 ERR_CACHE_MISS。
 *
 * 现行：逻辑层 uni.downloadFile(整档 woff2 CDN) → loadFontFace(本地 tempFilePath)
 *   - 下载走 downloadFile（可配合法域名），不经过渲染层网络
 *   - 避免 url("https://…") 触发 Failed to load font / ERR_CACHE_MISS
 *
 * H5 仍用 Zeoseven CSS：styles/fonts-h5.scss
 */
import { SWITCH, BRAND_FONT } from '../../config.js'

/**
 * @param {string} weight
 * @param {string} source
 * @returns {Promise<boolean>}
 */
function applyFontFace(weight, source) {
  return new Promise((resolve) => {
    uni.loadFontFace({
      global: true,
      family: BRAND_FONT.family,
      source,
      desc: {
        style: 'normal',
        weight: String(weight),
      },
      success: () => {
        console.log(`[fonts] loaded weight ${weight}`)
        resolve(true)
      },
      fail: (err) => {
        console.warn(`[fonts] loadFontFace fail ${weight}`, err)
        resolve(false)
      },
    })
  })
}

/**
 * 逻辑层下载到临时文件，再用本地路径注入（关键路径）
 * @param {string} weight
 * @param {string} url
 */
function loadViaDownload(weight, url) {
  return new Promise((resolve) => {
    uni.downloadFile({
      url,
      success: async (res) => {
        if (res.statusCode !== 200 || !res.tempFilePath) {
          console.warn(`[fonts] download bad ${weight}`, res.statusCode)
          resolve(false)
          return
        }
        const ok = await applyFontFace(weight, `url("${res.tempFilePath}")`)
        resolve(ok)
      },
      fail: (err) => {
        console.warn(
          `[fonts] downloadFile fail ${weight} — 请确认 downloadFile 域名含 ${BRAND_FONT.downloadFileHost}`,
          err,
        )
        resolve(false)
      },
    })
  })
}

/**
 * 兜底：尝试读代码包内字体（部分基础库对 assets 路径只读失败，故仅作 fallback）
 * @param {string} weight
 */
function loadFromPackage(weight) {
  const candidates = [
    `fonts/jiangcheng-${weight}.woff2`,
    `static/fonts/jiangcheng-${weight}.woff2`,
    `assets/fonts/jiangcheng-${weight}.woff2`,
    `/assets/fonts/jiangcheng-${weight}.woff2`,
  ]

  return new Promise((resolve) => {
    let fsm
    try {
      fsm = uni.getFileSystemManager()
    } catch (err) {
      resolve(false)
      return
    }

    const tryRead = (index) => {
      if (index >= candidates.length) {
        resolve(false)
        return
      }
      const filePath = candidates[index]
      fsm.readFile({
        filePath,
        encoding: 'base64',
        success: async (res) => {
          const ok = await applyFontFace(
            weight,
            `url("data:font/woff2;charset=utf-8;base64,${res.data}")`,
          )
          if (ok) console.log(`[fonts] package fallback ok ${weight} via ${filePath}`)
          resolve(ok)
        },
        fail: () => tryRead(index + 1),
      })
    }

    tryRead(0)
  })
}

/**
 * @param {string} weight
 */
async function loadOneWeight(weight) {
  const url = `${BRAND_FONT.cdnBase}/jiangcheng-${weight}.woff2`
  if (await loadViaDownload(weight, url)) return true
  return loadFromPackage(weight)
}

/** App.onLaunch */
export function loadBrandFonts() {
  if (!SWITCH.USE_BRAND_FONT) {
    console.log('[fonts] skipped (USE_BRAND_FONT=false) — 将回退系统字体')
    return
  }

  const run = async () => {
    const weights = BRAND_FONT.weights
    let ok = 0
    // 串行：先 400/500（已在 weights 前部），再其余
    for (const weight of weights) {
      if (await loadOneWeight(weight)) ok += 1
    }
    console.log(
      `[fonts] done ${ok}/${weights.length} (${BRAND_FONT.family}, downloadFile→tempPath).`,
    )
    if (ok === 0) {
      console.warn(
        `[fonts] 全部失败。开发者工具请勾选「不校验合法域名」，真机请配置 downloadFile：${BRAND_FONT.downloadFileHost}`,
      )
    }
  }

  setTimeout(() => {
    run().catch((err) => console.warn('[fonts] unexpected', err))
  }, 64)
}
