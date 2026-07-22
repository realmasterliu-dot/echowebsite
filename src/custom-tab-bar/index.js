Component({
  data: {
    selected: 0,
    /** 开场层强制隐藏（不占位） */
    hidden: false,
    /** 滚动下滑收起（向下滑出） */
    collapsed: false,
    color: '#8A857F',
    selectedColor: '#FF5500',
    list: [
      {
        pagePath: '/pages/home/index',
        text: '首页',
        iconPath: '/assets/icons/tab/home.png',
        selectedIconPath: '/assets/icons/tab/home-active.png',
      },
      {
        pagePath: '/pages/about/index',
        text: '了解更多',
        iconPath: '/assets/icons/tab/about.png',
        selectedIconPath: '/assets/icons/tab/about-active.png',
      },
      {
        pagePath: '/pages/pricing/index',
        text: '价格',
        iconPath: '/assets/icons/tab/pricing.png',
        selectedIconPath: '/assets/icons/tab/pricing-active.png',
      },
      {
        pagePath: '/pages/contact/index',
        text: '联系我们',
        iconPath: '/assets/icons/tab/contact.png',
        selectedIconPath: '/assets/icons/tab/contact-active.png',
      },
    ],
  },
  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      const i = Number(index)
      // 已在当前 Tab：仍回顶部，展示该页初始位置
      if (this.data.selected === i) {
        wx.pageScrollTo({ scrollTop: 0, duration: 0 })
        if (!this.data.hidden) {
          this.setData({ collapsed: false })
        }
        return
      }
      wx.switchTab({
        url: path,
        success: () => {
          // 切页后强制回顶（页面 onShow 也会再调一次）
          setTimeout(() => {
            wx.pageScrollTo({ scrollTop: 0, duration: 0 })
          }, 32)
        },
      })
      this.setData({ selected: i, collapsed: false })
    },
  },
})