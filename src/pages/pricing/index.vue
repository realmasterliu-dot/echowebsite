<template>
  <!-- 价格页 — 对应 H5 PricingGrid -->
  <PageShell>
    <view class="pricing section">
      <SectionHeader :label="pricingPageHeader.label" :title="pricingPageHeader.title" />
      <PricingPlanList :plans="pricingPlans" />
    </view>
  </PageShell>
</template>

<script setup>
import { onShareAppMessage } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import PricingPlanList from '@/components/pricing/PricingPlanList.vue'
import { pricingPlans } from '@/data/pricing'
import { pricingPageHeader } from '@/data/pricingPage'
import { getDefaultShare } from '@/services/share'

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.pricing {
  padding-bottom: $space-xl;
}
</style>
