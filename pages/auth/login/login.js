var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');

var app = getApp();
Page({
  data: {
    source: '',
    showType: 1,
    userInfo: {}
  },
  onLoad: function(options) {
    if(options.source){
      this.setData({
        source: options.source
      })
    }
  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  setStorage: function(e) {
    wx.setStorageSync('userInfo', e.userInfo);
    wx.setStorageSync('token', e.token);
    wx.setStorageSync('openId', e.openId);
    wx.setStorageSync('community', e.community);
  },
  wxLogin: function(e) {
    let that = this;
    let openId = wx.getStorageSync('openId');
    let userInfo = wx.getStorageSync('userInfo');
    if (openId && userInfo){
      util.request(api.AuthLoginByWeixin, {
        openId: openId,
        userInfo: userInfo,
      }, 'POST').then(function (res1) {
        if (res1.errno === 0) {
          that.setStorage(res1.data);
          if(that.data.source != ''){
            wx.redirectTo({
              url: that.data.source
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
        }
      });
    }else{
      if (e.detail.userInfo == undefined) {
        util.showErrorToast('微信登录失败');
        return;
      }
      user.checkLogin().catch(() => {
        this.setData({
          userInfo: {
            avatar: e.detail.userInfo.avatarUrl,
            nickname: e.detail.userInfo.nickName,
            gender: e.detail.userInfo.gender
          }
        })
        user.login().then((res) => {
          let obj = {
            code: res.code,
            userInfo: that.data.userInfo
          }
          if(wx.getStorageSync('invite')){
            obj.inviterId = wx.getStorageSync('invite')
          }
          util.request(api.AuthLoginByWeixinCode, obj, 'POST').then(res1 => {
            if (res1.errno === -1) {
              util.showErrorToast(res1.errmsg)
              return false
            }
            if (res1.data) {
              wx.removeStorageSync('invite')
              this.setStorage(res1.data);
              if(that.data.source != ''){
                wx.redirectTo({
                  url: that.data.source
                })
              }else{
                wx.navigateBack({
                  delta: 1
                })
              }
            } else {
              this.setData({
                showType: 2
              });
            }
          }).catch((err) => {});
        }).catch((err) => {});
        // user.loginByWeixin(userInfo).then(res => {

        //   wx.navigateBack({
        //     delta: 1
        //   })
        // }).catch((err) => {
        //   util.showErrorToast('微信登录失败');
        // });

      });
    }
  },
  getPhoneNumber: function(e) {
    let that = this;
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }
    user.login().then((res) => {
      let obj = {
        code: res.code,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        userInfo: that.data.userInfo
      }
      if(wx.getStorageSync('invite')){
        obj.inviterId = wx.getStorageSync('invite')
      }
      util.request(api.AuthLoginByWeixin, obj, 'POST').then(function (res1) {
        if (res1.errno === 0) {
          wx.removeStorageSync('invite')
          that.setStorage(res1.data);
          if(that.data.source != ''){
            wx.redirectTo({
              url: that.data.source
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
        }
      });
    }).catch((err) => { });
  },
  accountLogin: function() {
    wx.navigateTo({
      url: "/pages/auth/accountLogin/accountLogin"
    });
  }
})