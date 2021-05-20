Component({
  data: {
    selected: 0,
    color: "#000000",
    roleId: '',
    selectedColor: "#1396DB",
    allList: [{
      //用户角色tab栏
      list1: [{
        "pagePath": "../index/index",
        "text": "点个高手",
        "iconPath":"../assess/tabicons/shouye2.png",
        "selectedIconPath":"../assess/tabicons/shouye.png"
      }, {
        "pagePath": "../order/index",
        "text": "订单",
        "iconPath":"../assess/tabicons/dingdan2.png",
        "selectedIconPath":"../assess/tabicons/dingdan.png"
      }, {
        "pagePath": "../me/index",
        "text": "我的",
        "iconPath":"../assess/tabicons/me2.png",
        "selectedIconPath":"../assess/tabicons/me.png"
      }, {
        "pagePath": "../achievement/index",
        "text": "我的业绩",
        "iconPath":"../assess/tabicons/me2.png",
        "selectedIconPath":"../assess/tabicons/me.png"
      }],
      //员工角色tab栏
      list2: [
        // {
        //   "pagePath": "../index/index",
        //   "text": "点个高手",
        //   "iconPath":"../assess/tabicons/shouye2.png",
        //   "selectedIconPath":"../assess/tabicons/shouye.png"
        // }, {
        //   "pagePath": "../order/index",
        //   "text": "订单",
        //   "iconPath":"../assess/tabicons/dingdan2.png",
        //   "selectedIconPath":"../assess/tabicons/dingdan.png"
        // }, 
        {
          "pagePath": "../index/index",
          "text": "点个高手",
          "iconPath":"../assess/tabicons/shouye2.png",
          "selectedIconPath":"../assess/tabicons/shouye.png"
        },
      {
        "pagePath": "../me/index",
        "text": "我的",
        "iconPath":"../assess/tabicons/me2.png",
        "selectedIconPath":"../assess/tabicons/me.png"
      }, {
        "pagePath": "../achievement/index",
        "text": "我的业绩",
        "iconPath":"../assess/tabicons/me2.png",
        "selectedIconPath":"../assess/tabicons/me.png"
      }]
    }],
    list: []
  },
  attached() {
    const roleId = wx.getStorageSync('statu')
    if (roleId == 20) {
      this.setData({
        list: this.data.allList[0].list1
      })
    }else{
      this.setData({
        list: this.data.allList[0].list2
      })
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  },
})