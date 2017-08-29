'use strict';

var template = require('../lib/template/template.js')
var _f = require('../lib/fjw.js');

var _product = {
    productList: function (param, resolve, reject) {
        _f.request({
            url: _f.config.serverHost,
            data: param,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    productDetail: function (productId, resolve, reject) {
        _f.request({
            url: _f.config.serverHost,
            data: {
                productId: productId
            },
            success: resolve,
            error: reject
        });
    },
    productBuyRecord: function (productId, resolve, reject) {
        _f.request({
            url: _f.config.serverHost,
            data: {
                productId: productId
            },
            success: resolve,
            error: reject
        });
    },
    productBuyRank: function (productId, resolve, reject) {
        _f.request({
            url: _f.config.serverHost,
            data: {
                productId: productId
            },
            success: resolve,
            error: reject
        });
    },
    productTypeList: function (param, resolve, reject) {
        _f.request({
            url: _f.config.serverHost,
            data: {},
            success: resolve,
            error: reject
        });
    },
}
module.exports = {
    template: template,
    product: _product
};