<template>
  <!--
    单套餐卡片 — 对应 H5 PricingGrid → PricingCard
    去掉 BorderGlow 鼠标光效；保留 light / orange / dark 主题与权益列表
  -->
  <view class="price-card" :class="themeClass">
    <text v-if="plan.badge" class="price-card__badge">{{ plan.badge }}</text>

    <view class="price-card__header">
      <text class="price-card__name">{{ plan.name }}</text>
      <view class="price-card__price">
        <text class="price-card__currency">¥</text>
        <text class="price-card__amount">{{ priceText }}</text>
        <text class="price-card__period">{{ plan.period }}</text>
      </view>
    </view>

    <text class="price-card__desc">{{ plan.description }}</text>

    <view class="price-card__features">
      <block v-for="(f, i) in plan.features" :key="i">
        <view v-if="f.divider" class="price-card__divider" />
        <view
          v-else
          class="price-card__feature"
          :class="{ 'price-card__feature--disabled': f.disabled }"
        >
          <text class="price-card__check">{{ f.disabled ? '–' : '✓' }}</text>
          <text class="price-card__feature-text">{{ f.text }}</text>
        </view>
      </block>
    </view>

    <text v-if="plan.bonus" class="price-card__bonus">{{ plan.bonus }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  plan: { type: Object, required: true },
})

const themeClass = computed(() => {
  const t = props.plan.theme || 'light'
  return {
    'price-card--orange': t === 'orange',
    'price-card--dark': t === 'dark',
    'price-card--light': t === 'light',
  }
})

const priceText = computed(() => {
  const n = Number(props.plan.price)
  return Number.isNaN(n) ? String(props.plan.price) : n.toLocaleString('zh-CN')
})
</script>

<style lang="scss" scoped>
.price-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $space-md;
  width: 560rpx;
  padding: $space-xl $space-lg $space-lg;
  margin-top: 24rpx;
  box-sizing: border-box;
  border-radius: $radius-lg;
  background: $color-surface;
  border: 2rpx solid rgba(255, 85, 0, 0.35);
  box-shadow: $shadow-md;
}

.price-card--orange {
  background: #fff3ec;
  border-color: $color-primary;
  box-shadow: 0 8rpx 32rpx rgba(255, 85, 0, 0.12);
}

.price-card--dark {
  color: #fff;
  background: linear-gradient(135deg, #8e49ca 0%, #3a2150 22%, #1a0f26 55%, #0e0814 100%);
  border-color: #c9a227;
}

.price-card__badge {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 8rpx 28rpx 10rpx;
  font-size: $fs-xs;
  font-weight: $fw-medium;
  letter-spacing: 0.06em;
  color: #fff;
  background: linear-gradient(135deg, $color-primary, $color-primary-dark);
  border-radius: 0 0 20rpx 20rpx;
}

.price-card--dark .price-card__badge {
  background: #fdefb5;
  color: #3a2e12;
}

.price-card__header {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  padding-top: $space-sm;
}

.price-card__name {
  font-size: $fs-xl;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.3;
}

.price-card--dark .price-card__name {
  color: #fff;
}

.price-card__price {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4rpx;
}

.price-card__currency,
.price-card__amount {
  font-size: 56rpx;
  font-weight: $fw-medium;
  color: $color-primary;
  line-height: 1.1;
}

.price-card--dark .price-card__currency,
.price-card--dark .price-card__amount {
  color: #f5d98a;
}

.price-card__period {
  font-size: $fs-md;
  color: $color-text-light;
  margin-left: 4rpx;
}

.price-card--dark .price-card__period {
  color: rgba(255, 255, 255, 0.55);
}

.price-card__desc {
  font-size: $fs-sm;
  color: $color-text-secondary;
  line-height: 1.65;
}

.price-card--dark .price-card__desc {
  color: rgba(255, 255, 255, 0.72);
}

.price-card__features {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  flex: 1;
}

.price-card__feature {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.price-card__feature--disabled {
  opacity: 0.42;
}

.price-card__check {
  flex-shrink: 0;
  width: 28rpx;
  font-size: $fs-md;
  font-weight: $fw-medium;
  color: $color-primary;
  line-height: 1.4;
}

.price-card--orange .price-card__check {
  color: $color-primary;
}

.price-card--dark .price-card__check {
  color: #c9a227;
}

.price-card__feature--disabled .price-card__check {
  color: $color-text-light;
}

.price-card__feature-text {
  flex: 1;
  font-size: $fs-sm;
  color: $color-text;
  line-height: 1.5;
}

.price-card--dark .price-card__feature-text {
  color: rgba(255, 255, 255, 0.88);
}

.price-card__divider {
  height: 1rpx;
  margin: 8rpx 0;
  background: $color-border;
}

.price-card--dark .price-card__divider {
  background: rgba(180, 150, 60, 0.35);
}

.price-card__bonus {
  margin-top: $space-sm;
  padding-top: $space-md;
  border-top: 1rpx solid $color-border;
  font-size: $fs-xs;
  color: $color-text-light;
  line-height: 1.5;
}

.price-card--dark .price-card__bonus {
  border-color: rgba(201, 162, 39, 0.3);
  color: rgba(255, 255, 255, 0.55);
}
</style>
