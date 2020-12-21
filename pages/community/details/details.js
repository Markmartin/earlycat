// pages/community/details/details.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    type: 'comment',
    detailsData: '',
    detailsToolHeight: 0,
    detailsFooter: true,
    inputValue: '',

    comment_loading: false,
    comment_list: [],
    comment_page: 1,
    comment_limit: 10,
    comment_pages: 1,

    share_loading: false,
    share_list: [],
    share_page: 1,
    share_limit: 10,
    share_pages: 1,

    like_loading: false,
    like_list: [],
    like_page: 1,
    like_limit: 10,
    like_pages: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.getData();
    this.getTool();
    this.setData({
      detailsToolHeight: wx.getSystemInfoSync().windowHeight - 50
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.commentBtn()
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
  onShareAppMessage: function (res) {
    if (res === 'button'){}
    return {
      title: '转发',
      path: '/pages/index/index?pageUrl=/pages/community/details/details' + util.shareInvite(), // :代表?,;代表&，首页会做跳转处理
      success: function (res1) {
        console.log(res1)
      }
    }
  },
  commentBtn: function () {
    wx.pageScrollTo({
      scrollTop: wx.getSystemInfoSync().screenHeight,
      duration: 300
    })
  },
  clickNav: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type
    });
    this.getTool();
  },
  likeBtn: function () {
    let that = this;
    wx.showLoading({
      title: '点赞中...',
    });
    util.request(api.LikePost, {
      type: 3,
      valueId: that.data.id
    }, 'POST')
    .then(function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        let data1 = that.data.detailsData;
        data1.liked = true;
        that.setData({
          detailsData: data1
        })
      } else {
        util.showErrorToast(res.errmsg);
      }
    }).catch(function (reason, data) {
      
    });
  },
  bindFormSubmit: function () {
    let that = this;
    if (that.data.inputValue === '') {
      util.showErrorToast('发布内容不能为空');
      return false;
    }
    wx.showLoading({
      title: '发布中...',
    });
    util.request(api.CommentPost, {
      type: 2,
      valueId: that.data.id,
      hasPicture: false,
      content: that.data.inputValue,
      picUrls: [],
      parentId: 0,
      star: 0
    }, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          inputValue: ''
        })
      } else {
        util.showErrorToast(res.errmsg);
      }
    }).catch(function () {
      wx.hideLoading();
    });
  },
  bindInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  detailsFooterMethod: function (e) {
    if (e.currentTarget.dataset.flage == 'true') {
      this.setData({
        detailsFooter: false
      })
    } else {
      this.setData({
        detailsFooter: true
      })
    }
  },
  getTool: function () {
    if (this.data.type === 'comment') {
      this.getComment();
    } else if (this.data.type === 'share') {
      this.getShare();
    } else {
      this.getLike();
    }
  },
  getComment: function () {
    let that = this;
    if (that.data.comment_page > that.data.comment_pages) {
      return false;
    }
    that.setData({
      comment_loading: true
    })
    util.request(api.CommentList, {
      showType: 1,
      page: this.data.comment_page,
      limit: this.data.comment_limit,
      type: 2,
      valueId: that.data.id
    })
      .then(function (res) {
        that.setData({
          comment_loading: false
        })
        if (res.errno == 0) {
          that.setData({
            comment_list: that.data.comment_list.concat(res.data.list),
            comment_total: res.data.total,
            comment_pages: res.data.pages,
            comment_page: that.data.comment_page += 1
          });
        } else {
          util.showErrorToast(res.errmsg);
        }
      });
  },
  getShare: function () {
    let that = this;
    if (that.data.share_page > that.data.share_pages) {
      return false;
    }
    that.setData({
      share_loading: true
    })
    util.request(api.LikeList, {
      page: this.data.share_page,
      limit: this.data.share_limit,
      type: 3,
      valueId: that.data.id
    })
      .then(function (res) {
        that.setData({
          share_loading: false
        })
        if (res.errno == 0) {
          that.setData({
            share_list: that.data.share_list.concat(res.data.list),
            share_total: res.data.total,
            share_pages: res.data.pages,
            share_page: that.data.share_page += 1
          });
        } else {
          util.showErrorToast(res.errmsg);
        }
      });
  },
  getLike: function () {
    let that = this;
    if (that.data.like_page > that.data.like_pages) {
      return false;
    }
    that.setData({
      like_loading: true
    })
    util.request(api.LikeList, {
      page: this.data.share_page,
      limit: this.data.share_limit,
      type: 3,
      valueId: that.data.id
    })
      .then(function (res) {
        that.setData({
          like_loading: false
        })
        if (res.errno == 0) {
          that.setData({
            like_list: that.data.like_list.concat(res.data.list),
            like_total: res.data.total,
            like_pages: res.data.pages,
            like_page: that.data.share_page += 1
          });
        } else {
          util.showErrorToast(res.errmsg);
        }
      });
  },
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.MomentDetail, {
      id: that.data.id
    })
      .then(function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          that.setData({
            detailsData: res.data
          })
        } else {
          util.showErrorToast(res.errmsg);
        }
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