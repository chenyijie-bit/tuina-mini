let app = getApp()
Component({
  data: {
    selected: 0,
    color: "#a1a1a1",
    roleId: '',
    statu:'',
    selectedColor: "#BA9245",
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
      if(app.globalData.list && app.globalData.list.length){
        this.setData({
          list: app.globalData.list
        })
      }
    },
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  },
})