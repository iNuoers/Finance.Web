/*
* @Author: mr.ben(66623978) https://github.com/iNuoers/
* @Date:   2017-07-21 16:35:42
* @Last Modified by:   asus
* @Last Modified time: 2017-07-21 16:43:17
*/
'use strict';
require('../plugins/base64/jquery.base64.js')

var _core = require('./f.core.js');
var _user = require('../service/user-service.js');

var Core = {
    init: function () {
        this.initLink();
        this.initUserInfo();
        this.loginTimeout()
    },
    initUserInfo: function () {
        var _this = this;

        var $header = $('.site-nav'),
            $isLogin = $('.F_isLogin'),
            $unLogin = $('.F_unLogin'),
            $userIcon = $('.F_userIcon'),
            $userPhone = $('.F_userPhone'),
            $logout = $('.F_out');
        
        if (_core.cookie.get($.base64.btoa('F.token'))) {

            var user = JSON.parse(_core.storage.getItem($.base64.btoa('f.ui.cache')));

            if (user == null) return;

            var html = ['<a href="" target="_blank">您好，' + user.member.phone + "&nbsp;&nbsp;</a>", '<a class="F_out" href="javascript:;">退出</a>'].join("");

            $logout.show();
            $unLogin.hide();
            $isLogin.html(html).show();
            $userPhone.html(user.member.phone);
            $userIcon.attr('src', user.member.headPhoto);

            window.user = {
                isLogin: true,
                token: user.token,
                isBuy: user.member.isBuy,
                phone: user.member.phone,
                balance: user.member.balance,
                avator: user.member.headPhoto,
                isInvite: user.member.friendStatus,
                isAuthen: user.member.realNameAuthen,
            };

        } else {
            $unLogin.css({
                visibility: 'visible'
            });
            $logout.hide();
            $isLogin.hide();
            $userPhone.html('尊敬的用户');

            _this.cache.isBuy = 0;
            _this.cache.balance = 0;
            _this.cache.isAuthen = 0;
            _this.cache.isInvite = 0;
            _this.cache.isLogin = false;
            _this.cache.glb_user_token = '';
            _this.cache.glb_user_phone = '';
            _this.cache.glb_user_avator = '';
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
        isLogin: false,
        isAuthen: false,
        glb_user_phone: '',
        glb_user_token: '',
        glb_user_avator: ''
    },
    ajaxSet: function (cache) {

        var _this = this;

        cache = (cache === false ? false : true);
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            cache: cache
        });
        //ajax全局设置  超时时间：8秒
        $.ajaxSetup({
            timeout: 1000 * 60 * 10
        });

        /**
         * ajax请求开始时执行函数
         * event    - 包含 event 对象
         * xhr      - 包含 XMLHttpRequest 对象
         * options  - 包含 AJAX 请求中使用的选项
         */
        $(document).ajaxSend(function (event, xhr, opt) {
            if (opt.type.toLowerCase() === "post") {
                if (opt.data != null && opt.data !== "" && typeof (opt.data) !== "undefined") {
                    var data = JSON.parse(opt.data);
                    data.P = 3;
                    data.IE = false;
                    data.T = _this.cache.glb_user_token;
                    opt.data = JSON.stringify(data);
                }
            }
        });
    },
    // 统一登录处理
    doLogin: function () {
        var _this = this, url = '';

        if (window.user.isLogin) {
            // 已经登录 点击直接进入页面
            window.location.href = url;
        } else {
            window.location.href = 'http://192.168.1.53:8010/dist/view/user-login.html?redirect=' + encodeURIComponent(window.location.href);
        }
    },
    goHome: function () {
        window.location.href = '../view/index.html';
    },
    initLink: function () {
        var _this = this;
        $(".main-section,.main-wrap").delegate("a[data-href],div[data-href]", "click", function (e) {
            if ($(this).data("href") && !$(this).data("preventdefault")) {
                e.stopPropagation();
                var url = $(this).data("href");
                var i = $(this).data("title"), needLogin = $(this).data("needlogin");

                if (needLogin) {
                    return _this.doLogin(url);
                }
                if (url.indexOf('his') >= 0)
                    window.history.go(-1);
                else
                    location.href = url;
            }
        });
    }
}

$(function () {
    // 用于普通页面的跨框架脚本攻击(CFS)防御
    if (top.location != self.location) top.location.href = self.location;

    Core.init();

    Core.ajaxSet();
})