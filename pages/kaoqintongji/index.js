let app = getApp();
const $api = require('../../utils/request').API;
// pages/kaoqintongji/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.workerPunchList()
  },
  workerPunchList(){
    $api.workerPunchList({openid:app.globalData.openId}).then(res=>{
      console.log(res);
      let listArr = []
      if(res.data && res.data.code == 200){
        listArr.push()
      }else{
        wx.showToast({
          title: res.data.err,
          icon: 'none'
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