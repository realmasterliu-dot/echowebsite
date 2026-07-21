<template>
  <!-- 对应 H5 AboutBlock 标题区：subtitle + title -->
  <view class="why-header" :class="{ 'why-header--right': align === 'right' }">
    <text class="why-header__label">{{ subtitle }}</text>
    <text class="why-header__title">{{ title }}</text>
  </view>
</template>

<script setup>
defineProps({
  subtitle: { type: String, required: true },
  title: { type: String, required: true },
  /** left | right — 对齐 H5 奇偶交替 */
  align: { type: String, default: 'left' },
})
</script>

<style lang="scss" scoped>
.why-header {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
  margin-bottom: $space-lg;
  text-align: left;

  &--right {
    text-align: right;
    align-items: flex-end;
  }
}

.why-header__label {
  font-size: $fs-xs;
  font-weight: $fw-bold;
  letter-spacing: 0.25em;
  color: $color-primary;
}

.why-header__title {
  font-size: $fs-3xl;
  font-weight: $fw-bold;
  color: $color-text;
  line-height: 1.2;
  max-width: 560rpx;
}
</style>
