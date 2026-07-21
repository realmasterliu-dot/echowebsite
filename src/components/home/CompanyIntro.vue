<template>
  <view class="company section">
    <FadeIn>
      <view class="company__who">
        <text class="company__title">{{ about.whoWeAre.title }}</text>
        <text
          v-for="(p, i) in about.whoWeAre.paragraphs"
          :key="i"
          class="company__text"
          :class="{ 'company__text--lead': i === 0 }"
        >
          {{ p }}
        </text>
      </view>
    </FadeIn>

    <FadeIn :delay="80">
      <view class="company__media">
        <image class="company__image" :src="images.mockupIntro" mode="aspectFill" />
      </view>
    </FadeIn>

    <FadeIn :delay="120">
      <view class="company__philosophy">
        <text class="company__title">{{ about.philosophyTitle }}</text>
        <text v-for="(p, i) in about.philosophyParagraphs" :key="i" class="company__text">
          {{ p }}
        </text>
      </view>
    </FadeIn>
  </view>
</template>

<script setup>
import FadeIn from '@/components/feedback/FadeIn.vue'
import { about } from '@/data/about'
import { images } from '@/data/assets'
</script>

<style lang="scss" scoped>
.company {
  display: flex;
  flex-direction: column;
  gap: $space-xl;
}

.company__who,
.company__philosophy {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.company__title {
  font-size: $fs-3xl;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.2;
  margin-bottom: $space-sm;
}

.company__text {
  font-size: $fs-md;
  font-weight: $fw-regular;
  color: $color-text-secondary;
  line-height: 1.85;
}

.company__text--lead {
  color: $color-text;
}

.company__media {
  width: 100%;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-md;
}

.company__image {
  width: 100%;
  height: 420rpx;
  background: $color-bg-alt;
}
</style>
