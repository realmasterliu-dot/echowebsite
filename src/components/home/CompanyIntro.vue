<template>
  <!--
    我们是谁 + 品牌理念
    品牌理念：对齐 H5 — 每段独立 ScrollRevealText 滚动 scrub 揭示
  -->
  <view class="company section">
    <view class="company__grid">
      <scroll-reveal direction="right" :delay="0.2">
        <view class="company__media">
          <image
            class="company__image"
            :src="images.mockupIntro"
            mode="aspectFill"
          />
        </view>
      </scroll-reveal>

      <view class="company__who">
        <scroll-reveal direction="left" :delay="0.1">
          <text class="company__title">{{ about.whoWeAre.title }}</text>
        </scroll-reveal>

        <scroll-reveal
          v-for="(p, i) in about.whoWeAre.paragraphs"
          :key="i"
          direction="up"
          :delay="0.15 + i * 0.07"
        >
          <text
            class="company__text"
            :class="{ 'company__text--lead': i === 0 }"
          >{{ p }}</text>
        </scroll-reveal>
      </view>
    </view>

    <view class="company__philosophy">
      <scroll-reveal direction="left" :delay="0.05">
        <text class="company__title">{{ about.philosophyTitle }}</text>
      </scroll-reveal>

      <view class="company__philosophy-list">
        <scroll-reveal-text
          v-for="(p, i) in about.philosophyParagraphs"
          :key="i"
          :text="p"
          :base-opacity="0.08"
          :base-rotation="philosophyRotations[i] || 2"
          :stagger="0.04"
          :scrub-lag="1.2"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import ScrollReveal from '@/components/feedback/ScrollReveal.vue'
import ScrollRevealText from '@/components/feedback/ScrollRevealText.vue'
import { about } from '@/data/about'
import { images } from '@/data/assets'

/** 对齐 H5 各段 baseRotation */
const philosophyRotations = [3, 2, 2.5, 2, 3]
</script>

<style lang="scss" scoped>
.company {
  display: flex;
  flex-direction: column;
  gap: $space-xl;
}

.company__grid {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.company__who,
.company__philosophy {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.company__philosophy {
  gap: $space-lg;
}

.company__philosophy-list {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
  width: 100%;
}

.company__title {
  display: block;
  font-size: $fs-display;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: $space-sm;
  text-align: center;
}

.company__text {
  display: block;
  font-size: $fs-sm;
  font-weight: $fw-regular;
  color: $color-text-secondary;
  line-height: 1.95;
}

.company__text--lead {
  color: $color-text;
  font-weight: $fw-medium;
}

.company__media {
  width: 100%;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-md;
}

.company__image {
  width: 100%;
  height: 500rpx;
  display: block;
  background: $color-bg-alt;
}
</style>
