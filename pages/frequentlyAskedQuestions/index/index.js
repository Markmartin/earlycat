// pages/frequentlyAskedQuestions/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [
      {
        question: '小程序如何下单？',
        answer: '点击进入并登录小程序，就可以正常选购，将您喜欢的产品加入购物车、确认付款后就可以了，一定注意正确填写地址及收货信息，以免影响您的送货时间，请提交前仔细核对哦！',
        toggle: false
      },
      {
        question: '下单满多少免运费？',
        answer: '单个订单实付金额付满29免配送费，实付金额也就是减去优惠券后的付款金额。',
        toggle: false
      },
      {
        question: '下单之后什么时候配送到家？',
        answer: '当天晚上十二点之前下单，次日送达到家，具体时间可在发货当天咨询客服或联系配送员。',
        toggle: false
      },
      {
        question: '新人有什么福利？',
        answer: '新人注册小程序立得108元新人红包，首单即送价值12.8元虫草鸡蛋1盒。',
        toggle: false
      },
      {
        question: '推荐新人下单有什么福利？',
        answer: '感谢您对我们的支持和认可！您可以点击进入小程序，点击右上角【…】中的发送给好友，好友点击小程序注册登录，下单并收货成功，每推荐一人即可获得1张5元无门槛红包，多推多送，上不封顶哦！',
        toggle: false
      },
      {
        question: '小程序新人红包及老用户专享红包如何领取？',
        answer: '点击登录注册小程序，红包会自动赠送到账户，可以在【我的】-【优惠券】中可以查询，满足条件即会自动使用。',
        toggle: false
      },
      {
        question: '如何取消订单？',
        answer: '在订单未发货前，您都可以在【我的】-【待发货】中点击订单来取消，退款将立即原路返回账户，发货后将无法取消订单，请您谅解，有问题请及时联系客服处理！',
        toggle: false
      },
      {
        question: '未发货前，订单中有多点或点错的商品怎么处理？',
        answer: '您可以在【我的】-【待发货】-点击多点或错点的商品对应的申请退款按键-填写退款份数及退款原因，申请退款即可，退款将立即原路返回您的账户。',
        toggle: false
      },
      {
        question: '遇到商品问题如何申请售后？',
        answer: '很抱歉给您带来不便！如遇到商品问题您可以申请售后，请您在【我的】-【已收货订单】-点击问题商品对应的申请退款按键，填写退款详情及上传照片，我们会在12小时内审核退款，请您耐心等待哦。',
        toggle: false
      },
      {
        question: '退款一直在审核，是不会退款了吗？',
        answer: '抱歉没有为您及时处理，您可以通过微信或小程序联系客服，为您服务。',
        toggle: false
      },
      {
        question: '为什么有的商品的退款金额与APP价格不一致？',
        answer: '退款金额是根据您使用过优惠券或享受其他优惠后的实际支付金额退款的哦，请您谅解。',
        toggle: false
      },
      {
        question: '如何查看配送信息，了解收货时间？',
        answer: '1.您可以通过客服微信或小程序将订单发送给客服查询。\n2.您也可以进入小程序在【我的】-【我的订单】中点开您所要查询的订单，最下方会有物流信息显示，也可以电话联系配送员询问。',
        toggle: false
      },
      {
        question: '你们的菜都是来自崇明的吗？',
        answer: '崇明的商品种类有限，根据季节差异及产品品种的不同，外地区的口感和品质可能会更好，产品部都是选择最好的产品给大家。有新品建议欢迎反馈给客服。',
        toggle: false
      },
      {
        question: '你们平台哪些产品是崇明的？',
        answer: '平台上产品标注是崇明的商品，都产自崇明。',
        toggle: false
      },
      {
        question: '你们崇明的农场来具体地址是什么？',
        answer: '在上海市崇明区陈家镇，里面有朝菜猫基地，欢迎大家来观光！',
        toggle: false
      },
      {
        question: '上海市都可以配送吗？',
        answer: '上海市都可以配送的，请您按照小程序提示正确填好地址及收货人信息即可！',
        toggle: false
      },
      {
        question: '怎么更改和添加收货地址？',
        answer: '您好，进入朝菜猫小程序-【我的】-【地址管理】-【新增或修改地址】，点击保存就可以了。',
        toggle: false
      },
      {
        question: '可以开发票吗？应该怎么操作？',
        answer: '可以的，您可以通过微信或小程序联系客服为您服务。',
        toggle: false
      },
      {
        question: '团购应该如何操作？',
        answer: '感谢您的信任，您可以通过小程序、微信或团购热线400-1669188联系专属客服为您服务。',
        toggle: false
      }
    ]
  },

  makePhoneCall() {
    wx, wx.makePhoneCall({
      phoneNumber: '4001669188'
    })
  },

  toggleAnswer(e) {
    const { index } = e.currentTarget.dataset
    const key = `questions[${index}].toggle`
    this.setData({
      [key]: !this.data.questions[index].toggle
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onShareAppMessage: function () {

  }
})