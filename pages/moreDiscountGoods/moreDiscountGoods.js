// pages/moreDiscountGoods/moreDiscountGoods.js
const { apiDiscountGroup, apiGroupGoods } = require('../../config/request')
const moment = require('moment')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    discountGroup: [],
    discountGoods: [],
    currentGroup: {},
    paper: { page: 0, limit: 10, pages: 0 },
    showMenu: false,
    countDownData: null,
    timeId: null
  },

  async updateDiscountGroup() {
    const response = await apiDiscountGroup()
    if (response.status) {
      const { list } = response.data
      this.setData({
        discountGroup: [...list],
      })
      const group = this.data.discountGroup.find((item) => (moment().isBetween(item.startTime, item.endTime)))
      if (group) {
        this.setData({
          currentGroup: group
        })

        clearInterval(this.data.timeId)
        this.data.timeId = setInterval(this.updateCountDown, 1000)
      }
    }
  },

  updateCountDown() {
    const endTime = moment(this.data.currentGroup.endTime)
    const now = moment()
    this.setData({
      countDownData: moment.duration(endTime.diff(now, 's'), 's')._data
    })
    console.log(moment.duration(endTime.diff(now, 's'), 's')._data)
  },

  async updateDiscountGoods() {
    if (this.data.currentGroup) {
      const response = await apiGroupGoods({
        id: this.data.currentGroup.id, page: this.data.paper.page, limit: this.data.paper.limit
      })
      if (response.status) {
        const { itemVos, page, limit, pages } = response.data
        this.setData({
          paper: { page, limit, pages },
          discountGoods: [...this.data.discountGoods, ...itemVos]
        })
      }
    }
  },

  // 变更组
  tapGroup(e) {
    const { item } = e.currentTarget.dataset
    this.setData({
      currentGroup: item,
      paper: { page: 0, limit: 10, pages: 0 },
      discountGoods: []
    })

    const isWithin = moment().isBetween(item.startTime, item.endTime)
    if (!isWithin) {
      clearInterval(this.data.timeId)
      this.data.timeId = null
      this.setData({ countDownData: null })
    }

    if (isWithin && !this.data.timeId) {
      clearInterval(this.data.timeId)
      this.data.timeId = setInterval(this.updateCountDown, 1000)
    }
    this.updateDiscountGoods()
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
      this.updateDiscountGoods()
    }
  },

  showGroupMenu() {
    this.setData({
      showMenu: !this.data.showMenu
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.updateDiscountGroup()
    await this.updateDiscountGoods()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timeId)
    this.data.timeId = null
    this.setData({ countDownData: null })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timeId)
    this.data.timeId = null
    this.setData({ countDownData: null })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})