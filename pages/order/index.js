let app = getApp();
const $api = require('../../utils/request').API;
Component({
  data: {
    activeTab: 0,
    triggered: false,
    payData:{},
    timeStamp:'',
    orderList:[]
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      this.getOrder()
    }
  },
  methods:{
    //下拉刷新
    onRefresh() {
      if (this._freshing) return
      this._freshing = true
      setTimeout(() => {
        this.setData({
          triggered: false,
        })
        this.getOrder()
        this._freshing = false
      }, 3000)
    },
    onPulling(e) {
      console.log('onPulling:', e)
    },
    onRestore(e) {
      console.log('onRestore:', e)
    },
    onAbort(e) {
      console.log('onAbort', e)
    },
    //获取订单列表
    getOrder(){
      $api.orderShow({
        openid:app.globalData.openId,
        tap_type:this.data.activeTab+1
      }).then(res=>{
        console.log(res);
        if(res.statusCode==200 && res.data.code === 200){
          for (let index = 0; index <  res.data.data.length; index++) {
            const element =  res.data.data[index];
            if(element.wait_time){
              element.wait_time = parseInt(element.wait_time/60)
            }
          }
          this.setData({
            orderList: res.data.data
          })
        }else{
          wx.showToast({
            title: '获取数据出错，请重试',
            icon: 'error'
          })
        }
      })
    },
    // 支付
    payment(e){
      let queue_id = e.currentTarget.dataset.listid-0
      // 上线需要改成正确id
      $api.orderPaydata({
        "openid": app.globalData.openId,
        "queue_id": queue_id
      }).then(res=>{
        console.log(res)
        if(res.statusCode == 200 && res.data.code == 200){
          this.setData({
            payData:res.data.data.jsApiParams,
            timeStamp:res.data.timestamp
          })
          wx.requestPayment(
            {
            "appId":this.data.payData.jsApiParameters.appId,
            "timeStamp":this.data.payData.jsApiParameters.timeStamp,
            "nonceStr": this.data.payData.jsApiParameters.nonceStr,
            "package": this.data.payData.jsApiParameters.package,
            "signType": "HMAC-SHA256",
            "paySign": this.data.payData.jsApiParameters.paySign,
            "success":function(res){
              console.log(res);
              //需要重新获取列表信息
            },
            "fail":function(res){
              console.log(res);
            },
            "complete":function(res){}
            })
        }else{
          wx.showToast({
            title: res.data.err||'调起支付出错，请重试',
            icon:'error'
          })
        }
      })
    },
    onChange(event) {
      this.setData({
        activeTab: event.detail.name,
      });
      console.log('onChange');
      this.getOrder()
    },
    cancelServe(e){
      let _this = this
      wx.showModal({
        title: '确认取消排队？',
        content: '确认取消排队后，此号将作废',
        success (res) {
          if (res.confirm) {
            let orderId = e.currentTarget.dataset.listid
            $api.cancelServe({
              "openid": app.globalData.openId,
              "queue_id": orderId
            }).then(e=>{
              if(e.statusCode==200 && e.data.code==200){
                wx.showToast({
                  title: '已取消排队',
                })
                _this.getOrder()
              }
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }
  },
})