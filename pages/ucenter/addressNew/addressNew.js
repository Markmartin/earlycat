// pages/ucenter/addressNew/addressNew.js
const { apiAddressNew, apiAddressDetail } = require('../../../config/request')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressId: 0,
    areaMultiArray: [['上海市'], ['上海市'], ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']],
    pickerShow: false,
    textareaFoucs: false,
    form: {
      name: null,
      gender: null,
      tel: null,
      province: null,
      city: null,
      county: null,
      addressDetail: null,
      tag: null,
      isDefault: false,
    }
  },
  updateArea(e) {
    const { value } = e.detail
    const { areaMultiArray } = this.data
    this.setData({
      form: {
        ...this.data.form,
        province: areaMultiArray[0][value[0]],
        city: areaMultiArray[1][value[1]],
        county: areaMultiArray[2][value[2]]
      }
    })
  },
  updateForm(e) {
    const key = e.currentTarget.dataset.key
    const value = e.detail.value
    this.setData({
      form: {
        ...this.data.form,
        [key]: value
      }
    })
  },
  updateCheckBox(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      form: {
        ...this.data.form,
        [key]: !this.data.form[key]
      }
    })
  },
  selectGender(e) {
    this.setData({
      form: {
        ...this.data.form,
        gender: e.currentTarget.dataset.gender,
      }
    })
  },
  selectTag(e) {
    this.setData({
      form: {
        ...this.data.form,
        tag: e.currentTarget.dataset.tag === this.data.form.tag ? null : e.currentTarget.dataset.tag
      }
    })
  },
  gotoAddressMap() {
    wx.navigateTo({
      url: '/pages/ucenter/addressMap/addressMap',
    })
  },
  cancle() {
    wx.navigateBack({
      delta: 0,
    })
  },
  async save() {
    const { name, gender, tel, province, city, county, addressDetail } = this.data.form
    if (!name || name === '') {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none'
      })
      return
    }

    if (!(/^[A-z0-9\u4e00-\u9fa5]*$/.test(name))) {
      wx.showToast({
        title: '联系人姓名只能是汉字,字母或者数字',
        icon: 'none'
      })
      return
    }

    if (gender === null) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      })
      return
    }

    if (!tel || tel === '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }

    if (!(/^(0|86|17951)?(13[0-9]|14[1456789]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/.test(tel))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return
    }

    if (!province || !city || !county) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      });
      return
    }

    if (!addressDetail || addressDetail === '') {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none'
      });
      return
    }

    const response = await apiAddressNew(this.data.form)
    if (response.status) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      if (prevPage.route == "pages/checkout/checkout") {
        prevPage.setData({
          addressId: response.data
        })
        try {
          wx.setStorageSync('addressId', response.data);
        } catch (e) {

        }
      }
      wx.navigateBack({
        delta: 0,
      })
    }
  },
  async updateAddress() {
    const response = await apiAddressDetail(this.data.addressId)
    if (response.status) {
      this.setData({
        form: { ...response.data }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      addressId: options.addressId || 0
    })
    if (parseInt(this.data.addressId) !== 0) {
      //更新地址信息
      this.updateAddress()
    }
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
    const address = getApp().globalData.address
    if (address) {
      wx.showToast({
        title: '注意补全门牌号码哦',
        icon: 'none'
      })
      this.setData({
        form: {
          ...this.data.form,
          province: address.province,
          city: address.city,
          county: address.district,
          addressDetail: address.address + address.title,
        }
      })
      setTimeout(() => {
        this.setData({
          textareaFoucs: true,
        })
      }, 1000);
      getApp().globalData.address = null
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})