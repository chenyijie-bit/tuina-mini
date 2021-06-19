let app = getApp();
const $api = require('../../utils/request').API;
const $Distance = require('../../utils/util').Distance;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitIcon:'../../assess/images/waiticon.png',
    shop_url:'../../assess/images/123.jpeg',
    storeList:[],
    loadingModelShow:false,
    showNone: false,
    timer:null
  },
  goToStoreInfo(e){
    app.globalData.shop_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../storeInfo/index',
    })
  },
  debounce(fn,wait){
    let _this = this
    return function(){
        if(_this.data.timer !== null){
            clearTimeout(_this.data.timer);
        }
        _this.setData({
          timer: setTimeout(fn,wait)
        })
    }
  },
  getSearch(){
    $api.homeSearch({
      keywords: this.data.searchStr,
      openid: app.globalData.openId
    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        
        for (let index = 0; index < res.data.data.length; index++) {
          const element = res.data.data[index];
          element.longitude ? '' : element.longitude = element.location.longitude
          element.latitude ? '' : element.latitude = element.location.latitude
          element.distance =  $Distance(element.latitude,element.longitude,app.globalData.userAddressInfo.Lat,app.globalData.userAddressInfo.Long)
        }
        this.setData({
          loadingModelShow:false,
          storeList: res.data.data,
          showNone: true
        })
      }
    })
  },
  bindchange(e){
    let _this = this
    this.setData({
      loadingModelShow:true,
      searchStr: e.detail
    })
    this.debounce(_this.getSearch,1200)()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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