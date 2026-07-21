<template>
  <!--
    为什么选择有求必应？
    源：H5 AboutSection + whySections[id=chooseUs]
  -->
  <view class="why-choose why-block">
    <WhyBlockHeader :subtitle="section.subtitle" :title="section.title" align="right" />

    <view class="why-choose__results">
      <NumberBento
        v-for="(b, i) in section.resultBentos"
        :key="i"
        :value="b.value"
        :suffix="b.suffix"
        :desc="b.desc"
      />
    </view>

    <view class="why-choose__values">
      <view v-for="(v, i) in section.values" :key="i" class="why-choose__value-item">
        <FeatureBento :title="v.title" :desc="v.desc" :icon-key="v.iconKey" />
      </view>
    </view>
  </view>
</template>

<script setup>
import WhyBlockHeader from './WhyBlockHeader.vue'
import NumberBento from './NumberBento.vue'
import FeatureBento from './FeatureBento.vue'

defineProps({
  section: { type: Object, required: true },
})
</script>

<style lang="scss" scoped>
.why-block {
  padding: $space-lg 0;
}

.why-choose__results {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  margin-bottom: $space-lg;
}

.why-choose__values {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}

.why-choose__value-item {
  width: 48%;
  box-sizing: border-box;
}
</style>
