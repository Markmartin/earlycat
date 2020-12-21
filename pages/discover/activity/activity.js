const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    detailsData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.getData();
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
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.ActivityDetail, {
      id: that.data.id
    })
      .then(function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          that.setData({
            detailsData: res.data
          })
        } else {
          util.showErrorToast(res.errmsg);
        }
      });
  }
})