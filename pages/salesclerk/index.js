let app = getApp();
const $api = require('../../utils/request').API;
const formatDate = require('../../utils/util')
Page({
  data: {
    rate:5,
    typeRadio:'1',
    showPopup:false,
    hasPhoneNumber:false,
    //预约类型  是 1 立即取号   还是 2  预约
    appointmentType:'',
    shopInfo:{},
    yuyuekongjianIsShow:false,
    //预约下单时间
    reserve_date:'',
    currentTab:0,
    dateList:[],
    timeSelectModel:[
      // {
      //   time:
      // },{}
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    console.log(app.globalData.mobile)
    if(app.globalData.mobile){
      this.setData({
        hasPhoneNumber:true
      })
    }
    $api.getWorkerData({
      //上线需要改成真实数据  type什么意思
      // openid:app.globalData.openId,
      openid:app.globalData.openId,
      worker_id:app.globalData.worker_id,
    }).then(res=>{
      console.log(res)
      if(res.statusCode == 200){
        let data = res.data.data
        let resData = Object.assign({},data)
        app.globalData.shop_id = resData.shop.id
        _this.setData({
          shopInfo: resData
        })
      }
    }),
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        // 登录
      wx.login({
        success: res => {
          app.globalData.code = res.code
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // 调用接口获取openid
            if(!app.globalData.openId){
              _this.getOpenid(res.code)
            }
          }
        })
      }
    })
  },
  onChange(event) {
    console.log(event);
    this.setData({
      typeRadio: event.detail,
    });
  },
  changeType(data){
    this.setData({
      typeRadio: data.currentTarget.dataset.type
    });
  },
  getNumberNow(){
    if(!this.data.showPopup){
      this.setData({
        showPopup:true
      })
    }
  },
  onClose(){
    this.setData({
      showPopup:false
    })
  },
  onClose2(){
    this.setData({
      yuyuekongjianIsShow:false
    })
  },
  /////需要加个判断就是首页拿到手机号的时候就不用在授权了
  // 而且还要看sessionkey是否过期  过期就要先登录 login
  getPhoneNumber (e) {
    this.setData({
      appointmentType:e.currentTarget.dataset.type
    })
    console.log(this.data.appointmentType);
    // 如果系统中没有电话号码
    $api.getTelNumber({
      openid:app.globalData.openId,
      iv:e.detail.iv,
      encryptedData:e.detail.encryptedData,
      cloudIDL:e.detail.cloudID
    }).then(res=>{
      if(res.statusCode == 200 && res.data.code == 200){
        //立即下单
        console.log(this.data.appointmentType);
        if(this.data.appointmentType == 1){
          this.setData({
            yuyuekongjianIsShow:false,
            showPopup:true
          })
        }else{
          //预约下单
          this.setData({
            showPopup:false,
            yuyuekongjianIsShow:true
          })
        }
      }else{
        // wx.hideLoading()
        wx.showToast({
          title: res.data.err,
          icon:'error'
        })
      }
    })
  },
  getPhoneNumber2(e){
    this.setData({
      appointmentType:e.currentTarget.dataset.type
    })
    console.log(this.data.appointmentType);
    if(this.data.appointmentType == 1){
      this.setData({
        showPopup:true,
        yuyuekongjianIsShow:false
      })
    }else{
      //预约下单
      this.setData({
        showPopup:false,
        yuyuekongjianIsShow:true
      })

      //getPhoneNumber 函数也要写这部分
      $api.workerFutureList({
        // 上线要改成真实数据 改成工作人员的open
        openid:app.globalData.openId,
        worker_id:app.globalData.worker_id,
      }).then(res=>{
        console.log(res);
        if(res.statusCode ==200 && res.data.code == 200){
          let dateData = res.data.data
        }
      })
    }
  },
  selectTime(e){
    console.log(e);
    let time = e.currentTarget.dataset.time
    this.setData({
      currentTime:time
    })
  },
  //创建订单
  creatOrder(){

    this.setData({
      showPopup:false,
      yuyuekongjianIsShow:false
    })
    wx.showLoading({
      title: '创建订单中...',
    })

    if(this.data.appointmentType == 1){
      // this.data.showPopup = true
      
    }else{
      //预约下单
      // this.data.yuyuekongjianIsShow = true
      this.setData({
        reserve_date
      })
    }
    let service_id = [
      {"id":this.data.typeRadio,"count":1}
    ]
    let data = JSON.stringify({
      "openid": app.globalData.openId,
      "shop_id": app.globalData.shop_id, 
      "type_id": this.data.appointmentType,    //1 为立即下单 ； 2 预约，763022
      "worker_id": app.globalData.worker_id,
      "reserve_date":this.data.reserve_date,
      "service_id": service_id
    })
    
    $api.orderSubmit(data).then(res=>{
      console.log(res);
      wx.hideLoading()
      if(res.statusCode==200 && res.data.code == 200){
        // 说明预约成功
        wx.switchTab({
          url: '../order/index',
        })
      }else{
        wx.showToast({
          title: '创建失败，请重试',
          icon:'error'
        })
      }
    })
  },
    //  tab切换逻辑
    swichNav: function( e ) {
      var that = this;
      if( this.data.currentTab === e.target.dataset.current ) {
          return false;
      } else {
          that.setData( {
              currentTab: e.target.dataset.current
          })
      }
    },
    bindChange: function( e ) {
        var that = this;
        that.setData( { currentTab: e.detail.current });
    },






  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
	
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
	
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
	
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
	
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
	
  }
})