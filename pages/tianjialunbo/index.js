// pages/tianjiahuiyuanka/index.js
let app = getApp();
const $api = require('../../utils/request').API;
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList:[],
    name:'',  // 标题
    isLink: false, // 是否是链接
    desc:'',   // 海报详情
    aid:'' ,
    type:'',
    obj: {
      "page_id":"7",								//页面id        本项目为        7    
      "block_type":"4",							//页面类型                     4 => '轮播图组',   7=> '单张图组 按序排列',  10=> '推荐技师',
      "rank":"",									//排序  可以按顺序传
      "is_all_through_valid":"1",					//是否一直有效，  可以显示一次
      "start_time":"2021-02-03 23:59:23",			//轮播开始时间
      "end_time":"2031-02-03 23:59:23",			//轮播结束时间
      "image_name":"1",							//图片的名称  或者 看怎么用
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
  onChangeShangjia({ detail }){
    this.setData({
      isLink: detail
    })
    if(this.data.isLink){
      this.setData({
        type: '3'
      })
    }else{
      this.setData({
        type: ''
      })
    }
  },
  onChangeRadioTab(e){
    let detail = e.detail
    this.setData({
      type: detail
    })
  },
  afterRead(event) {
    let _this = this
    Toast.loading({
      message: '上传中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://www.giacomo.top/api/file/images', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'Filedata',
      header: { "Content-Type": "multipart/form-data" },
      formData: { openid: app.globalData.openId },
      Filedata: file,
      success(res) {
        if(res.statusCode == 200){
          let jsonData = JSON.parse(res.data)
          if(jsonData && jsonData.code == 200){
            Toast.clear();
            let list = []
            list.push({
              url:jsonData.data.url
            })
            _this.setData({
              fileList:list,
              aid:jsonData.data.aid
            })
          }else{
            wx.showToast({
              title: res.data.err || res.data.data.err,
              icon:'none'
            })
          }
        }else{
          wx.showToast({
            title: res.data.err || res.data.data.err,
            icon:'none'
          })
        }
        // 上传完成需要更新 fileList
        // const { fileList = [] } = this.data;
        // fileList.push({ ...file, url: res.data });
        // this.setData({ fileList });
      },
    });
  },
  oooo(){
    let cusObj = {
      "openid": app.globalData.openId,
      "status":"1",								// 删除 给 -2  ；  其他不给
      "image_name":this.data.name,
      "image_atta_id":this.data.aid,
      "image_link_type": this.data.isLink ? this.data.type : 0,			// 链接类型  链接类型 0 无链接 ； 1技师  ； 2店铺 ;3 活动     4  会员卡
    }
    let resObj = Object.assign({},cusObj,this.data.obj)
    $api.workerSystemPageDetailSet(resObj).then(res=>{
      if(res.data.code == 200){
        // 说明是修改信息成功了
        wx.showToast({
          title: '已添加轮播图',
          icon:'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '../shouyelunbo/index',
          })
        }, 1000);
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