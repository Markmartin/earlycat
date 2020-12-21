// pages/recruit/recruit.js
const { apiUpdateRecruit } = require('../../config/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      name: null,
      gender: null,
      age: null,
      domicile: null,
      minority: null,
      phone: null,
      isDrivingLicense: null,
      post: [],
      address: null
    }
  },

  updateForm(e) {
    const { value } = e.detail
    const { key } = e.currentTarget.dataset
    const formKey = `form.${key}`
    this.setData({
      [formKey]: value
    })
  },

  updateRadio(e) {
    const { value, key } = e.currentTarget.dataset
    const formKey = `form.${key}`
    this.setData({
      [formKey]: value
    })
  },

  updateCheckbox(e) {
    const { value, key } = e.currentTarget.dataset
    const formKey = `form.${key}`
    let index = this.data.form.post.indexOf(value)
    if (index !== -1) {
      let jobs = this.data.form.post.filter((item) => item !== value)
      this.setData({
        [formKey]: jobs
      })
    }

    if (index === -1) {
      this.setData({
        [formKey]: [...this.data.form.post, value]
      })
    }
  },

  async submit() {
    const { name, gender, age, domicile, minority, phone, isDrivingLicense, post, address } = this.data.form
    if (!name) {
      wx.showToast({
        title: '姓名不能为空',
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

    if (!age) {
      wx.showToast({
        title: '年龄不能为空',
        icon: 'none'
      })
      return
    }

    if (!domicile) {
      wx.showToast({
        title: '籍贯不能为空',
        icon: 'none'
      })
      return
    }

    if (!minority) {
      wx.showToast({
        title: '民族不能为空',
        icon: 'none'
      })
      return
    }

    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }

    if (phone.length !== 11) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }

    if (isDrivingLicense === null) {
      wx.showToast({
        title: '请选择是否有驾照',
        icon: 'none'
      })
      return
    }

    if (post.length === 0) {
      wx.showToast({
        title: '意向岗位不能为空',
        icon: 'none'
      })
      return
    }

    if (!address) {
      wx.showToast({
        title: '居住地址不能为空',
        icon: 'none'
      })
      return
    }

    const response = await apiUpdateRecruit(this.data.form)
    if (response.status) {
      wx.showToast({ title: '申请已提交成功，我们会尽快联络您！', icon: 'none', duration: 2500 })
      setTimeout(() => {
        wx.navigateBack()
      }, 3000)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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