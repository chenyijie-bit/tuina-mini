Component({
  data: {
    personImg:'../../assess/images/banner1.png'
  },
  methods:{
    daka(){
      wx.navigateTo({
        url: '../daka/index',
      })
    },
    wodeyeji(){
      wx.navigateTo({
        url: '../wodeyeji/index',
      })
    },
    tongzhi(){
      wx.navigateTo({
        url: '../tongzhi/index',
      })
    },
    gukepingjia(){
      wx.navigateTo({
        url: '../gukepingjia/index',
      })
    },
    kaoqinshenqing(){
      wx.navigateTo({
        url: '../kaoqinshenqing/index',
      })
    },
    mendianshuju(){
      wx.navigateTo({
        url: '../mendianshuju/index',
      })
    },
    mendianpaiban(){
      wx.navigateTo({
        url: '../mendianpaiban/index',
      })
    },
    kaoqinshenpi(){
      wx.navigateTo({
        url: '../kaoqinshenpi/index',
      })
    },
    gerenxinxi(){
      wx.navigateTo({
        url: '../gerenxinxi/index',
      })
    },
    tianjiayuangong(){
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