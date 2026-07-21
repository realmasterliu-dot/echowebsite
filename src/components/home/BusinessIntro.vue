<template>
  <!--
    对齐 H5 BusinessIntro：
    - CSS Grid 2 列
    - 卡片是 grid 直系子节点（才能量高，同 H5 querySelectorAll('.business-card')）
    - --biz-card-h 统一高度
    - 整卡入场：opacity + translateY stagger（不包自定义 ScrollReveal，避免组件隔离）
  -->
  <view class="business-intro section">
    <scroll-reveal direction="up" :delay="0">
      <view class="business-intro__header">
        <text class="section-label">{{ homeBusinessHeader.label }}</text>
        <text class="business-intro__title">{{ homeBusinessHeader.title }}</text>
      </view>
    </scroll-reveal>

    <view class="business-intro__grid" :style="gridStyle">
      <view
        v-for="(item, i) in services"
        :key="item.title"
        class="business-card"
        :style="cardStyle(i)"
      >
        <view class="business-card__icon">
          <image
            v-if="resolveIcon(item.iconKey)"
            class="business-card__icon-img"
            :src="resolveIcon(item.iconKey)"
            mode="aspectFit"
          />
          <text v-else class="business-card__icon-fallback">{{ item.title.slice(0, 1) }}</text>
        </view>
        <view class="business-card__body">
          <text class="business-card__title">{{ item.title }}</text>
          <text class="business-card__desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ScrollReveal from '@/components/feedback/ScrollReveal.vue'
import { useInViewOnce } from '@/components/feedback/useInViewOnce.js'
import { services } from '@/data/services'
import { homeBusinessHeader } from '@/data/home'
import { resolveIcon } from '@/data/icons'

const instance = getCurrentInstance()
/** 同 H5 --biz-card-h */
const cardHeightPx = ref(0)
const revealReady = ref(false)
const revealed = ref(false)
let timers = []
let measuring = false

const gridStyle = computed(() => {
  if (!cardHeightPx.value) return {}
  // 与 H5 一致：变量挂在 grid 上
  return {
    '--biz-card-h': `${cardHeightPx.value}px`,
  }
})

function cardStyle(index) {
  const delayMs = Math.round(index * 0.05 * 1000)
  const h = cardHeightPx.value
  return {
    // 等高
    ...(h
      ? {
          height: `${h}px`,
          minHeight: `${h}px`,
        }
      : {}),
    // 整卡过渡（mp 内联，见动效约定）
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

/** 对齐 H5 equalize：先清高度 → 量 .business-card → 写回 --biz-card-h */
function equalizeHeights() {
  const proxy = instance?.proxy
  if (!proxy || measuring) return
  measuring = true
  cardHeightPx.value = 0

  nextTick(() => {
    timers.push(
      setTimeout(() => {
        const query = uni.createSelectorQuery().in(proxy)
        query.selectAll('.business-card').boundingClientRect()
        query.exec((res) => {
          measuring = false
          const list = res && res[0]
          const rects = Array.isArray(list) ? list : list ? [list] : []
          if (!rects.length) return
          let max = 0
          rects.forEach((r) => {
            max = Math.max(max, (r && r.height) || 0)
          })
          if (max > 0) {
            cardHeightPx.value = Math.ceil(max)
          }
        })
      }, 32)
    )
  })
}

useInViewOnce({
  selector: '.business-intro__grid',
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
    // 同 H5：布局后再量；字体/图片就绪后再校准
    timers.push(setTimeout(equalizeHeights, 100))
    timers.push(setTimeout(equalizeHeights, 500))
    timers.push(setTimeout(equalizeHeights, 1200))
  })
})

onUnmounted(() => {
  clearTimers()
})
</script>

<style lang="scss" scoped>
.business-intro__header {
  text-align: center;
  margin-bottom: $space-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
}

.business-intro__title {
  font-size: $fs-display;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* 对齐 H5 移动端：2 列 grid */
.business-intro__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-sm;
}

.business-card {
  position: relative;
  box-sizing: border-box;
  background: $color-surface;
  border: 1rpx solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* H5 mobile: height: var(--biz-card-h, auto) */
  height: var(--biz-card-h, auto);
  min-height: 220px;
  will-change: opacity, transform;
}

.business-card__icon {
  width: 80rpx;
  height: 80rpx;
  margin: $space-md $space-md 0;
  @include flex-center;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.12), rgba(255, 130, 0, 0.08));
  flex-shrink: 0;
}

.business-card__icon-img {
  width: 44rpx;
  height: 44rpx;
}

.business-card__icon-fallback {
  font-size: $fs-md;
  font-weight: $fw-medium;
  color: $color-primary;
}

/* H5 mobile：标题齐顶，底部留白 */
.business-card__body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: $space-sm $space-md $space-md;
  flex-grow: 1;
  gap: 8rpx;
}

.business-card__title {
  font-size: $fs-lg;
  font-weight: $fw-bold;
  color: $color-text;
  line-height: 1.35;
}

.business-card__desc {
  font-size: $fs-sm;
  color: $color-text-secondary;
  line-height: 1.6;
}

.is-wide .business-intro__grid {
  grid-template-columns: repeat(4, 1fr);
}
</style>
