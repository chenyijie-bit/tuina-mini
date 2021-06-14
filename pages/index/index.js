let app = getApp();
const $api = require('../../utils/request').API;
const $Distance = require('../../utils/util').Distance;
Component({
  data: {
        tuijianWorker:{},
        canIUseGetUserProfile: false,
        searchValue:'',
        vertical: false,
        autoplay: true,
        interval: 2000,
        duration: 500,
        images:['../../assess/images/banner1.png','../../assess/images/banner2.jpg','../../assess/images/banner3.jpg','../../assess/images/banner4.jpg'],
        personImg:'../../assess/images/123.jpeg',
        positionIcon:'../../assess/images/position-icon.png',
        waitIcon:'../../assess/images/waiticon.png',
        shop_url:'../../assess/images/123.jpeg',
        storeList:[],
        // 店铺的默认地址
        defaultAddressInfo:{
          Long:114.064721,
          Lat:22.661802
        },
        // 用户的地址
        userAddressInfo:{
          Long:0,
          Lat:0
        },
        loadingModelShow:true
      },
  pageLifetimes: {
    show() {
      let _this = this;
      if(!this.data.userAddressInfo.Long){
        _this.getUserLocation();
      }
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      app.checkSessionAndLogin().then(()=>{
          _this.getHomeData(app.globalData.openId)
        
      })
       // 登录
      // wx.login({
      //   success: res => {
      //     app.globalData.code = res.code
      //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
      //     // 调用接口获取openid
      //     if(!app.globalData.openId){
      //       _this.getOpenid(res.code)
      //     }
      //     if(app.globalData.openId){
      //       this.getHomeData(app.globalData.openId)
      //     }
      //   }
      // })
      // wx.checkSession({
      //   success () {
      //     //session_key 未过期，并且在本生命周期一直有效
      //     console.log(`12`);
      //   },
      //   fail () {
      //     // session_key 已经失效，需要重新执行登录流程
      //     // 登录
      //  wx.login({
      //   success:  res => {
      //     app.globalData.code = res.code
      //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
      //     // 调用接口获取openid
      //       if(!app.globalData.openId){
      //         _this.getOpenid(res.code)
      //       }
      //     }
      //   })
      //   }
      // })
    }
  },
  methods:{
    //获取openID
    getOpenid(code){
      $api.getOpenid({code})
      .then(res => {
        console.log(res.data.data);
        //请求成功
        if(res.data  && res.data.data 
          && res.data.data.openid){
            app.globalData.openId = res.data.data.openid
            // app.globalData.openid = res.data.data.openid || ''
            app.globalData.mobile = res.data.data.mobile
            app.globalData.head_url = res.data.data.head_url
            app.globalData.nickname = res.data.data.nickname
            app.globalData.worker_id = res.data.data.worker_id
            wx.setStorageSync('statu', res.data.data.is_worker)
            this.getHomeData(app.globalData.openId)
        }
      })
      .catch(err => {
          //请求失败
      })
    },
    // 获取首页数据
    getHomeData(openid){
      $api.getHomeData({openid}).then(
        res=>{
          if(res.statusCode ==200 && res.data && res.data.data){
            this.setData({
              loadingModelShow: false
            })
            let data = res.data.data
            let shops = data.shops || []
            for (let index = 0; index < shops.length; index++) {
              const element = shops[index];
              element.longitude ? '' : element.longitude = this.data.defaultAddressInfo.Long
              element.latitude ? '' : element.latitude = this.data.defaultAddressInfo.Lat
              element.distance =  $Distance(element.latitude,element.longitude,this.data.userAddressInfo.Lat,this.data.userAddressInfo.Long)
            }
            let tuijianWorker = {}
            if(data.recommend[0] && data.recommend[0].worder_list && data.recommend[0].worder_list[0]){
              tuijianWorker = data.recommend[0].worder_list[0]
              if(tuijianWorker.wait_time == 0){
                tuijianWorker.waitStr = '无需等待，可立即服务'
              }else{
                let min = parseInt(tuijianWorker.wait_time/60) || 20
                tuijianWorker.waitStr = `需等待${min}分钟`
              } 
            }
            console.log(tuijianWorker);
            this.setData({
              storeList:data.shops,
              workerList: [tuijianWorker],
            })
          }else{
            wx.showToast({
              title: res.msg,
              icon: 'error',
              duration: 4000
            })
          }
        }
      )
    },
    //定位方法
    getUserLocation: function () {
      let _this = this;
      wx.getSetting({
        success: (res) => {
          // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
          // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
          // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
            //未授权
            wx.showModal({
              title: '请求授权当前位置',
              content: '需要获取您的地理位置以计算到门店距离，请确认授权',
              success: function (res) {
                if (res.cancel) {
                  //取消授权
                  wx.showToast({
                    title: '将使用默认定位,若要开启定位重新进入小程序',
                    icon: 'none',
                    duration: 2000
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
                        // _this.geo();
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
            //调用wx.getLocation的API
            _this.geo();
          }
        }
      })
    },        
    // 获取定位城市
    geo: function () {
      var _this = this;
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          _this.setData({
            'userAddressInfo.Long':longitude,
            'userAddressInfo.Lat':latitude
          })
          let shops = _this.data.storeList
          for (let index = 0; index < shops.length; index++) {
            const element = shops[index];
            element.longitude ? '' : element.longitude = _this.data.defaultAddressInfo.Long
            element.latitude ? '' : element.latitude = _this.data.defaultAddressInfo.Lat
            element.distance =  $Distance(element.latitude,element.longitude,_this.data.userAddressInfo.Lat,_this.data.userAddressInfo.Long)
          }

          _this.setData({
            storeList:shops
          })
        },
        fail(){
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置以计算到门店的距离，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '将使用默认定位,若要开启定位重新进入小程序',
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
                      // _this.geo();
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
      }else{
        // app.globalData.statu = 0
        // this.setData({
        //   datass:datassres[0],
        //   statu: 0
        // })
      }
      // this.onLoad()
    },
    goToStaffInfo(e){
      console.log(e);
      app.globalData.worker_id = e.currentTarget.dataset.id
      app.globalData.worker_name = e.currentTarget.dataset.name
      app.globalData.shop_id = e.currentTarget.dataset.shopid
      wx.navigateTo({
        url: '../salesclerk/index',
      })
    },
    goToStoreInfo(e){
      app.globalData.shop_id = e.currentTarget.dataset.id
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
//       }
//     })
//   },
//   getUserProfile(e) {
//     // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
//     wx.getUserProfile({
//       desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
//       success: (res) => {
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
