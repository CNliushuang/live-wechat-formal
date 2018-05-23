const app = getApp();

/*通用联网代理*/
export const httpAgent = (url, requestType, params, cb, errorcb, showLoading) => {
  if (showLoading) {
    wx.showLoading({
      title: 'Loading...',
    })
  }
  var token = app.globalData.token;
  var plat = app.globalData.plat_net;
  if(url.indexOf("?") >= 0){
    url = url + '&plat='+plat;
  }else{
    url = url + '?plat='+plat;
  }
  if(token){
    url = url + '&token='+token;
  }



  // if (typeof params === "string"){
  //   params = params + '&plat=plat';
  //   if(token){
  //     params = params + '&token='+token;
  //   }
  // }else{
  //   params.plat = plat;
  //   if(token){
  //     params.token = token;
  //   }
  // }

  console.log("联网")
  console.log(url)
  console.log(params)
  console.log(requestType)

  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    data: params,
    method: requestType,
    // header: {
    //   'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' // 默认值
    // },
    success: function (res) {
      wx.hideLoading();
      var data = res.data;
      if (data.result && data.result != 0) {
        if (data.result == -10001) {//token过期了
          console.log("token 过期了");
        } else {
          if (errorcb) {
            errorcb(data);
          } else {
            const content = data.msg + '，url地址：' + url;
            console.log(content);
            console.log(params);
          }
        }
      } else {
        cb(data);
      }
    },
    fail: function (res) {
      wx.hideLoading();
      errorcb && errorcb(res);
    }
  })
}


/*时间戳转换日期格式*/
export const timesToDate = (tm, pattern) => {
  if (tm == "" || tm == null || tm == undefined) {
    return '';
  }
  var date = new Date(parseInt(tm));
  if (pattern) {
    return date.pattern(pattern);
  } else {
    return date.pattern('yyyy-MM-dd HH:mm:ss');
  }
}



/*日期格式转换为时间戳*/
export const dateToTimes = (time) => {
  if (time == "" || time == null || time == undefined) {
    return '';
  }
  var date = new Date(time);
  date.setFullYear(time.substring(0, 4));
  date.setMonth(parseInt(time.substring(5, 7), 10) - 1, 1);
  date.setDate(time.substring(8, 10));
  date.setHours(time.substring(11, 13));
  date.setMinutes(time.substring(14, 16));
  date.setSeconds(time.substring(17, 19));
  var datetime = Date.parse(date);
  return datetime;
}



/*截取人名，中文最后一个字，英文第一个字*/
export const formatUserName = (name) => {
  var result = "未";
  if (name) {
    if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(name)) {//有中文
      result = name.substr(name.length - 1, name.length);
    } else {//纯英文
      result = name.substr(0, 1);
    }
  }
  return result;
}


/*显示消息*/
export const showMsg = (data) => {
  data.duration = 2000;
  wx.showToast(data)
}


export const addZero = (v) => { if (v < 10) return '0' + v; return v.toString(); }


export const unique = (arr) => {
  var res = [];
  var json = {};
  for (var i = 0; i < arr.length; i++) {
    if (!json[arr[i]]) {
      res.push(arr[i]);
      json[arr[i]] = 1;
    }
  }
  return res;
}








/*老代码formatTime*/
export const formatTime = (date) => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}



function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
Date.prototype.pattern = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  var week = {
    "0": "/u65e5",
    "1": "/u4e00",
    "2": "/u4e8c",
    "3": "/u4e09",
    "4": "/u56db",
    "5": "/u4e94",
    "6": "/u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}





