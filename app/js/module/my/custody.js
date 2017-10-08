/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-03 21:05:45 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-03 21:18:14
 */
'use strict';

require('css_path/my/custody.css')
require('css_path/my/common')

var _api = require('js_path/lib/f.data.js')
var _head = require('js_path/lib/f.head.js')
var _core = require('js_path/lib/f.core.js')
var _user = require('js_path/service/user-service.js')

fjw.pc.custody = {
    init: function () {
        this.initEvent()
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this, user = null;
        setTimeout(function () {
            if (window.user.isLogin) {
                user = JSON.parse(window.cache)
            } else {
                user = me.method.getMemberInfo()
            }
            
        }, 300)
    },
    initEvent: function () {
        var me = this;
        $("#sub_nav_custody").addClass('active');

        var score = $(".progress-level-in").data("score"), width = score + "%";

        $(".progress-level-in").animate({
            width: width,
            speed: 1500
        })
    },
    method: {
        getMemberInfo: function () {
            _user.getUserInfo(JSON.stringify({
                M: _api.method.getMemberInfo,
            }), function (json) {
                return JSON.parse(json);
            }, function () {
                alert('系统异常,请刷新重试！')
            });
        }
    }
}

$(function () {
    fjw.pc.custody.init();
});