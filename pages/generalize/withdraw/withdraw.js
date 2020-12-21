const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    disabled: true,
    remainingIncome: 0,
    loading: false,
    amount: '',
    ruleVisible: false
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.getData()
  },
  getData: function () {
    let that = this
    util.request(api.incomeStat).then(function(res) {
      if (res.errno == 0) {
        that.setData({
          remainingIncome: res.data.remainingIncome
        });
      } else {
        
      }
    });
  },
  submitBtn: function () {
    let that = this
    if(that.data.amount == ''){
      util.showErrorToast('请输入提现金额')
      return false;
    }
    if(that.data.amount < 100){
      util.showErrorToast('提现金额100元起')
      return false;
    }
    if(that.data.amount > 5000){
      util.showErrorToast('微信零钱限制，单笔提现不能超过5000元')
      return false;
    }
    if(that.data.amount > that.data.remainingIncome){
      util.showErrorToast('提现金额超出可提余额')
      return false;
    }
    wx.requestSubscribeMessage({
      tmplIds: ['Ntk9p3o5ZMPBQDOSYA2Iv7OuJdnHRgUYgg1GQhB3P_Y'],
      success() {
        
      },
      fail(res) {
        console.log(res)
      },
      complete() {
        wx.showLoading({
          title: '提交中...',
        });
        util.request(api.incomeWithdraw, {
          amount: that.data.amount,
        }, "POST").then(function(res) {
          if (res.errno == 0) {
            util.showErrorToast('提现申请已提交')
            that.setData({
              amount: ''
            })
            setTimeout(function(){that.getData()},1500)
          } else {
            util.showErrorToast(res.errmsg);
          }
        })
      }
    })
  },
  validateNumber: function (obj) {
    // return val.replace(/[^\d.]/g, '')
    obj = obj.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    obj = obj.replace(/^\./g, ""); //验证第一个字符是数字
    obj = obj.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (obj.indexOf(".") < 0 && obj != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      obj = parseFloat(obj);
    }
    if (!obj || obj == '0' || obj == '0.0' || obj == '0.00') {
      return '';
    }
    return obj;
  },
  changeInput: function (e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      amount: value
    })
    if(this.data.amount != '' && this.data.amount > 100 && this.data.amount < this.data.remainingIncome){
      this.setData({
        disabled: false
      })
    }else{
      this.setData({
        disabled: true
      })
    }
  },
  ruleBtn: function () {
    this.setData({
      ruleVisible: true
    })
  },
  closeBtn: function () {
    this.setData({
      ruleVisible: false
    })
  }
  
})