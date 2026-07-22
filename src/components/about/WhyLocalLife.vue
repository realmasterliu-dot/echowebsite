<template>
  <!--
    为什么要做本地生活？
    过渡对齐 H5：标题 right 80px → 内容 up → purple 卡 stagger
  -->
  <view class="why-local why-block">
    <scroll-reveal direction="right" :distance="80">
      <WhyBlockHeader :subtitle="section.subtitle" :title="section.title" align="right" />
    </scroll-reveal>

    <scroll-reveal direction="up" :delay="0.15">
      <view class="why-local__body">
        <view class="why-local__stat">
          <StatNumber
            :value="section.stat.value"
            :suffix="section.stat.suffix"
            :label="section.stat.label"
            :size="section.stat.size || 'lg'"
            count-up
          />
        </view>

        <GrowthChartBars :data="section.growthChart" />
      </view>
    </scroll-reveal>

    <view class="why-local__purple">
      <scroll-reveal v-if="section.subHeading" direction="up" :delay="0.1">
        <text class="why-local__subheading">{{ section.subHeading }}</text>
      </scroll-reveal>

      <view class="why-local__grid">
        <scroll-reveal
          v-for="(b, i) in section.purpleBentos"
          :key="i"
          direction="up"
          :delay="0.1 + i * 0.08"
        >
          <FeatureBento
            :title="b.title"
            :desc="b.desc"
            :icon-key="b.iconKey"
            accent="purple"
          />
        </scroll-reveal>
      </view>
    </view>
  </view>
</template>

<script setup>
import ScrollReveal from '@/components/feedback/ScrollReveal.vue'
import WhyBlockHeader from './WhyBlockHeader.vue'
import StatNumber from './StatNumber.vue'
import GrowthChartBars from './GrowthChartBars.vue'
import FeatureBento from './FeatureBento.vue'

defineProps({
  section: { type: Object, required: true },
})
</script>

<style lang="scss" scoped>
.why-block {
  padding: $space-lg 0;
}

.why-local__body {
  width: 100%;
}

.why-local__stat {
  margin-bottom: $space-md;
}

.why-local__purple {
  margin-top: $space-lg;
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.why-local__subheading {
  display: block;
  font-size: $fs-xl;
  font-weight: $fw-bold;
  color: $color-accent;
  line-height: 1.35;
}

.why-local__grid {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}
</style>
