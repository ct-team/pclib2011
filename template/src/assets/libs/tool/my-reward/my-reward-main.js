define(function (require, exports, module) {
    var judgestate = require('../../tool/judgestate');
    var islogin = require('../../tool/islogin'); // 是否登录
    var myRewardTpl = require('../../tpl/myreward-tpl');  // 我的奖励模板
    var url = require('../../config/url'); // 全局url
    var myReward = require('./my-reward'); // 我的奖励组件
    var formatTime = require('../../tool/format-time'); // 格式化时间

    function renderHtml(data) {
        var typeArr = ['攻击', '复仇', '发起攻击', '发起复仇'];
        var action = ['遭到您', '遭到您', '向您', '向您'];
        var yddTypeArr = ['赢得胜利', '遗憾败落', '平局'];
        var resultArr = ['获得', '掉落', '双方没有任何损失'];
        var resultInfo = '';
        // PkResult(PK结果)：1胜利；2失败；3打平
        // PkType(Pk类型)：1挑战；2复仇;3 被挑战；4 被复仇

        // 渲染模板
        var html = '';
        $.each(data.List, function (i, entry) {
            entry.YddType = entry.PkResult;
            if (entry.YddType != 3) {
                resultInfo = resultArr[entry.YddType - 1] + entry.YddCount + '妖豆豆';
            } else {
                value.YddType = 3;
                resultInfo = resultArr[entry.YddType - 1];
            }


            html += '<tr>' +
                '<td class="t1">' + entry.EnemyUserName + '</td>' +
                '<td class="t1">' + action[entry.PkType - 1]+ typeArr[entry.PkType - 1] + '</td>' +
                '<td class="t1">' + yddTypeArr[entry.YddType - 1] + '</td>' +
                '<td class="t2">' + resultInfo + '</td>' +
                '<td class="t3">' + formatTime.format(entry.PkTime) + '</td>' +
                // '<td class="t3">' + _this.testPrizeName(entry.przieType, entry.prizeStatus, entry.prizeCurState) + '</td>' +
                '</tr>';
        });
        $("#prizeTbody").html(html);
        // 如果此时又回调函数，则在这里处理
        // ....
        // ....
    }

    function reward(num) {
        var myRewardPop = new MyReward({
            // 我的奖励选择器
            wrap: '.J-check',  // 需要编辑
            tab: {
                // 当前tab栏ID值，默认为0
                curTabId: num
                // tab栏的显示数据
                /*tabData: [{Id: 1, PrizeName: '活动1',PostData:{pata:1}},
                    {Id: 2, PrizeName: '活动2',PostData:{}},
                    {Id: 3, PrizeName: '活动3',PostData:{} }]*/
            },
            // 列表获取
            listAjax: {
                // 默认为GET,可忽略配置
                // type: 'GET',
                // 默认type类型为GET,则为空;type类型为post，则为'application/json';否则根据自定义
                // contentType: 'application/json',
                // 当前页码，默认为第一页
                pageNum: 1,
                // 当前页数量，默认为5
                pageLen: 5,
                // 需要传递其他参数,除了
                postData: {},
                // 需要传递其他参数
                url: url.api.getrecordlist,
                // 请求失败处理，如放置弹窗提示，为了弹窗效果统一，所以需要在外部配置这个弹窗
                error: {
                    codeError: function (result) {
                        // 统一弹窗提示
                        // result = {"Code":-2,"Data":null};
                    },
                    ajaxError: function () {
                        // 通用弹窗提示配置
                    }
                },
                // 列表渲染
                listRender: function (data, curTabId) {
                    // data:列表ajax请求后得到的数据,可能为空数组
                    // curTabId: 渲染数据时不同tab栏可能存在不一样的展示，需要提供当前tab栏ID值，如果没有tab一栏，则curTabId值为

                    renderHtml(data);
                }
            }
        });
    }

    // 绑定按钮
    function bindBtn() {
        $('.J-check').off().click(function () {
            // 判断是否登录
            // 先确定是否登录，没有登陆先登陆
            var isLogin = islogin.init();
            if(!isLogin){
                judgestate.init(wht.code.NO_LOGIN);
                return;
            }
            wht.dialog({
                type: 'personal',
                skin: 'layer-ext-myreward',  // 需要编辑
                area: [570, 376],
                complete: function(){
                    // 如果有tab需要请求，则在这里处理请求
                    // num表示为1,默认为0表示没有tab一栏，为1表示当前tab栏对应活动一
                    reward(0);   // 需要编辑
                },
                body:{
                    content: myRewardTpl
                }
            });

        });
    }

    function init() {
        // 初始化执行
        myReward.init();
        // 绑定按钮
        bindBtn();
    }

    module.exports = {
        init: init
    };
});



// 执行我的奖励弹窗
/*layer.open({
    content: myRewardTpl,
    skin: 'layer-ext-myreward',  // 需要编辑
    area: [570, 396],  // 需要编辑
    // 拖拽设置为false
    move: false,
    // 层弹出后的成功回调方法
    success: function (layero, index) {
        // 如果有tab需要请求，则在这里处理请求
        // num表示为1,默认为0表示没有tab一栏，为1表示当前tab栏对应活动一
        // $('.J-nickname').html(islogin.init());
        reward(0);   // 需要编辑
    },
    // 层销毁后触发的回调
    end: function () {
        // 比如更新页面数据
        // .....
        // .....
    }
});*/
