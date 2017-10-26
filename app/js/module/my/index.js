/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-13 16:20:20 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-25 16:06:46
 */
'use strict';

require('css_path/my/index')
require('css_path/my/common')

var apps = require('js_path/lib/pc.apps.js')
var fjw = require('js_path/lib/pc.core.js')
var header = require('js_path/lib/header.js')

var _api = require('js_path/lib/f.data.js')
var _head = require('js_path/lib/f.head.js')
var _core = require('js_path/lib/f.core.js')
var _user = require('js_path/service/user-service')

var page = {
    init: function () {
        var cache = _head.cache;
        this.bindEvent();


        $("#sub_nav_index").addClass('active');
    },
    bindEvent: function () {
        var _this = this;

        $(".capital-con").delegate(".acc-type", "click", function () {
            var $cur = $(this);
            if (!$cur.hasClass("current")) {
                $(".invest-con").hide(),
                    $cur.siblings(".current").removeClass("current"),
                    $cur.addClass("current");
                var e = $cur.data("type");
                if ($(".capital-container" + e).show(),
                    1 == e) {
                    var i = $("#column");
                }
            }
        });

        $(".arrived-today").on("click", function (e) {
            $(this).find("ul").show();
            var a = new Date
                , n = a.getMonth()
                , r = a.getFullYear();

            $(".select-month").html(n + 1),
                e.stopPropagation();
        });

        $(".controller-month").on("click", function (t) {
            $(this).find("ul").show(),
                t.stopPropagation();
        });

        $(".month-list li").on('click', function (e) {
            $(".month-list").hide();
            var val = Number($(this).attr("data-val"));
            $(".select-month").html(val);
            val -= 1;
            e.stopPropagation();
        });
    }
};

$(function () {
    page.init();
});