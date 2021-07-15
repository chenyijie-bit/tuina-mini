let app = getApp();
const $api = require('../../utils/request').API;
// pages/addWorker/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:''
  },
  bindchange(e){
    let _this = this
    // this.setData({
    //   loadingModelShow:true,
    //   searchStr: e.detail
    // })
    console.log(e.detail);
    if(e && e.length===11){
      this.searchWorker(e.detail)
    }
  },
  search(){
    let tel = this.data.searchValue
    console.log(tel);
    this.searchWorker(tel)
  },
  searchWorker(data){
    $api.searchWorker({phone:data}).then(res=>{
      console.log(res);
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