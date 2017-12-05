/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-07 19:19:03 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-04 15:38:59
 */
'use strict';

require('css_path/my/bindcard')
require('css_path/my/common')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')

fjw.pc.bindcard = {
    init: function () {
        this.onPageLoad()
        this.bindEvent()
    },
    onPageLoad: function () {

    },
    bindEvent: function () {
        var me = this;

        $("#sub_nav_bindcard").addClass('active');


        // 登录按钮的点击
        $('.J-submit').click(function () {
            me.submit();
        });

        $(".login-form").keyup(function (e) {
            e.preventDefault();
            if (e.keyCode === 13) {
                me.submit();
            }
        });
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, (data != '' && JSON.parse(data)))
                },
                error: function () {

                }
            });
        },
        handelForm: function (formData) {
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
        },
        submit: function () {

        }
    }
}

fjw.pc.bindcard.init()
































// https://www.anyitou.com/user/opengz