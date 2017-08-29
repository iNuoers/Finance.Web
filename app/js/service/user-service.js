'use strict';

var _f = require('../lib/fjw.js');

var _user = {
    // 用户登录
    login : function(userInfo, resolve, reject){
        _f.request({
            url     : _f.config.serverHost,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查手机号是否注册
    checkExistPhone :function(phone,resolve,reject){
        _f.request({
            url     : _f.config.serverHost,
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
        _f.request({
            url     : _f.config.serverHost,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查登录状态
    checkLogin : function(){
        if (!_f.cookie.get('F.token')) {
           //_f.goHome();
        }
    },
    // 重置密码
    resetPassword : function(userInfo, resolve, reject){
        _f.request({
            url     : _f.config.serverHost,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取用户信息
    getUserInfo : function(resolve, reject){
        _f.request({
            url     : _f.config.serverHost,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 更新个人信息
    updateUserInfo : function(userInfo, resolve, reject){
        _f.request({
            url     : _f.config.serverHost,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登录状态下更新密码
    updatePassword : function(userInfo, resolve, reject){
        _f.request({
            url     : _f.config.serverHost,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登出
    logout : function(resolve, reject){
        _f.request({
            url     : _f.config.serverHost,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
        
        _f.cookie.remove('F.token');
        _f.cookie.remove('F.phone');
        _f.cookie.remove('F.avator');

    },
    getUserInfo:function(){
        
    }
}
module.exports = {
    _user   : _user,
    _f      : _f
};
_user.checkLogin();