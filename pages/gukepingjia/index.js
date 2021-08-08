// pages/gukepingjia/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluateList:[]
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList()
  },
  shenhetongguo(e){
    console.log(e);
    let pinglunid = e.currentTarget.dataset.pinglunid
    let workerid = e.currentTarget.dataset.workerid
    let approveid = e.currentTarget.dataset.approveid
    if(approveid==4){
      approveid = 10
    }else if(approveid==10){
      approveid = 4
    }
    $api.workerOrderCommentCheck({
      "openid": app.globalData.openId,
      "approve": approveid,							//10 通过   ；4 不通过	
      "worker_id": workerid,							//被评论的工作人员id
      "id": pinglunid		
    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        wx.showToast({
          title: '操作成功'
        })
        this.getList()
      }else{
        wx.showToast({
          title: '操作失败，请重试',
          icon:'none'
        })
      }
    })
  },
  getList(){
    $api.workerOrderCommentList({
      "openid": app.globalData.openId,
      "worker_id": "",							
      "user_id": "",								
      "approve": '',							
      shop_id : ''	
    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        let list = []
        if(res.data && res.data.data){
          list = res.data.data.list
          this.setData({
            evaluateList: list
          })
        }
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