// pages/mendianshuju/index.js
let app = getApp();
const $api = require('../../utils/request').API;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeList:[],
    isShowAddStore: true
  },
  addStore(){
    wx.navigateTo({
      url: '../addstore/index',
    })
  },
  dianpuxiangqing(e){
    let id= e.currentTarget.dataset.id
    let name= e.currentTarget.dataset.name
    wx.setStorageSync('storeDataId', id)
    wx.setStorageSync('storeDataName', name)
    wx.navigateTo({
      url: '../mendianxiangqing/index',
    })
  },
  delShop(e){
    let id= e.currentTarget.dataset.id
    let name= e.currentTarget.dataset.name
    Dialog.confirm({
      message: `确认删除 ${name} 店铺吗`,
    }).then(() => {
      $api.workerShopDel({openid:app.globalData.openId,id:id,is_delete:1}).then(res=>{
        if(res.data.code == 200){
          wx.showToast({
            title: '操作成功',
          })
          this.initData()
        }else{
          wx.showToast({
            title: res.data.err || res.data.data.err,
            icon:'none'
          })
        }
      })
    })
    .catch(() => {
      // on cancel
    });
  },
  initData(){
    $api.workerShopList({openid:app.globalData.openId}).then(res=>{
      if(res.data.code == 200){
        let resData = []
        console.log(res.data.data);
        let data = res.data.data.list
        if(app.globalData.worker_type!=10){
          //说明是普通店员
          console.log(999);
          let a = data.find(e => e.id == app.globalData.curSuoShuStoreId)
          console.log(app.globalData.curSuoShuStoreId);
          resData.push(data.find(e => e.id == app.globalData.curSuoShuStoreId))
        }else{
          resData = [...data]
        }
        console.log(resData);
        this.setData({
          storeList: resData
        })
      }else{
        wx.showToast({
          title: res.data.err,
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
    wx.setStorageSync('storeDataId', '')
    if(app.globalData.worker_type == 10){
      this.setData({
        isShowAddStore: true
      })
    }else{
      this.setData({
        isShowAddStore: false
      })
    }
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