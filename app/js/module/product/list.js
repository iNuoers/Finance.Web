/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-07 15:23:37 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-27 19:44:10
 */
'use strict';

require('css_path/product/list.css')
require('js_path/plugins/pagination/pagination.css')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')

var _api = require('js_path/lib/f.data.js')
var _time = require('js_path/lib/f.time.js')
var _product = require('js_path/service/product-service.js')
var _template = require('js_path/plugins/template/template.js')
var _page = require('js_path/plugins/pagination/jquery.pagination.js')

var loading = require('view_path/layout/loading.string')
var itemTpl = require('view_path/product/index.string')

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
        $('#hot span').eq(idx).addClass("active").siblings().removeClass("active");

        me.param.ShowSellOut = idx > 0 ? 'T' : '';
        me.method.getList();
    },
    bindEvent: function () {
        var me = this;

        // 在售 和 售罄 产品切换
        $('#hot span').click(function (e) {
            $(this).hasClass("active") || $(this).addClass("active").siblings().removeClass("active");

            me.param.ShowSellOut = $(this).index() > 0 ? 'T' : '';
            me.method.getList();
        });

        // 点击排序
        $('.borrow-list-title a').click(function (e) {
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
                    callback && callback.call(this, JSON.parse(data))
                },
                beforeSend: function () {
                    $(".paging-list").html(loading)
                }
            });
        },
        getList: function () {
            var me = fjw.pc.product
                , $listCon = $(".paging-list")
                , html = '';

            me.method.ajax(JSON.stringify({
                M: _api.method.productList,
                D: JSON.stringify(me.param)
            }), function (json) {
                var data = JSON.parse(json);

                // 渲染html
                html = _template(itemTpl, data);
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
            var me = fjw.pc.product;
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
