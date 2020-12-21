const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    navBar: {
      height: 0,
      buttonHeight: 0,
      top: 0,
      right: 0,
      left: 0
    },
    tagList: [],
    tagValue: '',
    typeList: ['家政服务','家电维修','周边商家'],
    startTime: '08:00',
    endTime: '22:00',
    maxPic: 9,
    curPicKey: '',
    sitePicUrls: [],
    licensePicUrls: [],
    formData: {
      name: '',
      type: 0,
      address: '',
      telephone: '',
      floorPrice: '',
      businessScope: '',
      desc: '',
      businessLicenseUrl: '',
      businessTime: '',
      picUrls: ''
    }
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      ['formData.type']: options.type
    })
    let menuButton = wx.getMenuButtonBoundingClientRect()
    wx.getSystemInfo({
      success (res) {
        that.setData({
          navBar: {
            height: menuButton.height + res.statusBarHeight + ((menuButton.top-res.statusBarHeight)*2),
            buttonHeight: menuButton.height,
            top: res.statusBarHeight + (menuButton.top-res.statusBarHeight),
            right: menuButton.width+(res.screenWidth-menuButton.right),
            left: res.screenWidth-menuButton.right
          }
        })
      }
    })
  },
  onShow: function () {
    
  },
  delTag: function (e) {
    let tag = this.data.tagList
    tag.splice(e.currentTarget.dataset.idx,1)
    this.setData({
      tagList: tag
    })
  },
  addTag: function (e) {
    if(e.detail.value == ''){
      return false
    }
    let tag = this.data.tagList
    tag.push(e.detail.value)
    this.setData({
      tagList: tag,
      tagValue: ''
    })
  },
  bindEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  bindStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindTypeChange: function(e) {
    this.setData({
      ['formData.type']: e.detail.value
    })
  },
  delPic: function(e) {
    this.setData({
      curPicKey: e.currentTarget.dataset.key
    })
    this.data[this.data.curPicKey].splice(e.currentTarget.dataset.idx, 1)
    this.setData({
      [this.data.curPicKey]: this.data[this.data.curPicKey]
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
    this.setData({
      curPicKey: e.currentTarget.dataset.key
    })
    if (this.data[this.data.curPicKey].length >= this.data.maxPic) {
      util.showErrorToast('只能上传九张图片')
      return false;
    }

    var that = this;
    wx.chooseImage({
      count: this.data.maxPic - this.data[this.data.curPicKey].length,
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
          that.data[that.data.curPicKey].push(url)
          that.setData({
            [that.data.curPicKey]: that.data[that.data.curPicKey]
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

  },
  bindFormSubmit: function(e) {
    let that = this
    let data = e.detail.value
    for(let idx in data){
      if(data[idx] == '' && idx != 'desc'){
        util.showErrorToast('请完善发布内容')
        return false;
      }
    }
    if (that.data.tagList.length === 0 || that.data.licensePicUrls.length === 0){
      util.showErrorToast('请完善发布内容')
      return false;
    }
    let formData = {
      name: data.name,
      type: that.data.formData.type,
      address: data.address,
      telephone: data.telephone,
      floorPrice: data.floorPrice,
      desc: data.desc,
      businessScope: that.data.tagList,
      businessLicenseUrl: that.data.licensePicUrls.join(','),
      businessTime: that.data.startTime + '-' + that.data.endTime,
      picUrls: that.data.sitePicUrls
    }
    wx.showLoading({
      title: '发布中...',
    });
    util.request(api.businessadd, formData, 'POST')
    .then(function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        wx.showModal({
          title: '提示',
          content: '发布成功，等待审核',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      } else {
        util.showErrorToast(res.errmsg)
      }
    });
  }
})