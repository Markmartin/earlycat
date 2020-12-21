Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
        "pagePath": "/pages/homepage/homepage",
        "iconPath": "/assets/image/tabBar/homepage.png",
        "selectedIconPath": "/assets/image/tabBar/homepage-tap.png",
        "text": "首页"
      },
      {
        "pagePath": "/pages/catalog/catalog",
        "iconPath": "/assets/image/tabBar/category.png",
        "selectedIconPath": "/assets/image/tabBar/category-tap.png",
        "text": "分类"
      },
      {
        "pagePath": "/pages/cart/cart",
        "iconPath": "/assets/image/tabBar/cart.png",
        "selectedIconPath": "/assets/image/tabBar/cart-tap.png",
        "text": "购物车"
      },
      {
        "pagePath": "/pages/ucenter/index/index",
        "iconPath": "/assets/image/tabBar/me.png",
        "selectedIconPath": "/assets/image/tabBar/me-tap.png",
        "text": "我的"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})