// pages/preSale/list/list.js
const { apiPreSaleGroup, apiGroupGoods } = require('../../../config/request')
const moment = require('moment')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    preSaleCategory: [],
    preSaleGoods: [],
    currentId: null,
    currentCategory: {},
    paper: { page: 1, limit: 10, pages: 0 },
    showMenu: false,
    countDownData: {},
    timeId: null,
    countDownTitle: ''
  },
  // 更新预售组
  async updatePreSaleCategory() {
    let resp = await apiPreSaleGroup({ limit: '', page: '' })
    if (resp.status) {
      let match = null
      const categoryList = resp.data.list.map((item) => ({ ...item, estimatedDeliveryDate: moment(item.deliveryTime).format('MM月DD日') }))
      if (this.data.currentId) {
        let _this = this
        match = categoryList.find((item) => item.id === _this.data.currentId)
      }

      this.setData({
        preSaleCategory: [...categoryList],
        currentId: this.data.currentId || resp.data.list[0].id,
        currentCategory: match || categoryList[0]
      })
      if (this.data.timeId) {
        clearInterval(this.data.timeId)
      }
      this.data.timeId = setInterval(this.updateCountDown, 1000)
    }
  },
  // 更新预售组商品
  async updatePreSaleGoods() {
    let resp = await apiGroupGoods({
      id: this.data.currentId,
      page: this.data.paper.page,
      limit: this.data.paper.limit
    })
    if (resp.status) {
      const { itemVos, page, limit, pages } = resp.data
      this.setData({
        paper: {
          page,
          limit,
          pages
        },
        preSaleGoods: [...this.data.preSaleGoods, ...itemVos]
      })
    }
  },
  // 变更预售组
  tapCategory(e) {
    const { id, item } = e.currentTarget.dataset
    this.setData({
      currentId: id,
      currentCategory: item,
      paper: { page: 1, limit: 10, pages: 0 },
      preSaleGoods: []
    })
    this.updatePreSaleGoods()
  },
  // 倒计时
  updateCountDown() {
    const { startTime, endTime } = this.data.currentCategory
    const now = moment()
    let compareTime = null
    if (now.isBefore(startTime)) {
      compareTime = moment(startTime)
      this.setData({
        countDownTitle: '离开始'
      })
    }

    if (now.isBetween(startTime, endTime)) {
      compareTime = moment(endTime)
      this.setData({
        countDownTitle: '离结束'
      })
    }

    if (now.isAfter(endTime)) {
      compareTime = now
      this.setData({
        countDownTitle: '已经结束'
      })
    }

    this.setData({
      countDownData: moment.duration(compareTime.diff(now, 's'), 's')._data
    })
    console.log(moment.duration(compareTime.diff(now, 's'), 's')._data)

  },
  // 加载更多
  loadMoreGoods() {
    if (this.data.paper.page < this.data.paper.pages) {
      this.setData({
        paper: {
          ...this.data.paper,
          page: this.data.paper.page + 1
        }
      })
      this.updatePreSaleGoods()
    }
  },
  showCategoryMenu() {
    this.setData({
      showMenu: !this.data.showMenu
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { groupId } = options
    if (groupId) {
      this.setData({
        currentId: Number(groupId)
      })
    }
    await this.updatePreSaleCategory()
    await this.updatePreSaleGoods()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

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
  onShareAppMessage: function () { }
})
