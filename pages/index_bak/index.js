const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const app = getApp()

Page({
  data: {
    community: null,
    bannerIndex: 0,
    banner: [],
    menus: [
    {
      id: 5,
      url: "/pages/groupBuying/index/index",
      iconUrl: '/images/menus/5.png',
      name: "访客"
    },
    {
      id: 6,
      url: "/pages/lifePay/index/index",
      iconUrl: '/images/menus/6.png',
      name: "成员"
    },
    {
      id: 7,
      url: "/pages/community/guide/guide",
      iconUrl: '/images/menus/7.png',
      name: "社区指南"
    },
    {
      id: 8,
      url: "/pages/suggest/suggest",
      iconUrl: '/images/menus/8.png',
      name: "投诉建议"
    }],
    noticeIndex: 0,
    notices: [],
    welfare: [],
    activity: [],

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //社区
    navFixed: false,
    type: 'all',
    navList: [
      {
        id: 0,
        type: 'all',
        name: '全城'
      }, {
        id: 1,
        type: 'current',
        name: '本区'
      }
      // , {
      //   id: 2,
      //   type: 'imgtxt',
      //   name: '图说'
      // }
    ],
    list: [],
    page: 1,
    limit: 10,
    pages: 1
  },
  onShareAppMessage: function () {
    return {
      title: '社区',
      path: '/pages/index/index' + util.shareInvite(true)
    }
  },
  onPullDownRefresh() {
    this.getData();
    this.setData({
      list: [],
      page: 1,
      limit: 10,
      pages: 1,
      total: 0,
      communityId: '',
      hasPicture: ''
    });
    this.getList();
    wx.stopPullDownRefresh();
  },
  onPageScroll: function(e) {
    if (e.scrollTop > 200) {
      this.setData({
        navFixed: true
      })
    } else {
      this.setData({
        navFixed: false
      })
    }
  },
  onReachBottom: function() {
    this.getList();
  },
  onLoad: function () {
    if (wx.getStorageSync("community") != undefined) {
      this.setData({
        community: wx.getStorageSync("community")
      });
    }
    wx.showLoading({
      title: '加载中...',
    });
    this.getData();
    this.getList();
    wx.hideLoading();
  },
  onShow: function () {
    if (wx.getStorageSync("community") != undefined) {
      this.setData({
        community: wx.getStorageSync("community")
      });
    }
    if (this.data.community != null && this.data.community != '') {
      wx.setNavigationBarTitle({
        title: this.data.community.name,
      })
    }
  },
  getData: function() {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          banner: res.data.banner,
          activity: res.data.brandList,
          welfare: res.data.newGoodsList
        })
      }
    });
    
    var community = this.data.community;
    if (community) {
      util.request(api.NoticeList, { communityId: community.id}).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            notices: res.data.list
          })
        }
      });
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  pageSkip: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
      success: function (res) { },
      fail: function (res) {
        wx.reLaunch({
          url: e.currentTarget.dataset.url
        })
      }
    })
  },
  getList: function () {
    let that = this;
    if (that.data.page > that.data.pages) {
      return false;
    }
    if (that.data.type === 'current' && that.data.community.id == undefined){
      util.showErrorToast('未加入社区');
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.MomentList, {
      page: that.data.page,
      limit: that.data.limit,
      communityId: that.data.type === 'all' ? '': that.data.community.id,
      hasPicture: that.data.type === 'imgtxt' ? true : ''
    })
      .then(function (res) {
        wx.hideLoading();
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
  clickNav: function (e) {
    this.setData({
      type: e.currentTarget.dataset.id,
      list: [],
      page: 1,
      limit: 10,
      pages: 1,
      total: 0
    });
    if (this.data.type === 'current' && this.data.community.id == undefined) {
      util.showErrorToast('未加入社区');
      return false;
    }
    this.getList();
  },
  navToChatroom: function (e) {
    if (this.data.community.id == undefined) {
      util.showErrorToast('未加入社区');
      return false;
    }
    wx.navigateTo({
      url: '/pages/community/chatRoom/chatRoom'
    })
  },
  imgPreview: function (e) {
    let src = e.currentTarget.dataset.src;
    let imgList = e.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  commentBtn: function () {
    wx.pageScrollTo({
      scrollTop: wx.getSystemInfoSync().screenHeight,
      duration: 300
    })
  },
  likeBtn: function (e) {
    let that = this;
    if (e.currentTarget.dataset.item.liked) {
      wx.showToast({
        title: '已赞',
        icon: 'success',
        duration: 1000
      })
      return;
    }
    wx.showLoading({
      title: '点赞中...',
    });
    util.request(api.LikePost, {
      type: 3,
      valueId: e.currentTarget.dataset.item.id
    }, 'POST')
      .then(function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          e.currentTarget.dataset.item.liked = true;
        } else {
          util.showErrorToast(res.errmsg);
        }
      }).catch(function (reason, data) {

      });
  }
})
