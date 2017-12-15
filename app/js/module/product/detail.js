/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-07 18:06:12 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-11 11:19:09
 */

'use strict';
require('css_path/product/detail.css')
require('js_path/plugins/pagination/pagination.css')
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')

var _product = require('js_path/service/product-service.js')
var _pagination = require('js_path/plugins/pagination/jquery.pagination.js')

fjw.pc.product_detail = {
    query: {
        id: core.String.getQuery('id'),
        first: true,
        member: null,
        detail: null,
        recordData: {
            page: 1,
            size: 15
        }
    },
    init: function () {
        this.onLoad()
        this.bindEvent()
    },
    onLoad: function () {
        var me = this;
        $('#nav_invest').addClass('active');
        if (Number(me.query.id) > 0)
            me.method.getDetail()
        else
            window.location.href = core.Env.domain + core.Env.wwwRoot + '/product/index.html';
    },
    bindEvent: function () {
        var me = this;

        // tab选项卡添加事件
        me.method.tabAddEvent($('.tab-nav'), $('.tab-cont'));
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, (data != '' && JSON.parse(data)))
                },
                error: function () {

                }
            });
        },
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
                        window.location.href = core.Env.domain + core.Env.wwwRoot + "/my/bindcard.html";
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
            var me = fjw.pc.product_detail;
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
                msg = '可用余额不足 <a class="fcblue" href="javascript:;" data-href="/my/recharge.html" data-needlogin="true">立即充值</a>';
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
            var me = fjw.pc.product_detail,
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

                if ($(this).hasClass('disabled'))
                    return

                var amount = amountIn.val();
                var res = handelAmount();
                var stats = me.method.checkUser();
                if (res && stats) {
                    window.location.href = core.Env.domain + core.Env.wwwRoot + '/product/confirm.html?id=' + me.query.id + '&amount=' + amount + '&coupon_type=' + 'coupon_id=';
                }
                return false;
            })
        },

        /**
         * 
         */
        calculIncome: function () {
            var me = fjw.pc.product_detail
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
            var me = fjw.pc.product_detail;
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
        getDetail: function () {
            var me = fjw.pc.product_detail;
            if (window.user.isLogin) {
                me.query.member = core.User.getInfo();
            }
            var param = {
                M: api.method.productDetail,
                D: JSON.stringify({
                    'ProductId': me.query.id
                })
            };

            me.method.ajax(JSON.stringify(param), function (data) {
                require('js_path/lib/f.time.js')
                var html = '',
                    tpl = require('view_path/product/detail.string'),
                    doT = require('js_path/plugins/template/template.js');

                me.query.detail = data;
                html = doT(tpl, data);

                $('.product-info').html(html);
                $('#investRisk').html(data.Security);
                $('#investDetail').html(data.Description);

                $.countdown($('.F-buy'), {
                    callback: function (ele) {

                    }
                });

                me.method.handelForm()

                // 登录功能
                $('.dr-inner [data-selector="login"]').on('click', function () {
                    
                    core.User.requireLogin(function () {
                        location.reload();
                    });
                    return false;
                });

            });
        },

        /**
         * 投资记录
         */
        getRecord: function () {
            var me = fjw.pc.product_detail;
            var param = {
                M: api.method.productBuyRecord,
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

            me.method.ajax(JSON.stringify(param), function (data) {
                var html = '',
                    doT = require('js_path/plugins/template/template.js');

                if (data.grid.length > 0) {
                    $(".page").hide();
                    $('.record-list').html('');

                    data.grid.forEach(function (rows, index) {
                        if (rows.DeviceType === 1) {
                            rows.title = "安卓客户端"
                            rows.device = "icon-android";
                        }
                        else if (rows.DeviceType === 2) {
                            rows.title = "苹果客户端"
                            rows.device = "icon-apple";
                        }
                        else if (rows.DeviceType === 3) {
                            rows.title = "电脑网页版"
                            rows.device = "icon-pc";
                        }
                        else if (rows.DeviceType === 4) {
                            rows.title = "微信端"
                            rows.device = "icon-weixin";
                        } else {
                            rows.title = "手机端"
                            rows.device = "icon-mobile";
                        }
                        rows.share = core.String.numberFormat(rows.amount);
                    });

                    var tpl = '<%if(grid.length>0){%>' +
                        '          <%for(i = 0; i < grid.length; i ++) {%>' +
                        '          <% var data = grid[i]; %>' +
                        '          <li>' +
                        '              <div class="left"><span><%= data.number %></span></div>' +
                        '              <div class="middle"><%= data.phone %></div>' +
                        '              <div class="middle">￥<%= data.share %></div>' +
                        '              <div class="middle"><%= data.buyTime %></div>' +
                        '              <div class="right">' +
                        '                  <i class="ico-inline <%= data.device %>" title="<%= data.title %>"></i>' +
                        '              </div>' +
                        '          </li>' +
                        '     <%}%>' +
                        '<%}%>';

                    html = doT(tpl, data);

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
            var me = fjw.pc.product_detail;

            var param = {
                M: api.method.productBuyRank,
                D: JSON.stringify({
                    'ProductId': me.query.id
                })
            };

            me.method.ajax(JSON.stringify(param), function (data) {
                var html = '',
                    doT = require('js_path/plugins/template/template.js');

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
                        rows.share = core.String.numberFormat(rows.Shares);
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

                    html = doT(tpl, data);

                    $('.rank-list').html(html);
                }
            });
        }
    }
}

$(function () {
    fjw.pc.product_detail.init()
});
