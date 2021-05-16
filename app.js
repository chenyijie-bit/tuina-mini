// app.js
const $api = require('./utils/request').API;
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log($api.getOpenid)
        console.log(res.code)
        // 调用接口获取openid
        $api.getOpenid({code:res.code})
        .then(res => {
           //请求成功
        })
        .catch(err => {
           //请求失败
        })
        
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
