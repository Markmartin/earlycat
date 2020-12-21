var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxcode: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    let that = this;
    let community = wx.getStorageSync('community');
    if(community) {
      util.request(api.WxCode, {id: community.id}).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            wxcode: res.data
          });
        }
      });
    }
  },
  openImg: function () {
    wx.previewImage({
      current: this.data.wxcode,
      urls: [this.data.wxcode]
    })
  }
})