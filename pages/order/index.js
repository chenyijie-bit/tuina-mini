let app = getApp();
const $api = require('../../utils/request').API;
Component({
  data: {
    payOk:false,
    activeTab: '1',
    loading: true,
    // triggered: false,
    payData:{},
    timeStamp:'',
    orderList:[],
    showCouponList: false,
    currentListId:'',
    // 关闭切换优惠券功能
    getAllCoupon:true,
    couponsList:[],
    couponsDefault:{},
    typeRadio:'',
    payDialogShow:false
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
          this.getTabBar().setData({
            selected: 1
          })
        }
        this.setData({
          activeTab: '1'
        })
       if(!app.globalData.openId){
        setTimeout(()=>{
          this.getOrder()
        },500)
      }else{
        this.getOrder()
      }
    }
  },
  methods:{
    // 去评价
    gotopingjia(e){
      let queue_id = e.currentTarget.dataset.orderid-0
      wx.setStorageSync('pingjiaid', queue_id)
      wx.navigateTo({
        url: '../qupingjia/index',
      })
    },
    //下拉刷新
    // onRefresh() {
    //   if (this._freshing) return
    //   this._freshing = true
    //   setTimeout(() => {
    //     this.setData({
    //       triggered: false,
    //     })
    //     this.getOrder()
    //     this._freshing = false
    //   }, 3000)
    // },
    // onPulling(e) {
    // },
    // onRestore(e) {
    // },
    // onAbort(e) {
    // },
    //获取所有优惠券
    getCoupontsAll(){
      let list = app.globalData.couponsList
      this.setData({
        showCouponList: true,
        couponsList: list,
        getAllCoupon:false
      })
    },
    // 获取优惠券
    getCouponts(e){
      let shouldPay = parseFloat(e.currentTarget.dataset.shijiprice) || parseFloat(e.currentTarget.dataset.price)
      let listid = e.currentTarget.dataset.listid
      this.setData({
        showCouponList: true,
        currentListId : listid
      })
      let coupons = this.data.couponsList
      let getcouponBox = []
      coupons.map(e=>{
        if(e.type == 3){
          if(e.can_use === '1'){
            if(parseFloat(e.price) <= shouldPay){
              getcouponBox.push(e)
            }
          }
        }else{
          if(parseFloat(e.price) <= shouldPay){
            getcouponBox.push(e)
          }
        }
      })
      this.setData({
        couponsList: getcouponBox
      })
    },
    closeCouponSheet(){
      this.setData({
        showCouponList:false,
        getAllCoupon: true
      })
    },
    onChangeCouponsId(e){
      let _this = this
      let changedId = e.detail
      for (let index = 0; index < this.data.couponsList.length; index++) {
        const element = this.data.couponsList[index];
        if(element.coupon_id == changedId){
          this.setData({
            typeRadio: changedId,
            couponsDefault:element
          })
          setTimeout(() => {
            this.setData({
              typeRadio: '',
            })
          }, 500);
        }
      }
      let datalist = this.data.orderList
      datalist.map(e=>{
        if(e.list_id == _this.data.currentListId){
          e.couponId = changedId
          e.couponObj = _this.data.couponsDefault
        }
      })
      this.setData({
        showCouponList : false,
        orderList : datalist
      })
    },
    //获取订单列表
    getOrder(){
      let _this = this
      this.setData({
        loading: true
      })
      this.setData({
        couponsDefault: {},
        typeRadio: ''
      })
      $api.orderShow({
        openid: app.globalData.openId,
        tap_type: Number(this.data.activeTab)
      }).then(res=>{
        this.setData({
          loading: false
        })
        if(res.statusCode==200 && res.data.code === 200){
          let resList = res.data.data.list
          let coupons = res.data.data.coupons
          if(coupons && coupons.length){
            coupons.map(e=>{
              e.priceNum = e.price ? parseFloat(e.price) : 0
            })
            this.setData({
              couponsList: coupons
            })
            app.globalData.couponsList = coupons
            coupons.map(e=>{
              // if(e.is_default === 1){
              //   this.setData({
              //     couponsDefault: e,
              //     typeRadio: e.coupon_id
              //   })
              // }
            })
            // if(!_this.data.couponsDefault){
            //   this.setData({
            //     typeRadio: coupons[0].coupon_id,
            //     couponsDefault: coupons[0]
            //   })
            // }
          }
          for (let index = 0; index <  resList.length; index++) {
            const element =  resList[index];
            if(element.wait_time){
              element.wait_time = parseInt(element.wait_time/60)
            }
            if(element.order.pay_price){
              element.order.pay_price = parseFloat(element.order.pay_price)
            }
            if(element.status == 170){
              //正在排队中 可以取消
              element.statusCusStr = '取消排号'
            }else if(element.status == 173){
              // 正在服务中
              element.statusCusStr = '服务中'
            }else if(element.status == 175){
              // 待支付
              element.statusCusStr = '支付'
            }
          }
          if(this.data.activeTab != '1'){
            resList.reverse()
          }
          this.setData({
            orderList: resList
          })
        }else{
          wx.showToast({
            title: '获取数据出错，请重试',
            icon: 'error'
          })
        }
      })
    },
    //获取是否支付成功
    getOrder2(no){
      let _this = this
      $api.orderShow({
        openid: app.globalData.openId,
        // tap_type: Number(this.data.activeTab)
        tap_type: 2
      }).then(res=>{
        if(res.statusCode==200 && res.data.code === 200){
          for (let index = 0; index <  res.data.data.list.length; index++) {
            const element =  res.data.data[index];
            // if(element.wait_time){
            //   element.wait_time = parseInt(element.wait_time/60)
            // }
          }
          if(res.data.data.list && res.data.data.list.length){
            res.data.data.list.map(e=>{
              if(e.order.no == no){
                if(e.order.is_pay == 1){
                  // 说明成功了
                  this.setData({
                    payOk:true,
                    // orderList:[],
                    activeTab: '2'
                  })
                  _this.getOrder()
                  wx.showToast({
                    title: '支付成功'
                  })
                }
              }
            })
          }
          this.setData({
            orderList: res.data.data
          })
        }else{
          wx.showToast({
            title: '获取支付数据出错，请重试',
            icon: 'error'
          })
        }
      })
    },
    
    
    onChange(event) {
      this.setData({
        activeTab: event.detail.name,
      });
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
          }
        }
      })
    },
    // 支付或者取消排队
    cancelServeOrpayment(e){
      let _this = this
      let status = e.currentTarget.dataset.status
      if(status == 170){
        //正在排队中 可以取消
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
            }
          }
        })
      }else if(status == 173){
        // 正在服务中 不可取消 显示的是服务中
        wx.showToast({
          title: '提示店员收款即可付款',
          icon:'none'
        })
      }else if(status == 175){
        // 待支付 // 支付
        let queue_id = e.currentTarget.dataset.listid-0
        let no = e.currentTarget.dataset.no
        let obj = e.currentTarget.dataset.obj
        let reqObj = {}
        if(obj){
          if(obj.user_coupon_id){
            reqObj.user_coupon_id = obj.user_coupon_id
          }else{
            reqObj.coupon_id = obj.coupon_id
          }
        }
        let defaultObj = {
          "openid": app.globalData.openId,
          "queue_id": queue_id,
        }
        // 上线需要改成正确id
        $api.orderPaydata({...defaultObj,...reqObj}).then(res=>{
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
                //需要重新获取列表信息
                // wx.showToast({
                //   title: '支付成功'
                // })
                let index = 1
                let interval  = setInterval(() => {
                  index++
                  _this.getOrder2(no)
                  if(_this.data.payOk){
                    clearInterval(interval)
                    return false
                  }
                  if(index>5){
                    clearInterval(interval)
                    wx.showToast({
                      title: '支付可能出错请联系工作人员',
                      icon:'none'
                    })
                  }
                }, 1500);
                // no: "AM2021060618011355176"
              },
              "fail":function(res){
              },
              "complete":function(res){}
              })
          }else{
            wx.showToast({
              title: res.data.err||'调起支付出错，请重试',
              icon:'none'
            })
          }
        })
      }
    }
  },
})