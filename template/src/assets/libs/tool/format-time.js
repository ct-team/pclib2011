define(function (require, exports, module) {

    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "h+": this.getHours(), // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            "S": this.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    function getCurDate(){
        return new Date().Format("yyyy-MM-dd");
    }

    function formatJoin(t) {
        var da = t;
        da = new Date(da);
        var year = da.getFullYear();
        var month = da.getMonth() + 1;
        var date = da.getDate();
        var time = [year, month, date].join('');
        return time;
    }

    function formatYearMonthDay(t) {
        var da = t;
        da = new Date(da);
        var year = da.getFullYear() + '年';
        var month = da.getMonth() + 1 + '月';
        var date = da.getDate() + '日';
        var h = da.getHours() < 10 ? '0' + da.getHours() : da.getHours();
        var m = da.getMinutes() < 10 ? '0' + da.getMinutes() : da.getMinutes();
        var time = [month, date].join('') + [h, m].join(':');
        return time;
    }

    function format(t) {
        var da = t;
        da = new Date(da);
        var year = da.getFullYear() + '年';
        var month = da.getMonth() + 1;
        var date = da.getDate();
        var h = da.getHours() < 10 ? '0' + da.getHours() : da.getHours();
        var m = da.getMinutes() < 10 ? '0' + da.getMinutes() : da.getMinutes();
        var time = [month, date].join('.') + ' ' + [h, m].join(':');
        return time;
    }

    module.exports = {
        format: format,
        formatYearMonthDay: formatYearMonthDay,
        formatJoin: formatJoin,
        getCurDate: getCurDate
    }
});