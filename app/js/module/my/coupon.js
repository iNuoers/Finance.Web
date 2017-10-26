/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-02 21:52:10 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-25 16:18:08
 */

'use strict';

require('css_path/my/coupon.css')
require('css_path/my/common')
require('js_path/plugins/pagination/pagination.css')
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

var _api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var _tab = require('js_path/lib/f.tab.js')
var _temp = require('js_path/plugins/template/template.js')
var _product = require('js_path/service/product-service.js')
var _page = require('js_path/plugins/pagination/jquery.pagination.js')

fjw.pc.coupon = {
    query: {
        type: 0,
        page: 1,
        size: 10,
        status: 0
    },
    init: function () {
        this.initEvent()
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;

        me.query.type = 1;
        me.method.getList();
    },
    initEvent: function () {
        var me = this;
        $("#sub_nav_coupon").addClass('active');

        $(".tab-nav .active").trigger("click");

        $('#card_type').on('click', 'a', function () {
            $('#flow_type span').removeClass('current').eq(0).addClass('current');
            $(this).parent().addClass('current').siblings().removeClass('current');
            me.query.type = $('#card_type .current a').attr('data-id');
            me.query.status = $('#flow_type .current a').attr('data-id');
            $('.listContainer thead tr th').eq(0).text(me.query.type == 1 ? '返现金额' : '加息额度');
            me.method.getList();
        });

        $('#flow_type').on('click', 'a', function () {
            $(this).parent().addClass('current').siblings().removeClass('current');
            me.query.type = $('#card_type .current a').attr('data-id');
            me.query.status = $('#flow_type .current a').attr('data-id');
            $('.grid-' + $('#flow_type .current a').attr('data-id')).siblings().addClass('f-hide').removeClass('f-hide')
            me.method.getList();
        });
    },
    method: {
        setParam: function () {
            var me = fjw.pc.coupon;
            var req = {
                M: me.query.status == 0 ? _api.method.ableCouponList : me.query.status == 1 ? _api.method.usedCouponList : _api.method.overdueCouponList,
                D: JSON.stringify({
                    Type: me.query.type,
                    PageIndex: me.query.page,
                    PageSize: me.query.size
                })
            };
            return JSON.stringify(req)
        },
        getList: function () {
            var me = fjw.pc.coupon;
            core.ajax({
                url: _api.host,
                data: me.method.setParam(),
                type: 'post',
                success: function (res) {
                    if (res == '') return;
                    var data = JSON.parse(res), html = '';
                    if (data.grid.length > 0) {
                        for (var i = 0; i < data.grid.length; i++) {
                            //使用条件
                            if (data.grid[i].MaxBuyPrice === -1 && data.grid[i].MinBuyPrice === -1) {
                                data.grid[i].Rules = "无限制使用";
                            } else if (data.grid[i].MinBuyPrice === -1 && data.grid[i].MaxBuyPrice > 0) {
                                data.grid[i].Rules = "低于" + data.grid[i].MaxBuyPrice + "元可用";
                            } else if (data.grid[i].MaxBuyPrice === -1 && data.grid[i].MinBuyPrice > 0) {
                                data.grid[i].Rules = "满" + data.grid[i].MinBuyPrice + "元可用";
                            } else {
                                data.grid[i].Rules = data.grid[i].MinBuyPrice + "~" + data.grid[i].MaxBuyPrice + "元可用";
                            }
                            if (data.grid[i].CouponType === 2) {
                                data.grid[i].CouponValueStr = data.grid[i].CouponValue + "%";
                            } else {
                                data.grid[i].CouponValueStr = data.grid[i].CouponValue + "元";
                            }
                            if (data.grid[i].UseEndTime.length > 10) {
                                data.grid[i].UseEndTimeStr = data.grid[i].UseEndTime.substring(0, 10);
                            } else {
                                data.grid[i].UseEndTimeStr = "～";
                            }
                            data.grid[i].Status = me.query.status;
                        }
                        var tpl = '<%for(i = 0; i < grid.length; i ++) {%>' +
                            '            <% var data = grid[i]; %>' +
                            '            <tr>' +
                            '                <td><%= data.CouponValueStr %></td>' +
                            '                <td><%= data.Rules %></td>' +
                            '                <td><%= data.UseEndTimeStr %></td>' +
                            '                <td title="<%= data.Title %>"><%= data.Title %></td>' +
                            '                <td>' +
                            '                    <div class="menu-pop <%= data.Status == 0 ? "on" : "off" %>" data-couId=<%= data.Id %>>' +
                            '                        <span class="menu-outline"><%= data.Status == 0 ? "查看详情" : data.Status == 1 ? "已使用" : "已过期" %></span><div class="mask"></div>' +
                            '                        <ul class="dropbox"></ul>' +
                            '                    </div>' +
                            '                </td>' +
                            '            </tr>' +
                            '       <%}%>';

                        html = _temp(tpl, data);

                        $('.listContainer-tbody').html(html);

                        $('.menu-pop.on').on('mouseenter', function (e) {
                            if ($(this).find('.dropbox').html() == '') {
                                me.method.getProInfo($(this).data('couid'), this)
                            }
                        })

                        $('.page').html('');
                        if (data.total > 1) {
                            me.method.initPage(data.records)
                        }
                    } else {
                        $('.listContainer-tbody').html('<tr><td colspan="5" style="text-align:center">暂无记录</td></tr>');
                    }
                },
                error: function (res) {
                    $('.listContainer-tbody').html('<tr><td colspan="5" style="text-align:center;color:red">' + res + '</td></tr>');
                }
            });
        },
        getProInfo: function (id, ele) {
            var param = {
                CardCouponRecordId: id
            };
            _product.productList(JSON.stringify({
                M: _api.method.productList,
                D: JSON.stringify(param)
            }), function (json) {
                var html = '',
                    data = JSON.parse(json);

                if (data.grid.length > 0 && data.records > 0) {
                    for (var i = 0; i < data.grid.length; i++) {
                        html += '<li><a href="javascript:;" data-href="' + App.webUrl + "/product/detail.html?id=" + data.grid[i].Id + '">' + data.grid[i].Title + '</a></li>';
                    }
                }
                $(ele).find('.dropbox').html(html)
            }, function (errMsg) {
                return '<li>暂无产品</li>';
            });
        },
        initPage: function (records) {
            $('.page').pagination(records, {
                current_page: fjw.pc.coupon.query.page - 1,
                num_edge_entries: 1,
                num_display_entries: 4,
                callback: function (idx, ele) {
                    fjw.pc.coupon.query.page = idx + 1;
                    fjw.pc.coupon.method.getList();
                    return false;
                },
                items_per_page: fjw.pc.coupon.query.size
            })
        }
    }
}

$(function () {
    fjw.pc.coupon.init();
})