const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: ["成功", "无权限", "异常"],
    openType: ["IC卡", "二维码"],
    contHeight: 0,
    type: 'owner',
    limit: 10,      //每页行数
    recordPage: 1,  //页码
    recordPages: 1, //总页数
    recordList: [],
    visitRecordPage: 1,
    visitRecordPages: 1,
    visitRecordList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      contHeight: wx.getSystemInfoSync().windowHeight
    })
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
    this.getRecord();
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
    console.log("onPullDownRefresh")
    this.getRecord();
    wx.stopPullDownRefresh();
  },
  getRecord: function() {
    if(this.data.type === 'owner') {
      this.setData({
        recordPage: 1,
        recordPages: 1,
        recordList: []
      });
      this.getRecordList();
    } else {
      this.setData({
        visitRecordPage: 1,
        visitRecordPages: 1,
        visitRecordList: []
      });
      this.getVisitRecordList();
    }
  },
  getRecordList: function () {
    //console.log("=====owner=======" + this.data.recordPage)
    let that = this;
    if (that.data.recordPage > that.data.recordPages) {
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.OPenRecordList, {
      page: that.data.recordPage,
      limit: that.data.limit
    }, 'GET').then(function (res) {
      wx.hideLoading();
      if (res.errno === 0) {
        //console.log(res.data)
        that.setData({
          recordPage: res.data.pageNum + 1,
          recordPages: res.data.pages,
          recordList: that.data.recordList.concat(res.data.list)
        })
      }
    });
  },
  getVisitRecordList: function () {
    //console.log("=====visit=======")
    let that = this;
    if (that.data.visitRecordPage > that.data.visitRecordPages) {
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.OPenVisitRecordList, {
      page: that.data.visitRecordPage,
      limit: that.data.limit
      }, 'GET').then(function (res) {
      wx.hideLoading();
      if (res.errno === 0) {
        //console.log(res.data.list)
        that.setData({
          visitRecordPage: res.data.pageNum + 1,
          visitRecordPages: res.data.pages,
          visitRecordList: that.data.visitRecordList.concat(res.data.list)
        })
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
  },
  navBtn: function(e) {
    console.log("navBtn")
    this.setData({
      type: e.currentTarget.dataset.type
    })
    this.getRecord();
  }
})