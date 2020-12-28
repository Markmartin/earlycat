const {
  apiHomePage,
  apiGoods,
  apiGoodGoods,
  apiNewGoods,
  apiHotGoods,
  apiDiscountGroup,
  apiGroupGoods,
  apiPreSaleGroup,
  apiBulkyGoodsGroup,
  apiAddressList
} = require('../../config/request')
const util = require('../../utils/util.js')
const app = getApp()
const moment = require('moment')

Page({
  data: {
    // 海报
    banner: [],
    // 优势
    features: ['• 崇明本地直通车', '• 满29元免运费', '• 24点前下单次日送达'],
    // 分类
    categoryIcon: [
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c1.png', label: '新鲜蔬菜', id: 16 },
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c2.png', label: '水果', id: 17 },
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c3.png', label: '肉禽蛋', id: 18 },
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c4.png', label: '豆制品', id: 19 },
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c5.png', label: '海鲜水产', id: 20 },
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c6.png', label: '乳品烘培', id: 21 },
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c7.png', label: '米面粮油', id: 22 },
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c8.png', label: '方便速食', id: 24 },
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c9.png', label: '酒水饮料', id: 25 },
      { url: 'https://earlycat-app.oss-cn-shanghai.aliyuncs.com/c10.png', label: '快美食', id: 87 },
      // { url: '../../assets/image/category/c10.png', label: '更多', id: 0 }
    ],
    // 大件商品
    bulkyGoods: [],
    // 今日特价
    discountGroup: [],
    currentDiscountGroup: null,
    discountGoods: [],
    timeId: null,
    countDownData: {},
    // 新品
    newGoods: [],
    // 热销品
    hotGoods: [],
    // 好货精选
    goodGoods: [],
    goodGoodsType: { isHot: true },
    // 预售
    preSaleGroup: [],
    // 热销商品
    bestSeller: [],
    paper: { page: 1, limit: 10, pages: 2 },
    showOffAddress: true,
    address: { addressDetail: '上海市' },
    hasLogin: false,
    loading: false,
  },
  // 首页初始化
  async updateHomePage() {
    let resp = await apiHomePage()
    if (resp.status) {
      this.setData({
        ...resp.data
      })
    }
  },

  // 更新大件商品
  async updateBulkyGoods() {
    const response = await apiBulkyGoodsGroup()
    if (response.status && response.data) {
      const bulkyGoodsGroup = response.data.list[0] || null
      if (bulkyGoodsGroup) {
        const goodsResponse = await apiGroupGoods({ id: bulkyGoodsGroup.id, page: 0, limit: 4 })
        if (goodsResponse.status) {
          const { itemVos } = goodsResponse.data
          this.setData({
            bulkyGoods: [...itemVos]
          })
        }
      }
    }
  },

  // 更新限时特惠组
  async updateDiscountGroup() {
    const response = await apiDiscountGroup()
    if (response.status && response.data) {
      const { list } = response.data
      if (list) {
        this.setData({
          discountGroup: [...list]
        })

        const category = this.data.discountGroup.find((item) => moment().isBetween(item.startTime, item.endTime))
        // const category = this.data.discountGroup.find((item) => (item.acStatus == 1))
        if (category) {
          this.setData({ currentDiscountGroup: category })
          clearInterval(this.data.timeId)
          this.data.timeId = setInterval(this.updateCountDown, 1000)
          this.updateDiscountGoods()
        }
      }
    }
  },

  // 倒计时
  updateCountDown() {
    const endTime = moment(this.data.currentDiscountGroup.endTime)
    const now = moment()
    if (now.isAfter(endTime)) {
      this.setData({
        countDownData: moment.duration(now.diff(now, 's'), 's')._data
      })
      return
    }

    if (now.isBefore(endTime)) {
      this.setData({
        countDownData: moment.duration(endTime.diff(now, 's'), 's')._data
      })
      return
    }
  },

  // 更新限时特惠商品
  async updateDiscountGoods() {
    if (this.data.currentDiscountGroup) {
      const response = await apiGroupGoods({ id: this.data.currentDiscountGroup.id, page: 0, limit: 4 })
      if (response.status) {
        const { itemVos } = response.data
        this.setData({
          discountGoods: [...itemVos]
        })
      }
    }
  },

  // 更新精选好货
  async updateGoodGoods() {
    const response = await apiGoodGoods({ page: 0, limit: 4 })
    if (response.status) {
      const { list } = response.data
      this.setData({
        goodGoods: [...list]
      })
    }
  },

  // 更新热卖商品
  async updateHotGoods() {
    const response = await apiHotGoods({ page: 0, limit: 4 })
    if (response.status) {
      const { list } = response.data
      this.setData({
        hotGoods: [...list]
      })
    }
  },

  // 新品尝鲜
  async updateNewGoods() {
    const response = await apiNewGoods({ page: 0, limit: 4 })
    if (response.status) {
      const { list } = response.data
      this.setData({
        newGoods: [...list]
      })
    }
  },

  // 更新预售组
  async updatePreSaleGroup() {
    const response = await apiPreSaleGroup()
    if (response.status && response.data) {
      const { list } = response.data
      if (list) {
        this.setData({
          preSaleGroup: [...list]
        })
      }
    }
  },

  // 更新热销商品
  async updateBestSeller() {
    if (this.data.paper.page < this.data.paper.pages) {
      this.setData({ paper: { ...this.data.paper, page: this.data.paper.page + 1 } })
    }
    const response = await apiGoods(this.data.paper)
    if (response.status) {
      const { list, page, limit, pages } = response.data
      this.setData({
        paper: { page, limit, pages },
        bestSeller: [...this.data.bestSeller, ...list]
      })
    }
  },

  // 更新地址
  async updateAddress() {
    const response = await apiAddressList({ limit: '', page: '' })
    if (response.status) {
      const { list } = response.data
      let defaultAddress = null
      defaultAddress = list.find((item) => item.isDefault === true)
      if (!defaultAddress) {
        defaultAddress = list[0] || { addressDetail: '上海市' }
      }
      this.setData({
        address: defaultAddress
      })
    }
  },

  tapAddress() {
    wx.navigateTo({
      url: '/pages/ucenter/address/address'
    })
  },

  tapSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  getQueryString(url, key) {
    const query = url.split('?')[1]
    const vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] == key) {
        return pair[1]
      }
    }
    return null
  },

  tapBanner(e) {
    const item = e.currentTarget.dataset['item']
    if (item.content.includes('catalog')) {
      app.globalData.categoryId = this.getQueryString(item.content, 'categoryId')
      app.globalData.subCategoryId = this.getQueryString(item.content, 'subCategoryId')
      wx.switchTab({
        url: item.content
      })
      return
    }

    if (item.content !== '/pages/catalog/catalog') {
      wx.navigateTo({
        url: item.content
      })
      return
    }
  },

  tapCategory(e) {
    const id = e.currentTarget.dataset['id']
    app.globalData.categoryId = id
    wx.switchTab({
      url: '/pages/catalog/catalog'
    })
  },

  tapMore(e) {
    const { type, title } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/moreGoods/moreGoods?type=${JSON.stringify(type)}&title=${title}`
    })
  },

  tapMoreDiscountGoods() {
    wx.navigateTo({
      url: '/pages/moreDiscountGoods/moreDiscountGoods'
    })
  },

  tapMorePreSaleGoods() {
    wx.navigateTo({
      url: '/pages/preSale/list/list',
    })
  },

  tapGroupBuying() {
    wx.navigateTo({
      url: '/pages/groupBuying/index/index',
    })
  },

  tapMoreBulkyGoods() {
    wx.navigateTo({
      url: '/pages/moreBulkyGoods/moreBulkyGoods',
    })
  },

  scrollEvent(e) {
    const { scrollTop } = e.detail
    if (scrollTop > 50 && this.data.showOffAddress) {
      this.setData({
        showOffAddress: false
      })
    }
  },

  async initialization() {
    app.updateCartBadge()
    this.updateHomePage()
    this.updateBulkyGoods()
    this.updateDiscountGroup()
    this.updateGoodGoods()
    this.updateHotGoods()
    this.updateNewGoods()
    this.updatePreSaleGroup()
    this.updateBestSeller()
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      this.setData({ hasLogin: true })
      this.updateAddress()
    } else {
      this.setData({ hasLogin: false, address: { addressDetail: '上海市' } })
    }
    this.setData({
      loading: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (options.invite) {
      wx.setStorageSync('invite', options.invite)
    }
    // 分享卡片
    if (options.url) {
      let url = decodeURIComponent(options.url)
      wx.navigateTo({
        url
      })
    }

    // 二维码扫码进入
    // if (options.scene) {
    //   let url = decodeURIComponent(options.scene)
    //   wx.navigateTo({
    //     url
    //   })
    // }
    // 扫码进入
    if (options.scene) {
      //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      var scene = decodeURIComponent(options.scene)
      console.log('scene:' + scene)

      let info_arr = []
      info_arr = scene.split(',')
      let _type = info_arr[0]
      let id = info_arr[1]
      let invite = info_arr[2]

      if (_type == 'goods') {
        wx.setStorageSync('invite', invite)
        wx.navigateTo({
          url: `/pages/goods/goods?id=${id}&presellId=${info_arr[3]}`
          // url: '/pages/goods/goods?id=' + id
        })
      } else if (_type == 'groupon') {
        wx.setStorageSync('invite', invite)
        wx.navigateTo({
          url: '/pages/goods/goods?grouponId=' + id
        })
      } else if (_type == 'invite') {
        wx.setStorageSync('invite', id)
      } else {
        wx.navigateTo({
          url: '/pages/homepage/homepage'
        })
      }
    }

    // util.navigateTo(options) //页面初始化 options为页面跳转所带来的参数
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.initialization()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timeId)
    this.setData({
      timeId: null
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timeId)
    this.setData({
      timeId: null
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '朝菜猫商城',
      path: '/pages/homepage/homepage' + util.shareInvite(true)
    }
  }
})
