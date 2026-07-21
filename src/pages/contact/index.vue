<template>
  <PageShell>
    <view class="contact section">
      <SectionHeader
        label="CONTACT"
        title="联系我们"
        desc="骨架页：拨号已接通；服务流程与结语后续完善"
      />

      <view class="contact__phones">
        <button
          v-for="item in contactPhones"
          :key="item.number"
          class="contact__phone-btn tap-reset"
          @click="onCall(item.number)"
        >
          <text class="contact__phone-label">{{ item.label }}</text>
          <text class="contact__phone-number">{{ item.display }}</text>
        </button>
      </view>

      <view class="contact__address">
        <text class="contact__address-label">地址</text>
        <text class="contact__address-text">{{ company.address }}</text>
      </view>
    </view>
  </PageShell>
</template>

<script setup>
import { onShareAppMessage } from '@dcloudio/uni-app'
import PageShell from '@/components/layout/PageShell.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import { company } from '@/data/company'
import { contactPhones } from '@/data/contact'
import { callPhone } from '@/services/phone'
import { getDefaultShare } from '@/services/share'

const onCall = (number) => {
  callPhone(number)
}

onShareAppMessage(() => getDefaultShare())
</script>

<style lang="scss" scoped>
.contact__phones {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.contact__phone-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
  padding: $space-lg;
  background: $color-surface;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  border: 1rpx solid $color-border-light;
  text-align: left;
}

.contact__phone-label {
  font-size: $fs-sm;
  color: $color-text-light;
}

.contact__phone-number {
  font-size: $fs-2xl;
  font-weight: $fw-semibold;
  color: $color-primary;
}

.contact__address {
  margin-top: $space-xl;
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.contact__address-label {
  font-size: $fs-sm;
  color: $color-text-light;
}

.contact__address-text {
  font-size: $fs-md;
  color: $color-text-secondary;
  line-height: 1.6;
}
</style>
