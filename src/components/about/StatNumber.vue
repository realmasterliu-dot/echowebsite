<template>
  <!--
    静态大数字 — 对应 H5 CountUp（首期不做滚动动画）
    后续若需动效可替换为 CountUp 组件，props 保持兼容
  -->
  <view class="stat-number" :class="[`stat-number--${size}`]">
    <view class="stat-number__value-row">
      <text class="stat-number__value">{{ displayValue }}</text>
      <text v-if="suffix" class="stat-number__suffix">{{ suffix }}</text>
    </view>
    <text v-if="label" class="stat-number__label">{{ label }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: [Number, String], required: true },
  suffix: { type: String, default: '' },
  label: { type: String, default: '' },
  decimals: { type: Number, default: 0 },
  /** sm | md | lg */
  size: { type: String, default: 'md' },
})

const displayValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  const n = Number(props.value)
  if (Number.isNaN(n)) return String(props.value)
  return props.decimals > 0 ? n.toFixed(props.decimals) : String(Math.round(n))
})
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
  font-weight: $fw-medium;
  color: $color-primary;
  line-height: 1.1;
}

.stat-number__suffix {
  font-weight: $fw-medium;
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
  font-size: 72rpx;
}
</style>
