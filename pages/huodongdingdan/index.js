// pages/dingdanliebiao/index.js
let app = getApp();
const $api = require('../../utils/request').API;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '1',
    searchValue:'',
    itemList: []
  },
  shiyong(e){
    let _this = this
    let id = e.currentTarget.dataset.id
    this.setData({
      dataid:id
    })
    Dialog.confirm({
      message: '确认使用吗',
    })
      .then(() => {
       $api.workerMarketingApply({
        openid:app.globalData.openId,
        order_id:this.data.dataid,
          }).then(res=>{
            if(res.data && res.data.code == 200){
              wx.showToast({
                title: '操作成功',
              })
              _this.searchOrder()
            }else{
              wx.showToast({
                title: res.data.err || '操作出错',
                icon: 'none'
              })
            }
          })
      })
      .catch(() => {
        // on cancel
      });
  },
  shanchu(e){
    let _this = this
    let id = e.currentTarget.dataset.id
    this.setData({
      dataid:id
    })
    Dialog.confirm({
      message: '确认退款吗',
    })
      .then(() => {
       $api.workerOrderRefundMarketing({
        openid:app.globalData.openId,
        order_id:this.data.dataid,
          }).then(res=>{
            if(res.data && res.data.code == 200){
              //说明退款成功了
              wx.showToast({
                title: '退款成功',
              })
              _this.searchOrder()
            }
          })
      })
      .catch(() => {
        // on cancel
      });
  },
  search(){
    let tel = this.data.searchValue
    this.setData({
      telWorker:tel
    })
    if(tel) tel = tel.trim()
    if(tel && tel.length==11){
      this.searchOrder(tel)
    }else{
      wx.showToast({
        title: '请检查输入的手机号是否正确',
        icon:'none'
      })
    }
  },
  bindchange(e){
    this.setData({
      searchValue: e.detail,
    });
  },
  onChangeRadioTab(event) {
    this.setData({
      radio: event.detail,
    });
    this.searchOrder(this.data.searchValue)
  },
  searchOrder(tel=''){
    if(this.data.radio == '1'){
      $api.marketingOrderList({
        "openid":app.globalData.openId,
        "user_id":"",								//可选参数。
        "phone":tel,						//可选参数。
        "trade_no":"",	//可选参数。
        "order_code":""		//可选参数。
      }).then(res=>{
        if(res.data.code == 200){
          let list = res.data.data.list || []
          this.setData({
            itemList:list
          })
        }else{
          wx.showToast({
            title: res.data.err || res.data.data.err,
            icon:'none'
          })
        }
      })
    }else{
      // 会员卡订单列表
      $api.vipOrderList({
        "openid": app.globalData.openId,
        "edate":"",						//可选
        "sdate":"",//可选
        "order_code":"",//可选
        "trade_no":"",//可选
        "user_info_id":"",//可选
        "vip_info_id":"",//可选
        "vip_type":"",//可选
        "user_phone":tel,	
      }).then(res=>{
        if(res.data.code == 200){
          let list = res.data.data.list || []
          list.map(e=>{
            e.start_time = e.start_time.split(' ')[0]
            e.end_time = e.end_time.split(' ')[0]
          })
          this.setData({
            itemList:list
          })
        }else{
          wx.showToast({
            title: res.data.err || res.data.data.err,
            icon:'none'
          })
        }
      })
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.searchOrder()
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