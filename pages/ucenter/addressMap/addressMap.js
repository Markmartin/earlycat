// pages/ucenter/addressMap/addressMap.js
var QQMapWX = require('../../../lib/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'YQABZ-W52WS-UDOOI-6RKQ4-CBLLE-L3FMN'
});
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityArray: ['上海市'],
    cityIndex: 0,
    keyword: '',
    page: 1,
    limit: 20,
    pages: 1,
    location: {},
    addressList: [],
    timerId: null,
    suggestTimerId: null
  },

  updateLocation() {
    let _this = this
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: function (res) {
        _this.setData({
          location: {
            ...res
          }
        })
        _this.updateNearbyCommunity()
      }
    })
  },

  selectAddress(e) {
    let blockAreaList = ['金山区', '松江区', '青浦区', '奉贤区', '崇明区']
    const { item } = e.currentTarget.dataset
    if (blockAreaList.includes(item.district)) {
      wx.showToast({
        title: '该地址不在配送范围',
        icon: 'none'
      })
      return
    }
    app.globalData.address = item
    wx.navigateBack()
  },

  updateSearchKeyword(e) {
    this.setData({
      keyword: e.detail.value,
      addressList: [],
    })
    this.updateNearbyCommunity()
  },

  updateNearbyCommunity() {
    let _this = this
    if (this.data.timerId) {
      clearTimeout(this.data.timerId)
    }

    this.data.timerId = setTimeout(() => {
      qqmapsdk.getSuggestion({
        keyword: _this.data.keyword || '附近小区',
        region: '上海市',
        region_fix: 1,
        policy: 1,
        location: `${_this.data.location.latitude},${_this.data.location.longitude}`,
        // get_subpois: 1,
        address_format: 'short',
        page_size: 20,
        success: function (res, data) {
          if (res.status === 0) {
            _this.setData({ addressList: [...res.data] })
          }
        },
        fail: function (error) {
          console.log(error)
        }
      })
    }, 500);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateLocation()
    // this.updateNearbyCommunity()
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