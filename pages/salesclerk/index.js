let app = getApp();
const $api = require('../../utils/request').API;
Page({
  data: {
    rate:5,
    typeRadio:'1',
    showPopup:false,
    hasPhoneNumber:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $api.getWorkerData({
      openid:app.globalData.openId,
      worker_id:app.globalData.worker_id,
    }).then(res=>{
      console.log(res)
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
    $api.getTelNumber({
      iv:e.detail.iv,
      encryptedData:e.detail.encryptedData,
      cloudIDL:e.detail.cloudID
    }).then(res=>{

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