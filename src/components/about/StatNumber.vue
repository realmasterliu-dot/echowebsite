<template>
  <!--
    大数字 — 对齐 H5 CountUp
    countUp：进入视口后从 0 滚到目标
    未开播前显示终值（避免长时间停在 0.0%）
  -->
  <view class="stat-number" :class="[`stat-number--${size}`]">
    <view class="stat-number__target">
      <view class="stat-number__value-row">
        <text class="stat-number__value">{{ displayValue }}</text>
        <text v-if="suffix" class="stat-number__suffix">{{ suffix }}</text>
      </view>
      <text v-if="label" class="stat-number__label">{{ label }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useInViewOnce } from '@/components/feedback/useInViewOnce.js'

const props = defineProps({
  value: { type: [Number, String], required: true },
  suffix: { type: String, default: '' },
  label: { type: String, default: '' },
  decimals: { type: Number, default: 0 },
  /** sm | md | lg */
  size: { type: String, default: 'md' },
  /** 对齐 H5 CountUp：视口内数字滚动 */
  countUp: { type: Boolean, default: false },
  duration: { type: Number, default: 2000 },
})

const current = ref(0)
const started = ref(false)
let tickTimer = null

const numericTarget = computed(() => {
  if (typeof props.value === 'number') return props.value
  const n = Number(props.value)
  return Number.isFinite(n) ? n : null
})

function formatNum(n) {
  if (props.decimals > 0) return Number(n).toFixed(props.decimals)
  return String(Math.round(n))
}

const displayValue = computed(() => {
  if (!props.countUp || numericTarget.value == null) {
    if (typeof props.value === 'string') return props.value
    const n = Number(props.value)
    if (Number.isNaN(n)) return String(props.value)
    return formatNum(n)
  }
  // 未开始：显示终值，避免进页/等待触发时停在 0.0%
  if (!started.value) return formatNum(numericTarget.value)
  return formatNum(current.value)
})

function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function stopTick() {
  if (tickTimer) {
    clearTimeout(tickTimer)
    tickTimer = null
  }
}

function runCountUp() {
  const target = numericTarget.value
  if (!props.countUp || target == null || started.value) return
  started.value = true
  current.value = 0
  stopTick()

  const startAt = Date.now()
  const duration = Math.max(200, props.duration)

  const step = () => {
    const t = Math.min(1, (Date.now() - startAt) / duration)
    current.value = easeOutExpo(t) * target
    if (t < 1) {
      tickTimer = setTimeout(step, 16)
    } else {
      current.value = target
      tickTimer = null
    }
  }
  step()
}

useInViewOnce({
  selector: '.stat-number__target',
  triggerRatio: 0.88,
  fallbackMs: 20000,
  onEnter: () => runCountUp(),
})

onUnmounted(() => stopTick())
</script>

<style lang="scss" scoped>
.stat-number {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.stat-number__value-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4rpx;
}

.stat-number__value {
  font-weight: $fw-bold;
  color: $color-primary;
  line-height: 1.1;
}

.stat-number__suffix {
  font-weight: $fw-semibold;
  color: $color-primary;
}

.stat-number__label {
  font-size: $fs-sm;
  color: $color-text-secondary;
  line-height: 1.65;
}

.stat-number--sm .stat-number__value,
.stat-number--sm .stat-number__suffix {
  font-size: $fs-2xl;
}

.stat-number--md .stat-number__value,
.stat-number--md .stat-number__suffix {
  font-size: $fs-3xl;
}

.stat-number--lg .stat-number__value,
.stat-number--lg .stat-number__suffix {
  font-size: $fs-stat;
}
</style>
