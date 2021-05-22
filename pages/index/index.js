let app = getApp();
const $api = require('../../utils/request').API;
Component({
  data: {
        canIUseGetUserProfile: false,
        searchValue:'',
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        images:['../../assess/images/banner1.png','../../assess/images/2.jpeg','../../assess/images/3.jpeg'],
        personImg:'../../assess/images/123.jpeg',
        positionIcon:'../../assess/images/position-icon.png',
        waitIcon:'../../assess/images/waiticon.png',
        storeList:[
          {},{},{}
        ]
      },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
       // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // 调用接口获取openid
          $api.getOpenid({code:res.code})
          .then(res => {
            //请求成功
            if(res.data && res.data.app_err && res.data.app_err.data 
              && res.data.app_err.data.openid){
                app.globalData.openid = res.data.app_err.data.openid || ''
            }
            // 获取首页数据
            $api.getHomeData({openid:res.data.app_err.data.openid}).then(
              res=>{
                console.log(res);
              }
            )
          })
          .catch(err => {
            console.log(err);
             //请求失败
          })
        }
      })
      
    }
  },
  methods:{
    changeStatu(){
      let datass = this.getTabBar().data.list
      let datassres = this.getTabBar().data.allList
      if(wx.getStorageSync('statu') == 0){
        // app.globalData.statu = 20
        // this.setData({
        //   datass:datassres[1],
        //   statu: 20
        // })
        wx.setStorageSync('statu', 20)
      }else{
        // app.globalData.statu = 0
        // this.setData({
        //   datass:datassres[0],
        //   statu: 0
        // })
        wx.setStorageSync('statu', 0)
      }
      // this.onLoad()
      console.log(datass)
    }
  }
})
// // index.js
// // 获取应用实例
// const app = getApp()

// Page({
//   data: {
//     canIUseGetUserProfile: false,
//     searchValue:'',
//     vertical: false,
//     autoplay: false,
//     interval: 2000,
//     duration: 500,
//     images:['../../assess/images/1.jpeg','../../assess/images/2.jpeg','../../assess/images/3.jpeg'],
//     personImg:'../../assess/images/3.jpeg',
//     storeList:[
//       {},{},{}
//     ]
//   },
//   // 事件处理函数
//   // bindViewTap() {
//   //   wx.navigateTo({
//   //     url: '../logs/logs'
//   //   })
//   // },
//   onShow: function () {
//     wx.setStorageSync('statu',0)
//     if (typeof this.getTabBar === 'function' &&
//       this.getTabBar()) {
//       this.getTabBar().setData({
//         selected: 0
//       })
//     }
//   },
//   onLoad() {
//     wx.getLocation({
//       type: 'wgs84',
//       success (res) {
//         const latitude = res.latitude
//         const longitude = res.longitude
//         const speed = res.speed
//         const accuracy = res.accuracy
//       }
//      })
//     wx.login({
//       success (res) {
//         if (res.code) {
//           //发起网络请求
//           // wx.request({
//           //   url: '',
//           //   data: {
//           //     code: res.code
//           //   }
//           // })
//         } else {
//           console.log('登录失败！' + res.errMsg)
//         }
//       }
//     })
    
//     if (wx.getUserProfile) {
//       this.setData({
//         canIUseGetUserProfile: true
//       })
//     }
//   },
//   getUserInfo(e){
//     wx.getUserInfo({
//       lang: "zh_CN",
//       desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
//       success: (res) => {
//         console.log(res);
//       }
//     })
//   },
//   getUserProfile(e) {
//     // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
//     wx.getUserProfile({
//       desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
//       success: (res) => {
//         console.log(res)
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     })
//   },
//   goToStaffInfo(){
//     wx.navigateTo({
//       url: '../salesclerk/index',
//     })
//   },
//   goToStoreInfo(){
//     wx.navigateTo({
//       url: '../storeInfo/index',
//     })
//   }
  
// })
