/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-16 09:49:22 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-16 09:56:35
 */
'use strict';

var core = require('js_path/lib/pc.core.js');

var _product = {
    productList: function (param, resolve, reject) {
        core.ajax({
            url: core.Env.apiHost,
            data: param,
            type: 'POST',
            success: resolve,
            error: reject
        });
    },
    productDetail: function (param, resolve, reject) {
        core.ajax({
            url: core.Env.apiHost,
            data: param,
            type: 'POST',
            success: resolve,
            error: reject
        });
    },
    productBuyRecord: function (param, resolve, reject) {
        core.ajax({
            url: core.Env.apiHost,
            data: param,
            type: 'POST',
            success: resolve,
            error: reject
        });
    },
    productBuyRank: function (param, resolve, reject) {
        core.ajax({
            url: core.Env.apiHost,
            data: param,
            type: 'POST',
            success: resolve,
            error: reject
        });
    },
    productTypeList: function (param, resolve, reject) {
        core.ajax({
            url: core.Env.apiHost,
            data: param,
            type: 'POST',
            success: resolve,
            error: reject
        });
    },
    productBuy: function (param, resolve, reject, before, after) {
        core.ajax({
            url: core.Env.apiHost,
            data: param,
            type: 'POST',
            success: resolve,
            error: reject,
            beforeSend: before,
            complete: after
        });
    }
}
module.exports = _product;