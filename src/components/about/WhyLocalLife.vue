<template>
  <!--
    为什么要做本地生活？
    源：H5 AboutSection + whySections[id=localLife]
    含静态柱状图（无 GSAP）
  -->
  <view class="why-local why-block">
    <WhyBlockHeader :subtitle="section.subtitle" :title="section.title" align="right" />

    <view class="why-local__stat">
      <StatNumber
        :value="section.stat.value"
        :suffix="section.stat.suffix"
        :label="section.stat.label"
        :size="section.stat.size || 'lg'"
      />
    </view>

    <GrowthChartBars :data="section.growthChart" />

    <view class="why-local__purple">
      <text v-if="section.subHeading" class="why-local__subheading">{{ section.subHeading }}</text>
      <view class="why-local__grid">
        <FeatureBento
          v-for="(b, i) in section.purpleBentos"
          :key="i"
          :title="b.title"
          :desc="b.desc"
          :icon-key="b.iconKey"
          accent="purple"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
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
  font-size: $fs-xl;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.4;
}

.why-local__grid {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}
</style>
