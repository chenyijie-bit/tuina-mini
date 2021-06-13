
let app = getApp();
const $api = require('../../utils/request').API;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Component({
  data: {
    active: 0,
    showDialog: false,
    optionsListData:[], //订单列表数据
    letPaymentShow: false,
    modalValue:'',// 消费金额
    modelDesc:'' // 备注
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
    onClose(event) {
      const { position, instance } = event.detail;
      switch (position) {
        case 'left':
        case 'cell':
          instance.close();
          break;
        case 'right':
          // this.setData({
          //   showDialog:true
          // })
          Dialog.confirm({
            message: '确定删除吗？',
          }).then(() => {
            instance.close();
          });
          break;
      }
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
          // on cancel
          console.log('取消');
        });
      }else if(statusCode == 173){
        // 这个相当于让客户去付款
        this.setData({
          letPaymentShow:true
        })
        return false
      }
      // this.setData({
      //   statusMsg : e.currentTarget.dataset.status
      // })
      // if(this.data.statusMsg == '正在按摩'){
      //   this.setData({
      //     modalShow:true
      //   })
      //   return false
      // }
      
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
    // 让顾客支付
    // letPaymentShowbeforeClose = (action) => new Promise((resolve) => {
    //   setTimeout(() => {
    //     if (action === 'confirm') {
    //       resolve(true);
    //     } else {
    //       // 拦截取消操作
    //       resolve(false);
    //     }
    //   }, 1000);
    // }),
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
        "tidy_worker_id":app.globalData.worker_id
        // "openid": '',
        // "tidy_worker_id":3
      }).then(res=>{
        if(res.statusCode == 200 && res.data.code == 200){
          //上线要改成真是数据
          let copyData = []
          let resData
          if(res.data.data){
            let data = res.data.data
            let arr = []
            let nouserArr = []
            data.map(e=>{
              if(e.type!==0){
                arr.push(e)
              }else{
                nouserArr.push(e)
              }
            })
            this.setData({
              nouserArr:nouserArr
            })
            resData = JSON.parse(JSON.stringify(arr))
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
    }
  }
})