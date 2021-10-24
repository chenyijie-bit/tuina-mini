let app = getApp();
const $api = require('../../utils/request').API;

// pages/gerenxinxi/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  addStore(){
    wx.navigateTo({
      url: '../tianjiahuodongshangpin/index',
    })
  },
  guanbi(e){
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let attaid = e.currentTarget.dataset.attaid
    let desc = e.currentTarget.dataset.desc
    let price = e.currentTarget.dataset.price
    let status = 0
    this.xiugaishangpin(id,attaid,desc,price,name,status)
  },
  kaiqi(e){
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let attaid = e.currentTarget.dataset.attaid
    let desc = e.currentTarget.dataset.desc
    let price = e.currentTarget.dataset.price
    let status  = 1
    this.xiugaishangpin(id,attaid,desc,price,name,status)
  },
  shanchu(e){
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let attaid = e.currentTarget.dataset.attaid
    let desc = e.currentTarget.dataset.desc
    let price = e.currentTarget.dataset.price
    let status  = -2
    this.xiugaishangpin(id,attaid,desc,price,name,status)
  },
  
  xiugaishangpin(id,attaid,desc,price,name,status){
    $api.workerMarketingSet({
      openid:app.globalData.openId,
      atta_id:attaid,
      id:id,  // 店铺id
      name:name,
      status: status, 
      desc,  //描述
      price,
      shop_id:''
    }).then(res=>{
      if(res.data.code == 200){
        this.initData()
        // 说明是修改信息成功了
        // wx.showToast({
        //   title: '已添加活动商品',
        //   icon:'none'
        // })
        // wx.navigateTo({
        //   url: '../achievement/index',
        // })
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:'none'
        })
      }
    })
  },
  initData(){
    $api.workerMarketingList({
      "openid": app.globalData.openId,
			"name":""	
    }).then(res=>{
      if(res.data.code == 200){
        let itemList = res.data.data.list
        this.setData({
          list: itemList
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