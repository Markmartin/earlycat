var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const { springFestivalTips } = require('../../utils/tips')
const { apiGenerateOrder, apiOrderPay, apiUserInfo } = require('../../config/request')

var app = getApp();

Page({
  data: {
    payFlag: false,
    orderSubmitFlag: false,
    selfPickupCoupons: [],
    deliveryType: [
      { name: '自提', value: '0' },
      { name: '送货上门', value: '1' }
    ],
    deliveryPointRadio: '0',
    deliveryPoint: [],
    deliveryPointIdx: 0,
    checkCommunity: false,
    community: '',
    checkedGoodsList: [],
    orderList: [],
    checkedAddress: {},
    availableCouponLength: 0, // 可用的优惠券数量
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00, //快递费
    couponPrice: 0.00, //优惠券的价格
    grouponPrice: 0.00, //团购优惠价格
    orderTotalPrice: 0.00, //订单总价
    actualPrice: 0.00, //实际需要支付的总价
    cartId: 0,
    addressId: 0,
    couponId: 0,
    message: '',
    grouponLinkId: 0, //参与的团购，如果是发起则为0
    grouponRulesId: 0, //团购规则ID
    preSaleGoodsList: [],
    preSaleShippingFee: null,
    noPreSaleGoodsList: [],
    noPreSaleShippingFee: null,
    remaining: 0,
    payType: 0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    springFestivalTips()
  },
  updateNeedShallots(e) {
    const { status } = e.currentTarget.dataset
    this.setData({ needShallots: status })
  },
  bindPickerChange: function (e) {
    this.setData({
      deliveryPointIdx: e.detail.value
    })
  },
  radioChange: function (e) {
    wx.setStorageSync('deliveryPointRadio', e.detail.value)
    this.setData({
      deliveryPointRadio: e.detail.value
    })
  },
  //获取checkou信息
  getCheckoutInfo: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CartCheckout, {
      cartId: that.data.cartId,
      addressId: that.data.addressId,
      couponId: that.data.couponId,
      grouponRulesId: that.data.grouponRulesId
    }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          // checkCommunity: res.data.community.contract ? res.data.community.contract : false,
          // selfPickupCoupons: res.data.selfPickupCoupons ? res.data.selfPickupCoupons : [],
          // deliveryPoint: res.data.deliveryPoint,
          // deliveryPointRadio: (res.data.deliveryPoint.length > 0 && wx.getStorageSync('deliveryPointRadio') != '1') ? '0' : '1',
          // checkedGoodsList: res.data.checkedGoodsList,
          orderList: res.data.orderList,
          checkedAddress: res.data.checkedAddress,
          availableCouponLength: res.data.availableCouponLength,
          actualPrice: res.data.actualPrice,
          couponPrice: res.data.couponPrice,
          grouponPrice: res.data.grouponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice,
          addressId: res.data.addressId,
          couponId: res.data.couponId,
          grouponRulesId: res.data.grouponRulesId,
          preSaleGoodsList: res.data.presellOrder || [],
          // preSaleShippingFee: res.data.presellOrderFreightPrice,
          noPreSaleGoodsList: res.data.nonPresellOrder || [],
          // noPreSaleShippingFee: res.data.nonPresellOrderFreightPrice
        });
      } else {
        wx.showModal({
          title: '提示',
          content: res.errmsg,
          showCancel: false,
          success(res) {
            wx.switchTab({
              url: '/pages/cart/cart'
            })
          }
        })
      }
      wx.hideLoading();
    });
  },
  async updateRemaining() {
    const response = await apiUserInfo()
    if (response.status) {
      this.setData({
        remaining: response.data.remaining || 0,
        payType: (response.data.remaining && response.data.remaining > 0) ? 1 : 0
      })
    }
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/ucenter/address/address',
    })
  },
  selectCoupon() {
    wx.navigateTo({
      url: '/pages/ucenter/couponSelect/couponSelect',
    })
  },
  bindMessageInput: function (e) {
    this.setData({
      message: e.detail.value
    });
  },
  updatePaymentMethod(e) {
    const { payType } = e.currentTarget.dataset
    if (this.data.type != payType) {
      this.setData({
        payType
      })
    }
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    this.setData({
      community: wx.getStorageSync('community')
    })
    try {
      var cartId = wx.getStorageSync('cartId');
      if (cartId === "") {
        cartId = 0;
      }
      var addressId = wx.getStorageSync('addressId');
      if (addressId === "") {
        addressId = 0;
      }
      var couponId = wx.getStorageSync('couponId');
      if (couponId === "") {
        couponId = 0;
      }
      var grouponRulesId = wx.getStorageSync('grouponRulesId');
      if (grouponRulesId === "") {
        grouponRulesId = 0;
      }
      var grouponLinkId = wx.getStorageSync('grouponLinkId');
      if (grouponLinkId === "") {
        grouponLinkId = 0;
      }

      this.setData({
        cartId: cartId,
        addressId: addressId,
        couponId: couponId,
        grouponRulesId: grouponRulesId,
        grouponLinkId: grouponLinkId
      });

    } catch (e) {
      // Do something when catch error
      console.log(e);
    }
    if (this.data.payFlag == false) {
      this.getCheckoutInfo();
      this.updateRemaining()
    }
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  hideLoading() {
    setTimeout(() => {
      wx.hideLoading()
    }, 2000);
  },
  submitOrder: async function () {
    const { payType } = this.data
    let that = this;
    if (that.data.addressId <= 0 && that.data.deliveryPointRadio != '0') {
      util.showErrorToast('请选择收货地址');
      return false;
    }

    // if (!(/^[A-z0-9\u4e00-\u9fa5]*$/.test(this.data.message))) {
    //   wx.showToast({
    //     title: '订单备注只能是汉字,字母或者数字',
    //     icon: 'none'
    //   })
    //   return
    // }

    if (that.data.orderSubmitFlag) {
      return false
    }

    await new Promise(function (resolve) {
      wx.requestSubscribeMessage({
        tmplIds: ['5FSZelecsfSEMyGMn9kE_uVZ46srgMY4eNnYw8cG2bE'],
        success() { },
        fail() { },
        complete() {
          resolve(true)
        }
      })
    })

    wx.showLoading({
      title: '支付请求中', mask: true
    })

    const orderResponse = await apiGenerateOrder(payType, {
      deliveryPointId: (that.data.deliveryPointRadio == '0' && that.data.deliveryPoint.length > 0) ? that.data.deliveryPoint[that.data.deliveryPointIdx].id : '',
      cartId: that.data.cartId,
      addressId: that.data.addressId,
      couponId: that.data.couponId,
      message: that.data.message,
      grouponRulesId: that.data.grouponRulesId,
      grouponLinkId: that.data.grouponLinkId
    })

    if (orderResponse.status) {
      const { orderId, type } = orderResponse.data
      // 余额支付完成
      if (type == 1) {
        const { accountPayPrice, remaining } = orderResponse.data
        this.hideLoading()
        wx.showModal({
          content: `余额支付成功\n本次支付${accountPayPrice}元\n账户剩余${remaining}元`,
          showCancel: false,
          success() {
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=1&orderId=' + orderId
            });
          }
        })
        // wx.showToast({
        //   title: `成功支付${accountPayPrice}元\n账户剩余${remaining}元`,
        //   icon: 'none',
        //   mask: true
        // })
        // setTimeout(() => {
        //   wx.redirectTo({
        //     url: '/pages/payResult/payResult?status=1&orderId=' + orderId
        //   });
        // }, 3000);
        return
      }

      if (type == 0) {
        const payResponse = await apiOrderPay(orderId)
        if (payResponse.status) {
          this.data.payFlag = true
          const { timeStamp, nonceStr, packageValue, signType, paySign } = payResponse.data

          wx.showModal({
            content: `余额不足,超出部分将使用微信支付`,
            showCancel: false,
            success() {
              wx.requestPayment({
                timeStamp,
                nonceStr,
                package: packageValue,
                signType,
                paySign,
                success(res) {
                  wx.showToast({
                    title: '微信支付成功',
                    mask: true
                  })
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                    });
                  }, 2000);
                },
                fail(res) {
                  wx.showToast({
                    title: '微信支付失败',
                    icon: 'none'
                  })
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                    });
                  }, 2000);
                },
              })
            }
          })
        }

        if (!payResponse.status) {
          this.hideLoading()
        }
      }
    }

    if (!orderResponse.status) {
      this.hideLoading()
    }
  }
});