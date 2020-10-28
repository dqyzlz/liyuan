var util = require('../../util/util.js');
Page({
  data: {
    
  },
  onLoad: function(){

  },
  onShow:function(){

  },

  goShouye(){
    wx.navigateTo({
      url: '../admin/shouye',
    })
  },
  goZixun() {
    wx.navigateTo({
      url: '../admin/zixun',
    })
  },
})