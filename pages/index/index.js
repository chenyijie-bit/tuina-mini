// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    canIUseGetUserProfile: false,
    searchValue:'',
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    images:['../../assess/images/1.jpeg','../../assess/images/2.jpeg','../../assess/images/3.jpeg'],
    personImg:'../../assess/images/3.jpeg',
    storeList:[
      {},{},{}
    ]
  },
  // 事件处理函数
  // bindViewTap() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onShow(){

  },
  onLoad() {
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
     })
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          // wx.request({
          //   url: '',
          //   data: {
          //     code: res.code
          //   }
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserInfo(e){
    wx.getUserInfo({
      lang: "zh_CN",
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
      }
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  goToStaffInfo(){
    wx.navigateTo({
      url: '../salesclerk/index',
    })
  },
  goToStoreInfo(){
    wx.navigateTo({
      url: '../storeInfo/index',
    })
  }
  
})
