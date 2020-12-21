const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    id: '',
    type: 'comment',
    detailsData: '',
    inputValue: '',
    focusFlag: false,
    parentId: 0,
    placeholder: '回复',

    comment_loading: false,
    comment_list: [],
    comment_page: 1,
    comment_limit: 20,
    comment_pages: 1,

    share_loading: false,
    share_list: [],
    share_page: 1,
    share_limit: 20,
    share_pages: 1,

    like_loading: false,
    like_list: [],
    like_page: 1,
    like_limit: 20,
    like_pages: 1
  },
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id: options.id
      })
      this.getData()
      this.getTool()
    }
  },
  resetData: function () {
    this.setData({
      
      comment_loading: false,
      comment_list: [],
      comment_page: 1,
      comment_limit: 20,
      comment_pages: 1,

      share_loading: false,
      share_list: [],
      share_page: 1,
      share_limit: 20,
      share_pages: 1,

      like_loading: false,
      like_list: [],
      like_page: 1,
      like_limit: 20,
      like_pages: 1
    })
    this.getTool()
  },
  onReachBottom: function () {
    this.getTool();
  },
  onPullDownRefresh: function () {
    this.resetData()
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function() {
    let that = this;
    util.request(api.MomentShares, {
      id: that.data.id
    }).then(function (res) {});
    return {
      imageUrl: that.data.detailsData.picUrls[0],
      title: that.data.detailsData.title,
      path: '/pages/index/index?pageUrl=/pages/moment/details/details:id=' + this.data.id + util.shareInvite()// :代表?,;代表&，首页会做跳转处理
    }
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
          wx.setNavigationBarTitle({
            title: res.data.circleName
          })
        } else {
          util.showErrorToast(res.errmsg)
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
      type: 2,
      valueId: that.data.id
    }, 'POST')
    .then(function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        util.showErrorToast('点赞成功')
        let data1 = that.data.detailsData;
        data1.liked = true;
        that.setData({
          detailsData: data1
        })
        that.resetData()
      } else {
        util.showErrorToast(res.errmsg)
      }
    }).catch(function (reason, data) {
      
    });
  },
  bindFormSubmit: function (data) {
    let that = this;
    that.setData({
      inputValue: data.detail.value
    })
    if (that.data.inputValue === '') {
      util.showErrorToast('评论内容不能为空')
      return false;
    }
    wx.showLoading({
      title: '评论中...',
    });
    util.request(api.CommentPost, {
      type: 2,
      valueId: that.data.id,
      hasPicture: false,
      content: that.data.inputValue,
      picUrls: [],
      parentId: that.data.parentId,
      star: 0
    }, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        util.showErrorToast('评论成功')
        that.setData({
          inputValue: ''
        })
        that.resetData()
      } else {
        util.showErrorToast(res.errmsg)
      }
    }).catch(function () {
      wx.hideLoading();
    });
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
    if (that.data.comment_page > that.data.comment_pages || that.data.comment_loading) {
      return false;
    }
    that.setData({
      comment_loading: true
    })
    util.request(api.CommentList, {
      showType: 2,
      page: that.data.comment_page,
      limit: that.data.comment_limit,
      type: 2,
      valueId: that.data.id
    }).then(function (res) {
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
        util.showErrorToast(res.errmsg)
      }
    });
  },
  getShare: function () {
    let that = this;
    if (that.data.share_page > that.data.share_pages || that.data.share_loading) {
      return false;
    }
    that.setData({
      share_loading: true
    })
    util.request(api.LikeList, {
      page: that.data.share_page,
      limit: that.data.share_limit,
      type: 2,
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
          util.showErrorToast(res.errmsg)
        }
      });
  },
  getLike: function () {
    let that = this;
    if (that.data.like_page > that.data.like_pages || that.data.like_loading) {
      return false;
    }
    that.setData({
      like_loading: true
    })
    util.request(api.LikeList, {
      page: that.data.share_page,
      limit: that.data.share_limit,
      type: 2,
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
            like_page: that.data.like_page += 1
          });
        } else {
          util.showErrorToast(res.errmsg)
        }
      });
  },
  replyBtn: function (data) {
    this.setData({
      focusFlag: true,
      parentId: data.currentTarget.dataset.id,
      placeholder: '回复'+data.currentTarget.dataset.name
    })
  },
  blurInput: function () {
    this.setData({
      focusFlag: false,
      parentId: 0,
      placeholder: '回复'
    })
  }
})