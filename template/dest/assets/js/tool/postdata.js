define(function (require, exports, module) {

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

    /**
     * 得到用户ID
     * @returns {*} 返回用户ID
     */
    function getUserId() {
        return getCookie("UC108_UserID");
    }
    
    function tcyPostData1() {
        var data = {};
        data.UserId = getCookie('UC108_UserID') || 0;
        data.AppId = 1;
        data.Token = getCookie('UC108_AccessToken');
        data.NickName = getCookie('UC108_NickName');
        data.Source = 0;
        data.AppType = 0;
        data.DeviceId = '';
        return data;
    }

    function tcyPostData2() {
        var data = {};
        var md5Key = 'tewtgds&jtrjsdte';
        data.UserId = getCookie("UC108_UserID");
        data.UserName = getCookie("UC108_UserName");
        // 当前时间戳精确到毫秒
        data.TimeStamp = parseInt(Math.round(new Date())/1000);
        // 客户端类型：PC=1，移动=2
        data.ClientType = 1;
        // PC端OS统一
        data.OS = 0;
        // MD5加密
        data.CheckCode = md5(data.UserId + '|' +  data.ClientType + '|' +  data.TimeStamp + '|' + md5Key);
        data.IP = '';
        return data;
    }

    function init() {
        // 这里每次根据业务需求需要进行更改调整
        return tcyPostData2();
    }

    module.exports = {
        init: init,
        getUserId: getUserId
    };
});