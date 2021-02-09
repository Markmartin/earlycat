//app.js
var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./utils/user.js');
const { apiCartGoodsCount } = require('./config/request')

const { springFestivalTips } = require('./utils/tips.js')
import 'umtrack-wx';

App({
  umengConfig: {
    appKey: '5f4f85c5636b2b13182b868b', //由友盟分配的APP_KEY
    useOpenid: true, //使用openId
    autoGetOpenid: true, // 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
    debug: true, //是否打开调试模式
    uploadUserInfo: true // 自动上传用户信息，设为false取消上传，默认为false
  },
  onLaunch: function () {
    const updateManager = wx.getUpdateManager();
    wx.getUpdateManager().onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          updateManager.applyUpdate()
          // if (res.confirm) {
          //   // try {
          //   //   wx.clearStorageSync()
          //   // } catch(e) {
          //   // }
          //   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          //   updateManager.applyUpdate()
          // }
        }
      })
    })
  },
  onShow: function (options) {
    springFestivalTips()
    user.checkLogin().then(res => {
      this.globalData.hasLogin = true;
      this.globalData.userInfo = wx.getStorageSync('userInfo');
    }).catch(() => {
      this.globalData.hasLogin = false;
      this.globalData.userInfo = '';
    });
  },

  async updateCartBadge() {
    const response = await apiCartGoodsCount()
    if (response.status) {
      this.globalData.cartGoodsCount = response.data
    }

    if (this.globalData.cartGoodsCount > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: this.globalData.cartGoodsCount.toString(),
      })
      return
    }

    if (this.globalData.cartGoodsCount <= 0) {
      wx.removeTabBarBadge({
        index: 2,
      })
      return
    }
  },

  globalData: {
    hasLogin: false,
    userInfo: '',
    categoryId: 0,
    address: null,
    cartGoodsCount: 0
  }
})