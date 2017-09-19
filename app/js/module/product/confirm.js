'use strict';
require('../../../css/product/confirm.css')
require('../../plugins/layer/skin/default/layer.css')
require('../../plugins/layer/layer.js')

var _api = require('../../lib/f.data.js');
var _head = require('../../lib/f.head.js');
var _core = require('../../lib/f.core.js');
var _product = require('../../service/product-service.js');

var page = {
    cache: {
        id: _core.Tools.getUrlParam('id'),
        amount: _core.Tools.getUrlParam('amount'),
        type: _core.Tools.getUrlParam('type'),
        rate: _core.Tools.getUrlParam('rate'),
        days: _core.Tools.getUrlParam('days')
    },
    doms: {
        btnBuy: '',
        rate: $('#rate'),
    },
    init: function () {

    },
    onLoad: function () {
        var _this = this;
        _this.initIncome();
    },
    initEvent: function () {

    },
    initIncome: function () {
        var _this = this, income = 0;
        if (_this.cache.type == 2) {
            income = val * _this.cache.days / 365 * _this.cache.rate / 100
            html += income.toFixed(2) + '元';
        } else {
            income = val * 1 / 365 * _this.cache.rate / 100;
            income < 0.01 ? html += '不足0.01元' : html += Math.floor(income * 100) / 100 + '元';
        }
    }
}

$(function () {

});
