const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp();
var imSocket = undefined;
var socketOpen = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    messageList: [],
    content: '',
    attachUrl: '',
    lastcont: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('userInfo').id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let token = wx.getStorageSync('token');

    if (token == null | token == '') {
      return;
    }

    that.wximconnect();
    imSocket.onOpen(function (res) {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件: ' + res)
    })
    imSocket.onMessage(function (res) {
      console.log('监听 WebSocket 接受到服务器的消息事件')
      //console.log(res)
      //console.log(JSON.parse(res.data))
      var jsonMessage = JSON.parse(res.data);
      if (jsonMessage instanceof Array) {
        // that.setData({
        //   messageList: JSON.parse(res.data)
        // })
        for (var i in jsonMessage) {
          // that.data.messageList.push(jsonMessage[i]);
          that.data.messageList.push(jsonMessage[i])
          that.setData({
            messageList: that.data.messageList,
            lastcont: "im-" + that.data.messageList[that.data.messageList.length - 1].id
          })
        }
        //that.data.messageList.concat(JSON.parse(res.data));
      } else {
        that.data.messageList.push(jsonMessage)
        that.setData({
          messageList: that.data.messageList,
          lastcont: "im-" + that.data.messageList[that.data.messageList.length-1].id
        })
      }
      //console.log(that.data.messageList[0]);
      that.pageScrollToBottom();
    })
    imSocket.onError(function (res) {
      that.wximconnect();
      console.log('监听 WebSocket 错误事件')
      console.log(res)
    })
    imSocket.onClose(function (res) {
      socketOpen = false;
      console.log('监听 WebSocket 连接关闭事件')
      console.log(res)
    })
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
    //imSocket.close()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (imSocket != null) {
      imSocket.close()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    util.request(api.MessageList, {
      up: true,
      userId: wx.getStorageSync('userInfo').id,
      communityId: wx.getStorageSync("community").id,
      index: this.data.messageList[0].id,
      limit: 10
    })
    .then(function (res) {
        if (res.errno == 0) {
          var oldMessages = res.data.list;
          if(oldMessages == '' || oldMessages.length == 0) {
            util.showInfoToast("没有更多信息了");
          }
          for (var i = 0; i< oldMessages.length ;i++) {
            that.data.messageList.unshift(oldMessages[i])
          }
          that.setData({
            messageList: that.data.messageList
          });
          
        } else {
          util.showErrorToast(res.errmsg);
        }
        wx.stopPullDownRefresh();
      });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //this.wximconnect();
  },
  inputWacth: function (e) {
    console.log(e);
    let item = e.currentTarget.dataset.model;
    this.setData({
      [item]: e.detail.value
    });
  },
  //发送消息
  sendMessage: function(e) {
    let that = this;
    let imMessage = new Object;
    if (util.isEmpty(that.data.content) && util.isEmpty(that.data.attachUrl)) {
      wx.showToast({
        title: "消息不能为空",
        icon: 'none'
      })
      return
    }
    
    if (!util.isEmpty(that.data.attachUrl)) {
      imMessage.attachUrl = that.data.attachUrl;
    } else {
      imMessage.content = that.data.content.trim();
    }
    imMessage.communityId = wx.getStorageSync("community").id;
    imMessage.fromUserId = wx.getStorageSync('userInfo').id;
    imMessage.fromUserAvatar = wx.getStorageSync('userInfo').avatar;
    imMessage.fromUserNickname = wx.getStorageSync('userInfo').nickname;
    
    if (socketOpen) {
      console.log('通过 WebSocket 连接发送数据', that.data.message)
      imSocket.send({
        data: JSON.stringify(imMessage)
        //data: that.data.message
      }, function (res) {
        console.log('已发送', res)
        //that.data.messageList.push(imMessage)
        // that.setData({
        //   messageList: that.data.messageList
        // })
      })
      that.setData({
        content: "",
        attachUrl: "",
        focus: true
      })
    }

  },
  wximconnect: function () {
    if(imSocket != null) {
      imSocket.close()
    }
    imSocket = wx.connectSocket({
      // url: api.OPenonOpen,
      url: api.IM + "?userId=" + wx.getStorageSync('userInfo').id + "&communityId=" + wx.getStorageSync("community").id,
      success: function (res) { console.log('建立成功') },
      fail: function () { console.log('建立失败') },
      complete: function () { }
    });
  },
    // 拍摄或从相册选取上传
  uploadPhoto: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //console.log('本地图片的路径:', tempFilePaths)
        that.upload(tempFilePaths)
      }
    })
  },


  // 上传图片
  upload: function (path) {
    var that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: api.StorageUpload,
      filePath: path[0],
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        //上传成功返回数据
        //console.log('上传成功返回的数据', JSON.parse(res.data).data);
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        that.setData({
          attachUrl: JSON.parse(res.data).data.url
        });
        that.sendMessage(that)
      },
      fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast(); //隐藏Toast
      }
    })
  },

  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('#chatMessage').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
  },

  imgPreview: function (e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = [];//获取data-list
    for (var i = 0; i < this.data.messageList.length;i++) {
      if (!util.isEmpty(this.data.messageList[i].attachUrl)) {
        imgList.push(this.data.messageList[i].attachUrl);
      }
    }
    wx.previewImage({
      current: src,
      urls: imgList
    })
  }
})