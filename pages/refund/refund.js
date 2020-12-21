// pages/refund/refund.js
const {
  upload,
  apiOrderDetail,
  apiRefundReasons,
  apiRefundGoodsPrice,
  apiOrderRefundPrice,
  apiApplyRefund
} = require('../../config/request')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    goodsId: null,
    orderInfo: {},
    orderGoods: [],
    refund: {
      isAll: false,
      orderId: null,
      afterSaleItemVos: [],
      reason: null,
      url: []
    },
    refundReasonOptions: []
  },

  async updateRefundGoodsNumber(e) {
    const { type, index } = e.currentTarget.dataset
    const { number: orginalNumber } = this.data.orderGoods[index]
    const { number, orderGoodsId: goodsId } = this.data.refund.afterSaleItemVos[index]

    const { id: orderId } = this.data.orderInfo

    let updateNumber = number
    if (type === 'minus') {
      if (number === 1) {
        // wx.showToast({ title: '申请退款商品份数不能小于1', icon: 'none' })
        return
      }
      updateNumber--
    }

    if (type === 'plus') {
      if (number >= orginalNumber) {
        // wx.showToast({ title: '申请退款商品份数不能超过购买份数', icon: 'none' })
        return
      }
      updateNumber++
    }

    const response = await apiRefundGoodsPrice(orderId, goodsId, updateNumber)
    if (response.status) {
      const { applyRefundNumber, applyRefundPrice } = response.data
      const key = `refund.afterSaleItemVos[${index}]`
      this.setData({
        [key]: {
          ...this.data.refund.afterSaleItemVos[index],
          number: applyRefundNumber,
          price: applyRefundPrice
        }
      })
    }
  },

  updateRefundReason(e) {
    this.setData({
      'refund.reason': this.data.refundReasonOptions[e.detail.value]
    })
  },

  updateRefundDescription(e) {
    this.setData({
      'refund.detail': e.detail.value
    })
  },

  previewImage(e) {
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      urls: [url] // 需要预览的图片http链接列表
    })
  },

  deleteImage(e) {
    const { index } = e.currentTarget.dataset
    let fileList = [...this.data.refund.url]
    fileList.splice(index, 1)
    this.setData({ 'refund.url': fileList })
  },

  chooseImage() {
    let _this = this
    // const remainingLength = 5 - this.data.refund.url.length
    wx.chooseImage({
      count: 1,
      success: async function (res) {
        const { tempFiles } = res
        const size = tempFiles[0].size
        if (size > 1 * 1024 * 1024) {
          wx.showToast({ title: '文件最大支持1M', icon: 'none' })
          return
        }

        const response = await upload(tempFiles[0].path)
        if (response.status) {
          const fileList = [..._this.data.refund.url]
          fileList.push(response.data.url)
          _this.setData({
            'refund.url': fileList
          })
        }
      },
      fail: function () {
        // wx.showToast({ title: '选择文件格式无效', icon: 'none' })
      }
    })
  },

  async updateRefundReasons() {
    const response = await apiRefundReasons()
    if (response.status) {
      this.setData({
        refundReasonOptions: response.data.map((item) => item.value)
      })
    }
  },

  async updateOrderGoods() {
    const { orderId, goodsId } = this.data

    if (orderId) {
      const response = await apiOrderDetail(orderId)
      if (response.status) {
        const { orderInfo, orderGoods } = response.data

        let refundOriginalGoods = orderGoods.filter((item) => item.acStatus !== 99 && item.acStatus !== 98 && !item.isGiveGoods)
        if (goodsId) {
          // 单品退款
          refundOriginalGoods = orderGoods.filter((item) => item.goodsId == goodsId)
        }

        // 单品退款同步退款价格
        if (goodsId) {
          const response = await apiRefundGoodsPrice(orderId, goodsId, refundOriginalGoods[0].number)
          if (response.status) {
            refundOriginalGoods[0].price = response.data.applyRefundPrice
          }
        }

        // 全单退款同步退款价格
        if (!goodsId) {
          const response = await apiOrderRefundPrice(orderId)
          if (response.status) {
            const orderRefundPirce = response.data
            refundOriginalGoods = refundOriginalGoods.map((item) => {
              const priceItem = orderRefundPirce.find(
                (refundPriceItem) => refundPriceItem.orderGoodsInfo.goodsId === item.goodsId
              )
              if (priceItem) {
                return {
                  ...item,
                  price: priceItem.applyRefundPrice
                }
              }
              return {
                ...item,
                price: null
              }
            })
          }
        }

        // 退款商品
        let refundGoods = refundOriginalGoods.map((item) => ({
          picUrl: item.picUrl,
          goodsName: item.goodsName,
          specifications: item.specifications,
          number: item.number,
          orderGoodsId: item.goodsId,
          price: item.price
        }))

        this.setData({
          orderInfo,
          orderGoods: refundOriginalGoods,
          refund: {
            isAll: goodsId ? false : true,
            orderId,
            afterSaleItemVos: refundGoods,
            reason: null,
            url: []
          }
        })
      }
    }
  },

  async submit() {
    const { reason } = this.data.refund
    if (!reason) {
      wx.showToast({ title: '请选择退款原因', icon: 'none' })
      return
    }

    let params = {
      ...this.data.refund,
      afterSaleItemVos: this.data.refund.afterSaleItemVos.map((item) => ({
        number: item.number,
        orderGoodsId: item.orderGoodsId,
        price: item.price
      }))
    }

    const response = await apiApplyRefund(params)
    if (response.status) {
      wx.showToast({ title: '申请退款成功' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId || null,
      goodsId: options.goodsId || null
    })
    this.updateRefundReasons()
    this.updateOrderGoods()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
})
