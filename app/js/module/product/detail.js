/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-07 18:06:12 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-08 14:36:45
 */
'use strict';
require('css_path/product/detail.css')
require('js_path/plugins/pagination/pagination.css')
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

var _api = require('js_path/lib/f.data.js')
var _head = require('js_path/lib/f.head.js')
var _core = require('js_path/lib/f.core.js')
var _time = require('js_path/lib/f.time.js')
var _tips = require('js_path/lib/f.tips.js')
var _coupon = require('js_path/lib/f.coupon.js')
var _user = require('js_path/service/user-service.js')
var _product = require('js_path/service/product-service.js')
var _template = require('js_path/plugins/template/template.js')
var _pagination = require('js_path/plugins/pagination/jquery.pagination.js')


fjw.pc.product_detail = {
    init: function () {

    },
    method: {

    }
}

var page = {
    query: {
        id: _core.Tools.getUrlParam('id'),
        first: true,
        detail: null,
        recordData: {
            page: 1,
            size: 15
        }
    },
    init: function () {
        this.onLoad()
        this.listenEvent()
    },
    onLoad: function () {
        var me = this;

        $('#nav_invest').addClass('active');

        if (Number(me.query.id) > 0)
            me.method.initDetail()
    },
    listenEvent: function () {
        var me = this;

        // 气泡框
        $('.tool-tips').tips();

        // tab选项卡添加事件
        me.method.tabAddEvent($('.tab-nav'), $('.tab-cont'));

    },
    method: {
        /**
         * 
         */
        checkUser: function () {
            if (window.user) {
                if (!user.isLogin) {
                    return login(), false;
                }
                if (user.isAuthen == 0) {
                    return layer.confirm('<i class="f-s-18 tip_txt">为保障资金安全，请先完善实名认证信息</i>', function () {
                        window.location.href = App.webUrl + "/my/bindcard.html";
                    }), false;
                }
            } else {
                // 用户信息出错
            }
            return true;
        },

        /**
         * 
         */
        checkAmount: function (amount) {
            var me = page;
            var detail = me.query.detail,
                amountIn = $('#investAmount'),
                match = /^[0-9]*$/;
            var msg = '';

            if (!match.test(amount)) {
                amount = amount.substring(0, amount.length - 1);
            }
            if (amount > detail.RemainingShares) {
                amount = detail.RemainingShares;
            }
            amountIn.val(amount);

            if (isNaN(amount) || amount == '') {
                msg = '请输入投资金额';
            } else if (amount < detail.StartBuyPrice) {
                msg = '投资金额不能小于' + detail.StartBuyPrice;
            } else if (amount % detail.MultiplePrice > 0) {
                msg = '投资金额递增金额为' + detail.MultiplePrice + '元';
            } else if (amount > detail.MaxBuyPrice) {
                msg = '投资金额不能大于' + detail.MaxBuyPrice;
            } else if (amount > user.balance) {
                msg = '可用余额不足 <a class="f-color-blue-text" href="javascript:;" data-href="../../view/my/recharge.html" data-needlogin="true">立即充值</a>';
            }

            if (msg != '') {
                return { msg: msg, code: -1 };
            }
            return { msg: '', code: 0 };
        },

        /**
         * 
         */
        handelForm: function () {
            var me = page,
                all = $('#all'),
                btn = $('.F-buy'),
                amountIn = $('#investAmount');

            var showErrMsg = function (text) {
                $('.err-msg').show()
                $('.err-cnt').html(text)
                amountIn.addClass("err-input");
            }
            var hideErrMsg = function () {
                $('.err-msg').hide()
                $('.err-cnt').text('')
                amountIn.removeClass("err-input");
            }
            var handelAmount = function () {
                var amount = amountIn.val();
                var result = me.method.checkAmount(amount);

                if (result.code >= 0) {
                    hideErrMsg()
                    return true;
                }
                showErrMsg(result.msg)
                return false;
            }

            amountIn.on('keyup blue focus input', function () {
                var res = handelAmount();
                me.method.calculIncome();
            });

            $('#all').on('click', function () {

                me.method.checkUser();

                var _detail = me.query.detail,
                    remain = _detail.RemainingShares,
                    max = _detail.MaxBuyPrice,
                    start = _detail.StartBuyPrice,
                    balance = user.balance.toFixed(2),
                    price = 0;

                if (remain < balance && remain < max) {
                    price = remain;
                } else if (remain < balance && remain > max) {
                    price = max;
                } else {
                    price = balance;
                }
                price = parseInt(parseInt(price) / start) * start;

                amountIn.val(price)
                amountIn.focus()
            });

            btn.on('click', function () {
                var amount = amountIn.val();
                var res = handelAmount();
                var stats = me.method.checkUser();
                if (res && stats) {
                    window.location.href = App.webUrl + '/product/confirm.html?id=' + me.query.id + '&amount=' + amount + '&coupon_type=' + 'coupon_id=';
                }
                return false;
            })
        },

        /**
         * 
         */
        calculIncome: function () {
            var me = page
                , val = $('#investAmount').val()
                , detail = me.query.detail
                , html = '预计收益：'
                , income = 0;

            if (detail.ProductTypeParentId == 2) {
                income = val * detail.RemainDays / 365 * (detail.IncomeRate) / 100
                html += income.toFixed(2) + '元';
            } else {
                income = val * 1 / 365 * detail.IncomeRate / 100;
                income < 0.01 ? html += '不足0.01元' : html += Math.floor(income * 100) / 100 + '元';
            }

            $('#expectedProfit').show().html(html);
            $(".dr-tips").slideDown('500');
        },

        /**
         * 
         */
        tabAddEvent: function ($tab, $content) {
            var me = page;
            var $tabs = $tab.find('.tab-nav-item');
            var $contents = $content.find('.p-cont-main');

            $.each($tabs, function (index, val) {
                $(val).data('tab', index);
                $contents.eq(index).data('tab', index);
            });

            $tabs.on('click', function (e) {
                e.preventDefault();
                var $this = $(this);
                var index = $this.data('tab');
                $contents.eq(index).removeClass('f-hide').siblings('.p-cont-main').addClass('f-hide');
                $this.addClass('tab-nav-item-selected').siblings('.tab-nav-item').removeClass('tab-nav-item-selected');
            });

            $('#investRecord').click(function () {
                if (me.query.first) {
                    me.query.first = false;
                    me.method.getRecord();
                    me.method.getRank();
                }
            });
        },

        /**
         * 
         */
        initDetail: function () {
            var me = page;

            if (_core.cookie.get($.base64.btoa('f.token')) != null) {
                _user.getUserInfo(JSON.stringify({
                    M: _api.method.getMemberInfo,
                }), function () {
                    me.method.getDetail()
                }, function () {
                    alert('系统异常,请刷新重试！')
                });
            } else {
                me.method.getDetail()
            }
        },

        /**
         * 
         */
        getDetail: function () {
            var me = page;

            var param = {
                M: _api.method.productDetail,
                D: JSON.stringify({
                    'ProductId': me.query.id
                })
            };

            _product.productDetail(JSON.stringify(param), function (json) {
                var data = JSON.parse(json), html = '';
                var tpl = require('../../../view/product/detail.string');

                me.query.detail = JSON.parse(json);

                html = _template(tpl, data);

                $('.p-cont-top').html(html);

                $.countdown($('.F-buy'), {
                    callback: function (ele) {

                    }
                });

                me.method.handelForm()

            });
        },

        /**
         * 投资记录
         */
        getRecord: function () {
            var me = page;
            var param = {
                M: _api.method.productBuyRecord,
                D: JSON.stringify({
                    'ProductId': me.query.id,
                    'pageIndex': me.query.recordData.page,
                    'pageSize': me.query.recordData.size
                })
            };
            var renderPage = function (records) {
                $('.page').pagination(records, {
                    current_page: me.query.recordData.page - 1,
                    num_edge_entries: 1,
                    num_display_entries: 7,
                    callback: function (idx, ele) {
                        me.query.recordData.page = idx + 1;
                        me.method.getRecord();
                        return false;
                    },
                    items_per_page: me.query.recordData.size
                })
            }

            _product.productBuyRecord(JSON.stringify(param), function (json) {
                var data = JSON.parse(json), html = '';

                if (data.grid.length > 0) {
                    $(".page").hide();
                    $('.record-list').html('');

                    var tpl = '<%if(grid.length>0){%>' +
                        '          <%for(i = 0; i < grid.length; i ++) {%>' +
                        '          <% var data = grid[i]; %>' +
                        '          <li>' +
                        '              <div class="left"><span><%= data.number %></span></div>' +
                        '              <div class="middle"><%= data.phone %></div>' +
                        '              <div class="middle">￥<%= data.amount %></div>' +
                        '              <div class="middle"><%= data.buyTime %></div>' +
                        '              <div class="right ">' +
                        '                  <i class="icon_wx"></i>' +
                        '                  <img src="https://fangjinnet.com/static/images/android.png">' +
                        '              </div>' +
                        '          </li>' +
                        '     <%}%>' +
                        '<%}%>';

                    html = _template(tpl, data);

                    $('.record-list').html(html);

                    // 动画效果
                    // $(".record-list li").each(function (idx) {
                    //     $(this).addClass("animation-delay-" + idx);
                    // });

                    renderPage(data.records);

                    $(".page").show();
                }
            });
        },

        /**
         * 投资排行榜
         */
        getRank: function () {
            var me = page;

            var param = {
                M: _api.method.productBuyRank,
                D: JSON.stringify({
                    'ProductId': me.query.id
                })
            };

            _product.productBuyRank(JSON.stringify(param), function (json) {
                var data = JSON.parse(json), html = '';

                if (data.grid.length > 0) {

                    //Class 样式
                    data.grid.forEach(function (rows, index) {

                        if (index === 0)
                            rows.class = "first";
                        else if (index === 1)
                            rows.class = "second";
                        else if (index === 2)
                            rows.class = "three";
                        else {
                            //名次
                            rows.rank = index + 1;
                            rows.class = "top-bg";
                        }
                        rows.share = _core.String.numberFormat(rows.Shares);
                    });

                    var tpl = '<%if(grid.length>0){%>' +
                        '          <%for(i = 0; i < grid.length; i ++) {%>' +
                        '          <% var data = grid[i]; %>' +
                        '          <li>' +
                        '              <div class="left"><span class="<%= data.class %>"><%= data.rank %></span></div>' +
                        '              <div class="middle"><%= data.Phone %></div>' +
                        '              <div class="right">￥<%= data.share %></div>' +
                        '          </li>' +
                        '     <%}%>' +
                        '<%}%>';

                    html = _template(tpl, data);

                    $('.rank-list').html(html);
                }
            });
        }
    }
}

$(function () {
    page.init();
});
