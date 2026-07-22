<template>
  <!--
    联系卡片 — 对齐 H5 ContactInfo 左侧 FluidGlass 卡片
    电话：图标 | 姓名 | 号码（右对齐）；整行可拨号
  -->
  <view class="contact-panel">
    <view class="contact-panel__brand">
      <image class="contact-panel__logo" :src="images.logoHorizontal" mode="widthFix" />
      <text class="contact-panel__name">{{ company.name }}</text>
    </view>

    <view class="contact-panel__details">
      <view class="contact-panel__phones">
        <view
          v-for="item in phones"
          :key="item.number"
          class="contact-panel__phone-row"
          hover-class="contact-panel__phone-row--active"
          @click="onCall(item.number)"
        >
          <image
            class="contact-panel__icon"
            :src="resolveIcon('phone')"
            mode="aspectFit"
          />
          <text class="contact-panel__person">{{ item.person }}</text>
          <text class="contact-panel__phone">{{ item.display }}</text>
        </view>
      </view>
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
/* 对齐 ContactInfo.css 卡片区；玻璃拟态在 MP 用半透明白 + 柔光近似 */
.contact-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: $space-lg;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.82);
  border: 1rpx solid rgba(255, 255, 255, 0.55);
  border-radius: $radius-md;
  box-shadow:
    $shadow-md,
    0 0 60rpx rgba($color-primary, 0.06),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.45);
}

.contact-panel__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  margin-bottom: $space-md;
}

.contact-panel__logo {
  width: 100%;
  max-width: 560rpx; /* H5 max-width: 280px */
}

.contact-panel__name {
  font-size: 30rpx; /* ≈0.95rem */
  font-weight: $fw-bold;
  color: $color-text;
  text-align: center;
}

.contact-panel__details {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
  margin-bottom: $space-md;
  flex: 1;
}

/* H5：grid 图标 / 姓名 / 号码 */
.contact-panel__phones {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.contact-panel__phone-row {
  display: grid;
  grid-template-columns: 40rpx max-content 1fr;
  align-items: center;
  column-gap: $space-xs;
  padding: $space-xs 0;
}

.contact-panel__phone-row--active {
  opacity: 0.72;
}

.contact-panel__icon {
  width: 40rpx;
  height: 40rpx;
}

.contact-panel__person {
  font-size: 30rpx;
  color: $color-text-secondary;
  white-space: nowrap;
}

.contact-panel__phone {
  font-size: 30rpx;
  font-weight: $fw-semibold;
  color: $color-text;
  text-align: right;
  letter-spacing: 0.02em;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.contact-panel__btn {
  width: 100%;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 28rpx;
  border-radius: $radius-full;
  background: linear-gradient(135deg, $color-primary, $color-primary-dark);
  color: #fff;
  font-size: 30rpx;
  font-weight: $fw-semibold;
  box-shadow: 0 12rpx 48rpx rgba($color-primary, 0.25);
  box-sizing: border-box;
}

.contact-panel__btn-icon {
  width: 32rpx;
  height: 32rpx;
}
</style>
