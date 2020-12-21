const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    searchCover: false,
    loading: false,
    list: [],
    locationFlag: '',
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
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        that.setData({
          locationFlag: true,
          location: res
        })
        that.restList();
      },
      fail (err) {
        that.setData({
          locationFlag: false,
          list: [],
          page: 1,
          limit: 10,
          pages: 1,
          total: 0
        })
      }
    })
  },
  onShow: function () {
    
  },
  onPullDownRefresh: function () {
    if(this.data.locationFlag) {
      this.restList()
    }
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    if(this.data.locationFlag) {
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
    if(this.data.locationFlag){
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
    util.request(api.SecondhandList, {
      page: that.data.page,
      limit: that.data.limit,
      key: that.data.key,
      lat: that.data.location.latitude,
      lng: that.data.location.longitude,
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