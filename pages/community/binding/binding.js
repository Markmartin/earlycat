var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    id: '',
    community: '',
    details: '',
    communityList: []
  },
  onLoad: function (option) {
    if(option.community){
      this.setData({
        community: JSON.parse(option.community)
      })
      this.syncData()
    }
    if(option.scene){
      this.setData({
        id: option.scene
      })
      this.getData()
    }
  },
  onShow: function () {
    
  },
  btn: function () {
    let that = this
    // wx.requestSubscribeMessage({
      // tmplIds: ['MncpduWGlKIaOvonnjYy8Pq6npTA_dDigtM4Nb-FsiE'],
      // success(res) {
        util.request(api.CommunityListSelf).then(function (res) {
          if (res.errno === 0) {
            if(res.data.length == 0){
              wx.removeStorageSync('community')
            }
            for(let idx in res.data){
              if(res.data[idx].active){
                wx.setStorageSync('community', res.data[idx])
                break
              }
            }

            let flag = false
            for (let idx in res.data) {
              if (res.data[idx].id == that.data.details.id) {
                flag = true
              }
            }
            if (flag) {
              if(wx.getStorageSync('source') == 'navigateBack'){
                wx.navigateBack({
                  delta: 2
                })
                wx.removeStorageSync('source')
              }else{
                wx.reLaunch({
                  url: '/pages/index/index'
                })
              }
            } else {
              that.communityBinding()
            }
          }
        })
      // },
      // fail(res) {
      //   console.log("requestSubscribeMessage fail")
      //   console.log(res)
      // }
    // })
  },
  getData: function () {
    let that = this;
    util.request(api.CommunityDetail,{id: that.data.id}).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          details: res.data
        });
        wx.setNavigationBarTitle({
          title: res.data.name
        })
      }
    });
  },
  syncData: function () {
    let that = this;
    util.request(api.CommunitySync, this.data.community, "POST").then(function(res) {
      if (res.errno === 0) {
        that.setData({
          details: res.data,
          id: res.data.id
        });
        wx.setNavigationBarTitle({
          title: res.data.name
        })
      }
    });
  },
  communityBinding: function () {
    let that = this;
    util.request(api.CommunityBinding,{
      id: that.data.id
    }, "POST").then(function(res) {
      if (res.errno === 0) {
        if(res.data.active){
          wx.setStorageSync('community', res.data)
        }
        if(wx.getStorageSync('source') == 'navigateBack'){
          wx.navigateBack({
            delta: 2
          })
          wx.removeStorageSync('source')
        }else{
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }
    });
  }
})