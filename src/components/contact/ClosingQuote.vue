<template>
  <!-- 结语区 — 对齐 H5 ContactInfo closing：标题按行拆分 -->
  <view class="closing-quote">
    <view class="closing-quote__title">
      <view
        v-for="(line, li) in titleLines"
        :key="li"
        class="closing-quote__title-line"
      >
        <text
          v-for="(ch, ci) in line"
          :key="ci"
          class="closing-quote__title-char"
          :style="{ color: ch.color }"
        >{{ ch.char }}</text>
      </view>
    </view>
    <text class="closing-quote__content">{{ quote.content }}</text>
    <text class="closing-quote__subtext">{{ quote.subtext }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { splitLines } from '@/utils/format'

const props = defineProps({
  quote: { type: Object, required: true },
})

/** #332c29 → #ff5500，对齐 H5 closing-title 渐变两端 */
const GRADIENT_FROM = [51, 44, 41]
const GRADIENT_TO = [255, 85, 0]

function mixRgb(t) {
  const clamp = Math.min(1, Math.max(0, t))
  const [r0, g0, b0] = GRADIENT_FROM
  const [r1, g1, b1] = GRADIENT_TO
  const r = Math.round(r0 + (r1 - r0) * clamp)
  const g = Math.round(g0 + (g1 - g0) * clamp)
  const b = Math.round(b0 + (b1 - b0) * clamp)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * H5 为整块 background-clip + 135deg；MP 不可靠。
 * 按行拆分（对齐 H5 split('\n')），每行各自左→右同一套色阶。
 * 末字只走到满渐变的约一半（过渡中间色），避免过橙。
 */
const GRADIENT_END_T = 0.5

const titleLines = computed(() =>
  splitLines(props.quote?.title).map((line) => {
    const chars = [...line]
    const total = Math.max(chars.length - 1, 1)
    return chars.map((char, i) => ({
      char,
      color: mixRgb((i / total) * GRADIENT_END_T),
    }))
  }),
)
</script>

<style lang="scss" scoped>
.closing-quote {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: $space-lg;
  box-sizing: border-box;
  text-align: left;
}

.closing-quote__title {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  margin-bottom: $space-sm;
}

.closing-quote__title-line {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  line-height: 1.25;
}

.closing-quote__title-char {
  font-size: 48rpx;
  font-weight: $fw-bold;
  line-height: 1.25;
}

.closing-quote__content {
  font-size: 30rpx;
  color: $color-text-secondary;
  line-height: 1.75;
  margin-bottom: $space-sm;
}

.closing-quote__subtext {
  font-size: 28rpx;
  color: $color-text-light;
  line-height: 1.65;
  font-style: italic;
}
</style>
