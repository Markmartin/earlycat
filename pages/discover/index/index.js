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
    type: 'welfare',
    navList: [
      {
        id: 0,
        type: 'welfare',
        name: '福利'
      }, {
        id: 1,
        type: 'activity',
        name: '活动'
      }
    ],
    welfare_list: [],
    welfare_page: 1,
    welfare_limit: 10,
    welfare_pages: 1,
    welfare_total: 0,
    activity_list: [],
    activity_page: 1,
    activity_limit: 10,
    activity_pages: 1,
    activity_total: 0
  },
  onLoad: function (options) {
    this.setData({
      type: options.type || 'welfare'
    });
    this.getList();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onPullDownRefresh: function () {
    if (this.data.type === 'welfare') {
      this.setData({
        welfare_list: [],
        welfare_page: 1,
        welfare_limit: 10,
        welfare_pages: 1,
        welfare_total: 0
      });
    } else {
      this.setData({
        activity_list: [],
        activity_page: 1,
        activity_limit: 10,
        activity_pages: 1,
        activity_total: 0
      });
    };
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
  clickNav: function (e) {
    this.setData({
      type: e.currentTarget.dataset.id
    });
    if (this.data.type === 'welfare' && this.data.welfare_list.length === 0) {
      this.getWelfareList();
    }
    if (this.data.type === 'activity' && this.data.activity_list.length === 0) {
      this.getActivityList();
    }
  },
  getList: function () {
    if (this.data.type === 'welfare') {
      this.getWelfareList();
    } else {
      this.getActivityList();
    }
  },
  getWelfareList: function () {
    let that = this;
    if (that.data.welfare_page > that.data.welfare_pages) {
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.WelfareList, {
      page: that.data.welfare_page,
      limit: that.data.welfare_limit
    })
      .then(function (res) {
        wx.hideLoading();
        that.setData({
          welfare_list: that.data.welfare_list.concat(res.data.list),
          welfare_total: res.data.total,
          welfare_pages: res.data.pages,
          welfare_page: that.data.welfare_page += 1
        });
      });
  },
  getActivityList: function () {
    let that = this;
    if (that.data.activity_page > that.data.activity_pages) {
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.ActivityList, {
      page: that.data.activity_page,
      limit: that.data.activity_limit
    })
      .then(function (res) {
        wx.hideLoading();
        that.setData({
          activity_list: that.data.activity_list.concat(res.data.list),
          activity_total: res.data.total,
          activity_pages: res.data.pages,
          activity_page: that.data.activity_page += 1
        });
      });
  }
})