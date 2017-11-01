/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-07 19:19:03 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-01 17:18:27
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
    }
}

fjw.pc.bindcard.init()
































// https://www.anyitou.com/user/opengz