var util = require('../../util/util.js');
//index.js
const app = getApp()
Page({
  data: {
    
  },
  onLoad: function() {
    
  },
  goCe(){
    wx.navigateTo({
      url: '../index/question',
    })
  },
  //分享
  onShareAppMessage(){

  },
})
