
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
      this.goToLogin()
      wx.switchTab({
        url: '../order/index',
      })
    },
  }
})