// pages/tianjiahuiyuanka/index.js
let app = getApp();
const $api = require('../../utils/request').API;
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList:[],
    name:'',  // 标题
    // shangjia: false, // 是否上架
    desc:'',   // 海报详情
    aid:'' ,
    type:'30',
    discount:'', // 折扣
    money:100
  },
  // onChangeShangjia({ detail }){
  //   this.setData({
  //     shangjia: detail
  //   })
  // },
  onChangeRadioTab(e){
    let detail = e.detail
    this.setData({
      type: detail
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
    if(!this.data.discount || !this.data.money){
      wx.showToast({
        title: '请把信息填写完整',
        icon:'none'
      })
      return false
    }
    if(this.data.discount){
      if(!parseFloat(this.data.discount) || parseFloat(this.data.discount)>10 || parseFloat(this.data.discount)<1){
        wx.showToast({
          title: '折扣请填写 1到10 的数值,数字8代表8折',
          icon:'none',
          duration: 3000
        })
        return false
      }
    }
    $api.workerVipSet({
      id : '',						//修改时  有id
      "openid": app.globalData.openId,
      "name":this.data.name,
      "atta_id":this.data.aid,
      "discount":parseFloat(this.data.discount) / 10,  //折扣
      "type":this.data.type,
      "desc":this.data.desc,
      "price":this.data.money   //价格
    }).then(res=>{
      if(res.data.code == 200){
        // 说明是修改信息成功了
        wx.showToast({
          title: '已添加会员卡',
          icon:'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '../huiyuankaika/index',
          })
        }, 1200);
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