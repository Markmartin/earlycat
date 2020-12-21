const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    loading: false,
    list: [],
    key: '',
    page: 1,
    limit: 20,
    pages: 1,
    total: 0,
  },
  onLoad: function (options) {
    this.restList();
  },
  onShow: function () {
    
  },
  onPullDownRefresh: function () {
    this.restList()
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    this.getList();
  },
  restList: function(){
    this.setData({
      loading: false,
      list: [],
      page: 1,
      limit: 20,
      pages: 1,
      total: 0
    });
    this.getList()
  },
  getList: function() {
    let that = this;
    if ((that.data.page > that.data.pages) || that.data.loading) {
      return false;
    }
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.incomeUsers, {
      page: that.data.page,
      limit: that.data.limit,
    })
    .then(function (res) {
      that.setData({
        loading: false
      })
      if (res.errno == 0) {
        that.setData({
          list: that.data.list.concat(res.data.list),
          total: res.data.total,
          pages: res.data.pages,
          page: that.data.page += 1
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  },

})