// components/cardGoods/cardGoods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isGroup: { type: Boolean, value: false },
    isPreSale: { type: Boolean, value: false },
    groupId: { type: String, value: '' },
    goodsId: { type: String, value: '' },
    imageUrl: { type: String, value: '' },
    goodsName: { type: String, value: '' },
    goodsDescription: { type: String, value: '' },
    goodsPrice: { type: Number, value: 0 },
    goodsOriginalPrice: { type: Number, value: 0 },
    unit: { type: String, value: '' },
    canBuy: { type: Boolean, value: true }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoGoodsDetail() {
      if (!this.properties.isGroup) {
        wx.navigateTo({
          url: '/pages/goods/goods?id=' + this.properties.goodsId + '&presellId=' + this.properties.groupId
        })
      }

      if (this.properties.isGroup) {
        wx.navigateTo({
          url: '/pages/preSale/list/list?groupId=' + this.properties.groupId,
        })
      }
    },
  }
})
