// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoSrcOne: '',
    posterOne: '',
    widthOne: 0,
    heightOne: 0,
    videoSrcTwo: '',
    posterTwo: '',
    widthTwo: 0,
    heightTwo: 0
  },

  chooseVideo() {
    let _this = this
    wx.chooseVideo({
      success(res) {
        _this.setData({
          videoSrcOne: res.tempFilePath,
          posterOne: res.thumbTempFilePath,
          widthOne: 750,
          heightOne: res.height
        })
      }
    })
  },

  chooseVideoOther() {
    let _this = this
    wx.chooseVideo({
      success(res) {
        _this.setData({
          videoSrcTwo: res.tempFilePath,
          posterTwo: res.thumbTempFilePath,
          widthTwo: res.width,
          heightTwo: res.height
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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