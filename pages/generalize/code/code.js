
Page({
  data: {
    userInfo: ''
  },
  onShow: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
    });
  },
  imgPreview: function (e) {
    let src = e.currentTarget.dataset.src;
    let imgList = e.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  }
})