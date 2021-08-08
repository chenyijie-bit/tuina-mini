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
    getUserInfo(){
      $api.userInfo({"openid":app.globalData.openId}).then(res=>{
        if(res.data && res.data.code==200){
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