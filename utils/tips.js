const moment = require('moment')

function springFestivalTips() {
  if (moment().isBetween('2021-02-10 00:00:00', '2021-02-16 23:59:59')) {
    wx.showModal({
      title: '祝您和家人新春快乐！',
      content: '除预售商品外，春节期间只接单不发货，2月10日至2月17日的订单，将在2月18-19日发出，急需的顾客请慎拍哦。',
      showCancel: false
    })
  }
}

module.exports = {
  springFestivalTips
}