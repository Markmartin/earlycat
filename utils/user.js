/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: function() {
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    })
  });
}

/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {

  return new Promise(function(resolve, reject) {
    return login().then((res) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, {
        code: res.code,
        userInfo: userInfo
      }, 'POST').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);

          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function(resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      // checkSession().then(() => {
        resolve(true);
      // }).catch(() => {
      //   reject(false);
      // });
    } else {
      reject(false);
    }
  });
}
// openid自动登录
function loginOpenId() {
  return new Promise(function (resolve, reject) {
    let openId = wx.getStorageSync('openId');
    let userInfo = wx.getStorageSync('userInfo');
    if (openId && userInfo) {
      util.request(api.AuthLoginByWeixin, {
        openId: openId,
        userInfo: userInfo,
      }, 'POST').then(function (res1) {
        if (res1.errno === 0) {
          // that.setStorage(res1.data);
          // wx.navigateBack({
          //   delta: 1
          // })
        }
      });
    }
  });
}

module.exports = {
  loginByWeixin,
  checkLogin,
  login
};