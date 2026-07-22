# 价格组件

对应 H5：`pricing/PricingGrid.jsx` + `contact/ServiceStepper.jsx`  
数据：`src/data/pricing.js` + `pricingPage.js` + `process.js`

| 文件                  | 职责                                |
| --------------------- | ----------------------------------- |
| `PricingCard.vue`     | 单套餐卡片（light / orange / dark） |
| `PricingPlanList.vue` | 横向滚动四档列表                    |
| `ServiceProcess.vue`  | 6 步服务流程                        |

页面组装：`pages/pricing/index.vue`（套餐 + 服务流程）
