<template>
  <!-- 功能点 / 价值观卡片 — 替代 H5 SpotlightCard + FA 图标 -->
  <view class="feature-bento" :class="{ 'feature-bento--accent': accent === 'purple' }">
    <view class="feature-bento__icon">
      <image v-if="iconSrc" class="feature-bento__icon-img" :src="iconSrc" mode="aspectFit" />
      <text v-else class="feature-bento__icon-fallback">{{ fallback }}</text>
    </view>
    <text class="feature-bento__title">{{ title }}</text>
    <text class="feature-bento__desc">{{ desc }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { resolveIcon } from '@/data/icons'

const props = defineProps({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  iconKey: { type: String, default: '' },
  /** orange | purple — purple 对齐 H5 purpleBentos */
  accent: { type: String, default: 'orange' },
})

const iconSrc = computed(() => resolveIcon(props.iconKey))
const fallback = computed(() => (props.title || '?').slice(0, 1))
</script>

<style lang="scss" scoped>
.feature-bento {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  padding: $space-md;
  background: $color-surface;
  border-radius: $radius-md;
  border: 1rpx solid $color-border-light;
  box-sizing: border-box;
}

.feature-bento__icon {
  width: 72rpx;
  height: 72rpx;
  @include flex-center;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.12), rgba(255, 130, 0, 0.08));
}

.feature-bento--accent .feature-bento__icon {
  background: linear-gradient(135deg, rgba(142, 73, 202, 0.16), rgba(142, 73, 202, 0.06));
}

.feature-bento__icon-img {
  width: 40rpx;
  height: 40rpx;
}

.feature-bento__icon-fallback {
  font-size: $fs-lg;
  font-weight: $fw-medium;
  color: $color-primary;
}

.feature-bento--accent .feature-bento__icon-fallback {
  color: $color-accent;
}

.feature-bento__title {
  font-size: $fs-lg;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.35;
}

.feature-bento__desc {
  font-size: $fs-sm;
  color: $color-text-secondary;
  line-height: 1.65;
}
</style>
