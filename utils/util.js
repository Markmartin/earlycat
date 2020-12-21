var api = require('../config/api.js');
var app = getApp();

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json',
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            wx.navigateTo({
              url: '/pages/auth/login/login'
            });
            reject(res.data);
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function(err) {
        wx.hideLoading();
        reject(err)
      }
    })
  });
}

function loginIntercept(){
  if(wx.getStorageSync('userInfo') && wx.getStorageSync('token')){
    return true
  }else{
    wx.navigateTo({
      url: '/pages/auth/login/login'
    });
    return false
  }
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    mask: true
  })
}

function showInfoToast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    mask: true
  })
}
function handleOrderReturn() {
  setTimeout(() => {
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2]
    beforePage.restList();
    wx.navigateBack({
      delta: 1,
    })
  }, 1500);
}

// 计算时间差
function timestampFormat(time) {
  var timestamp = new Date(time);
  function zeroize(num) {
    return (String(num).length == 1 ? '0' : '') + num;
  }

  var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象

  var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

  if (timestampDiff < 60) { // 一分钟以内
    return "刚刚";
  } else if (timestampDiff < 3600) { // 一小时前之内
    return Math.floor(timestampDiff / 60) + "分钟前";
  } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
    return '今天' + zeroize(H) + ':' + zeroize(i);
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return '昨天' + zeroize(H) + ':' + zeroize(i);
    } else if (curDate.getFullYear() == Y) {
      return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    } else {
      return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
    }
  }
}

/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages()    //获取加载的页面
  console.log(pages)
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options
  return options
  // //拼接url的参数
  // var urlWithArgs = url + '?'
  // for (var key in options) {
  //   var value = options[key]
  //   urlWithArgs += key + '=' + value + '&'
  // }
  // urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  // return urlWithArgs
}

function getJsonLength(json) {
  var jsonLength = 0;
  for (var i in json) {
    jsonLength++;
  }
  return jsonLength;
}

function isEmpty(str) {
  if(str == null) return true;
  if (str == "") return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
}

function shareInvite(flag){
  let str = ''
  let id = ''
  if(wx.getStorageSync('userInfo').id){
    id = wx.getStorageSync('userInfo').id
  }
  if(flag){
    str = '?invite='+id
  }else{
    str = '&invite='+id
  }
  return str
}

function navigateTo(obj){
  if(obj.pageUrl) {
    let url = obj.pageUrl.replace(/:/g, '?').replace(/;/g, '&')
    wx.navigateTo({
      url: url
    })
  }
  
}

module.exports = {
  formatTime,
  request,
  redirect,
  showErrorToast,
  showInfoToast,
  timestampFormat,
  getCurrentPageUrl,
  getCurrentPageUrlWithArgs,
  getJsonLength,
  isEmpty,
  loginIntercept,
  handleOrderReturn,
  shareInvite,
  navigateTo
}