/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-13 20:02:00 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-26 12:52:42
 */

var FJW = require('js_path/lib/pc.core.js')
FJW.Namespace('Config')
FJW.Config.data = {}
FJW.Config.init = function () {
    $('[data-selector="online-service"]').on('click', function () {
        return FJW.Service.onlineCall(),
            !1
    });
    $(".main-section,.main-wrap").delegate("a[data-href],div[data-href]", "click", function (e) {
        if ($(this).data("href") && !$(this).data("preventdefault")) {
            e.stopPropagation();
            var url = $(this).data("href");
            url = (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) ? url : FJW.Env.domain + FJW.Env.wwwRoot + url;
            var i = $(this).data("title"), needLogin = $(this).data("needlogin");

            if (needLogin)
                FJW.User.requireLogin()
            else {
                if (url.indexOf('his') >= 0)
                    window.history.go(-1);
                else
                    location.href = url;
            }
        }
    });

}
FJW.Config.generateId = function () {
    return 'AUTOID__' + (FJW.Config.data.generateId++).toString(36)
}
FJW.User.isLogin = function () {
    return $.ajax({
        url: FJW.Env.apiHost,
        async: false,
        type: "post",
        dataType: "json",
        data: JSON.stringify({
            M: "ValidateToken",
            D: JSON.stringify({
                Token: FJW.Cookie.get('f.token')
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
FJW.Namespace('Project')
FJW.Project.countdown = function (e) {
    var t,
        n,
        a = this,
        o = e.serverTime,
        r = e.startTime,
        i = null,
        c = function (e) {
            return e < 10 ? '0' + e : e
        };
    if (r > o) {
        var l = e.eleShowTime,
            s = new Date(r - o);
        t = s.getMinutes(),
            n = s.getSeconds(),
            l.html(c(t) + '分' + c(n) + '秒后开售'),
            i = setInterval(function () {
                if (--n, 0 == n ? --t : n < 0 && (n = 59), t < 0) return clearInterval(i),
                    l.html('立即申购').addClass('btn-warning'),
                    e.callback && e.callback.call(a),
                    !1;
                var o = c(t) + '分' + c(n) + '秒后开售';
                l.html(o).val(o)
            }, 1000)
    }
}
FJW.Project.profit = function (e) {
    var t = function (e, t) {
        return Math.round(e * Math.pow(10, t)) / Math.pow(10, t)
    },
        n = e.rate / 1200;
    if ('undefined' != e.shortTerm && void 0 != e.shortTerm && '' != e.shortTerm && e.shortTerm || (e.shortTerm = void 0), '1' == e.type && !e.shortTerm) {
        var a = Math.pow(1 + n, e.timeLength),
            o = e.amount * (n * a) / (a - 1);
        o = t(o, 2);
        var r,
            i,
            c = 0,
            l = 0,
            s = 0,
            m = e.amount;
        for (c = 0; c < e.timeLength; c++) r = t(m * n, 2),
            i = o - r,
            m -= i,
            c == e.timeLength - 1 ? (m = e.amount - s, (r = o - m) < 0 && (r = 0)) : s += i,
            l += r;
        return l = t(l, 2)
    }
    return '5' != e.type || e.shortTerm ? '10' != e.type && '15' != e.type || e.shortTerm ? e.shortTerm ? e.amount * (e.rate / 100) * e.shortTerm / 365 : void 0 : e.amount * (e.rate / 100) * e.timeLength / 365 : 'debt' == e.projectType ? e.loanRate / 1200 * e.copies * e.minInvestUnit * e.timeLength + e.copies * e.minInvestUnit - e.amount : n * e.amount * e.timeLength
}
FJW.Namespace('RechargeBind')
FJW.RechargeBind.getBankInfo = function (e, t) {
    var n = this;
    $.ajax({
        url: FJW.Env.wwwRoot + 'usercenter/yeepay/bankcardlist.shtml',
        type: 'post',
        data: {
            bankCard: e
        },
        dataType: 'json',
        cache: !1,
        success: function (e) {
            0 == e.code ? t && t.call(n, e.data) : $.dialog.alert(e.message)
        }
    })
}
FJW.RechargeBind.bankDetail = {
    BKCH: {
        name: '中国银行',
        tel: 95566
    },
    PCBC: {
        name: '建设银行',
        tel: 95533
    },
    ICBK: {
        name: '工商银行',
        tel: 95588
    },
    CIBK: {
        name: '中信银行',
        tel: 95558
    },
    ABOC: {
        name: '农业银行',
        tel: 95599
    },
    MSBC: {
        name: '民生银行',
        tel: 95568
    },
    EVER: {
        name: '光大银行',
        tel: 95595
    },
    GDBK: {
        name: '广发银行',
        tel: 95508
    },
    SPDB: {
        name: '浦发银行',
        tel: 95528
    },
    HXBK: {
        name: '华夏银行',
        tel: 95577
    },
    FJIB: {
        name: '兴业银行',
        tel: 95561
    },
    SZDB: {
        name: '平安银行',
        tel: 95511
    },
    PSBC: {
        name: '邮储银行',
        tel: 95580
    },
    BJCN: {
        name: '北京银行',
        tel: 95526
    }
}
FJW.Namespace('Service')
FJW.Service.onlineCall = function () {
    $('#UDESK_BTN a, #udesk_btn a').trigger('click')
}
FJW.Namespace('scrollTop')
FJW.scrollTop.config = {}
FJW.scrollTop.init = function () {
    FJW.Page.pageHeight() > 500 && void 0 === FJW.scrollTop.config.hide
}

$(function () {
    FJW.Config.init()
    FJW.scrollTop.init()

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
            FJW.User.logOut()
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

module.exports = FJW;