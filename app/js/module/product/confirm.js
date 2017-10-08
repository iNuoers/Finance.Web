/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-06 10:03:07 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-08 14:48:33
 */

// http://www.jq22.com/demo/citySelect201708080834/   卡券选择
// http://www.jq22.com/demo/ansel_select201708250034/

'use strict';
require('css_path/product/confirm.css')
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

var _api = require('js_path/lib/f.data.js')
var _head = require('js_path/lib/f.head.js')
var _core = require('js_path/lib/f.core.js')
var _user = require('js_path/service/user-service.js')
var _product = require('js_path/service/product-service.js')

fjw.pc.confirm = {
    cache: {
        id: _core.Tools.getUrlParam('id'),
        amount: _core.Tools.getUrlParam('amount'),
        type: _core.Tools.getUrlParam('type'),
        rate: _core.Tools.getUrlParam('rate'),
        days: _core.Tools.getUrlParam('days')
    },
    doms: {
        btnBuy: '',
        rate: $('#rate'),
    },
    init: function () {
        this.onLoad()
        this.initEvent()
    },
    onLoad: function () {
        var _this = this;
        //_this.initIncome();
        if (Number(_this.cache.id) > 0)
            _this.initDetail()
    },
    initEvent: function () {
        var me = this;
        $('#nav_invest').addClass('active');

        var payPassword = $("#payPassword_container"),
            _this = payPassword.find('i'),
            k = 0, j = 0, l = 0,
            password = '',
            _cardwrap = $('#cardwrap');
        //点击隐藏的input密码框,在6个显示的密码框的第一个框显示光标
        payPassword.on('focus', "input[name='payPassword_rsainput']", function () {

            var _this = payPassword.find('i');
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
    },
    initIncome: function () {
        var _this = this, income = 0;
        if (_this.cache.type == 2) {
            income = val * _this.cache.days / 365 * _this.cache.rate / 100
            html += income.toFixed(2) + '元';
        } else {
            income = val * 1 / 365 * _this.cache.rate / 100;
            income < 0.01 ? html += '不足0.01元' : html += Math.floor(income * 100) / 100 + '元';
        }
    },
    initDetail: function () {
        var _this = this;

        if (_core.cookie.get($.base64.btoa('f.token')) != null) {
            _user.getUserInfo(JSON.stringify({
                M: _api.method.getMemberInfo,
            }), function () {
                _this.getDetail();
            }, function () {
                alert('系统异常,请刷新重试！')
            });
        } else {
            _this.getDetail();
        }
    },
    getDetail: function () {
        var _this = this;

        var param = {
            M: _api.method.productDetail,
            D: JSON.stringify({
                'ProductId': _this.cache.id
            })
        };

        _product.productDetail(JSON.stringify(param), function (json) {
            var data = JSON.parse(json), html = '';

            _this.cache.detail = JSON.parse(json);

            $('.name').html(data.Title)

        }, function () {

        });
    },
}

$(function () {
    fjw.pc.confirm.init();
});
