/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-03 21:05:45 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-04 15:38:56
 */
'use strict';
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')
require('css_path/my/custody.css')
require('css_path/my/common')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')

fjw.pc.custody = {
    init: function () {
        this.initEvent()
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this, user = null;
        core.User.requireLogin(function () {
            me.method.getInfo()
        })
    },
    initEvent: function () {
        var me = this;
        $("#sub_nav_custody").addClass('active');

        var score = $(".progress-level-in").data("score"), width = score + "%";

        $(".progress-level-in").animate({
            width: width,
            speed: 1500
        })

        $('.set-phont').on('click', function () {
            layer.confirm('请联系官方客服<br>客服电话: 400-167-6880', {
                btn: ['确定'] //按钮
            }, function () {
                layer.closeAll()
            });
        })
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
            var me = fjw.pc.custody;
            var member = core.User.getInfo();

            var score = me.method.getScore(member)
            $(".safe-fraction strong").text(score);
            $(".progress-level-in").attr("data-score", score);
            me.method.animateScore()
            $('#user-phone').html(member.phone)
            $('.lastloginfo').html('上次登录时间 : ' + core.Cookie.get('f.login-time') + ' 上次登录设备 : ' + core.Cookie.get('f.login-device'))

            if (member.realNameAuthen == 0) {
                $('.btn-authen').text('去认证')
            } else {
                $('.authen-tip').addClass('f-hide')
                $('.btn-authen').text('更换银行卡')
            }

            if (!member.existsTradePswd) {
                $('.noPswd').removeClass('f-hide')
            } else {
                $('.tradpwd-tip').addClass('f-hide')
                $('.hasPswd').removeClass('f-hide')
            }

            if (member.address == '') {
                $('.set-address').text('设置')
            } else {
                $('.address-tip').addClass('f-hide')
                $('.set-address').text('修改')
            }
        },
        getScore: function (member) {
            var score = 100;
            if (!member.existsTradePswd) {
                score -= 10;
            }
            if (member.realNameAuthen == 0 || member.realNameAuthen == 0) {
                score -= 30;
            }
            if (member.address == '') {
                score -= 10;
            }
            return score;
        },
        animateScore: function () {
            var score = $(".progress-level-in").attr("data-score")
                , num = score + "%";
            $(".progress-level-in").animate({
                width: num,
                speed: 1500
            })
        }
    }
}

$(function () {
    fjw.pc.custody.init();
});