var isDev=false;//true表示开发环境false表示生产环境
var URL_DEV="/dev";//测试其他线下地址如b1,去webpack,config.js改target
var URL_PROD="https://www.zaojiangchong.com/";
var BASE_URL= isDev ? URL_DEV : URL_PROD;

axios.defaults.crossDomain = true;
window.instance = axios.create({baseURL: BASE_URL, timeout: 1000 * 100});

var CancelToken = axios.CancelToken;
window.axiosCancel = []; // 全局定义一个存放取消请求的标识
instance.interceptors.request.use(function (config) {
    // 拦截器添加取消标记
    config.cancelToken = new CancelToken(function executor(c) {
        window.axiosCancel.push(c);
    });
    return config;
}, function (error) {
    return Promise.reject(error);
});

var api = {

    //获取版本列表
    getVersionList:function() {
        return instance.get('/rs/suggestSales/list')
    },

    //上传论文
    uploadPaper:function (data,config) {
        return instance.post('/v1/suggestOrder/uploadPaper',data,config)
    },

    //创建预支付定单
    createOrder:function (data, config) {
        return instance.post('/v1/suggestOrder/createOrder',data, config)
    },

    //支付定单
    payOrder:function (data, config) {
        return instance.post('/v1/suggestOrder/payOrder', data, config)
    },

    //轮询订单支付状态
    pollingOrder:function (oid) {
        var url="/rs/payinfo/"+oid+"/status?r=" + new Date().getTime();
        return instance.get(url,{r:window.Math.random()})
    },

    // 验证订单
    verifyOrder:function (oid) {
        return instance.get("/v1/verifyOrder",{
            params:{
                oid:oid,
                r:window.Math.random()
            }
        })
    },

    //查询单条订单
    searchRecord:function (oid) {
        return instance.post("/v1/suggestrecord/" + oid)
    },

    //删除订单
    delRecord:function (data) {
        return instance.post('/v1/suggestOrder/delOrder', data)
    },

    //是否绑定
    checkBind:function (data) {
        return instance.post('/weixin/qr/bind_order', data)
    },

    //
    loginStatus:function (data) {
        return instance.post("/weixin/qr/regist/query",data)
    },

    //追踪订单
    trackOrder:function (data) {
        return instance.post('/track/updateSession',data)
    },
};
