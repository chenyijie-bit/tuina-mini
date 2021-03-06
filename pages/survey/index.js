
let app = getApp();
const $api = require('../../utils/request').API;
const QR = require('../../utils/weapp-qrcode.js')
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Component({
  data: {
    todayDataList:[], //今天的订单数据
    todayData:'', //今天的日期
    qrCodeUrl: '',
    showQrCodeBox: false,
    active: '1',
    showDialog: false,
    optionsListData:[], //订单列表数据
    nouserArr:[], // 开始上班和下班的时间
    letPaymentShow: false,
    modalValue:'',// 消费金额
    modelDesc:'' ,// 备注
    queue_id:''
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      this.workerQueueList()
    }
  },
  methods:{
    // 打电话
    makePhone(e){
      let phoneNumber = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phoneNumber 
      })
    },
    deletItem(){
      Dialog.confirm({
        title: '标题',
        message: '弹窗内容',
      })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    deletOrder(event){
      console.log(213);
      console.log(event);
    },
    onCloseItem(event) {
      console.log(event);
      let queue_id = event.currentTarget.dataset.id
      let mobile = event.currentTarget.dataset.mobile
      let index = event.currentTarget.dataset.index
      const { position, instance } = event.detail;
      switch (position) {
        case 'left':
          Dialog.confirm({
            message: `确定将尾号 ${mobile} 的订单移至第一个吗？`,
          }).then(() => {
            // 确认删除
            instance.close();
            this.moveToFirst(index)
          }).catch(() => {
            instance.close();
          });
          break;
        case 'cell':
          instance.close();
          break;
        case 'right':
          Dialog.confirm({
            message: `确定删除尾号 ${mobile} 的订单吗？`,
          }).then(() => {
            // 确认删除
            instance.close();
            this.giveUp(queue_id)
          }).catch(() => {
            instance.close();
          });
          break;
      }
    },
    // 移至首位
    moveToFirst(index){
      let _this = this
      console.log(index);
      let newIndex=''
      if(index === 0){
        wx.showToast({
          title: '已经是第一位',
        })
        return false
      }
      // 根据index来移动
      let listData = this.data.optionsListData
      let currentItem = this.data.optionsListData[index]
      if(currentItem.user_st.split(' ')[0] !== this.data.todayData){
        // setTimeout(() => {
          wx.showToast({
            title: '只能移动今日数据',
            icon:'none'
          })
        // }, 800);
        return false
      }
      let todayDataList = this.data.todayDataList
      todayDataList.map((e,i)=>{
        if(currentItem.id == e.id){
          newIndex = i
          currentItem = e
        }
      })
      let needTimeStr = currentItem.et - currentItem.st  //秒
      // 获取现在的时间 再加上 此项目所需时间
      let nowTimeStr = new Date().getTime()
      let noUserTimeStr = 180  // 闲杂时间 3分钟
      // nowTimeStr+noUserTimeStr 定为开始时间的st
      let st = parseInt(nowTimeStr/1000)+noUserTimeStr
      currentItem.st = parseInt(st)
      currentItem.et = parseInt((st + needTimeStr))
      let newObjCopycurrentItem = JSON.parse(JSON.stringify(currentItem))
      console.log(currentItem);
      for (let i = 0; i < todayDataList.length; i++) {
        const element = todayDataList[i];
        if(element.type!==0 && i!= newIndex){
          console.log(i);
          if(element.st-0 < newObjCopycurrentItem.et){
            // 说明有重合
            // coincidenceTime//重合时间
            let coincidenceTime = newObjCopycurrentItem.et - (element.st-0)
            element.st = element.st - 0 + coincidenceTime + 20
            element.et = element.et - 0 + coincidenceTime + 30
            newObjCopycurrentItem = element
          }
        }
      }
      todayDataList.unshift(todayDataList[newIndex])
      todayDataList.splice(newIndex+1,1)
      let nouserArr = []
      let newDataList = []
      todayDataList.map((e,i)=>{
        if(e.type==0){
          nouserArr.push(e)
        }else{
          newDataList.push(e)
        }
      })
      newDataList.map((e,i)=>{
        e.sort = i+1
      })
      // this.setData({
      //   optionsListData:todayDataList
      // })
      console.log(this.data.optionsListData);
      // let arr22 = this.data.nouserArr
      $api.workerQueueSet({
        list:[...newDataList,...nouserArr],
        "openid": app.globalData.openId,
        "tidy_worker_id": app.globalData.worker_id,
      }).then(res=>{
        if(res.statusCode && res.data.code==200){
          wx.showToast({
            title: '已调整排队信息',
            icon:'none'
          })
        }else{
          wx.showToast({
            title: res.data.err,
            icon:'none'
          })
        }
        _this.workerQueueList()
      }).catch(err=>{
      })
    },
    // 弃号
    giveUp(queue_id){
      let _this = this
      $api.giveUp({
        "openid": app.globalData.openId,
        "queue_id": queue_id
      }).then(res=>{
        if(res.statusCode==200 && res.data.code==200){
          wx.showToast({
            title: '已删除',
          })
          _this.workerQueueList()
        }else{
          wx.showToast({
            title: res.data.err,
            icon: 'error'
          })
        }
      })
    },
    // 开始服务 // 结束服务
    startServe(e){
      let _this = this
      let queue_id = e.currentTarget.dataset.id
      let mobile = e.currentTarget.dataset.mobile
      let submobile
      if(mobile){
        submobile= mobile.toString().substr(-4)
      }
      this.setData({
        queue_id:queue_id
      })
      let statusCode = e.currentTarget.dataset.status
      console.log(statusCode);
      if(statusCode == 170){
        // 正在排队 点击这个相当于开始服务
        // 这里应该来个showtoast  让员工确认已经可以开始服务了
        Dialog.confirm({
          message: `确认尾号 ${submobile} 的客户可以开始服务？`,
        }).then(() => {
          // on confirm
          console.log('可以开始');
          $api.startServe({
            "openid": app.globalData.openId,
            "queue_id": queue_id
          }).then(res=>{
            if(res.statusCode==200 && res.data.code==200){
              wx.showToast({
                title: '已叫号',
                icon: 'success'
              })
              // 这里需要再重新请求列表
              _this.workerQueueList()
            }else{
              wx.showToast({
                title: res.data.err,
                icon: 'none'
              })
              _this.workerQueueList()
            }
          })
        })
        .catch(() => {
          console.log('取消');
        });
      }else if(statusCode == 173){
        // 这个相当于让客户去付款
        this.setData({
          letPaymentShow:true
        })
        return false
      }
    },
    onChangeTab(e){
      console.log(e);
      let name = e.detail.name //从0开始的
      this.setData({
        active: name
      })
      this.workerQueueList()
    },
    onChangePay(e){
      this.setData({
        modalValue : e.detail
      })
    },
    descChange(e){
      this.setData({
        modelDesc : e.detail
      })
    },
    makeUserPayCancel(){
      this.setData({
        letPaymentShow: false
      })
    },
    letPaymentShowbeforeClose(){
      let _this = this
      if(!this.data.modalValue){
        wx.showToast({
          title: '请填写消费金额',
          icon:'none'
        })
        return false
      }
      if(isNaN(parseFloat(this.data.modalValue))){
        wx.showToast({
          title: '请填写消费金额,只需填写数字',
          icon:'none'
        })
        return false
      }else{
        $api.queueOrderSubmit({
          openid: app.globalData.openId,
          "queue_id": this.data.queue_id,
          "change_price":parseFloat(this.data.modalValue),
          "remark":""
        }).then(res=>{
          if(res.statusCode==200 && res.data.code==200){
            this.setData({
              modalShow: false,
              modalValue:0
            })
            wx.showToast({
              title:'请让顾客在完成订单列表支付',
              icon:'none'
            })
            _this.setData({
              letPaymentShow: false,
              modalValue:'',
              modelDesc:''
            })
             // 这里需要再重新请求列表
            _this.workerQueueList()
          }else{
            wx.showToast({
              title:res.data.err || '操作出错',
              icon:'none'
            })
          }
        })
        return false
      }
    },
    //获取员工端订单列表
    workerQueueList(){
      // 下边的参数上线时要改成真实数据
      $api.workerQueueList({
        "openid": app.globalData.openId,
        "tidy_worker_id":app.globalData.worker_id,
        tap_type: Number(this.data.active)
      }).then(res=>{
        if(res.statusCode == 200 && res.data.code == 200){
          let copyData = []
          let resData
          if(res.data.data){
            let data = res.data.data
            let arr = []
            let nouserArrObj = {}
            let nouserArr = []
            data.map((e,i)=>{
              if(e.is_today && e.is_today==1){
                this.setData({
                  todayData: e.date,
                  todayDataList: e.list
                })
              }
              if(e.list && e.list.length){
                e.list.map(s=>{
                  if(i==0){
                    // 说明是第一天的数据 或者是有数据的那天 比如昨天的数据还存在 那么数组第一个就是昨天的数据 
                    s.first = true
                  }
                  if(s.type!==0){
                    arr.push(s)
                  }else{
                    if(i==0){
                      nouserArr.push(s)
                    }
                    nouserArrObj[e.date]  = nouserArr
                  }
                })
              }
              // if(e.type!==0){
              //   arr.push(e)
              // }else{
              //   nouserArr.push(e)
              // }
            })
            this.setData({
              nouserArr:nouserArr,
              nouserArrObj: nouserArrObj
            })
            resData = JSON.parse(JSON.stringify(arr))
            console.log(resData);
          }
          // for (let index = 0; index < resData.length; index++) {
          //   const element = resData[index];
          //   element.sortNum = index
          //   // for (const key in itemObj) {
          //   //   if (Object.hasOwnProperty.call(itemObj, key)) {
          //   //     element[key] = itemObj[key]
          //   //   }
          //   // }
          // }
          this.setData({
            optionsListData: resData,
            has_next:false,
            move_type:''
          })
        }
      })
    },
    // drawImg: function () {
    //   console.log(this.data.codeText);
    //   var imgData = QR.drawImg(this.data.codeText, {
    //     typeNumber: 4,
    //     errorCorrectLevel: 'M',
    //     size: 500
    //   })
    //   this.setData({
    //     qrcodeURL: imgData
    //   })
    // },
    // 二维码支付
    shouQrCode(e){
      let _this = this
      let list_id = e.currentTarget.dataset.list_id
      Dialog.confirm({
        title: '警告',
        message: '其他支付条件不能使用时才能选择二维码支付，确定使用？',
      })
        .then(() => {
          // on confirm
          $api.showQrCode({
            "openid": app.globalData.openId,
            "list_id":list_id,
          }).then(res=>{
            console.log(res);
            if(res.statusCode == 200 && res.data.code == 200){
              let  imgData = QR.drawImg(res.data.data.url, {
                typeNumber: 4,
                errorCorrectLevel: 'M',
                size: 500
              })
              console.log(imgData);
              _this.setData({
                showQrCodeBox: true,
                qrCodeUrl: imgData
              })
            }
          })
        })
        .catch(() => {
          // on cancel
        });
    },
    paymentYet(){
      this.setData({
        showQrCodeBox: false
      })
      setTimeout(() => {
        this.workerQueueList()
      }, 300);
    }
  }
})