/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-13 16:20:20 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-05 15:08:12
 */
'use strict';

require('css_path/my/index')
require('css_path/my/common')

require('js_path/plugins/poshytip/poshytip.min.js')
require('js_path/plugins/poshytip/tip-yellowsimple.css')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')
var doT = require('js_path/plugins/template/template.js')

fjw.pc.my_index = {
    init: function () {
        this.initEvent()
        this.onPageLoad()

    },
    onPageLoad: function () {
        var me = this;
        core.User.requireLogin(function () {
            me.method.getInfo()
            me.method.getAssets()
            me.method.getCurrentInvest()
        })
    },
    initEvent: function () {
        var me = this;

        $("#sub_nav_index").addClass('active');

        $('[poptips]').each(function () {
            $(this).poshytip({
                content: $(this).attr('poptips'),
                className: "tip-yellowsimple",
                alignTo: "target",
                alignX: "center",
                alignY: "top",
                showTimeout: 50,
                allowTipHover: !0
            })
        })

        $('.eye').click(function () {
            $(this).is('.close') ? me.method.hideNumber(true) : me.method.hideNumber(false)
        })
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
            me.method.getFixInvest()
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
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, (data != '' && JSON.parse(data)))
                }
            });
        },
        getInfo: function () {
            var member = core.User.getInfo();

            $('#avator').attr('src', member.headPhoto)
            $('.my-phone').html(member.phone)
            if (member.bankCardAuthen == 1 || member.realNameAuthen == 1) {
                $('.s-authen span').html('新手专享10%超高收益和更多特权')
            }
        },
        getAssets: function () {
            var me = fjw.pc.my_index;

            me.method.ajax(JSON.stringify({
                M: api.method.getWalletAssets
            }), function (data) {
                $('.yesterdayIncome strong').html(core.String.numberFormat(core.String.twoDecimalPlaces(data.YesterdayIncome, 2))).attr('data-toggle-visible', $('.yesterdayIncome strong').html())
                $('.totalIncome strong').html(core.String.numberFormat(core.String.twoDecimalPlaces(data.TotalIncome, 2))).attr('data-toggle-visible', $('.totalIncome strong').html())
                $('.notDueIncome strong').html(core.String.numberFormat(core.String.twoDecimalPlaces(data.NotDueIncome, 2))).attr('data-toggle-visible', $('.notDueIncome strong').html())

                $('.totalAccount strong').html(core.String.numberFormat(core.String.twoDecimalPlaces(data.TotalAccount, 2))).attr('data-toggle-visible', $('.totalAccount strong').html())
                $('.currentProductPrice strong').html(core.String.numberFormat(core.String.twoDecimalPlaces(data.CurrentProductPrice, 2))).attr('data-toggle-visible', $('.currentProductPrice strong').html())
                $('.regularProductPrice strong').html(core.String.numberFormat(core.String.twoDecimalPlaces(data.RegularProductPrice, 2))).attr('data-toggle-visible', $('.regularProductPrice strong').html())
                $('.balance').html(core.String.numberFormat(core.String.twoDecimalPlaces(data.AccountBalance, 2))).attr('data-toggle-visible', $('.balance').html())

            })
        },
        getCurrentInvest: function () {
            var me = fjw.pc.my_index;
            me.method.ajax(JSON.stringify({
                M: api.method.currentInvest
            }), function (data) {
                var tpl = '<%if(grid.length>0){%>' +
                    '         <%for(i = 0; i < grid.length; i ++) {%>' +
                    '              <% var data = grid[i]; if(data.ProductShares == 0) continue;%>' +
                    '              <li>' +
                    '                  <span class="dot"></span>' +
                    '                  <span class="my-protype-money-name"><%= data.Title %></span>' +
                    '                  <span class="my-protype-money-value"><%= data.ProductShares %></span>' +
                    '              </li>' +
                    '         <%}%>' +
                    '    <%}%>';
                $('.current-invest').html(doT(tpl, data));
            })
        },
        getFixInvest: function () {
            var me = fjw.pc.my_index;
            me.method.ajax(JSON.stringify({
                M: api.method.fixInvest
            }), function (data) {
                var tpl = '<%if(grid.length>0){%>' +
                    '         <%for(i = 0; i < grid.length; i ++) {%>' +
                    '              <% var data = grid[i]; if(data.ProductShares == 0) continue;%>' +
                    '              <li>' +
                    '                  <span class="dot"></span>' +
                    '                  <span class="my-protype-money-name"><%= data.Title %></span>' +
                    '                  <span class="my-protype-money-value"><%= data.ProductShares %></span>' +
                    '              </li>' +
                    '         <%}%>' +
                    '    <%}%>';
                $('.fix-invest').html(doT(tpl, data));
            })
        },
        hideNumber: function (flag) {
            var eles = $('[data-toggle-visible');
            if (flag) {
                $('.eye').removeClass('close')
                for (var i = 0; i < eles.length; i++) {
                    var ele = eles.eq(i);
                    ele.text(ele.data('toggle-visible'))
                }
            } else {
                $('.eye').addClass('close')
                for (var i = 0; i < eles.length; i++) {
                    var ele = eles.eq(i);
                    ele.text('***')
                }
            }
        }
    }
};

fjw.pc.my_index.init()