/*
* @Author: asus
* @Date:   2017-07-21 16:35:42
* @Last Modified by:   asus
* @Last Modified time: 2017-07-21 16:43:17
*/
'use strict';

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
    // 网络请求
    request: function (param) {
        var _this = this;
        $.ajax({
            url: param.url || '',
            data: param.data || '',
            type: param.method || 'get',
            async: param.async || true,
            cache: param.cache || true,
            dataType: param.type || 'json',
            complete: param.complete,
            beforeSend: param.beforeSend,
            timeout: param.timeout || 1000 * 60 * 10,
            success: function (res) {
                // 请求成功
                if (0 === res.s) {
                    typeof param.success === 'function' && param.success(res.d, res.es);
                }
                // 没有登录状态，需要强制登录
                else if (101 === res.status) {
                    //跳转 登录页
                }
                // 请求数据错误
                else if (1 === res.s) {
                    typeof param.error === 'function' && param.error(res.es);
                }else {
                    typeof param.hideLoading === 'function' && param.hideLoading();
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
    // 获取 url 参数
    getUrlParam: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
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
    }
};

module.exports = F;