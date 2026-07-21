<template>
  <!--
    联系我们页 — 对齐 H5：PROCESS 板块 + CONTACT 板块
    App.jsx 中 process / contact 为相邻 section，此处合并为一 Tab 页
  -->
  <PageShell>
    <view class="contact-page">
      <view class="section">
        <SectionHeader :label="processPageHeader.label" :title="processPageHeader.title" />
        <ServiceProcess :steps="serviceProcess" />
      </view>

      <view class="section">
        <SectionHeader :label="contactPageHeader.label" :title="contactPageHeader.title" />
        <ContactPanel :phones="contactPhones" :consult="contactConsult" />
        <ClosingQuote :quote="closingQuote" />
      </view>
    </view>
  </PageShell>
</template>

<script setup>
import { onShareAppMessage } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import ServiceProcess from '@/components/contact/ServiceProcess.vue'
import ContactPanel from '@/components/contact/ContactPanel.vue'
import ClosingQuote from '@/components/contact/ClosingQuote.vue'
import { serviceProcess } from '@/data/process'
import {
  contactPhones,
  closingQuote,
  contactPageHeader,
  processPageHeader,
  contactConsult,
} from '@/data/contact'
import { getDefaultShare } from '@/services/share'

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.contact-page {
  width: 100%;
  padding-bottom: $space-xl;
}
</style>
