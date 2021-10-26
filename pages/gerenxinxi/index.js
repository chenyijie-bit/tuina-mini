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
    name:'',
    tel:'',
    // sex:1, // 1男  2女
    age:1, // 工龄
    kuadian: false, // 是否跨店
    message:'',
    aid:''
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
  asssad(e){
    if(e.detail && e.detail.file && e.detail.file.size > 2000000){
      wx.showToast({
        title: '请上传小于2M的图片',
        icon:'none'
      })
    }
  },
  afterRead(event) {
    let _this = this
    Toast.loading({
      message: '上传中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://www.giacomo.top/api/file/images', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'Filedata',
      header: { "Content-Type": "multipart/form-data" },
      formData: { openid: app.globalData.openId },
      Filedata: file,
      success(res) {
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
    // name:'',
    // tel:'',
    // // sex:1, // 1男  2女
    // age:1, // 工龄
    // kuadian: false, // 是否跨店
    // message:'',
    // aid:''
    $api.userWorkerRegister({
      openid:app.globalData.openId,
      atta_id:this.data.aid,
      name:this.data.name,
      type: this.data.kuadian ? 1 : 0, // 0普通员工  1跨店员工
      worker_age: this.data.age,  //工作年限
      skilled_in: this.data.message  //擅长项目
    }).then(res=>{
      if(res.data.code == 200){
        // 说明是修改信息成功了
        wx.showToast({
          title: '通知管理员已更新信息',
          icon:'none'
        })
        wx.navigateTo({
          url: '../achievement/index',
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