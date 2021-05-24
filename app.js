// app.js
const $api = require('./utils/request').API;
App({
  onLaunch() {
    wx.setStorageSync('statu', 0)
    // 展示本地存储能力
    const statu = wx.getStorageSync('statu') || []
    if(statu == 20){
      this.globalData.list = this.globalData.allList[0].list1
    }else if(statu==0){
      this.globalData.list = this.globalData.allList[0].list2
    }
   
    
  },
  globalData: {
    userInfo: null,
    statu:0,
    openid:'',
    allList: [{
      //用户角色tab栏
      list1: [{
        "pagePath": "../index/index",
        "text": "点个高手",
        "iconPath":"../assess/tabicons/shouye.png",
        "selectedIconPath":"../assess/tabicons/shouye2.png"
      }, {
        "pagePath": "../order/index",
        "text": "订单",
        "iconPath":"../assess/tabicons/dingdan.png",
        "selectedIconPath":"../assess/tabicons/dingdan2.png"
      }, {
        "pagePath": "../me/index",
        "text": "我的",
        "iconPath":"../assess/tabicons/me.png",
        "selectedIconPath":"../assess/tabicons/me2.png"
      } 
      // ,{
      //   "pagePath": "../achievement/index",
      //   "text": "我的业绩",
      //   "iconPath":"../assess/tabicons/me2.png",
      //   "selectedIconPath":"../assess/tabicons/me.png"
      // }
    ],
      //员工角色tab栏
      list2: [
        // {
        //   "pagePath": "../index/index",
        //   "text": "点个高手",
        //   "iconPath":"../assess/tabicons/shouye2.png",
        //   "selectedIconPath":"../assess/tabicons/shouye.png"
        // }, {
        //   "pagePath": "../order/index",
        //   "text": "订单",
        //   "iconPath":"../assess/tabicons/dingdan2.png",
        //   "selectedIconPath":"../assess/tabicons/dingdan.png"
        // }, 
        {
          "pagePath": "../index/index",
          "text": "点个高手",
          "iconPath":"../assess/tabicons/shouye.png",
          "selectedIconPath":"../assess/tabicons/shouye2.png"
        },
      {
        "pagePath": "../survey/index",
        "text": "服务订单",
        "iconPath":"../assess/tabicons/me.png",
        "selectedIconPath":"../assess/tabicons/me2.png"
      }, 
      {
        "pagePath": "../drag/index",
        "text": "我的业绩",
        "iconPath":"../assess/tabicons/me.png",
        "selectedIconPath":"../assess/tabicons/me2.png"
      }]
    }],
    list: []
  }
})
