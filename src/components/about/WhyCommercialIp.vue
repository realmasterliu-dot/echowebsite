<template>
  <!--
    为什么要做商业IP？
    四卡等高：对齐 home BusinessIntro
    - CSS Grid 2 列，卡为 grid 直系子节点（能量高）
    - 不包 ScrollReveal（组件隔离会破坏量高）
    - 整卡内联入场 stagger
  -->
  <view class="why-ip why-block">
    <scroll-reveal direction="left" :distance="80">
      <WhyBlockHeader :subtitle="section.subtitle" :title="section.title" align="left" />
    </scroll-reveal>

    <view class="why-ip__grid" :style="gridStyle">
      <view
        v-for="(b, i) in section.ipBentos"
        :key="i"
        class="why-ip-card"
        :style="cardStyle(i)"
      >
        <text class="why-ip-card__value">{{ b.value }}</text>
        <text class="why-ip-card__desc">{{ b.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ScrollReveal from '@/components/feedback/ScrollReveal.vue'
import { useInViewOnce } from '@/components/feedback/useInViewOnce.js'
import WhyBlockHeader from './WhyBlockHeader.vue'

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
  return { '--ip-card-h': `${cardHeightPx.value}px` }
})

function cardStyle(index) {
  const delayMs = Math.round((0.1 + index * 0.1) * 1000)
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
          .selectAll('.why-ip-card')
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
  selector: '.why-ip__grid',
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

.why-ip__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-sm;
}

.why-ip-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  padding: $space-lg $space-md;
  border-radius: $radius-md;
  background: linear-gradient(145deg, #ff6a20, #e64d00);
  height: var(--ip-card-h, auto);
  min-height: 160px;
  will-change: opacity, transform;
}

.why-ip-card__value {
  font-size: 76rpx;
  font-weight: $fw-bold;
  color: #fff;
  line-height: 1.1;
  white-space: nowrap;
}

.why-ip-card__desc {
  font-size: $fs-sm;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.65;
}
</style>
