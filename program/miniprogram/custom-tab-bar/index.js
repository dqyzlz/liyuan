Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#d81e06",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/index1.png",
      selectedIconPath: "/images/index2.png",
      text: "首页"
    }, {
      pagePath: "/pages/index/map",
      iconPath: "/images/dw1.png",
      selectedIconPath: "/images/dw2.png",
      text: "附近的店"
    }, {
      pagePath: "/pages/information/information",
      iconPath: "/images/dp1.png",
      selectedIconPath: "/images/dp2.png",
      text: "资讯"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})