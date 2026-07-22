<template>
  <!--
    了解更多页 — 对应 H5 AboutSection
    须声明 onPageScroll，子组件 ScrollReveal / useInViewOnce 才能收到滚动
  -->
  <PageShell>
    <view :key="contentKey" class="about section">
      <scroll-reveal direction="up">
        <SectionHeader
          :label="aboutPageHeader.label"
          :title="aboutPageHeader.title"
        />
      </scroll-reveal>

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
import { computed, ref } from 'vue'
import { onPageScroll, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import ScrollReveal from '@/components/feedback/ScrollReveal.vue'
import WhyBrand from '@/components/about/WhyBrand.vue'
import WhyLocalLife from '@/components/about/WhyLocalLife.vue'
import WhyCommercialIp from '@/components/about/WhyCommercialIp.vue'
import WhyChooseUs from '@/components/about/WhyChooseUs.vue'
import { whySections, aboutPageHeader } from '@/data/why'
import { getDefaultShare } from '@/services/share'
import { handleDockPageScroll, onTabPageShow } from '@/services/tabBar'
import { consumeTabMotionReplay } from '@/services/motionReplay'

const TAB_INDEX = 1
const contentKey = ref(0)

const byId = computed(() => {
  const map = {}
  whySections.forEach((s) => {
    map[s.id] = s
  })
  return map
})

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
.about__divider {
  height: 1rpx;
  margin: $space-sm 0;
  background: linear-gradient(
    90deg,
    transparent,
    $color-border 20%,
    $color-border 80%,
    transparent
  );
}
</style>
