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
    date:'',
    flag:'1'   //1 按月  2 按日
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
    this.initData(startStr,endStr)
    this.setData({
      showcalendar: false,
      date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
    });
  },
  search(e){
    let id = e.currentTarget.dataset.id
    if(id == 1){
      this.setData({
        selectType: 1
      })
      this.initData()
    }else{
      this.setData({
        selectType: 2
      })
      let start = app.globalData.firstOrderTime+ ' ' + '00:00:00'
      let date1 = new Date();
      let year1 = date1.getFullYear()
      let month1 = date1.getMonth()+1
      let day1 = date1.getDate()
      let endStr = year1 + '-' + month1+'-'+day1+ ' ' + '23:59:59'
      this.initData(start,endStr)
    }
  },
  initData(sdate,edate){
    $api.workerUserPerformance({
      "openid": app.globalData.openId,
      "worker_id": app.globalData.worker_id,					
      "sdate": sdate,
      "edate": edate,
      "shop_id":"",
      date_unit: this.data.selectType == 1 ? '2' : '1'
    }).then(res=>{
      if(res.data.code == 200){
        let list  = res.data.data.list
        for (const key in list) {
          const element = list[key];
            if(!element.date){
              element.date = key
            }
        }
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