const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const baseURL = 'https://www.giacomo.top/api/v2';

function request(method, url, data) {
    return new Promise(function(resolve, reject) {
        let header = {
            'Content-Type': (method!='POST' ? 'application/json' : 'application/x-www-form-urlencoded'),
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
    getTelNumber: (data) => request(POST, `/user/wx-bind-mobile`,data)

};
module.exports = {
    API: API
}