<template>
  <!--
    价格页 — 套餐 + 服务流程
    流程原在联系页，现归入本 Tab
  -->
  <PageShell>
    <view :key="contentKey" class="pricing-page">
      <view class="section">
        <SectionHeader :label="pricingPageHeader.label" :title="pricingPageHeader.title" />
        <PricingPlanList :plans="pricingPlans" />
      </view>

      <view class="section">
        <SectionHeader :label="processPageHeader.label" :title="processPageHeader.title" />
        <ServiceProcess :steps="serviceProcess" />
      </view>
    </view>
  </PageShell>
</template>

<script setup>
import { ref } from 'vue'
import { onPageScroll, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import PricingPlanList from '@/components/pricing/PricingPlanList.vue'
import ServiceProcess from '@/components/pricing/ServiceProcess.vue'
import { pricingPlans } from '@/data/pricing'
import { pricingPageHeader, processPageHeader } from '@/data/pricingPage'
import { serviceProcess } from '@/data/process'
import { getDefaultShare } from '@/services/share'
import { handleDockPageScroll, onTabPageShow } from '@/services/tabBar'
import { consumeTabMotionReplay } from '@/services/motionReplay'

const TAB_INDEX = 2
const contentKey = ref(0)

onPageScroll((e) => {
  handleDockPageScroll(e)
})

onShow(() => {
  if (consumeTabMotionReplay(TAB_INDEX)) {
    contentKey.value += 1
  }
  onTabPageShow(TAB_INDEX)
})

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.pricing-page {
  width: 100%;
  padding-bottom: $space-xl;
}
</style>
