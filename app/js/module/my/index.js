'use strict';

require('../../../css/my/index')
require('../../../css/my/common')

var _api = require('../../lib/f.data.js');
var _head = require('../../lib/f.head.js');
var _user = require('../../service/user-service');

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