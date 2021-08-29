let app = getApp();
const $api = require('../../utils/request').API;

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
// pages/gerenxinxi/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList:[],
    name:'',  // 标题
    shangjia: false, // 是否上架
    message:'',   // 海报详情
    aid:'' ,
    money:100
  },
  onChangeShangjia({ detail }){
    this.setData({
      shangjia: detail
    })
  },
  afterRead(event) {
    let _this = this
    Toast.loading({
      message: '上传中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    const { file } = event.detail;
    console.log(file);
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://www.giacomo.top/api/file/images', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'Filedata',
      header: { "Content-Type": "multipart/form-data" },
      formData: { openid: app.globalData.openId },
      Filedata: file,
      success(res) {
        console.log(res); 
        if(res.statusCode == 200){
          let jsonData = JSON.parse(res.data)
          if(jsonData && jsonData.code == 200){
            Toast.clear();
            let list = []
            list.push({
              url:jsonData.data.url
            })
            _this.setData({
              fileList:list,
              aid:jsonData.data.aid
            })
          }else{
            wx.showToast({
              title: res.data.err || res.data.data.err,
              icon:'none'
            })
          }
          console.log(jsonData);
        }else{
          wx.showToast({
            title: res.data.err || res.data.data.err,
            icon:'none'
          })
        }
        // 上传完成需要更新 fileList
        // const { fileList = [] } = this.data;
        // fileList.push({ ...file, url: res.data });
        // this.setData({ fileList });
      },
    });
  },
  oooo(){
    $api.workerMarketingSet({
      openid:app.globalData.openId,
      atta_id:this.data.aid,
      id:'',  // 店铺id
      name:this.data.name,
      status: this.data.shangjia ? 1 : 0, // // 删除 -2  ； 上架 1  ；未审核 0
      desc: this.data.message,  //描述
      price: this.data.money,
      shop_id:''
    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        // 说明是修改信息成功了
        wx.showToast({
          title: '已添加活动商品',
          icon:'none'
        })
        wx.redirectTo({
          url: '../huodongshangpin/index',
        })
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:'none'
        })
      }
    })
    console.log(this.data.name);
    console.log(this.data.tel);
    console.log(this.data.age);
    console.log(this.data.shangjia);
    console.log(this.data.message);
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