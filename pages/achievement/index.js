Component({
  data: {
    personImg:'../../assess/images/banner1.png'
  },
  methods:{
    addWorker(){
      wx.navigateTo({
        url: '../addWorker/index',
      })
    },
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    },
  }
})