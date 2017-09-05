'use strict';

var _api = require('../lib/f.data.js');
var _core = require('../lib/f.core.js');

var _user = {
    // 用户登录
    login : function(userInfo, resolve, reject){
        _core.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查手机号是否注册
    checkExistPhone :function(phone,resolve,reject){
        _core.ajax.request({
            url     : _api.host,
            data    : {
                type    : 'phone',
                str     : phone
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 用户注册
    register : function(userInfo, resolve, reject){
        _core.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查登录状态
    checkLogin : function(){
        if (!_core.cookie.get('F.token')) {
           //_core.goHome();
        }
    },
    // 重置密码
    resetPassword : function(userInfo, resolve, reject){
        _core.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取用户信息
    getUserInfo : function(param,resolve, reject){
        _core.ajax.request({
            url     : _api.host,
            data    : param,
            method  : 'POST',
            async   : false,
            success : resolve,
            error   : reject
        });
    },
    // 更新个人信息
    updateUserInfo : function(userInfo, resolve, reject){
        _core.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登录状态下更新密码
    updatePassword : function(userInfo, resolve, reject){
        _core.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登出
    logout : function(resolve, reject){
        _core.ajax.request({
            url     : _api.host,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
        
        _core.cookie.remove('F.token');
        _core.cookie.remove('F.phone');
        _core.cookie.remove('F.avator');

    }
};

_user.checkLogin();

module.exports = _user;
