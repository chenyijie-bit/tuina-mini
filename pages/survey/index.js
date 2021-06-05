let app = getApp();
const $api = require('../../utils/request').API;
Component({
  data: {
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
      this.workerQueueShow()


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
    getValue(e){
      console.log(e)
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
      console.log(this.data.modalValue)
      if(isNaN(parseInt(this.data.modalValue))){
        wx.showToast({
          title: '消费金额只需填写数字',
          icon:'none'
        })
        return false
      }else{
        $api.queueOrderSubmit({
          // openid: app.globalData.openId,
          openid: 'test2',
          "queue_id": this.data.queue_id,
          "change_price":parseInt(this.data.modalValue),
          "remark":""
        }).then(res=>{
          console.log(res);
          if(res.statusCode==200 && res.code==200){
            this.setData({
              modalShow: false,
              modalValue:0
            })
            wx.showToast({
              title:'请让顾客在完成订单列表支付',
              icon:'none'
            })
             // 这里需要再重新请求列表
            _this.workerQueueShow()
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
      console.log(e);
      let queue_id = e.currentTarget.dataset.id
      $api.giveUp({
        "openid": "test2",
        "queue_id": queue_id
      }).then(res=>{
        console.log(res);
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
        "openid": "test2",
        "queue_id": queue_id
      }).then(res=>{
        console.log(res);
        if(res.statusCode==200 && res.data.code==200){
          wx.showToast({
            title: '已叫号',
            icon: 'success'
          })
          // 这里需要再重新请求列表
          _this.workerQueueShow()
        }else{
          wx.showToast({
            title: res.data.err,
            icon: 'error'
          })
        }
      })
    },
    
    //获取员工端订单列表
    workerQueueShow(){
      // 下边的参数上线时要改成真实数据
      $api.workerQueueShow({
        "openid": "test2",
        "tidy_worker_id":2
      }).then(res=>{
        console.log(res)
        if(res.statusCode == 200 && res.data.code == 200){
          //上线要改成真是数据
          let copyData = []
          let itemObj = {"icon_type":1,"is_complete":false,"show_delet":false,"selectClass":"","url":"","is_extend":false}
          let resData
          if(res.data.data.queue){
            resData = JSON.parse(JSON.stringify(res.data.data.queue))
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
      console.log('onChange');
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
      // console.log(movableViewPosition.data.is_complete);
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
              if(optionData.queue_id == queue_id){
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
                console.log("touchstart");
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
          // console.log('开始');
          var firstTouchPosition = {
              x:event.changedTouches[0].pageX,
              y:event.changedTouches[0].pageY,
          }
          // console.log("firstTouchPosition:",firstTouchPosition);
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
          // console.log("domData:",domData);
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
          var queue_id = domData.queue_id;
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
          // console.log('结束');
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
            // console.log('排序');
              that.setData({
                movableViewPosition:movableViewPosition
              })
              var selectItemInfo = that.data.selectItemInfo;
              for(let i=0;i<optionsListData.length;i++){
                if(selectItemInfo.queue_id == optionsListData[i].queue_id){
                    if(optionsListData[i].sortNum == i){//原有顺序=当前顺序，未改变位置
                      return false;
                    }
                    var relation_id='';
                    if(i == 0){//移动后处于首位，上移
                      relation_id=optionsListData[i+1].queue_id;
                      that.updateList(selectItemInfo.queue_id,'reset_weight_up',relation_id);
                      return false;
                    }
                    if(i == (optionsListData.length - 1) ){//移动后处于末尾位，下移
                      relation_id=optionsListData[i-1].queue_id;
                      that.updateList(selectItemInfo.queue_id,'reset_weight_down',relation_id);
                      return false;
                    }
  
                    var pre_num=optionsListData[i-1].sortNum;//上一条数据初始顺序
                    var curr_num=optionsListData[i].sortNum;//移动数据初始顺序
                    if(pre_num > curr_num){ //下移
                      relation_id=optionsListData[i-1].queue_id;
                      that.updateList(selectItemInfo.queue_id,'reset_weight_dowm',relation_id);
                    }else{//上移
                      relation_id=optionsListData[i+1].queue_id;
                      that.updateList(selectItemInfo.queue_id,'reset_weight_up',relation_id);
                    }
                }
              }
              
          }else{
            that.setData({
              movableViewPosition:movableViewPosition
            })
          }
          // console.log(that.data);
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
            that.workerQueueShow();
          }
        }
      },
      handletouchmove: function(event) {
        // console.log(event)
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
            console.log(that.data.swiper_index);
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
        // console.log(text);
      },
     
      handletouchstart:function(event) {
        // console.log(event)
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
        // console.log('结束滑动');
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
        console.log(id,operate,relation_id);
        // id// 是一栋的元素  12
        // relation_id//是一栋到一栋元素旁的元素  15
        // operate ’reset_weight_dowm‘  ’reset_weight_uP‘  // 将元素12一栋到15下 或者上
        let dataList = this.data.optionsListData
        let yidong  = ''
        let beidong  = ''
        dataList.map((e,i)=>{
          if(e.queue_id == id){
            yidong = i
          }
          if(e.queue_id == relation_id){
            beidong = i
          }
        })
        console.log('yidong',yidong);
        console.log('beidong',beidong);
        console.log(dataList[yidong].st);
        console.log(dataList[beidong].st);
        console.log(operate);
        console.log(operate === 'reset_weight_down');
        if(operate === 'reset_weight_down'){
          console.log(123131312);
          let resTime = dataList[beidong].st
          resTime = resTime.split(' ')[1]
          console.log(resTime);
          let timeArr = resTime.split(':')
          if(Number(timeArr[1]) + 40 >=60){
            timeArr[0] = Number(timeArr[0]) + 1 < 10 ? `0${Number(timeArr[0]) + 1}` : Number(timeArr[0]) + 1
            timeArr[1] = Number(timeArr[1]) + 40 -60
          }else{
            timeArr[0] = Number(timeArr[0]) < 10 ? `0${Number(timeArr[0])}` : Number(timeArr[0])
            timeArr[1] = Number(timeArr[1]) + 40
          }
          let timeStr = timeArr.join(':')
          dataList[yidong].st = dataList[yidong].st.split(' ')[0]
          dataList[yidong].st = `${dataList[yidong].st} ${timeStr}`
          this.setData({
            ['dataList['+yidong+'].st']: dataList[yidong].st
          })
        }else{
          let resTime = dataList[beidong].st
          resTime = resTime.split(' ')[1]
          let timeArr = resTime.split(':')
          if(Number(timeArr[1]) - 40 <0){
            timeArr[0] = Number(timeArr[0]) - 1  < 10 ? `0${Number(timeArr[0]) - 1 }` : Number(timeArr[0]) - 1 
            timeArr[1] = Number(timeArr[1]) + 60 - 40
          }else{
            timeArr[0] = Number(timeArr[0]) < 10 ? `0${Number(timeArr[0])}` : Number(timeArr[0])
            timeArr[1] = Number(timeArr[1]) - 40
          }
          let timeStr = timeArr.join(':')
          dataList[yidong].st = dataList[yidong].st.split(' ')[0]
          dataList[yidong].st = `${dataList[yidong].st} ${timeStr}`
          this.setData({
            ['dataList['+yidong+'].st']: dataList[yidong].st
          })
        }
        console.log(dataList);
        $api.workerQueueSet({
          list:dataList,
          "openid": "test2",
          "tidy_worker_id": 2,
        }).then(res=>{
          if(res.statusCode && res.data.code==200){
            wx.showToast({
              title: '已调整排队信息',
              icon:'none'
            })
             // 这里需要再重新请求列表
            _this.workerQueueShow()
          }else{
            wx.showToast({
              title: res.data.err,
              icon:'none'
            })
          }
          _this.workerQueueShow()
          console.log(res)
        }).catch(err=>{
          console.log(err)
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