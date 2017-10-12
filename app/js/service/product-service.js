'use strict';

var _api = require('../lib/f.data.js');
var _core = require('../lib/f.core.js');

var _product = {
    productList: function (param, resolve, reject) {
        _core.ajax.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productDetail: function (param, resolve, reject) {
        _core.ajax.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productBuyRecord: function (param, resolve, reject) {
        _core.ajax.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productBuyRank: function (param, resolve, reject) {
        _core.ajax.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productTypeList: function (param, resolve, reject) {
        _core.ajax.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productBuy: function (param, resolve, reject, before, after) {
        _core.ajax.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject,
            beforeSend: before,
            complete: after
        });
    }
}
module.exports = _product;