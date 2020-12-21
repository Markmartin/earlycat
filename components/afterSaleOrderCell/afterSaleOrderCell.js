// components/afterSaleOrderCell/afterSaleOrderCell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderId: { type: String, value: '' },
    orderNo: { type: String, value: '' },
    orderStatus: { type: String, value: '' },
    goodsList: { type: Array, value: [] }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusOptions: {
      1: '审核中',
      2: '已退款',
      3: '已驳回',
      4: '已取消'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoAfterSaleOrderDetail() {
      console.log(this.properties.orderId)
      wx.navigateTo({
        url: `/pages/ucenter/afterSaleOrderDetail/afterSaleOrderDetail?orderId=${this.properties.orderId}`
      })
    }
  }
})
