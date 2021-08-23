// pages/mendianxiangqing/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    id:'',
    shopInfo:{},
    workerList:[]
  },
  initData(){
    let id = wx.getStorageSync('storeDataId')
    let name = wx.getStorageSync('storeDataName')
    console.log(id,name);
    this.setData({
      name,id
    })
    $api.workerShopDetail({openid:app.globalData.openId,sdate:'',edate:'',shop_id:id}).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        let shopInfo = res.data.data.shop
        let workerList = res.data.data.worker.list
        this.setData({
          shopInfo,
          workerList
        })
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
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