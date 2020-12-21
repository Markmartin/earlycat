const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    loading: false,
    userInfo: {},
    data: {
      invites: 0,
      orders: 0,
      remainingIncome: 0,
      totalIncome: 0,
      withdrawalIncome: 0
    }
  },
  onLoad: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.getData()
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {
    this.getData()
    wx.stopPullDownRefresh();
  },
  getData: function () {
    var that = this;
    if (this.data.loading == true) {
      return false
    }
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.incomeStat).then(function (res) {
      that.setData({
        loading: false
      })
      if (res.errno == 0) {
        that.setData({
          data: res.data
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  }
})