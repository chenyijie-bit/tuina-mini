const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const baseURL = 'http://47.105.194.199/api/v2';

function request(method, url, data) {
    return new Promise(function(resolve, reject) {
        let header = {
            'Content-Type': (method!='POST' ? 'application/json' : 'application/x-www-form-urlencoded'),
        };
        wx.request({
            url: baseURL + url,
            method: method,
            data: method === POST ? JSON.stringify(data) : data,
            header: header,
            success(res) {
                //请求成功
                //判断状态码---errCode状态根据后端定义来判断
                // if (res.data.errCode == 0) {
                //     resolve(res);
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
};
module.exports = {
    API: API
}