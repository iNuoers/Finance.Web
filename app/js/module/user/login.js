/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-07-20 09:12:27
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-17 16:13:53
 */
// https://passport.tuandai.com/login
'use strict';
require('css_path/user/login')

var apps = require('js_path/lib/pc.apps.js')
var core = require('js_path/lib/pc.core.js')
var header = require('js_path/lib/header.js')
var _api = require('js_path/lib/f.data.js');
var _user = require('js_path/service/user-service');

// 表单里的错误提示
var formError = {
    show: function (errMsg) {
        $('.error').addClass('error-show').text(errMsg);
    },
    hide: function () {
        $('.error').removeClass('error-show').text('');
    }
};

// page 逻辑部分
fjw.pc.login = {
    init: function () {
        this.bindEvent();
    },

    bindEvent: function () {
        var me = this;

        // 登录按钮的点击
        $('.loginbtn').click(function () {
            me.submit();
        });

        $(".login-form").keyup(function (e) {
            e.preventDefault();
            if (e.keyCode === 13) {
                me.submit();
            }
        });
    },

    submit: function () {

        var formData = {
            Domain: "pc",
            DeviceName: '',
            Phone: $.trim($("#phone").val()),
            Pswd: $.trim($("#password").val())
        }, req = {
            M: _api.method.login,
            D: JSON.stringify(formData)
        }, validateResult = this.formValidate(formData);

        if (validateResult.status) {
            $('.loginbtn').text('登录中...').prop('disabled', true);
            _user.login(JSON.stringify(req), function (res) {

                var user = JSON.parse(res);
                // 登录成功 保存状态 cookie
                core.Cookie.set('f.token', user.token, 20, '/')
                core.Cookie.set('f.phone', user.member.phone, 20, '/')
                core.Cookie.set('f.login-time', user.loginlasttime, 20, '/')
                core.Cookie.set('f.login-device', user.devicename, 20, '/')

                core.Storage.setItem('f.token', user.token)
                core.Storage.setItem('f.ui.cache', res)

                //success redirect
                window.location.href = core.String.getQuery('refPath') || core.Env.domain + core.Env.wwwRoot + '/my/index.html';

            }, function (errMsg) {
                formError.show(errMsg);
                $('.loginbtn').text('立即登录').prop('disabled', false);
            });
        } else {
            // 错误提示
            formError.show(validateResult.msg);
            $('.loginbtn').text('立即登录').prop('disabled', false);
        }
    },

    formValidate: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        if (core.String.isBlank(formData.Phone)) {
            result.msg = '手机号码不能为空';
            return result;
        }
        if (core.String.isBlank(formData.Pswd)) {
            result.msg = '密码不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};

fjw.pc.login.init();