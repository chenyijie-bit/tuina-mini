// pages/yonghuhuodong/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  querengoumai(e){
    let id = e.currentTarget.dataset.id;
    $api.marketingPay({
      id,
      openid:app.globalData.openId
    }).then(res=>{
      let _this = this
      if(res.statusCode == 200 && res.data.code == 200){
        let payData = res.data.data.jsApiParams
        wx.requestPayment(
          {
          "appId":payData.jsApiParameters.appId,
          "timeStamp":payData.jsApiParameters.timeStamp,
          "nonceStr": payData.jsApiParameters.nonceStr,
          "package": payData.jsApiParameters.package,
          "signType": "HMAC-SHA256",
          "paySign": payData.jsApiParameters.paySign,
          "success":function(res){
            需要重新获取列表信息
            wx.showToast({
              title: '支付成功'
            })
            // 在这里跳转到购买完成页面
          },
          "fail":function(res){
          },
          "complete":function(res){}
          })
      }else{
        wx.showToast({
          title: res.data.err||'调起支付出错，请重试',
          icon:'none'
        })
      }
    })
  },
  initData(){
    $api.userMarketingList({
      name:'',
      openid:app.globalData.openId
    }).then(res=>{
      if(res.data.code == 200){
        let list = res.data.data.list || []
        this.setData({
          huodonglist:list
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