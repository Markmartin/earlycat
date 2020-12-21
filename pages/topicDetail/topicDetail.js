var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    id: 0,
    topic: {},
    topicList: [],
    commentCount: 0,
    commentList: [],
    topicGoods: []
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      id: options.id
    });

    util.request(api.TopicDetail, {
      id: that.data.id
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          topic: res.data.topic,
          topicGoods: res.data.goods
        });
        wx.setNavigationBarTitle({
          title: that.data.topic.title
        })

        WxParse.wxParse('topicDetail', 'html', res.data.topic.content, that);
      }
    });

    // util.request(api.TopicRelated, {
    //   id: that.data.id
    // }).then(function(res) {
    //   if (res.errno === 0) {
    //     that.setData({
    //       topicList: res.data.list
    //     });
    //   }
    // });
  },
  onShareAppMessage: function() {
    let that = this;
    return {
      title: that.data.topic.title,
      desc: that.data.topic.subtitle,
      path: '/pages/index/index?pageUrl=/pages/topicDetail/topicDetail:id=' + this.data.topic.id + util.shareInvite()// :代表?,;代表&，首页会做跳转处理
    }
  },
  getCommentList() {
    let that = this;
    util.request(api.CommentList, {
      valueId: that.data.id,
      type: 1,
      showType: 0,
      page: 1,
      limit: 5
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          commentList: res.data.list,
          commentCount: res.data.total
        });
      }
    });
  },
  postComment() {
    if (!wx.getStorageSync('userInfo') && !wx.getStorageSync('token')) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    } else {
      wx.navigateTo({
        url: '/pages/topicCommentPost/topicCommentPost?valueId=' + this.data.id + '&type=1',
      })
    }
  },
  packBtn() {
    if(util.loginIntercept() == false){
      return false
    }
    let that = this
    let packIdx = 1
    for(let idx in that.data.topicGoods){
      util.request(api.GoodsDetail, {
        id: that.data.topicGoods[idx].id
      }).then((res) =>  {
        if (res.errno === 0) {
          util.request(api.CartAdd, {
            goodsId: res.data.productList[0].goodsId,
            number: 1,
            productId: res.data.productList[0].id
          }, "POST")
          .then(function(res1) {
            if(packIdx == that.data.topicGoods.length){
              util.showErrorToast('已成功加入购物车');
              // if (res1.errno == 0) {
              //   util.showErrorToast('已成功加入购物车');
              // }else{
              //   util.showErrorToast(res1.errmsg);
              // }
            }
            packIdx+=1
            // if (res1.errno == 0) {
            //   util.showErrorToast('已成功加入购物车');
            // }else{
            //   util.showErrorToast(res1.errmsg);
            // }
          })
        }
      })
    }
  }
})