let app = getApp();
const $api = require('../../utils/request').API;
Component({
  data: {
    activeTab: 0,
    payData:{},
    timeStamp:''
  },
  methods:{
    // 支付
    payment(){
      $api.orderPaydata({
        "openid": app.globalData.openId,
        "queue_id": "73"
      }).then(res=>{
        console.log(res)
        if(res.statusCode == 200 && res.data.code == 200){
          this.setData({
            payData:res.data.data.jsApiParams,
            timeStamp:res.data.timestamp
          })
          let packageStr = `prepay_id=${this.data.payData.prepay_id}`
          console.log(this.data.timeStamp+'');
          wx.requestPayment(
            {
            "timeStamp":this.data.timeStamp+'',
            "nonceStr": this.data.payData.nonce_str,
            "package": packageStr,
            "signType": "MD5",
            "paySign": this.data.payData.sign,
            "success":function(res){
              console.log(res);
            },
            "fail":function(res){},
            "complete":function(res){}
            })
        }else{
          wx.showToast({
            title: '调起支付出错，请重试',
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
    }
    
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    }
  }
})