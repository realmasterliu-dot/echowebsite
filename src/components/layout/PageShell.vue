<template>
  <view
    class="page-root"
    :class="layoutClass"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
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
import { onDockTouchStart, onDockTouchEnd } from '@/services/tabBar'

const layoutClass = ref({})

const refreshLayout = () => {
  initSystemInfo()
  layoutClass.value = getLayoutFlags()
}

function onTouchStart() {
  onDockTouchStart()
}

function onTouchEnd() {
  onDockTouchEnd()
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
