const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    // const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatDateTime(date, withMs = false) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const ms = date.getMilliseconds()

    let ret = [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-') +
        ' ' + [hour, minute, second].map(value => formatLeadingZeroNumber(value, 2)).join(':')
    if (withMs) {
        ret += '.' + formatLeadingZeroNumber(ms, 3)
    }
    return ret
}

// 两个数组合并去重
function quchong(arr1, arr2) {

    var temp = []; // 临时数组1

    var temparray = []; // 临时数组2

    for (var i = 0; i < arr2.length; i++) {
        temp[arr2[i]] = true;
    }

    for (var i = 0; i < arr1.length; i++) {

        if (!temp[arr1[i]]) {
            temparray.push(arr1[i]);
        }

    }

    return temparray.join(",") + ""
}
/** 替换emoji表情 */
function filterEmoji(name) {

    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");

    return str;

}
/** 替换空格键2 */

function filterSpace(name) {

    var str = name.replace(/\s+/g, '');

    return str;

}
function testMobile(num) {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
  if (num.length == 0) {
    wx.showToast({
      title: '手机号为空',
      icon: 'none',
    })
    return false;
  } else if (num.length < 11) {
    wx.showToast({
      title: '手机号长度有误！',
      icon: 'none',
    })
    return false;
  } else if (!myreg.test(num)) {
    wx.showToast({
      title: '手机号有误！',
      icon: 'none',
    })
    return false;
  } else {
    return true;
  }
}
function showToast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}
function showModal(msg) {
  wx.showModal({
    content: msg,
    showCancel: false,
    success(res) {
    }
  })
}

function showLoading(msg) {
  wx.showLoading({
    title:msg,
    mask:true
  })
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

//身份证
function idCardReg(idcode) {
  // 加权因子
  var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验码
  var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  var code = idcode + "";
  var last = idcode[17]; //最后一个
  var seventeen = code.substring(0, 17);
  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  var arr = seventeen.split("");
  var len = arr.length;
  var num = 0;
  for (var i = 0; i < len; i++) {
    num = num + arr[i] * weight_factor[i];
  }
  // 获取余数
  var resisue = num % 11;
  var last_no = check_code[resisue];

  var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

  // 判断格式是否正确
  var format = idcard_patter.test(idcode);
  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  return last === last_no && format ? true : false;
}

module.exports = {
    formatTime,
    formatNumber,
    formatDateTime,
    quchong,
    filterEmoji,
    filterSpace,
    testMobile,
    showToast,
    showModal,
    showLoading,
    request,
    idCardReg
}
