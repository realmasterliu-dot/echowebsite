<template>
  <!--
    Hero 首屏层级方案（微信现行推荐）：
    - type="2d" canvas 默认「同层渲染」→ 可用普通 view 覆盖，cover-view 会失效
    - canvas 与文案同父平级；文案用相对定位 + 更高 z-index
  -->
  <view class="hero">
    <canvas
      :id="canvasId"
      class="hero__canvas"
      type="2d"
      :style="canvasStyle"
    />
    <view class="hero__content">
      <view class="hero__slogan">
        <text class="hero__line hero__line--kicker">{{ heroSlogan.kicker }}</text>
        <view
          v-for="(line, i) in heroSlogan.lines"
          :key="i"
          class="hero__line"
        >
          <text>{{ line.text }}</text>
          <text v-if="line.accent" class="hero__accent">{{ line.accent }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { createGrainientController } from '@/components/shared/useGrainient.js'
import { heroSlogan } from '@/data/home'
import { images } from '@/data/assets'

const canvasId = 'hero-grainient'
const canvasStyle = ref({
  width: '100%',
  height: '100%',
})

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
  controller?.start()
}
function onAppHide() {
  controller?.stop()
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
})

onUnmounted(() => {
  uni.offAppShow(onAppShow)
  uni.offAppHide(onAppHide)
  controller?.destroy()
  controller = null
})
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  /* 明确高度，避免仅 min-height 时绝对定位子元素百分比高度算成 0 */
  height: 100vh;
  /* 冲出 PageShell 左右 page-padding，背景/canvas 贴齐屏幕左右边 */
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
  /* 文案仍保留左右内边距；仅背景全宽 */
  padding: 160rpx $page-padding-x 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero__logo {
  height: 88rpx;
  width: auto;
  margin-bottom: 48rpx;
}

.hero__slogan {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero__line {
  color: #ffffff;
  font-size: 56rpx;
  font-weight: $fw-medium;
  line-height: 1.25;
  margin-bottom: 12rpx;
}

.hero__line--kicker {
  font-size: 48rpx;
  margin-bottom: 20rpx;
  opacity: 0.95;
}

.hero__accent {
  color: #ffffff;
}
</style>
