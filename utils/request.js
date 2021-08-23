const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const baseURL = 'https://www.giacomo.top/api/v2';

function request(method, url, data) {
    return new Promise(function(resolve, reject) {
        let header = {
            // 'Content-Type': (method!='POST' ? 'application/json' : 'application/x-www-form-urlencoded'),
            'Content-Type': (method!='POST' ? 'application/json' : 'application/json'),
        };
        wx.request({
            url: baseURL + url,
            method: method,
            // data: method === POST ? JSON.stringify(data) : data,
            data: data,
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
    // 查看评价
    workerOrderCommentList:(data)=>request(POST, `/worker/order-comment/list`,data),
   // 审核评价通过或者不通过
   workerOrderCommentCheck:(data)=>request(POST, `/worker/order-comment/check`,data),
   // 考勤申请历史
   workerPunchApproveList:(data)=>request(POST, `/worker/punch/approve-list`,data),
   // 请假或补卡申请
   workerPunchApplys:(data)=>request(POST, `/worker/punch/applys`,data),
    // 我的业绩
    workerUserPerformance:(data)=>request(POST, `/worker/user/performance`,data),
    // 添加海报
    workerSystemPageDetailSet:(data)=>request(POST, `/worker/system/page-detail-set`,data),
    // 门店数据
    workerShopList:(data)=>request(POST, `/worker/shop/list`,data),
    // 门店详情
    workerShopDetail:(data)=>request(POST, `/worker/shop/detail`,data),

};
module.exports = {
    API: API
}