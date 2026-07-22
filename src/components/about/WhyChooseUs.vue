<template>
  <!--
    为什么选择有求必应？
    成果卡纵向；价值观四卡等高（对齐 home BusinessIntro grid 量高）
  -->
  <view class="why-choose why-block">
    <scroll-reveal direction="right" :distance="80">
      <WhyBlockHeader :subtitle="section.subtitle" :title="section.title" align="right" />
    </scroll-reveal>

    <view class="why-choose__results">
      <scroll-reveal
        v-for="(b, i) in section.resultBentos"
        :key="i"
        direction="up"
        :delay="0.1 + i * 0.1"
      >
        <NumberBento
          :value="b.value"
          :suffix="b.suffix"
          :desc="b.desc"
          count-up
        />
      </scroll-reveal>
    </view>

    <view class="why-choose__values" :style="gridStyle">
      <view
        v-for="(v, i) in section.values"
        :key="i"
        class="why-choose-card"
        :style="cardStyle(i)"
      >
        <FeatureBento :title="v.title" :desc="v.desc" :icon-key="v.iconKey" stretch />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ScrollReveal from '@/components/feedback/ScrollReveal.vue'
import { useInViewOnce } from '@/components/feedback/useInViewOnce.js'
import WhyBlockHeader from './WhyBlockHeader.vue'
import NumberBento from './NumberBento.vue'
import FeatureBento from './FeatureBento.vue'

defineProps({
  section: { type: Object, required: true },
})

const instance = getCurrentInstance()
const cardHeightPx = ref(0)
const revealReady = ref(false)
const revealed = ref(false)
let timers = []
let measuring = false

const gridStyle = computed(() => {
  if (!cardHeightPx.value) return {}
  return { '--choose-card-h': `${cardHeightPx.value}px` }
})

function cardStyle(index) {
  const delayMs = Math.round(index * 0.05 * 1000)
  const h = cardHeightPx.value
  return {
    ...(h
      ? {
          height: `${h}px`,
          minHeight: `${h}px`,
        }
      : {}),
    opacity: revealed.value ? 1 : 0,
    transform: revealed.value ? 'translate3d(0, 0, 0)' : 'translate3d(0, 40px, 0)',
    transitionProperty: revealReady.value ? 'opacity, transform' : 'none',
    transitionDuration: '750ms',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: revealed.value ? `${delayMs}ms` : '0ms',
  }
}

function clearTimers() {
  while (timers.length) clearTimeout(timers.pop())
}

function equalizeHeights() {
  const proxy = instance?.proxy
  if (!proxy || measuring) return
  measuring = true
  cardHeightPx.value = 0

  nextTick(() => {
    timers.push(
      setTimeout(() => {
        uni
          .createSelectorQuery()
          .in(proxy)
          .selectAll('.why-choose-card')
          .boundingClientRect()
          .exec((res) => {
            measuring = false
            const list = res && res[0]
            const rects = Array.isArray(list) ? list : list ? [list] : []
            if (!rects.length) return
            let max = 0
            rects.forEach((r) => {
              max = Math.max(max, (r && r.height) || 0)
            })
            if (max > 0) cardHeightPx.value = Math.ceil(max)
          })
      }, 32)
    )
  })
}

useInViewOnce({
  selector: '.why-choose__values',
  triggerRatio: 0.88,
  onEnter: () => {
    nextTick(() => {
      setTimeout(() => {
        revealReady.value = true
        setTimeout(() => {
          revealed.value = true
        }, 32)
      }, 16)
    })
  },
})

onMounted(() => {
  nextTick(() => {
    timers.push(setTimeout(equalizeHeights, 100))
    timers.push(setTimeout(equalizeHeights, 500))
    timers.push(setTimeout(equalizeHeights, 1200))
  })
})

onUnmounted(() => clearTimers())
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-sm;
}

.why-choose-card {
  box-sizing: border-box;
  height: var(--choose-card-h, auto);
  min-height: 180px;
  will-change: opacity, transform;
}
</style>
