<template>
  <PageShell>
    <view class="home">
      <FadeIn>
        <view class="home__hero">
          <text class="home__brand">{{ company.brandName }}</text>
          <text class="home__name">{{ company.name }}</text>
          <view class="home__slogan">
            <text v-for="(line, i) in sloganLines" :key="i" class="home__slogan-line">{{
              line
            }}</text>
          </view>
          <text class="home__positioning">{{ company.positioning }}</text>
        </view>
      </FadeIn>

      <view class="home__placeholder section">
        <SectionHeader
          label="HOME"
          title="首页骨架已就绪"
          desc="后续在 pages/home/sections 填入 Hero / 公司介绍 / 业务 / CTA"
        />
        <button class="home__cta tap-reset" @click="onContact">联系我们</button>
      </view>
    </view>
  </PageShell>
</template>

<script setup>
import { computed } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import FadeIn from '@/components/feedback/FadeIn.vue'
import { company } from '@/data/company'
import { splitLines } from '@/utils/format'
import { goTab } from '@/services/navigation'
import { getDefaultShare } from '@/services/share'

const sloganLines = computed(() => splitLines(company.slogan))

const onContact = () => {
  goTab('/pages/contact/index')
}

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.home__hero {
  @include page-padding-y($space-2xl, $space-xl);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-md;
}

.home__brand {
  font-size: $fs-4xl;
  font-weight: $fw-bold;
  color: $color-primary;
  line-height: 1.2;
}

.home__name {
  font-size: $fs-lg;
  color: $color-text-secondary;
}

.home__slogan {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: $space-sm;
}

.home__slogan-line {
  font-size: $fs-2xl;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.45;
}

.home__positioning {
  margin-top: $space-md;
  font-size: $fs-md;
  color: $color-text-secondary;
  line-height: 1.7;
}

.home__cta {
  @include flex-center;
  width: 100%;
  height: 88rpx;
  margin-top: $space-lg;
  border-radius: $radius-full;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
  color: #fff;
  font-size: $fs-lg;
  font-weight: $fw-medium;
}
</style>
