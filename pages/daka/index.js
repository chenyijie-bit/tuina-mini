let app = getApp();
const $api = require('../../utils/request').API;
const $Distance = require('../../utils/util').Distance;

// pages/daka/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstTime:'',
    lastTime:'',
    // 用户的地址
    userAddressInfo:{
      Long:0,
      Lat:0
    },
    // 所有门店的地址
    storeAddressInfo:[],
    dakafanwei: false,
    shuaxinAttr: false
  },
  init(){
    
    $api.workerPunchListByDate({"openid":app.globalData.openId,worker_id:app.globalData.worker_id}).then(res=>{
      if(res.data.code == 200){
        // 这里回显
        let dataList = res.data.data
        if(dataList && dataList.length>0){
          this.setData({
            firstTime:dataList[0].clock.split(' ')[1]
          })
          if(dataList && dataList.length>1){
            this.setData({
              lastTime:dataList[dataList.length-1].clock.split(' ')[1]
            })
          }
        }
      }else{
        wx.showToast({
          title: res.data.err,
          icon:'none'
        })
      }
    })
  },
  
  workerPunchClock(){
    this.setData({
      dakafanwei: false
    })
    $api.workerPunchClock({openid:app.globalData.openId}).then(res=>{
      if(res.data.code == 200){
        // 这里打卡成功回调打卡成功回显接口
        this.init()
      }else{
        wx.showToast({
          title: res.data.err,
          icon:'none'
        })
      }
    })
  },
  // 获取现在的所有门店的经纬度
  getHomeData(){
    $api.getHomeData({openid:app.globalData.openId}).then(res=>{
      setTimeout(() => {
        this.setData({
          shuaxinAttr:false
        })
      }, 1000);
      if(res.statusCode ==200 && res.data && res.data.data){
        let shops = []
        let listjingweidu = []  // [{},{}]
        shops = res.data.data.shops
        shops.map(e=>{
          listjingweidu.push(e.location)
        })
        // this.setData({
        //   storeAddressInfo:listjingweidu
        // })
        // 下边是计算店员距离所有门店的距离
        let juliArr = []
        for (let index = 0; index < listjingweidu.length; index++) {
          const element = listjingweidu[index];
          // element.longitude ? '' : element.longitude = _this.data.defaultAddressInfo.Long
          // element.latitude ? '' : element.latitude = _this.data.defaultAddressInfo.Lat
          let juliItem =  $Distance(element.latitude,element.longitude,app.globalData.userAddressInfo.Lat,app.globalData.userAddressInfo.Long)
          juliArr.push(juliItem)
        }
        if(juliArr && juliArr.length){
          for (let index = 0; index < juliArr.length; index++) {
            const element = juliArr[index];
            if(element<=1){
              this.setData({
                dakafanwei:true
              })
              return 
            }else{
              this.setData({
                dakafanwei:false
              })
            }
          }
        }
      }else{
        wx.showToast({
          title: res.data.data.err || res.data.err,
          icon:'none'
        })
      }
    })
  },
  shuaxin(){
    this.setData({
      shuaxinAttr:true
    })
    this.getHomeData()
  },
  kaoqintongji(){
    wx.navigateTo({
      url: '../kaoqintongji/index',
    })
  },
  yichangshenqing(){
    wx.navigateTo({
      url: '../kaoqinshenqing/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.workerPunchList()
    this.init(),
    this.getHomeData()
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