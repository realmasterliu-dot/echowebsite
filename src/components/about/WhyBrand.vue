<template>
  <!--
    为什么要做品牌？
    过渡对齐 H5：标题 left 80px → 内容 up delay 0.15
  -->
  <view class="why-brand why-block">
    <scroll-reveal direction="left" :distance="80">
      <WhyBlockHeader :subtitle="section.subtitle" :title="section.title" align="left" />
    </scroll-reveal>

    <scroll-reveal direction="up" :delay="0.15">
      <view class="why-brand__body">
        <CircleMatrixStatic
          :value="section.circleMatrix.value"
          :suffix="section.circleMatrix.suffix"
          :label="section.circleMatrix.label"
          :fill-count="section.circleMatrix.fillCount"
          :total="section.circleMatrix.total"
          :columns="section.circleMatrix.columns"
          compact
        />

        <view class="why-brand__datapoints">
          <view
            v-for="(d, i) in section.dataPoints"
            :key="i"
            class="why-brand__datapoint"
          >
            <StatNumber
              :value="d.value"
              :suffix="d.suffix"
              :decimals="d.decimals || 0"
              :label="d.label"
              size="md"
              count-up
            />
          </view>
        </view>

        <view class="why-brand__points">
          <FeatureBento
            v-for="(p, i) in section.points"
            :key="i"
            :title="p.title"
            :desc="p.desc"
            :icon-key="p.iconKey"
          />
        </view>
      </view>
    </scroll-reveal>
  </view>
</template>

<script setup>
import ScrollReveal from '@/components/feedback/ScrollReveal.vue'
import WhyBlockHeader from './WhyBlockHeader.vue'
import CircleMatrixStatic from './CircleMatrixStatic.vue'
import StatNumber from './StatNumber.vue'
import FeatureBento from './FeatureBento.vue'

defineProps({
  section: { type: Object, required: true },
})
</script>

<style lang="scss" scoped>
.why-block {
  padding: $space-lg 0;
}

.why-brand__body {
  width: 100%;
}

.why-brand__datapoints {
  display: flex;
  flex-direction: column;
  gap: $space-md;
  margin: $space-md 0 $space-lg;
}

.why-brand__datapoint {
  padding: $space-md;
  background: $color-surface;
  border-radius: $radius-md;
  border: 1rpx solid $color-border-light;
}

.why-brand__points {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}
</style>
