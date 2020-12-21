const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    type: 0,
    typeList: ['家政服务','家电维修','周边商家'],
    community: '',
    searchCover: false,
    loading: false,
    list: [],
    location: '',
    key: '',
    page: 1,
    limit: 10,
    pages: 1,
    total: 0,
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
    wx.setNavigationBarTitle({
      title: this.data.typeList[options.type]
    })
    this.setData({
      type: options.type,
      community: wx.getStorageSync("community")
    })
    this.getList();
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
      list: [],
      page: 1,
      limit: 10,
      pages: 1,
      total: 0
    });
    this.getList();
  },
  searchList: function(data){
    this.setData({
      key: data.detail.value
    })
    this.restList()
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
    util.request(api.businessList, {
      type: that.data.type,
      page: that.data.page,
      limit: that.data.limit,
      key: that.data.key,
      lat: that.data.community.latitude,
      lng: that.data.community.longitude,
    })
    .then(function (res) {
      that.setData({
        loading: false
      })
      if (res.errno == 0) {
        that.setData({
          loading: false,
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