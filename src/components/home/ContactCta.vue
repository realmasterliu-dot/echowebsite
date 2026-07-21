<template>
  <view class="cta">
    <view class="cta__bg" />
    <FadeIn>
      <view class="cta__content">
        <text class="section-label cta__label">{{ homeCta.label }}</text>
        <view class="cta__title-wrap">
          <text class="cta__title">{{ homeCta.titleLines[0] }}</text>
          <text class="cta__title cta__title--accent">{{ homeCta.titleAccent }}</text>
        </view>
        <text class="cta__desc">{{ homeCta.desc }}</text>
        <button class="cta__btn tap-reset" @click="onConsult">
          <text>{{ homeCta.buttonText }}</text>
          <text class="cta__arrow">→</text>
        </button>
      </view>
    </FadeIn>
  </view>
</template>

<script setup>
import FadeIn from '@/components/feedback/FadeIn.vue'
import { homeCta } from '@/data/home'
import { goTab } from '@/services/navigation'

const onConsult = () => {
  goTab('/pages/contact/index')
}
</script>

<style lang="scss" scoped>
.cta {
  position: relative;
  padding: $space-2xl $page-padding-x;
  overflow: hidden;
}

.cta__bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
  background: linear-gradient(
    160deg,
    rgba(255, 85, 0, 0.08) 0%,
    $color-bg-alt 45%,
    rgba(255, 130, 0, 0.12) 100%
  );
}

.cta__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: $space-md;
}

.cta__label {
  margin-bottom: 0;
}

.cta__title-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.cta__title {
  font-size: $fs-3xl;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.25;
}

.cta__title--accent {
  color: $color-primary;
}

.cta__desc {
  font-size: $fs-md;
  color: $color-text-secondary;
  line-height: 1.7;
  max-width: 600rpx;
}

.cta__btn {
  @include flex-center;
  gap: 12rpx;
  margin-top: $space-sm;
  padding: 0 64rpx;
  height: 88rpx;
  border-radius: $radius-full;
  border: 2rpx solid $color-primary;
  background: transparent;
  color: $color-primary;
  font-size: $fs-lg;
  font-weight: $fw-medium;
}

.cta__btn:active {
  background: $color-primary;
  color: #fff;
}

.cta__arrow {
  font-size: $fs-xl;
  line-height: 1;
}
</style>
