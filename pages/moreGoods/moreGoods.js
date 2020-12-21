// pages/moreGoods/moreGoods.js
const { apiGoods } = require('../../config/request')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: null,
    title: null,
    goodsList: [],
    paper: { page: 1, limit: 10, pages: 0 }
  },
  async updateGoods() {
    const response = await apiGoods({
      ...this.data.paper,
      ...this.data.type
      // [this.data.type]: true
    })
    if (response.status) {
      const { list, page, limit, pages } = response.data
      this.setData({
        paper: { page, limit, pages },
        goodsList: [...this.data.goodsList, ...list]
      })
    }
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
      this.updateGoods()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type, title } = options
    if (type) {
      this.setData({ type: JSON.parse(type), title })
    }
    this.updateGoods()
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
