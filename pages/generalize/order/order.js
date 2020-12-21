const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
  data: {
    filterQueryEndTime: '',
    filterQueryStartTime: '',
    filterType: '0',
    filterFlag: false,
    years: [],
    months: [],
    days: [],
    value: [999, 1, 1],

    navList: [
      { name: '全部', value: '' },
      { name: '即将到账', value: 0 },
      { name: '已到账', value: 1 },
      // {name: '无效', value: 2},
    ],
    totalOrders: 0,
    firstOrders: 0,
    repeatOrders: 0,
    invalidOrders: 0,
    loading: false,
    list: [],
    // queryEndTime: '2020-05-22 23:59:59',
    // queryStartTime: '2020-05-20 00:00:00',
    queryEndTime: '',
    queryStartTime: '',
    status: '',
    page: 1,
    pages: 1,
    limit: 20,
  },
  confirmBtn() {
    if (this.data.filterType == '0') {
      this.setData({
        queryEndTime: '',
        queryStartTime: '',
      })
    } else {
      if (this.data.filterQueryStartTime == '' || this.data.filterQueryEndTime == '') {
        util.showErrorToast('请完善日期')
        return false
      }
      this.setData({
        queryEndTime: this.data.filterQueryEndTime,
        queryStartTime: this.data.filterQueryStartTime,
      })
    }
    this.filterHide()
    this.restList()
  },
  filterSelect(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      filterType: type
    })
    if (type == '1') {
      this.initDatas(this.data.filterQueryStartTime)
    }
    if (type == '2') {
      this.initDatas(this.data.filterQueryEndTime)
    }
  },
  initDatas(val) {
    const date = new Date()
    const nowYear = date.getFullYear()
    const nowMonth = date.getMonth() + 1
    const nowDay = date.getDate()
    // 循环前先清空数组
    let years = []
    let months = []
    for (let i = nowYear - 2; i <= nowYear; i++) {
      years.push(i)
    }
    // 设置月份列表
    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    this.setData({
      years: years,
      months: months,
    })
    // 初始化当前年月
    if (val) {
      let birthday_obj = val.split('-');
      this.getMonth(parseInt(birthday_obj[0]), parseInt(birthday_obj[1]), parseInt(birthday_obj[2]))
    } else {
      this.getMonth(nowYear, nowMonth, nowDay)
    }

  },
  getMonth(year, month, day) {
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let dayNum = 0
    // 通过年和月获取这个月份下有多少天
    if (month === 2) { // 闰年
      dayNum = ((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0) ? 29 : 28
    } else {
      dayNum = daysInMonth[month - 1]
    }
    let days = []
    for (let i = 1; i <= dayNum; i++) {
      days.push(i)
    }
    this.setData({
      days: days
    })
    // 初始 选中年月日对应下标
    let yearIdx = 0
    let monthIdx = 0
    let dayIdx = 0

    // 获取滚动后 年月日对应的下标
    this.data.years.map((v, idx) => {
      if (v === year) {
        yearIdx = idx
      }
    })
    this.data.months.map((v, idx) => {
      if (v === month) {
        monthIdx = idx
      }
    })
    this.data.days.map((v, idx) => {
      if (v === day) {
        dayIdx = idx
      }
    })
    // 重置滚动后 年月日 的下标
    // 赋值年月日
    this.setData({
      value: [yearIdx, monthIdx, dayIdx],
    })
    let year1 = this.data.years[yearIdx]
    let month1 = this.data.months[monthIdx] > 9 ? this.data.months[monthIdx] : '0' + this.data.months[monthIdx]
    let day1 = this.data.days[dayIdx] > 9 ? this.data.days[dayIdx] : '0' + this.data.days[dayIdx]
    if (this.data.filterType == '1') {
      this.setData({
        filterQueryStartTime: year1 + '-' + month1 + '-' + day1
      })
    }
    if (this.data.filterType == '2') {
      this.setData({
        filterQueryEndTime: year1 + '-' + month1 + '-' + day1
      })
    }
  },
  bindDateChangeStart(e) {
    // valIndex 是获取到的年月日在各自集合中的下标
    const valIndex = e.detail.value
    // console.log(JSON.stringify(e.mp.detail.value))
    let year = this.data.years[valIndex[0]]
    let month = this.data.months[valIndex[1]]
    let day = this.data.days[valIndex[2]]
    // 滚动时再动态 通过年和月获取 这个月下对应有多少天
    this.getMonth(year, month, day)
  },
  filterShow() {
    this.setData({
      filterFlag: true,
      filterQueryStartTime: this.data.queryStartTime,
      filterQueryEndTime: this.data.queryEndTime
    })
  },
  filterHide() {
    this.setData({
      filterFlag: false
    })
  },
  onLoad: function (options) {
    this.restList()
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {
    this.restList()
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    this.getList();
  },
  navBtn: function (e) {
    this.setData({
      status: this.data.navList[e.currentTarget.dataset.idx].value
    })
    this.restList()
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  restList: function () {
    this.setData({
      totalOrders: 0,
      firstOrders: 0,
      repeatOrders: 0,
      invalidOrders: 0,
      loading: false,
      list: [],
      page: 1,
      pages: 1,
      limit: 20,
    });
    this.getList()
  },
  clickRow: function (e) {
    let idx = e.currentTarget.dataset.idx
    var price = 'list[' + idx + '].showDetail'
    this.setData({
      [price]: !this.data.list[idx].showDetail
    })
  },
  getList: function () {
    var that = this;
    if ((that.data.page > that.data.pages) || that.data.loading) {
      return false;
    }
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.incomeOrders, {
      queryEndTime: that.data.queryEndTime == '' ? that.data.queryEndTime : that.data.queryEndTime + ' 23:59:59',
      queryStartTime: that.data.queryStartTime == '' ? that.data.queryStartTime : that.data.queryStartTime + ' 00:00:00',
      status: that.data.status,
      page: that.data.page,
      limit: that.data.limit
    }).then(function (res) {
      if (res.errno == 0) {
        that.setData({
          totalOrders: res.data.totalOrders,
          firstOrders: res.data.firstOrders,
          repeatOrders: res.data.repeatOrders,
          invalidOrders: res.data.invalidOrders,
          list: that.data.list.concat(res.data.list),
          total: res.data.total,
          pages: res.data.pages,
          page: that.data.page += 1
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
      that.setData({
        loading: false
      })
    });
  }
})