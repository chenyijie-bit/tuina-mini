let app = getApp();
const $api = require('../../utils/request').API;
const formatDate = require('../../utils/util')
const $Distance = require('../../utils/util').Distance;
Page({
  data: {
    head_url:'../../assess/images/123.jpeg',
    rate:5,
    typeRadio:'1',
    deftypeTimeStr:'',
    showPopup:false,
    hasPhoneNumber:false,
    //预约类型  是 1 立即取号   还是 2  预约
    appointmentType:'',
    shopInfo:{},
    yuyuekongjianIsShow:false,
    //预约下单时间
    reserve_date:'',
    currentTab:0,
    dateList:[],
    dateTit : [],
    longDateList:[],  //['2021-06-04','2021-06-05'...]
    quedateList:[],  //[[{st: "1622851200", et: "1622853000", type: "2", sort: "1"},…],[]]
    selectFlagTab:'',
    indexTabDateCur:{}, //{1:[2,1,3],2:[3,4,5]} 对应日期索引上的对应时间索引 已被预约不可选择
    timeSelectModelBox:[],
    // timeSelectModel:[
    //   {time:'08:00',select:false,disabled:false,datestr:''},{time:'08:30',select:false,disabled:false,datestr:''},{time:'09:00',select:false,disabled:false,datestr:''},{time:'09:30',select:false,disabled:false,datestr:''},{time:'10:00',select:false,disabled:false,datestr:''},{time:'10:30',select:false,disabled:false,datestr:''},{time:'11:00',select:false,disabled:false,datestr:''},{time:'11:30',select:false,disabled:false,datestr:''},{time:'12:00',select:false,disabled:false,datestr:''},{time:'12:30',select:false,disabled:false,datestr:''},{time:'13:00',select:false,disabled:false,datestr:''},{time:'13:30',select:false,disabled:false,datestr:''},{time:'14:00',select:false,disabled:false,datestr:''},{time:'14:30',select:false,disabled:false,datestr:''},{time:'15:00',select:false,disabled:false,datestr:''},{time:'15:30',select:false,disabled:false,datestr:''},{time:'16:00',select:false,disabled:false,datestr:''},{time:'16:30',select:false,disabled:false,datestr:''},{time:'17:00',select:false,disabled:false,datestr:''},{time:'17:30',select:false,disabled:false,datestr:''},{time:'18:00',select:false,disabled:false,datestr:''},{time:'18:30',select:false,disabled:false,datestr:''},{time:'19:00',select:false,disabled:false,datestr:''},{time:'19:30',select:false,disabled:false,datestr:''},{time:'20:00',select:false,disabled:false,datestr:''},{time:'20:30',select:false,disabled:false,datestr:''},{time:'21:00',select:false,disabled:false,datestr:''},{time:'21:30',select:false,disabled:false,datestr:''},{time:'22:00',select:false,disabled:false,datestr:''},{time:'22:30',select:false,disabled:false,datestr:''}
    // ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload');
    let _this = this
    
    $api.getWorkerData({
      openid:app.globalData.openId,
      worker_id:app.globalData.worker_id,
      shop_id:app.globalData.shop_id
    }).then(res=>{
      console.log(res)
      if(res.statusCode == 200){
        let data = res.data.data
        let resData = Object.assign({},data)
        app.globalData.shop_id = resData.shop.id
        if(resData.shop && resData.shop.location){
          resData.distance = $Distance(resData.shop.location.latitude,resData.shop.location.longitude,app.globalData.userAddressInfo.Lat,app.globalData.userAddressInfo.Long)
          resData.longitude = resData.shop.location.longitude
          resData.latitude = resData.shop.location.latitude
        } 
        let deftypeRadio = ''
        let deftypeTimeStr  = ''
        if(resData.skill && resData.skill.length && resData.skill[0].id){
          deftypeRadio = resData.skill[0].id
          deftypeTimeStr = resData.skill[0].service_duration - 5
        }
        _this.setData({
          shopInfo: resData,
          typeRadio: deftypeRadio,
          deftypeTimeStr:deftypeTimeStr
        })
      }
    }),
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        // 登录
      wx.login({
        success: res => {
          app.globalData.code = res.code
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // 调用接口获取openid
            if(!app.globalData.openId){
              _this.getOpenid(res.code)
            }
          }
        })
      }
    })
  },
  createTimeSelectModel(){
    let timeSelectModel = [
      {time:'07:30',select:false,disabled:false,datestr:''},{time:'08:00',select:false,disabled:false,datestr:''},{time:'08:30',select:false,disabled:false,datestr:''},{time:'09:00',select:false,disabled:false,datestr:''},{time:'09:30',select:false,disabled:false,datestr:''},{time:'10:00',select:false,disabled:false,datestr:''},{time:'10:30',select:false,disabled:false,datestr:''},{time:'11:00',select:false,disabled:false,datestr:''},{time:'11:30',select:false,disabled:false,datestr:''},{time:'12:00',select:false,disabled:false,datestr:''},{time:'12:30',select:false,disabled:false,datestr:''},{time:'13:00',select:false,disabled:false,datestr:''},{time:'13:30',select:false,disabled:false,datestr:''},{time:'14:00',select:false,disabled:false,datestr:''},{time:'14:30',select:false,disabled:false,datestr:''},{time:'15:00',select:false,disabled:false,datestr:''},{time:'15:30',select:false,disabled:false,datestr:''},{time:'16:00',select:false,disabled:false,datestr:''},{time:'16:30',select:false,disabled:false,datestr:''},{time:'17:00',select:false,disabled:false,datestr:''},{time:'17:30',select:false,disabled:false,datestr:''},{time:'18:00',select:false,disabled:false,datestr:''},{time:'18:30',select:false,disabled:false,datestr:''},{time:'19:00',select:false,disabled:false,datestr:''},{time:'19:30',select:false,disabled:false,datestr:''},{time:'20:00',select:false,disabled:false,datestr:''},{time:'20:30',select:false,disabled:false,datestr:''},{time:'21:00',select:false,disabled:false,datestr:''},{time:'21:30',select:false,disabled:false,datestr:''},{time:'22:00',select:false,disabled:false,datestr:''},{time:'22:30',select:false,disabled:false,datestr:''},{time:'23:00',select:false,disabled:false,datestr:''}
    ]
    return timeSelectModel
  },
  goto: function (e) {
    var page = this;
    wx.getSetting({
        success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
                app.getauth({
                    content: '需要获取您的地理位置授权，请到小程序设置中打开授权！',
                    cancel: false,
                    success: function (res) {
                        if (res.authSetting['scope.userLocation']) {
                            page.location(e);
                        }
                    }
                });
            } else {
                page.location(e);
            }
        }
    })
  },

  location: function (e) {
      let page = this;
      let latitude = e.currentTarget.dataset.latitude;
      let longitude = e.currentTarget.dataset.longitude;
      let name = e.currentTarget.dataset.name;
      let address = e.currentTarget.dataset.address;
      wx.openLocation({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          name: name,
          address: address,
      })
  },
  zanbuzhichi(){
    wx.showToast({
      title: '该员工暂不支持立即取号',
      icon: 'none'
    })
  },
  onChange(event) {
    console.log(event);
    this.setData({
      typeRadio: event.detail,
    });
  },
  changeType(data){
    console.log(this.data.currentTab);
    for (let index = 0; index < 5; index++) {
      this.setData({
        ['indexTabDateCur['+index+']'] : []
      })
    }
    this.setData({
      typeRadio: data.currentTarget.dataset.type,
      deftypeTimeStr: data.currentTarget.dataset.needtime - 5
    });
  },
  getNumberNow(){
    if(!this.data.showPopup){
      this.setData({
        showPopup:true
      })
    }
  },
  onClose(){
    this.setData({
      showPopup:false
    })
  },
  onClose2(){
    this.setData({
      yuyuekongjianIsShow:false
    })
  },
  /////需要加个判断就是首页拿到手机号的时候就不用在授权了
  // 而且还要看sessionkey是否过期  过期就要先登录 login
  getPhoneNumber (e) {
    console.log(111111111111);
    console.log(e);
    if(e.detail.errMsg && e.detail.errMsg.indexOf('fail')>0){
      // 说明拒绝授权手机号
      return false
    }
    this.setData({
      appointmentType:e.currentTarget.dataset.type
    })
    console.log(this.data.appointmentType);
    // 如果系统中没有电话号码
    $api.getTelNumber({
      openid:app.globalData.openId,
      iv:e.detail.iv,
      encryptedData:e.detail.encryptedData,
      cloudIDL:e.detail.cloudID
    }).then(res=>{
      if(res.statusCode == 200 && res.data.code == 200){
        //立即下单
        console.log(this.data.appointmentType);
        if(this.data.appointmentType == 1){
          this.setData({
            yuyuekongjianIsShow:false,
            showPopup:true
          })
        }else{
          //预约下单
          this.setData({
            showPopup:false,
            yuyuekongjianIsShow:true
          })
          //getPhoneNumber 函数也要写这部分
          $api.workerFutureList({
            // 上线要改成真实数据 改成工作人员的open
            openid:app.globalData.openId,
            worker_id:app.globalData.worker_id,
          }).then(res=>{
            console.log(res);
            if(res.statusCode ==200 && res.data.code == 200){
              let dateData = res.data.data
              let arr = []
              let longDateList = []
              let quedateList = []
              for (const key in dateData) {
                if (Object.hasOwnProperty.call(dateData, key)) {
                  longDateList.push(key)
                  quedateList.push(dateData[key])
                  let keyStrArr = key.split('-')
                  let keyStr = ''
                  if(keyStrArr && keyStrArr.length){
                    keyStr = `${keyStrArr[1]}/${keyStrArr[2]}`
                  }
                  arr.push(keyStr)
                }
              }
              this.setData({dateTit : arr,longDateList:longDateList,quedateList:quedateList})
              // this.changeTabGetTime()
              let timeSelectModel = this.createTimeSelectModel()
              timeSelectModel.map((e,i)=>{
                let pinjieTime = `${this.data.longDateList[this.data.currentTab]} ${e.time}`
                let currentTimeStr = new Date(pinjieTime.replace(/-/g, '/')).getTime()
                timeSelectModel[i].datestr = currentTimeStr
                let currentTimeStrCus = new Date().getTime()
                /// 现在的时间大于预约时间段的时间的话
                if(currentTimeStrCus>currentTimeStr){
                  timeSelectModel[i].disabled = true
                }
                // 在这里判断 如果选择的时间数组里面的时间早于开店时间或者晚于关店时间都要disabled = true
                // 
              })
              let resData = []
              resData[this.data.currentTab] = timeSelectModel
              this.setData({
                timeSelectModelBox: resData
              })
              if(this.data.quedateList[this.data.currentTab] && this.data.quedateList[this.data.currentTab].length){
                this.changeTabGetTime()
              }
            }
          })
        }
      }else{
        // wx.hideLoading()
        wx.showToast({
          title: res.data.err,
          icon:'error'
        })
      }
    })
  },
  getPhoneNumber2(e){
    this.setData({
      appointmentType:e.currentTarget.dataset.type
    })
    console.log(this.data.appointmentType);
    if(this.data.appointmentType == 1){
      this.setData({
        showPopup:true,
        yuyuekongjianIsShow:false
      })
    }else{
      //预约下单
      this.setData({
        showPopup:false,
        yuyuekongjianIsShow:true
      })

      //getPhoneNumber 函数也要写这部分
      $api.workerFutureList({
        // 上线要改成真实数据 改成工作人员的open
        openid:app.globalData.openId,
        worker_id:app.globalData.worker_id,
      }).then(res=>{
        console.log(res);
        if(res.statusCode ==200 && res.data.code == 200){
          let dateData = res.data.data
          let arr = []
          let longDateList = []
          let quedateList = []
          for (const key in dateData) {
            if (Object.hasOwnProperty.call(dateData, key)) {
              longDateList.push(key)
              quedateList.push(dateData[key])
              let keyStrArr = key.split('-')
              let keyStr = ''
              if(keyStrArr && keyStrArr.length){
                keyStr = `${keyStrArr[1]}/${keyStrArr[2]}`
              }
              arr.push(keyStr)
            }
          }
          this.setData({dateTit : arr,longDateList:longDateList,quedateList:quedateList})
          let timeSelectModel = this.createTimeSelectModel()
          timeSelectModel.map((e,i)=>{
            let pinjieTime = `${this.data.longDateList[this.data.currentTab]} ${e.time}`
            let currentTimeStr = new Date(pinjieTime.replace(/-/g, '/')).getTime()
            let currentTimeStrCus = new Date().getTime()
            timeSelectModel[i].datestr = currentTimeStr
            if(currentTimeStrCus>currentTimeStr){
              timeSelectModel[i].disabled = true
            }
            // 在这里判断 如果选择的时间数组里面的时间早于开店时间或者晚于关店时间都要disabled = true
            // 
          })
          console.log(timeSelectModel);
          let resData = []
          resData[this.data.currentTab] = timeSelectModel
          this.setData({
            timeSelectModelBox: resData
          })
          if(this.data.quedateList[this.data.currentTab] && this.data.quedateList[this.data.currentTab].length){
            this.changeTabGetTime()
          }
        }
      })
    }
  },
  changeTabGetTime(){
    let currentTimeStrCus = new Date().getTime()
    let yuyueList = this.data.quedateList[this.data.currentTab]
    if(!this.data.timeSelectModelBox[this.data.currentTab] || !this.data.timeSelectModelBox[this.data.currentTab].length){
      let data = this.createTimeSelectModel()
      data.map((e,i)=>{
        let pinjieTime = `${this.data.longDateList[this.data.currentTab]} ${e.time}`
        let currentTimeStr = new Date(pinjieTime.replace(/-/g, '/')).getTime()
        data[i].datestr = currentTimeStr
        let currentTimeStrCus = new Date().getTime()
        if(currentTimeStrCus>=currentTimeStr){
          data[i].datestr.disabled = true
        }
      })
      let index = this.data.currentTab
      this.setData({
        ['timeSelectModelBox['+index+']'] : data
      })
    }
    for (let index = 0; index < yuyueList.length; index++) {
      const element = yuyueList[index];
      // element是预约的item
      // console.log(element);
      for (let j = 0; j < this.data.timeSelectModelBox[this.data.currentTab].length; j++) {
        // item是固定时间item
        const item = this.data.timeSelectModelBox[this.data.currentTab][j];
        if((Number(element.st)*1000)<= item.datestr  && (Number((element.et - 300)*1000)) >= item.datestr){
          // + Number(this.data.deftypeTimeStr)*60   + Number(this.data.deftypeTimeStr)*60
          // 则对应的日期索引上的时间段都不能被选中了
          if(!this.data.indexTabDateCur[this.data.currentTab]){
            this.setData({
              ['indexTabDateCur['+this.data.currentTab+']'] : []
            })
            let len =  this.data.indexTabDateCur[this.data.currentTab].length
            let data = this.data.indexTabDateCur[this.data.currentTab]
            if(Array.isArray(data)){
              data.push(j)
              data = Array.from(new Set(data))
              this.setData({
                ['indexTabDateCur['+this.data.currentTab+']'] : data
              })  
            }
            // this.data.indexTabDateCur[this.data.currentTab].push(j)
          }else{
            let len =  this.data.indexTabDateCur[this.data.currentTab].length
            let data = this.data.indexTabDateCur[this.data.currentTab]
            if(Array.isArray(data)){
              data.push(j)
              data = Array.from(new Set(data))
              this.setData({
                ['indexTabDateCur['+this.data.currentTab+']'] : data
              })
            }
            // this.data.indexTabDateCur[this.data.currentTab].push(j)
          }
        }
        // debugger
        // console.log(this.data.deftypeTimeStr);
        if(((Number(item.datestr) + Number(this.data.deftypeTimeStr)*60*1000)  >= ((Number(element.st)*1000))) && ((Number(item.datestr) + Number(this.data.deftypeTimeStr)*60*1000)<= ((Number(element.et)*1000)))){
          // console.log(j)
          let data = this.data.indexTabDateCur[this.data.currentTab]
            if(Array.isArray(data)){
              data.push(j)
              data = Array.from(new Set(data))
              this.setData({
                ['indexTabDateCur['+this.data.currentTab+']'] : data
              })
            }
        }
        // s说明现在的时间已经过了现在要预约的了
        if(currentTimeStrCus > item.datestr){
          let data = this.data.indexTabDateCur[this.data.currentTab]
            if(Array.isArray(data)){
              data.push(j)
              data = Array.from(new Set(data))
              this.setData({
                ['indexTabDateCur['+this.data.currentTab+']'] : data
              })
            }
        }
      }
    }
    console.log(this.data.indexTabDateCur);
      // this.setData({
      //   indexTabDateCur:indexTabDateCur
      // })
      if(this.data.indexTabDateCur[this.data.currentTab]){
        this.data.indexTabDateCur[this.data.currentTab].map((e,i)=>{
          // console.log(e);
          this.setData({
            ['timeSelectModelBox['+this.data.currentTab+']['+Number(e)+'].disabled']:  true
          })
        })
      }
  },
  selectTime(e){
    console.log(e);
    let disabled = e.currentTarget.dataset.disabled
    if(disabled) {
      wx.showToast({
        title: '此时段已被预约',
        icon:'none'
      })
      return false
    }
    let time = e.currentTarget.dataset.time
    console.log(time);
    let index = e.currentTarget.dataset.current
    console.log(index);
    this.setData({
      currentTime:time,
      selectFlagTab:index
    })
  },
  //创建订单
  creatOrder(e){
    let type = e.currentTarget.dataset.type
    if(type == 2){
      if(!this.data.currentTime){
        wx.showToast({
          title: '请选择开始时间',
          icon: 'none'
        })
        return false
      }
    }
    this.setData({
      showPopup:false,
      yuyuekongjianIsShow:false
    })
    wx.showLoading({
      title: '创建订单中...',
    })
    if(this.data.appointmentType == 1){
      // this.data.showPopup = true
    }else{
      //预约下单
      // this.data.yuyuekongjianIsShow = true
      let date = this.data.longDateList[this.data.selectFlagTab]
      let time = this.data.currentTime
      let reserve_date = `${date} ${time}`
      this.setData({
        reserve_date
      })
    }
    let service_id = [
      {"id":this.data.typeRadio,"count":1}
    ]
    let data = JSON.stringify({
      "openid": app.globalData.openId,
      "shop_id": app.globalData.shop_id, 
      "type_id": this.data.appointmentType,    //1 为立即下单 ； 2 预约，763022
      "worker_id": app.globalData.worker_id,
      "reserve_date":this.data.reserve_date,
      "service_id": service_id
    })
    
    $api.orderSubmit(data).then(res=>{
      console.log(res);
      wx.hideLoading()
      if(res.statusCode==200 && res.data.code == 200){
        // 说明预约成功
        wx.switchTab({
          url: '../order/index',
        })
      }else{
        console.log();
        wx.showToast({
          title: res.data.err || '创建失败请重试',
          icon:'none'
        })
      }
    })
  },
    //  tab切换逻辑
    swichNav: function( e ) {
      var that = this;
      if( this.data.currentTab === e.target.dataset.current ) {
          return false;
      } else {
          that.setData( {
              // selectFlagTab : e.target.dataset.current,
              currentTab: e.target.dataset.current
          })
      }
      this.changeTabGetTime()
    },
    bindChange: function( e ) {
        var that = this;
        that.setData( { currentTab: e.detail.current });
    },
    bindanimationfinish:function(e){
      let currentTab = e.detail.current
      this.setData( {
        currentTab: currentTab
      })
      this.changeTabGetTime()
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
    console.log('show');
    console.log(app.globalData.mobile)
    if(app.globalData.mobile){
      this.setData({
        hasPhoneNumber:true
      })
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