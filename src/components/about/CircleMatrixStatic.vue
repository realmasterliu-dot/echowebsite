<template>
  <!--
    圆点矩阵 — 对齐 H5 CircleMatrix.jsx / CircleMatrix.css
    滚动进入视口后，仅 --fill 点从左上到右下逐个点亮；--empty 永远灰色
    小程序紧凑：10 点 / 5 列 / 点亮 6，右侧显示 64%
  -->
  <view
    class="circle-matrix"
    :class="{ 'circle-matrix--mobile': true, 'circle-matrix--active': active }"
  >
    <view class="circle-matrix__grid" :style="gridStyle">
      <view
        v-for="c in circles"
        :key="c.id"
        class="circle-matrix__dot"
        :class="[
          c.filled ? 'circle-matrix__dot--fill' : 'circle-matrix__dot--empty',
          c.lit ? 'circle-matrix__dot--lit' : '',
        ]"
      />
    </view>

    <view class="circle-matrix__stat" :class="{ 'circle-matrix__stat--visible': showStat }">
      <view class="circle-matrix__number">
        <text class="circle-matrix__value">{{ cfg.value }}</text>
        <text class="circle-matrix__suffix">{{ suffix }}</text>
      </view>
      <text v-if="label" class="circle-matrix__label">{{ label }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useInViewOnce } from '@/components/feedback/useInViewOnce.js'

const props = defineProps({
  value: { type: Number, default: 64 },
  suffix: { type: String, default: '%' },
  label: { type: String, default: '' },
  fillCount: { type: Number, default: 64 },
  total: { type: Number, default: 100 },
  columns: { type: Number, default: 20 },
  /** 小程序默认紧凑（对齐 H5 max-width:768） */
  compact: { type: Boolean, default: true },
})

const active = ref(false)
const showStat = ref(false)
/** 已点亮的 fill 数量（仅 filled 点参与） */
const litCount = ref(0)

const timers = []

// 对齐 H5：手机端 { total: 10, fillCount: 6, columns: 5, value: 64 }
const cfg = computed(() => {
  if (props.compact) {
    return { total: 10, fillCount: 6, columns: 5, value: 64 }
  }
  return {
    total: props.total,
    fillCount: props.fillCount,
    columns: props.columns,
    value: props.value,
  }
})

const circles = computed(() =>
  Array.from({ length: cfg.value.total }, (_, i) => {
    const filled = i < cfg.value.fillCount
    return {
      id: i,
      filled,
      lit: filled && i < litCount.value,
    }
  })
)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${cfg.value.columns}, 1fr)`,
}))

function clearTimers() {
  while (timers.length) {
    clearTimeout(timers.pop())
  }
}

/** 对齐 H5 gsap stagger：只动画 fill 点 */
function lightFills() {
  clearTimers()
  litCount.value = 0
  const n = cfg.value.fillCount
  const amount = props.compact ? 600 : 1200
  const step = n > 0 ? amount / n : 0

  for (let i = 0; i < n; i += 1) {
    const t = setTimeout(() => {
      litCount.value = i + 1
    }, Math.round(i * step))
    timers.push(t)
  }
}

function play() {
  if (active.value) return
  active.value = true
  showStat.value = true
  lightFills()
}

useInViewOnce({
  selector: '.circle-matrix__grid',
  triggerRatio: 0.85,
  onEnter: () => play(),
})

onUnmounted(() => {
  clearTimers()
})
</script>

<style lang="scss" scoped>
/* 对齐 CircleMatrix.css，单位换算为 rpx */

.circle-matrix {
  display: flex;
  align-items: center;
  gap: $space-lg;
  margin-top: $space-md;
}

.circle-matrix--mobile {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
}

.circle-matrix__grid {
  display: grid;
  gap: 10rpx;
  flex: 1;
  min-width: 0;
}

.circle-matrix--mobile .circle-matrix__grid {
  flex: 0 0 auto;
  width: 260rpx;
}

.circle-matrix__dot {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 50%;
  border: 1rpx solid rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease,
    transform 0.15s ease;
}

/* 可点亮：初始中灰（H5 #c8c8c8 + gsap 起始偏暗） */
.circle-matrix__dot--fill {
  background-color: #c8c8c8;
  opacity: 0.4;
  transform: scale(0.85);
  box-shadow: none;
}

/* 空白：永远灰色，不参与点亮 */
.circle-matrix__dot--empty {
  background-color: #e0e0e0;
  opacity: 1;
  transform: none;
  box-shadow: none;
}

/* 仅 JS 赋给 filled 点的点亮态（对齐 gsap.to fill 元素） */
.circle-matrix__dot--fill.circle-matrix__dot--lit {
  background-color: #ff5500;
  opacity: 1;
  transform: scale(1);
  box-shadow:
    0 0 24rpx rgba(255, 85, 0, 0.5),
    0 0 48rpx rgba(255, 85, 0, 0.2);
}

.circle-matrix__stat {
  text-align: left;
  opacity: 0;
  transform: translateX(40rpx);
  transition:
    opacity 0.6s $ease-out-expo,
    transform 0.6s $ease-out-expo;
  transition-delay: 0.3s;
}

.circle-matrix__stat--visible {
  opacity: 1;
  transform: translateX(0);
}

.circle-matrix__number {
  display: flex;
  align-items: baseline;
  line-height: 1;
}

.circle-matrix__value {
  font-size: $fs-stat-xl;
  font-weight: $fw-bold;
  color: $color-primary;
  line-height: 1;
}

.circle-matrix__suffix {
  font-size: 62rpx;
  font-weight: $fw-semibold;
  color: $color-primary;
}

.circle-matrix__label {
  display: block;
  margin-top: $space-sm;
  font-size: $fs-sm;
  color: $color-text-secondary;
  line-height: 1.5;
  max-width: 360rpx;
}
</style>
