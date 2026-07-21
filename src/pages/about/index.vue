<template>
  <PageShell>
    <view class="about section">
      <SectionHeader
        label="ABOUT"
        title="了解更多"
        desc="骨架页：后续拆分为 WhyBrand / WhyLocalLife / WhyCommercialIP / WhyChooseUs"
      />
      <view class="about__slots">
        <view v-for="item in slots" :key="item" class="about__slot">
          <text class="about__slot-text">{{ item }}</text>
        </view>
      </view>
    </view>
  </PageShell>
</template>

<script setup>
import { onShareAppMessage } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import { getDefaultShare } from '@/services/share'

const slots = [
  '为什么要做品牌？',
  '为什么要做本地生活？',
  '为什么要做商业IP？',
  '为什么选择有求必应？',
]

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.about__slots {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.about__slot {
  padding: $space-lg;
  background: $color-surface;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  border: 1rpx solid $color-border-light;
}

.about__slot-text {
  font-size: $fs-lg;
  font-weight: $fw-medium;
  color: $color-text;
}
</style>
