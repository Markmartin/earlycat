const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const WxParse = require('../../../lib/wxParse/wxParse.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    detailsData: '',
    bannerIndex: 0,
    showBannerIndex: 1,
    banner: [
      {
      id: 1,
        url: "http://yanxuan.nosdn.127.net/1541445967645114dd75f6b0edc4762d.png"
      },
      {
        id: 2,
        url: "http://yanxuan.nosdn.127.net/8ca3ce091504f8aa1fba3fdbb7a6e351.png"
      }
    ],
    goods: {},
    groupon: [], //该商品支持的团购规格
    grouponLink: {}, //参与的团购
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '规格数量选择',
    tmpSpecText: '请选择规格数量',
    checkedSpecPrice: 0,
    openAttr: false,
    openShare: false,
    noCollectImage: '/static/images/icon_collect.png',
    hasCollectImage: '/static/images/icon_collect_checked.png',
    collectImage: '/static/images/icon_collect.png',
    shareImage: '',
    isGroupon: false, //标识是否是一个参团购买
    soldout: false,
    canWrite: false, //用户是否获取了保存相册的权限
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.getData();
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
    util.request(api.GoodsDetail, {
      id: that.data.id
    })
      .then(function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          that.setData({
            goods: res.data.info,
            attribute: res.data.attribute,
            issueList: res.data.issue,
            comment: res.data.comment,
            brand: res.data.brand,
            specificationList: res.data.specificationList,
            productList: res.data.productList,
            userHasCollect: res.data.userHasCollect,
            shareImage: res.data.shareImage,
            checkedSpecPrice: res.data.info.retailPrice,
            groupon: res.data.groupon
          });
          
          WxParse.wxParse('goodsDetail', 'html', res.data.info.detail, that);
        } else {
          util.showErrorToast(res.errmsg);
        }
      });
  },
  changeBanner: function(e) {
    this.setData({
      showBannerIndex: e.detail.current+1
    })
  }
})