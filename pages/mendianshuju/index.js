// pages/mendianshuju/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeList:[]
  },
  addStore(){
    wx.navigateTo({
      url: '../addstore/index',
    })
  },
  dianpuxiangqing(e){
    console.log(e);
    let id= e.currentTarget.dataset.id
    let name= e.currentTarget.dataset.name
    wx.setStorageSync('storeDataId', id)
    wx.setStorageSync('storeDataName', name)
    wx.navigateTo({
      url: '../mendianxiangqing/index',
    })
  },
  initData(){
    $api.workerShopList({openid:app.globalData.openId}).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        this.setData({
          storeList: res.data.data.list
        })
      }else{
        wx.showToast({
          title: res.data.err,
          icon:'none'
        })
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
    wx.setStorageSync('storeDataId', '')
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