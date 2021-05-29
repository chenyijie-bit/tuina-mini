let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  logoImg:'../../assess/images/3.jpeg',
  wechatLogo:'../../assess/images/weixin.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	
  },
  getUserProfile(){
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo', res.userInfo)
        if(res.userInfo){
          wx.navigateBack({
            delta: 1,
            fail(e){
              console.log(e);
            }
          })
        }
        //拿到信息在登录一下
        let reqObj = Object.assign({code:app.globalData.code},res.userInfo)
        $api.getOpenid(reqObj).then(res=>{})
      }
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