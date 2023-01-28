/*
 @author lwh
 @version 0.1.3
 @last-mod-time 20181109
 */
Request = {
    QueryString : function(item) {
        var svalue = location.search.match(new RegExp("[\?\&]" + item
            + "=([^\&]*)(\&?)", "i"));
        if (svalue === undefined)
            return undefined;
        return svalue ? svalue[1] : svalue;
    },
    //alert(QueryString('str'));
    getArgs:function() {
        var args = new Object();
        var query = location.search.substring(1); // Get query string
        var pairs = query.split("&"); // Break at ampersand
        for ( var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); // Look for "name=value"
            if (pos == -1)
                continue; // If not found, skip
            var argname = pairs[i].substring(0, pos); // Extract the name
            var value = pairs[i].substring(pos + 1); // Extract the value
            value = decodeURIComponent(value); // Decode it, if needed
            args[argname] = value; // Store as a property
        }
        return args; // Return the object
    }
    //alert(getArgs()['str']);或alert(getArgs().str);
};

var MyUtil={};
/*校验邮件地址是否合法 */
MyUtil.IsEmail=function IsEmail(str) {
    var reg=/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    return reg.test(str);
}
/*校验电话码格式 */
MyUtil.isTelCode=function isTelCode(str) {
    var reg= /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
    return reg.test(str);
}
/*手机号验证 */
MyUtil.isMobileCode=function isMobileCode(str) {
    var reg= /^[1][3,4,5,6,7,8][0-9]{9}$/;
    return reg.test(str);
}
/*校验是否中文名称组成 */
MyUtil.ischina=function ischina(str) {
    var reg=/^[\u4E00-\u9FA5]{2,4}$/;  
    return reg.test(str);  
}
/*校验QQ */
MyUtil.isQQCode=function isQQCode(str) {
    var reg=/^[1-9]\d{4,8}$/;  
    return reg.test(str);    
}

//参考http://www.cnblogs.com/ymj126/p/3767442.html
//比如你要计算：7*0.8 ，则改成 (7).mul(8)
/*用来得到精确的加法结果
 *说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 *调用：accAdd(arg1,arg2)
 *返回值：arg1加上arg2的精确结果
 */
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2))
    return (arg1*m+arg2*m)/m
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg){
    return accAdd(arg,this);
}

//减法函数
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
//last modify by deeka
//动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
Number.prototype.sub = function (arg){
    return accSub(arg,this);
}

/*
 *乘法函数，用来得到精确的乘法结果
 *说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 *调用：accMul(arg1,arg2)
 *返回值：arg1乘以arg2的精确结果
 */
function accMul(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}

//给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg){
    return accMul(arg, this);
}
/*除法函数，用来得到精确的除法结果
 *说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 *调用：accDiv(arg1,arg2)
 *返回值：arg1除以arg2的精确结果
 */
function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    with(Math){
        r1=Number(arg1.toString().replace(".",""))
        r2=Number(arg2.toString().replace(".",""))
        return (r1/r2)*pow(10,t2-t1);
    }
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg){
    return accDiv(this, arg);
}

//自定义弹框Toast--仿Android
function Toast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    var div = document.createElement('div');
    var con = document.createElement('div');
    con.innerHTML = msg;
    div.appendChild(con);
    div.style.cssText="width: 60%;position: fixed;top: 40%;left: 20%;z-index: 999999;" +
        "text-align:center;opacity: 0.7;padding: 8px 12px;color: rgb(255, 255, 255);border-radius:4px;background: rgb(0, 0, 0);font-size:14px;";
    document.body.appendChild(div);
    setTimeout(function() {
        var d = 0.5;
        div.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        div.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(div) }, d * 1000);
    }, duration);
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

/**
 * yyyy-MM-dd HH:mm:ss 格式的字符串转日期
 * @param str
 * @returns {Date}
 */
function stringToDate(str) {
    var tempStrs = str.split(" ");
    var dateStrs = tempStrs[0].split("-");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10);
    var timeStrs = tempStrs[1].split(":");
    var hour = parseInt(timeStrs [0], 10);
    var minute = parseInt(timeStrs[1], 10);
    var second = parseInt(timeStrs[2], 10);
    var date = new Date(year, month, day, hour, minute, second);
    return date;
}

/**
 * 判断是否有滚动条
 * @returns {boolean}
 */
function hasScrollbar() {
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}