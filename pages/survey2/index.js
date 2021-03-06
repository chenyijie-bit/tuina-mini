let app = getApp();
const $api = require('../../utils/request').API;
Component({
  data: {
    showReview:true,
    activeTab: 0,
    triggered: false,
    modalShow:false,
    statusMsg:'',
    queue_id:'',
    ///拖拽
    dragImgUrl:'../../assess/images/drag.png',
    optionsListData:[],
    modalValue:'',
    movableViewPosition:{
        x:0,
        y:0,
        className:"none",
        data:{
          icon_type:1,
          is_complete:true
        }
    },
    nouserArr:[],
    scrollPosition:{
      //每个数据的高度 已经加上了marginbottom
        everyOptionCell:136,
        top:0,
        scrollTop:0,
        scrollY:true,
        scrollViewHeight:1334,
        scrollViewWidth:375,
        windowViewHeight:1334,
    },
    selectItemInfo:{
        title:"",
        address:"",
        desc:"",
        selectIndex: -1,
        selectPosition:0,
    },
    flag:0,
    show_assistant:true,
    animation_flag:'',
    // page:0,
    has_next:true,
    isShow: false,
    move_type:'',
    user:{
        headimgurl:'https://avatars2.githubusercontent.com/u/24517605?s=460&v=4',
        expected_birth_week:'拖拽排序+左滑删除'
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
      this.workerQueueList()


      /////拖拽

      var systemInfo= wx.getSystemInfoSync();
      // 开始加载页面
      var scrollViewHeight = systemInfo.windowHeight;
      var scrollViewWidth = systemInfo.windowWidth;
      this.setData({
          'scrollPosition.scrollViewWidth':scrollViewWidth,
          'scrollPosition.scrollViewHeight':scrollViewHeight,
          'scrollPosition.windowViewHeight':systemInfo.windowHeight,
      });
    }
  },
  methods:{
    reviewBut(){
      this.setData({
        showReview: false
      })
      wx.showToast({
        title: '已是最新数据',
      })
      this.workerQueueList()
     setTimeout(() => {
       this.setData({
         showReview: true
       })
     }, 3000);
    },
    getValue(e){
      let data = e.detail.value
      this.setData({
        modalValue:data
      })
      if(isNaN(parseInt(data))){
        wx.showToast({
          title: '消费金额只需填写数字',
          icon:'none'
        })
        return false
      }
    },
    modalCancel(){
      this.setData({
        modalShow: false,
        modalValue:0
      })
    },
    modalConfirm(){
      let _this = this
      if(isNaN(parseFloat(this.data.modalValue))){
        wx.showToast({
          title: '消费金额只需填写数字',
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
    // 打电话
    makePhone(e){
      let phoneNumber = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
      })
    },
    // 弃号
    giveUp(e){
      let queue_id = e.currentTarget.dataset.id
      $api.giveUp({
        "openid": app.globalData.openId,
        "queue_id": queue_id
      }).then(res=>{
        if(res.statusCode==200 && res.data.code==200){

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
      this.setData({
        queue_id:queue_id
      })
      this.setData({
        statusMsg : e.currentTarget.dataset.status
      })
      if(this.data.statusMsg == '正在按摩'){
        this.setData({
          modalShow:true
        })
        return false
      }
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
            icon: 'error'
          })
        }
      })
    },
    
    //获取员工端订单列表
    workerQueueList(){
      // 下边的参数上线时要改成真实数据
      $api.workerQueueList({
        "openid": app.globalData.openId,
        "tidy_worker_id":app.globalData.worker_id
        // "openid": '',
        // "tidy_worker_id":2
      }).then(res=>{
        if(res.statusCode == 200 && res.data.code == 200){
          //上线要改成真是数据
          let copyData = []
          let itemObj = {"icon_type":1,"is_complete":false,"show_delet":false,"selectClass":"","url":"","is_extend":false}
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
          for (let index = 0; index < resData.length; index++) {
            const element = resData[index];
            element.sortNum = index
            for (const key in itemObj) {
              if (Object.hasOwnProperty.call(itemObj, key)) {
                element[key] = itemObj[key]
              }
            }
          }
          this.setData({
            optionsListData: resData,
            has_next:false,
            move_type:''
          })
        }
      })
    },
    //下拉刷新
    onChange(event) {
      this.setData({
        activeTab: event.detail.name,
      });
    },

    /////拖拽  ---start
    longpressfuc:function(e){
      var movableViewPosition={
          x:0,
          y:0,
          className:"none",
          data:{
            icon_type:1,
            is_complete:true
          }
      };
      this.setData({
        movableViewPosition:movableViewPosition
      })
      this.scrollTouchStart(e);
    },
    bindscroll:function (event) {
      var scrollTop = event.detail.scrollTop;
      this.setData({
          'scrollPosition.scrollTop':scrollTop
      })
    },
      getOptionInfo:function (queue_id) {
          for(var i=0,j=this.data.optionsListData.length;i<j;i++){
              var optionData= this.data.optionsListData[i];
              if(optionData.id == queue_id){
                  optionData.selectIndex = i;
                  return optionData;
              }
          }
          return {};
      },
      getPositionDomByXY:function (potions) {
          var y = potions.y-this.data.scrollPosition.top+this.data.scrollPosition.scrollTop-120;
          var optionsListData = this.data.optionsListData;
          var everyOptionCell = this.data.scrollPosition.everyOptionCell;
          for(var i=0,j=optionsListData.length;i<j;i++){
              if(y>=i*everyOptionCell&&y<(i+1)*everyOptionCell){
                  return optionsListData[i];
              }
          }
          return optionsListData[0];
      },
      draggleTouch:function (event) {
          var touchType = event.type;
          switch(touchType){
              case "touchstart":
                  this.scrollTouchStart(event);
                  break;
              case "touchmove":
                  this.scrollTouchMove(event);
                  break;
              case "touchend":
                  this.scrollTouchEnd(event);
                  break;
          }
      },
      scrollTouchStart:function (event) {
          var that=this;
          var firstTouchPosition = {
              x:event.changedTouches[0].pageX,
              y:event.changedTouches[0].pageY,
          }
          var domData = that.getPositionDomByXY(firstTouchPosition);
          domData.show_delet = false;
          // 排序时禁止已完成card移动------start--------
          if(that.data.move_type != 'reset_status' && domData.is_complete){
            that.setData({
              movableViewPosition:{
                  x:0,
                  y:0,
                  className:"none",
                  data:{
                    icon_type:1,
                    is_complete:true
                  }
              }
            })
            return false;
          }
          // 排序时禁止已完成card移动------end--------
          //movable-area滑块位置处理
          var movableX = 0;
          var movableY = firstTouchPosition.y-that.data.scrollPosition.top-that.data.scrollPosition.everyOptionCell/2;
          that.setData({
              movableViewPosition:{
                  x:movableX,
                  y:movableY,
                  className:"none",
                  data:domData
              }
          })
  
          setTimeout(function(){
            that.setData({
                movableViewPosition:{
                    x:movableX,
                    y:movableY,
                    className:"",
                    data:domData
                }
            })
          },10)
          var queue_id = domData.id;
          var secInfo = that.getOptionInfo(queue_id);
          secInfo.selectPosition =  event.changedTouches[0].clientY;
          secInfo.selectClass = "dragSelected";
          that.data.optionsListData[secInfo.selectIndex].selectClass = "dragSelected";
          var optionsListData = that.data.optionsListData;
          that.setData({
              'scrollPosition.scrollY':false,
              selectItemInfo:secInfo,
              optionsListData:optionsListData,
              'scrollPosition.selectIndex':secInfo.selectIndex
          })
      },
      scrollTouchMove:function (event) {//频繁setdata导致性能问题，页面拖动卡顿
          var that=this;
          var selectItemInfo = that.data.selectItemInfo;
          var selectPosition = selectItemInfo.selectPosition;
          var moveDistance   = event.changedTouches[0].clientY+81;
          var everyOptionCell = that.data.scrollPosition.everyOptionCell;
          var optionsListData = that.data.optionsListData;
          var selectIndex = selectItemInfo.selectIndex;
          //movable-area滑块位置处理
          var movableX = 0;
          var movableY = event.changedTouches[0].pageY-that.data.scrollPosition.top-that.data.scrollPosition.everyOptionCell/2;
          that.setData({
              movableViewPosition:{
                  x:movableX,
                  y:movableY,
                  className:"",
                  data:that.data.movableViewPosition.data
              }
          })
          if(moveDistance - selectPosition > 0 && selectIndex < optionsListData.length - 1){
              if (optionsListData[selectIndex].id == selectItemInfo.id) {
                  optionsListData.splice(selectIndex, 1);
                  optionsListData.splice(++selectIndex, 0, selectItemInfo);
                  selectPosition += everyOptionCell;
              }
          }
          if (moveDistance - selectPosition < 0 && selectIndex > 0) {
              if (optionsListData[selectIndex].id == selectItemInfo.id) {
                  optionsListData.splice(selectIndex, 1);
                  optionsListData.splice(--selectIndex, 0, selectItemInfo);
                  selectPosition -= everyOptionCell;
              }
          }
          that.setData({
              'selectItemInfo.selectPosition': selectPosition,
              'selectItemInfo.selectIndex': selectIndex,
              optionsListData: optionsListData,
          });
  
      },
      scrollTouchEnd:function (event) {
          var that=this;
          var optionsListData = that.optionsDataTranlate(that.data.optionsListData,"");
          that.setData({
              optionsListData:optionsListData,
              'scrollPosition.scrollY':true,
              'movableViewPosition.className':"none",
              'movableViewPosition.is_complete':true
          })
          var movableViewPosition={
              x:0,
              y:0,
              className:"none",
              data:{
                icon_type:1,
                is_complete:true
              }
          };
          if(that.data.move_type != 'reset_status'){
              that.setData({
                movableViewPosition:movableViewPosition
              })
              var selectItemInfo = that.data.selectItemInfo;
              for(let i=0;i<optionsListData.length;i++){
                if(selectItemInfo.id == optionsListData[i].id){
                    if(optionsListData[i].sortNum == i){//原有顺序=当前顺序，未改变位置
                      return false;
                    }
                    var relation_id='';
                    if(i == 0){//移动后处于首位，上移
                      relation_id=optionsListData[i+1].id;
                      that.updateList(selectItemInfo.id,'reset_weight_up',relation_id);
                      return false;
                    }
                    if(i == (optionsListData.length - 1) ){//移动后处于末尾位，下移
                      relation_id=optionsListData[i-1].id;
                      that.updateList(selectItemInfo.id,'reset_weight_down',relation_id);
                      return false;
                    }
  
                    var pre_num=optionsListData[i-1].sortNum;//上一条数据初始顺序
                    var curr_num=optionsListData[i].sortNum;//移动数据初始顺序
                    if(pre_num > curr_num){ //下移
                      relation_id=optionsListData[i-1].id;
                      that.updateList(selectItemInfo.id,'reset_weight_down',relation_id);
                    }else{//上移
                      relation_id=optionsListData[i+1].id;
                      that.updateList(selectItemInfo.id,'reset_weight_up',relation_id);
                    }
                }
              }
              
          }else{
            that.setData({
              movableViewPosition:movableViewPosition
            })
          }
      },
      optionsDataTranlate:function (optionsList,selectClass) {
          for(var i=0,j=optionsList.length;i<j;i++){
              optionsList[i].selectClass = selectClass;
          }
          return optionsList;
      },
      scrolltolower:function(){
        var that =this;
        if(that.data.has_next ){
          if(that.data.has_next){
            that.workerQueueList();
          }
        }
      },
      handletouchmove: function(event) {
        var that=this;
        if (that.data.flag!== 0){
          return
        }
        let currentX = event.touches[0].pageX;
        let currentY = event.touches[0].pageY;
        let tx = currentX - that.data.lastX;
        let ty = currentY - that.data.lastY;
        // let text = "";
        //左右方向滑动
        if (Math.abs(tx) > Math.abs(ty)) {
          let scrollPosition=that.data.scrollPosition;
          scrollPosition.scrollY = false;
          that.setData({
            scrollPosition:scrollPosition
          })
          if (tx < -80 && (ty <= 50 && ty >= -50)) {
            // text = "向左滑动";
            that.data.flag= 1;
            if(that.data.swiper_index != undefined){
              let index = that.data.swiper_index;
              let optionsListData = that.data.optionsListData;
              for(let i=0;i<optionsListData.length;i++){
                optionsListData[i].show_delet=false;
              }
              optionsListData[index].show_delet=true;
              that.setData({
                  optionsListData:optionsListData
              });
            }
            let scrollPosition=that.data.scrollPosition;
            scrollPosition.scrollY = true;
            that.setData({
              scrollPosition:scrollPosition
            })
          }
          else if (tx > 80 && (ty <= 50 && ty >= -50)) {
            // text = "向右滑动";
            that.data.flag= 2;
            if(that.data.swiper_index != undefined){
              let index = that.data.swiper_index;
              let optionsListData = that.data.optionsListData;
              optionsListData[index].show_delet=false;
              that.setData({
                  optionsListData:optionsListData
              });
            }
            let scrollPosition=that.data.scrollPosition;
            scrollPosition.scrollY = true;
            that.setData({
              scrollPosition:scrollPosition
            })
          }
        }else{
          let scrollPosition=that.data.scrollPosition;
          scrollPosition.scrollY = true;
          that.setData({
            scrollPosition:scrollPosition
          })
        }
        //将当前坐标进行保存以进行下一次计算
        // this.data.lastX = currentX;
        // this.data.lastY = currentY;
      },
     
      handletouchstart:function(event) {
        var that=this;
        that.data.lastX = event.touches[0].pageX;
        that.data.lastY = event.touches[0].pageY;
        if(event.currentTarget.dataset.index != undefined){
          that.setData({
            swiper_index:event.currentTarget.dataset.index
          })
        }
      },
      fadeoutBox:function(e){
        var that=this,
            index=e.currentTarget.dataset.index;
        let optionsListData = that.data.optionsListData;
        optionsListData[index].show_delet=false;
        that.setData({
            optionsListData:optionsListData
        });
      },
      handletouchend:function(event) {
        var that=this;
        that.data.flag= 0 ;
        let scrollPosition=that.data.scrollPosition;
        scrollPosition.scrollY = true;
        that.setData({
          scrollPosition:scrollPosition
        })
      },
      toggleAssistant:function(){
        var that=this;
        that.setData({
          show_assistant:!that.data.show_assistant
        })
      },
      updateList:function(id,operate,relation_id){
        let _this = this
        // id// 是一栋的元素  12
        // relation_id//是一栋到一栋元素旁的元素  15
        // operate ’reset_weight_down‘  ’reset_weight_uP‘  // 将元素12一栋到15下 或者上
        let dataList = this.data.optionsListData
        let yidong  = ''
        let beidong  = ''
        dataList.map((e,i)=>{
          if(e.id == id){
            yidong = i
          }
          if(e.id == relation_id){
            beidong = i
          }
        })
        if(operate === "reset_weight_down"){
          let resTime = dataList[beidong].et
          let yidongTime  = Number(resTime)+2200
          let yidongEndTime  = Number(yidongTime)+1800
          // resTime = resTime.split(' ')[1]
          this.setData({
            ['optionsListData['+yidong+'].st']: yidongTime+'',
            ['optionsListData['+yidong+'].et']: yidongEndTime+''
          })
        }else{
          let resTime = dataList[beidong].st
          let yidongTime  = Number(resTime) - 2200+''
          let yidongEndTime  = Number(yidongTime)+1800+''
          this.setData({
            ['optionsListData['+yidong+'].st']: yidongTime,
            ['optionsListData['+yidong+'].et']: yidongEndTime
          })
        }
        let datas = []
        this.data.optionsListData.map(e=>{
          if(e.status_msg != '正在按摩'){
            datas.push(e)
          }
        })
        this.setData({
          optionsListData: datas
        })
        let arr22 = this.data.nouserArr
        $api.workerQueueSet({
          list:[...this.data.optionsListData,...arr22],
          "openid": app.globalData.openId,
          "tidy_worker_id": app.globalData.worker_id,
        }).then(res=>{
          if(res.statusCode && res.data.code==200){
            wx.showToast({
              title: '已调整排队信息',
              icon:'none'
            })
             // 这里需要再重新请求列表
            _this.workerQueueList()
          }else{
            wx.showToast({
              title: res.data.err,
              icon:'none'
            })
          }
          _this.workerQueueList()
        }).catch(err=>{
        })
        // for (let index = 0; index < dataList.length; index++) {
        //   const element = dataList[index];
        //   element.sortNum = index
        // }
      },
      confirmEvent:function(){
        var that=this;
        that.hidedialog();
        that.updateList(that.data.deletItem_id,'disable');
      },
      preventD:function(){
  
      },
      showdialog:function(){
        var that=this;
        that.setData({
          isShow: true
        })
      },
      hidedialog:function(){
        var that=this;
        that.setData({
          isShow: false
        })
      },
      
      toggleDelet:function(e){
        var that=this,
            optionsListData=that.data.optionsListData,
            index=parseInt(e.currentTarget.dataset.index);
        if(optionsListData[index].show_delet){
          optionsListData[index].show_delet=false;
        }else{
          for(let i=0;i<optionsListData.length;i++){
            optionsListData[i].show_delet=false;
          }
          optionsListData[index].show_delet=true;
        }
        that.setData({
          optionsListData:optionsListData
        })
      },
      goMap:function(e){
        var that=this,
            optionsListData=that.data.optionsListData,
            index=e.currentTarget.dataset.index;
        if(optionsListData[index].latitude && optionsListData[index].latitude != null){
          wx.openLocation({
            latitude: optionsListData[index].latitude,
            longitude: optionsListData[index].longitude,
            scale: 14,
            name: optionsListData[index].name,
            address: optionsListData[index].address
          })
        }
      },



    /////拖拽  ---end
    
    
  }
  
})