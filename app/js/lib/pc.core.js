/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-13 14:42:02 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-03 19:38:18
 */
'use strict'

var debug = true;
var FJW = FJW || {};
var FJW = {};
FJW.Namespace = function () {
    var e, t, n, r = arguments, i = null;
    for (e = 0; e < r.length; e++) {
        for (n = r[e].split('.'), i = FJW, t = 'FJW' == n[0] ? 1 : 0; t < n.length; t++) {
            i[n[t]] = i[n[t]] || {}, i = i[n[t]];
        }
    }
    return i
}
FJW.Env = {
    protocol: function () {
        return location.protocol
    },
    domain: debug ? 'http://192.168.1.53:8010' : 'https://www.fangjinnet.com',
    apiHost: debug ? 'https://api.fangjinnet.com:1000/api' : 'https://api.fangjinnet.com:1000/api',
    wwwRoot: '/dist/view',
    bbsRoot: 'https://bbs.fangjinnet.com/',
    mallRoot: 'https://mall.fangjinnet.com/'
}
FJW.System = {}
FJW.System.guid = function () {
    return 'FJWGUID__' + (FJW.System.guid._counter++).toString(36)
}
FJW.System.guid._counter = 1

FJW.Object = {
    isUndefined: function (e) {
        return void 0 === e
    },
    isBoolean: function (e) {
        return 'boolean' == typeof e
    },
    isString: function (e) {
        return 'string' == typeof e
    },
    isElement: function (e) {
        return e && 1 == e.nodeType
    },
    isFunction: function (e) {
        return 'function' == typeof e
    },
    isObject: function (e) {
        return 'object' == typeof e
    },
    isArray: function (e) {
        return '[object Array]' === Object.prototype.toString.call(e)
    },
    isNumber: function (e) {
        return 'number' == typeof e
    },
    isJQuery: function (e) {
        return e instanceof window.jQuery
    },
    extend: function () {
        for (var e = arguments[0] || {
        }, t = arguments.length, n = 1; n < t; n++) if ('object' == typeof arguments[n]) for (var r in arguments[n]) !0 === arguments[t - 1] && arguments[n][r].constructor == Object ? FJW.Object.extend(e[r], arguments[n][r]) : e[r] = arguments[n][r];
        return e
    },
    extendParams: function () {
        var e = arguments,
            t = e[0];
        if (FJW.Object.isArray(t)) for (var n = 1; n < e.length; n++) 'object' == typeof e[n] && Object.keys(e[n]).forEach(function (r) {
            t.push({
                name: r,
                value: e[n][r]
            })
        });
        else for (var n = 1; n < e.length; n++) 'object' == typeof e[n] && FJW.Object.extend(t, e[n]);
        return t
    },
    toQueryString: function (e, t) {
        var n,
            r = [
            ];
        for (var i in e) n = e[i],
            FJW.Object.isFunction(n) || (FJW.Object.isObject(n) ? r.push(FJW.Object.toQueryString(n, i)) : /^\d+$/.test(i) ? r.push(encodeURIComponent(t || i) + '=' + encodeURIComponent(n)) : r.push(encodeURIComponent(i) + '=' + encodeURIComponent(n)));
        return r.join('&')
    }
}
FJW.Array = {
    remove: function (e, t) {
        for (var n = 0; n < e.length; n++) if (e[n] === t) {
            e.splice(n, 1);
            break
        }
        return e
    },
    removeAt: function (e, t) {
        return e.splice(t, 1)[0],
            e
    },
    empty: function (e) {
        e.length = 0
    },
    unique: function (e, t) {
        var n,
            r,
            i = e.length,
            o = e.slice(0);
        for ('function' != typeof t && (t = function (e, t) {
            return e === t
        }); --i > 0;) for (r = o[i], n = i; n--;) if (t(r, o[n])) {
            o.splice(i, 1);
            break
        }
        return o
    }
}
FJW.String = {
    realLength: function (e) {
        return e.replace(/[\u4e00-\u9fa5]/g, '**').length
    },
    nl2br: function (e) {
        return (e || '').replace(/([^>])\n/g, '$1<br />')
    },
    stripTags: function (e) {
        return e.replace(/<\/?[^>]+>/gim, '')
    },
    stripScript: function (e) {
        return e.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gim, '')
    },
    escapeHTML: function (e) {
        return e.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    },
    unescapeHTML: function (e) {
        return e.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    },
    // 修剪两端空白字符和换行符
    trim: function (s) {
        return s.replace(/(^\s*)|(\s*$)|(\n)/g, "");
    },
    // 修剪左端空白字符和换行符
    leftTrim: function (s) {
        return s.replace(/(^\s*)|(^\n)/g, "");
    },
    // 修剪右端空白字符和换行符
    rightTrim: function (s) {
        return s.replace(/(\s*$)|(\n$)/g, "");
    },
    // 格式化数字
    numberFormat: function (num) {
        num += "";
        var arr = num.split("."),
            x1 = arr[0],
            x2 = arr.length > 1 ? "." + arr[1] : "";

        for (var match = /(\d+)(\d{3})/; match.test(x1);)
            x1 = x1.replace(match, "$1,$2");
        return x1 + x2
    },
    // 星号字节
    asteriskByte: function (s, start, end) {
        var startStr = start ? s.substr(0, start) : "";
        var endStr = end ? s.substr(end + 1) : "";
        var star = "", l;
        l = !start && !end ? s.length : (start && !end ? s.length - start : end);
        while (star.length < l) star += "*";
        return startStr + star + endStr;
    },
    // 不四舍五入保留n位小数(默认保留两位小数)
    twoDecimalPlaces: function (s, l) {
        if (isNaN(parseFloat(s)) || s == 0) return "0.00";
        var bit = !l ? 100 : Math.pow(10, l);
        var str = String(Math.floor(s * bit) / bit);
        if (str.indexOf(".") != -1 && str.length <= str.indexOf(".") + 2) str += '0';
        else if (str.indexOf(".") == -1) str += '.00';
        return str;
    },
    // 格式化时间戳
    formatTime: function (time, fmt) {
        var timeObj = new Date(time);
        var o = {
            "M+": timeObj.getMonth() + 1,                 //月份
            "d+": timeObj.getDate(),                    //日
            "h+": timeObj.getHours(),                   //小时
            "m+": timeObj.getMinutes(),                 //分
            "s+": timeObj.getSeconds(),                 //秒
            "q+": Math.floor((timeObj.getMonth() + 3) / 3), //季度
            "S": timeObj.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (timeObj.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    // 格式化银行卡
    formatBank: function (s, mask) {
        var str = s.substring(0, 22); /*帐号的总数, 包括空格在内 */
        if (str.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
            /* 对照格式 */
            if (str.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
                ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
                var accountNumeric = '', accountChar = "", i;
                for (i = 0; i < str.length; i++) {
                    accountChar = str.substr(i, 1);
                    if (!isNaN(accountChar) && (accountChar != " ")) {
                        accountNumeric += accountChar;
                    }
                }

                str = "";
                for (i = 0; i < accountNumeric.length; i++) {
                    if (i == 4) str = str + " "; /* 帐号第4位数后加空格 */
                    if (i == 8) str = str + " "; /* 帐号第8位数后加空格 */
                    if (i == 12) str = str + " ";/* 帐号第12位后数后加空格 */
                    if (i == 16) str = str + " ";/* 帐号第16位后数后加空格 */

                    str = str + (mask && (accountNumeric.length - i > 4) ? '*' : accountNumeric.substr(i, 1))
                }
            }
        }
        else {
            str = " " + str.substring(1, 5) + " " + str.substring(6, 10) + " " + str.substring(14, 18) + "-" + str.substring(18, 25);
        }
        return str;
    },
    substr: function (e, t, n, r) {
        for (var i = /[^\x00-\xFF]/g, o = 0, a = t; o < t;) o++ && e.charAt(o).match(i) && t--;
        o = t;
        for (var s = t + n; o < s;) o++ && e.charAt(o).match(i) && s--;
        return r && e.length > s ? (e = FJW.String.substr(e, a, n - r.length + (r.length % 2 == 0 ? 0 : 1), !1)) + r : e.substring(t, s)
    },
    include: function (e, t) {
        return e.indexOf(t) > - 1
    },
    startsWith: function (e, t) {
        return 0 === e.indexOf(t)
    },
    endsWith: function (e, t) {
        var n = e.length - t.length;
        return n >= 0 && e.lastIndexOf(t) === n
    },
    isBlank: function (e) {
        return /^\s*$/.test(e)
    },
    isEmail: function (e) {
        return /^[A-Z_a-z0-9-\.]+@([A-Z_a-z0-9-]+\.)+[a-z0-9A-Z]{2,4}$/.test(e)
    },
    isMobile: function (e) {
        return /^((\(\d{2,3}\))|(\d{3}\-))?(1[34578]\d{9})$/.test(e)
    },
    isUrl: function (e) {
        return /^(https:|http:|ftp:)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/.test(e)
    },
    isIp: function (e) {
        return /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])\.(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])\.(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])\.(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/.test(e)
    },
    isNumber: function (e) {
        return /^\d+$/.test(e)
    },
    isZip: function (e) {
        return /^[1-9]\d{5}$/.test(e)
    },
    isEN: function (e) {
        return /^[A-Za-z]+$/.test(e)
    },
    isCN: function (e) {
        return /^[\u4e00-\u9fa5]+$/.test(e)
    },
    isIdCard: function (e, t) {
        function n(e) {
            return e % 4 == 0 && e % 400 != 0 || e % 400 == 0
        }
        function r(e, t, r) {
            if (t < 1 || t > 12) return !1;
            var i = a[t];
            return 2 === t && n(e) && (i = 29),
                r > 0 && r <= i
        }
        function i(e) {
            return !!/^[0-9]{15}$/.test(e) && !!r(parseInt('19' + e.substr(6, 2), 10), parseInt(e.substr(8, 2), 10), parseInt(e.substr(10, 2), 10))
        }
        function o(e) {
            if (!/^[0-9]{17}[0-9xX]$/.test(e)) return !1;
            var t = (e.substr(0, 6), parseInt(e.substr(6, 4), 10)),
                n = parseInt(e.substr(10, 2), 10),
                i = parseInt(e.substr(12, 2), 10),
                o = (e.substr(14, 2), e.substr(16, 1), e.substr(17, 1));
            if (!r(t, n, i)) return !1;
            for (var a = 0, u = 0; u < 17; u++) a += parseInt(e.charAt(u), 10) * s[u];
            var l = a % 11;
            return c.charAt(l) === o
        }
        if (!t) return /^\d{17}[xX\d]$|^\d{15}$/.test(e);
    },
    /**
     * 获取 url 参数
     */
    getQuery: function (name, url) {
        url = url || window.location.href + '',
            - 1 !== url.indexOf('#') && (url = url.substring(0, url.indexOf('#')));
        for (var n, r = [], i = new RegExp('(^|\\?|&)' + name + '=([^&]*)(?=&|#|$)', 'g'); null != (n = i.exec(url));) r.push(decodeURIComponent(n[2]));
        return 0 == r.length ? null : 1 == r.length ? r[0] : r
    },
    setQuery: function (e, t, n) {
        if (FJW.Object.isArray(e)) {
            n = t || window.location.href + '';
            for (var r = 0; r < e.length; r++) n = this.setQuery(e[r], n);
            return n
        }
        if (FJW.Object.isObject(e)) {
            n = t || window.location.href + '';
            for (var r in e) n = this.setQuery(r, e[r], n);
            return n
        }
        n = n || window.location.href + '';
        var i = '';
        - 1 !== n.indexOf('#') && (i = n.substring(n.indexOf('#'))),
            n = n.replace(i, ''),
            n = n.replace(new RegExp('(^|\\?|&)' + e + '=[^&]*(?=&|#|$)', 'g'), '$1'),
            n = n.replace(/(\?|&)&*/g, '$1'),
            n = n.replace(/&+$/g, ''),
            t = FJW.Object.isArray(t) ? t : [
                t
            ];
        for (var r = t.length - 1; r >= 0; r--) t[r] = encodeURIComponent(t[r]);
        var o = e + '=' + t.join('&' + e + '=');
        return n + (/\?/.test(n) ? '&' : '?') + o + i
    },
    queryToObject: function (e) {
        e = e || window.location.href + '';
        var t = '',
            n = {
            };
        return - 1 !== e.indexOf('#') && (t = e.substring(e.indexOf('#'))),
            e = e.replace(t, ''),
            e = - 1 !== e.indexOf('?') ? e.substring(e.indexOf('?') + 1) : e,
            e.split('&').map(function (e) {
                var t = e.split('=');
                try {
                    t.length >= 2 && (n[t[0]] = decodeURIComponent(t[1]))
                } catch (e) {
                }
            }),
            n
    }
}
FJW.Number = {
    pad: function (e, t) {
        var n = '',
            r = e < 0,
            i = String(Math.abs(e));
        return i.length < t && (n = new Array(t - i.length + 1).join('0')),
            (r ? '-' : '') + n + i
    },
    random: function (e, t) {
        return null == t && (t = e, e = 0),
            Math.floor(e + Math.random() * (t - e))
    },
    thousands: function (e, t) {
        return e = e.toString().replace(',', ''),
            void 0 === t ? e = Number(e).toFixed(2) : 'number' == typeof t ? e = Number(e).toFixed(t) : 'boolean' == typeof t && (e = Number(e)),
            e.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    },
    toFixedDifference: function (e, t, n) {
        if ('number' != typeof e) return e;
        e = e.toString().split('.');
        var r = e[1];
        return e = 2 == t ? e[0] + '.' + (r ? 1 == r.length ? r + '0' : r.substring(0, 2) : '00') : e[0] + '.' + (r ? r.substring(0, 1) : '0'),
            n ? e.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : e
    },
    sqlFunction: function (e, t) {
        var n = Math.pow(10, t || 2),
            r = e * n,
            i = r % 1,
            o = Math.floor(r);
        return i > 0.5 ? (o + 1) / n : i < 0.5 ? o / n : (o % 2 == 0 ? o : o + 1) / n
    }
}
FJW.Date = {
    dayNames: [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
    ],
    monthNames: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
    ],
    isLeapYear: function (e) {
        var t = e.getFullYear();
        return t % 4 == 0 && t % 100 != 0 || t % 400 == 0
    },
    isWeekend: function (e) {
        return 0 == e.getDay() || 6 == e.getDay()
    },
    isWeekDay: function (e) {
        return !this.isWeekend(e)
    },
    getDaysInMonth: function (e) {
        return [31,
            this.isLeapYear(e) ? 29 : 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31][e.getMonth()]
    },
    getDayName: function (e) {
        return this.dayNames[e.getDay()]
    },
    getMonthName: function (e) {
        return this.monthNames[e.getMonth()]
    },
    getDayOfYear: function (e) {
        var t = new Date('1/1/' + e.getFullYear());
        return Math.floor((e.getTime() - t.getTime()) / 86400000)
    },
    getWeekOfYear: function (e) {
        return Math.ceil(this.getDayOfYear(e) / 7)
    },
    setDayOfYear: function (e, t) {
        return e.setMonth(0),
            e.setDate(t),
            e
    },
    zeroTime: function (e) {
        return e.setMilliseconds(0),
            e.setSeconds(0),
            e.setMinutes(0),
            e.setHours(0),
            e
    },
    dateDiff: function (e, t, n) {
        var r = 1;
        switch (n) {
            case 'S':
                r = 1000;
                break;
            case 'm':
                r = 60000;
                break;
            case 'H':
                r = 3600000;
                break;
            case 'D':
                r = 86400000;
                break;
            case 'M':
                r = 2678400000;
                break;
            case 'Y':
                r = 31536000000
        }
        return parseInt((e.getTime() - t.getTime()) / parseInt(r))
    },
    format: function (e, t) {
        function n(e, n) {
            t = t.replace(e, n)
        }
        FJW.Object.isString(e) && (t = e, e = null),
            e = e || new Date,
            t = t || 'yyyy-MM-dd HH:mm:ss';
        var r = FJW.Number.pad,
            i = e.getFullYear(),
            o = e.getMonth() + 1,
            a = e.getDate(),
            s = e.getHours(),
            c = e.getMinutes(),
            u = e.getSeconds();
        return n(/yyyy/g, r(i, 4)),
            n(/yy/g, r(parseInt(i.toString().slice(2), 10), 2)),
            n(/MM/g, r(o, 2)),
            n(/M/g, o),
            n(/dd/g, r(a, 2)),
            n(/d/g, a),
            n(/HH/g, r(s, 2)),
            n(/H/g, s),
            n(/hh/g, r(s % 12, 2)),
            n(/h/g, s % 12),
            n(/mm/g, r(c, 2)),
            n(/m/g, c),
            n(/ss/g, r(u, 2)),
            n(/s/g, u),
            t
    },
    parse: function (e) {
        var t = new RegExp('^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+$');
        if (FJW.Object.isString(e)) {
            if (t.test(e) || isNaN(Date.parse(e))) {
                var n = e.split(/ |T/),
                    r = n.length > 1 ? n[1].split(/[^\d]/) : [
                        0,
                        0,
                        0
                    ],
                    i = n[0].split(/[^\d]/);
                return new Date(i[0] - 0, i[1] - 1, i[2] - 0, r[0] - 0, r[1] - 0, r[2] - 0)
            }
            return new Date(e)
        }
        return new Date
    }
}
FJW.Browser = {
    IE: !(!window.attachEvent || window.opera),
    IE6: '6' == (/msie\s*(\d+)\.\d+/g.exec(navigator.userAgent.toLowerCase()) || [0,
        '0'])[1],
    IE7: navigator.userAgent.indexOf('MSIE 7.0') > - 1,
    IE8: navigator.userAgent.indexOf('MSIE 8.0') > - 1,
    Sogou: navigator.userAgent.indexOf('SE 2.X') > - 1,
    Opera: !!window.opera,
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > - 1,
    Gecko: navigator.userAgent.indexOf('Gecko') > - 1 && - 1 == navigator.userAgent.indexOf('KHTML'),
    Safari: - 1 != navigator.userAgent.indexOf('Safari'),
    Mobile: 'createTouch' in document && !('onmousemove' in document.documentElement) || /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
    getName: function () {
        var e = '',
            t = navigator.userAgent.toLowerCase(),
            n = function (e) {
                return t.indexOf(e) > - 1
            },
            r = (!0 === n('opera') ? 'opera' : !0 === (n('msie') && n('360se')) ? '360se' : !0 === (n('msie') && n('tencenttraveler') && n('metasr')) ? 'sogobrowser' : !0 === (n('msie') && n('qqbrowser')) ? 'QQbrowser' : !0 === (n('msie') && n('tencenttraveler')) ? 'TTbrowser' : !0 === n('msie') ? 'msie' : !0 === n('se 2.x') ? 'sogou' : !0 === (n('safari') && !n('chrome')) ? 'safari' : !0 === n('maxthon') ? 'maxthon' : !0 === (n('chrome') && n('safari') && n('qihu 360ee')) ? '360ee' : !0 === (n('chrome') && n('taobrowser')) ? 'taobrowser' : !0 === n('chrome') ? 'chrome' : !0 === (n('gecko') && !n('webkit') && n('seamonkey')) ? 'SeaMonkey' : !0 === (n('gecko') && !n('webkit') && !n('netscape')) ? 'firefox' : !0 === (n('gecko') && !n('webkit') && n('netscape')) ? 'netscape' : 'other').toLowerCase();
        switch (r) {
            case '360se':
            case 'qihu 360ee':
            case 'sogou':
                e = r;
                break;
            case 'opera':
            case 'safari':
            case 'firefox':
            case 'qqbrowser':
            case 'seamonkey':
            case 'taobrowser':
                e = r + t.substring(t.lastIndexOf('/'));
                break;
            case 'netscape':
            case 'chrome':
                e = r + t.substring(t.lastIndexOf('/'), t.lastIndexOf(' '));
                break;
            case 'maxthon':
                e = r + t.substring(t.lastIndexOf('/'), t.lastIndexOf('chrome'));
                break;
            case 'ttbrowser':
                e = r + t.substring(t.lastIndexOf('/'), t.lastIndexOf(')'));
                break;
            case 'msie':
                e = t.substring(t.lastIndexOf(r)).substring(0, t.substring(t.lastIndexOf(r)).indexOf(';'));
                break;
            default:
                e = r
        }
        return e
    },
    addFavorate: function (e, t) {
        this.IE ? window.external.addFavorite(t, e) : window.sidebar && window.sidebar.addPanel(e, t, '')
    },
    setHomepage: function (e, t) {
        try {
            e.style.behavior = 'url(#default#homepage)',
                e.setHomePage(t)
        } catch (e) {
            if (window.netscape) try {
                netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect')
            } catch (e) {
                alert('此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为\'true\',双击即可。')
            }
        }
    },
    copy: function (e) {
        var t;
        return t = FJW.Object.isElement(e) ? e.value : e,
            window.clipboardData && clipboardData.setData ? !!clipboardData.setData('text', t) || (alert('您的浏览器设置不允许脚本访问剪切板'), !1) : (alert('您的浏览器不支持脚本复制,请尝试手动复制'), !1)
    },
    bgiframe: function (e) {
        if (!FJW.Browser.IE6) return e;
        var t,
            n = e.getElementsByTagName('iframe');
        return n.length > 0 && 'bgiframe' == n[0].className ? e : (t = '<iframe class="bgiframe" frameborder="0" tabindex="-1" src="javascript:false;" style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');top:expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\');left:expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\');width:expression(this.parentNode.offsetWidth+\'px\');height:expression(this.parentNode.offsetHeight+\'px\');"/>', e.insertBefore(document.createElement(t), e.firstChild), e)
    }
}
FJW.Cookie = {
    get: function (e) {
        for (var t = e + '=', n = document.cookie.split(';'), r = 0; r < n.length; r++) {
            for (var i = n[r]; ' ' == i.charAt(0);) i = i.substring(1, i.length);
            if (0 == i.indexOf(t)) {
                var o;
                try {
                    o = decodeURIComponent(i.substring(t.length, i.length))
                } catch (e) {
                    o = unescape(i.substring(t.length, i.length))
                }
                return o
            }
        }
        return null
    },
    /**
     * 
     */
    set: function (name, value, time, path, domain, secure) {
        var expires;
        if (FJW.Object.isNumber(time)) {
            var s = new Date;
            s.setTime(s.getTime() + 24 * time * 60 * 60 * 1000);
            expires = s.toGMTString();
        } else {
            expires = !!FJW.Object.isString(time) && time;
        }
        document.cookie = name + '=' + encodeURIComponent(value) + (expires ? ';expires=' + expires : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '')
    },
    /**
     * 
     */
    del: function (name, path, domain, secure) {
        FJW.Cookie.set(name, '', -1, path, domain, secure)
    }
};

FJW.Storage = {
    /**
     * 
     * @param {} key 
     * @returns {} 
     */
    getItem: function (key) {
        //假如浏览器支持本地存储则从localStorage里getItem，否则乖乖用Cookie
        return window.localStorage ? localStorage.getItem(key) : cookie.get(key);
    },
    /**
     * 
     * @param {} key 
     * @param {} val 
     * @returns {} 
     */
    setItem: function (key, val) {
        //假如浏览器支持本地存储则调用localStorage，否则乖乖用Cookie
        if (window.localStorage) {
            localStorage.setItem(key, val);
        } else {
            cookie.set(key, val);
        }
    },
    /**
     * 
     * @param {} key 
     * @returns {} 
     */
    delItem: function (key) {
        //假如浏览器支持本地存储则调用localStorage，否则乖乖用Cookie
        if (window.localStorage) {
            localStorage.removeItem(key);
        } else {
            cookie.remove(key, val);
        }
    },
    /**
     * 
     * @returns {} 
     */
    clearItem: function () {
        if (window.localStorage) {
            localStorage.clear();
        }
    }
}
FJW.Page = {
    isStrictMode: 'BackCompat' != document.compatMode,
    // 获取屏幕分辨率
    screenSize: function () {
        return (window.screen.width || 0) + "x" + (window.screen.height || 0);
    },
    pointerX: function (e) {
        return e.pageX || e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)
    },
    pointerY: function (e) {
        return e.pageY || e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
    },
    pageHeight: function () {
        return this.isStrictMode ? Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) : Math.max(document.body.scrollHeight, document.body.clientHeight)
    },
    pageWidth: function () {
        return this.isStrictMode ? Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) : Math.max(document.body.scrollWidth, document.body.clientWidth)
    },
    winWidth: function () {
        return this.isStrictMode ? document.documentElement.clientWidth : document.body.clientWidth
    },
    winHeight: function () {
        return this.isStrictMode ? document.documentElement.clientHeight : document.body.clientHeight
    },
    scrollTop: function () {
        return FJW.Browser.WebKit ? window.pageYOffset : this.isStrictMode ? document.documentElement.scrollTop : document.body.scrollTop
    },
    scrollLeft: function () {
        return FJW.Browser.WebKit ? window.pageXOffset : this.isStrictMode ? document.documentElement.scrollLeft : document.body.scrollLeft
    },
    closeWindow: function () {
        var e = navigator.userAgent;
        e.indexOf('MSIE') > 0 ? e.indexOf('MSIE 6.0') > 0 ? (window.opener = null, window.close()) : (window.open('', '_top'), window.top.close()) : e.indexOf('Firefox') > 0 ? window.location.href = 'about:blank' : (window.opener = null, window.open('', '_self', ''), window.close(), window.history.go(- 2))
    }
}
FJW.Event = {
    isCapsLockOn: function (e) {
        var t = e.keyCode || e.which,
            n = e.shiftKey;
        return !!(t >= 65 && t <= 90 && !n || t >= 97 && t <= 122 && n)
    },
    element: function (e) {
        var t = e.target || e.srcElement;
        return this.resolveTextNode(t)
    },
    relatedTarget: function (e) {
        var t = e.relatedTarget;
        return t || ('mouseout' == e.type || 'mouseleave' == e.type ? t = e.toElement : 'mouseover' == e.type && (t = e.fromElement)),
            this.resolveTextNode(t)
    },
    resolveTextNode: function (e) {
        try {
            if (e && 3 == e.nodeType) return e.parentNode
        } catch (e) {
        }
        return e
    },
    pointerX: function (e) {
        return e.pageX || e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)
    },
    pointerY: function (e) {
        return e.pageY || e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
    },
    isStrictMode: 'BackCompat' != document.compatMode,
    pageHeight: function () {
        return this.isStrictMode ? Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) : Math.max(document.body.scrollHeight, document.body.clientHeight)
    },
    pageWidth: function () {
        return this.isStrictMode ? Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) : Math.max(document.body.scrollWidth, document.body.clientWidth)
    },
    winWidth: function () {
        return this.isStrictMode ? document.documentElement.clientWidth : document.body.clientWidth
    },
    winHeight: function () {
        return this.isStrictMode ? document.documentElement.clientHeight : document.body.clientHeight
    },
    scrollTop: function () {
        return FJW.Browser.WebKit ? window.pageYOffset : this.isStrictMode ? document.documentElement.scrollTop : document.body.scrollTop
    },
    scrollLeft: function () {
        return FJW.Browser.WebKit ? window.pageXOffset : this.isStrictMode ? document.documentElement.scrollLeft : document.body.scrollLeft
    },
    preventDefault: function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1
    },
    stopPropagation: function (e) {
        Browser.IE ? this.stop = function (e) {
            e.returnValue = !1,
                e.cancelBubble = !0
        }
            : this.stop = function (e) {
                e.preventDefault(),
                    e.stopPropagation()
            }
    },
    _queue: {
    },
    queue: function (e, t) {
        var n = this;
        t ? (n._queue[e] || (n._queue[e] = new Array), n._queue[e].push(t)) : this.deQueue(e, t)
    },
    deQueue: function (e) {
        var t = this,
            n = arguments;
        e && t._queue[e] && function () {
            t._queue[e].forEach(function (e, t) {
                e.apply(window, n)
            })
        }()
    }
}

FJW.Dom = {},
    function () {
        var e = FJW.Dom.ready = function () {
            function t() {
                if (!e.isReady) {
                    e.isReady = !0;
                    for (var t = 0, n = o.length; t < n; t++)
                        o[t]()
                }
            }
            function n() {
                try {
                    document.documentElement.doScroll("left")
                } catch (e) {
                    return void setTimeout(n, 1)
                }
                t()
            }
            var r, i = !1, o = [];
            return document.addEventListener ? r = function () {
                document.removeEventListener("DOMContentLoaded", r, !1),
                    t()
            }
                : document.attachEvent && (r = function () {
                    "complete" === document.readyState && (document.detachEvent("onreadystatechange", r),
                        t())
                }
                ),
                function () {
                    if (!i)
                        if (i = !0,
                            "complete" === document.readyState)
                            e.isReady = !0;
                        else if (document.addEventListener)
                            document.addEventListener("DOMContentLoaded", r, !1),
                                window.addEventListener("load", t, !1);
                        else if (document.attachEvent) {
                            document.attachEvent("onreadystatechange", r),
                                window.attachEvent("onload", t);
                            var o = !1;
                            try {
                                o = null == window.frameElement
                            } catch (e) { }
                            document.documentElement.doScroll && o && n()
                        }
                }(),
                function (t) {
                    e.isReady ? t() : o.push(t)
                }
        }();
        e.isReady = !1
    }();
FJW.Pager = {
    get: function (e) {
        this._init(e),
            FJW.Pager.bar(e.currPage, e.totalPage),
            FJW.Pager.event(e.callback)
    },
    _init: function (e) {
        var t = this;
        if ('remove' === e) t.pageElement = $('.pager'),
            t.currPage = 0,
            t.totalPage = 0;
        else if (void 0 === e) return !1;
        t.pageElement = e.pageElement || $('.pager'),
            t.currPage = e.currPage,
            t.totalPage = e.totalPage
    },
    remove: function () {
        var e = this;
        e._init('remove'),
            e.pageElement.empty()
    },
    bar: function (e, t) {
        var n = this;
        if (e = e || n.currPage, 0 == (t = t || n.totalPage)) return $('.pagebar').remove(),
            !1;
        var r = $('<div />').addClass('pagebar'),
            i = [
                '<a href="javascript:;" data-page="prev" class="page-button page-prev"><i>&lt;</i> 上一页</a>'
            ];
        if (t <= 10) for (var o = 1; o <= t; o++) i.push('<a href="javascript:;" data-page="' + o + '">' + o + '</a>');
        if (t > 10) if (e < 7) {
            for (var o = 1; o < 8; o++) i.push('<a href="javascript:;" data-page="' + o + '">' + o + '</a>');
            i.push(['<a href="javascript:;" class="page-ellipsis">...</a>',
                '<a href="javascript:;" data-page="' + (t - 2) + '">' + (t - 2) + '</a>',
                '<a href="javascript:;" data-page="' + (t - 1) + '">' + (t - 1) + '</a>',
                '<a href="javascript:;" data-page="' + t + '">' + t + '</a>'].join(''))
        } else if (e >= 7 && e <= t - 6) {
            i.push(['<a href="javascript:;" data-page="1">1</a>',
                '<a href="javascript:;" data-page="2">2</a>',
                '<a href="javascript:;" data-page="3">3</a>',
                '<a href="javascript:;" class="page-ellipsis">...</a>'].join(''));
            for (var o = e - 2; o <= e + 1; o++) i.push('<a href="javascript:;" data-page="' + o + '">' + o + '</a>');
            i.push(['<a href="javascript:;" class="page-ellipsis">...</a>',
                '<a href="javascript:;" data-page="' + (t - 2) + '">' + (t - 2) + '</a>',
                '<a href="javascript:;" data-page="' + (t - 1) + '">' + (t - 1) + '</a>',
                '<a href="javascript:;" data-page="' + t + '">' + t + '</a>'].join(''))
        } else if (e > t - 6) {
            i.push(['<a href="javascript:;" data-page="1">1</a>',
                '<a href="javascript:;" data-page="2">2</a>',
                '<a href="javascript:;" data-page="3">3</a>',
                '<a href="javascript:;" class="page-ellipsis">...</a>'].join(''));
            for (var o = t - 6; o <= t; o++) i.push('<a href="javascript:;" data-page="' + o + '">' + o + '</a>')
        }
        i.push('<a href="javascript:;" data-page="next" class="page-button page-next">下一页 <i>&gt;</i></a>'),
            r.html(i.join('')),
            r.find('a[data-page="' + e + '"]').addClass('active'),
            1 == e ? e == t ? r.find('.page-button').remove() : r.find('.page-prev').remove() : e == t && r.find('.page-next').remove(),
            n.pageElement.html(r)
    },
    event: function (e) {
        var t = this;
        t.pageElement.find('.pagebar').on('click', 'a', function () {
            var n = $(this);
            if (n.hasClass('active') || n.hasClass('page-ellipsis')) return !1;
            var r = n.attr('data-page');
            'prev' == r ? t.currPage-- : 'next' == r ? t.currPage++ : t.currPage = parseInt(r);
            var i = {
                currPage: t.currPage,
                totalPage: t.totalPage,
                pageHtml: t.pageElement
            };
            return e && e.call(t, i),
                !1
        })
    }
}
FJW.Namespace('User')
FJW.User.cache = function () {
    this.user_id = FJW.Cookie.get('user_id'),
        this.user_login = FJW.Cookie.get('user_login'),
        this.user_name = FJW.Cookie.get('user_name'),
        this.user_photo = FJW.Cookie.get('user_photo') || 'default_c_1.gif',
        this.socket = null
}
FJW.User.cache()
FJW.User.setCache = function (data) {
    window.cache_user = data;
    window.user = {
        isLogin: true,
        token: data.token,
        isBuy: data.isBuy,
        phone: data.phone,
        balance: data.balance,
        avator: data.headPhoto,
        isInvite: data.friendStatus,
        isAuthen: data.realNameAuthen,
        hasPaypwd: data.existsTradePswd
    };
}
FJW.User.logOut = function () {
    FJW.Cookie.del('f.token', '/')
    FJW.Cookie.del('f.phone', '/')
    FJW.Cookie.del('f.login-time', '/')
    FJW.Cookie.del('f.login-device', '/')

    FJW.Storage.delItem('f.token')
    FJW.Storage.delItem('f.ui.cache')

}
FJW.User.requireLogin = function (e) {
    var me = this;
    FJW.User.isLogin() ? e && e.call(me, null) : window.location.href = FJW.Env.domain + FJW.Env.wwwRoot + '/user/login.html?refPath=' + location.href;
}
FJW.User.getInfo = function () {
    var me = this, info = null;
    FJW.Domain.init(FJW.Env.apiHost)
    return $.ajax({
        url: FJW.Env.apiHost,
        async: false,
        type: "post",
        dataType: "json",
        data: JSON.stringify({
            M: "GetMemberInfo"
        }),
        success: function (res) {
            if (res.s == 0) {
                info = JSON.parse(res.d)
                me.setCache(info)
            }
        },
        error: function () {
            window.user.isLogin = false;
        }
    }), info;
}
FJW.Domain = {
    _crossed: !1,
    _cross: function () {
        try {
            document.domain = window.location.hostname.split('.').reverse().slice(0, 2).reverse().join('.'),
                this._crossed = !0
        } catch (e) {
        }
    },
    _needCross: function (e) {
        return e != location.hostname
    },
    _root: function (e) {
        return e || (e = location.protocol + '//' + location.hostname, location.port && (e += ':' + location.port)),
            e.replace(/(https?:\/\/)?([^\/]+)(\s|\S)*/g, '$2')
    },
    proxies: {
    },
    init: function (e, t) {
        var me = this;
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            timeout: 1000 * 60 * 10,
            cache: false,
            crossDomain: me._needCross(e)
        });
        $(document).ajaxSend(function (event, xhr, opt) {
            if (opt.type.toLowerCase() === "post") {
                if (opt.data != null && opt.data !== "" && typeof (opt.data) !== "undefined") {
                    var data = JSON.parse(opt.data);
                    data.P = data.P || 3;
                    data.IE = false;
                    data.T = FJW.Cookie.get('f.token');
                    opt.data = JSON.stringify(data);
                }
            }
        });
    },
    use: function (param) {
        var me = this;
        me.init(param.url)
        $.ajax({
            url: param.url || '',
            data: param.data || '',
            complete: param.complete,
            type: param.type || 'get',
            async: param.async || true,
            cache: param.cache || false,
            beforeSend: param.beforeSend || function () {
                if($('.loading-box').hasClass('f-hide')){
                    $('.loading-mask').removeClass('f-hide')
                    $('.loading-box').removeClass('f-hide')
                }
            },
            dataType: param.dataType || 'json',
            success: function (res) {
                $('.loading-mask').addClass('f-hide')
                $('.loading-box').addClass('f-hide')
                // 请求成功
                if (0 === res.s) {
                    typeof param.success === 'function' && param.success(res.d, res.es);
                }
                // 没有登录状态，需要强制登录
                else if (101 === res.s) {
                    typeof param.success === 'function' && param.success(res.d, res.es);
                }
                // 请求数据错误
                else {
                    typeof param.error === 'function' && param.error(res.es);
                }
            },
            error: function (err, status) {
                $('.loading-mask').addClass('f-hide')
                $('.loading-box').addClass('f-hide')
                //如果出现timeout，不做处理
                if (status === "timeout") {
                    if (console) {
                        console.log("ajax超时！  url=" + param.url);
                    }
                } else if (status === "abort") {
                    if (console) {
                        console.log("ajax客户端终止请求！  url=" + param.url);
                    }
                }
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    }
}
FJW.ajaxExtend = function (e, t, n) {
    if (window.$ && e && t) {
        var r;
        e = e || {
        },
            r = e[t],
            e[t] = function () {
                r && r.apply(this, arguments),
                    n.apply(this, arguments)
            }
    }
}
FJW.Ajax = FJW.ajax = function (param) {
    FJW.Object.extend(param, {})
    FJW.Domain.use(param)
}
FJW.Dom.ready(function () {
    window.$ && $.ajaxSettings && FJW.ajaxExtend($.ajaxSettings, "complete", function (e, t) {
        403 === e.status && FJW.User.requireLogin(function () {
            window.location.reload()
        })
    })
})
module.exports = FJW;