// pages/huiyuankaika/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio:'1',
    status:'',
    list: []
  },
  onChangeRadioTab(event) {
    let radio = event.detail
    let status = 200
    if(radio == 1){
      status = 200
    }else{
      status = 210
    }
    this.setData({
      radio: event.detail,
      status
    })
    this.initData(status)
  },
  initData(status=''){
    $api.workerVipList({
      "openid": app.globalData.openId,
      "name":"",					//可选  精准名称
      "type":"",					//可选  时间类型
      "status":status,					//可选  200 启用；   201 禁用  ； 可不传
      "price":""		
    }).then(res=>{
      if(res.data.code == 200){
        let itemlist = res.data.data.list
        this.setData({
          list: itemlist
        })
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:'none'
        })
      }
    })
  },
  tianjiahuiyuanka(){
    wx.redirectTo({
      url: '../tianjiahuiyuanka/index',
    })
  },
  setHuiyuanka(id,status){
    $api.workerVipSet({
      openid: app.globalData.openId,
      id,status
    }).then(res=>{
      if(res.data.code == 200){
        wx.showToast({
          title: '操作成功',
          icon:'none'
        })
        if(this.data.radio == 1){
          this.initData(200)
        }else{
          this.initData(210)
        }
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:'none'
        })
      }
    })
  },
  guanbi(e){
    let id = e.currentTarget.dataset.id
    let status = 210
    this.setHuiyuanka(id,status)
  },
  kaiqi(e){
    let id = e.currentTarget.dataset.id
    let status = 200
    this.setHuiyuanka(id,status)
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
    this.initData(200)
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