const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../utils/user.js');
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: ['户主', '家庭成员', '租客', '亲朋好友'],
    scanInfo: '',
    communitys: [],
    showHouseholdModal: false,
    roomId: null,
    householdTypes: [{ value: 1, name: '家庭成员' }, { value: 2, name: '租客' }, { value: 3, name: '亲朋好友' }],
    householdTypeIndex: 0,
    householdTypeValue: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    // util.request(api.CommunityBuildingsSelf, {}).then(function (res) {
    //   if (res.errno == 0) {
    //     console.log("我的房子信息：");
    //     console.log(res.data);
    //     let community = [];
    //     let buildings = [];
    //     let romms = [];
    //     let communityIdx = 0;
    //     for (var idx in res.data) {
    //       community.push({ id: res.data[idx].id, name: res.data[idx].name })
    //     }
    //     for (var idx in res.data[0].buildings) {
    //       buildings.push({ id: res.data[0].buildings[idx].id, name: res.data[0].buildings[idx].name })
    //     }
    //     for (var idx in res.data[0].buildings[0].rooms) {
    //       romms.push({ id: res.data[0].buildings[0].rooms[idx].id, name: res.data[0].buildings[0].rooms[idx].name })
    //     }
    //     that.setData({
    //       buildingList: res.data,
    //       multiArray: [community, buildings, romms]
    //     })
    //   } else {
    //   }
    // });
    that.getList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getList: function () {
    let that = this;
    util.request(api.CommunityHouseholdList, {}).then(function (res) {
      if (res.errno == 0) {
        console.log("家庭成员信息：")
        console.log(res.data)
        that.setData({
          communitys: res.data
        })
      } else {
      }
    });
  },
  qrcode: function (e) {
    console.log(e.currentTarget.dataset)
    let that = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        let data = res.result.split(',')
        that.setData({
          scanInfo: {
            id: data[0],
            name: data[1]
          },
          showHouseholdModal: true,
          roomId: e.currentTarget.dataset.roomId
        })
      },
      fail() {
        that.setData({
          scanInfo: ''
        })
      }
    })
  },
  userbuildingAdd: function () {
    let that = this;
    util.request(api.CommunityUserbuildingAdd, {
      userId: that.data.scanInfo.id,
      roomId: that.data.roomId,
      type: that.data.householdTypeValue
    }, 'POST').then(function (res) {
      console.log("添加成员结果：")
      console.log(res)
      that.setData({
        showHouseholdModal: false
      })
      if (res.errno === 0) {
        that.getList();
      } else {
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  userbuildingDelete: function (e) {
    let that = this;
    wx.showModal({
      // title: '提示',
      content: '确定要删除当前人员吗？',
      success(res) {
        if (res.confirm) {
          util.request(api.CommunityUserbuildingDelete, {
            userBuildingId: e.currentTarget.dataset.id
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              that.getList();
            } else {
              wx.showToast({
                title: res.errmsg,
                icon: 'none',
                duration: 2000
              })
            }
          });
        } else if (res.cancel) {
          
        }
      }
    });
  },
  closeMask: function () {
    this.setData({
      showHouseholdModal: false
    })
  },
  bindHouseholdTypePickerChange: function (e) {
    //console.log(this.data.householdTypes[e.detail.value].value + "=" + e.detail.value)
    this.setData({
      householdTypeIndex: e.detail.value,
      householdTypeValue: this.data.householdTypes[e.detail.value].value
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;
              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
  }
})