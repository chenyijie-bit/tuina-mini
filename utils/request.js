const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';
const md5 = require('./md5.js')
const baseURL = 'https://www.giacomo.top/api/v2';

function request(method, url, data) {
    return new Promise(function(resolve, reject) {
        let header = {
            // 'Content-Type': (method!='POST' ? 'application/json' : 'application/x-www-form-urlencoded'),
            'Content-Type': (method!='POST' ? 'application/json' : 'application/json'),
        };
        let objSign = {sign:''}
        let str = ''
        let res = Object.keys(data).sort();
        res.map(key=>{
            const element = data[key];
            if(element || element === 0 || element==='0'){
                str+= (key.toLowerCase()+'='+ (typeof element === 'object' ? JSON.stringify(element).toLowerCase() : String(element).toLowerCase()))+'&'
            }
        })
        str = str.slice(0,str.length-1)
        str+='a286d0'

        objSign.sign = md5.hexMD5(str)
        wx.request({
            url: baseURL + url,
            method: method,
            // data: method === POST ? JSON.stringify(data) : data,
            data: Object.assign({},data,objSign)  ,
            header: header,
            success(res) {
                //请求成功
                //判断状态码---errCode状态根据后端定义来判断
                // if (res.data.errCode == 0) {
                    resolve(res);
                // } else {
                //     //其他异常
                //     reject('运行时错误,请稍后再试');
                // }
            },
            fail(err) {
                //请求失败
                reject(err)
            }
        })
    })
}
const API = {
    getOpenid: (data) => request(POST, `/user/xcx-check-login`,data),
    // 首页数据
    getHomeData: (data) => request(POST, `/home/show`,data),
    //获取店铺信息
    getShopData: (data) => request(POST, `/shop/show`,data),
    //获取店员信息
    getWorkerData: (data) => request(POST, `/worker/show`,data),
    //获取手机号
    getTelNumber: (data) => request(POST, `/user/wx-bind-mobile`,data),
    //下单
    orderSubmit: (data) => request(POST, `/order/submit`,data),
    //支付
    orderPaydata: (data) => request(POST, `/order/pay-data`,data),
    //获取订单数据
    orderShow: (data) => request(POST, `/order/show`,data),
    //工作人员订单列表
    workerQueueShow: (data) => request(POST, `/worker/queue/show`,data),
    // 弃号
    giveUp: (data) => request(POST, `/worker/queue/cancel`,data),
    //叫号 也是开始服务
    startServe:(data) => request(POST, `/worker/queue/call`,data),
    // 服务结束
    queueOrderSubmit: (data) => request(POST, `/worker/queue/order-submit`,data),
    // 取消订单
    cancelServe: (data) => request(POST, `/order/user-cancel`,data),
    // 未来几天排队
    workerFutureList: (data) => request(POST, `/worker/future-list`,data),
    // 工作人员排队列表
    workerQueueList: (data) => request(POST, `/worker/queue/list`,data),
    // 修改队列
    workerQueueSet:(data)=> request(POST, `/worker/queue/set`,data),
    // 搜索门店]
    homeSearch:(data)=> request(POST, `/home/search`,data),
    // 生成支付二维码
    showQrCode:(data)=>request(POST, `/worker/order/paycode`,data),
    // 获取用户列表 添加员工用
    requestWorkerList:(data)=>request(POST, `/worker/user/list`,data),
    searchWorker:(data)=>request(POST, `/worker/user/list`,data),
    setForWorker:(data)=>request(POST, `/worker/user/set-for-worker`,data),
    // 通知
    // 通知列表
    workerNotificationList:(data)=>request(POST, `/worker/notification/list`,data),
    // 发送通知
    workerNotificationSend:(data)=>request(POST, `/worker/notification/send`,data),
    // 删除通知
    workerNotificationDel:(data)=>request(POST, `/worker/notification/del`,data),
    // 打卡
    workerPunchClock:(data)=>request(POST, `/worker/punch/clock`,data),
    // 打卡详情
    workerPunchList:(data)=>request(POST, `/worker/punch/list`,data),
    // 打卡回显
    workerPunchListByDate:(data)=>request(POST, `/worker/punch/list-by-date`,data),
    
    // 设置为员工时 对应选中人的个人信息
    userInfo:(data)=>request(POST, `/user/info`,data),
    //用户补充信息
    userWorkerRegister:(data)=>request(POST, `/user/worker-register`,data),
    // 管理员删除员工
    workerUserDel:(data)=>request(POST, `/worker/user/del`,data),
    //  管理员确认
    workerUserAgree:(data)=>request(POST, `/worker/user/agree`,data),
    // 发送评价
    orderCommentIn:(data)=>request(POST, `/order-comment/in`,data),
    // 店员查看评价
    workerOrderCommentList:(data)=>request(POST, `/worker/order-comment/list`,data),
   // 审核评价通过或者不通过
   workerOrderCommentCheck:(data)=>request(POST, `/worker/order-comment/check`,data),
   // 考勤申请历史
   workerPunchApproveList:(data)=>request(POST, `/worker/punch/approve-list`,data),
   // 考勤申请审批
   workerPunchApproveCheck:(data)=>request(POST, `/worker/punch/approve-check`,data),
   // 请假或补卡申请
   workerPunchApplys:(data)=>request(POST, `/worker/punch/applys`,data),
    // 我的业绩
    workerUserPerformance:(data)=>request(POST, `/worker/user/performance`,data),
    // 添加海报
    workerMarketingSet:(data)=>request(POST, `/worker/marketing/set`,data),
    // 海报列表
    workerMarketingList:(data)=>request(POST, `/worker/marketing/list`,data),
    // 支付
    marketingPay:(data)=>request(POST, `/marketing/pay`,data),
    //  gonzuorenyuan海报列表
    marketingOrderList:(data)=>request(POST, `/marketing/order-list`,data),
    // 用户查看列表
    marketingShow:(data)=>request(POST, `/marketing/show`,data),
    // 海报退款
    workerOrderRefundMarketing:(data)=>request(POST, `/worker/order/refund-marketing`,data),
    // 海报订单审核
    workerMarketingApply:(data)=>request(POST, `/worker/marketing/apply`,data),
    // 门店数据
    workerShopList:(data)=>request(POST, `/worker/shop/list`,data),
    // 门店详情
    workerShopDetail:(data)=>request(POST, `/worker/shop/detail`,data),
    // 添加店铺
    workerShopCreate:(data)=>request(POST, `/worker/shop/create`,data),
    // 删除店铺
    workerShopDel:(data)=>request(POST, `/worker/shop/del`,data),
    // 修改店铺
    workerShopSet:(data)=>request(POST, `/worker/shop/up`,data),
    // 会员卡
    // 添加
    workerVipSet:(data)=>request(POST, `/worker/vip/set`,data),
    // 列表
    workerVipList:(data)=>request(POST, `/vip/list`,data),
    // 购买
    vipPay:(data)=>request(POST, `/vip/pay`,data),
    // 会员卡订单列表
    vipOrderList:(data)=>request(POST, `/vip/order-list`,data),
    // 会员卡退款
    workerOrderRefundVip:(data)=>request(POST, `/worker/order/refund-vip`,data),
    // 轮播
    // 列表
    workerSystemPageDetailList:(data)=>request(POST, `/worker/system/page-detail-list`,data),
    // 添加轮播
    workerSystemPageDetailSet:(data)=>request(POST, `/worker/system/page-detail-set`,data),
    // 跨店排班列表
    workerPunchTravelList:(data)=>request(POST, `/worker/punch/travel-list`,data),
    // 跨店排班设置
    workerPunchTravelSet:(data)=>request(POST, `/worker/punch/travel-set`,data),
    // 分配店铺
    workerUserBindShop:(data)=>request(POST, `/worker/user/bind-shop`,data),
    // 店铺今日考勤
    workerPunchShopDetail:(data)=>request(POST, `/worker/punch/shop-detail`,data),
    // 添加服务
    workerServiceAdd:(data)=>request(POST, `/worker/service/add`,data),
    // 删除服务
    workerServiceDel:(data)=>request(POST, `/worker/service/del`,data),
    // 服务列表
    workerServiceList:(data)=>request(POST, `/worker/service/list`,data),
};
module.exports = {
    API: API
}