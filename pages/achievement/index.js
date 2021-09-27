let app = getApp();
const $api = require('../../utils/request').API;
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
    dingdanliebiao(){
      wx.navigateTo({
        url: '../dingdanliebiao/index',
      })
    },
    huodongdingdan(){
      wx.navigateTo({
        url: '../huodongdingdan/index',
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
    huodongshangpin(){
      wx.navigateTo({
        url: '../huodongshangpin/index',
      })
    },
    huiyuankaika(){
      wx.navigateTo({
        url: '../huiyuankaika/index',
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
    kuadianpaiban(){
      wx.navigateTo({
        url: '../kuadianpaiban/index',
      })
    },
    tianjiayuangong(){
      wx.navigateTo({
        url: '../addWorker/index',
      })
    },
    shouyelunbo(){
      wx.navigateTo({
        url: '../shouyelunbo/index',
      })
    },
    getUserInfo(){
      $api.userInfo({"openid":app.globalData.openId}).then(res=>{
        if(res.data && res.data.code==200){
          if(res.data.data.worker_info && res.data.data.worker_info.first_order && res.data.data.worker_info.first_order.create_time){
            app.globalData.firstOrderTime = res.data.data.worker_info.first_order.create_time.split(' ')[0]
          }
          if(res.data.data && res.data.data.worker_info.status && res.data.data.worker_info.status==50){
            // 说明是管理员已把他设置为员工但是还没有完善员工信息
            wx.navigateTo({
              url: '../gerenxinxi/index',
            })
          }
        }
      })
    }
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
      this.getUserInfo()
    },
  }
})