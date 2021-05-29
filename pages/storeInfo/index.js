let app = getApp();
const $api = require('../../utils/request').API;
Page({
  data: {
      winHeight: 0,
      currentTab: 0,
      personImg:'../../assess/images/123.jpeg',
      waitIcon:'../../assess/images/waiticon.png',
      workList:[]
  },
  onLoad: function() {
      var that = this;
    
      $api.getShopData({
        openid: app.globalData.openId,
        shop_id : app.globalData.shop_id
      }).then(res=>{
        console.log(res)
        if(res.statusCode === 200){
            let data = res.data.data
            let workerNum = data.worker.length
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