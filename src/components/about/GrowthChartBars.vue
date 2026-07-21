<template>
  <!--
    增长柱状图 — 对应 H5 AboutSection 内 GrowthChart
    不使用 GSAP：高度按 value/max 静态计算，展示 display 文案
  -->
  <view class="growth-chart">
    <view class="growth-chart__bars">
      <view v-for="item in bars" :key="item.label" class="growth-chart__col">
        <text class="growth-chart__value">{{ item.display }}</text>
        <view class="growth-chart__track">
          <view class="growth-chart__bar" :style="{ height: item.heightPercent + '%' }" />
        </view>
        <text class="growth-chart__label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** @type {{ label: string, value: number, display?: string }[]} */
  data: { type: Array, required: true },
})

const bars = computed(() => {
  const list = props.data || []
  const maxVal = Math.max(...list.map((d) => Number(d.value) || 0), 1)
  return list.map((item) => ({
    label: item.label,
    display: item.display || `${item.value}`,
    heightPercent: Math.max(8, Math.round((Number(item.value) / maxVal) * 100)),
  }))
})
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
  min-height: 8%;
}

.growth-chart__label {
  font-size: $fs-xs;
  color: $color-text-light;
}
</style>
