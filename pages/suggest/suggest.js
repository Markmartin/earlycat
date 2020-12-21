const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectId: '',
    list: [
      {
        id: 0,
        title: '硬件连接'
      },
      {
        id: 1,
        title: '优化建议'
      },
      {
        id: 2,
        title: '门禁'
      },
      {
        id: 3,
        title: '活动'
      },
      {
        id: 4,
        title: '物业'
      },
      {
        id: 5,
        title: '其他'
      }
    ],
    currentWordNumber: 0,
    maxPic: 4,
    picUrls: []
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
  selectIssue: function(e) {
    this.setData({
      selectId: e.currentTarget.dataset.id
    })
  },
  writeEvent: function(e) {
    var value = e.detail.value;
    this.setData({
      currentWordNumber: value.length
    })
  },
  delPic: function (e) {
    this.data.picUrls.splice(e.currentTarget.dataset.idx, 1)
    this.setData({
      picUrls: this.data.picUrls
    })
  },
  imgPreview: function (e) {
    let src = e.currentTarget.dataset.src;
    let imgList = e.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  chooseImage: function (e) {
    if (this.data.picUrls.length >= this.data.maxPic) {
      util.showErrorToast('只能上传九张图片')
      return false;
    }
    var that = this;
    wx.chooseImage({
      count: this.data.maxPic - this.data.picUrls.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        for (var i = 0; i < res.tempFilePaths.length; ++i) {
          that.upload(res.tempFilePaths[i]);
        }
      }
    })
  },
  upload: function (res) {
    var that = this;
    const uploadTask = wx.uploadFile({
      url: api.StorageUpload,
      filePath: res,
      name: 'file',
      success: function (res1) {
        var _res = JSON.parse(res1.data);
        if (_res.errno === 0) {
          var url = _res.data.url
          that.data.picUrls.push(url)
          that.setData({
            picUrls: that.data.picUrls
          })
        }
      },
      fail: function (e) {
        wx.showModal({
          title: '错误',
          content: '上传失败',
          showCancel: false
        })
      },
    })
    uploadTask.onProgressUpdate((res) => {
      // console.log('上传进度', res.progress)
      // console.log('已经上传的数据长度', res.totalBytesSent)
      // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })
  }
})