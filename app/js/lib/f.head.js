/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-07-21 16:35:42
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-08 19:41:33
 */

'use strict';
require('js_path/plugins/base64/jquery.base64.js')
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

var _core = require('js_path/lib/f.core.js');
var _api = require('js_path/lib/f.data.js');
var _user = require('js_path/service/user-service.js');

var Core = {
    init: function () {
        this.initLink();
        this.initUserInfo();
        this.loginTimeout();
        this.initTips();
    },
    initUserInfo: function () {
        var _this = this, user = null;

        if (_core.cookie.get($.base64.btoa('f.token'))) {
            _user.getUserInfo(JSON.stringify({
                M: _api.method.getMemberInfo,
            }), function (json) {
                user = JSON.parse(json);

                window.cache = json;

                window.user = {
                    isLogin: true,
                    token: user.token,
                    isBuy: user.isBuy,
                    phone: user.phone,
                    balance: user.balance,
                    avator: user.headPhoto,
                    isInvite: user.friendStatus,
                    isAuthen: user.realNameAuthen,
                    hasPaypwd: user.existsTradePswd
                };

                _this.initNav();
            }, function () {
                window.user.isLogin = false;
                _this.initNav();
            });
        }
    },
    initNav: function () {
        var _this = this;

        var $header = $('.site-nav'),
            $isLogin = $('.F_isLogin'),
            $unLogin = $('.F_unLogin'),
            $userIcon = $('.F_userIcon'),
            $userPhone = $('.F_userPhone'),
            $logout = $('.F_out');

        if (window.user.isLogin) {
            var html = ['<a href="" target="_blank">您好，' + user.phone + "&nbsp;&nbsp;</a>", '<a class="F_out" href="javascript:;">退出</a>'].join("");

            $logout.show();
            $unLogin.hide();
            $isLogin.html(html).show();
            $userPhone.html(user.phone);
            $userIcon.attr('src', user.headPhoto);

        } else {
            $unLogin.css({
                visibility: 'visible'
            });
            $logout.hide();
            $isLogin.hide();
            $userPhone.html('尊敬的用户');

            window.user.isLogin = false;
            _core.storage.delItem($.base64.btoa('f.ui.cache'));
        }
    },
    loginTimeout: function () {
        //登录超时20分钟
        var setout = 20 * 60 * 1000;
        var myTime = setTimeout(function () { timeOut(); }, setout);
        top.layerout = {};
        top.layerout.resetTime = function () {
            clearTimeout(myTime);
            myTime = setTimeout(function () { timeOut(); }, setout);
        }

        function timeOut() {
            user.logout();
            alert('您已超时 请重新登录')
            //window.location.reload();
        }

        $(document).off();

        $(document).keydown(function (event) {
            top.layerout.resetTime();
        }).click(function (event) {
            top.layerout.resetTime();
        });
    },
    cache: {
        isBuy: 0,
        balance: 0,
        isInvite: 0,
        isAuthen: 0,
        isLogin: false,
        glb_user_phone: '',
        glb_user_token: '',
        glb_user_avator: ''
    },
    // 统一登录处理
    doLogin: function (url) {
        var _this = this;

        if (window.user.isLogin) {
            // 已经登录 点击直接进入页面
            window.location.href = url;
        } else {
            window.location.href = 'http://192.168.31.243:8010/dist/view/user-login.html?redirect=' + encodeURIComponent(window.location.href);
        }
    },
    initLink: function () {
        var _this = this;
        $(".main-section,.main-wrap").delegate("a[data-href],div[data-href]", "click", function (e) {
            if ($(this).data("href") && !$(this).data("preventdefault")) {
                e.stopPropagation();
                var url = $(this).data("href");
                url = url.indexOf('http://') > 0 ? url : App.webUrl + url;
                var i = $(this).data("title"), needLogin = $(this).data("needlogin");

                if (needLogin) {
                    return login(url);
                }
                if (url.indexOf('his') >= 0)
                    window.history.go(-1);
                else
                    location.href = url;
            }
        });
    },
    initTips: function () {
        var _this = this;
        $('.f-tips').hover(function (e) {
            var $target = $(this).closest('.f-tips');
            layer.tips($target.data('tips'), $target, {
                tips: [3, '#fff'],
                time: 0,
                skin: 'index-trip',
                area: ['180px'],
                success: function (layero, index) {
                    var left = parseFloat(layero.css('left').replace(/px/g, '')) + 10;
                    layero.css('left', left)
                }
            })
        })
    }
}

$(function () {
    // 用于普通页面的跨框架脚本攻击(CFS)防御
    if (top.location != self.location) top.location.href = self.location;

    Core.init();
})