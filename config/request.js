const { WxApiRoot } = require('./variable')
const app = getApp()

const request = function (method, url, data, showLoading = false) {
  return new Promise(function (resolve) {
    // if (showLoading) {
    //   wx.showLoading()
    // }
    wx.request({
      method,
      url: `${WxApiRoot}${url}`,
      header: {
        'Content-Type': 'application/json',
        'x-litemall-token': wx.getStorageSync('token')
      },
      data: data,
      success(res) {
        if (parseInt(res.statusCode) === 200 && parseInt(res.data.errno) === 0) {
          resolve({ status: true, data: res.data.data })
          return
        }
        wx.showToast({
          title: res.data.errmsg || '服务拥堵...',
          icon: 'none'
        })

        resolve({ status: false, data: res.data })
      },
      fail(res) {
        resolve({ status: false, data: res.data })
      },
      complete() {
        // if (showLoading) {
        //   wx.hideLoading()
        // }
      }
    })
  })
}

const upload = function (filePath, data = null, fileKey = 'file') {
  return new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '上传中'
    })
    wx.uploadFile({
      url: `${WxApiRoot}/storage/upload`,
      filePath,
      name: fileKey,
      header: {
        'x-litemall-token': wx.getStorageSync('token')
      },
      timeout: 30000,
      formData: data,
      success(res) {
        if (parseInt(res.statusCode) === 200 && parseInt(JSON.parse(res.data).errno) === 0) {
          resolve({ status: true, data: JSON.parse(res.data).data })
          return
        }
        wx.showToast({
          title: JSON.parse(res.data).errmsg,
          icon: 'none'
        })
        resolve({ status: false, data: res.data })
      },
      fail(res) {
        resolve({ status: false, data: res.data })
      },
      complete() {
        wx.hideLoading()
      }
    })
  })
}

// 首页
const apiHomePage = async (data = {}) => await request('get', 'home/newIndex', data)
//首页限特惠所有组
const apiDiscountGroup = async () => await request('post', 'presell/getPresellList?limit=&page=', { type: 2 })
// 预售分类所有组
const apiPreSaleGroup = async () => await request('post', 'presell/getPresellList?limit=&page=', { type: 1 })
// 大件商品分组
const apiBulkyGoodsGroup = async () => await request('post', 'presell/getPresellList?limit=&page=', { type: 4 })
// 分组商品列表
const apiGroupGoods = async (data) => await request('get', 'presell/getPreselDetail', data)
// 好货精选
const apiGoodGoods = async (data) => await request('get', 'goods/list', { ...data, isHot: true, isNew: true, isSearch: true })
// 新品尝鲜
const apiNewGoods = async (data) => await request('get', 'goods/list', { ...data, isNew: true, isSearch: true })
// 推荐商品列表
const apiHotGoods = async (data) => await request('get', 'goods/list', { ...data, isHot: true, isSearch: true })
// 商品列表
const apiGoods = async (data) => await request('get', 'goods/list', { ...data, isSearch: true })
// 加入购物车
const apiAddCart = async (data) => {
  const response = await request('post', 'cart/add', data)
  if (response.status) {
    if (getApp() && typeof getApp().updateCartBadge === 'function') {
      await getApp().updateCartBadge()
    }
  }
  return response
}
// 获取购物车商品数量
const apiCartGoodsCount = async () => await request('get', 'cart/goodscount', null)
// 商品详情
const apiGoodsDetail = async (goodsId) => await request('get', 'goods/detail', { id: goodsId })
// 地址列表
const apiAddressList = async (data) => await request('get', 'address/list', data)
// 新建地址
const apiAddressNew = async (data) => await request('post', 'address/save', data)
// 地址详情
const apiAddressDetail = async (id) => await request('get', 'address/detail', { id })
// 更新葱花
const apiUpdateIsGift = async (status) => await request('get', 'cart/isNeedGift', { boo: status })
// 查询订单物流
const apiLogisticsInfo = async (orderId) => await request('get', 'order/express', { orderId })
// 删除购物车商品
const apiDeleteCartGoods = async (productId) => await request('post', 'cart/delete', { productIds: [productId] })
// 全单退款商品列表
const apiOrderDetail = async (orderId) => await request('get', 'order/detail', { orderId })
// 获取订单中某个商品详情
const apiOrderGoods = async (orderId, goodsId) => await request('get', 'order/goods', { orderId, goodsId })
// 申请退款
const apiApplyRefund = async (data) => await request('post', 'afterSale/applyAfterSale', data)
// 查询退款商品价格
const apiRefundGoodsPrice = async (orderId, goodsId, number) =>
  await request('get', 'afterSale/getOrderGoodsRefundPrice', { orderId, goodsId, number })
// 查询订单中所有物品的退款价格
const apiOrderRefundPrice = async (orderId) => await request('get', 'afterSale/getOrderRefundPrice', { orderId })
// 获取所有退款原因
const apiRefundReasons = async () => await request('get', 'afterSale/getResonList', null)
// 查询售后订单列表
const apiRefundOrders = async (data) => await request('get', 'afterSale/getList', data)
// 查询售后订单详情
const apiRefundOrderDetail = async (id) => await request('get', 'afterSale/detail', { id })
// 申请成为推广者
const apiApplyToBecomePromoter = async () => await request('get', 'user/applyPromote', null)
// 招募申请详情
const apiRecruitDetail = async () => await request('get', 'recruit/getPostInfos', null)
// 招募申请
const apiUpdateRecruit = async (data) => await request('post', 'recruit/save', data)
// 接收优惠券转赠
const apiAcceptTransferCoupon = async (couponUserId) => await request('post', 'coupon/receiveSharedCoupon', { couponUserId })
// 优惠券列表
const apiCouponList = async (data) => await request('get', 'coupon/mylist', data)
// 储值卡列表
const apiStoredValueCards = async () => await request('get', 'recharge/list', null)
// 储值记录
const apiStoredValueRecords = async (data) => await request('get', 'recharge/history', data)
// 生成储值订单ID
const apiStoredValueOrder = async (rechargeId) => await request('post', 'recharge/submit', { rechargeId })
// 根据储值订单ID获取支付相关参数
const apiStoredValuePay = async (orderId) => await request('post', 'recharge/prepay', { orderId })
// 提交订单
const apiGenerateOrder = async (payType, data) => await request('post', 'order/submit', {
  payType, ...data
})
// 生成支付参数
const apiOrderPay = async (orderId) => await request('post', 'order/prepay', { orderId })
// 个人信息
const apiUserInfo = async () => await request('get', 'user/index', null)

module.exports = {
  upload,
  apiHomePage,
  apiDiscountGroup,
  apiPreSaleGroup,
  apiBulkyGoodsGroup,
  apiGroupGoods,
  apiGoodGoods,
  apiNewGoods,
  apiHotGoods,
  apiGoods,
  apiAddCart,
  apiCartGoodsCount,
  apiGoodsDetail,
  apiAddressList,
  apiAddressNew,
  apiAddressDetail,
  apiUpdateIsGift,
  apiLogisticsInfo,
  apiDeleteCartGoods,
  apiOrderDetail,
  apiOrderGoods,
  apiApplyRefund,
  apiRefundGoodsPrice,
  apiOrderRefundPrice,
  apiRefundReasons,
  apiRefundOrders,
  apiRefundOrderDetail,
  apiApplyToBecomePromoter,
  apiRecruitDetail,
  apiUpdateRecruit,
  apiAcceptTransferCoupon,
  apiCouponList,
  apiStoredValueCards,
  apiStoredValueRecords,
  apiStoredValueOrder,
  apiStoredValuePay,
  apiGenerateOrder,
  apiOrderPay,
  apiUserInfo
}
