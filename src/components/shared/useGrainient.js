/**
 * Grainient 驱动逻辑 — 供页面内 type="2d" canvas 使用（与 cover-view 同父平级）。
 * 优先：离屏 WebGL 着色器 → 每帧 blit 到 2d；失败则 2d 渐变兜底动画。
 */
import { createGrainientRenderer, hexToRgb } from './grainientGl.js'

/**
 * @param {object} options
 * @param {any} options.proxy - 组件 proxy，供 selectorQuery.in
 * @param {string} options.canvasId
 * @param {() => Record<string, any>} options.getProps
 * @param {(info: { cssW: number, cssH: number, fallback: boolean }) => void} [options.onReady]
 */
export function createGrainientController(options) {
  const { proxy, canvasId, getProps, onFallback, onReady } = options

  /** @type {any} */
  let displayCanvas = null
  /** @type {CanvasRenderingContext2D | null} */
  let ctx2d = null
  /** @type {any} */
  let offscreen = null
  /** @type {ReturnType<typeof createGrainientRenderer> | null} */
  let glRenderer = null
  let mode = 'none' // 'webgl-blit' | 'css2d' | 'none'
  let raf = 0
  let running = false
  let disposed = false
  let t0 = 0
  let cssW = 300
  let cssH = 500
  let bufW = 300
  let bufH = 500

  function scheduleFrame(cb) {
    if (disposed || typeof cb !== 'function') return 0
    // 部分预览环境 canvas.rAF 会误调到 Window.rAF 且丢回调 → TypeError
    // 统一用 setTimeout，避免关场销毁时抛错导致 dismiss 发不出
    return setTimeout(() => {
      if (disposed || !running) return
      cb(Date.now())
    }, 1000 / 30)
  }

  function cancelFrame(id) {
    if (id) clearTimeout(id)
  }

  function syncGlProps() {
    if (glRenderer) glRenderer.applyProps(getProps())
  }

  function drawCss2d(timeSec) {
    if (!ctx2d) return
    const p = getProps()
    const c1 = hexToRgb(p.color1)
    const c2 = hexToRgb(p.color2)
    const c3 = hexToRgb(p.color3)
    const toCss = (rgb, a = 1) =>
      `rgba(${Math.round(rgb[0] * 255)},${Math.round(rgb[1] * 255)},${Math.round(rgb[2] * 255)},${a})`

    const t = timeSec * (p.timeSpeed || 0.55)
    ctx2d.clearRect(0, 0, bufW, bufH)

    const g = ctx2d.createLinearGradient(
      bufW * (0.2 + 0.15 * Math.sin(t * 0.7)),
      0,
      bufW * (0.8 + 0.1 * Math.cos(t * 0.5)),
      bufH,
    )
    g.addColorStop(0, toCss(c1))
    g.addColorStop(0.45 + 0.08 * Math.sin(t), toCss(c2))
    g.addColorStop(1, toCss(c3))
    ctx2d.fillStyle = g
    ctx2d.fillRect(0, 0, bufW, bufH)

    // soft moving blobs (warp feel)
    for (let i = 0; i < 3; i++) {
      const cx = bufW * (0.3 + 0.4 * ((Math.sin(t * (0.6 + i * 0.2) + i) + 1) / 2))
      const cy = bufH * (0.25 + 0.5 * ((Math.cos(t * (0.5 + i * 0.15) + i * 1.3) + 1) / 2))
      const r = Math.min(bufW, bufH) * (0.35 + 0.1 * i)
      const rg = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, r)
      rg.addColorStop(0, toCss(i === 1 ? c1 : c2, 0.35))
      rg.addColorStop(1, toCss(c2, 0))
      ctx2d.fillStyle = rg
      ctx2d.fillRect(0, 0, bufW, bufH)
    }
  }

  function loop(now) {
    if (!running || disposed) return
    const t = typeof now === 'number' ? now : Date.now()
    if (!t0) t0 = t
    const timeSec = (t - t0) * 0.001

    try {
      if (mode === 'webgl-blit' && glRenderer && ctx2d && offscreen) {
        glRenderer.draw(timeSec)
        try {
          ctx2d.clearRect(0, 0, bufW, bufH)
          ctx2d.drawImage(offscreen, 0, 0, bufW, bufH)
        } catch (_) {
          mode = 'css2d'
          onFallback?.(true)
          drawCss2d(timeSec)
        }
      } else if (mode === 'css2d') {
        drawCss2d(timeSec)
      }
    } catch (err) {
      console.warn('[Grainient] frame error', err)
      running = false
      return
    }

    if (running && !disposed) {
      raf = scheduleFrame(loop)
    }
  }

  function start() {
    if (running || disposed || mode === 'none') return
    running = true
    t0 = 0
    raf = scheduleFrame(loop)
  }

  function stop() {
    running = false
    if (raf) {
      cancelFrame(raf)
      raf = 0
    }
  }

  function tryInitWebglBlit() {
    try {
      if (typeof uni.createOffscreenCanvas !== 'function') return false
      offscreen = uni.createOffscreenCanvas({
        type: 'webgl',
        width: bufW,
        height: bufH,
      })
      if (!offscreen) return false
      const gl =
        offscreen.getContext('webgl', {
          alpha: false,
          antialias: false,
          preserveDrawingBuffer: true,
        }) || offscreen.getContext('experimental-webgl')
      if (!gl) return false
      glRenderer = createGrainientRenderer(gl)
      glRenderer.setSize(bufW, bufH)
      syncGlProps()
      glRenderer.draw(0)
      ctx2d.drawImage(offscreen, 0, 0, bufW, bufH)
      mode = 'webgl-blit'
      return true
    } catch (err) {
      console.warn('[Grainient] offscreen WebGL unavailable', err)
      offscreen = null
      glRenderer = null
      return false
    }
  }

  function initDisplay(canvas, width, height) {
    displayCanvas = canvas
    cssW = Math.max(1, Math.floor(width))
    cssH = Math.max(1, Math.floor(height))
    const dpr = Math.min(
      (typeof uni !== 'undefined' && uni.getWindowInfo?.()?.pixelRatio) || 2,
      2,
    )
    bufW = Math.max(1, Math.floor(cssW * dpr))
    bufH = Math.max(1, Math.floor(cssH * dpr))
    canvas.width = bufW
    canvas.height = bufH

    ctx2d = canvas.getContext('2d')
    if (!ctx2d) {
      mode = 'none'
      onFallback?.(true)
      return
    }

    if (!tryInitWebglBlit()) {
      mode = 'css2d'
      onFallback?.(true)
      drawCss2d(0)
      onReady?.({ cssW, cssH, fallback: true })
    } else {
      onFallback?.(false)
      onReady?.({ cssW, cssH, fallback: false })
    }
    start()
  }

  function queryAndInit() {
    uni
      .createSelectorQuery()
      .in(proxy)
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (disposed) return
        const data = res && res[0]
        if (!data || !data.node) {
          mode = 'none'
          onFallback?.(true)
          return
        }
        initDisplay(data.node, data.width || 300, data.height || 500)
      })
  }

  function destroy() {
    disposed = true
    stop()
    if (glRenderer) {
      try {
        glRenderer.destroy()
      } catch (_) {
        /* ignore */
      }
      glRenderer = null
    }
    offscreen = null
    ctx2d = null
    displayCanvas = null
  }

  return {
    queryAndInit,
    start,
    stop,
    syncGlProps,
    destroy,
    getSize: () => ({ cssW, cssH }),
  }
}
