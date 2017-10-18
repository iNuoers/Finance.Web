/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-16 09:19:16 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-16 11:41:00
 */
'use strict';

var core = require('js_path/lib/pc.core.js');

var _user = {
    // 用户登录
    login : function(userInfo, resolve, reject){
        core.ajax({
            url     : core.Env.apiHost,
            data    : userInfo,
            type  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查手机号是否注册
    checkExistPhone :function(phone,resolve,reject){
        core.ajax({
            url     : core.Env.apiHost,
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
        core.ajax({
            url     : core.Env.apiHost,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 检查登录状态
    checkLogin : function(){
        
    },
    // 重置密码
    resetPassword : function(userInfo, resolve, reject){
        core.ajax({
            url     : core.Env.apiHost,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取用户信息
    getUserInfo : function(param,resolve, reject){
        core.ajax({
            url     : core.Env.apiHost,
            data    : param,
            method  : 'POST',
            async   : false,
            success : resolve,
            error   : reject
        });
    },
    // 更新个人信息
    updateUserInfo : function(userInfo, resolve, reject){
        core.ajax({
            url     : core.Env.apiHost,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登录状态下更新密码
    updatePassword : function(userInfo, resolve, reject){
        core.ajax({
            url     : core.Env.apiHost,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登出
    logout : function(resolve, reject){
        core.ajax({
            url     : core.Env.apiHost,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
        
        _core.cookie.remove('f.token');
        _core.cookie.remove('f.phone');
        _core.cookie.remove('f.avator');

    }
};

_user.checkLogin();

module.exports = _user;
