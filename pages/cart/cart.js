var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');
const { apiUpdateIsGift, apiDeleteCartGoods } = require('../../config/request')

var app = getApp();

Page({
  data: {
    nullCartGoods: [],
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    isEditCart: true,
    checkedAllStatus: true,
    editCartList: [],
    hasLogin: false,
    isGift: true,
    isGiftExist: false,
    dialogShow: false,
    buttons: [{ text: '取消' }, { text: '确定' }],
    deleteIndex: null
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },

  onReady: function () {
    // 页面渲染完成
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getCartList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  onShow: async function () {
    wx.setStorageSync('cartId', 0);
    wx.setStorageSync('grouponRulesId', 0);
    wx.setStorageSync('grouponLinkId', 0);
    // 页面显示
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      this.getCartList();
      this.setData({
        hasLogin: true
      });
    } else {
      this.setData({
        hasLogin: false
      });
    }
  },

  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭
  },

  goLogin() {
    wx.navigateTo({
      url: "/pages/auth/login/login"
    });
  },

  filterCartGoods: function (data) {
    let cartGoods = [], nullCartGoods = []
    for (let idx in data) {
      if (data[idx].notDelete && data[idx].onSale && !data[idx].noGoodsStock) {
        cartGoods.push(data[idx])
      } else {
        nullCartGoods.push(data[idx])
      }
    }
    this.setData({
      cartGoods: cartGoods,
      nullCartGoods: nullCartGoods
    })
  },

  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(async function (res) {
      if (res.errno === 0) {
        await app.updateCartBadge()
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal,
          isGift: res.data.isGift,
          isGiftExist: res.data.isGiftExist
        });
        that.filterCartGoods(res.data.cartList)
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      }
    });
  },

  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      return element.checked == true ? true : false
    });
  },

  doCheckedAll: function () {
    this.setData({
      checkedAllStatus: this.isCheckedAll()
    });
  },

  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    if (this.data.cartGoods[itemIndex].noGoodsStock) {
      return
    }
    if (this.data.cartGoods[itemIndex].acStatus == 98) {
      return
    }
    let that = this;
    let productIds = [];
    productIds.push(that.data.cartGoods[itemIndex].productId);
    util.request(api.CartChecked, {
      productIds: productIds,
      isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.filterCartGoods(res.data.cartList)
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
    // if (!this.data.isEditCart) {
    //   let productIds = [];
    //   productIds.push(that.data.cartGoods[itemIndex].productId);
    //   util.request(api.CartChecked, {
    //     productIds: productIds,
    //     isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1
    //   }, 'POST').then(function (res) {
    //     if (res.errno === 0) {
    //       that.filterCartGoods(res.data.cartList)
    //       that.setData({
    //         // cartGoods: res.data.cartList,
    //         cartTotal: res.data.cartTotal
    //       });
    //     }

    //     that.setData({
    //       checkedAllStatus: that.isCheckedAll()
    //     });
    //   });
    // } else {
    //   //编辑状态
    //   let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
    //     if (index == itemIndex) {
    //       element.checked = !element.checked;
    //     }

    //     return element;
    //   });
    //   that.filterCartGoods(tmpCartData)
    //   that.setData({
    //     // cartGoods: tmpCartData,
    //     checkedAllStatus: that.isCheckedAll(),
    //     'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
    //   });
    // }
  },

  getCheckedGoodsCount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },

  checkedAll: function () {
    let that = this;
    var productIds = this.data.cartGoods.map(function (v) {
      return v.productId
    });
    util.request(api.CartChecked, {
      productIds: productIds,
      isChecked: that.isCheckedAll() ? 0 : 1
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.filterCartGoods(res.data.cartList)
        that.setData({
          // cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
    // if (!this.data.isEditCart) {
    //   var productIds = this.data.cartGoods.map(function (v) {
    //     return v.productId
    //   });
    //   util.request(api.CartChecked, {
    //     productIds: productIds,
    //     isChecked: that.isCheckedAll() ? 0 : 1
    //   }, 'POST').then(function (res) {
    //     if (res.errno === 0) {
    //       that.filterCartGoods(res.data.cartList)
    //       that.setData({
    //         // cartGoods: res.data.cartList,
    //         cartTotal: res.data.cartTotal
    //       });
    //     }

    //     that.setData({
    //       checkedAllStatus: that.isCheckedAll()
    //     });
    //   });
    // } else {
    //   //编辑状态
    //   let checkedAllStatus = that.isCheckedAll();
    //   let tmpCartData = this.data.cartGoods.map(function (v) {
    //     v.checked = !checkedAllStatus;
    //     return v;
    //   });
    //   that.filterCartGoods(tmpCartData)
    //   that.setData({
    //     // cartGoods: tmpCartData,
    //     checkedAllStatus: that.isCheckedAll(),
    //     'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
    //   });
    // }

  },

  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.filterCartGoods(tmpCartList)
      this.setData({
        editCartList: this.data.cartGoods,
        // cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },

  updateCart: function (event) {
    let that = this;
    let idx = event.target.dataset.idx;
    let type = event.target.dataset.type;
    let cartItem = that.data.cartGoods[idx];
    if (cartItem.acStatus == 98) {
      wx.showToast({
        title: '赠品不可修改',
        icon: 'none'
      })
      return
    }
    let number = 0
    if (type == 'cut') {
      if (cartItem.number < 2) {
        this.setData({ dialogShow: true, deleteIndex: idx })
        return
      }

      if (cartItem.number > 1) {
        number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
        cartItem.number = number;
        that.filterCartGoods(that.data.cartGoods)
      }
    }

    if (type == 'add') {
      if (this.data.cartGoods[idx].noGoodsStock) {
        return
      }
      number = cartItem.number + 1;
    }

    util.request(api.CartUpdate, {
      productId: cartItem.productId, goodsId: cartItem.goodsId, number: number, id: cartItem.id
    }, 'POST').then(async function (res) {
      if (res.errno === 0) {
        // if (type == 'add') {
        //   cartItem.number = number;
        //   that.filterCartGoods(that.data.cartGoods)
        // }
        that.getCartList()
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      } else {
        util.showErrorToast(res.errmsg)
      }
    });

  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;

    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      return element.checked == true ? true : false
    });

    if (checkedGoods.length <= 0) {
      util.showErrorToast('请选择下单商品')
      return false;
    }

    // storage中设置了cartId，则是购物车购买
    try {
      wx.setStorageSync('cartId', 0);
      wx.navigateTo({
        url: '/pages/checkout/checkout'
      })
    } catch (e) { }

  },
  deleteNullCart: function () {
    let that = this
    let productIds = this.data.nullCartGoods.map(function (element) {
      return element.productId;
    });
    util.request(api.CartDelete, {
      productIds: productIds
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.setData({
          nullCartGoods: []
        })
      } else {
        util.showErrorToast(res.errmsg)
      }
    });
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this;
    let productIds = this.data.cartGoods.filter(function (element, index, array) {
      return element.checked == true ? true : false
    });
    if (productIds.length <= 0) {
      return false;
    }
    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.productId;
      }
    });

    util.request(api.CartDelete, {
      productIds: productIds
    }, 'POST').then(async function (res) {
      if (res.errno === 0) {
        await app.updateCartBadge()
        let cartList = res.data.cartList.map(v => {
          v.checked = false;
          return v;
        });
        that.filterCartGoods(cartList)
        that.setData({
          // cartGoods: cartList,
          cartTotal: res.data.cartTotal
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  // 更新赠品
  async updateIsGift(e) {
    const { status } = e.currentTarget.dataset
    if (!status) {
      this.setData({ isGift: status, isGiftExist: !status })
      return
    }

    if (status) {
      //要葱花
      const response = await apiUpdateIsGift(status)
      if (response.status) {
        this.getCartList()
      }
      return
    }
  },
  // 删除单个商品
  async deleteSingleGoods(e) {
    const { index } = e.detail
    const { deleteIndex } = e.currentTarget.dataset
    this.setData({
      dialogShow: false
    })
    if (index === 1) {
      const response = await apiDeleteCartGoods(this.data.cartGoods[deleteIndex].productId)
      if (response.status) {
        this.setData({
          cartGoods: response.data.cartList,
          cartTotal: response.data.cartTotal,
          isGift: response.data.isGift,
          isGiftExist: response.data.isGiftExist
        });
      }
      await app.updateCartBadge()
    }
  }
})