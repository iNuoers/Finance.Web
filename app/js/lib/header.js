/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-13 20:20:35 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-13 21:27:30
 */
var FJW = require('js_path/lib/pc.core.js')
!function (t) {
    var e = function () {
        this.quickMenu = t('#header .quick-menu')
        this.root = t('#header')
        this.init()
        this
    };
    e.prototype.init = function () {
        var e = this, n = e.root;

        var o = encodeURIComponent(window.location.href);
        t('[data-selector="link-login"]', n).on('click', function () {
            window.location.href = t(this).attr('href') + '?refPath=' + o;
            return false
        });
        t('[data-selector="link-register"]', n).on('click', function () {
            window.location.href = t(this).attr('href') + '?refPath=' + o;
            return false
        });
        t('[data-selector="link-logout"]', n).on('click', function () {
            window.location.href = t(this).attr('href') + '?refPath=' + FJW.Env.wwwRoot;
            return false
        });
        e.refresh()
    }
    e.prototype.onload = function () {
        var e = this,
            n = e.root;
        t(function () {
            t.ajax({
                url: FJW.Env.wwwRoot + 'headData.shtml',
                type: 'post',
                data: null,
                dataType: 'json',
                cache: !1,
                success: function (e) {
                    e.loanListTotalFoverCount > 0 && t('.sub-nav [data-selector="preferance-num"]', n).text(e.loanListTotalFoverCount).css('display', 'inline-block'),
                        e.superDebtCount > 0 && t('.sub-nav [data-selector="debt-num"]', n).text(e.superDebtCount).css('display', 'inline-block'),
                        e.normalDebtCount > 0 && t('.sub-nav [data-selector="personal-num"]', n).text(e.normalDebtCount).css('display', 'inline-block')
                }
            })
        })
        e
    }
    e.prototype.navbar = function (e) {
        t('#header nav .nav-menu > ul li').each(function () {
            t(this).attr('data-name') === e && t(this).addClass('active')
        })
        this
    }
    e.prototype.refresh = function () {
        FJW.User.isLogin() ? this.setLoginedMenu() : this.setUnloginMenu()
        this
    }
    e.prototype.setUnloginMenu = function () {
        var t = this;
        NodeTpl.get('//pc-static.caifuxq.com/v1/revs/tpls/header/quick_menu.js?v=ea08f55f', {
        }, function (e) {
            t.quickMenu.empty().append(e)
        })
        t
    }
    e.prototype.setLoginedMenu = function () {
        var t = this;
        NodeTpl.get('//pc-static.caifuxq.com/v1/revs/tpls/header/quick_menu.js?v=ea08f55f', {
            isLogin: !0,
            user_name: FJW.Cookie.get('user_name')
        }, function (e) {
            t.quickMenu.empty().append(e)
        })
        t
    }
    window.HeaderApply = new e
}(jQuery);
