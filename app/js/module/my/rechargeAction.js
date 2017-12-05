/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-12-01 11:00:29 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-04 15:38:38
 */
'use strict';

require('css_path/my/rechargeAction')
require('css_path/my/common')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')

fjw.pc.rechargeAction = {
    init: function () {
        this.initEvent()
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;
        core.User.requireLogin(function () {
        })
    },
    initEvent: function () {
        $("#sub_nav_paydeposit").addClass('active');
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
                beforeSend: function () {
                }
            });
        }
    }
}

fjw.pc.rechargeAction.init()