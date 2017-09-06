'use strict';
require('../../../css/product/detail.css');
require('../../plugins/pagination/pagination.css')

var _api = require('../../lib/f.data.js');
var _head = require('../../lib/f.head.js');
var _core = require('../../lib/f.core.js');
var _time = require('../../lib/f.time.js');
var _product = require('../../service/product-service.js');
var _template = require('../../plugins/template/template.js');
var _pagination = require('../../plugins/pagination/jquery.pagination.js')

var page = {
    query: {
        id: _core.Tools.getUrlParam('id'),
        detail: null,
        recordData: {
            page: 1,
            size: 15
        }
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        var _this = this;

        $('#nav_invest').addClass('active');

        if (Number(_this.query.id) > 0)
            _this.getDetail(_core.Tools.getUrlParam('id'))
    },
    listenEvent: function () {
        var _this = this, first = true;

        _this.initTab($('.tab-nav'), $('.tab-cont'));
        $('#investRecord').click(function () {
            if (first) {
                first = false;
                _this.getRecord();
                _this.getRank();
            }
        });
    },
    initTab: function ($tab, $content) {
        var $tabs = $tab.find('.tab-nav-item');
        var $contents = $content.find('.p-cont-main');

        $.each($tabs, function (index, val) {
            $(val).data('tab', index);
            $contents.eq(index).data('tab', index);
        });

        $tabs.on('click', function (e) {
            e.preventDefault();
            var $this = $(this);
            var index = $this.data('tab');
            $contents.eq(index).removeClass('f-hide').siblings('.p-cont-main').addClass('f-hide');
            $this.addClass('tab-nav-item-selected').siblings('.tab-nav-item').removeClass('tab-nav-item-selected');
        });
    },
    getDetail: function (id) {
        var _this = this;

        var param = {
            M: _api.method.productDetail,
            D: JSON.stringify({
                'ProductId': id
            })
        };
        _product.productDetail(JSON.stringify(param), function (json) {
            var data = JSON.parse(json), html = '';
            var tpl = require('../../../view/product/detail.string');

            _this.query.detail = JSON.parse(json);

            html = _template(tpl, data);

            $('.p-cont-top').html(html);

            $.countdown($('.F-buy'), {
                callback: function (ele) {

                }
            });

            _this.listenEvent();

        }, function () {

        });
    },
    getRecord: function () {
        var _this = this;
        var param = {
            M: _api.method.productBuyRecord,
            D: JSON.stringify({
                'ProductId': _this.query.id,
                'pageIndex': _this.query.recordData.page,
                'pageSize': _this.query.recordData.size
            })
        };

        _product.productBuyRecord(JSON.stringify(param), function (json) {
            var data = JSON.parse(json), html = '';

            if (data.grid.length > 0) {
                $(".page").hide();
                $('.record-list').html('');

                var tpl = '<%if(grid.length>0){%>' +
                    '          <%for(i = 0; i < grid.length; i ++) {%>' +
                    '          <% var data = grid[i]; %>' +
                    '          <li>' +
                    '              <div class="left"><span><%= data.number %></span></div>' +
                    '              <div class="middle"><%= data.phone %></div>' +
                    '              <div class="middle">￥<%= data.amount %></div>' +
                    '              <div class="middle"><%= data.buyTime %></div>' +
                    '              <div class="right ">' +
                    '                  <i class="icon_wx"></i>'+
                    '                  <img src="https://fangjinnet.com/static/images/android.png">' +
                    '              </div>' +
                    '          </li>' +
                    '     <%}%>' +
                    '<%}%>';

                html = _template(tpl, data);

                $('.record-list').html(html);

                _this.initRecordPage(data.records);

                $(".page").show();
            }
        });
    },
    getRank: function () {
        var id = _core.Tools.getUrlParam('id');

        var query = {
            page: 1,
            size: 15
        };

        var param = {
            M: _api.method.productBuyRecord,
            D: JSON.stringify({
                'ProductId': id,
                'pageIndex': query.page,
                'pageSize': query.size
            })
        };

        _product.productBuyRank(JSON.stringify(param), function (json) {
            var data = JSON.parse(json);
            if (data.grid.length > 0) {

            }
        });
    },
    initRecordPage: function (records) {
        var _this = this;
        $('.page').pagination(records, {
            current_page: _this.query.recordData.page - 1,
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            callback: function (idx, ele) {
                _this.query.recordData.page = idx + 1;
                _this.getRecord();
                return false;
            },
            items_per_page: _this.query.recordData.size //每页显示1项
        })
    }
}

$(function () {
    page.init();
});
