<template>
  <PageShell>
    <view class="home">
      <HeroSection />
      <CompanyIntro />
      <BusinessIntro />
      <ContactCta />
    </view>
  </PageShell>
</template>

<script setup>
import { onShareAppMessage } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import CompanyIntro from '@/components/home/CompanyIntro.vue'
import BusinessIntro from '@/components/home/BusinessIntro.vue'
import ContactCta from '@/components/home/ContactCta.vue'
import { getDefaultShare } from '@/services/share'

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
}
</style>
