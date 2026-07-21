<template>
  <!--
    Hero slogan 遮罩揭开 — 对齐 H5 GSAP
    微信端：内联 opacity/transform（同 ScrollReveal），先绘制隐藏态再开 transition
  -->
  <view class="hero" :class="{ 'hero--settle': settle }">
    <canvas
      :id="canvasId"
      class="hero__canvas"
      type="2d"
      :style="canvasStyle"
    />
    <view class="hero__content" :style="contentStyle">
      <view class="hero__slogan">
        <view class="hero__line">
          <view class="hero__line-inner" :style="lineStyle(0, true)">
            <text class="hero__line-text">{{ heroSlogan.kicker }}</text>
          </view>
        </view>

        <view
          v-for="(line, i) in heroSlogan.lines"
          :key="i"
          class="hero__line"
        >
          <view class="hero__line-inner" :style="lineStyle(i + 1, false)">
            <text class="hero__line-text">{{ line.text }}</text>
            <text v-if="line.accent" class="hero__line-text hero__accent">{{ line.accent }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { createGrainientController } from '@/components/shared/useGrainient.js'
import { heroSlogan } from '@/data/home'

const canvasId = 'hero-grainient'
const canvasStyle = ref({
  width: '100%',
  height: '100%',
})

/** 隐藏态已绘制后才允许 transition，避免跳过动画 */
const ready = ref(false)
/** 开始揭开 */
const play = ref(false)
const settle = ref(false)

/** 约一行字高（px），对齐 H5 yPercent≈112 */
const SLIDE_PX = 72

/**
 * @param {number} index
 * @param {boolean} isKicker
 */
function lineStyle(index, isKicker) {
  const delayMs = Math.round((0.6 + index * 0.16) * 1000)
  const shown = play.value
  return {
    opacity: isKicker ? (shown ? 1 : 0) : 1,
    transform: shown ? 'translate3d(0, 0, 0)' : `translate3d(0, ${SLIDE_PX}px, 0)`,
    transitionProperty: ready.value ? 'opacity, transform' : 'none',
    transitionDuration: isKicker ? '1150ms, 900ms' : '1150ms',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: shown ? `${delayMs}ms` : '0ms',
  }
}

const contentStyle = computed(() => ({
  transform: settle.value ? 'scale(0.985)' : 'scale(1)',
  transitionProperty: 'transform',
  transitionDuration: '120ms',
  transitionTimingFunction: 'ease-in-out',
}))

const grainientProps = {
  timeSpeed: 0.55,
  colorBalance: 0,
  warpStrength: 1,
  warpFrequency: 5,
  warpSpeed: 2.5,
  warpAmplitude: 50,
  blendAngle: 0,
  blendSoftness: 0.05,
  rotationAmount: 500,
  noiseScale: 2,
  grainAmount: 0.04,
  grainScale: 0.2,
  grainAnimated: false,
  contrast: 1.5,
  gamma: 1,
  saturation: 1,
  centerX: 0,
  centerY: 0,
  zoom: 0.9,
  color1: '#ff8200',
  color2: '#ff5500',
  color3: '#fbfbfb',
}

const instance = getCurrentInstance()
/** @type {ReturnType<typeof createGrainientController> | null} */
let controller = null
let settleTimers = []

function onAppShow() {
  controller?.start()
}
function onAppHide() {
  controller?.stop()
}

function clearSettleTimers() {
  while (settleTimers.length) {
    clearTimeout(settleTimers.pop())
  }
}

/** 对齐 H5 2.8s 轻微压缩回弹 */
function playSettle() {
  clearSettleTimers()
  settleTimers.push(
    setTimeout(() => {
      settle.value = true
      settleTimers.push(
        setTimeout(() => {
          settle.value = false
        }, 120)
      )
    }, 2800)
  )
}

function startSloganReveal() {
  // 同 ScrollReveal：先画隐藏态 → 开 transition → 再 play
  nextTick(() => {
    setTimeout(() => {
      ready.value = true
      setTimeout(() => {
        play.value = true
        playSettle()
      }, 40)
    }, 50)
  })
}

onMounted(() => {
  controller = createGrainientController({
    proxy: instance?.proxy,
    canvasId,
    getProps: () => grainientProps,
    onReady: ({ cssW, cssH }) => {
      canvasStyle.value = {
        width: `${cssW}px`,
        height: `${cssH}px`,
      }
    },
  })
  setTimeout(() => controller?.queryAndInit(), 80)
  uni.onAppShow(onAppShow)
  uni.onAppHide(onAppHide)

  startSloganReveal()
})

onUnmounted(() => {
  clearSettleTimers()
  uni.offAppShow(onAppShow)
  uni.offAppHide(onAppHide)
  controller?.destroy()
  controller = null
})
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  height: 100vh;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  overflow: hidden;
  background: linear-gradient(145deg, #ff8200 0%, #ff5500 42%, #fbfbfb 100%);
}

.hero__canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 160rpx $page-padding-x 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  will-change: transform;
}

.hero__slogan {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10rpx;
}

/* 遮罩容器：高度固定为行高，裁切上滑文字 */
.hero__line {
  display: block;
  overflow: hidden;
  height: 66rpx;
}

.hero__line-inner {
  display: block;
  white-space: nowrap;
  height: 66rpx;
  will-change: transform, opacity;
}

.hero__line-text {
  color: #ffffff;
  font-size: $fs-3xl;
  font-weight: $fw-medium;
  line-height: 66rpx;
  letter-spacing: -0.02em;
}

.hero__accent {
  color: #ffffff;
}
</style>
