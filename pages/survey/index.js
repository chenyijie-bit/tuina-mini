
let app = getApp();
const $api = require('../../utils/request').API;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Component({
  data: {
    active: 0,
    showDialog: false,
    optionsListData:[], //订单列表数据
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
    //获取员工端订单列表
    workerQueueList(){
      // 下边的参数上线时要改成真实数据
      $api.workerQueueList({
        "openid": app.globalData.openId,
        // "tidy_worker_id":app.globalData.worker_id
        // "openid": '',
        "tidy_worker_id":3
      }).then(res=>{
        if(res.statusCode == 200 && res.data.code == 200){
          //上线要改成真是数据
          let copyData = []
          // let itemObj = {"icon_type":1,"is_complete":false,"show_delet":false,"selectClass":"","url":"","is_extend":false}
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