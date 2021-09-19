let app = getApp();
const $api = require('../../utils/request').API;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
// pages/addWorker/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    searchValue:'',
    itemList:'',
    telWorker:'',
    listInfo:'',
    meiyouInfo: false,
    storeList:[],
    status:'',
    workerid:''
  },
  fenpeidianpu(e){
    let id = e.currentTarget.dataset.id
    const beforeClose = (action) => new Promise((resolve) => {
      setTimeout(() => {
        if (action === 'confirm') {
          $api.workerUserBindShop({
            openid: app.globalData.openId,
            worker_id: this.data.workerid,
            shop_id: id
          }).then(
            res=>{
              console.log(res);
              if(res.statusCode ==200 && res.data && res.data.data){
                wx.showToast({
                  title: "操作成功",
                  duration: 1900
                })
              }else{
                wx.showToast({
                  title: res.err || res.data.err,
                  icon: 'error',
                  duration: 2000
                })
              }
            }
          )
          resolve(true);
        } else {
          // 拦截取消操作
          resolve(false);
        }
      }, 1000);
    });
    Dialog.confirm({
      title: '标题',
      message: '确认分配到此店铺？',
      beforeClose
    });
  },
  // 获取首页数据
  getHomeData(){
    let openid = app.globalData.openId
    $api.getHomeData({openid}).then(
      res=>{
        if(res.statusCode ==200 && res.data && res.data.data){
          let data = res.data.data
          let shops = data.shops || []
          let mendianList = []
          data.shops.map(e=>{
            mendianList.push({name:e.name,id:e.id, dateList:[{flag:''},{flag:''},{flag:''},{flag:''},{flag:''}]}) 
          })
          this.setData({
            storeList:data.shops,
            mendianList
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'error',
            duration: 4000
          })
        }
      }
    )
  },
  bindchange(e){
    this.setData({
      searchValue: e.detail,
    });
  },
  search(){
    let tel = this.data.searchValue
    this.setData({
      telWorker:tel
    })
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
    // searchWorker
    
    $api.requestWorkerList({phone:data,openid:app.globalData.openId}).then(res=>{
      if(res.statusCode ==200 && res.data.code == 200){
        let itemList2 = res.data.data.list
        if(!itemList2 || !itemList2.length){
          this.setData({
            listInfo:'没有信息',
            meiyouInfo: true
          })
        }
        itemList2.map(e=>{
          let status = e.worker_info.status
          let id = e.worker_info.id
          this.setData({
            status,
            workerid: id
          })
          if(!e.worker_info.status){
            e.worker_info.status = 0
          }
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
          itemList: itemList2
        })
      }else{
        wx.showToast({
          title: res.data.err,
          icon:'none'
        })
      }
      this.setData({
        loading:false
      })
    })
  },
  // 删除员工
  delWorker(e){
    let id = e.currentTarget.dataset.id
    const beforeClose = (action) => new Promise((resolve) => {
      setTimeout(() => {
        if (action === 'confirm') {
          $api.workerUserDel({
            openid:app.globalData.openId,worker_id:id
          }).then(res=>{
            console.log(res);
            if(res.data.code == 200){
              wx.showToast({
                title: '已删除该员工'
              })
              this.searchWorker(this.data.telWorker)
            }else{
              wx.showToast({
                title: res.data.err,
                icon:'none'
              })
            }
          })
          resolve(true);
        } else {
          // 拦截取消操作
          resolve(false);
        }
      }, 1000);
    });
    Dialog.confirm({
      title: '标题',
      message: '确认删除该员工？',
      beforeClose
    });
  },
  setWorker(e){
    let id = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status
    if(!status || status == '-2'){
      $api.setForWorker({openid:app.globalData.openId,user_info_id:id}).then(res=>{
        console.log(res)
        if(res.data && res.data.code == 200){
          wx.showToast({
            title: '通知员工后台添加信息',
            icon: 'none',
            duration: 2200
          })
          this.search()
        }else{
          wx.showToast({
            title: res.data.err || res.data.data.err,
            icon: 'none',
            duration: 2200
          })
        }
      })
    }else if(status && status == 50){
      //迁移完成 等待填写个人信息

    }else if(status && status == 53){
      // 信息填写完毕  可以确认设置为员工
      $api.workerUserAgree({openid:app.globalData.openId,worker_id:id}).then(res=>{
        console.log(res)
        if(res.data && res.data.code == 200){
          wx.showToast({
            title: '添加成功'
          })
          this.search()
        }else{
          wx.showToast({
            title: res.data.err || res.data.data.err,
            icon: 'none'
          })
        }
      })
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
    this.getHomeData()
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