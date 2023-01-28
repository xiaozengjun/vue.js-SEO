var bus = new Vue(); //中转站 组件通信

$(function () {
    window.app = new Vue({
        el: "#app",
        data: function () {
            return {
            }
        },
        methods: {
        },
    });
});

//错误提示
var errMsgDef={
    reqMsg:"连接系统服务出错",
    resMsg:"服务器错误"
};
var errMsgBox=".cl-message.cl-message--error";
function showErrorAlert(msg,time){
    if(!time){time=2000;}
    $(errMsgBox).find(".cl-message__content").text(msg);
    $(errMsgBox).animate({top:"20px"});
    setTimeout(function(){
        $(errMsgBox).animate({top:"-50px"});
    }, time);
}

if(top.location!= location) {
    var dom = document.querySelector('.copy-right')
    dom.classList.add('hide')
}

