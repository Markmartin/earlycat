const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    id: '',
    navBar: {
      height: 0,
      buttonHeight: 0,
      top: 0,
      right: 0,
      left: 0
    },
    title: '',
    content: '',
    type: '',
    maxPic: 9,
    picUrls: [],
    files: []
  },
  onLoad: function (options) {
    let that = this
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
    this.setData({
      id: options.id,
      type: options.type,
      maxPic: options.type=='circle'?1:9,
      title: options.type=='circle'?'话题标题':'帖子标题',
      content: options.type=='circle'?'话题简介':'帖子内容'
    })
  },
  onShow: function () {
    this.setData({
      menuButton: wx.getMenuButtonBoundingClientRect()
    })
  },
  delPic: function(e) {
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

  },
  bindFormSubmit: function(e) {
    let that = this
    let title = e.detail.value.title;
    let content = e.detail.value.content;
    if (title == '' || (content == '' && that.data.picUrls.length === 0)){
      util.showErrorToast('请完善发布内容');
      return false;
    }
    wx.showLoading({
      title: '发布中...',
    });
    if(that.data.type == 'circle'){
      util.request(api.CircleSave, {
        communityId: wx.getStorageSync("community").id,
        content: content,
        title: title,
        picUrl: that.data.picUrls[0]
      }, 'POST')
      .then(function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          wx.redirectTo({
            url: '/pages/moment/all/all?url=CircleMyList'
          })
        } else {
          util.showErrorToast(res.errmsg);
        }
      });
    }else{
      util.request(api.MomentPost, {
        circleId: that.data.id,
        communityId: wx.getStorageSync("community").id,
        moment: content,
        title: title,
        picUrls: that.data.picUrls
      }, 'POST')
      .then(function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          wx.navigateBack()
        } else {
          util.showErrorToast(res.errmsg);
        }
      });
    }
  }
})