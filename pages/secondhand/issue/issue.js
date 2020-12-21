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
    array: [],
    index: 0,
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
    // util.request(api.CommunityListSelf, {}).then(function (res) {
    //   if (res.errno == 0) {
    //     that.setData({
    //       array: res.data
    //     });
    //   } else {
    //     that.setData({
    //       array: []
    //     });
    //     wx.showToast({
    //       title: res.errmsg,
    //       icon: 'none'
    //     })
    //   }
    // });
  },
  onShow: function () {
    this.setData({
      menuButton: wx.getMenuButtonBoundingClientRect()
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
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
    let title = e.detail.value.title;
    let content = e.detail.value.content;
    if (title == '' || content == '' || this.data.picUrls.length === 0){
      util.showErrorToast('请完善发布内容')
      return false;
    }
    wx.showLoading({
      title: '发布中...',
    });
    util.request(api.SecondhandPost, {
      // communityId: this.data.array[this.data.index].id,
      communityId: wx.getStorageSync("community").id,
      content: content,
      title: title,
      picUrls: this.data.picUrls
    }, 'POST')
    .then(function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        wx.navigateBack()
      } else {
        util.showErrorToast(res.errmsg)
      }
    });
  }
})