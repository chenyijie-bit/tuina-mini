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
    currentM:'',
    manqinTime: 11*60*60**1000, //满勤毫秒数  以11小时为满勤
    // flagIndex:false
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
    console.log(dataInfo);
    let date = dataInfo.key    // 2021-08-13
    wx.setStorageSync('selectDate', date)
    if(dataInfo.notdaka) return false
    wx.navigateTo({
      url: '../dakaxiangqing/index',
    })
  },
  workerPunchList(data){
    $api.workerPunchList({openid:app.globalData.openId,...data}).then(res=>{
      let listArr = []
      if(res.data && res.data.code == 200){
        let data = res.data.data.list
        let currentDay =  res.data.data.cur_date.split(' ')[0]
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
        let flagIndex = ''
        listArr.map((e,i)=>{
          if(e.key.split(' ')[0] == currentDay){
            flagIndex = i
          }
          if(flagIndex || flagIndex===0 && i>=flagIndex){
            e.notdaka = true
          }
        })
        // 1 判断满足不满足10小时  2 如果打卡不足2次 寻找补卡里有没有 有的话（1次）    没有的话
        console.log(listArr);
        listArr.map(e=>{
          if(e.approve.qj.length){
            //说明有请假
            if(e.approve.qj[0].time_info && e.approve.qj[0].time_info.length){
              e.youqingjia = true
            }
          }
          // else if(e.punch && e.punch.length>1){
          //   let len =  e.punch.length
          //   if(new Date(e.punch[len - 1]).getTime() - new Date(e.punch[0]).getTime() >= this.data.manqinTime){
          //     // 说明是满勤
          //     e.manqin = true
          //     return
          //   }else{
          //     if(e.approve.bk.length){
          //       if(e.approve.bk.length > 1){
          //         if(matchManQin(e.approve.bk[0],e.approve.bk[e.approve.bk.length - 1])){
          //           e.manqin = true
          //         }else if(matchManQin(e.approve.bk[0],e.punch[len - 1]) || matchManQin(e.approve.bk[e.approve.bk.length - 1],e.punch[0])){
          //           e.manqin = true
          //           return
          //         }
          //       }
          //     }
          //   }
          //   e.manqin = false
          // }else if(e.punch && e.punch.length <= 1){
          //   // 打卡一次  先看有没有补卡 （没有补卡则次数不够） 在看几次补卡  超过一次的补卡  先用补卡最后一次减去第一次 如果不是满勤  那就用补卡第一次减去正常打卡的一次如果不是满勤就用补卡最后一次减去正常打卡的一次不是满勤则不满勤
          //   // 没有打卡并且补卡次数也不够两次则次数不够
          //   if(e.punch.length == 1){
          //     if(!e.approve.bk.length){
          //       e.cishubugou = true
          //     }else{
          //       if(e.approve.bk.length > 1){
          //         if(matchManQin(e.approve.bk[0],e.approve.bk[e.approve.bk.length - 1])){
          //           e.manqin = true
          //         }else{
          //           if(matchManQin(e.approve.bk[0],e.punch[0]) || matchManQin(e.approve.bk[e.approve.bk.length - 1],e.punch[0])){
          //             e.manqin = true
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
        })
        // notdaka  当前时间还没到那一天
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
  matchManQin(fir,sec){
    if(Math.abs(new Date(fir).getTime() - new Date(sec).getTime() >= this.data.manqinTime)){
      return true
    }else{
      return false
    }
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