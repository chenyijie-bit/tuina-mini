let app = getApp();
const $api = require('../../utils/request').API;
Component({
  data: {
    activeTab: 0,
    triggered: false,


    ///拖拽
    dragImgUrl:'../../assess/images/drag.png',
    optionsListData:[],
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
    // 打电话
    makePhone(e){
      let phoneNumber = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
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
          let itemObj = {"title":"拖拽测试-1","desc":"长按左侧图标拖拽排序，左滑删除","address":"北京市朝阳区北京市朝阳区","icon_type":1,"is_complete":false,"show_delet":false,"selectClass":"","url":"","is_extend":false}
          let resData
          if(res.data.data.queue){
            resData = JSON.parse(JSON.stringify(res.data.data.queue))
          }
          for (let index = 0; index < resData.length; index++) {
            const element = resData[index];
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
    // onRefresh() {
    //   if (this._freshing) return
    //   this._freshing = true
    //   setTimeout(() => {
    //     this.setData({
    //       triggered: false,
    //     })
    //     this._freshing = false
    //   }, 3000)
    // },
    // onPulling(e) {
    //   console.log('onPulling:', e)
    // },
    // onRestore(e) {
    //   console.log('onRestore:', e)
    // },
  
    // onAbort(e) {
    //   console.log('onAbort', e)
    // },
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
      // if(scrollTop >= 61){
      //   if(this.data.navigationBarTitle != '拖拽排序+左滑删除'){
      //     wx.setNavigationBarTitle({
      //       title: '拖拽排序+左滑删除'
      //     })
      //     this.setData({
      //       navigationBarTitle:'拖拽排序+左滑删除'
      //     })
      //   }
        
      // }else{
      //   if(this.data.navigationBarTitle != ''){
      //     wx.setNavigationBarTitle({
      //       title: ''
      //     })
      //     this.setData({
      //       navigationBarTitle:''
      //     })
      //   }
      // }
    },
      getOptionInfo:function (id) {
          for(var i=0,j=this.data.optionsListData.length;i<j;i++){
              var optionData= this.data.optionsListData[i];
              if(optionData.id == id){
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
        // console.log('draggleTouch')
        // console.log(event)
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
          var id = domData.id;
          var secInfo = that.getOptionInfo(id);
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
  
          // console.log("event.changedTouches:",event.changedTouches);
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
                if(selectItemInfo.id == optionsListData[i].id){
                    if(optionsListData[i].sortNum == i){//原有顺序=当前顺序，未改变位置
                      return false;
                    }
                    var relation_id='';
                    if(i == 0){//移动后处于首位，上移
                      relation_id=optionsListData[i+1].id;
                      that.updateList(selectItemInfo.id,'reset_weight',relation_id);
                      return false;
                    }
                    if(i == (optionsListData.length - 1) ){//移动后处于末尾位，下移
                      relation_id=optionsListData[i-1].id;
                      that.updateList(selectItemInfo.id,'reset_weight',relation_id);
                      return false;
                    }
  
                    var pre_num=optionsListData[i-1].sortNum;//上一条数据初始顺序
                    var curr_num=optionsListData[i].sortNum;//移动数据初始顺序
                    if(pre_num > curr_num){ //下移
                      relation_id=optionsListData[i-1].id;
                      that.updateList(selectItemInfo.id,'reset_weight',relation_id);
                    }else{//上移
                      relation_id=optionsListData[i+1].id;
                      that.updateList(selectItemInfo.id,'reset_weight',relation_id);
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
        console.log('左滑');
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
        var that=this;
        var ajaxData={};
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