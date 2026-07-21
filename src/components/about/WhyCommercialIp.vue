<template>
  <!--
    为什么要做商业IP？
    源：H5 AboutSection + whySections[id=commercialIP]
  -->
  <view class="why-ip why-block">
    <WhyBlockHeader :subtitle="section.subtitle" :title="section.title" align="left" />

    <view class="why-ip__grid">
      <view v-for="(b, i) in section.ipBentos" :key="i" class="why-ip__item">
        <NumberBento :value="b.value" :desc="b.desc" />
      </view>
    </view>
  </view>
</template>

<script setup>
import WhyBlockHeader from './WhyBlockHeader.vue'
import NumberBento from './NumberBento.vue'

defineProps({
  section: { type: Object, required: true },
})
</script>

<style lang="scss" scoped>
.why-block {
  padding: $space-lg 0;
}

.why-ip__grid {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}

.why-ip__item {
  width: 48%;
  box-sizing: border-box;
}
</style>
