var util = require('../../utils/util.js')
var api = require('../../config/api.js')
var app = getApp()

Page({
  data: {
    isChoice: false,
    navSubBox: false,
    checkCommunity: false,
    community: '',
    loading: false,
    navList: [],
    navErrFlag: false,
    goodsList: [],
    goodsErrFlag: false,
    curGoodsIdx: 0,
    id: '',
    currentCategory: { id: '' },
    currentSubCategory: [],
    scrollIntoView: '',
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    pages: 1,
    limit: 20,
    cartGoods: [],
    number: 1,
    goods: {},
    tmpSpecText: '请选择规格数量',
    checkedSpecPrice: 0,
    openAttr: false,
    specificationList: [],
    productList: [],
    goodsCount: 0,
    soldout: false
  },

  navSubBtn: function () {
    this.setData({
      navSubBox: !this.data.navSubBox
    })
  },

  cutNumber: function () {
    this.setData({
      number: this.data.number - 1 > 1 ? this.data.number - 1 : 1
    })
  },

  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    })
  },

  closeAttr: function () {
    this.setData({
      openAttr: false
    })
  },
  // 规格选择
  clickSkuValue: function (event) {
    let that = this
    let specName = event.currentTarget.dataset.name
    let specValueId = event.currentTarget.dataset.valueId

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].name === specName) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false
            } else {
              _specificationList[i].valueList[j].checked = true
            }
          } else {
            _specificationList[i].valueList[j].checked = false
          }
        }
      }
    }
    this.setData({
      specificationList: _specificationList
    })
    //重新计算spec改变后的信息
    this.changeSpecInfo()

    //重新计算哪些值不可以点击
  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = []
    let _specificationList = this.data.specificationList
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        name: _specificationList[i].name,
        valueId: 0,
        valueText: ''
      }
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id
          _checkedObj.valueText = _specificationList[i].valueList[j].value
        }
      }
      checkedValues.push(_checkedObj)
    }

    return checkedValues
  },

  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true
      }
    })
  },

  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueText
    })
    return checkedValue
  },

  // 规格改变时，重新计算价格及显示信息
  changeSpecInfo: function () {
    let checkedNameValue = this.getCheckedSpecValue()

    //设置选择的信息
    let checkedValue = checkedNameValue
      .filter(function (v) {
        if (v.valueId != 0) {
          return true
        } else {
          return false
        }
      })
      .map(function (v) {
        return v.valueText
      })
    if (checkedValue.length > 0) {
      this.setData({
        tmpSpecText: checkedValue.join('　')
      })
    } else {
      this.setData({
        tmpSpecText: '请选择规格数量'
      })
    }

    if (this.isCheckedAllSpec()) {
      this.setData({
        checkedSpecText: this.data.tmpSpecText
      })

      // 规格所对应的货品选择以后
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey())
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        this.setData({
          soldout: true
        })
        console.error('规格所对应货品不存在')
        return
      }

      let checkedProduct = checkedProductArray[0]
      if (checkedProduct.number > 0) {
        this.setData({
          checkedSpecPrice: checkedProduct.price,
          soldout: false
        })
      } else {
        this.setData({
          checkedSpecPrice: this.data.goods.retailPrice,
          soldout: true
        })
      }
    } else {
      this.setData({
        checkedSpecText: '规格数量选择',
        checkedSpecPrice: this.data.goods.retailPrice,
        soldout: false
      })
    }
  },

  // 获取选中的产品（根据规格）
  getCheckedProductItem: function (key) {
    return this.data.productList.filter(function (v) {
      if (v.specifications.toString() == key.toString()) {
        return true
      } else {
        return false
      }
    })
  },

  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    })
    this.getCategoryInfo()
  },

  onShow: async function () {
    let that = this
    if (app.globalData.categoryId) {
      this.setData({
        currentCategory: {
          id: app.globalData.categoryId
        }
      })
      app.globalData.categoryId = null
      this.getCategoryInfo()
    }



    this.setData({
      community: wx.getStorageSync('community')
    })

    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      this.restCartList()
      await app.updateCartBadge()
    }
    if (this.data.community.id) {
      util
        .request(api.CommunityDetail, {
          id: this.data.community.id
        })
        .then(function (res) {
          wx.hideLoading()
          if (res.errno == 0) {
            that.setData({
              checkCommunity: res.data.contract ? res.data.contract : false
            })
          }
        })
    }
  },
  restCartList: function () {
    let that = this
    util.request(api.CartList).then((res) => {
      if (res.errno === 0) {
        let cartList = []
        for (let idx in res.data.cartList) {
          if (res.data.cartList[idx].notDelete && res.data.cartList[idx].onSale) {
            cartList.push(res.data.cartList[idx])
          }
        }
        that.setData({
          cartGoods: cartList
        })
        for (let idx in that.data.goodsList) {
          let item = 'goodsList[' + idx + '].count'
          that.setData({
            [item]: 0
          })
          for (let idx1 in that.data.cartGoods) {
            if (that.data.goodsList[idx].id == that.data.cartGoods[idx1].goodsId) {
              that.setData({
                [item]: (that.data.goodsList[idx].count += that.data.cartGoods[idx1].number)
              })
            }
          }
        }
      }
    })
  },
  getCartList: function () {
    let that = this
    util.request(api.CartList).then(
      (res) => {
        that.setData({
          goodsErrFlag: false
        })
        if (res.errno === 0) {
          that.setData({
            cartGoods: res.data.cartList
          })
          that.getGoodsList()
        }
      },
      (err) => {
        that.setData({
          goodsErrFlag: true
        })
      }
    )
  },
  getCategoryInfo: function () {
    let that = this
    // util.request(api.GoodsCount).then((res) =>  {
    //   that.setData({
    //     goodsCount: res.data
    //   });
    // });
    util.request(api.CatalogList, { id: that.data.currentCategory.id }).then(
      (res) => {
        that.setData({
          navErrFlag: false
        })
        if (res.errno == 0) {
          if (that.data.currentCategory.id == '') {
            // res.data.currentCategory = { id: 0 }
            // res.data.currentSubCategory = []
          }
          // res.data.categoryList.unshift({ id: 0, name: '限时特惠' })
          res.data.currentSubCategory.unshift({ id: res.data.currentCategory.id, name: '全部' })
          that.setData({
            navList: res.data.categoryList,
            currentCategory: res.data.currentCategory,
            currentSubCategory: res.data.currentSubCategory,
            id: app.globalData.subCategoryId || res.data.currentCategory.id
          })
          app.globalData.subCategoryId = null
          that.restGoodsList()
        }
      },
      (err) => {
        that.setData({
          navErrFlag: true
        })
      }
    )
    // util.request(api.GoodsCategory, {id: 2000000}).then((res) =>  {
    //   that.setData({
    //     navErrFlag: false,
    //   })
    //   if (res.errno == 0) {
    //     that.setData({
    //       navList: res.data.brotherCategory,
    //       currentCategory: res.data.currentCategory,
    //       id: res.data.brotherCategory[0].id
    //     });
    //     if(wx.getStorageSync('userInfo') && wx.getStorageSync('token')){
    //       that.getCartList()
    //     }else{
    //       that.getGoodsList()
    //     }
    //   }
    // }, (err) => {
    //   that.setData({
    //     navErrFlag: true,
    //   })
    // });
  },
  getGoodsList: function () {
    var that = this
    if (that.data.id == 0) {
      that.data.isChoice = true
    } else {
      that.data.isChoice = false
    }
    if (that.data.page > that.data.pages || that.data.loading) {
      return false
    }
    that.setData({
      loading: true
    })
    util
      .request(api.GoodsList, {
        // isChoice: that.data.isChoice,
        categoryId: that.data.id,
        page: that.data.page,
        limit: that.data.limit
      })
      .then(
        (res) => {
          if (res.errno == 0) {
            for (let idx1 in res.data.list) {
              res.data.list[idx1].count = 0
              for (let idx in that.data.cartGoods) {
                if (that.data.cartGoods[idx].goodsId == res.data.list[idx1].id) {
                  res.data.list[idx1].count += that.data.cartGoods[idx].number
                }
              }
            }
            let newList = []
            for (let idx in res.data.list) {
              if (this.data.currentCategory.id == this.data.id) {
                for (let idx1 in that.data.currentSubCategory) {
                  if (
                    res.data.list[idx].categoryId == that.data.currentSubCategory[idx1].id &&
                    that.data.currentSubCategory[idx1].flag == undefined
                  ) {
                    newList.push({ type: 'category', name: that.data.currentSubCategory[idx1].name })
                    that.data.currentSubCategory[idx1].flag = true
                    break
                  }
                }
              }
              newList.push(res.data.list[idx])
            }
            that.setData({
              goodsList: that.data.goodsList.concat(newList),
              pages: res.data.pages,
              page: (that.data.page += 1)
            })
          } else {
            util.showErrorToast(res.errmsg)
          }
          that.setData({
            goodsErrFlag: false,
            loading: false
          })
        },
        (err) => {
          that.setData({
            goodsErrFlag: true,
            loading: false
          })
        }
      )
  },
  restGoodsList: function () {
    this.setData({
      goodsList: [],
      page: 1,
      pages: 1
    })
    if (this.data.currentCategory.id == this.data.id) {
      for (let idx1 in this.data.currentSubCategory) {
        this.data.currentSubCategory[idx1].flag = undefined
      }
    }
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      this.getCartList()
    } else {
      this.getGoodsList()
    }
  },
  navClick: function (event) {
    this.setData({
      scrollTop: 0,
      scrollLeft: 0,
      ['currentCategory.id']: event.currentTarget.dataset.id
    })
    this.getCategoryInfo()
  },
  navSubClick: function (event) {
    this.setData({
      id: event.currentTarget.dataset.id,
      scrollIntoView: 'navSubItem' + event.currentTarget.dataset.index,
      navSubBox: false
    })
    this.restGoodsList()
  },
  btnAdd: function (event) {
    let that = this
    let item = event.currentTarget.dataset
    util
      .request(api.GoodsDetail, {
        id: that.data.goodsList[item.idx].id
      })
      .then((res) => {
        if (res.errno === 0) {
          // if((res.data.restriction || that.data.goodsList[item.idx].count >= that.data.goodsList[item.idx].limit) && item.type == 'add'){
          //   util.showErrorToast('商品限购' + that.data.goodsList[item.idx].limit + '份')
          //   return false
          // }
          that.setData({
            curGoodsIdx: item.idx,
            checkedSpecPrice: 0,
            tmpSpecText: '请选择规格数量',
            goods: res.data.info,
            specificationList: res.data.specificationList,
            productList: res.data.productList
          })
          let list = 'goodsList[' + item.idx + '].count'
          let _specificationList = res.data.specificationList
          if (item.type == 'add') {
            // 如果仅仅存在一种货品，那么商品页面初始化时默认checked
            if (_specificationList.length == 1 && _specificationList[0].valueList.length == 1) {
              _specificationList[0].valueList[0].checked = true
              that.setData({
                specificationList: res.data.specificationList
              })
              // 如果仅仅存在一种货品，那么商品价格应该和货品价格一致
              // 这里检测一下
              let _productPrice = res.data.productList[0].price
              let _goodsPrice = res.data.info.retailPrice
              if (_productPrice != _goodsPrice) {
                console.error('商品数量价格和货品不一致')
              }
              that.setData({
                checkedSpecText: _specificationList[0].valueList[0].value,
                tmpSpecText: '已选择：' + _specificationList[0].valueList[0].value
              })
              //根据选中的规格，判断是否有对应的sku信息
              let checkedProductArray = that.getCheckedProductItem(that.getCheckedSpecKey())
              if (!checkedProductArray || checkedProductArray.length <= 0) {
                //找不到对应的product信息，提示没有库存
                util.showErrorToast('没有库存')
                return false
              }

              let checkedProduct = checkedProductArray[0]
              //验证库存
              if (checkedProduct.number <= 0) {
                util.showErrorToast('没有库存')
                return false
              }

              util
                .request(
                  api.CartAdd,
                  {
                    presellId: that.data.goodsList[item.idx].presellId || null,
                    goodsId: that.data.goodsList[item.idx].id,
                    number: 1,
                    productId: checkedProduct.id
                  },
                  'POST'
                )
                .then(async function (res1) {
                  if (res1.errno == 0) {
                    that.setData({
                      [list]: that.data.goodsList[item.idx].count + 1
                    })
                    await app.updateCartBadge()
                  } else {
                    util.showErrorToast(res1.errmsg)
                  }
                })
            } else {
              if (that.data.openAttr == false) {
                //打开规格选择窗口
                that.setData({
                  openAttr: !that.data.openAttr
                })
              }
            }
          } else {
            if (_specificationList.length == 1 && _specificationList[0].valueList.length == 1) {
              if (that.data.goodsList[item.idx].count == 1) {
                that.setData({
                  [list]: 0
                })
                util
                  .request(
                    api.CartDelete,
                    {
                      productIds: [res.data.productList[0].id]
                    },
                    'POST'
                  )
                  .then(async function (res1) {
                    if (res1.errno === 0) {
                      await app.updateCartBadge()
                    }
                  })
              } else {
                that.setData({
                  [list]: that.data.goodsList[item.idx].count - 1
                })
                util.request(api.CartList).then(function (res1) {
                  if (res1.errno === 0) {
                    let cartList = []
                    for (let idx in res1.data.cartList) {
                      if (res1.data.cartList[idx].notDelete && res1.data.cartList[idx].onSale) {
                        cartList.push(res1.data.cartList[idx])
                      }
                    }
                    that.setData({
                      cartGoods: cartList
                    })
                    for (let idx in that.data.cartGoods) {
                      if (that.data.cartGoods[idx].goodsId == that.data.goodsList[item.idx].id) {
                        util
                          .request(
                            api.CartUpdate,
                            {
                              productId: res.data.productList[0].id,
                              goodsId: that.data.goodsList[item.idx].id,
                              number: that.data.goodsList[item.idx].count,
                              id: that.data.cartGoods[idx].id
                            },
                            'POST'
                          )
                          .then(async (res) => {
                            if (res.errno == 0) {
                              await app.updateCartBadge()
                            }
                          })
                        break
                      }
                    }
                  }
                })
              }
            } else {
              wx.showToast({
                icon: 'none',
                title: '多规格产品不能减少，请到购物车操作'
              })
            }
          }
        } else {
          util.showErrorToast(res.errmsg)
        }
      })
  },
  //添加到购物车
  addToCart: function () {
    var that = this
    //提示选择完整规格
    if (!this.isCheckedAllSpec()) {
      util.showErrorToast('请选择完整规格')
      return false
    }

    //根据选中的规格，判断是否有对应的sku信息
    let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey())
    if (!checkedProductArray || checkedProductArray.length <= 0) {
      //找不到对应的product信息，提示没有库存
      util.showErrorToast('没有库存')
      return false
    }

    let checkedProduct = checkedProductArray[0]
    //验证库存
    if (checkedProduct.number <= 0) {
      util.showErrorToast('没有库存')
      return false
    }

    //添加到购物车
    util
      .request(
        api.CartAdd,
        {
          goodsId: that.data.goods.id,
          number: that.data.number,
          productId: checkedProduct.id
        },
        'POST'
      )
      .then((res) => {
        let _res = res
        if (_res.errno == 0) {
          // wx.showToast({
          //   icon: 'none',
          //   title: '添加成功'
          // });
          let curGoods = 'goodsList[' + that.data.curGoodsIdx + '].count'
          that.setData({
            [curGoods]: that.data.goodsList[that.data.curGoodsIdx].count + that.data.number,
            openAttr: !that.data.openAttr,
            cartGoodsCount: _res.data
          })
          if (that.data.userHasCollect == 1) {
            that.setData({
              collectImage: that.data.hasCollectImage
            })
          } else {
            that.setData({
              collectImage: that.data.noCollectImage
            })
          }
        } else {
          util.showErrorToast(_res.errmsg)
        }
      })
  }
})
