<template>
  <!--
    占位组件：曾用于品牌理念串行打字，已改回对齐 H5 的 ScrollRevealText 滚动 scrub。
    保留进编译图，避免微信开发者工具缓存仍请求本文件 → ENOENT。
  -->
  <view class="sequential-typewriter">
    <slot />
  </view>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.sequential-typewriter {
  width: 100%;
}
</style>
