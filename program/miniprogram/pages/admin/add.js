var util = require('../../util/util.js');
Page({
  data: {
    uploaderList: [],//图片列表
    uploaderNum: 0,
    showUpload: true,
    pageType:'indexSilder',
    titleImg:'',
    title:'',
    content:''
  },
  onLoad: function(e){
    this.setData({
      pageType:e.type
    })
  },
  onShow:function(){
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  updelbtnTit:function(){
    this.setData({
      titleImg:''
    })
  },
   // 删除图片
  clearImg: function (e) {
    let that = this
    var nowList = [];//新数据
    var uploaderList = this.data.uploaderList;//原数据
    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i])
      }
    }
    that.setData({
      uploaderNum: that.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
    })
  },
  //展示图片
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
  //上传图片
  upload: function (e) {
    var that = this;
    var numType = e.currentTarget.dataset.num
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.fileUpload(res.tempFilePaths,numType)
        // that.setData({
        //   uploaderList: that.data.uploaderList.concat(res.tempFilePaths)
        // })
      }
    })
  },

  //上传图片文件到服务器
  fileUpload: function (tempFilePath,numType) {
    var that = this;
    util.showLoading('上传中...');
    const filePath = tempFilePath[0]
    const name = Math.random() * 1000000;

    // 上传图片
    const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        if(numType=="1"){
          that.setData({
            titleImg: res.fileID
          })
        }else if(numType=="2"){
          var list = that.data.uploaderList;
          list.push(res.fileID)
          that.setData({
            uploaderList:list
          })
        }
      },
      fail: e => {
        util.showToast('上传失败')
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  bindInputTitle(e) {
    this.setData({
      title: e.detail.value,
    })
  },
  bindInputContent(e) {
    this.setData({
      content: e.detail.value,
    })
  },

  //点击确认
  chooseAdd(){
    let that = this
    if(!that.data.titleImg){
      util.showToast('请上传封面图')
      return
    }else if(!that.data.title){
      util.showToast('请输入标题')
      return
    }else if(!that.data.content|| !that.data.uploaderList){
      util.showToast('内容和图片不能全为空')
      return
    }
    util.showLoading('上传中')
    const db = wx.cloud.database()
    let nowtime  =util.formatTime(new Date())
    console.log(that.data.pageType)
    db.collection(that.data.pageType).add({
      data: {
        titleImg:that.data.titleImg,
        title: that.data.title,
        content:that.data.content,
        time:nowtime,
        isShow:'2',
        uploaderList:that.data.uploaderList
      },
      success: res => {
        console.log('添加成功', res)
        wx.hideLoading()
        wx.showModal({
          content: '添加成功',
          showCancel: false,
          success(res) {
            var pages =getCurrentPages();//当前页面栈
            if (pages.length >1) {
              var beforePage = pages[pages.length- 2];//获取上一个页面实例对象
              beforePage.changeData();//触发父页面中的方法
            }
            wx.navigateBack()
          }
        })
      }
    })
  },

})