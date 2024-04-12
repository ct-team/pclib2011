define(function(require, exports, module){
    var floatTpl = require('../tpl/float-pop-noClose'); //不关闭的浮动窗
    

    function weakTip(str){
        wht.dialog({
            type: 'personal',
            skin: 'float-pop-noClose',
            area: [300, 100],
            close: function(){},
            complete: function(){
                var $str = $('.J_con');
                
                $str.html(str);
            },
            body: {
                // 必填，是一段html模板，根据示例文件查看
                content: floatTpl
            }
        });
    }

    function init(str){
        weakTip(str);
    }

    module.exports = {
        init: init
    };
});
