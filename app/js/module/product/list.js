'use strict';

require('../../../css/product/list.css');

var _api = require('../../lib/f.data.js');
var _head = require('../../lib/f.head.js');
var _core = require('../../lib/f.core.js');
var _time = require('../../lib/f.time.js');
var _product = require('../../service/product-service.js');
var _template = require('../../plugins/template/template.js');

var itemTpl = require('../../../view/product/index.string');

var page = {
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
        pageIndex: 1,
        pageSize: 20,
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
        $('#nav_invest').addClass('active');
        var _this = this, main = $(".main"), idx = _core.Tools.getUrlParam("index") || 0, type = '';
        type = idx > 0 ? 'T' : '';
        $("#hot span", main).eq(idx).addClass("active").siblings().removeClass("active");
        _this.getProductList(type);
    },
    bindEvent: function () {
        var _this = this, main = $(".main"), type = '';

        $("#hot span", main).click(function () {
            var cur = $(this), idx = cur.index();
            type = idx > 0 ? 'T' : '';
            cur.hasClass("active") || cur.addClass("active").siblings().removeClass("active");
            _this.getProductList(type);
        });

        $(".borrow-list-title a", main).click(function () {
            if ($(this).hasClass("rank-default")) {
                $(".rank-default").removeClass("on").removeClass("up").removeClass("down");
                $(".rank-default").each(function (idx) {
                    var ele = $(".rank-default").eq(idx);
                    _this.orderByDes[ele.data("orderby")] && ele.siblings().text(_this.orderByDes[ele.data("orderby")].DEFAULT)
                })
                if ("ASC" == $(this).data("order")) {
                    $(this).data("sort", "1")
                    $(this).data("order", "DESC")
                    $(this).addClass("on").addClass("down")
                } else if ("DESC" == $(this).data("order")) {
                    $(this).data("order", "ASC")
                    $(this).addClass("on").addClass("up")
                }
            }

            _this.getProductList(type);
        });
    },
    getProductList: function (type) {
        var _this = this, html = '', $listCon = $(".paging-list");

        // 这里可以先给loading
        // $listCon.html('<div class="loading"></div>');

        _this.param.ShowSellOut = type;

        _product.productList(JSON.stringify({
            M: _api.method.productList,
            D: JSON.stringify(_this.param)
        }), function (json) {
            var data = JSON.parse(json);

            // 渲染html
            html = _template(itemTpl, data);
            $listCon.html(html);

            $.countdown($('.product-time'), {
                callback: function (ele) {
                    $(ele).remove();
                }
            });

            // 处理分页数据

        }, function (errMsg) {
            $listCon.html('<p class="err-tip">加载订单失败，请刷新后重试</p>');
        });
    }
}

$(function () {
    page.init();
});
