let app = getApp();
const $api = require('../../utils/request').API;
// pages/addWorker/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    searchValue:'',
    itemList:''
  },
  bindchange(e){
    this.setData({
      searchValue: e.detail,
    });
  },
  search(){
    let tel = this.data.searchValue
    console.log(!tel);
    if(tel) tel = tel.trim()
    if(tel && tel.length==11){
      this.searchWorker(tel)
    }else{
      wx.showToast({
        title: '请检查输入的手机号是否正确',
        icon:'none'
      })
    }
  },
  searchWorker(data){
    this.setData({
      loading:true
    })
    console.log(app.globalData)
    $api.searchWorker({phone:data,openid:app.globalData.openId}).then(res=>{
      if(res.statusCode ==200 && res.data.code == 200){
        let itemList2 = res.data.data.list
        itemList2.map(e=>{
          if(e.worker_info.status == 0){
            e.butText = '设置为员工'
          }else if(e.worker_info.status == 50){
            e.butText = '完善信息中'
          }else if(e.worker_info.status == 53){
            e.butText = '确认添加'
          }
        })
        //说明获取成功
        this.setData({
          loading:false,
          itemList: itemList2
        })
      }
    })
  },
  setWorker(e){
    let id = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status
    if(!status){
      $api.setForWorker({openid:app.globalData.openId,user_info_id:id}).then(res=>{
        console.log(res)
        if(res.data && res.data.code == 200){
          wx.showToast({
            title: '通知员工后台添加信息',
            icon: 'none'
          })
          this.search()
        }else{
          wx.showToast({
            title: '设置失败，请重试',
            icon: 'none'
          })
        }
      })
    }else if(status && status == 50){
      //迁移完成 等待填写个人信息

    }else if(status && status == 53){
      // 信息填写完毕  可以确认设置为员工

    }else if(status && status == 56){
      // 已设置为员工  可以为他分配店铺

    }else if(status && status == 60){
      //都已经完成
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