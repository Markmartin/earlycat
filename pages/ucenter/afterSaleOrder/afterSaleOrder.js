// pages/ucenter/afterSaleOrder/afterSaleOrder.js
const { apiRefundOrders } = require('../../../config/request')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: null,
    paper: { page: 1, limit: 10, pages: 0 },
    orderList: [],
    loading: false
  },

  updateStatus(e) {
    const { status } = e.currentTarget.dataset
    this.setData({ status })
    this.reloadOrders()
  },

  async reloadOrders() {
    this.setData({
      paper: { page: 1, limit: 10, pages: 0 }
    })
    await this.updateOrders()
    this.setData({
      loading: false
    })
  },

  loadMoreOrders() {
    const { page, pages } = this.data.paper
    if (page < pages) {
      this.setData({
        'paper.page': page + 1
      })
      this.updateOrders()
    }
  },

  async updateOrders() {
    const { status, paper, orderList } = this.data
    let params = { ...paper }
    if (status) {
      params.status = status
    }
    const response = await apiRefundOrders(params)
    if (response.status) {
      const { page, pages, afterSaleVos } = response.data
      this.setData({
        paper: { page, pages, limit: 10 },
        orderList: paper.page === 1 ? afterSaleVos : orderList.contact(afterSaleVos)
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ status: options.status || null })
    this.reloadOrders()
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
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

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
