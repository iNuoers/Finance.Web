/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-07-21 16:35:42
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-26 11:53:48
 */

'use strict';
require('js_path/plugins/base64/jquery.base64.js')
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

var _core = require('js_path/lib/f.core.js');
var core = require('js_path/lib/pc.core.js')
var _api = require('js_path/lib/f.data.js');
var _user = require('js_path/service/user-service.js');

var Core = {
    init: function () {
        //this.initLink()
        //this.initUserInfo()
        //this.loginTimeout()
    },
    loginTimeout: function () {
        //登录超时20分钟
        var setout = 20 * 60 * 1000;
        var myTime = setTimeout(function () { timeOut(); }, setout);
        top.layerout = {};
        top.layerout.resetTime = function () {
            clearTimeout(myTime);
            myTime = setTimeout(function () { timeOut(); }, setout);
        }

        function timeOut() {
            user.logout();
            alert('您已超时 请重新登录')
            //window.location.reload();
        }

        $(document).off();

        $(document).keydown(function (event) {
            top.layerout.resetTime();
        }).click(function (event) {
            top.layerout.resetTime();
        });
    },
    cache: {
        isBuy: 0,
        balance: 0,
        isInvite: 0,
        isAuthen: 0,
        isLogin: false,
        glb_user_phone: '',
        glb_user_token: '',
        glb_user_avator: ''
    }
}

$(function () {
    

    Core.init();
})