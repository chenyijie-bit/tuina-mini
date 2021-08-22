// pages/wodeyeji/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resList:[],
    selectType:1,  // 1按天查询  2按月查询
    showcalendar:false,
    minDate: new Date(2021, 7, 1).getTime(),
    maxDate: new Date().getTime(),
    date:''
  },
  onDisplay() {
    this.setData({ showcalendar: true });
  },
  onClose() {
    this.setData({ showcalendar: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    const [start, end] = event.detail;
    let date1 = new Date(start);
    let year1 = date1.getFullYear()
    let month1 = date1.getMonth()+1
    let day1 = date1.getDate()
    let date2 = new Date(end);
    let year2 = date2.getFullYear()
    let month2 = date2.getMonth()+ 1
    let day2 = date2.getDate()
    let startStr = year1 + '-' + month1+'-'+day1+ ' ' + '00:00:00'
    let endStr = year2 + '-' + month2+'-'+day2+ ' ' + '23:59:59'
    console.log(startStr);
    console.log(endStr);
    this.initData(startStr,endStr)
    this.setData({
      showcalendar: false,
      date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
    });
  },
  search(e){
    console.log(e);
    let id = e.currentTarget.dataset.id
    if(id == 1){
      this.setData({
        selectType: 1
      })
    }else{
      this.setData({
        selectType: 2
      })
    }
  },
  initData(sdate,edate){
    $api.workerUserPerformance({
      "openid": app.globalData.openId,
      "worker_id": app.globalData.worker_id,					
      "sdate": sdate,
      "edate":edate,
      "shop_id":""
    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        let list  = res.data.data.list
        this.setData({
          resList : list
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
    this.initData('','')
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