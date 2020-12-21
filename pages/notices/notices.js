// pages/community/details/details.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const WxParse = require('../../lib/wxParse/wxParse.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    type: 'comment',
    detailsData: '',
    detailsToolHeight: 0,
    detailsFooter: true,
    inputValue: '',
    imgList: [],
    htmlContent: '',

    comment_loading: false,
    comment_list: [],
    comment_page: 1,
    comment_limit: 10,
    comment_pages: 1,

    share_loading: false,
    share_list: [],
    share_page: 1,
    share_limit: 10,
    share_pages: 1,

    like_loading: false,
    like_list: [],
    like_page: 1,
    like_limit: 10,
    like_pages: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.getData();
    this.setData({
      detailsToolHeight: wx.getSystemInfoSync().windowHeight - 50
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.commentBtn()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.NoticeDetail, {
      id: that.data.id
    })
      .then(function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          that.setData({
            detailsData: res.data
          })
          if (res.data.type === "0") {
            that.setData({
              htmlContent: res.data.content
            })
            WxParse.wxParse('htmlContent', 'html', that.data.htmlContent, that, 5);
          }
          if(res.data.type === "1") {
            that.setData({
              imgList: res.data.content.split(",")
            })
          }
        } else {
          util.showErrorToast(res.errmsg);
        }
        if (that.data.detailsData.title != null) {
          wx.setNavigationBarTitle({
            title: that.data.detailsData.title
          })
        }
      });
  }
})