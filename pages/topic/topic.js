var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()
Page({
  data: {
    loading: true,
    page: 1,
    limit: 10,
    pages: 1,
    total: 0,
    topicList: []
  },
  onLoad: function(options) {
    this.getTopic();
  },
  onReachBottom: function () {
    this.getTopic();
  },
  getTopic: function() {
    let that = this;
    if (that.data.page > that.data.pages) {
      return false;
    }
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中...',
    });

    util.request(api.TopicList, {
      page: that.data.page,
      limit: that.data.limit
    }).then(function(res) {
      if (res.errno == 0) {
        that.setData({
          loading: false,
          topicList: that.data.topicList.concat(res.data.list),
          total: res.data.total,
          pages: res.data.pages,
          page: that.data.page += 1
        });
      } else {
        that.setData({
          loading: false
        })
        util.showErrorToast(res.errmsg);
      }
    })
  }
})