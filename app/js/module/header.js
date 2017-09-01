'use strict';

var user = require('../service/user-service.js')
    , _user = user._user
    , _f = user._f;

// 导航
var nav = {
    init: function () {

        this.bindEvent();
        this.loadUserInfo();
        this.loginTimeout();

        return this;
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
            _user.logout();
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
    bindEvent: function () {
        var _this = this;

        if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0) {
            $('input').autocomplete = 'off';
        }

        _this.scrollEvent();

        // 登录点击事件
        $('.js-login').click(function () {
            _f.doLogin();
        });
        // 注册点击事件
        $('.js-register').click(function () {
            window.location.href = './user-register.html';
        });
        // 退出点击事件
        $('.js-logout').click(function () {
            _user.logout(function (res) {
                window.location.reload();
            }, function (errMsg) {
                _f.errorTips(errMsg);
            });
        });
    },
    scrollEvent: function () {
        var nav = $('.wdg-fjw-second-header');
        $(window).bind("scroll", function () {
            var t = $(window).scrollTop();
            if (t > 100) {
                nav.addClass("nav-hold");
            } else {
                nav.removeClass("nav-hold")
            }
        });
    },
    // 加载用户信息
    loadUserInfo: function () {

        var $header = $('.site-nav'),
            $isLogin = $('.F_isLogin'),
            $unLogin = $('.F_unLogin'),
            $userIcon = $('.F_userIcon'),
            $userPhone = $('.F_userPhone'),
            $logout = $('.F_out');

        //window.localStorage.getItem('f_ui_cache')
        if (_f.cookie.get('F.token')) {

            var user = JSON.parse(_f.storage.getItem('f_ui_cache'));

            var html = ['<a href="https://www.lmlc.com/web/page/login/fund/overview.html?from=home_nav" target="_blank">您好，' + user.member.phone
                + "&nbsp;&nbsp;</a>", '<a class="F_out" href="javascript:;">退出</a>'].join("");

            $logout.show();
            $unLogin.hide();
            $isLogin.html(html).show();
            $userPhone.html(user.member.phone);
            $userIcon.attr('src', user.member.headPhoto);

            _f.cache.isLogin = true;
            _f.cache.glb_user_phone = user.member.phone;
            _f.cache.glb_user_avator = user.member.headPhoto;
            _f.cache.glb_user_token = _f.cookie.get('F.token');

        } else {
            $unLogin.css({
                visibility: 'visible'
            });
            $logout.hide();
            $isLogin.hide();
            $userPhone.html('尊敬的用户');

            _f.cache.isLogin = false;
            _f.cache.glb_user_token = '';
            _f.cache.glb_user_phone = '';
            _f.cache.glb_user_avator = '';
        }
    }
};
nav.init();
module.exports = {
    _f: _f,
    _user: _user
};