const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    searchCover: false,
    community: '',
    loading: false,
    list: [],
    key: '',
    page: 1,
    limit: 20,
    pages: 1,
    total: 0,
    circleList: []
  },
  focusSearch: function () {
    this.setData({
      searchCover: true
    })
  },
  blurSearch: function () {
    this.setData({
      searchCover: false
    })
  },
  onLoad: function (options) {
    this.setData({
      community: wx.getStorageSync("community")
    })
    if(this.data.community){
      this.restList()
      this.getCircle()
    }
  },
  onShow: function () {
    
  },
  onPullDownRefresh: function () {
    if(this.data.community){
      this.restList()
      this.getCircle()
    }
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    if(this.data.community){
      this.getList();
    }
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
  getCircle: function () {
    let that = this;
    util.request(api.CircleList, {
      communityId: that.data.community.id,
    })
    .then(function (res) {
      if (res.errno == 0) {
        that.setData({
          circleList: res.data.list
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  }
})