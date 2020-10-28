var util = require('../../util/util.js');
const db = wx.cloud.database()
Page({
  data: {
    pageType:'zixun',
    list:[],
    listNum:0,
  },
  onLoad: function(){
    
  },
  onShow:function(){
    this.selectmsgs()
  },
  onReachBottom: function () {
    this.selectmsgs()
  },
  changeData(){
    this.setData({
      list:[],
      listNum:0,
    })
    this.selectmsgs()
  },
  //编辑
  edit(e){
    let data={
      type:'zixun',
      id:e.currentTarget.dataset.msg._id
    }
    let str = JSON.stringify(data) 
    console.log(str)
    wx.navigateTo({
      url: '../admin/edit?type='+str,
    })
  },
  //改变是否在资讯首页显示
  changeState(e){
    let that = this
    console.log(e)
    let num = e.currentTarget.dataset.num
    wx.showModal({
      content: '启用/禁用？',
      showCancel: true,//是否显示取消按钮
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          if(num=='1'){
            num = '2'
          }else{
            num = '1'
          }
          const db = wx.cloud.database()
          db.collection(that.data.pageType).doc(e.currentTarget.dataset.id).update({
            data: {
              isShow:num
            },
            success: res => {
              that.setData({
                list:[],
                listNum:0
              })
              that.selectmsgs()
            }
          })
        }
      }
    })
  },
  //去添加
  goAdd(){
    wx.navigateTo({
      url: '../admin/add?type=zixun',
    })
  },
  //查询zixun数据
  selectmsgs: function () {
    let that = this
    util.showLoading('加载中')

    let x = that.data.listNum;
    let old_data = this.data.list;
    db.collection(that.data.pageType).orderBy('time','desc').skip(x)
      .get().then(res => {
        that.setData({
          listNum: x + 20,
          list: old_data.concat(res.data)
        })
        wx.hideLoading()
      })
  },
})