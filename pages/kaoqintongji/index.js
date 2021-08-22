let app = getApp();
const $api = require('../../utils/request').API;
const $formatTime = require('../../utils/util').formatTime;
// pages/kaoqintongji/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList:[],
    currentDate: new Date().getTime(),
    minDate: new Date(2021, 5).getTime(),
    showDatePicker:false,
    currentMounth:'',
    currentY:'',
    currentM:''
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  selectDate(){
    let resultDate = $formatTime(new Date(this.data.currentDate))
    let formDate = resultDate.split('/')
    this.setData({
      currentY:formDate[0],
      currentM:formDate[1],
      currentMounth:`${formDate[0]}-${formDate[1]}`,
      showDatePicker: false
    })
    this.workerPunchList({year:this.data.currentY,month:this.data.currentM})
  },
  cancelDate(){
    this.setData({
      showDatePicker: false,
    });
  },
  onClose(){
    this.setData({
      showDatePicker: false,
    });
  },
  showPop(){
    this.setData({
      showDatePicker: true,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.workerPunchList()
  },
  getDayInfo(e){
    let dataInfo = e.currentTarget.dataset.info
    let date = dataInfo.key    // 2021-08-13
    wx.setStorageSync('selectDate', date)
    wx.navigateTo({
      url: '../dakaxiangqing/index',
    })
  },
  workerPunchList(data){
    $api.workerPunchList({openid:app.globalData.openId,...data}).then(res=>{
      let listArr = []
      if(res.data && res.data.code == 200){
        let data = res.data.data.list
        for (const key in data) {
          if(!this.data.currentMounth){
            this.setData({
              currentMounth: key.slice(0,7)
            })
          }
          if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            let splitDate = key.split('-').slice(1).join('/')
            listArr.push({name:splitDate,...element,key})
          }
        }
        this.setData({
          dateList: listArr
        })
      }else{
        wx.showToast({
          title: res.data.err,
          icon: 'none'
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