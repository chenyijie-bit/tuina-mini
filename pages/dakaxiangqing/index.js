// pages/dakaxiangqing/index.js
let app = getApp();
const $api = require('../../utils/request').API;
const $formatTime = require('../../utils/util').formatTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate:'',
    firstDaka:'',
    lastDaka:'',
    bukaFirstDaka:'',
    bukaLastDaka:'',
    shifoubuka:false,   //是否有补卡\
    shifouqingjia: false  //是否有请假
  },
  workerPunchList(data){
    let dateTime = wx.getStorageSync('selectDate')
    this.setData({
      currentDate:dateTime
    })
    let year,month
    if(dateTime){
      year = dateTime.split('-')[0]
      month = dateTime.split('-')[1]
    }
    $api.workerPunchList({openid:app.globalData.openId,year,month}).then(res=>{
      let listArr = []
      if(res.data && res.data.code == 200){
        let data = res.data.data.list
        console.log(data);
        if(data){
          let resDate = data[dateTime]
          if(resDate.punch){
            let len = resDate.punch.length
            let firstDaka = resDate.punch[0] || '无打卡记录'
            let lastDaka = resDate.punch[len - 1] || '无打卡记录'
            console.log('firstDaka',firstDaka);
            console.log('lastDaka',lastDaka);
            this.setData({
              firstDaka,
              lastDaka
            })
          }
          if(resDate.approve.bk && resDate.approve.bk.length){
            this.setData({
              shifoubuka:true
            })
            let len = resDate.approve.bk.length
            this.setData({
              bukaFirstDaka:resDate.approve.bk[0],
              bukaLastDaka:resDate.approve.bk[len - 1] || '-'
            })
          }  // 补卡
          if(resDate.approve.qj && resDate.approve.qj.length){
            this.setData({
              shifouqingjia:true
            })
          }  // 请假
        }
      }else{
        wx.showToast({
          title: res.data.err,
          icon: 'none'
        })
      }
    })
  },
  gotobuka(){
    wx.navigateTo({
      url: '../kaoqinshenqing/index',
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
    this.workerPunchList()
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