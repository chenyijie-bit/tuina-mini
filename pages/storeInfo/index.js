let app = getApp();
const $api = require('../../utils/request').API;
Page({
  data: {
    banner_url:'../../assess/images/banner1.png',
      winHeight: 0,
      currentTab: 0,
      personImg:'../../assess/images/123.jpeg',
      waitIcon:'../../assess/images/waiticon.png',
      workList:[]
  },
  getDuration: function(second) {
      var days = Math.floor(second / 86400);
      var hours = Math.floor((second % 86400) / 3600);
      var minutes = Math.floor(((second % 86400) % 3600) / 60);
      var seconds = Math.floor(((second % 86400) % 3600) % 60);
      var duration = days>0 ? days + "天" + hours + "小时" + minutes + "分" : hours > 0 ? hours + "小时" + minutes + "分" : minutes + "分";
      return duration;
  },
  onShow: function() {
    // console.log(this.getDuration(999))
  },
  onLoad: function() {
    console.log(123);
      var that = this;
      $api.getShopData({
        openid: app.globalData.openId,
        shop_id : app.globalData.shop_id
      }).then(res=>{
        console.log(res)
        if(res.statusCode === 200){
            let data = res.data.data
            let workerNum = data.worker.length
            if(workerNum){
              data.worker.map(e=>{
                e.waitStr = parseInt(e.wait) == 0 ? '无需等待' : this.getDuration(parseInt(e.wait))
              })
            }
            that.setData( {
                winHeight: 160*workerNum,
                workList: data.worker
            });
        }
      })
  },
  goToStaffInfo(e){
    app.globalData.worker_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../salesclerk/index',
    })
  },
//  tab切换逻辑
  swichNav: function( e ) {
      var that = this;
      if( this.data.currentTab === e.target.dataset.current ) {
          return false;
      } else {
          that.setData( {
              currentTab: e.target.dataset.current
          })
      }
  },
  bindChange: function( e ) {
      var that = this;
      that.setData( { currentTab: e.detail.current });
  },
})