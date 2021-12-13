// pages/mendianshezhiyuangong/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId:'',
    workerList: [],
    radio: '',
    workId:'',
    getGlobalWorkId: ''
  },
  onChangeRadioTab(event) {
    console.log();
    let index =  event.detail
    let list = this.data.workerList
    // radio:,
    // type: 9
    this.setData({
      workId: list[index].worker.id,
      radio: index
    });
  },
  querendianzhang(){
    let dataStr = '',dataObj={}
    if(!this.data.workId || !this.data.storeId){
      wx.showToast({
        title: "请选择员工",
        icon:'none'
      })
      return false
    }
    // openId: XXX, shopId: XXX, shopName: XXX
    let arr = app.globalData.setDianZhangArr || []
    let index = arr.findIndex(e=>e.shopId == this.data.storeId)
    if(index !== -1){
      arr.splice(index,1)
    }
    dataObj.workId = this.data.workId
    dataObj.shopId = this.data.storeId
    arr.push(dataObj)
    dataStr = JSON.stringify(arr)
    console.log(dataStr);
    $api.workerConfigSet({
      "openid": app.globalData.openId,
      data:dataStr
    }).then(res=>{
        if(res.data.code == 200){
          wx.showToast({
            title: "设置成功"
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '../setStoreManage/index'
            })
          }, 1000);
        }else{
          wx.showToast({
            title: res.data.err || res.data.data.err,
            icon:'none'
          })
        }
      })
  },
  initData(){
    $api.workerPunchShopDetail({
      "openid": app.globalData.openId,
      worker_id:'',
      shop_id: this.data.storeId
    }).then(res=>{
      if(res.data.code == 200){
        let itemList = res.data.data
        this.setData({
          workerList: itemList
        })
        if(app.globalData.setDianZhangArr){
          console.log(app.globalData.setDianZhangArr);
          app.globalData.setDianZhangArr.map(e=>{
            if(this.data.storeId == e.shopId){
              let workId = e.workId - 0
              this.setData({
                getGlobalWorkId: workId
              })
            }
          })
          itemList.map((s,i)=>{
            console.log(s.worker.id);
            console.log(this.data.getGlobalWorkId);
            if(s.worker.id==this.data.getGlobalWorkId){
              this.setData({
                radio: i,
                workId: Number(this.data.getGlobalWorkId)
              })
            }
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
    this.setData({
      storeId : options.id
    })
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