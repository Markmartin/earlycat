var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();
const { apiApplyToBecomePromoter, apiLiveRooms } = require('../../../config/request')

Page({
  data: {
    countDownFlag: false,
    countdownEndTime: '',
    countdown: '',
    community: '',
    userInfo: {
      nickname: '登录/注册',
      avatar: 'https://sesame.oss-cn-shanghai.aliyuncs.com/ytgkljkteg3yw43ui8vt.png'
    },
    coupons: '--',
    goodsCollects: '--',
    footprints: '--',
    remaining: '--',
    order: {
      unpaid: 0,
      unship: 0,
      unrecv: 0,
      uncomment: 0
    },
    liveRoom: null,
    buttons: [{ text: '取消' }, { text: '确定' }],
    hasLogin: false,
    dialogShow: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () { },
  onPullDownRefresh: function () {
    this.getData()
    wx.stopPullDownRefresh();
  },
  onShow: async function () {
    await app.updateCartBadge()
    this.getData()
    this.updateLiveRoom()
  },
  getData() {
    let that = this;
    //获取用户的登录信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      });
      util.request(api.userInfo).then(function (res) {
        if (res.errno === 0) {
          if (res.data.status == 1) {
            wx.showModal({
              title: '提示',
              content: '账号已被禁用',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.clearStorageSync()
                  that.setData({
                    community: '',
                    userInfo: {
                      nickname: '点击登录',
                      avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
                    },
                    coupons: '--',
                    goodsCollects: '--',
                    footprints: '--',
                    order: {
                      unpaid: 0,
                      unship: 0,
                      unrecv: 0,
                      uncomment: 0
                    },
                    hasLogin: false
                  })
                }
              }
            })
          } else {
            wx.setStorageSync('userInfo', res.data)
            that.setData({
              userInfo: res.data,
            });
            if (res.data.funBuy) {
              that.data.countdownEndTime = res.data.funBuyExpirationTime
              that.countDown()
            }
          }
        } else {
          // util.showErrorToast(res.errmsg);
        }
      });
      util.request(api.UserIndex).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            coupons: res.data.coupons,
            goodsCollects: res.data.goodsCollects,
            footprints: res.data.footprints,
            order: res.data.order,
            remaining: res.data.remaining || 0
          });
        }
      });
    } else {
      this.setData({
        hasLogin: false
      });
    }

    this.setData({
      community: wx.getStorageSync('community')
    })
  },
  async updateLiveRoom() {
    const response = await apiLiveRooms()
    if (response.status) {
      let data = JSON.parse(response.data)
      const { errcode, room_info } = data
      if (errcode == 0) {
        let room = room_info.find(room => room.live_status == 101)
        if (room) {
          this.setData({
            liveRoom: room
          })
        }
      }
    }
  },
  countDown: function () {
    let time1 = new Date(this.data.countdownEndTime.replace(/-/g, '/')).getTime()
    let time2 = new Date().getTime()
    let mss = (time1 - time2) / 1000
    let hours = parseInt((mss % (60 * 60 * 24)) / (60 * 60))
    let minutes = parseInt((mss % (60 * 60)) / (60))
    let seconds = parseInt((mss % (60)))
    this.setData({
      countdown: (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    })
    if (mss > 0) {
      this.setData({
        countDownFlag: true
      })
      setTimeout(this.countDown, 1000);
    } else {
      this.setData({
        countDownFlag: false
      })
    }
  },
  startmessage(e) {
    console.log(e)
  },
  completemessage(e) {
    if (e.detail.errcode == 0) {
      wx.showToast({
        duration: 3000,
        title: '入群方式已发送，请查收微信服务消息',
        icon: 'none'
      })
    }
  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goOrder() {
    if (this.data.hasLogin) {
      try {
        wx.setStorageSync('tab', 0);
      } catch (e) {

      }
      wx.navigateTo({
        url: "/pages/ucenter/order/order"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goOrderIndex(e) {
    if (this.data.hasLogin) {
      let tab = e.currentTarget.dataset.index
      let route = e.currentTarget.dataset.route
      try {
        wx.setStorageSync('tab', tab);
      } catch (e) {

      }
      wx.navigateTo({
        url: route,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goGroupon() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/groupon/myGroupon/myGroupon"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goCommunityCode() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/community/code/code"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  openUrl(e) {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  applyToBecomePromoter() {
    if (this.data.hasLogin) {
      this.setData({ dialogShow: true })
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  async requestApplication(e) {
    const { index } = e.detail
    this.setData({
      dialogShow: false
    })
    if (index == 1) {
      const response = await apiApplyToBecomePromoter()
      if (response.status) {
        wx.showToast({
          title: '申请发送成功',
          icon: 'none'
        })
      }
    }
  },
  bindPhoneNumber: function (e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }

    if (!this.data.hasLogin) {
      wx.showToast({
        title: '绑定失败：请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    util.request(api.AuthBindPhone, {
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.showToast({
          title: '绑定手机号码成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },
  goAfterSale: function () {
    wx.showToast({
      title: '目前不支持',
      icon: 'none',
      duration: 2000
    });
  },
  aboutUs: function () {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },
  goHelp: function () {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (!res.confirm) {
          return;
        }
        util.request(api.AuthLogout, {}, 'POST');
        wx.clearStorage()
        // wx.removeStorageSync('token');
        // wx.removeStorageSync('userInfo');
        // wx.removeStorageSync('openId');;
        // wx.removeStorageSync('community');
        wx.reLaunch({
          url: '/pages/homepage/homepage'
        });
      }
    })

  },
  goCommunityGuide: function () {
    let community = wx.getStorageSync('community');
    if (this.data.hasLogin) {
      if (community.id) {
        wx.navigateTo({
          url: '/pages/community/guide/guide?id=' + community.id
        })
      } else {
        util.showErrorToast("请先加入社区");
      }
    } else {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      })
    }
  },
  goCommunityResident: function () {
    let community = wx.getStorageSync('community');
    if (this.data.hasLogin) {
      if (community.id) {
        wx.navigateTo({
          url: '/pages/community/resident/resident'
        })
      } else {
        util.showErrorToast("请先加入社区");
      }
    } else {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      })
    }
  },
  goCommunityRecord: function () {
    let community = wx.getStorageSync('community');
    if (this.data.hasLogin) {
      if (community.id) {
        wx.navigateTo({
          url: '/pages/community/record/record'
        })
      } else {
        util.showErrorToast("请先加入社区");
      }
    } else {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      })
    }
  },
  gotoLiveBroadcast() {
    if (this.data.hasLogin) {
      let roomId = this.data.liveRoom.roomid // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
      let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  }
})