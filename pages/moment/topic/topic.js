const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    id: '',
    detailsData: '',
    community: wx.getStorageSync("community"),
    loading: false,
    list: [],
    key: '',
    page: 1,
    limit: 20,
    pages: 1,
    total: 0,
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      community: wx.getStorageSync("community")
    })
  },
  onShow: function () {
    if(this.data.community){
      this.getList()
      this.getData()
    }
  },
  onReachBottom: function () {
    if(this.data.community){
      this.getList()
    }
  },
  onPullDownRefresh: function () {
    this.getData()
    this.restList()
    wx.stopPullDownRefresh();
  },
  restList: function(){
    this.setData({
      list: [],
      page: 1,
      limit: 10,
      pages: 1,
      total: 0
    });
    this.getList();
  },
  searchList: function(data){
    if(this.data.community){
      this.setData({
        key: data.detail.value
      })
      this.restList()
    }
  },
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CircleDetail, {
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
    util.request(api.MomentList, {
      circleId: that.data.id,
      page: that.data.page,
      limit: that.data.limit,
      communityId: that.data.community.id,
      key: that.data.key,
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