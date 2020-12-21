// pages/storedValue/index/index.js
const { apiStoredValueCards, apiStoredValueOrder, apiStoredValuePay, apiStoredValueRecords } = require('../../../config/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storedValueCardList: [],
    storedValueRecord: [],
    currentCardIndex: 0,
    paper: { page: 1, limit: 10, pages: 0 }
  },

  async updateStoredValueCard() {
    const response = await apiStoredValueCards()
    if (response.status) {
      this.setData({
        storedValueCardList: response.data
      })
    }
  },

  async updateStoredValueRecord() {
    const response = await apiStoredValueRecords(this.data.paper)
    if (response.status) {
      const { list, pageNum, pages } = response.data
      this.setData({
        storedValueRecord: [...this.data.storedValueRecord, ...list],
        paper: {
          page: pageNum, limit: 10, pages: pages
        }
      })
    }
  },

  loadMoreRecord() {
    const { page, pages } = this.data.paper
    if (page < pages) {
      this.setData({
        ...this.data.paper,
        page: this.data.paper.page + 1
      })
      this.updateStoredValueRecord()
    }
  },

  updateSwiperItemIndex(e) {
    const { source, current } = e.detail
    if (source === 'touch') {
      this.setData({
        currentCardIndex: current
      })
    }
  },

  updateStoredValueText(e) {
    const { index } = e.currentTarget.dataset
    if (index !== this.data.currentCardIndex) {
      this.setData({
        currentCardIndex: index
      })
    }
  },

  gotoAgreement() {
    wx.navigateTo({
      url: '/pages/storedValue/agreement/agreement',
    })
  },

  hideLoading() {
    setTimeout(() => {
      wx.hideLoading()
    }, 2000);
  },

  async pay() {
    wx.showLoading({
      title: '支付请求中', mask: true
    })
    const { storedValueCardList, currentCardIndex } = this.data
    const rechargeId = storedValueCardList[currentCardIndex].id
    const orderResponse = await apiStoredValueOrder(rechargeId)
    if (orderResponse.status) {
      const payResponse = await apiStoredValuePay(orderResponse.data)
      if (payResponse.status) {
        const { timeStamp, nonceStr, packageValue, signType, paySign } = payResponse.data
        wx.requestPayment({
          timeStamp,
          nonceStr,
          package: packageValue,
          signType,
          paySign,
          success(res) {
            wx.showToast({
              title: '储值卡充值成功',
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 0,
              })
            }, 2000);
          },
          fail(res) {
            wx.showToast({
              title: '微信支付失败',
              icon: 'none'
            })
          },
        })
      }

      if (!payResponse.status) {
        this.hideLoading()
      }
    }

    if (!orderResponse.status) {
      this.hideLoading()
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateStoredValueCard()
    this.updateStoredValueRecord()
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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