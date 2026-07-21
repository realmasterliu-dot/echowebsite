<template>
  <!-- 大数字 + 说明 — IP / 成果类 bento（对应 H5 SpotlightCard 数字卡） -->
  <view class="number-bento">
    <view class="number-bento__value-row">
      <text class="number-bento__value">{{ displayValue }}</text>
      <text v-if="suffix" class="number-bento__suffix">{{ suffix }}</text>
    </view>
    <text class="number-bento__desc">{{ desc }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 可为字符串（如「400亿」）或数字 */
  value: { type: [Number, String], required: true },
  suffix: { type: String, default: '' },
  desc: { type: String, required: true },
})

const displayValue = computed(() => String(props.value))
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
