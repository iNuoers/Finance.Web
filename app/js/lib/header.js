/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-13 20:20:35 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-11 09:17:15
 */
'use strict'

var core = require('js_path/lib/pc.core.js')
!function ($) {
    var header = function () {
        this.quickMenu = $('.top-nav .site-nav');
        this.root = $('.top-nav');
        this.isLogin = $('.F_isLogin');
        this.unLogin = $('.F_unLogin');
        this.userIcon = $('.F_userIcon');
        this.userPhone = $('.F_userPhone');
        this.logout = $('.F_out');
        this.init();
    };
    header.prototype.init = function () {

        var me = this, root = me.root;

        this.adaptive()

        core.User.isLogin()
        window.user.isLogin ? this.setLoginedMenu() : this.setUnloginMenu();

        var o = encodeURIComponent(window.location.href);
        $('[data-selector="link-login"]', root).on('click', function () {
            window.location.href = $(this).attr('href') + '?refPath=' + o;
            return false
        });
        $('[data-selector="link-register"]', root).on('click', function () {
            window.location.href = $(this).attr('href') + '?refPath=' + o;
            return false
        });
        $('[data-selector="link-logout"]', root).on('click', function () {
            core.User.logOut()
            window.location.reload();
        });
    }
    header.prototype.setUnloginMenu = function () {
        var me = this;
        me.unLogin.css({
            visibility: 'visible'
        });
        me.logout.hide();
        me.isLogin.hide();
        me.userPhone.html('尊敬的用户');
    }
    header.prototype.setLoginedMenu = function () {
        var me = this;
        var html = ['<a href="javascript:;" data-href="/my/index.html">' + core.Cookie.get('f.phone') + '，<a class="F_out" href="javascript:;" data-selector="link-logout">退出</a>'].join("");

        me.logout.show();
        me.unLogin.hide();
        me.isLogin.html(html).show();

        var user = JSON.parse(core.Storage.getItem('f.ui.cache'))
        if (!user.member.realNameAuthen == 1) {
            $('#sub_nav_bindcard a').attr('data-href', '/my/my-card.html')
        } else {
            $('#sub_nav_bindcard a').attr('data-href', '/my/bindcard.html')
        }
    }
    header.prototype.adaptive = function () {
        //不跳转
        if (window.location.href.indexOf("goType=pcWeb") > 0) {
            window.localStorage.noGoMweb = new Date().getTime() + 30 * 60 * 1000;
        }

        if (core.Browser.Mobile) {
            var url = $("link[rel='alternate']").attr("href");
            var isGo = true;
            if (window.localStorage && window.localStorage.noGoMweb) {
                //半个小时过期销毁
                if (window.localStorage.noGoMweb > new Date().getTime()) {
                    isGo = false;
                } else {
                    core.Storage.delItem('noGoMweb')
                }
            }
            if (url != null && isGo) {
                window.location.href = url;
            }
        }
    }
    window.HeaderApply = new header
}(jQuery);