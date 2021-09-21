// pages/youhuiquanyonghu/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponsList:[]
  },
  qushiyong(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  initData(){
    $api.orderShow({
      openid: app.globalData.openId,
      tap_type: 1
    }).then(res=>{
      if(res.statusCode==200 && res.data.code === 200){
        let coupons = res.data.data.coupons
        if(coupons && coupons.length){
          coupons.map(e=>{
            e.priceNum = e.price ? parseFloat(e.price) : 0
          })
          this.setData({
            couponsList: coupons
          })
        }
      }
    })
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
    this.initData()
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