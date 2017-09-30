/*
* @Author: mr.ben(66623978) https://github.com/iNuoers/
* @Date:   2017-07-20 09:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-07-20 09:14:06
*/

'use strict';
require('../../../css/user/login');
require('../../plugins/base64/jquery.base64.js')

var _api = require('../../lib/f.data.js');
var _core = require('../../lib/f.core.js');
var _user = require('../../service/user-service');

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
var page = {
    init: function () {
        this.bindEvent();
    },

    bindEvent: function () {
        var _this = this;

        // 登录按钮的点击
        $('.loginbtn').click(function () {
            _this.submit();
        });

        //
        $(".login-form").keyup(function (e) {
            e.preventDefault();
            if (e.keyCode === 13) {
                _this.submit();
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
            _user.login(JSON.stringify(req), function (res) {

                var user = JSON.parse(res);
                // 登录成功 保存状态 cookie
                _core.cookie.set($.base64.btoa('f.token'), user.token, { path: '/' });
                _core.cookie.set($.base64.btoa('f.phone'), user.member.phone, { path: '/' });
                _core.cookie.set($.base64.btoa('f.avator'), user.member.headPhoto, { path: '/' });

                _core.storage.setItem($.base64.btoa('f.ui.cache'), res);
                _core.storage.setItem($.base64.btoa('f.token'), user.token);

                //success redirect
                window.location.href = _core.Tools.getUrlParam('redirect') || '/dist/view/my/index.html';

            }, function (errMsg) {
                formError.show(errMsg);
            });
        } else {
            // 错误提示
            formError.show(validateResult.msg);
        }
    },

    formValidate: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        if (!_core.validate(formData.Phone, 'require')) {
            result.msg = '手机号码不能为空';
            return result;
        }
        if (!_core.validate(formData.Pswd, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};

$(function () {
    page.init();
});