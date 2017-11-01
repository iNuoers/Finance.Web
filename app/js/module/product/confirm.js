/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-06 10:03:07 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-29 13:43:47
 */

// http://www.jq22.com/demo/citySelect201708080834/   卡券选择
// http://www.jq22.com/demo/ansel_select201708250034/

'use strict';
require('css_path/product/confirm.css')
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')

var _user = require('js_path/service/user-service.js')
var _product = require('js_path/service/product-service.js')

fjw.pc.confirm = {
    cache: {
        detail: null,
        id: core.String.getQuery('id'),
        type: core.String.getQuery('type'),
        rate: core.String.getQuery('rate'),
        days: core.String.getQuery('days'),
        amount: core.String.getQuery('amount')
    },
    doms: {
        btnBuy: '',
        rate: $('#rate'),
    },
    init: function () {
        this.onLoad()
        this.initEvent()
        this.renderTradePwd()
        this.method.handelForm()
    },
    onLoad: function () {
        var me = this;

        $('.J-input').val(me.cache.amount)

        if (Number(me.cache.id) > 0)
            me.method.getDetail()
    },
    initEvent: function () {
        var me = this;
        $('#nav_invest').addClass('active');
    },
    renderTradePwd: function () {
        var payPassword = $("#payPassword_container"),
            _this = payPassword.find('i'),
            k = 0, j = 0, l = 0,
            password = '',
            _cardwrap = $('#cardwrap');

        //点击隐藏的input密码框,在6个显示的密码框的第一个框显示光标
        payPassword.on('focus', "input[name='payPassword_rsainput']", function () {
            if (payPassword.attr('data-busy') === '0') {
                //在第一个密码框中添加光标样式
                _this.eq(k).addClass("active");
                _cardwrap.css('visibility', 'visible');
                payPassword.attr('data-busy', '1');
            }
        });

        //change时去除输入框的高亮，用户再次输入密码时需再次点击
        payPassword.on('change', "input[name='payPassword_rsainput']", function () {
            _cardwrap.css('visibility', 'hidden');
            _this.eq(k).removeClass("active");
            payPassword.attr('data-busy', '0');
        }).on('blur', "input[name='payPassword_rsainput']", function () {
            _cardwrap.css('visibility', 'hidden');
            _this.eq(k).removeClass("active");
            payPassword.attr('data-busy', '0');
        });

        //使用keyup事件，绑定键盘上的数字按键和backspace按键
        payPassword.on('keyup', "input[name='payPassword_rsainput']", function (e) {
            var e = (e) ? e : window.event;

            //键盘上的数字键按下才可以输入
            if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                k = this.value.length;//输入框里面的密码长度
                l = _this.size();//6

                for (; l--;) {
                    //输入到第几个密码框，第几个密码框就显示高亮和光标（在输入框内有2个数字密码，第三个密码框要显示高亮和光标，之前的显示黑点后面的显示空白，输入和删除都一样）
                    if (l === k) {
                        _this.eq(l).addClass("active");
                        _this.eq(l).find('b').css('visibility', 'hidden');

                    } else {
                        _this.eq(l).removeClass("active");
                        _this.eq(l).find('b').css('visibility', l < k ? 'visible' : 'hidden');
                    }

                    if (k === 6) {
                        j = 5;
                        $('.J-order').removeClass('disabled')
                    } else {
                        j = k;
                    }
                    $('#cardwrap').css('left', j * 30 + 'px');
                }
            } else {
                //输入其他字符，直接清空
                var _val = this.value;
                this.value = _val.replace(/\D/g, '');
            }
        });
    },
    method: {
        handelForm: function () {
            var me = fjw.pc.confirm,
                match = /^[0-9]*$/,
                payBtn = $('.J-order'),
                password = $('#payPassword_rsainput');

            var checkPwd = function () {
                var pwd = password.val(), msg = '';
                if (pwd == '' || pwd == null) {
                    msg = '请输入交易密码';
                }
                if (!match.test(pwd)) {
                    msg = '密码只能为数字';
                }
                if (pwd.length > 6 || pwd.length < 6) {
                    msg = '交易密码为6为数字';
                }
                if (msg != '') {
                    $('.err-tips').html(msg);
                    password.trigger('focus')
                    return false;
                }
                return true;
            }

            password.on('keyup', function () {
                $('.err-tips').html('');
            });

            payBtn.on('click', function () {
                var pwd = password.val();
                if (!$('.J-order').hasClass('disabled') && checkPwd()) {
                    var param = {
                        IncomeId: 0,
                        CashId: 0,
                        ProductId: me.cache.id,
                        TradingPassword: pwd,
                        Share: me.cache.amount
                    };
                    _product.productBuy(JSON.stringify({
                        M: api.method.buy,
                        D: JSON.stringify(param)
                    }), function (res) {
                        var result = JSON.parse(res);
                        window.location.href = core.Env.domain + core.Env.wwwRoot + '/product/result.html?id=' + result.Id;
                    }, function (res) {
                        $('.err-tips').html(res)
                        $('.J-order').removeClass('disabled')
                    }, function () {
                        $('.J-order').addClass('disabled')
                    }, function () {
                        $('.J-order').removeClass('disabled')
                    })
                }
            })
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
        calculIncome: function () {
            var me = fjw.pc.confirm
                , val = me.cache.amount
                , detail = me.cache.detail
                , html = ''
                , income = 0;

            if (detail.ProductTypeParentId == 2) {
                income = val * detail.RemainDays / 365 * (detail.IncomeRate) / 100
                html += income.toFixed(2);
            } else {
                income = val * 1 / 365 * detail.IncomeRate / 100;
                income < 0.01 ? html += '不足0.01' : html += Math.floor(income * 100) / 100;
            }

            return html;
        },

        /**
         * 
         */
        getDetail: function () {
            var me = fjw.pc.confirm;

            var param = {
                M: api.method.productDetail,
                D: JSON.stringify({
                    'ProductId': me.cache.id
                })
            };

            _product.productDetail(JSON.stringify(param), function (json) {
                var data = JSON.parse(json), html = '';

                me.cache.detail = JSON.parse(json);

                $('.name').html(data.Title)
                $('#rate').html(data.IncomeRate.toFixed(2))
                $('#startPrice').html(data.StartBuyPrice)
                $('#incomeFlow').html(data.StartDrawDateText)
                $('#incomeRate').html(me.method.calculIncome())
                if (data.ProductTypeParentId == 2) {
                    $('#remainDays').html(data.RemainDays + '天')
                    $('#dueDate').html(data.DueDateText)
                } else {
                    $('#remainDays').parent().remove()
                    $('#dueDate').parent().remove()
                }
            });
        }
    }
}

$(function () {
    fjw.pc.confirm.init();
});
