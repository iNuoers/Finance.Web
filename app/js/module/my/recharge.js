/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-05 13:52:49 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-04 15:38:45
 */
'use strict';

require('css_path/my/recharge')
require('css_path/my/common')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')

fjw.pc.recharge = {
    init: function () {
        this.initEvent()
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;
        core.User.requireLogin(function () {
            me.method.getInfo()
            me.method.handelForm()
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
                beforeSend: function () {
                }
            });
        },
        getInfo: function () {
            var member = core.User.getInfo();
            var bank = core.Bank.bankDetail.find(function (x) {
                return x.code === member.payCode
            });

            $('.balance').html(Math.floor(member.balance * 100) / 100)
            $('.banklogo').addClass('banklogo-' + bank.logocss)
            $('.card-info').html(member.bankCardId)
            $('#onceLimitAmount').html(member.dayPrice)
            $('#dayLimitAmount').html(member.singlePrice)
            $('#rechargeTips .inner').html(member.bankRemark).show()
        },
        handelForm: function () {
            var me = fjw.pc.recharge,
                match = /^[0-9]*$/,
                payBtn = $('#submitBtn'),
                amountIn = $('#amountQuickPay');

            var checkAmount = function (amount) {
                var me = fjw.pc.recharge;
                var amountIn = $('#amountQuickPay'),
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
                amountIn.val(amount);

                if (isNaN(amount) || amount == '') {
                    msg = '请输入充值金额';
                } else if (amount > 1000000) {
                    msg = '因政策限制，单笔充值金额不得大于100万元';
                } else if (amount < 10) {
                    msg = '充值金额不能低于10元';
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
            });

            payBtn.on('click', function () {
                if (checkAmount(amountIn.val())) {
                    var req = {
                        M: api.method.recharge,
                        D: JSON.stringify({
                            RechargeAmount: amountIn.val()
                        })
                    };
                    me.method.ajax(JSON.stringify(req), function (data) {
                        debugger
                        var $form = $('<form method="post" action="https://api.fangjinnet.com/api" target="_blank" style="display:none"></form>');
                        $form.append('<input type="hidden" name="BankCardId" value="' + data.BankCardId + '"/>');
                        $form.append('<input type="hidden" name="BankCode" value="' + data.BankCode + '"/>');
                        $form.append('<input type="hidden" name="CardId" value="' + data.CardId + '"/>');
                        $form.append('<input type="hidden" name="Id" value="' + data.Id + '"/>');
                        $form.append('<input type="hidden" name="Mobile" value="' + data.Mobile + '"/>');
                        $form.append('<input type="hidden" name="OrderNo" value="' + data.OrderNo + '"/>');
                        $form.append('<input type="hidden" name="RealName" value="' + data.RealName + '"/>');
                        $form.append('<input type="hidden" name="RechargeAmount" value="' + data.RechargeAmount + '"/>');
                        $form.appendTo($('body'));
                        $form.submit();
                    })
                }
            })
        }
    }
}

$(function () {
    fjw.pc.recharge.init()
})