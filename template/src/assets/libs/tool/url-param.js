define(function (require) {

    // 获取网址中参数的参数值；
    function getParam(name, src) {
        var re = new RegExp('(?:^|\\?|#|&)' + name + '=([^&#]*)(?:$|&|#)', 'i');
        var m = re.exec(src || location.href);
        return m ? decodeURI(m[1]) : '';
    }

    // 参数设置
    function setParam(name, str, src) {
        var re = new RegExp('(?:^|\\?|#|&)' + name + '=([^&#]*)(?:$|&|#)', 'i');
        src = src || location.href;
        var m = re.exec(src);
        if (m != null) {
            return src.replace(m[0], m[0].replace(name + '=' + m[1], name + '=' + str));
        } else {
            if (src.indexOf('?') != -1) {
                return src + '&' + name + '=' + str;
            } else {
                return src + '?' + name + '=' + str;
            }
        }
    }

    // 参数删除
    function removeParam(name, src) {
        return src
            .replace(new RegExp('[?&]' + name + '=[^&#]*(#.*)?$'), '$1')
            .replace(new RegExp('([?&])' + name + '=[^&]*&'), '$1');
    }


    return {
        getParam: getParam,
        setParam:setParam,
        removeParam:removeParam

    }

});