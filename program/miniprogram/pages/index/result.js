var util = require('../../util/util.js');
//index.js
const app = getApp()
Page({
  data: {
    name:'',
    phone:'',
    overList:{}
  },
  onLoad: function(e) {
    let that = this

    //let data = JSON.parse(e.msg)
    let data = JSON.parse(wx.getStorageSync('questionStr'))
    console.log(data)
    that.setData({
      overList:data
    })

  },
  iptName(e){
    this.setData({
      name:e.detail.value
    })
  },
  iptPhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  //上传答题结果
  save(){
    let that = this
    let nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
    if(!nameReg.test(that.data.name)){
      util.showToast('请输入正确姓名')
      return
    }
    if(!util.testMobile(that.data.phone)){
      return
    }
    that.selPhone()
    
  },
  selPhone(){
    let that = this
    const db = wx.cloud.database()
    db.collection('assess').where({
      phone: that.data.phone
    })
    .get({
      success: function(res) {
        console.log(res)
        if(res.data.length==0){
          that.saveMsg()
        }else{
          util.showModal("您已录入信息，24小时内客服人员与您联系！")
        }
      }
    })
  },
  saveMsg(){
    let that = this
    let times = util.formatTime(new Date())
    const db = wx.cloud.database()
    db.collection('assess').add({
      data: {
        user:that.data.name,
        phone:that.data.phone,
        questions:that.data.overList,
        subtime:times
      },
      success: res => {
        util.showModal("录入成功，24小时内客服人员与您联系！")
        
      }
    })
  },
  //分享
  onShareAppMessage(){

  },
 
})
