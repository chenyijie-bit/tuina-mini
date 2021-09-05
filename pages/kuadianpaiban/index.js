// pages/kuadianpaiban/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: [],
    mendianList: []
  },
  queren(){
    // 确认设置
    $api.XXXXXXXX({
      "openid": app.globalData.openId



    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        wx.showToast({
          title: '操作成功'
        })
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:'none'
        })
      }
    })
  },
  setFlag(e){
    let parentIndex = e.currentTarget.dataset.parent
    let currentIndex = e.currentTarget.dataset.index
    console.log(parentIndex,currentIndex);
    let mendianListCopy = this.data.mendianList
    mendianListCopy.map(e=>{
      e.dateList[currentIndex].flag = false
    })
    mendianListCopy[parentIndex].dateList[currentIndex].flag = true
    this.setData({
      mendianList: mendianListCopy
    })
  },
  initData(){
    let dateList = [{name: '门店'},{name: '08/12'},{name: '08/13'},{name: '08/14'},{name: '08/15'},{name: '08/16'}]
    let mendianList = [{name:'1店', dateList:[{flag:''},{flag:''},{flag:''},{flag:''},{flag:''}]},
    {name:'2店', dateList:[{flag:''},{flag:''},{flag:'true'},{flag:''},{flag:''}]},
    {name:'3店', dateList:[{flag:''},{flag:''},{flag:''},{flag:''},{flag:''}]}]
    this.setData({
      dateList,mendianList
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