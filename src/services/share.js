import { company } from '@/data/company'

/** 分享文案统一出口，各页 onShareAppMessage 可复用 */

export function getDefaultShare() {
  return {
    title: `${company.brandName} ${company.name}`,
    path: '/pages/home/index',
  }
}
