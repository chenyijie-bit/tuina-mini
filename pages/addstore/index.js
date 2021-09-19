// pages/addstore/index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
let app = getApp();
const $api = require('../../utils/request').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '12:00',
    fileList:[],
    name:'',
    address:'',
    jingdu:'',
    weidu:'',
    time1: '',  //营业开始时间
    time2: '',   //打烊时间
    show: false,
    flag:'',
    aid:'',
    resdata:'', // 修改信息时回显的数据
    tinajiamokuai: false,
    addname:'',
    addtime:'',
    addprice:'',
    fuwuList:['全身推拿+火罐/刮痧(30分钟/￥68.00)','全身推拿+火罐/刮痧(30分钟/￥68.00)']
  },
  addfuwu(){
    this.setData({
      tinajiamokuai: true
    })
  },
  delItem(e){
    let index = e.currentTarget.dataset.index
    let fuwuList = this.data.fuwuList
    fuwuList.splice(index,1)
    this.setData({
      fuwuList
    })
  },
  querentianjia(){
    console.log(this.data.addname);
    let addname = this.data.addname
    let addtime = this.data.addtime
    let addprice = this.data.addprice
    if(addname && addtime && addprice){
      let fuwuList = this.data.fuwuList
      fuwuList.push(`${addname}(${addtime}分钟/${addprice}.00)`)
      this.setData({
        fuwuList
      })
    }
    this.setData({
      tinajiamokuai: false,
      addname:'',
      addtime:'',
      addprice:''
    })
  },
  getStoreList(){
    $api.workerShopList({openid:app.globalData.openId}).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        let id = wx.getStorageSync('storeDataId')
        let storeList = res.data.data.list
        let resdata = ''
        storeList.map(e=>{
          if(e.id == id){
            resdata = e
          }
        })
        console.log(resdata);
        if(resdata){
          this.setData({
            name:resdata.name,
            address:resdata.address,
            jingdu:resdata.location.longitude,
            weidu:resdata.location.latitude,
            time1: resdata.work_open_date,  //营业开始时间
            time2: resdata.work_close_date,   //打烊时间
            show: false,
            // flag:resdata.,
            // aid:resdata.,
          })
        }
        
      }else{
        wx.showToast({
          title: res.data.err,
          icon:'none'
        })
      }
    })
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
    console.log(this.data.currentDate);
    if(this.data.flag && this.data.flag == 1){
      this.setData({
        time1: this.data.currentDate
      })
    }
    if(this.data.flag && this.data.flag == 2){
      this.setData({
        time2: this.data.currentDate
      })
    }
  },
  onDisplay() {
    // flag: 1 代表是开业时间
    this.setData({ show: true,flag: 1 });
  },
  onDisplay2() {
    // flag: 2 代表是打烊时间
    this.setData({ show: true,flag: 2 });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
  afterRead(event) {
    let _this = this
    Toast.loading({
      message: '上传中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    const { file } = event.detail;
    console.log(file);
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://www.giacomo.top/api/file/images', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'Filedata',
      header: { "Content-Type": "multipart/form-data" },
      formData: { openid: app.globalData.openId },
      Filedata: file,
      success(res) {
        console.log(res); 
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
          console.log(jsonData);
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
    // fileList:[],
    // name:'',
    // address:'',
    // jingdu:'',
    // weidu:'',
    // date: '',
    if(!this.data.fileList || !this.data.fileList.length || !this.data.name || !this.data.address || !this.data.jingdu || !this.data.weidu){
      wx.showToast({
        title: '请完善信息',
        icon:'none'
      })
      return false
    }
    let reqObj = {}
    $api.workerShopCreate({
      openid:app.globalData.openId,
      name: this.data.name,
      "location":{
          "longitude":this.data.jingdu,
          "latitude":this.data.weidu
      },
      "work_open_date": this.data.time1 + ':00',
      "weekend_open_date": this.data.time1 + ':00',
      // 需要添加一个闭店时间
      "work_close_date": this.data.time2 + ':00',
      // "weekend_close_date": this.data.time2 + ':00',

      "address":this.data.address,
      "atta_id":this.data.aid,
      'status': 200
    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        // 说明是修改信息成功了
        wx.showToast({
          title: '  ',
          icon:'none'
        })
        wx.navigateTo({
          url: '../mendianshuju/index'
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
    let id = wx.getStorageSync('storeDataId')
    if(id){
      this.getStoreList()
    }
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