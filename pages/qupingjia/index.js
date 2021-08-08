// pages/qupingjia/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 5,
    message:'',
    pingjiawancheng:false,
    butOk:true
  },
  onChange(e){
    this.setData({
      value:e.detail
    })
  },
  bindTextAreaBlur(e){
    console.log(e.detail.value);
    this.setData({
      message:e.detail.value
    })
  },
  send(){
    let _this = this
    if(!this.data.butOk){
      return false
    }
    this.setData({
      butOk: false
    })
    let id = wx.getStorageSync('pingjiaid')-0
    if(!id && id!==0){
      wx.showToast({
        title: '请返回上一页重试',
        icon:'none'
      })
      return
    }else{
      setTimeout(() => {
        _this.reqSend(id,_this.data.value,_this.data.message)
      }, 20);
    }
  },
  reqSend(id,value,message) {
    $api.orderCommentIn({
      "openid": app.globalData.openId,
      "order_id": id,							//订单id
      "content": message,						//评论内容
      "grade": value	
    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        wx.showToast({
          title: '评价成功',
        })
        wx.setStorageSync('pingjiaid','')
        ////评价成功
        setTimeout(() => {
          this.setData({
            pingjiawancheng:true
          })
        }, 1500);
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:"none"
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