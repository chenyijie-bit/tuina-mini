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
      openid:'oGFUh5Ssh6XpAmERvUFwkA_wiZuY',
      type:2,
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
      console.log(res)
      console.log(res.statusCode == 200);
      console.log(res.data.code == 200);
      if(res.statusCode == 200 && res.data.code == 200){
        if(this.data.appointmentType == 1){
          let service_id = [
            {"id":"1","count":1}
          ]
        let data = JSON.stringify({
          "openid": app.globalData.openId,
          "shop_id": 1, 
          "type_id": 1,    //1 为立即下单 ； 2 预约，
          "worker_id": 1,
          "service_id": service_id
        })
          $api.orderSubmit(data).then(res=>{
            console.log(res);
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