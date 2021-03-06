/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-07 15:23:37 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-11 11:07:06
 */
'use strict';

require('css_path/product/list.css')
require('js_path/lib/f.time.js')
require('js_path/plugins/pagination/pagination.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')

fjw.pc.product = {
    orderByDes: {
        1: {
            DESC: '年化收益最多',
            ASC: '年化收益最小',
            DEFAULT: '年化收益'
        },
        2: {
            DESC: '投资期限最长',
            ASC: '投资期限最短',
            DEFAULT: '投资期限'
        }
    },
    param: {
        TypeId: 0,
        PageIndex: 1,
        PageSize: 10,
        ShowSellOut: '',
        ProductState: '',
        ProductTypeId: 0,
        orderByType: $(".rank-default.on").data("orderby"),
        orderBySort: $(".rank-default.on").data("sort")
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        var me = this
            , idx = core.String.getQuery("index") || 0;

        $('#nav_invest').addClass('active');
        $('.pro-type span').eq(idx).addClass("active").siblings().removeClass("active");

        me.param.ShowSellOut = idx > 0 ? 'T' : '';
        me.method.getList();
    },
    bindEvent: function () {
        var me = this;

        // 在售 和 售罄 产品切换
        $('.pro-type span').click(function (e) {
            $(this).hasClass("active") || $(this).addClass("active").siblings().removeClass("active");

            me.param.ShowSellOut = $(this).index() > 0 ? 'T' : '';
            me.method.getList();
        });

        // 点击排序
        $('.pro-tit a').click(function (e) {
            if ($(this).hasClass("rank-default")) {
                $(".rank-default").removeClass("on").removeClass("up").removeClass("down");
                $(".rank-default").each(function (idx) {
                    var ele = $(".rank-default").eq(idx);
                    me.orderByDes[ele.data("orderby")] && ele.siblings().text(me.orderByDes[ele.data("orderby")].DEFAULT)
                })
                if ("ASC" == $(this).data("order")) {
                    $(this).data("sort", 2)
                    $(this).data("order", "DESC")
                    $(this).addClass("on").addClass("down")
                } else if ("DESC" == $(this).data("order")) {
                    $(this).data("sort", 1)
                    $(this).data("order", "ASC")
                    $(this).addClass("on").addClass("up")
                }
                me.param.orderBySort = $(".rank-default.on").data("sort");
                me.param.orderByType = $(".rank-default.on").data("orderby");
            }

            me.method.getList();
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
        getList: function () {
            var me = fjw.pc.product
                , html = ''
                , $listCon = $(".paging-list")
                , tpl = require('view_path/product/index.string')
                , doT = require('js_path/plugins/template/template.js');

            me.method.ajax(JSON.stringify({
                M: api.method.productList,
                D: JSON.stringify(me.param)
            }), function (data) {

                // 渲染html
                html = doT(tpl, data);
                $listCon.html(html);

                // 倒计时
                $.countdown($('.product-time'), {
                    callback: function (ele) {
                        $(ele).remove();
                    }
                });

                // 处理分页数据                
                if (data.total > 1) {
                    me.method.setpager(data.records)
                } else {
                    $('.page').hide();
                }
            });
        },
        setpager: function (records) {
            var me = fjw.pc.product
                , page = require('js_path/plugins/pagination/jquery.pagination.js');

            $('.page').show().pagination(records, {
                current_page: me.param.PageIndex - 1,
                num_edge_entries: 1,
                num_display_entries: 4,
                callback: function (idx, ele) {
                    me.param.PageIndex = idx + 1;
                    me.method.getList();
                    return false;
                },
                items_per_page: me.param.PageSize
            })
        }
    }
}

$(function () {
    fjw.pc.product.init();
});
