let app = getApp();
const $api = require('../../utils/request').API;
Page({
  data: {
    rate:5,
    typeRadio:'1',
    showPopup:false,
    hasPhoneNumber:false,
    //预约类型  是 1 立即取号   还是 2  预约
    appointmentType:'',
    shopInfo:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
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
  /////需要加个判断就是首页拿到手机号的时候就不用在授权了
  // 而且还要看sessionkey是否过期  过期就要先登录 login
  getPhoneNumber (e) {
    this.setData({
      appointmentType:e.currentTarget.dataset.type
    })
    
    
    console.log(this.data.appointmentType);
    $api.getTelNumber({
      openid:app.globalData.openId,
      iv:e.detail.iv,
      encryptedData:e.detail.encryptedData,
      cloudIDL:e.detail.cloudID
    }).then(res=>{
      if(res.statusCode == 200 && res.data.code == 200){
        if(this.data.appointmentType == 1){
          let service_id = [
            {"id":"1","count":1}
          ]
        let data = JSON.stringify({
          "openid": app.globalData.openId,
          "shop_id": app.globalData.shop_id, 
          "type_id": this.data.appointmentType,    //1 为立即下单 ； 2 预约，763022
          "worker_id": app.globalData.worker_id,
          "service_id": service_id
        })
          $api.orderSubmit(data).then(res=>{
            console.log(res);
            if(res.statusCode==200 && res.data.code == 200){
              // 说明预约成功
              wx.switchTab({
                url: '../order/index',
              })
            }
          })
        }else{

        }
      }else{
        wx.showToast({
          title: res.data.err,
        })
      }
    })
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