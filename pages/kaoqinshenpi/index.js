// pages/kaoqinshenpi/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  tongguo(e){
    let id = e.currentTarget.dataset.id
    this.shenhe(id,1)
  },
  butongguo(e){
    let id = e.currentTarget.dataset.id
    this.shenhe(id,2)
  },
  shenhe(id,state){
    $api.workerPunchApproveCheck({
      "openid": app.globalData.openId,
	    "approve" : state,		//审批情况	1 通过   2 未通过   0 未审核
	    id				//审批的id
    }).then(res=>{
      if(res.data.code == 200){
        wx.showToast({
          title: '操作成功'
        })
        this.initData()
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:'none'
        })
      }
    })
  },

  initData(){
    $api.workerPunchApproveList({
      "openid": app.globalData.openId,
        approve:0, 			//审批情况	1 通过   2 未通过   0 未审核
        approve_worker_id:'',  	//审批人 id
        worker_id:'' ,			//申请人 id
        start_date:'',  		//请假的开始时间
        end_date:''            //请假的结束时间

    }).then(res=>{
      if(res.data.code == 200){
        this.setData({
          lishiList : res.data.data.list
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