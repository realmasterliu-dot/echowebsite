<template>
  <!-- 联系我们页 — 对齐 H5 #contact + ContactInfo -->
  <PageShell>
    <view :key="contentKey" class="contact-page section">
      <SectionHeader :label="contactPageHeader.label" :title="contactPageHeader.title" />
      <view class="contact-info">
        <ScrollReveal>
          <ContactPanel :phones="contactPhones" :consult="contactConsult" />
        </ScrollReveal>
        <ScrollReveal direction="up">
          <ClosingQuote :quote="closingQuote" />
        </ScrollReveal>
      </view>
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
import ScrollReveal from '@/components/feedback/ScrollReveal.vue'
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
/* 对齐 Contact.css：顶 xl；底 lg（覆盖全局 .section 的底 xl） */
.contact-page {
  width: 100%;
  padding-bottom: $space-lg;
}

/* 对齐 App.jsx contact 区 marginTop: space-xl */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: $space-md;
  width: 100%;
  margin-top: $space-xl;
  box-sizing: border-box;
}
</style>
