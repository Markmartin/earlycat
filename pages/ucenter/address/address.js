var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
    page: 1,
    limit: 10,
    pages: 1,
    total: 0
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.restList();
  },
  restList: function () {
    this.setData({
      addressList: [],
      page: 1,
      limit: 10,
      pages: 1,
      total: 0
    });
    this.getAddressList();
  },
  getAddressList() {
    let that = this;
    util.request(api.AddressList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          addressList: res.data.list,
          page: that.data.page += 1,
        });
      }
    });
  },
  addressAddOrUpdate(event) {
    console.log(event)

    //返回之前，先取出上一页对象，并设置addressId
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    if (prevPage.route == "pages/checkout/checkout") {
      try {
        wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);
      } catch (e) {

      }

      let addressId = event.currentTarget.dataset.addressId;
      if (addressId && addressId != 0) {
        wx.navigateBack();
      } else {
        // wx.navigateTo({
        //   url: '/pages/ucenter/addressAdd/addressAdd?id=' + addressId
        // })
        wx.navigateTo({
          url: '/pages/ucenter/addressNew/addressNew?addressId=' + event.currentTarget.dataset.addressId,
        })
      }

    } else {
      // wx.navigateTo({
      //   url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
      // })
      wx.navigateTo({
        url: '/pages/ucenter/addressNew/addressNew?addressId=' + event.currentTarget.dataset.addressId,
      })
    }
  },

  deleteAddress(event) {
    console.log(event.target)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          util.request(api.AddressDelete, {
            id: addressId
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              that.getAddressList();
              wx.removeStorageSync('addressId')
            }
          });
          console.log('用户点击确定')
        }
      }
    })
    return false;

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})