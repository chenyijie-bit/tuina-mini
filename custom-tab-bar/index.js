let app = getApp()
Component({
  data: {
    selected: 0,
    color: "#a1a1a1",
    roleId: '',
    statu:'',
    selectedColor: "#BA9245",
  },
  attached() {
    console.log(app.globalData.list);
    if(app.globalData.list && app.globalData.list.length){
      this.setData({
        list: app.globalData.list
      })
    }
    // const roleId = wx.getStorageSync('statu')
    // if (roleId == 0) {
    //   this.setData({
    //     statu: 0,
    //     // list: this.data.allList[0].list1
    //   })
    // }else{
    //   this.setData({
    //     statu: 20,
    //     // list: this.data.allList[0].list2
    //   })
    // }
  },
  observers: {
    'app.globalData.statu': function(a, b) {
      console.log(123123,a);
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      let resList = this.data.statu === 0 ? this.data.allList[0].list1 : this.data.allList[0].list2
      this.setData({
        list: resList
      })
      // this.onLoad()
    }
  },
  getTabBar(){
    console.log(977)
  },
  methods: {
    switchTab(e) {
      // this.setData({
      //   statu: 20,
      //   list: this.data.allList[0].list2
      // })
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  },
})