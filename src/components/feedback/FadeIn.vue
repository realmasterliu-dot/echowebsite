<template>
  <!-- 轻量进入动效容器，后续可接滚动可见再触发 -->
  <view
    class="fade-in"
    :class="{ 'fade-in--show': visible }"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  delay: { type: Number, default: 0 },
  /** 是否入场即显示；false 时可由父级控制 visible */
  auto: { type: Boolean, default: true },
})

const visible = ref(!props.auto ? false : false)

onMounted(() => {
  if (props.auto) {
    // 下一帧再开，保证过渡生效
    setTimeout(() => {
      visible.value = true
    }, 30)
  }
})

defineExpose({
  show: () => {
    visible.value = true
  },
})
</script>

<style lang="scss" scoped>
.fade-in {
  opacity: 0;
  transform: translateY(24rpx);
  transition:
    opacity $transition-base,
    transform $transition-base;

  &--show {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
