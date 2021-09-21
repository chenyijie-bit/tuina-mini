// pages/kuadianpaiban/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: [],
    mendianList: [],
    storeList: [],
    biaozhundate:[]
  },
  // 获取首页数据
  getHomeData(){
    let openid = app.globalData.openId
    $api.getHomeData({openid}).then(
      res=>{
        if(res.statusCode ==200 && res.data && res.data.data){
          let data = res.data.data
          let shops = data.shops || []
          let mendianList = []
          data.shops.map(e=>{
            mendianList.push({name:e.name,id:e.id, dateList:[{flag:''},{flag:''},{flag:''},{flag:''},{flag:''}]}) 
          })
          this.setData({
            storeList:data.shops,
            mendianList
          })
          this.initData()
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'error',
            duration: 4000
          })
        }
      }
    )
  },
  queren(){
    console.log(this.data.dateList);
    let mendianList = this.data.mendianList
    let resArr = []
    mendianList.map((e,i)=>{
      e.dateList.map((s,n)=>{
        if(s.flag){
          let date = this.data.biaozhundate[n].date
          let id = this.data.mendianList[i].id
          resArr.push({
            'date': date,
            'shop_id': id
          })
        }
      })
    })
    // 确认设置
    $api.workerPunchTravelSet({
      "openid": app.globalData.openId,
      "worker_id": app.globalData.worker_id ,
      "group": resArr
    }).then(res=>{
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
    let mendianListCopy = this.data.mendianList
    mendianListCopy.map(e=>{
      e.dateList[currentIndex].flag = false
    })
    mendianListCopy[parentIndex].dateList[currentIndex].flag = true
    console.log(mendianListCopy);
    this.setData({
      mendianList: mendianListCopy
    })
  },
  // {
  //   "date": "2021-09-15",
  //   "shop_id": "1
  // },

  initData(){
    // let dateList = [{name: '门店'},{name: '08/12'},{name: '08/13'},{name: '08/14'},{name: '08/15'},{name: '08/16'}]
    // let mendianList = [{name:'1店', dateList:[{flag:'true'},{flag:''},{flag:''},{flag:'true'},{flag:''}]},
    // {name:'2店', dateList:[{flag:''},{flag:''},{flag:'true'},{flag:''},{flag:''}]},
    // {name:'3店', dateList:[{flag:''},{flag:'true'},{flag:''},{flag:''},{flag:''}]}]
    // this.setData({
    //   dateList,mendianList
    // })
    $api.workerPunchTravelList({
      'openid': app.globalData.openId,
      'worker_id': app.globalData.worker_id 
      // 'worker_id': 5 
    }).then(res=>{
      if(res.data.code == 200){
        let dateList = res.data.data[0].date || []
        // let dateList = []
        // for (const key in dateObj) {
        //   const element = dateObj[key];
        //   dateList.push({[key]: element})
        // }
        console.log(dateList);
        dateList = dateList.slice(0,5)
        let newArr = []
        dateList.map(e=>{
          // for (const key in e) {
            newArr.push({'name':(e.date.split('-')[1]+'/'+e.date.split('-')[2])}) 
          // }
        })
        this.setData({
          dateList: newArr,
          biaozhundate:dateList
        })
        let dateStoreArr = []
        dateList.map((e,i)=>{
              if(e.shop_id){
                // i 是第几个日期
                let mendianList = this.data.mendianList
                mendianList.map((s,n)=>{
                  if(s.id === e.shop_id){
                    mendianList[n].dateList[i].flag = true
                    console.log(mendianList);
                    this.setData({
                      mendianList
                    })
                    // dateStoreArr.push({
                    //   date
                    // })
                  }
                })
                
              }
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
    
    this.getHomeData()
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