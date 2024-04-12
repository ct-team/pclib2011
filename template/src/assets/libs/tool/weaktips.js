/**
 * 弱提示弹窗
 */

define(function (require, exports, module) {

    function weakTip(str) { //layer.load(1);
        wht.dialog({
            body: {
                content: str,
                isWeak: true,
                weakType: 2
            }
        });
    }

    module.exports = {
        init: weakTip
    }
});