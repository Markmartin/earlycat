const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      }, {
        id: 2,
        type: 'imgtxt',
        name: '图说'
      }
    ],
    list: [],
    page: 1,
    limit: 10,
    pages: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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
  onPageScroll: function (e) {
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
  onReachBottom: function () {
    this.getList();
  },
  getList: function() {
    let that = this;
    if (that.data.page > that.data.pages) {
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.MomentList, {
      page: that.data.page,
      limit: that.data.limit,
      communityId: that.data.type === 'current' ? '' : '',
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
  clickNav: function(e) {
    this.setData({
      type: e.currentTarget.dataset.id,
      list: [],
      page: 1,
      limit: 10,
      pages: 1,
      total: 0
    });
    this.getList();
  },
  imgPreview: function(e) {
    let src = e.currentTarget.dataset.src;
    let imgList = e.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  }
})