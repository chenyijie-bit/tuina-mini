let app = getApp();
const $api = require('../../utils/request').API;
// pages/gerenxinxi/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList:[],
    name:'',
    tel:'',
    // sex:1, // 1男  2女
    age:1, // 工龄
    kuadian: false, // 是否跨店
    message:''
  },
  // onChangeSex(e){
  //   this.setData({
  //     sex: e.detail
  //   })
  // },
  onChangeAge(e){
    this.setData({
      age: e.detail
    })
  },
  onChangeKuadian({ detail }){
    this.setData({
      kuadian: detail
    })
  },
  afterRead(event) {
    console.log(event.detail);
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
        if(res.data){
          let jsonData = JSON.parse(res.data)
          console.log(jsonData);
        }
        // 上传完成需要更新 fileList
        // const { fileList = [] } = this.data;
        // fileList.push({ ...file, url: res.data });
        // this.setData({ fileList });
      },
    });
  },
  oooo(){
    $api.userWorkerRegister({
      openid:app.globalData.openId,

    }).then(res=>{
      console.log(res);
    })
    console.log(this.data.name);
    console.log(this.data.tel);
    console.log(this.data.age);
    console.log(this.data.kuadian);
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