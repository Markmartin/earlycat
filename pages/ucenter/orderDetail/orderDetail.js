var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    orderGoodsInfo: [],
    statusOptions: {
      1: '审核中',
      2: '已退款',
      3: '已驳回',
      4: '已取消'
    },
    orderInfo: {},
    orderGoods: [],
    expressInfo: {},
    deliveryInfo: {},
    flag: false,
    handleOption: {},
    expressChannel: null,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // const eventChannel = this.getOpenerEventChannel()
    // eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
    this.setData({
      orderId: options.id
    });
  },
  emptyEvent() {
    console.log('666')
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderDetail();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  expandDetail: function () {
    let that = this;
    this.setData({
      flag: !that.data.flag
    })
  },
  getOrderDetail: function () {
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function () {
      wx.hideLoading()
    }, 2000);

    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      if (res.errno === 0) {
        if (res.data.deliveryInfo) {
          let list = res.data.deliveryInfo.deliveryPhone.split(',')
          res.data.deliveryInfo.list = list
          that.setData({
            deliveryInfo: res.data.deliveryInfo
          });
        }
        that.setData({
          orderGoodsInfo: res.data.orderGoodsInfo,
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.orderInfo.handleOption,
          expressInfo: res.data.expressInfo || null,
          expressChannel: res.data.expressChannel || ''
        });
      }

      wx.hideLoading();
    });
  },
  // “去付款”按钮点击效果
  payOrder: function () {
    let that = this;
    util.request(api.OrderPrepay, {
      orderId: that.data.orderId
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        if (!res.data) {
          util.showErrorToast('支付成功')
          util.handleOrderReturn()
          return
        }
        const payParam = res.data;
        console.log("支付过程开始");
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.packageValue,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log("支付过程成功");
            util.showErrorToast('支付成功')
            util.handleOrderReturn()
          },
          'fail': function (res) {
            console.log("支付过程失败");
            util.showErrorToast('支付失败');
          },
          'complete': function (res) {
            console.log("支付过程结束")
          }
        });
      }
    });

  },
  // “取消订单”点击效果
  cancelOrder: function () {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderCancel, {
            orderId: orderInfo.id
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              util.showErrorToast('取消订单成功')
              util.handleOrderReturn()
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “取消订单并退款”点击效果
  refundOrder: function () {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确定要申请订单退款？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: `../../refund/refund?orderId=${orderInfo.id}`,
          })
          // util.request(api.OrderRefund, {
          //   orderId: orderInfo.id
          // }, 'POST').then(function (res) {
          //   if (res.errno === 0) {
          //     util.showErrorToast('取消订单成功')
          //     util.handleOrderReturn()
          //   } else {
          //     util.showErrorToast(res.errmsg);
          //   }
          // });
        }
      }
    });
  },
  // “删除”点击效果
  deleteOrder: function () {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确定要删除此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderDelete, {
            orderId: orderInfo.id
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              util.showErrorToast('删除订单成功')
              util.handleOrderReturn()
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “确认收货”点击效果
  confirmOrder: function () {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确认收货？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderConfirm, {
            orderId: orderInfo.id
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              util.showErrorToast('确认收货成功！')
              util.handleOrderReturn()
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // 复制订单号
  copy(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.orderSn,
      success() {
        wx.showToast({
          title: '订单号复制成功'
        })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getOrderDetail();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})