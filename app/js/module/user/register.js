/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-07-20 09:12:27
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-09 16:06:25
 */

// https://www.lianlianmoney.com/account/register
'use strict';
require('../../../css/user/register');

// 表单里的错误提示
var formError = {
    show : function(errMsg){
        $('.error').addClass('error-show').text(errMsg);
    },
    hide : function(){
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
        $('.registerbtn').click(function () {
            _this.submit();
        });

        //
        $(".register-box-page").keyup(function (e) {
            if (e.keyCode === 13) {
                _this.submit();
            }
        });
    },
    submit:function(){
        var formData = {
            phoe:$.trim($("#phone").val()),
            password:$.trim($("#password").val())
        },
        validateResult = this.formValidate(formData);
        if(validateResult.status){
            _user.register(formData, function(res){
                window.location.href = _f.getUrlParam('redirect') || './index.html';
            }, function(errMsg){
                formError.show(errMsg);
            });
        }else{
            // 错误提示
            formError.show(validateResult.msg);
        }
    },
    formValidate:function(formData){
        var result = {
            status  : false,
            msg     : ''
        };
        if(!_f.validate(formData.phone, 'require')){
            result.msg = '用户名不能为空';
            return result;
        }
        if(!_f.validate(formData.password, 'require')){
            result.msg = '密码不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status   = true;
        result.msg      = '验证通过';
        return result;
    }
};

$(function () {
    page.init();
});