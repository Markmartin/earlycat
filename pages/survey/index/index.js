const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({
  data: {
    openFlag: false,
    errorText: '',
    id: '',
    details: ''
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
  },
  onShow: function () {
    this.getData();
  },
  openAnswer: function() {
    this.setData({
      openFlag: true
    })
  },
  setInput: function(e) {
    let idx = e.currentTarget.dataset.idx
    this.data.details.questions[idx].content = e.detail.value
  },
  radioChange: function(e) {
    let idx = e.currentTarget.dataset.idx
    this.data.details.questions[idx].curSelect = e.detail.value
  },
  checkboxChange: function(e) {
    let idx = e.currentTarget.dataset.idx
    this.data.details.questions[idx].curSelect = e.detail.value
  },
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    
    util.request(api.answerDetail, {
      id: this.data.id
    }).then(function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        if(res.data.discribe == ''){
          that.setData({
            openFlag: true
          })
        }
        that.setData({
          details: res.data
        });
        wx.setNavigationBarTitle({
          title: res.data.title
        })
      } else {
        that.setData({
          errorText: {text: res.errmsg}
        })
        // util.showErrorToast(res.errmsg);
      }
    });
  },
  submitSave: function () {
    for(let idx in this.data.details.questions){
      if(this.data.details.questions[idx].isRequired){
        if((this.data.details.questions[idx].questionType == 'completion' && !this.data.details.questions[idx].content) || (this.data.details.questions[idx].questionType == 'single' && !this.data.details.questions[idx].curSelect) || (this.data.details.questions[idx].questionType == 'multiple' && (!this.data.details.questions[idx].curSelect || this.data.details.questions[idx].curSelect.length == 0))){
          util.showErrorToast('请完善问卷内容');
          return false
        }
      }
    }
    let data = []
    for(let idx in this.data.details.questions){
      if(this.data.details.questions[idx].questionType == 'completion'){
        data.push({surveyId: this.data.details.id,content: this.data.details.questions[idx].content,questionId:this.data.details.questions[idx].id})
      }
      if(this.data.details.questions[idx].questionType == 'single'){
        data.push({surveyId: this.data.details.id,itemId:this.data.details.questions[idx].curSelect,questionId:this.data.details.questions[idx].id})
      }
      if(this.data.details.questions[idx].questionType == 'multiple'){
        data.push({surveyId: this.data.details.id,itemId:this.data.details.questions[idx].curSelect.join(','),questionId:this.data.details.questions[idx].id})
      }
    }
    util.request(api.answerAnswer, data, 'POST').then(function(res) {
      if (res.errno === 0) {
        wx.showModal({
          title: '提示',
          content: '提交成功',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  }
})