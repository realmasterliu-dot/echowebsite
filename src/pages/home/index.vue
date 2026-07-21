<template>
  <PageShell>
    <view class="home">
      <HeroSection />
      <CompanyIntro />
      <BusinessIntro />
      <ContactCta />
    </view>
    <!--
      保留已下线组件进编译图：开发者工具缓存仍可能请求对应 wxml/wxss → ENOENT。
    -->
    <FadeIn v-if="false" />
    <SequentialTypewriter v-if="false" />
  </PageShell>
</template>

<script setup>
import { onPageScroll, onShareAppMessage } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import CompanyIntro from '@/components/home/CompanyIntro.vue'
import BusinessIntro from '@/components/home/BusinessIntro.vue'
import ContactCta from '@/components/home/ContactCta.vue'
import FadeIn from '@/components/feedback/FadeIn.vue'
import SequentialTypewriter from '@/components/feedback/SequentialTypewriter.vue'
import { getDefaultShare } from '@/services/share'

/**
 * 必须在页面声明 onPageScroll，子组件（ScrollReveal 等）内的
 * onPageScroll 才会生效（uni-app / 微信小程序限制）
 */
onPageScroll(() => {})

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
}
</style>
