<template>
  <!--
    圆点矩阵（静态）— 对应 H5 CircleMatrix
    小程序首期不做 GSAP 点亮动画；紧凑布局对齐 H5 移动端（10 点 / 点亮 6）
  -->
  <view class="circle-matrix">
    <view class="circle-matrix__grid" :style="gridStyle">
      <view
        v-for="dot in dots"
        :key="dot.id"
        class="circle-matrix__dot"
        :class="{ 'circle-matrix__dot--on': dot.filled }"
      />
    </view>
    <view class="circle-matrix__stat">
      <text class="circle-matrix__value">{{ value }}{{ suffix }}</text>
      <text v-if="label" class="circle-matrix__label">{{ label }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 64 },
  suffix: { type: String, default: '%' },
  label: { type: String, default: '' },
  fillCount: { type: Number, default: 64 },
  total: { type: Number, default: 100 },
  columns: { type: Number, default: 20 },
  /** 强制紧凑（推荐）：10 点、5 列、点亮 6 */
  compact: { type: Boolean, default: true },
})

const cfg = computed(() => {
  if (props.compact) {
    return { total: 10, fillCount: 6, columns: 5 }
  }
  return {
    total: props.total,
    fillCount: props.fillCount,
    columns: props.columns,
  }
})

const dots = computed(() =>
  Array.from({ length: cfg.value.total }, (_, i) => ({
    id: i,
    filled: i < cfg.value.fillCount,
  }))
)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${cfg.value.columns}, 1fr)`,
}))
</script>

<style lang="scss" scoped>
.circle-matrix {
  display: flex;
  align-items: center;
  gap: $space-lg;
  padding: $space-md 0;
}

.circle-matrix__grid {
  display: grid;
  gap: 10rpx;
  flex-shrink: 0;
  width: 200rpx;
}

.circle-matrix__dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: $radius-full;
  background: #e5e5e5;
  opacity: 0.55;

  &--on {
    background: $color-primary;
    opacity: 1;
    box-shadow: 0 0 8rpx rgba(255, 85, 0, 0.35);
  }
}

.circle-matrix__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.circle-matrix__value {
  font-size: $fs-3xl;
  font-weight: $fw-medium;
  color: $color-primary;
  line-height: 1.1;
}

.circle-matrix__label {
  font-size: $fs-sm;
  color: $color-text-secondary;
  line-height: 1.5;
}
</style>
