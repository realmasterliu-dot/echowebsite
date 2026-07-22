<template>
  <PageShell>
    <view class="home">
      <!--
        开场层淡出期间仍挂载；正文在 dismiss 时立刻挂上，避免关场异常导致空白
      -->
      <HeroSection
        v-if="showHero"
        @dismiss="onHeroDismiss"
        @gone="onHeroGone"
      />

      <view v-if="showBody" :key="contentKey" class="home__body">
        <CompanyIntro />
        <BusinessIntro />
        <ContactCta />
      </view>
    </view>
    <!--
      保留已下线组件进编译图：开发者工具缓存仍可能请求对应 wxml/wxss → ENOENT。
    -->
    <FadeIn v-if="false" />
    <SequentialTypewriter v-if="false" />
  </PageShell>
</template>

<script setup>
import { ref } from 'vue'
import { onPageScroll, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import CompanyIntro from '@/components/home/CompanyIntro.vue'
import BusinessIntro from '@/components/home/BusinessIntro.vue'
import ContactCta from '@/components/home/ContactCta.vue'
import FadeIn from '@/components/feedback/FadeIn.vue'
import SequentialTypewriter from '@/components/feedback/SequentialTypewriter.vue'
import { getDefaultShare } from '@/services/share'
import { handleDockPageScroll, onTabPageShow } from '@/services/tabBar'
import {
  hasHeroIntroBeenDismissed,
  markHeroIntroDismissed,
} from '@/services/heroIntro'
import { consumeTabMotionReplay } from '@/services/motionReplay'

const TAB_INDEX = 0
const alreadyDismissed = hasHeroIntroBeenDismissed()
const showHero = ref(!alreadyDismissed)
const showBody = ref(alreadyDismissed)
const contentKey = ref(0)

function maybeReplayMotion() {
  if (consumeTabMotionReplay(TAB_INDEX)) {
    contentKey.value += 1
  }
}

function onHeroDismiss() {
  markHeroIntroDismissed()
  showBody.value = true
  maybeReplayMotion()
  onTabPageShow(TAB_INDEX)
}

function onHeroGone() {
  showHero.value = false
}

/**
 * 必须在页面声明 onPageScroll，子组件（ScrollReveal 等）内的
 * onPageScroll 才会生效（uni-app / 微信小程序限制）
 */
onPageScroll((e) => {
  handleDockPageScroll(e)
})

onShow(() => {
  if (showHero.value) {
    onTabPageShow(TAB_INDEX, { keepHidden: true })
    return
  }
  maybeReplayMotion()
  onTabPageShow(TAB_INDEX)
})

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
}
</style>
