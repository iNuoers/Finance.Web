'use strict';

var _f = require('../lib/fjw.js');

var _help = {
    /**
     * 
     */
    getHelpType: function(helpInfo, resolve, reject){
        _f.request({
            url     : _f.getServerUrl(''),
            data    : helpInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    /**
     * 
     */
    helpCenterList: function(helpInfo, resolve, reject){
        _f.request({
            url     : _f.getServerUrl(''),
            data    : helpInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    }
}