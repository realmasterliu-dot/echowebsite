<script setup>
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { initSystemInfo } from '@/utils/system'

onLaunch(() => {
  initSystemInfo()
})

onShow(() => {
  // 从后台回前台时可按需刷新系统信息（旋转 / 分屏）
})
</script>

<style lang="scss">
@import '@/styles/reset.scss';
@import '@/styles/responsive.scss';
@import '@/styles/animations.scss';
</style>
