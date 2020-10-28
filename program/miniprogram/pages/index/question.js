var util = require('../../util/util.js');
//index.js
const app = getApp()
Page({
  data: {
    listQuestion:[],
    listLen:3,//总题目数
    qIndex:0,//题目索引值 默认0
    money:0,//总价钱
    iptShow:false,
    iptTxt:"",
    moneyTk:0,
    iptVal:null,
    submitList:{}
  },
  onLoad: function() {

    let that = this
    that.selQuestion()
  },

  //查询题目
  selQuestion(){
    let that = this
    const db = wx.cloud.database()
    db.collection('question2').get({
      success: function(res) {
        console.log(res)
        if(res.errMsg=="collection.get:ok"){
          let newArr = []
          for(let i of res.data){
            i.pointer = ''
            i.pointer2 = ''
            newArr.push(i)
          }
          that.setData({
            listQuestion:newArr,
            listLen:res.data.length - 1
          })
        }
      },fail:function(){
        util.showModal('未连接网络')
      }
    })
  },

  //分享
  onShareAppMessage(){

  },
  //上一题
  before(){
    let that = this
    let list = that.data.listQuestion
    list[that.data.qIndex - 1].pointer = ""//清空上一题的选项和钱
    list[that.data.qIndex - 1].pointer2 = ""
    list[that.data.qIndex].pointer = ""//清空本题的选项和钱
    list[that.data.qIndex].pointer2 = ""
    let msgArr  = list[that.data.qIndex].answer
    let msgArr2 = list[that.data.qIndex - 1].answer

    for(let a of msgArr){
      a.checked = false
    }
    for(let a of msgArr2){
      a.checked = false
    }
    list[that.data.qIndex].answer = msgArr
    list[that.data.qIndex - 1].answer = msgArr2
    that.setData({
      iptVal:'',
      iptShow:false,
      listQuestion:list,
      qIndex:that.data.qIndex - 1,
    })
    that.getMoney()
  },
  //下一题
  next(){
    let that = this
    if(that.data.listQuestion[that.data.qIndex].pointer !=''){//当前已选可下一题
      that.setData({
        qIndex:that.data.qIndex + 1,
        iptVal:'',
        iptShow:false
      })
    }else{
      util.showToast('您还没有选择呢')
    }
  },
  //根据选择变换文案
  choseTxt(msg){
    let txt = ''
    if(msg=='按揭房'){
      txt = '按揭房月供金额'
    }else if(msg =='全款房'){
      txt = '房产价值'
    }else if(msg == '按揭'){
      txt = '按揭车月供金额'
    }else if(msg == '全款'){
      txt = '车产价值'
    }
    return txt
  },
  bindIpt(e) {
    let that = this
    if(that.data.iptTxt =='按揭房月供金额' || that.data.iptTxt =='按揭车月供金额'){
      that.jisuan1(e.detail.value)
    }else if(that.data.iptTxt =='房产价值' || that.data.iptTxt =='车产价值'){
      that.jisuan2(e.detail.value)
    }
  },
  jisuan1(e){
    let that = this
    let mon
    let list = that.data.listQuestion//所有题目数据
    if(e.length<4){
      list[that.data.qIndex].pointer2 = 0
    }else{
      mon = (e*10)*3
      list[that.data.qIndex].pointer2 = parseInt(mon/10000)
    }
    that.setData({
      listQuestion:list
    })
    that.getMoney();
  },
  jisuan2(e){
    let that = this
    let mon = parseInt(e *0.7)
    let list = that.data.listQuestion//所有题目数据

    list[that.data.qIndex].pointer2 = mon
    that.setData({
      listQuestion:list
    })
    that.getMoney();
  },
  //选择答案 清除当前上次选择 计算价钱
  choose(data){
    let msg = data.currentTarget.dataset.msg//当前选项
    let idx  = data.currentTarget.dataset.index//选择的第几项
    let that = this
    let listNew = that.data.listQuestion//所有题目数据
    let msgArr  = listNew[that.data.qIndex].answer

    for(let a of msgArr){
      a.checked = false
    }
    msgArr[idx].checked  = true
    listNew[that.data.qIndex].answer = msgArr
    listNew[that.data.qIndex].pointer = msg.content
    if(msg.price=='填写'){
      listNew[that.data.qIndex].pointer2 = 0
    }else{
      listNew[that.data.qIndex].pointer2 = msg.price
    }
    
    that.setData({
      listQuestion:listNew
    })

    if(msg.price=='填写'){//当选项是填空的时候
      
      that.setData({
        iptShow:true,
        iptVal:'',
        iptTxt:that.choseTxt(msg.content)
      })
      that.getMoney()
      
    }else{
      that.setData({
        iptShow:false,
        iptVal:''
      })
      that.getMoney()
    }
  },
  //计算价钱
  getMoney(){
    let idx = this.data.qIndex
    let m0 = this.data.listQuestion[0].pointer2
    let m1 = this.data.listQuestion[1].pointer2
    let m2 = this.data.listQuestion[2].pointer2
    let m3 = this.data.listQuestion[3].pointer2
    let m4 = this.data.listQuestion[4].pointer2
    let m5 = this.data.listQuestion[5].pointer2
    let m6 = this.data.listQuestion[6].pointer2
    let m7 = this.data.listQuestion[7].pointer2
    let m8 = this.data.listQuestion[8].pointer2
    let m9 = this.data.listQuestion[9].pointer2
    let m10 = this.data.listQuestion[10].pointer2
    let mm = 0

    if(idx==0){
      mm = m0
    }else if(idx == 1){
      mm = m0 + m1
    }else if(idx == 2){
      mm = m0 + m1 + m2 
    }else if(idx == 3){
      mm = m0 + m1 + m2 + m3
    }else if(idx == 4){
      mm = m0 + m1 + m2 + m4
    }else if(idx == 5){
      mm = m0 + m1 + m2 + m4 + m5
    }else if(idx == 6){
      mm = m0 + m1 + m2 + m4 + m5 + m6
    }else if(idx == 7){
      mm = m0 + m1 + m2 + m4 + m5 + m6 + m7
    }else if(idx == 8){
      mm = m0 + m1 + m2 + m4 + m5 + m6 + m7 + m8
    }else if(idx == 9){
      mm = m0 + m1 + m2 + m4 + m5 + m6 + m7 + m8 + m9
    }else if(idx == 10){
      mm = m0 + m1 + m2 + m4 + m5 + m6 + m7 + m8 + m9 + m10
    }
    if(mm==''){
      mm =0
    }
    this.setData({
      money:mm
    })
  },
  //查看结果
  goResult(){
    
    let that = this
    let overList = {
      money:that.data.money,
      msg:[]
    }
    if(that.data.listQuestion[that.data.qIndex].pointer !=''){
      console.log(this.data.listQuestion)
      for(let i of that.data.listQuestion){
        let msg = {
          question:i.question,
          answer:i.pointer
        }
        overList.msg.push(msg)
      }
      that.setData({
        submitList:overList
      })
      let str = JSON.stringify(overList) 
      wx.setStorageSync('questionStr', str)
      wx.navigateTo({
        url: '../index/result'
      })
      // url: '../index/result?msg='+str,
    }else{
      util.showToast('您还没有选择呢')
    }
  }
})
