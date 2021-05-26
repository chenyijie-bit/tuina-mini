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
      let _this = this;
      _this.getUserLocation();
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
            console.log(res)
            if(res.data  && res.data.data 
              && res.data.data.openid){
                app.globalData.openid = res.data.data.openid || ''
            }
            // 获取首页数据
            $api.getHomeData({openid:res.data.data.openid}).then(
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
    //定位方法

    getUserLocation: function () {
      let _this = this;
      wx.getSetting({
        success: (res) => {
          console.log(res);
          // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
          // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
          // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
            //未授权
            wx.showModal({
              title: '请求授权当前位置',
              content: '需要获取您的地理位置，请确认授权',
              success: function (res) {
                if (res.cancel) {
                  //取消授权
                  wx.showToast({
                    title: '您已拒绝授权，默认地址深圳市',
                    icon: 'none',
                    duration: 3000
                  })
                } else if (res.confirm) {
                  //确定授权，通过wx.openSetting发起授权请求
                  wx.openSetting({
                    success: function (res) {
                      if (res.authSetting["scope.userLocation"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        //再次授权，调用wx.getLocation的API
                        _this.geo();
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    }
                  })
                }
              }
            })
          } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
            _this.geo();
          }
          else {
            console.log('授权成功')
            //调用wx.getLocation的API
            _this.geo();
          }
        }
      })
    },        
    // 获取定位城市
    geo: function () {
      console.log('geo');
      var _this = this;
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          // wx.request({
          //   url: 'http://api.map.baidu.com/geocoder/v2/?ak=xxxxxxxxxxxx&location=' + res.latitude + ',' + res.longitude + '&output=json',
          //   data: {},
          //   header: { 'Content-Type': 'application/json' },
          //   success: function (ops) {
          //     console.log('定位城市：', ops.data.result.addressComponent.city)
          //   },
          //   fail: function (resq) {
          //     wx.showModal({
          //       title: '信息提示',
          //       content: '请求失败',
          //       showCancel: false,
          //       confirmColor: '#f37938'
          //     });
          //   },
          //   complete: function () {
          //   }
          // })
        },
        fail(){
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '您已拒绝授权，默认地址深圳市',
                  icon: 'none',
                  duration: 3000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.geo();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    },
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
