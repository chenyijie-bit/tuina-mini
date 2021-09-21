// pages/wodehuodongshangpin/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  searchOrder(tel=''){
      $api.marketingOrderList({
        "openid":app.globalData.openId,
        "user_id":"",								//可选参数。
        "phone":tel,						//可选参数。
        "trade_no":"",	//可选参数。
        "order_code":""		//可选参数。
      }).then(res=>{
        console.log(res);
        if(res.data.code == 200){
          let list = res.data.data.list || []
          this.setData({
            itemList:list
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.searchOrder()
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