const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectCommunity: '',
    community: '',
    selectId: 0,
    list: [
      { id: 0, value: '业主' },
      { id: 1, value: '家属' },
      { id: 2, value: '租客' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.dataObj) {
      this.data.selectCommunity = JSON.parse(options.dataObj);
      this.setData({
        community: this.data.selectCommunity.name
      })
    }
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
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  radioChange: function (e) {
    this.setData({
      selectId: e.currentTarget.dataset.id
    })
  },
  selectBtn: function() {
    wx.navigateTo({
      url: '/pages/community/selectCommunity/selectCommunity'
    })
  }
})