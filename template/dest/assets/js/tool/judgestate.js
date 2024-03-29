define(function (require, exports, module) {
    /*var gCodeList = {
        11000: {content: '您未登录'}, // 未登录
        20002: {content: '活动未开始'}, // 活动未开始
        20003: {content: '活动已结束'}, // 活活动已结束
        // 20004: {content: '人品爆发啦，请稍后重试'}, // 活动预算不足
        20005: {content: '当前活动不可用'}, // 活动禁用  -- by add ql
        20001: {content: '人品爆发啦，请稍后重试'},  // 统一未知错误
        20101: {content: '人品爆发啦，请稍后重试'}, // 请求参数错误
        20102: {content: '人品爆发啦，请稍后重试'}, // 接口超时
        '-1': {content: '人品爆发啦，请稍后重试'}
    };*/

    var gArrCodeList = [11000, 20002, 20003, /*20004,*/ 20005, 20001, 20101, 20102, -1];

    function weakTip(str) {
        wht.dialog({
            body: {
                content: str,
                isWeak: true,
                weakType: 2
            }
        });
    }

    function init(status, n) {
        var bool = false;
        var gCodeList = {
            11000: {content: '您未登录'}, // 未登录
            20002: {content: '活动未开始'}, // 活动未开始
            20003: {content: '活动已结束'}, // 活活动已结束
            // 20004: {content: '人品爆发啦，请稍后重试'}, // 活动预算不足
            20005: {content: '当前活动不可用'}, // 活动禁用  -- by add ql
            20001: {content: '异常错误，错误值' + status},  // 统一未知错误
            20101: {content: '异常错误，错误值' + status}, // 请求参数错误
            20102: {content: '异常错误，错误值' + status}, // 接口超时
            '-1': {content: '异常错误，错误值' + n}
        };
        if ($.inArray(status, gArrCodeList) != -1) {
            weakTip(gCodeList[status].content);
            bool = true;
        }
        return bool;
    }

    module.exports = {
        init: init
    };
});