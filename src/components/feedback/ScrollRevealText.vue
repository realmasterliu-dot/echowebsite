<template>
  <!--
    滚动 scrub 逐字揭示（对齐 H5 区间）
    - 进入视口后自动播到结束并定格（不停在半倾斜）
    - 继续下滑仍可加速追赶；回滑不倒退；刷新才重置
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
  /** 进入视口后播完剩余进度的大致时长（秒） */
  finishDuration: { type: Number, default: 0.85 },
  /** 滚动超前时的追赶平滑（秒），滑越快追上越多 */
  scrubLag: { type: Number, default: 1.2 },
})

const instance = getCurrentInstance()
const ready = ref(false)
/** 滚动给出的下限进度 0–1（只增） */
const scrubFloor = ref(0)
/** 实际展示进度 */
const smoothProgress = ref(0)
/** 已进入视口 → 必须播完 */
const playToEnd = ref(false)
/** 播完定格 */
const settled = ref(false)

let rafTimer = null
let lastTickAt = 0
let measuring = false

function settle() {
  if (settled.value) return
  settled.value = true
  playToEnd.value = true
  scrubFloor.value = 1
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

/** H5：top 88% → 0，top 55% → 1 */
function scrubFromTop(top, windowHeight) {
  const startY = windowHeight * 0.88
  const endY = windowHeight * 0.55
  const range = startY - endY
  if (range <= 0) return top <= endY ? 1 : 0
  return Math.min(1, Math.max(0, (startY - top) / range))
}

/** 段落与视口有实质交集 → 视为在视口内，应播完 */
function isInViewport(rect, windowHeight) {
  if (!rect) return false
  const topVisible = rect.top < windowHeight * 0.92
  const bottomVisible = rect.bottom > windowHeight * 0.05
  return topVisible && bottomVisible
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

  // 目标：视口内一律冲到 1；滚动 scrub 只提供更高下限（加速）
  const target = playToEnd.value ? 1 : scrubFloor.value
  if (target <= smoothProgress.value && !playToEnd.value) {
    stopSmooth()
    return
  }

  const remaining = Math.max(0, target - smoothProgress.value)
  if (remaining < 0.001) {
    if (target >= 1) settle()
    else stopSmooth()
    return
  }

  // 视口内自动收尾：按 finishDuration 匀速走完剩余
  // 若滚动已超前（scrubFloor 更高），用 scrubLag 更快追上
  let step
  if (playToEnd.value) {
    const autoStep = dt / Math.max(0.2, props.finishDuration)
    const lag = Math.max(0.05, props.scrubLag)
    const catchStep =
      scrubFloor.value > smoothProgress.value
        ? (scrubFloor.value - smoothProgress.value) *
          (1 - Math.exp(-dt / (lag * 0.35)))
        : 0
    step = Math.max(autoStep, catchStep)
  } else {
    const lag = Math.max(0.05, props.scrubLag)
    step =
      (scrubFloor.value - smoothProgress.value) *
      (1 - Math.exp(-dt / (lag * 0.35)))
  }

  const next = Math.min(1, smoothProgress.value + Math.max(step, 0.0001))
  smoothProgress.value = next

  if (next >= 0.999) {
    settle()
    return
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

      const wh = getWindowHeight()
      const scrub = scrubFromTop(rect.top, wh)

      if (scrub > scrubFloor.value) {
        scrubFloor.value = scrub
        if (scrub >= 0.999) {
          settle()
          return
        }
      }

      // 在视口内 → 承诺播完，避免停在半倾斜
      if (isInViewport(rect, wh) && !playToEnd.value) {
        playToEnd.value = true
      }

      if (playToEnd.value || scrubFloor.value > smoothProgress.value) {
        ensureSmoothRunning()
      }
    })
    .exec()
}

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
