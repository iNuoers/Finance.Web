/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-05 13:52:49 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-05 18:12:43
 */
'use strict';

require('css_path/my/recharge')
require('css_path/my/common')

var _api = require('js_path/lib/f.data.js')
var _head = require('js_path/lib/f.head.js')
var _core = require('js_path/lib/f.core.js')

fjw.pc.withdrawal = {
    init: function () {
        this.initEvent()
        this.onPageLoad()
    },
    onPageLoad: function () { 
        
    },
    initEvent: function () {
        $("#sub_nav_paydeposit").addClass('active');
    },
    method: {}
}

$(function () {
    fjw.pc.withdrawal.init()
})