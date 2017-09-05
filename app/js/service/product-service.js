'use strict';

var _api = require('../lib/f.data.js');
var _core = require('../lib/f.core.js');

var _product = {
    productList: function (param, resolve, reject) {
        _core.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productDetail: function (param, resolve, reject) {
        _core.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productBuyRecord: function (param, resolve, reject) {
        _core.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productBuyRank: function (productId, resolve, reject) {
        _core.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productTypeList: function (param, resolve, reject) {
        _core.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
}
module.exports = _product;