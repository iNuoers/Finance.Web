/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-11 11:08:03 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-04 15:38:48
 */

require('css_path/my/common')
require('css_path/my/bindcard')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')

fjw.pc.mycard = {
    init: function () {
        this.onPageLoad()
        this.listenEvent()
    },
    onPageLoad: function () {
        var me = this;
        core.User.requireLogin(function () {
            me.method.getInfo()
        })
    },
    listenEvent: function () {
        var me = this;
        $("#sub_nav_bindcard").addClass('active');
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
        },
        getInfo: function () {
            var me = fjw.pc.mycard;
            me.method.ajax(JSON.stringify({
                M: api.method.withdrawInfo
            }), function (data) {
                var bank = core.Bank.bankDetail.find(function (x) {
                    return x.code === data.BankCode
                });
                var user = JSON.parse(core.Storage.getItem('f.ui.cache'))
                $('.tel').text('客服电话：' + bank.tel)
                $('.num').html(core.String.formatBank(data.RealCardNumber, true))
                $('.name').html('持卡人：' + user.member.realName)
                $('.banklogo').addClass('banklogo-' + bank.logocss).attr('title', data.BankName)
                $('.jBank').attr('data-cardid', data.RealCardNumber).attr('data-code', data.BankCode)
            })
        }
    }
}
fjw.pc.mycard.init()