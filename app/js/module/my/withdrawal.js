/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-05 13:52:49 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-04 15:38:33
 */
'use strict';

require('css_path/my/recharge')
require('css_path/my/withdrawal')
require('css_path/my/common')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')

fjw.pc.withdrawal = {
    init: function () {
        this.initEvent()
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;
        core.User.requireLogin(function () {
            me.method.handelForm()
            me.method.renderTradePwd()
            me.method.withDrawalInfo()
        })
    },
    initEvent: function () {
        $("#sub_nav_paydeposit").addClass('active');
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
                error: function (msg) {
                    $('.err-tips').html(msg);
                }
            });
        },
        handelForm: function () {
            var me = fjw.pc.withdrawal,
                match = /^[0-9]*$/,
                payBtn = $('#submitBtn'),
                amountIn = $('#withdrawBalance'),
                password = $('#payPassword_rsainput');

            var checkPwd = function () {
                var pwd = password.val(), msg = '';
                if (pwd == '' || pwd == null) {
                    msg = '请输入交易密码';
                } else if (!match.test(pwd)) {
                    msg = '密码只能为数字';
                } else if (pwd.length > 6 || pwd.length < 6) {
                    msg = '交易密码为6为数字';
                }
                if (msg != '') {
                    $('.err-tips').html(msg);
                    password.trigger('focus')
                    return false;
                }
                return true;
            }

            var checkAmount = function (amount) {
                var me = fjw.pc.withdrawal;
                var amountIn = $('#withdrawBalance'),
                    match = /^[0-9]*$/;
                var msg = '';

                amount = amount.replace(/^[\.,0]/g, ""); //清除首位为.
                amount = amount.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
                amount = amount.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
                amount = amount.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                amount = amount.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数  
                if (amount.indexOf(".") < 0 && amount != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                    amount = parseFloat(amount);
                }
                if (amount > $('.balance').data('balance')) {
                    amount = $('.balance').data('balance');
                }
                amountIn.val(amount);

                if (isNaN(amount) || amount == '') {
                    msg = '请输入提现金额';
                    $('.poundage').text('￥0')
                } else if (amount > 1000000) {
                    msg = '因政策限制，单笔交易金额不得大于100万元';
                } else if (amount < 10) {
                    msg = '提现金额不能低于10元';
                }

                if (msg != '') {
                    $('.err-tips').html(msg);
                    amountIn.focus()
                    return false;
                }
                $('.err-tips').html('');
                return true;
            }

            amountIn.on('keyup blue input', function () {
                checkAmount(amountIn.val())
                me.method.calcPoundage(amountIn.val())
            });

            password.on('keyup', function () {
                $('.err-tips').html('');
            });

            payBtn.on('click', function () {
                var pwd = password.val();
                if (checkAmount(amountIn.val()) && checkPwd()) {
                    var param = {
                        TradingPassword: pwd,
                        Amount: amountIn.val(),
                        SetPwdIfEmpty: pwd
                    };
                    var req = {
                        M: api.method.withdraw,
                        D: JSON.stringify(param)
                    };

                    me.method.ajax(JSON.stringify(req), function (data) {
                        window.location.href = core.Env.domain + core.Env.wwwRoot + '/my/paydeposit.html'
                    })
                }
            })
        },
        withDrawalInfo: function () {
            var me = fjw.pc.withdrawal;

            me.method.ajax(JSON.stringify({
                M: api.method.withdrawInfo
            }), function (data) {
                var bank = core.Bank.bankDetail.find(function (x) {
                    return x.code === data.BankCode
                });

                $('.tel').text('客服电话：' + bank.tel)
                $('#standAmount').val(data.StandAmount)
                $('.num').html(core.String.formatBank(data.RealCardNumber, true))
                $('.balance').html('￥' + data.Balance).attr('data-balance', data.Balance)
                $('#withdrawBalance').attr('placeholder', '免手续费金额 ' + data.StandAmount)
                $('.banklogo').addClass('banklogo-' + bank.logocss).attr('title', data.BankName)
                $('.jBank').attr('data-cardid', data.RealCardNumber).attr('data-code', data.BankCode)
            })
        },
        calcPoundage: function (amount) {
            var me = this,
                price = 0,
                poundage = 0,
                standAmount = $('#standAmount').val();

            if (amount > standAmount) {
                price = amount - standAmount;
                poundage = price * 0.003;
                poundage = poundage < 2 ? 2 : poundage;
                poundage = (Math.floor(poundage * 100)) / 100;
                $('.poundage').text('￥' + poundage)
            }
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
        }
    }
}

$(function () {
    fjw.pc.withdrawal.init()
})