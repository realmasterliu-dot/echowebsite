<template>
  <!--
    联系卡片 — 对应 H5 ContactInfo 左侧 FluidGlass 卡片
    简化玻璃拟态为白底卡片；电话行可一键拨号
  -->
  <view class="contact-panel">
    <view class="contact-panel__brand">
      <image class="contact-panel__logo" :src="images.logoHorizontal" mode="widthFix" />
      <text class="contact-panel__name">{{ company.name }}</text>
    </view>

    <view class="contact-panel__phones">
      <button
        v-for="item in phones"
        :key="item.number"
        class="contact-panel__phone-row tap-reset"
        @click="onCall(item.number)"
      >
        <image
          class="contact-panel__phone-icon"
          :src="resolveIcon('phone')"
          mode="aspectFit"
        />
        <view class="contact-panel__phone-meta">
          <text class="contact-panel__person">{{ item.person }}</text>
          <text class="contact-panel__number">{{ item.display }}</text>
        </view>
        <text class="contact-panel__dial">拨打</text>
      </button>
    </view>

    <view class="contact-panel__address">
      <text class="contact-panel__address-label">地址</text>
      <text class="contact-panel__address-text">{{ company.address }}</text>
    </view>

    <button class="contact-panel__btn tap-reset" @click="onConsult">
      <image
        class="contact-panel__btn-icon"
        :src="resolveIcon('paper-plane-white')"
        mode="aspectFit"
      />
      <text>{{ consult.buttonText }}</text>
    </button>
  </view>
</template>

<script setup>
import { company } from '@/data/company'
import { images } from '@/data/assets'
import { resolveIcon } from '@/data/icons'
import { callPhone } from '@/services/phone'

const props = defineProps({
  phones: { type: Array, required: true },
  consult: { type: Object, required: true },
})

const onCall = (number) => {
  callPhone(number)
}

const onConsult = () => {
  callPhone(props.consult.defaultNumber || props.phones[0]?.number)
}
</script>

<style lang="scss" scoped>
.contact-panel {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
  padding: $space-xl $space-lg;
  background: $color-surface;
  border-radius: $radius-lg;
  border: 1rpx solid $color-border-light;
  box-shadow: $shadow-md;
}

.contact-panel__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
}

.contact-panel__logo {
  width: 100%;
  max-width: 420rpx;
}

.contact-panel__name {
  font-size: $fs-md;
  font-weight: $fw-bold;
  color: $color-text;
  text-align: center;
}

.contact-panel__phones {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.contact-panel__phone-row {
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-md;
  background: $color-bg-alt;
  border-radius: $radius-md;
  text-align: left;
}

.contact-panel__phone-icon {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.contact-panel__phone-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.contact-panel__person {
  font-size: $fs-sm;
  color: $color-text-secondary;
}

.contact-panel__number {
  font-size: $fs-xl;
  font-weight: $fw-semibold;
  color: $color-primary;
}

.contact-panel__dial {
  flex-shrink: 0;
  font-size: $fs-sm;
  color: $color-primary;
  font-weight: $fw-medium;
}

.contact-panel__address {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.contact-panel__address-label {
  font-size: $fs-sm;
  color: $color-text-light;
}

.contact-panel__address-text {
  font-size: $fs-md;
  color: $color-text-secondary;
  line-height: 1.6;
}

.contact-panel__btn {
  @include flex-center;
  gap: $space-sm;
  height: 88rpx;
  border-radius: $radius-full;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
  color: #fff;
  font-size: $fs-lg;
  font-weight: $fw-semibold;
}

.contact-panel__btn-icon {
  width: 36rpx;
  height: 36rpx;
}
</style>
