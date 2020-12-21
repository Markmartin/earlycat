// components/activityGoods/activityGoods.js
const { apiGoodsDetail, apiAddCart } = require('../../config/request')

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
    goodsPrice: { type: String, value: '' },
    unit: { type: String, value: '' },
    canBuy: { type: Boolean, value: true }
  },

  /**
   * 组件的初始数据
   */
  data: {},

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
    async addCart() {
      const detailResp = await apiGoodsDetail(this.properties.goodsId)
      if (detailResp.status) {
        const { id, goodsId } = detailResp.data.productList[0]
        let resp = await apiAddCart({
          goodsId: goodsId,
          productId: id,
          number: 1,
          presellId: this.properties.groupId,
          isPresell: this.properties.isPreSale ? 1 : 0
        })
        if (resp.status) {
          wx.showToast({
            title: '加入购物车成功',
          })
        }
      }
    }
  }
})
