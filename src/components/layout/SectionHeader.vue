<template>
  <view class="section-header" :class="{ 'section-header--left': align === 'left' }">
    <text v-if="label" class="section-label">{{ label }}</text>
    <text v-if="title" class="section-title">{{ title }}</text>
    <text v-if="desc" class="section-desc">{{ desc }}</text>
  </view>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  align: { type: String, default: 'center' }, // center | left
})
</script>

<style lang="scss" scoped>
.section-header {
  text-align: center;
  margin-bottom: $space-lg;

  &--left {
    text-align: left;
  }
}
</style>
