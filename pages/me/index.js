// // pages/me/index.js
// Page({

// 	/**
// 	 * 页面的初始数据
// 	 */
// 	data: {
// 		avatarUrl:''
// 	},

// 	/**
// 	 * 生命周期函数--监听页面加载
// 	 */
// 	onLoad: function (options) {
// 		if(!wx.getStorageSync('userInfo')){
// 			wx.navigateTo({
// 			  url: '../loginPage/index',
// 			})
// 		}else{
// 			let userInfo = wx.getStorageSync('userInfo')
// 			console.log(userInfo)
// 			this.setData({
// 				avatarUrl :userInfo.avatarUrl
// 			})
// 		}
// 	},
// 	goToOrder(){
// 		wx.switchTab({
// 			url: '../order/index',
// 		})
// 	},
// 	/**
// 	 * 生命周期函数--监听页面初次渲染完成
// 	 */
// 	onReady: function () {

// 	},

// 	/**
// 	 * 生命周期函数--监听页面显示
// 	 */
// 	onShow: function () {
//     if (typeof this.getTabBar === 'function' &&
//       this.getTabBar()) {
//       this.getTabBar().setData({
//         selected: 2
//       })
//     }
//   },

// 	/**
// 	 * 生命周期函数--监听页面隐藏
// 	 */
// 	onHide: function () {

// 	},

// 	/**
// 	 * 生命周期函数--监听页面卸载
// 	 */
// 	onUnload: function () {

// 	},

// 	/**
// 	 * 页面相关事件处理函数--监听用户下拉动作
// 	 */
// 	onPullDownRefresh: function () {

// 	},

// 	/**
// 	 * 页面上拉触底事件的处理函数
// 	 */
// 	onReachBottom: function () {

// 	},

// 	/**
// 	 * 用户点击右上角分享
// 	 */
// 	onShareAppMessage: function () {

// 	}
// })
Component({
  data: {
    avatarUrl:'../../assess/tabicons/me.png',
    nickNameCopy:'点击登录 >',
    nickName:'',
    tel:''
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
      if(!wx.getStorageSync('userInfo')){
        // wx.navigateTo({
        //   url: '../loginPage/index',
        // })
      }else{
        let userInfo = wx.getStorageSync('userInfo')
        console.log(userInfo)
        this.setData({
          avatarUrl :userInfo.avatarUrl,
          nickName:userInfo.nickName
        })
      }
    }
  },
  methods:{
    goToLogin(){
      if(!this.data.nickName){
        wx.navigateTo({
          url: '../loginPage/index',
        })
        return false;
      }
    },
    goToOrder(){
      wx.switchTab({
        url: '../order/index',
      })
    },
  }
})