/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-13 20:20:35 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-16 10:58:34
 */
var FJW = require('js_path/lib/pc.core.js')
!function ($) {
    var header = function () {
        this.quickMenu = $('#header .site-nav');
        this.root = $('#header');
        this.isLogin = $('.F_isLogin');
        this.unLogin = $('.F_unLogin');
        this.userIcon = $('.F_userIcon');
        this.userPhone = $('.F_userPhone');
        this.logout = $('.F_out');
        this.init();
    };
    header.prototype.init = function () {
        var me = this, root = me.root;

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
            window.location.href = $(this).attr('href') + '?refPath=' + FJW.Env.wwwRoot;
            return false
        });
        me.onload()
    }
    header.prototype.onload = function () {
        var me = this,
            n = me.root;
        FJW.User.isLogin()
        console.log(window.user.isLogin)
        return window.user.isLogin ? this.setLoginedMenu() : this.setUnloginMenu();
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
        var html = ['<a href="javascript:;" data-href="">' + FJW.Cookie.get('f.phone') + '，<a class="F_out" href="javascript:;">退出</a>'].join("");

        me.logout.show();
        me.unLogin.hide();
        me.isLogin.html(html).show();
    }
    window.HeaderApply = new header
}(jQuery);