<template>
  <!--
    价格套餐列表 — 对应 H5 PricingGrid
    小程序：横向 scroll-view 浏览四档（对齐 H5 窄屏横滑体验）
  -->
  <scroll-view class="pricing-list" scroll-x :show-scrollbar="false">
    <view class="pricing-list__track">
      <PricingCard v-for="plan in plans" :key="plan.id" :plan="plan" />
    </view>
  </scroll-view>
</template>

<script setup>
import PricingCard from './PricingCard.vue'

defineProps({
  plans: { type: Array, required: true },
})
</script>

<style lang="scss" scoped>
.pricing-list {
  width: 100%;
  white-space: nowrap;
}

.pricing-list__track {
  display: inline-flex;
  gap: $space-md;
  padding: 8rpx $page-padding-x $space-md;
  box-sizing: border-box;
}
</style>
