<template>
  <view class="page-root" :class="layoutClass">
    <view class="page-shell">
      <view class="page-shell__inner">
        <slot />
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getLayoutFlags, initSystemInfo } from '@/utils/system'

const layoutClass = ref({})

const refreshLayout = () => {
  initSystemInfo()
  layoutClass.value = getLayoutFlags()
}

onMounted(() => {
  refreshLayout()
})

defineExpose({ refreshLayout })
</script>

<style lang="scss" scoped>
.page-root {
  width: 100%;
  min-height: 100vh;
  background-color: $color-bg;
}
</style>
