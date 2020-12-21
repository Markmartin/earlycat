const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
  data: {
    scrollHeight: 0,
    loading: false,
    list: [],
    page: 1,
    pages: 1,
    limit: 20,
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    that.getGoodsList()
  },
  onShow: function () {

  },
  onReachBottom: function () {
    this.getGoodsList();
  },
  getGoodsList: function() {
    var that = this;
    if ((that.data.page > that.data.pages) || that.data.loading) {
      return false;
    }
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.NoticeList, {
      communityId: wx.getStorageSync("community").id,
      isHome: false,
      page: that.data.page,
      limit: that.data.limit
    }).then(function(res) {
      that.setData({
        loading: false
      })
      if (res.errno == 0) {
        that.setData({
          list: that.data.list.concat(res.data.list),
          pages: res.data.pages,
          page: that.data.page += 1
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  }
})