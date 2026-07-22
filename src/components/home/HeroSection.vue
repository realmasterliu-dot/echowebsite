<template>
  <!--
    一次性开场层 — canvas + slogan
    点击或上下滑关闭 → 卸载；当次进入小程序不再出现
  -->
  <view
    class="hero"
    :class="{ 'hero--leaving': leaving }"
    :style="rootStyle"
    @tap="onTap"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @touchmove.stop.prevent="onTouchMove"
  >
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

      <text class="hero__hint" :style="hintStyle">点击或上滑继续</text>
    </view>
  </view>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { createGrainientController } from '@/components/shared/useGrainient.js'
import { heroSlogan } from '@/data/home'

const emit = defineEmits(['dismiss', 'gone'])

const canvasId = 'hero-grainient'
const canvasStyle = ref({
  width: '100%',
  height: '100%',
})

const ready = ref(false)
const play = ref(false)
const settle = ref(false)
const leaving = ref(false)
const canDismiss = ref(false)

/** 约一行字高（px），对齐 H5 yPercent≈112 */
const SLIDE_PX = 72
/** 开场最少展示后再允许关闭 */
const DISMISS_LOCK_MS = 900
const SWIPE_THRESHOLD = 56

const touchStartY = ref(0)
let settleTimers = []
let lockTimer = null
let leaveTimer = null
let dismissed = false

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

const rootStyle = computed(() => ({
  opacity: leaving.value ? 0 : 1,
  transform: leaving.value ? 'translate3d(0, -24px, 0)' : 'translate3d(0, 0, 0)',
  transitionProperty: 'opacity, transform',
  transitionDuration: '420ms',
  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
}))

const contentStyle = computed(() => ({
  transform: settle.value ? 'scale(0.985)' : 'scale(1)',
  transitionProperty: 'transform',
  transitionDuration: '120ms',
  transitionTimingFunction: 'ease-in-out',
}))

const hintStyle = computed(() => ({
  opacity: canDismiss.value && !leaving.value ? 0.85 : 0,
  transitionProperty: 'opacity',
  transitionDuration: '400ms',
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

function onAppShow() {
  if (!leaving.value) controller?.start()
}
function onAppHide() {
  controller?.stop()
}

function clearSettleTimers() {
  while (settleTimers.length) {
    clearTimeout(settleTimers.pop())
  }
}

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

function dismiss() {
  if (dismissed || !canDismiss.value || leaving.value) return
  dismissed = true
  leaving.value = true

  // 先通知父级挂载正文，避免销毁动画抛错时页面空白
  emit('dismiss')

  try {
    controller?.stop()
  } catch {
    // ignore
  }

  leaveTimer = setTimeout(() => {
    try {
      controller?.destroy()
    } catch {
      // ignore
    }
    controller = null
    emit('gone')
  }, 430)
}

function onTap() {
  dismiss()
}

function onTouchStart(e) {
  const t = e.changedTouches?.[0] || e.touches?.[0]
  touchStartY.value = t ? t.clientY : 0
}

function onTouchMove() {
  // stop.prevent：开场层期间不带动底层页面滚动
}

function onTouchEnd(e) {
  const t = e.changedTouches?.[0]
  if (!t) return
  const dy = t.clientY - touchStartY.value
  if (Math.abs(dy) >= SWIPE_THRESHOLD) {
    dismiss()
  }
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
  lockTimer = setTimeout(() => {
    canDismiss.value = true
  }, DISMISS_LOCK_MS)
})

onUnmounted(() => {
  clearSettleTimers()
  if (lockTimer) clearTimeout(lockTimer)
  if (leaveTimer) clearTimeout(leaveTimer)
  uni.offAppShow(onAppShow)
  uni.offAppHide(onAppHide)
  controller?.destroy()
  controller = null
})
</script>

<style lang="scss" scoped>
.hero {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
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
  padding: 160rpx $page-padding-x 120rpx;
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

.hero__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(48rpx + constant(safe-area-inset-bottom));
  bottom: calc(48rpx + env(safe-area-inset-bottom));
  text-align: center;
  font-size: $fs-xs;
  font-weight: $fw-medium;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.88);
  pointer-events: none;
}
</style>
