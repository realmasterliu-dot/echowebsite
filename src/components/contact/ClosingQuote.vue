<template>
  <!-- 结语区 — 对应 H5 ContactInfo closingQuote -->
  <view class="closing-quote">
    <view class="closing-quote__title">
      <text v-for="(line, i) in titleLines" :key="i" class="closing-quote__title-line">
        {{ line }}
      </text>
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

const titleLines = computed(() => splitLines(props.quote.title))
</script>

<style lang="scss" scoped>
.closing-quote {
  display: flex;
  flex-direction: column;
  gap: $space-md;
  padding: $space-xl 0 $space-lg;
}

.closing-quote__title {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.closing-quote__title-line {
  font-size: $fs-3xl;
  font-weight: $fw-medium;
  color: $color-text;
  line-height: 1.3;
}

.closing-quote__content {
  font-size: $fs-md;
  color: $color-text-secondary;
  line-height: 1.8;
}

.closing-quote__subtext {
  font-size: $fs-sm;
  color: $color-text-light;
  line-height: 1.7;
}
</style>
