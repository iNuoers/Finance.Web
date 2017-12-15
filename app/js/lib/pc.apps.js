/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-13 20:02:00 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-11 09:16:47
 */

require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

// https://www.bxjr.com/lc/invest/detail/77687.html  全局 layer  定时器

var core = require('js_path/lib/pc.core.js')
core.Namespace('Config')
core.Config.data = {}
core.Config.init = function () {
    $('[data-selector="online-service"]').on('click', function () {

    });
    $("body").delegate("[data-href]", "click", function (e) {
        if ($(this).data("href") && !$(this).data("preventdefault")) {
            e.stopPropagation();
            var url = $(this).data("href");
            url = (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) ? url : core.Env.domain + core.Env.wwwRoot + url;
            var i = $(this).data("title"), needLogin = $(this).data("needlogin");

            if (needLogin)
                core.User.requireLogin(function () {
                    if (url) location.href = url;
                })
            else {
                if (url.indexOf('his') >= 0)
                    window.history.go(-1);
                else
                    location.href = url;
            }
        }
    });

    $(window).bind('scroll', function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 525) {
            $('.top-menu').addClass('tdw-nav-suspension');
            setTimeout(function () {
                $('.top-menu').addClass('tdw-nav-suspension-down');
            }, 100)
        } else if (scrollTop < 525) {
            $('.top-menu').removeClass('tdw-nav-suspension');
            setTimeout(function () {
                $('.top-menu').removeClass('tdw-nav-suspension-down');
            }, 100)
        }
    });

    //返回顶部
    $(window).bind('scroll', function () {
        var scrollTop = $(window).scrollTop();

        //显示返回顶部	
        if (scrollTop > 500) {
            $('.tool-backtop').fadeIn(300);
        } else {
            $('.tool-backtop').fadeOut(300);
        }
    })
    $('#tool-backtop').on('click', function () {
        $('html,body').stop().animate({
            scrollTop: 0
        }, 500);
    });

    //友情链接展开
    $('.tdw-footer-links .hide-btn').on('click', function () {
        var autoHeight = $(this).parents('.tdw-footer-links').find('ul').css('height', 'auto').height();
        if ($(this).find('i').hasClass('i-arrow-up1')) {
            $(this).html('隐藏<i class="tdw-icons i-arrow-down1"></i>');
            $(this).parents('.tdw-footer-links').animate({
                height: autoHeight
            });
        } else {
            $(this).html('展开<i class="tdw-icons i-arrow-up1"></i>');
            $(this).parents('.tdw-footer-links').animate({
                height: '20px'
            });;
        }
    });
}
core.Config.generateId = function () {
    return 'AUTOID__' + (core.Config.data.generateId++).toString(36)
}
core.User.isLogin = function () {
    return $.ajax({
        url: core.Env.apiHost,
        async: false,
        type: "post",
        dataType: "json",
        data: JSON.stringify({
            M: "ValidateToken",
            D: JSON.stringify({
                Token: core.Cookie.get('f.token')
            })
        }),
        success: function (res) {
            var data = JSON.parse(res.d)
            if (data.Work) {
                window.user.isLogin = true;
            } else {
                window.user.isLogin = false;
            }
        },
        error: function () {
            window.user.isLogin = false;
        }
    }), window.user.isLogin;
}
core.Namespace('Message')
/**
 * 
 * @param {} message 
 * @param {} time 
 * @returns {} 
 */
core.Message.alert = function (message, time) {
    layer.msg(message, {
        time: time ? time : 3000
    });
}
/**
 * 
 * @param {} message 
 * @returns {} 
 */
core.Message.error = function (title, message, time) {
    layer.open({
        btn: [],
        icon: 2,
        title: title ? title : "系统提示",
        time: time ? time : 3000,
        content: message
    });
}
/**
 * 
 * @param {} message 
 * @returns {} 
 */
core.Message.success = function (title, message, ok, cancel, time) {
    layer.open({
        icon: 1,
        title: title ? title : "系统提示",
        content: message,
        time: time ? time : 3000,
        yes: function () {
            if (ok)
                ok();
        },
        cancel: function () {
            if (cancel)
                cancel();
        }
    });
}
core.Namespace('Bank')
core.Bank.bankDetail = [{
    code: 'ICBC',
    name: '中国工商银行',
    logocss: 'zggsyh',
    tel: '95588'
}, {
    code: 'ABC',
    name: '中国农业银行',
    logocss: 'zgnyyh',
    tel: '95599'
}, {
    code: 'BOC',
    name: '中国银行',
    logocss: 'zgyh',
    tel: '95566'
}, {
    code: 'CCB',
    name: '中国建设银行',
    logocss: 'zgjsyh',
    tel: '95533'
}, {
    code: 'BCOM',
    name: '中国交通银行',
    logocss: 'jtyh',
    tel: '95559'
}, {
    code: 'PSBC',
    name: '中国邮政储蓄银行',
    logocss: 'zgyzcxyh',
    tel: '95580'
}, {
    code: 'SPDB',
    name: '浦发银行',
    logocss: 'pfyh',
    tel: '95528'
}, {
    code: 'HXB',
    name: '华夏银行',
    logocss: 'hxyh',
    tel: '95577'
}, {
    code: 'CIB',
    name: '兴业银行',
    logocss: 'xyyh',
    tel: '95561'
}, {
    code: 'CITIC',
    name: '中信银行',
    logocss: 'zxyh',
    tel: '95558'
}, {
    code: 'CEB',
    name: '中国光大银行',
    logocss: 'zggdyh',
    tel: '95595'
}, {
    code: 'PAB',
    name: '平安银行',
    logocss: 'payh',
    tel: '95511'
}, {
    code: 'SHB',
    name: '上海银行',
    logocss: 'shyh',
    tel: '95594'
}, {
    code: 'CMBC',
    name: '民生银行',
    logocss: 'zgmsyh',
    tel: '95568'
}, {
    code: 'GDB',
    name: '广发银行',
    logocss: 'gfyh',
    tel: '95508'
}, {
    code: 'CMB',
    name: '招商银行',
    logocss: 'zsyh',
    tel: '95555'
}]
core.Namespace('scrollTop')
core.scrollTop.config = {}
core.scrollTop.init = function () {
    core.Page.pageHeight() > 500 && void 0 === core.scrollTop.config.hide
}
$(function () {
    core.Config.init()
    core.scrollTop.init()

    // 用于普通页面的跨框架脚本攻击(CFS)防御
    if (top.location != self.location) top.location.href = self.location;

    if (window.location.host.indexOf("fangjinnet.com") > 0) {
        var url = window.location.href;

        if (url.indexOf("https://www.") < 0) {
            url = url.replace("http://", "https://www");
            window.location.replace(url);
        }
    }

    //登录超时20分钟
    var setout = 20 * 60 * 1000;
    var myTime = setTimeout(function () { timeOut(); }, setout);
    top.layerout = {};
    top.layerout.resetTime = function () {
        clearTimeout(myTime);
        myTime = setTimeout(function () { timeOut(); }, setout);
    }

    function timeOut() {
        if (window.isLogin) {
            core.User.logOut()
            alert('您已超时 请重新登录')
        }
    }

    $(document).off();

    $(document).keydown(function (event) {
        top.layerout.resetTime();
    }).click(function (event) {
        top.layerout.resetTime();
    });
});

module.exports = core;