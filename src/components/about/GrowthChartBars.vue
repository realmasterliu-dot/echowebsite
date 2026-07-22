<template>
  <!--
    增长柱状图 — 对齐 H5 GrowthChart
    进入视口后：柱体增高 + 数值滚动（内联 transition，无 GSAP）
  -->
  <view class="growth-chart">
    <view class="growth-chart__target">
      <view class="growth-chart__bars">
        <view
          v-for="(item, i) in bars"
          :key="item.label"
          class="growth-chart__col"
        >
          <text
            class="growth-chart__value"
            :style="valueStyle(i)"
          >{{ displayTexts[i] }}</text>
          <view class="growth-chart__track">
            <view class="growth-chart__bar" :style="barStyle(item, i)" />
          </view>
          <text class="growth-chart__label">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref } from 'vue'
import { useInViewOnce } from '@/components/feedback/useInViewOnce.js'

const props = defineProps({
  /** @type {{ label: string, value: number, display?: string }[]} */
  data: { type: Array, required: true },
})

const ready = ref(false)
const active = ref(false)
const displayTexts = ref([])
let timers = []

const bars = computed(() => {
  const list = props.data || []
  const maxVal = Math.max(...list.map((d) => Number(d.value) || 0), 1)
  return list.map((item) => ({
    label: item.label,
    value: Number(item.value) || 0,
    display: item.display || `${item.value}`,
    heightPercent: Math.max(8, Math.round((Number(item.value) / maxVal) * 100)),
  }))
})

function formatDisplay(item, current) {
  const raw = item.display || ''
  if (raw.includes('万亿')) {
    return current >= 10000 ? '万亿+' : `${Math.round(current)}亿`
  }
  return `${Math.round(current)}亿`
}

function clearTimers() {
  while (timers.length) clearTimeout(timers.pop())
}

function valueStyle(i) {
  const delayMs = Math.round(i * 0.18 * 1000 + 400)
  return {
    opacity: active.value ? 1 : 0,
    transform: active.value ? 'translate3d(0, 0, 0)' : 'translate3d(0, 8px, 0)',
    transitionProperty: ready.value ? 'opacity, transform' : 'none',
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
    transitionDelay: active.value ? `${delayMs}ms` : '0ms',
  }
}

function barStyle(item, i) {
  const delayMs = Math.round(i * 0.18 * 1000)
  return {
    height: active.value ? `${item.heightPercent}%` : '0%',
    transitionProperty: ready.value ? 'height' : 'none',
    transitionDuration: '1000ms',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: active.value ? `${delayMs}ms` : '0ms',
  }
}

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t)
}

function tweenNumbers() {
  clearTimers()
  const list = bars.value
  displayTexts.value = list.map(() => '0亿')

  list.forEach((item, i) => {
    const delayMs = Math.round(i * 0.18 * 1000 + 500)
    const duration = 1500
    timers.push(
      setTimeout(() => {
        const startAt = Date.now()
        const tick = () => {
          const t = Math.min(1, (Date.now() - startAt) / duration)
          const current = easeOutQuad(t) * item.value
          displayTexts.value = displayTexts.value.slice()
          displayTexts.value[i] = formatDisplay(item, current)
          if (t < 1) {
            timers.push(setTimeout(tick, 16))
          } else {
            displayTexts.value = displayTexts.value.slice()
            displayTexts.value[i] = item.display
          }
        }
        tick()
      }, delayMs)
    )
  })
}

function play() {
  if (active.value) return
  nextTick(() => {
    timers.push(
      setTimeout(() => {
        ready.value = true
        timers.push(
          setTimeout(() => {
            active.value = true
            tweenNumbers()
          }, 32)
        )
      }, 16)
    )
  })
}

// 初始展示文案（未激活动画前先占位，避免布局塌缩）
displayTexts.value = (props.data || []).map((d) => d.display || `${d.value}`)

useInViewOnce({
  selector: '.growth-chart__target',
  triggerRatio: 0.88,
  onEnter: () => play(),
})

onUnmounted(() => clearTimers())
</script>

<style lang="scss" scoped>
.growth-chart {
  margin: $space-md 0;
  padding: $space-lg $space-md;
  background: $color-surface;
  border-radius: $radius-md;
  border: 1rpx solid $color-border-light;
}

.growth-chart__bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: $space-sm;
  min-height: 320rpx;
}

.growth-chart__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}

.growth-chart__value {
  font-size: $fs-xs;
  font-weight: $fw-bold;
  color: $color-primary;
  text-align: center;
  min-height: 1.2em;
}

.growth-chart__track {
  width: 100%;
  max-width: 56rpx;
  height: 240rpx;
  display: flex;
  align-items: flex-end;
  background: rgba(51, 44, 41, 0.04);
  border-radius: $radius-sm $radius-sm 0 0;
  overflow: hidden;
}

.growth-chart__bar {
  width: 100%;
  border-radius: $radius-sm $radius-sm 0 0;
  background: linear-gradient(180deg, $color-primary-light 0%, $color-primary 100%);
  min-height: 6rpx;
}

.growth-chart__label {
  font-size: $fs-xs;
  color: $color-text-light;
}
</style>
