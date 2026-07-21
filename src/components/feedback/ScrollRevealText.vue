<template>
  <!--
    对齐 H5 ScrollRevealText：滚动 scrub 逐字揭示（非打字机）
    start: top 88% → end: top 55%，scrub 平滑追赶
    进度只向前；播完后定格，回滑/再进视口不重播（刷新才重置）
  -->
  <view class="scroll-reveal-text">
    <view class="scroll-reveal-text__target" :style="containerStyle">
      <view class="scroll-reveal-text__body">
        <view
          v-for="(token, index) in tokens"
          :key="index"
          class="scroll-reveal-text__word"
          :class="{ 'scroll-reveal-text__word--space': token.space }"
          :style="wordStyle(token)"
        >
          <text>{{ token.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

const props = defineProps({
  text: { type: String, required: true },
  baseOpacity: { type: Number, default: 0.08 },
  baseRotation: { type: Number, default: 2 },
  /** 对齐 H5 gsap stagger: 0.04 */
  stagger: { type: Number, default: 0.04 },
  /** 对齐 H5 scrub: 1.2（秒级滞后平滑，滑快会加速追赶） */
  scrubLag: { type: Number, default: 1.2 },
})

const instance = getCurrentInstance()
const ready = ref(false)
/** 滚动原始进度 0–1（只增不减） */
const rawProgress = ref(0)
/** 平滑后的进度（scrub 追赶） */
const smoothProgress = ref(0)
/** 播完后定格，不再响应滚动 */
const settled = ref(false)

let rafTimer = null
let lastTickAt = 0
let measuring = false

function settle() {
  if (settled.value) return
  settled.value = true
  rawProgress.value = 1
  smoothProgress.value = 1
  stopSmooth()
}

const tokens = computed(() => {
  const result = []
  let order = 0
  for (const part of props.text.split(/(\s+)/g)) {
    if (!part) continue
    if (/^\s+$/.test(part)) {
      result.push({ text: part, space: true, order: 0 })
      continue
    }
    const chunks = part
      .split(/([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])/g)
      .filter(Boolean)
    for (const text of chunks) {
      result.push({ text, space: false, order })
      order += 1
    }
  }
  return result
})

const charCount = computed(() => tokens.value.filter((t) => !t.space).length)

/**
 * H5：top 88% → 0，top 55% → 1
 */
function progressFromTop(top, windowHeight) {
  const startY = windowHeight * 0.88
  const endY = windowHeight * 0.55
  const range = startY - endY
  if (range <= 0) return top <= endY ? 1 : 0
  return Math.min(1, Math.max(0, (startY - top) / range))
}

function getWindowHeight() {
  try {
    return uni.getWindowInfo().windowHeight || 667
  } catch {
    try {
      return uni.getSystemInfoSync().windowHeight || 667
    } catch {
      return 667
    }
  }
}

/**
 * GSAP stagger + scrub 映射：整段时间轴长度 = 1 + (n-1)*stagger，
 * 字 i 在 [i*stagger, i*stagger+1] 内从 0→1。
 */
function wordAmount(order, progress) {
  const n = charCount.value
  if (n <= 0) return 1
  const duration = 1
  const total = duration + Math.max(0, n - 1) * props.stagger
  const time = progress * total
  return Math.min(1, Math.max(0, (time - order * props.stagger) / duration))
}

const containerStyle = computed(() => {
  const p = smoothProgress.value
  const rot = props.baseRotation * (1 - p)
  return {
    transform: `rotate(${rot}deg)`,
    transformOrigin: '0% 50%',
    transitionProperty: 'none',
  }
})

function wordStyle(token) {
  if (token.space) return {}
  const amount = wordAmount(token.order, smoothProgress.value)
  const y = 16 * (1 - amount)
  const opacity = props.baseOpacity + (1 - props.baseOpacity) * amount
  return {
    opacity,
    transform: `translate3d(0, ${y}px, 0)`,
    transitionProperty: 'none',
  }
}

function stopSmooth() {
  if (rafTimer) {
    clearTimeout(rafTimer)
    rafTimer = null
  }
}

function tickSmooth() {
  if (settled.value) {
    stopSmooth()
    return
  }

  const now = Date.now()
  const dt = lastTickAt ? Math.min(0.064, (now - lastTickAt) / 1000) : 0.016
  lastTickAt = now

  const lag = Math.max(0.05, props.scrubLag)
  // 近似 GSAP scrub：约 lag 秒追上目标；滑得快时每帧步进更大 → 加速追赶
  const alpha = 1 - Math.exp(-dt / (lag * 0.35))
  const next =
    smoothProgress.value + (rawProgress.value - smoothProgress.value) * alpha

  // 平滑进度也只向前
  const advanced = Math.max(smoothProgress.value, next)
  if (advanced >= 0.999) {
    settle()
    return
  }

  if (Math.abs(advanced - smoothProgress.value) > 0.0005) {
    smoothProgress.value = advanced
  } else if (rawProgress.value > smoothProgress.value) {
    smoothProgress.value = rawProgress.value
  }

  if (Math.abs(rawProgress.value - smoothProgress.value) < 0.001) {
    if (rawProgress.value >= 1) {
      settle()
      return
    }
    if (rawProgress.value <= 0 && smoothProgress.value <= 0) {
      stopSmooth()
      return
    }
  }

  rafTimer = setTimeout(tickSmooth, 16)
}

function ensureSmoothRunning() {
  if (settled.value || rafTimer) return
  lastTickAt = 0
  rafTimer = setTimeout(tickSmooth, 16)
}

function measure() {
  if (settled.value || measuring) return
  const proxy = instance?.proxy
  if (!proxy) return

  measuring = true
  uni
    .createSelectorQuery()
    .in(proxy)
    .select('.scroll-reveal-text__target')
    .boundingClientRect((rect) => {
      measuring = false
      if (settled.value || !rect) return
      if (!ready.value) ready.value = true

      const p = progressFromTop(rect.top, getWindowHeight())
      // 只向前：回滑不倒退
      if (p > rawProgress.value) {
        rawProgress.value = p
        if (p >= 0.999) {
          settle()
          return
        }
        ensureSmoothRunning()
      }
    })
    .exec()
}

// uni-app：页面已声明 onPageScroll 时，子组件钩子可收到滚动
onPageScroll(() => {
  measure()
})

onMounted(() => {
  nextTick(() => {
    setTimeout(measure, 50)
    setTimeout(measure, 300)
  })
})

onUnmounted(() => {
  stopSmooth()
})
</script>

<style lang="scss" scoped>
.scroll-reveal-text {
  width: 100%;
  margin: 0;
}

.scroll-reveal-text__target {
  width: 100%;
}

.scroll-reveal-text__body {
  font-size: $fs-sm;
  line-height: 1.85;
  font-weight: $fw-regular;
  color: $color-text-secondary;
  width: 100%;
}

.scroll-reveal-text__word {
  display: inline-block;
  will-change: opacity, transform;
}

.scroll-reveal-text__word--space {
  opacity: 1;
  transform: none;
}
</style>
