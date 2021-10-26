// pages/shouyelunbo/index.js
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    obj: {
      "page_id":"7",								//页面id        本项目为        7    
      "block_type":"4",							//页面类型                     4 => '轮播图组',   7=> '单张图组 按序排列',  10=> '推荐技师',
      "rank":"",									//排序  可以按顺序传
      "is_all_through_valid":"1",					//是否一直有效，  可以显示一次
      "start_time":"2021-02-03 23:59:23",			//轮播开始时间
      "end_time":"2031-02-03 23:59:23",			//轮播结束时间
     
      "image_image_type":"1",						// 图片类型， 暂定
      "image_is_smooth_scroll":"1",				// 1平滑混动，2整屏滚动',
      "image_width":"1",
      "image_height":"1",							
      "image_background_color":"1",				
      "image_box_style":"1",
      "image_addation1":"1",						//备注信息1
      "image_addation2":"1",						//备注信息2
    }
  },
  delete(e){
    let id = e.currentTarget.dataset.id
    let image_name = e.currentTarget.dataset.image_name
    let image_atta_id = e.currentTarget.dataset.image_atta_id
    let image_link_type = e.currentTarget.dataset.image_link_type
    let cusObj = {
      "openid": app.globalData.openId,
      "status":"-2",								// 删除 给 -2  ；  其他不给
      image_name,
      detail_id:id,
      image_atta_id,
      image_link_type,			// 链接类型  链接类型 0 无链接 ； 1技师  ； 2店铺 ;3 活动     4  会员卡
    }
    let resObj = Object.assign({},cusObj,this.data.obj)
    $api.workerSystemPageDetailSet(resObj).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        // 说明是修改信息成功了
        wx.showToast({
          title: '已删除',
          icon:'none'
        })
        setTimeout(() => {
          this.initData()
        }, 800);
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:'none'
        })
      }
    })
  },
  tianjialunbo(){
    wx.redirectTo({
      url: '../tianjialunbo/index',
    })
  },
  initData(){
    $api.workerSystemPageDetailList({
      "openid": app.globalData.openId,
      "name":"", 						//可选参数。  模糊查询
      "page_id": 7
    }).then(res=>{
      console.log(res);
      if(res.data.code ==200){
        let list = res.data.data.list
        this.setData({
          list
        })
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:'none'
        })
      }
    })
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
    this.initData()
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