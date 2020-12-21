const { apiLogisticsInfo } = require('../../../config/request')
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    clickIdx: 0,
    orderList: [],
    loading: false,
    showType: 0,
    page: 1,
    limit: 10,
    pages: 1,
    total: 0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    try {
      var tab = wx.getStorageSync('tab');
      this.setData({
        showType: tab
      });
      wx.removeStorage({
        key: 'tab',
      })
    } catch (e) { }
    this.restList();
  },
  onPullDownRefresh: function () {
    this.restList()
    wx.stopPullDownRefresh();
  },
  openPage(e) {
    this.setData({
      clickIdx: e.currentTarget.dataset.idx
    })
    wx.navigateTo({
      url: '/pages/ucenter/orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
      // events: {
      //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      //   acceptDataFromOpenedPage: function(data) {
      //     console.log(data)
      //   }
      // }
    })
  },
  getOrderList() {
    let that = this;
    if ((that.data.page > that.data.pages) || that.data.loading) {
      return false;
    }
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.OrderList, {
      showType: that.data.showType,
      page: that.data.page,
      limit: that.data.limit
    }).then(function (res) {
      that.setData({
        loading: false
      })
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: that.data.orderList.concat(res.data.list.map((item) => ({ ...item, toggleShow: false, expressInfo: null }))),
          total: res.data.total,
          pages: res.data.pages,
          page: that.data.page += 1
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  },
  onReachBottom() {
    this.getOrderList();
  },
  restList: function () {
    this.setData({
      orderList: [],
      page: 1,
      limit: 10,
      pages: 1,
      total: 0
    });
    this.getOrderList();
  },
  switchTab: function (event) {
    let showType = event.currentTarget.dataset.index;
    this.setData({
      showType: showType
    });
    this.restList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // if(this.data.orderList.length > 0){
    //   this.getOrderDetail()
    // }
  },
  getOrderDetail: function () {
    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderList[that.data.clickIdx].id
    }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          ['orderList[' + that.data.clickIdx + '].orderStatusText']: res.data.orderInfo.orderStatusText
        })
      }
    });
  },
  async getLogisticsInfo(e) {
    const { item, index } = e.currentTarget.dataset
    console.log(index)
    const key = "orderList[" + index + "]"
    this.setData({
      [key + 'toggleShow']: !this.data.orderList[index].toggleShow
    })
    if (!this.data.expressInfo) {
      const response = await apiLogisticsInfo(item.id)
      this.setData({
        [key + 'expressInfo']: response.data.expressInfo
      })
      // if (response.status) {
      //   this.setData({
      //     [key + 'expressInfo']: response.data
      //   })
      // }
    }
  },
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
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})