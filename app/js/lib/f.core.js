/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-07-21 16:35:42
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-10 11:42:41
 */
'use strict';

// 参考永利宝 js

var F = {

    getKeys: Object.names || function (obj) {
        var names = [], name = '';
        for (name in obj) {
            if (obj.hasOwnProperty(name))
                names.push(name);
        }
        return names;
    },

    isPlainObject: function (value) {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    },

    isArray: function (value) {
        return value instanceof Array
    },

    toArray: function (value) {
        return Array.prototype.slice.call(value);
    },

    // 本地缓存
    storage: {
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
    },
    cookie: {
        get: function (name) {
            var nameEQ = name + "=";
            //把cookie分割成组
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                //取得字符串
                var c = ca[i];
                //判断一下字符串有没有前导空格
                while (c.charAt(0) == ' ') {
                    //有的话，从第二位开始取    
                    c = c.substring(1, c.length);
                }
                //如果含有我们要的name
                if (c.indexOf(nameEQ) == 0) {
                    //解码并截取我们要值
                    return unescape(c.substring(nameEQ.length, c.length));
                }
            }
        },
        set: function (name, value, options) {
            if (F.isPlainObject(name)) {
                for (var k in name) {
                    if (name.hasOwnProperty(k)) this.set(k, name[k], value);
                }
            } else {
                var opt = F.isPlainObject(options) ? options : { expires: options },
                    expires = opt.expires !== undefined ? opt.expires : '',
                    expiresType = typeof (expires),
                    path = opt.path !== undefined ? ';path=' + opt.path : ';path=/',
                    domain = opt.domain ? ';domain=' + opt.domain : '',
                    secure = opt.secure ? ';secure' : '';

                //过期时间
                if (expiresType === 'string' && expires !== '') expires = new Date(expires);
                else if (expiresType === 'number') expires = new Date(+new Date + 1000 * 60 * 60 * 24 * expires);
                if (expires !== '' && 'toGMTString' in expires) expires = ';expires=' + expires.toGMTString();

                document.cookie = name + "=" + escape(value) + expires + path + domain + secure;   //转码并赋值    
            }
        },
        remove: function (names) {
            names = F.isArray(names) ? names : F.toArray(arguments);
            for (var i = 0, l = names.length; i < l; i++) {
                this.set(names[i], '', -1);
            }
            return names;
        },
        clear: function () {
            return this.remove(F.getKeys(this.all()));
        },
        all: function () {
            if (document.cookie === '') return {};
            var cookies = document.cookie.split('; '), result = {};
            for (var i = 0, l = cookies.length; i < l; i++) {
                var item = cookies[i].split('=');
                result[unescape(item[0])] = unescape(item[1]);
            }
            return result;
        }
    },
    ajax: {
        // 网络请求
        request: function (param) {
            var _this = this;

            F.ajax.ajaxSet();

            $.ajax({
                url: param.url || '',
                data: param.data || '',
                type: param.method || 'get',
                async: param.async || true,
                cache: param.cache || false,
                dataType: param.type || 'json',
                complete: param.complete,
                beforeSend: param.beforeSend,
                crossDomin: true,
                xhrFields: {
                    withCredentials: false
                },
                timeout: param.timeout || 1000 * 60 * 10,
                success: function (res) {
                    // 请求成功
                    if (0 === res.s) {
                        typeof param.success === 'function' && param.success(res.d, res.es);
                    }
                    // 没有登录状态，需要强制登录
                    else if (101 === res.s) {
                        //跳转 登录页
                        window.user.isLogin = false;
                        F.storage.delItem($.base64.btoa('f.token'));
                        F.storage.delItem($.base64.btoa('f.ui.cache'));

                        F.cookie.remove($.base64.btoa('f.token'));
                        F.cookie.remove($.base64.btoa('f.phone'));
                        F.cookie.remove($.base64.btoa('f.avator'));

                        typeof param.success === 'function' && param.success(res.d, res.es);
                    }
                    // 请求数据错误
                    else {
                        typeof param.error === 'function' && param.error(res.es);
                    }
                },
                error: function (err, status) {
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
        },
        ajaxSet: function () {
            var _this = this;

            $.ajaxSetup({
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                timeout: 1000 * 60 * 10,
                cache: false
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
                        data.T = F.cookie.get($.base64.btoa('f.token'));
                        opt.data = JSON.stringify(data);
                    }
                }
            });
        },
    },
    // 字段的验证，支持非空、手机、邮箱的判断
    validate: function (value, type) {
        var value = $.trim(value);
        // 非空验证
        if ('require' === type) {
            return !!value;
        }
        // 手机号验证
        if ('phone' === type) {
            return /^1\d{10}$/.test(value);
        }
        // 邮箱格式验证
        if ('email' === type) {
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    Tools: {
        // 获取屏幕分辨率
        screenSize: function () {
            return (window.screen.width || 0) + "x" + (window.screen.height || 0);
        },
        // 获取 url 参数
        getUrlParam: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var result = window.location.search.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]) : null;
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
        }
    },
    String: {
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
        numberFormat: function (s, l) {
            if (!l || l < 1) l = 3;
            s = String(s).split(".");
            s[0] = s[0].replace(new RegExp('(\\d)(?=(\\d{' + l + '})+$)', 'ig'), "$1,");
            return s.join(".");
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
        // 四舍五入保留n位小数(默认保留两位小数)
        twoDecimalPlaces: function (s, l) {
            if (isNaN(parseFloat(s)) || s == 0) return "0.00";
            var bit = !l ? 100 : Math.pow(10, l);
            var str = String(Math.round(s * bit) / bit);
            if (str.indexOf(".") != -1 && str.length <= str.indexOf(".") + 2) str += '0';
            else if (str.indexOf(".") == -1) str += '.00';
            return str;
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
        }
    }
};

module.exports = F;
