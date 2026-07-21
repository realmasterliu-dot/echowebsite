<template>
  <view class="business section">
    <SectionHeader :label="homeBusinessHeader.label" :title="homeBusinessHeader.title" />

    <view class="business__grid">
      <view v-for="item in services" :key="item.title" class="business-card">
        <view class="business-card__icon">
          <image
            v-if="resolveIcon(item.iconKey)"
            class="business-card__icon-img"
            :src="resolveIcon(item.iconKey)"
            mode="aspectFit"
          />
          <text v-else class="business-card__icon-fallback">{{ item.title.slice(0, 1) }}</text>
        </view>
        <view class="business-card__body">
          <text class="business-card__title">{{ item.title }}</text>
          <text class="business-card__desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import SectionHeader from '@/components/layout/SectionHeader.vue'
import { services } from '@/data/services'
import { homeBusinessHeader } from '@/data/home'
import { resolveIcon } from '@/data/icons'
</script>

<style lang="scss" scoped>
.business__grid {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}

.business-card {
  width: 48%;
  box-sizing: border-box;
  min-height: 280rpx;
  padding: $space-md;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.business-card__icon {
  width: 80rpx;
  height: 80rpx;
  @include flex-center;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.12), rgba(255, 130, 0, 0.08));
  flex-shrink: 0;
}

.business-card__icon-img {
  width: 44rpx;
  height: 44rpx;
}

.business-card__icon-fallback {
  font-size: $fs-lg;
  font-weight: $fw-medium;
  color: $color-primary;
}

.business-card__body {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.business-card__title {
  font-size: $fs-lg;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.35;
}

.business-card__desc {
  font-size: $fs-sm;
  color: $color-text-secondary;
  line-height: 1.6;
}

.is-wide .business-card {
  width: 23%;
}
</style>
