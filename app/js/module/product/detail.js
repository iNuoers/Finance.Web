'use strict';
require('../../../css/product/detail.css');

var _api = require('../../lib/f.data.js');
var _head = require('../../lib/f.head.js');
var _core = require('../../lib/f.core.js');
var _time = require('../../lib/f.time.js');
var _product = require('../../service/product-service.js');
var _template = require('../../plugins/template/template.js');

var page = {
    cache: {
        detail: null
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        var _this = this;
        var id = _core.Tools.getUrlParam('id');
        if (Number(id) > 0)
            _this.getDetail(_core.Tools.getUrlParam('id'))
    },
    listenEvent: function () {

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

            _this.cache.detail = JSON.parse(json);

            html = _template(tpl, data);

            $('.p-cont-top').html(html);

            _this.listenEvent();

        }, function () {

        });
    }
}

$(function () {
    page.init();
});
