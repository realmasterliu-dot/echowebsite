<template>
  <!--
    大数字 + 说明 — IP / 成果类 bento
    countUp：数字进入视口滚动（对齐 H5 resultBentos CountUp）
  -->
  <view class="number-bento" :class="{ 'number-bento--orange': tone === 'orange' }">
    <view class="number-bento__target">
      <view class="number-bento__value-row">
        <text class="number-bento__value">{{ displayValue }}</text>
        <text v-if="suffix" class="number-bento__suffix">{{ suffix }}</text>
      </view>
      <text class="number-bento__desc">{{ desc }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useInViewOnce } from '@/components/feedback/useInViewOnce.js'

const props = defineProps({
  /** 可为字符串（如「400亿」）或数字 */
  value: { type: [Number, String], required: true },
  suffix: { type: String, default: '' },
  desc: { type: String, required: true },
  /** surface | orange — IP 卡橙色渐变 */
  tone: { type: String, default: 'surface' },
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

const displayValue = computed(() => {
  if (!props.countUp || numericTarget.value == null) {
    return String(props.value)
  }
  // 未开始显示终值，避免停在 0
  if (!started.value) return String(Math.round(numericTarget.value))
  return String(Math.round(current.value))
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
  selector: '.number-bento__target',
  triggerRatio: 0.88,
  fallbackMs: 20000,
  onEnter: () => runCountUp(),
})

onUnmounted(() => stopTick())
</script>

<style lang="scss" scoped>
.number-bento {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  padding: $space-lg $space-md;
  background: $color-surface;
  border-radius: $radius-md;
  border: 1rpx solid $color-border-light;
  box-sizing: border-box;
}

.number-bento--orange {
  background: linear-gradient(145deg, #ff6a20, #e64d00);
  border-color: transparent;
}

.number-bento--orange .number-bento__value,
.number-bento--orange .number-bento__suffix {
  color: #fff;
}

.number-bento--orange .number-bento__desc {
  color: rgba(255, 255, 255, 0.9);
}

.number-bento__value-row {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.number-bento__value,
.number-bento__suffix {
  font-size: 76rpx;
  font-weight: $fw-bold;
  color: $color-primary;
  line-height: 1.1;
}

.number-bento__desc {
  font-size: $fs-sm;
  color: $color-text-secondary;
  line-height: 1.65;
}
</style>
