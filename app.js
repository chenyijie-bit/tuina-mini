// app.js
const $api = require('./utils/request').API;
App({
  onLaunch() {
    // wx.setStorageSync('statu', 0)
    // 展示本地存储能力
    const statu = wx.getStorageSync('statu') || 0
    // statu == 1 是店员
    // if(statu == 0){
    //   this.globalData.list = this.globalData.allList[0].list1
    // }else if(statu == 1){
    //   this.globalData.list = this.globalData.allList[0].list2
    // }
    if(statu == 0){
      this.globalData.list = this.globalData.allList[0].list1
    }else if(statu == 1){
      this.globalData.list = this.globalData.allList[0].list2
    }
  },
  //获取openID
  getOpenid(code){
    $api.getOpenid({code})
    .then(res => {
      //请求成功
      if(res.data  && res.data.data 
        && res.data.data.openid){
          app.globalData.openId = res.data.data.openid
          // app.globalData.openid = res.data.data.openid || ''
          app.globalData.mobile = res.data.data.mobile
          app.globalData.head_url = res.data.data.head_url
          app.globalData.nickname = res.data.data.nickname
          app.globalData.worker_id = res.data.data.worker_id
          app.globalData.is_worker = res.data.data.is_worker || 0
          app.globalData.is_vip = res.data.data.is_vip || 0
          app.globalData.worker_type = res.data.data.worker_type || 0
          if(wx.getStorageSync('statu')!=1){
            wx.setStorageSync('statu', res.data.data.is_worker)
          }
          // this.getHomeData(app.globalData.openId)
      }
    })
    .catch(err => {
        //请求失败
    })
  },
  checkSessionAndLogin(){
    let _this = this
    return new Promise((resolve)=>{
      if(!this.globalData.openId){
        wx.login({
          success:  res => {
            this.globalData.code = res.code
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // 调用接口获取openid
            if(!this.globalData.openId){
             return  $api.getOpenid({code:res.code}).then(res => {
                //请求成功
                if(res.data  && res.data.data 
                  && res.data.data.openid){
                    _this.globalData.openId = res.data.data.openid
                    // _this.globalData.openid = res.data.data.openid || ''
                    _this.globalData.mobile = res.data.data.mobile
                    _this.globalData.head_url = res.data.data.head_url
                    _this.globalData.nickname = res.data.data.nickname
                    _this.globalData.worker_id = res.data.data.worker_id
                    _this.globalData.is_worker = res.data.data.is_worker
                    _this.globalData.is_vip = res.data.data.is_vip || 0
                    _this.globalData.worker_type = res.data.data.worker_type || 0
                    // if(wx.getStorageSync('statu')!=1){
                      wx.setStorageSync('statu', res.data.data.is_worker)
                    // }
                   
                    // this.getHomeData(this.globalData.openId)
                }
                if(wx.getStorageSync('statu')!=1){
                  $api.userInfo({openid:this.globalData.openId}).then(res=>{
                    let data = res.data
                    if(data && data.code == 200){
                      if(data.data && data.data.worker_info && (data.data.worker_info.status == 50 || data.data.worker_info.status == 53)){
                        // 写评论的时候注释掉 不然出不来用户的页面  写完这个需求在放开
                        wx.setStorageSync('statu', 1)
                        wx.showToast({
                          title: '如未显示工作台,请重新进入',
                          icon: 'none'
                        })
                      }
                    }
                  })
                }
                
                resolve('成功')
              })
              // _this.getOpenid(res.code)
            }
          },
          fail: function (error) {
            _this.checkSessionAndLogin()
          }
        })
      }
      wx.checkSession({
        success () {
          //session_key 未过期，并且在本生命周期一直有效
        },
        fail () {
          // session_key 已经失效，需要重新执行登录流程
          // 登录
          wx.login({
            success:  res => {
              _this.globalData.code = res.code
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              // 调用接口获取openid
                if(!_this.globalData.openId){
                 return  $api.getOpenid({code:res.code}).then(res => {
                    //请求成功
                    if(res.data  && res.data.data 
                      && res.data.data.openid){
                        _this.globalData.openId = res.data.data.openid
                        // _this.globalData.openid = res.data.data.openid || ''
                        _this.globalData.mobile = res.data.data.mobile
                        _this.globalData.head_url = res.data.data.head_url
                        _this.globalData.nickname = res.data.data.nickname
                        _this.globalData.worker_id = res.data.data.worker_id
                        _this.globalData.is_worker = res.data.data.is_worker
                        _this.globalData.is_vip = res.data.data.is_vip || 0
                        _this.globalData.worker_type = res.data.data.worker_type || 0
                        if(wx.getStorageSync('statu')!=1){
                          wx.setStorageSync('statu', res.data.data.is_worker)
                        }
                        // _this.getHomeData(this.globalData.openId)
                        resolve('成功')
                    }
                  })
                }
              },
              fail: function (error) {
                _this.checkSessionAndLogin()
              }
            })
        }
      })
    }).catch(err=>{
    })
  },
  globalData: {
    //用户的位置信息
    userAddrInfo:null,
    userInfo: null,
    statu:0,
    code:'',
    openId:'',
    head_url:'',
    worker_type:'', //1管理员 
    mobile:'',
    nickname:'',
    min_price:'', //店铺的最低消费
    min_price_c:'',
    // 当前店铺的id
    shop_id:'',
    is_worker:0,
    openTime:'07:30:00',  //门店开点时间
    closeTime:'23:30:00',  // 门店关门时间
    // 当前店员的id
    user_openId:'',
    worker_id:'',
    select_worker_id:'', // 用户要预约的店员id
    is_vip:0,
    worker_name:'',
    firstOrderTime:'', //店员首单时间
    // 所有优惠券
    couponsList:[],
    // 用户的地址
    userAddressInfo:{
      Long:0,
      Lat:0
    },
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
    ],
      //员工角色tab栏
      list2: [
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
        "pagePath": "../achievement/index",
        "text": "工作台",
        "iconPath":"../assess/tabicons/me.png",
        "selectedIconPath":"../assess/tabicons/me2.png"
      }]
    }],
    list: []
  }
})
