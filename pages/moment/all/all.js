const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    status: [{class:'status_green',text: '待审核'},{class:'status_green',text: '审核通过'},{class:'status_gray',text: '审核不通过'},{class:'status_gray',text: '关闭'}],
    url: 'CircleList',
    community: '',
    loading: false,
    list: [],
    page: 1,
    limit: 20,
    pages: 1,
    total: 0,
    circleList: []
  },
  onLoad: function (options) {
    if(options.url){
      this.setData({
        url: options.url
      })
    }
  },
  onShow: function () {
    this.setData({
      community: wx.getStorageSync("community")
    })
    if(this.data.community){
      this.getList();
    }
  },
  onPullDownRefresh: function () {
    if(this.data.community){
      this.restList()
    }
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    if(this.data.community){
      this.getList();
    }
  },
  navClick: function(data){
    this.setData({
      url: data.currentTarget.dataset.url
    })
    this.restList()
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
    util.request(api[that.data.url], {
      page: that.data.page,
      limit: that.data.limit,
      communityId: that.data.community.id
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
  }
})