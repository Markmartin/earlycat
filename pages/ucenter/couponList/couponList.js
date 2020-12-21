var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const { apiAcceptTransferCoupon, apiCouponList } = require('../../../config/request')

var app = getApp();

Page({
  data: {
    couponList: [],
    code: '',
    status: 0,
    page: 0,
    limit: 10,
    pages: 1,
    total: 0,
  },
  // 分享转赠的优惠券
  onShareAppMessage(e) {
    let userInfo = wx.getStorageSync('userInfo')
    const { from, target } = e
    const { item } = target.dataset

    let url = `/pages/ucenter/couponList/couponList?couponUserId=${item.couponUserId}`
    url = encodeURIComponent(url)
    let path = `/pages/homepage/homepage?url=${url}`

    if (from == 'button') {
      return {
        title: `${userInfo.nickname}分享的${item.name}`,
        path
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this
    if (options.couponUserId) {
      wx.showModal({
        title: '确认接收优惠券?',
        async success(res) {
          if (res.confirm) {
            const response = await apiAcceptTransferCoupon(options.couponUserId)
            if (response.status) {
              wx.showToast({ title: '成功接收优惠券' })
              _this.restList();
            }
          }
          if (res.cancel) {
            wx.showToast({ title: '取消接收优惠券', icon: 'none' })
            return
          }
        }
      })

    }

    this.restList();
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
    this.restList()
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCouponList()
  },
  getCouponList: async function () {
    let that = this;
    if (this.data.page >= this.data.pages) {
      return false;
    }

    this.setData({
      loading: true
    })


    const response = await apiCouponList({
      status: this.data.status,
      page: ++this.data.page,
      limit: this.data.limit
    })

    if (response.status) {
      this.setData({
        couponList: this.data.couponList.concat(response.data.list),
        total: response.data.total,
        pages: response.data.pages,
        page: response.data.pageNum
      });
    }

    this.setData({
      loading: false
    })
    // wx.showLoading({
    //   title: '加载中...',
    // });
    // util.request(api.CouponMyList, {
    //   status: that.data.status,
    //   page: that.data.page,
    //   limit: that.data.limit
    // }).then(function (res) {
    //   if (res.errno === 0) {
    //     that.setData({
    //       couponList: that.data.couponList.concat(res.data.list),
    //       total: res.data.total,
    //       pages: res.data.pages,
    //       page: that.data.page += 1
    //     });
    //   } else {
    //     util.showErrorToast(res.errmsg);
    //   }
    //   that.setData({
    //     loading: false
    //   })
    // });

  },
  bindExchange: function (e) {
    this.setData({
      code: e.detail.value
    });
  },
  clearExchange: function () {
    this.setData({
      code: ''
    });
  },
  goExchange: function () {
    if (this.data.code.length === 0) {
      util.showErrorToast("请输入兑换码");
      return;
    }

    let that = this;
    util.request(api.CouponExchange, {
      code: that.data.code
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.clearExchange();
        setTimeout(() => {
          that.restList();
        }, 2000)
        wx.showToast({
          icon: 'none',
          title: "领取成功",
          duration: 2000
        })
      }
      else {
        util.showErrorToast(res.errmsg);
      }
    });
  },
  restList: function () {
    this.setData({
      couponList: [],
      page: 0,
      limit: 10,
      pages: 1,
      total: 0,
    });
    this.getCouponList();
  },
  switchTab: function (e) {
    this.setData({
      status: e.currentTarget.dataset.index,
    });
    this.restList();
  },
})