<template>
  <!--
    服务流程 6 步 — 对应 H5 ServiceStepper
    去掉 GSAP 入场；保留「外侧序号 + 右侧 bento」布局
  -->
  <view class="service-process">
    <view v-for="item in steps" :key="item.step" class="stepper-row">
      <text class="stepper-row__number">{{ padStep(item.step) }}</text>
      <view class="stepper-bento">
        <view class="stepper-bento__icon">
          <image
            v-if="resolveIcon(item.iconKey)"
            class="stepper-bento__icon-img"
            :src="resolveIcon(item.iconKey)"
            mode="aspectFit"
          />
          <text v-else class="stepper-bento__icon-fallback">{{ item.step }}</text>
        </view>
        <view class="stepper-bento__content">
          <text class="stepper-bento__title">{{ item.title }}</text>
          <text class="stepper-bento__desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { resolveIcon } from '@/data/icons'

defineProps({
  steps: { type: Array, required: true },
})

function padStep(step) {
  return String(step).padStart(2, '0')
}
</script>

<style lang="scss" scoped>
.service-process {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.stepper-row {
  display: flex;
  align-items: stretch;
  gap: $space-md;
}

.stepper-row__number {
  width: 56rpx;
  flex-shrink: 0;
  padding-top: $space-md;
  font-size: $fs-md;
  font-weight: $fw-bold;
  color: $color-primary;
  letter-spacing: 0.04em;
}

.stepper-bento {
  flex: 1;
  display: flex;
  gap: $space-md;
  padding: $space-md;
  background: $color-surface;
  border-radius: $radius-md;
  border: 1rpx solid $color-border-light;
  box-shadow: $shadow-sm;
  box-sizing: border-box;
}

.stepper-bento__icon {
  width: 72rpx;
  height: 72rpx;
  flex-shrink: 0;
  @include flex-center;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.12), rgba(255, 130, 0, 0.08));
}

.stepper-bento__icon-img {
  width: 40rpx;
  height: 40rpx;
}

.stepper-bento__icon-fallback {
  font-size: $fs-md;
  font-weight: $fw-medium;
  color: $color-primary;
}

.stepper-bento__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.stepper-bento__title {
  font-size: $fs-md;
  font-weight: $fw-bold;
  color: $color-text;
  line-height: 1.35;
}

.stepper-bento__desc {
  font-size: $fs-sm;
  color: $color-text-secondary;
  line-height: 1.55;
}
</style>
