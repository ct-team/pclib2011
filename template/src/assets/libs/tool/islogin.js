/**
 * 判断是否登录
 */
define(function(require, exports, module) {

    /**
     * 得到cookie信息
     * @param name
     * @returns {*}
     */
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURI(arr[2]);
        } else {
            return null;
        }
    }

    function isLogin(){
        var result, username;
        username = getCookie("UC108_NickName");
        result = username ? username : false;
        // result = 'ql2015';
        return result;
    }

    function init() {
        return isLogin();
    }

    module.exports = {
        init: init
    };
});
