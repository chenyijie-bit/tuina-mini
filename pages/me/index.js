let app = getApp();
Component({
  data: {
    avatarUrl:'../../assess/tabicons/me.png',
    nickNameCopy:'点击登录 >',
    nickName:'',
    tel:'',
    is_vip: app.globalData.is_vip === 1 ? true : false
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
      if(!app.globalData.nickname){
        // wx.navigateTo({
        //   url: '../loginPage/index',
        // })
      }else{
        let userInfo = wx.getStorageSync('userInfo')
        this.setData({
          avatarUrl :app.globalData.head_url,
          nickName:app.globalData.nickname
        })
      }
    }
  },
  methods:{
    gotohuiyuandingdan(){
      wx.navigateTo({
        url: '../wodehuiyuanka/index',
      })
    },
    onShareAppMessage(e){
      return {
        title: '有一手',
        path: '/pages/index/index',
        imageUrl: 'http://amsiyou.oss-cn-beijing.aliyuncs.com/xcx/202109/45/09/4509361434f4f622a1.jpg'
      }
    },
    goToYiGouHuiYuan(){
      // wx.showToast({
      //   title: '敬请期待',
      //   icon: 'none'
      // })
      wx.navigateTo({
        url: '../wodehuiyuanka/index',
      })
    },
    goToYouHuiQuan(){
      wx.navigateTo({
        url: '../youhuiquanyonghu/index',
      })
    },
    goToYaoQing(){
      wx.navigateTo({
        url: '../youhuiquanyonghu/index',
      })
    },
    goToLogin(){
      if(!app.globalData.nickname){
        wx.navigateTo({
          url: '../loginPage/index',
        })
        return false;
      }
    },
    goToOrder(){
      this.goToLogin()
      wx.navigateTo({
        url: '../wodehuodongshangpin/index',
      })
    },
  }
})