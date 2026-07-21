<template>
  <PageShell>
    <view class="pricing section">
      <SectionHeader
        label="PRICING"
        title="价格"
        desc="骨架页：后续接入 pricingPlans 与 PricingCard 横滑列表"
      />
      <scroll-view class="pricing__scroll" scroll-x :show-scrollbar="false">
        <view class="pricing__track">
          <view v-for="plan in placeholderPlans" :key="plan.name" class="pricing__card">
            <text class="pricing__name">{{ plan.name }}</text>
            <text class="pricing__price">{{ plan.price }}</text>
            <text class="pricing__hint">内容待迁入</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </PageShell>
</template>

<script setup>
import { onShareAppMessage } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import { getDefaultShare } from '@/services/share'

const placeholderPlans = [
  { name: '优选起航', price: '¥6,800' },
  { name: '全量增长', price: '¥8,800' },
  { name: '卓越长赢', price: '¥11,800' },
  { name: '战略全案', price: '¥26,800' },
]

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.pricing__scroll {
  width: 100%;
  white-space: nowrap;
}

.pricing__track {
  display: inline-flex;
  gap: $space-md;
  padding-bottom: $space-sm;
}

.pricing__card {
  display: inline-flex;
  flex-direction: column;
  gap: $space-sm;
  width: 280rpx;
  padding: $space-lg;
  background: $color-surface;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  border: 1rpx solid $color-border-light;
  white-space: normal;
}

.pricing__name {
  font-size: $fs-lg;
  font-weight: $fw-medium;
  color: $color-text;
}

.pricing__price {
  font-size: $fs-2xl;
  font-weight: $fw-bold;
  color: $color-primary;
}

.pricing__hint {
  font-size: $fs-sm;
  color: $color-text-light;
}
</style>
