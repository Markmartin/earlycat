const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const WxParse = require('../../lib/wxParse/wxParse.js');

Page({
  data: {
    id: '',
    detailsData: '',
    htmlContent: ''
  },
  onLoad: function (options) {
    this.data.id = options.id;
    this.getData();
  },
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.AdDetail, {
      id: that.data.id
    })
      .then(function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          that.setData({
            detailsData: res.data.info,
            htmlContent: res.data.info.content
          })
          WxParse.wxParse('htmlContent', 'html', that.data.htmlContent, that, 5);
        } else {
          util.showErrorToast(res.errmsg);
        }
      });
  }
})