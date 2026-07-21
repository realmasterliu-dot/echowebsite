<template>
  <!--
    了解更多�?�?对应 H5 AboutSection
    仅组装四�?Why 区块；业务数据来�?data/why.js
  -->
  <PageShell>
    <view class="about section">
      <SectionHeader
        :label="aboutPageHeader.label"
        :title="aboutPageHeader.title"
      />

      <WhyBrand :section="byId.brand" />
      <view class="about__divider" />

      <WhyLocalLife :section="byId.localLife" />
      <view class="about__divider" />

      <WhyCommercialIp :section="byId.commercialIP" />
      <view class="about__divider" />

      <WhyChooseUs :section="byId.chooseUs" />
    </view>
  </PageShell>
</template>

<script setup>
import { computed } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import WhyBrand from '@/components/about/WhyBrand.vue'
import WhyLocalLife from '@/components/about/WhyLocalLife.vue'
import WhyCommercialIp from '@/components/about/WhyCommercialIp.vue'
import WhyChooseUs from '@/components/about/WhyChooseUs.vue'
import { whySections, aboutPageHeader } from '@/data/why'
import { getDefaultShare } from '@/services/share'

/** id �?section，避免页面内写死顺序逻辑散落 */
const byId = computed(() => {
  const map = {}
  whySections.forEach((s) => {
    map[s.id] = s
  })
  return map
})

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.about__divider {
  height: 1rpx;
  margin: $space-sm 0;
  background: $color-border;
}
</style>
