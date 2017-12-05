/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-12-02 20:40:41 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-04 16:03:07
 */
'use strict';
require('js_path/plugins/validform/5.3.2/validform.css')
require('js_path/plugins/validform/5.3.2/validform.js')
require('css_path/my/reset-logpwd')
require('css_path/my/common')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')

fjw.pc.reset_logpwd = {
    init: function () {
        this.onPageLoad();
        this.bindEvent()
    },
    onPageLoad: function () {
        var me = this;
        core.User.requireLogin()
        me.method.handlerForm()
    },
    bindEvent: function () {
        var me = this;

        $("#sub_nav_custody").addClass('active');
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
                error: function (msg) {
                    core.Message.error('系统提示', msg);
                }
            });
        },
        handlerForm: function (formData) {
            var me = fjw.pc.reset_logpwd;
            var valid = $('.submitForm').validform({
                btnSubmit: ".j-submit",
                tiptype: function (msg, o, cssctl) {
                    if (!o.obj.is("form")) {
                        var objtip = o.obj.siblings("div.input-tips").find(".err-msg");
                        cssctl(objtip, o.type);
                        if (o.type == 2) {
                            return objtip.hide()
                        }
                        objtip.show().find('.msg-cnt').text(msg);
                    }
                },
                beforeSubmit: function (curform) {
                    me.method.submit()
                    return false;
                }
            })
        },
        submit: function () {
            var me = fjw.pc.reset_logpwd, formData = {
                OldPswd: $.trim($("#oldPassword").val()),
                NewPswd: $.trim($("#newPassword").val())
            }, req = {
                M: api.method.modifyLogPwd,
                D: JSON.stringify(formData)
            };

            me.method.ajax(JSON.stringify(req), function () {
                core.Message.success('',"密码修改成功", function () {
                    core.User.logOut()
                    window.location.reload()
                });
            })
        }
    }
}
fjw.pc.reset_logpwd.init()