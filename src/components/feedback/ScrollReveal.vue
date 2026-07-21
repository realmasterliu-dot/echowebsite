<template>
  <!--
    滚动揭示 — 对齐 H5 ScrollReveal
    进入视口后 opacity + 位移；触发依赖 useInViewOnce
  -->
  <view class="scroll-reveal" :class="{ 'scroll-reveal--fill': fill }" :style="rootStyle">
    <view
      class="scroll-reveal__target"
      :class="{ 'scroll-reveal__target--show': visible }"
      :style="boxStyle"
    >
      <slot />
    </view>
  </view>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useInViewOnce } from './useInViewOnce.js'

const props = defineProps({
  direction: { type: String, default: 'up' },
  distance: { type: Number, default: 48 },
  duration: { type: Number, default: 0.75 },
  delay: { type: Number, default: 0 },
  triggerRatio: { type: Number, default: 0.85 },
  /** 撑满父级高度（业务卡等高） */
  fill: { type: Boolean, default: false },
})

const visible = ref(false)
const ready = ref(false)

function hiddenTransform() {
  const d = props.distance
  switch (props.direction) {
    case 'down':
      return `translate3d(0, -${d}px, 0)`
    case 'left':
      return `translate3d(${d}px, 0, 0)`
    case 'right':
      return `translate3d(-${d}px, 0, 0)`
    case 'fade':
      return 'translate3d(0, 0, 0)'
    case 'up':
    default:
      return `translate3d(0, ${d}px, 0)`
  }
}

const rootStyle = computed(() =>
  props.fill ? { height: '100%', width: '100%' } : undefined
)

const boxStyle = computed(() => {
  const ms = Math.round(props.duration * 1000)
  const delayMs = Math.round(props.delay * 1000)
  return {
    opacity: visible.value ? 1 : 0,
    transform: visible.value ? 'translate3d(0, 0, 0)' : hiddenTransform(),
    transitionProperty: ready.value ? 'opacity, transform' : 'none',
    transitionDuration: `${ms}ms`,
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: visible.value ? `${delayMs}ms` : '0ms',
    ...(props.fill ? { height: '100%', boxSizing: 'border-box' } : {}),
  }
})

useInViewOnce({
  selector: '.scroll-reveal__target',
  triggerRatio: props.triggerRatio,
  onEnter: () => {
    nextTick(() => {
      setTimeout(() => {
        ready.value = true
        setTimeout(() => {
          visible.value = true
        }, 32)
      }, 16)
    })
  },
})
</script>

<style lang="scss" scoped>
.scroll-reveal,
.scroll-reveal__target {
  width: 100%;
}

.scroll-reveal--fill,
.scroll-reveal--fill .scroll-reveal__target {
  height: 100%;
}

.scroll-reveal__target {
  will-change: opacity, transform;
}
</style>
