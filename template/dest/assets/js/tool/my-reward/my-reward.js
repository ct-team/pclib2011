define(function (require, exports, module) {

    // 分页插件
    (function () {
        $.fn.pages = function (opts) {
            var option = $.extend({
                currPage: 0, //当前页数
                pageLen: 5, //每页数量
                totalNum: 0,
                record: true,//显示记录数
                from: true,//显示跳页页面
                spage: 5,//页面几页后省略
                topPage: 1,//省略号前显示页数
                afterPage: 1,//省略号后显示页数
                tpl: {
                    up: '&lt; 上一页',
                    down: '下一页 &gt;'
                },
                callback: function () {
                    return false;
                }
            }, opts);
            return this.each(function () {
                var $page = $(this);

                function jumpTmp(n) {
                    return '<div class="d-pages-form"><span class="d-pages-form-text">到第</span><input class="d-pages-form-input" type="number" value="' + n + '" min="1" ><span class="d-pages-form-text">页</span><a class="d-pages-form-btn" href="javascript:;">确定</a></div>';
                }

                function subPageNum(totalNum, totalPage, currNum) {
                    return '<div class="d-pages-pageshow"><span>共' + totalNum + '条</span><span>第' + currNum + '/' + totalPage + '页</span></div>';
                }

                function init() {
                    pageSum();
                    createPage();
                    setTimeout(function () {
                        bind();
                    }, 1);

                }

                function pageSum() {
                    option.pageNum = parseInt(Math.ceil(option.totalNum / option.pageLen));
                }

                function createPage() {
                    var html = "",
                        arr = [],
                        i,
                        len = 0,
                        num = parseInt(option.currPage),
                        pageNum = option.pageNum,
                        cs = 0,
                        inputNum = 1,
                        dot = '<span class = "item dot">...</span>',
                        spage = option.spage,
                        showPage = 0;
                    // $page.empty().hide();
                    $page.empty();

                    if (!num || option.totalNum <= option.pageLen) {
                        return false;
                    }

                    $page.show();
                    if (num <= 1) {
                        html += '<span class="item disabled">' + option.tpl.up + '</span>';
                    } else {
                        html += '<a class="item" data-page="' + (num - 1) + '" href="javascript:;">' + option.tpl.up + '</a>';
                    }
                    arr = listArr(num, pageNum, spage);
                    len = arr.length;

                    if (arr[0] > 1) {
                        showPage = arr[0] <= option.topPage ? arr[0] - 1 : option.topPage;
                        for (i = 1; i <= showPage; i++) {
                            html += '<a class="item" data-page="' + i + '" href="javascript:;">' + i + "</a>";
                        }
                    }

                    if (arr[0] > option.topPage + 1) {
                        html += dot;
                    }


                    for (i = 0; i < len; i++) {
                        if (arr[i] == num) {
                            html += '<a class="current item" data-page="' + arr[i] + '" href="javascript:;">' + arr[i] + "</a>";
                        } else {
                            html += '<a class="item" data-page="' + arr[i] + '" href="javascript:;">' + arr[i] + "</a>";
                        }
                    }

                    if (arr[len - 1] < pageNum - option.afterPage) {
                        html += dot;
                    }

                    if (arr[len - 1] < pageNum) {
                        showPage = arr[len - 1] >= pageNum - option.afterPage ? pageNum - arr[len - 1] : option.afterPage;
                        for (i = pageNum - showPage + 1; i <= pageNum; i++) {
                            html += '<a class="item" data-page="' + i + '" href="javascript:;">' + i + "</a>";
                        }
                    }


                    if (num >= pageNum) {
                        html += '<span class="item disabled">' + option.tpl.down + '</span>';
                    } else {
                        html += '<a class="item" data-page="' + (num + 1) + '" href="javascript:;">' + option.tpl.down + '</a>';
                    }

                    html = '<div class="d-pages-list">' + html + '</div>';
                    if (option.from) {
                        inputNum = num + 1;
                        if (inputNum > pageNum) {
                            inputNum = pageNum;
                        }
                        html += jumpTmp(inputNum);
                    }
                    html = '<div class="d-pages-listbox">' + html + '</div>';
                    if (option.record) {
                        html = subPageNum(option.totalNum, option.pageNum, option.currPage) + html;
                    }

                    html = '<div class="d-pages">' + html + '</div>';
                    $page.append(html);
                    // $page.find('.d-pages-total label').html(pageNum);
                    if (option.from) {
                        $page.find('.d-pages-form-input').attr('max', pageNum);
                    }

                }

                function selectItem(n) {
                    if (!n || n < 1 || n > option.pageNum) {
                        return;
                    }
                    option.currPage = n;
                    option.callback(n);
                    init();
                }

                function bind() {
                    var $submit = $page.find('.d-pages-form-btn'),
                        $input = $page.find('.d-pages-form-input'),
                        page,
                        v,
                        num;
                    $page.find("a").click(function () {
                        page = parseInt($(this).attr('data-page'));
                        selectItem(page);
                    });

                    if (option.from) {
                        $submit.bind('click', function () {
                            selectItem($input.val());
                        });
                        $input.click(function () {
                            $(this).select();
                        });
                        $input.bind('keyup', function () {
                            v = parseInt($(this).val());
                            num = option.pageNum;
                            if (!v) {
                                v = 1;
                            } else {
                                v = parseInt(v);
                                if (v > num) {
                                    v = num;
                                }
                                if (v < 1) {
                                    v = 1
                                }
                            }

                            $(this).val(v);
                        });

                    }
                }

                function listArr(page, total, len) {
                    var arr = [], cs, i, flag = true;
                    cs = parseInt(len / 2);
                    if (flag && total <= len) {
                        for (i = 1; i <= total; i++) {
                            arr.push(i);
                        }
                        flag = false;
                    }
                    if (flag && page <= len - cs) {
                        for (i = 1; i <= len; i++) {
                            arr.push(i);
                        }
                        flag = false;
                    }
                    if (flag && page + cs >= total) {
                        for (i = total - len + 1; i <= total; i++) {
                            arr.push(i);
                        }
                        flag = false;
                    }
                    if (flag) {
                        for (i = page - cs; i <= page + cs; i++) {
                            arr.push(i);
                        }
                    }
                    return arr;
                }

                init();
            });
        };
    })();

    function MyReward(opts) {
        this._option = opts || {};
        this._option.wrap = opts.wrap || '.J-reward-pop1';
        this._option.$tabItem = $(this._option.wrap).find('.tabs');
        this._option.curTabId = opts.tab.curTabId || 0; // 当前tab栏的所在id值
        this._option.tabData = opts.tab.tabData || [];
        this._option.pageNum = opts.listAjax.pageNum || 1; // 当前页面
        this._option.pageLen = opts.listAjax.pageLen || 5; // 每页数量
        this.listAjax = opts.listAjax; // 初始化列表的配置项
        this.listRender = opts.listAjax.listRender || function () {
        }; // 渲染列表
        this._init(this._option);
    }

    MyReward.prototype = {
        _init: function (opts) {
            if (opts.$tabItem != '') {
                // 渲染tab一栏
                this._renderTab();
                // 绑定tab
                this._bindTab();
            }
            // 绑定列表的ajaxfn
            this._listAjaxfn();
        },
        _getPostData: function (obj) {
            var _this = this;
            var _postData = {};
            _postData.PageIndex = _this._option.pageNum;
            _postData.PageSize = _this._option.pageLen;
            if (_this._option.curTabId > 0) {
                _postData.activityid = _this._option.curTabId;
                // 判断tab一栏的data-postdata属性是否存在
                if(typeof _this._option.tabData[_this._option.curTabId-1].PostData != 'undefined'){
                    _postData = $.extend({},_postData,_this._option.tabData[_this._option.curTabId-1].PostData);
                }
            }
            return _postData;
        },
        _listAjaxfn: function (o) {
            var _this = this;
            var _postData = $.extend({}, _this.listAjax.postData);
            var html = '';
            if (typeof o != 'undefined') {
                _this._option.curTabId = o.curTabId;
                _this._option.pageNum = o.pageNum;

                _postData = _this._getPostData(o);
            } else {
                _postData = _this._getPostData(o);
            }

            // console.log(_postData);
            // console.log('当前活动ID：' + _this._option.curTabId + ',当前页码：' + _this._option.pageNum + ',每页数量：' + _this._option.pageLen);
            $.ajax({
                type: _this.listAjax.type || 'GET',
                url: _this.listAjax.url,
                dataType: "json",
                data: _postData,
                contentType: _this.listAjax.type == 'post' ? 'application/json' : (_this.listAjax.contentType || ''),
                cache: false,
                success: function (r) {
                    if (r.Code == 0) {
                        // 填充分页数据
                        $(".page2").pages({
                            currPage: _this._option.pageNum, //当前页码
                            from: false,
                            pageLen: _this._option.pageLen,//每页数量
                            totalNum: r.Data.RecordCount, //总数量
                            callback: function (n) {
                                // console.log('n:' + n);
                                _this._option.pageNum = n;
                                if (parseInt($(".page2").find('.current').attr('data-page')) == parseInt(n)) {
                                    return;
                                }
                                _this._listAjaxfn({
                                    curTabId: _this._option.curTabId,
                                    pageNum: n
                                });
                            }
                        });

                        if(r.Data.List.length == 0){
                            $('#noPrize').show();
                            $('#prizeTbody').hide();
                        }else{
                            $('#noPrize').hide();
                            $('#prizeTbody').show();
                            // 渲染模板放置在外边
                            _this.listRender(r.Data,_this._option.curTabId);
                        }

                    } else {
                        $('#noPrize').show();
                        $('#prizeTbody').hide();
                        // 弹出弹窗错误提示
                        _this.listAjax.error.codeError(r);
                    }
                },
                error: function () {
                    // 弹出弹窗错误提示
                    _this.listAjax.error.ajaxError();
                }
            });
        },
        _renderTab: function () {
            var html = '';
            var num = this._option.curTabId;
            var data = this._option.tabData;
            $.each(data, function (i, entry) {
                if (i > 0) {
                    html += '<div class="line">|</div>';
                }
                if (num == i + 1 && num != 0) {
                    html += '<a class="item on item' + entry.Id + '"  data-id="' + entry.Id + '" data-page="' + entry.TotalCount + '" href="javascript:;">' + entry.PrizeName + '</a>';
                } else {
                    html += '<a class="item item' + entry.Id + '"  data-id="' + entry.Id + '"  data-page="' + entry.TotalCount + '" href="javascript:;">' + entry.PrizeName + '</a>';
                }
            });
            this._option.$tabItem.html(html);
        },
        _bindTab: function () {
            var _this = this;
            // 绑定tab一栏，初始化当前页面数据
            var $item = this._option.$tabItem;

            $item.find('.item').click(function () {
                var curItemId = $(this).attr('data-id');
                if (curItemId == _this._option.curTabId) {
                    return;
                }
                // console.log('绑定：' + curItemId);

                _this._option.curTabId = curItemId;
                $(this).addClass('on');
                $(this).siblings().removeClass('on');
                // 初始化
                _this._listAjaxfn({
                    curTabId: curItemId,
                    pageNum: 1
                });
            });
        }
    };

    function init() {
        window.MyReward = MyReward;
    }

    module.exports = {
        init: init
    };
});