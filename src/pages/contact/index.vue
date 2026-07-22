<template>
  <!-- 联系我们页 — 联系信息 + 结语 -->
  <PageShell>
    <view :key="contentKey" class="contact-page section">
      <SectionHeader :label="contactPageHeader.label" :title="contactPageHeader.title" />
      <ContactPanel :phones="contactPhones" :consult="contactConsult" />
      <ClosingQuote :quote="closingQuote" />
    </view>
    <!-- 旧路径占位：流程组件已迁至 pricing，防 DevTools ENOENT -->
    <ServiceProcessStub v-if="false" />
  </PageShell>
</template>

<script setup>
import { ref } from 'vue'
import { onPageScroll, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import ContactPanel from '@/components/contact/ContactPanel.vue'
import ClosingQuote from '@/components/contact/ClosingQuote.vue'
import ServiceProcessStub from '@/components/contact/ServiceProcess.vue'
import {
  contactPhones,
  closingQuote,
  contactPageHeader,
  contactConsult,
} from '@/data/contact'
import { getDefaultShare } from '@/services/share'
import { handleDockPageScroll, onTabPageShow } from '@/services/tabBar'
import { consumeTabMotionReplay } from '@/services/motionReplay'

const TAB_INDEX = 3
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
.contact-page {
  width: 100%;
  padding-bottom: $space-xl;
}
</style>
