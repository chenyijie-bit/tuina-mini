// pages/kaoqinshenqing/index.js
let app = getApp();
const $api = require('../../utils/request').API;
const $formatTime = require('../../utils/util').formatTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    radio: '1',
    type: 'qingjia',
    currentDate:new Date().getTime(),
    minDate:new Date(2021, 5).getTime(),
    currentDateStart: '',
    currentDateEnd:'',
    startTime:'1',
    endTime:'2',
    showDatePicker:false,
    selectItem:'', // 选择的是开始还是结束日期
    currentDateStartStr:'',
    currentDateEndStr:'',
    shenqingyuanyin:'',
    currentTimeStart:'',  // 补卡时间
    currentTimeEnd: '',
    currentTime:'',
    showTimePicker:false,
    lishiList:[]
  },
  onCloseTime(){
    this.setData({
      showTimePicker:false
    })
  },
  onInputTime(e){
    console.log(e);
    this.setData({
      // currentDateStartStr: event.detail,
    });
  },
  selectDateTime(e){
    console.log(e);
    if(this.data.selectItem == 5){
      this.setData({
        currentTimeStart: e.detail,
        showTimePicker:false
      })
    }else{
      this.setData({
        currentTimeEnd: e.detail,
        showTimePicker:false
      })
    }
  },
  querenbuka(){
    let date = this.data.currentDateStart
    let timeStart = this.data.currentTimeStart
    let timeEnd = this.data.currentTimeEnd
    let startTimeDate = this.data.currentDateStart.split('/').join('-')  // 开始日期
    let startStr = ''
    if(timeStart) startStr = `${startTimeDate} ${timeStart}:00`
    let endStr = '' 
    if(timeEnd)  endStr = `${startTimeDate} ${timeEnd}:00`
    if(!timeStart && !timeEnd) {
      wx.showToast({
        title: '请选择补卡时间',
        icon:'error'
      })
      return
    }
    if(!this.data.shenqingyuanyin){
      this.setData({
        shenqingyuanyin: '12'
      })
    }
    $api.workerPunchApplys({
      "openid": app.globalData.openId,
      type:1,
      sdate:startStr,
      edate :endStr,
      content:this.data.shenqingyuanyin
    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        wx.showToast({
          title: '操作成功'
        })
        this.setData({
          active : 1
        })
      }else{
        wx.showToast({
          title: res.data.err || res.data.data.err,
          icon:'none'
        })
      }
    })
  },
  cancelDateTime(){
    this.setData({
      showTimePicker:false
    })
  },
  inputText(e){
    console.log(e);
    let value = e.detail.value
    this.setData({
      shenqingyuanyin:value
    })
  },
  queren(){
    let _this = this
    let type = this.data.radio   //1 请假  2 补卡
    let startTimeDate = this.data.currentDateStart  // 开始日期
    let endTimeDate = this.data.currentDateEnd   // 结束日期
    let startTime = this.data.startTime    // 请假的上午还是下午
    let endTime = this.data.endTime    // 请假的上午还是下午
    let qingjiayuanyin   =  this.data.shenqingyuanyin
    console.log(type,startTimeDate,endTimeDate,startTime,endTime,qingjiayuanyin);
    let qingjiaStartStr=''
    let qingjiaEndStr=''
    // let bukaStartStr=''
    // let bukaEndStr=''
    if(!qingjiayuanyin){
      wx.showToast({
        title: '请填写申请原因',
        icon:'none'
      })
      return false
    }
    if(type == 1){
      // 请假
      if(!startTimeDate || !endTimeDate){
        wx.showToast({
          title: '请填写开始和结束日期',
          icon:'none'
        })
        return false
      }
      qingjiaStartStr = startTimeDate.split('/').join('-')+' '+startTime
      qingjiaEndStr = endTimeDate.split('/').join('-')+' '+endTime
    }
    $api.workerPunchApplys({
      id :'',  		//可选  修改项
      "openid": app.globalData.openId,
      "type" : 2,   						// 必填  1应该是补卡  2应该是请假
      "sdate":qingjiaStartStr,			// type = 1 选填  二选一 伙全选;   // type = 2 必填
      "edate":qingjiaEndStr,			// type = 1 选填  二选一 伙全选;   // type = 2 必填
      "content":qingjiayuanyin	
    }).then(res=>{
      console.log(res);
      if(res.data.code == 200){
        wx.showToast({
          title: '申请成功'
        })
        setTimeout(() => {
          this.setData({
            active:1
          })
        }, 1000);
      }
    })
  },
  showDatePickerFn(e){
    console.log(e);
    let id = e.currentTarget.dataset.id
    this.setData({
      showDatePicker: true,
      selectItem: id
    })
  },
  showTimePicker(e){
    let id = e.currentTarget.dataset.id
    this.setData({
      showDatePicker: true,
      selectItem: id
    })
  },
  showTimePickerFn(e){
    console.log(e);
    let id = e.currentTarget.dataset.id
    this.setData({
      showTimePicker: true,
      selectItem: id
    })
  },
  onChangeRadioTab(event) {
    let res = event.detail == 1 ? 'qingjia' : 'buka'
    this.setData({
      radio: event.detail,
      type: res
    });
  },
  onChangeRadio1(e){
    let res = e.detail
    this.setData({
      startTime: res
    })
  },
  onChangeRadio2(e){
    let res = e.detail
    this.setData({
      endTime: res
    })
  },
  onChange(event) {
    console.log(event.detail.name);  //0  1
    let tabId = event.detail.name
    if(tabId == 1){
      $api.workerPunchApproveList({
        "openid": app.globalData.openId,
	    		approve:0, 			//审批情况	1 通过   2 未通过   0 未审核
	    		approve_worker_id:'',  	//审批人 id
	    		worker_id:app.globalData.worker_id ,			//申请人 id
	    		start_date:'',  		//请假的开始时间
	    		end_date:''            //请假的结束时间

      }).then(res=>{
        console.log(res);
        if(res.data.code == 200){
          this.setData({
            lishiList : res.data.data.list
          })
        }else{
          wx.showToast({
            title: res.data.err || res.data.data.err,
            icon:'none'
          })
        }
      })
    }
  },
  onInput(event) {
    console.log(event);
    // if(this.data.selectItem == 1){
    //   this.setData({
    //     currentDateStartStr: event.detail,
    //   });
    // }else{
    //   this.setData({
    //     currentDateEndStr: event.detail,
    //   });
    // }
    
  },
  selectDate(event){
    if(this.data.selectItem == 1){
      this.setData({
        currentDateStartStr: event.detail,
      });
    }else{
      this.setData({
        currentDateEndStr: event.detail,
      });
    }
    let item = this.data.selectItem
    let resultDate
    if(item == 1){
      resultDate = $formatTime(new Date(this.data.currentDateStartStr))
    }else{
      resultDate = $formatTime(new Date(this.data.currentDateEndStr))
    }
    let resDate = resultDate.split(' ')[0]
    if(item == 1){
      this.setData({
        currentDateStart: resDate,
        showDatePicker: false
      })
    }else{
      this.setData({
        currentDateEnd: resDate,
        showDatePicker: false
      })
    }

    console.log(resultDate);
    // let formDate = resultDate.split('/')
    // this.setData({
    //   currentY:formDate[0],
    //   currentM:formDate[1],
    //   currentMounth:`${formDate[0]}-${formDate[1]}`,
    //   showDatePicker: false
    // })
    // this.workerPunchList({year:this.data.currentY,month:this.data.currentM})
  },
  cancelDate(){
    this.setData({
      showDatePicker: false,
    });
  },
  onClose(){
    this.setData({
      showDatePicker: false,
    });
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
    let resultDate = $formatTime(new Date(new Date().getTime())).split(' ')[0]
    this.setData({
      currentDateStart: resultDate,
      currentDateEnd: resultDate
    })
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