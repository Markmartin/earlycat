const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    limit: 10,
    pages: 1,
    total: 0
  },
  onShow: function () {
    this.restList();
  },
  restList: function(){
    this.setData({
      list: [],
      page: 1,
      limit: 10,
      pages: 1,
      total: 0
    });
    this.getData();
  },
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CommunityListSelf, {}).then(function (res) {
      if (res.errno == 0) {
        that.setData({
          page: that.data.page += 1,
          list: res.data
        });
        if(that.data.list.length == 0){
          wx.removeStorageSync('community')
        }
        for(let idx in that.data.list){
          if(that.data.list[idx].active){
            wx.setStorageSync('community', that.data.list[idx])
            break
          }
        }
      } else {
        that.setData({
          list: []
        });
        util.showErrorToast(res.errmsg);
      }
    });
  },
  delCommunity: function (e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除当前小区吗？',
      success (res) {
        if (res.confirm) {
          util.request(api.CommunityDelete, { userCommunityId: e.currentTarget.dataset.id}, 'POST').then(function (res) {
            if (res.errno === 0) {
              that.getData();
            }else{
              wx.showToast({
                title: res.errmsg,
                icon: 'none'
              })
            }
          });
        }
      }
    })
  },
  cutCommunity: function (e) {
    let that = this;
    util.request(api.CommunityActive, { userCommunityId: e.currentTarget.dataset.id}, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.getData();
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'none'
        })
      }
    });
  }
})