/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-26 11:59:46 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-26 15:28:42
 */
'use strict';
require('css_path/about/cfo')
require('css_path/about/about')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/pc.core.js')
var ec = require('js_path/plugins/echarts/echarts')
// var chian = require('js_path/plugins/china.json')
require('js_path/lib/pc.apps.js')
require('js_path/lib/header.js')

fjw.pc.cfo = {
    init: function () {
        this.onLoad()
        this.bindEvent()
    },
    onLoad: function () {
        var me = this;
        me.method.getDataPandect();
        me.method.renderMap()
    },
    bindEvent: function () {
        var me = this;
        me.method.jump()
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, JSON.parse(data))
                }
            });
        },
        jump: function () {
            var tab_li = $(".title_tab li")
                , rtfs_data = $(".rtfs_data")
                , rtfs_overview = $(".rtfs_overview")
                , rtfs_statistics = $(".rtfs_statistics")
                , rtfs_overdue = $(".rtfs_overdue")
                , rtfs_user = $(".rtfs_user");

            tab_li.on('click', function () {
                var index = $(this).index()
                    , top = 0;
                switch (index) {
                    case 0:
                        top = rtfs_data.offset().top - 90;
                        break;
                    case 1:
                        top = rtfs_overview.offset().top - 90;
                        break;
                    case 2:
                        top = rtfs_statistics.offset().top - 90;
                        break;
                    case 3:
                        top = rtfs_overdue.offset().top - 90;
                        break;
                    case 4:
                        top = rtfs_user.offset().top - 90;
                        break;
                }

                $("html,body").animate({
                    scrollTop: top
                }, 1000);

                $(this).addClass('active').siblings('li').removeClass('active')
            });
        },
        getDataPandect: function () {
            var me = fjw.pc.cfo;
            me.method.ajax(JSON.stringify({
                M: api.method.statistics
            }), function (data) {
                $("#data_total").html(Number(data.TotalShares).toLocaleString());
                $("#data_month").html(Number(data.MonthShares).toLocaleString());
                $("#data_today").html(Number(data.DayShares).toLocaleString());
                $("#data_agv").html(Number(data.TotalShares / data.TotalCount).toLocaleString());
                $("#data_wait").html(Number(data.TotalNotDueIncome).toLocaleString());
                $("#data_count").html(Number(data.TotalCount).toLocaleString());
                $("#data_income").html(Number(data.TotalIncome).toLocaleString());
                $("#data_user").html(Number(data.RegCount).toLocaleString());
            })
        },
        renderMap: function () {
            var setMapOption = null, area = null, data = [{
                "province": "\u56db\u5ddd",
                "c": "5893"
            }, {
                "province": "\u5c71\u4e1c",
                "c": "4789"
            }, {
                "province": "\u6c5f\u82cf",
                "c": "4708"
            }, {
                "province": "\u6e56\u5317",
                "c": "3624"
            }, {
                "province": "\u6d59\u6c5f",
                "c": "3538"
            }, {
                "province": "\u5e7f\u4e1c",
                "c": "3295"
            }, {
                "province": "\u6e56\u5357",
                "c": "3081"
            }, {
                "province": "\u6cb3\u5357",
                "c": "3077"
            }, {
                "province": "\u6cb3\u5317",
                "c": "3060"
            }, {
                "province": "\u5b89\u5fbd",
                "c": "2523"
            }, {
                "province": "\u6c5f\u897f",
                "c": "2485"
            }, {
                "province": "\u798f\u5efa",
                "c": "2218"
            }, {
                "province": "\u5c71\u897f",
                "c": "1853"
            }, {
                "province": "\u8fbd\u5b81",
                "c": "1527"
            }, {
                "province": "\u9655\u897f",
                "c": "1438"
            }, {
                "province": "\u5e7f\u897f",
                "c": "1294"
            }, {
                "province": "\u4e0a\u6d77",
                "c": "1175"
            }, {
                "province": "\u9ed1\u9f99\u6c5f",
                "c": "1075"
            }, {
                "province": "\u5317\u4eac",
                "c": "765"
            }, {
                "province": "\u5409\u6797",
                "c": "752"
            }, {
                "province": "\u8d35\u5dde",
                "c": "679"
            }, {
                "province": "\u91cd\u5e86",
                "c": "666"
            }, {
                "province": "\u5185\u8499\u53e4",
                "c": "583"
            }, {
                "province": "\u5929\u6d25",
                "c": "567"
            }, {
                "province": "\u4e91\u5357",
                "c": "560"
            }, {
                "province": "\u7518\u8083",
                "c": "489"
            }, {
                "province": "\u65b0\u7586",
                "c": "418"
            }, {
                "province": "\u6d77\u5357",
                "c": "164"
            }, {
                "province": "\u5b81\u590f",
                "c": "141"
            }, {
                "province": "\u9752\u6d77",
                "c": "80"
            }, {
                "province": "\u897f\u85cf",
                "c": "9"
            }];
            for (var i = 0; i < data.length; i++) {
                var name = 'name',
                    value = 'value',
                    obj = data[i];
                if (obj['province'] != undefined) {
                    obj[name] = obj['province'];
                    obj[value] = obj['c'];
                    delete obj['province'];
                    delete obj['c'];
                }

            }
            $.get('http://192.168.1.53:8010/app/js/plugins/china.json', function (chinaJson) {
                ec.registerMap('china', chinaJson);
                area = ec.init(document.getElementById('map'));
                setMapOption = function (nodeName, optionData) {

                    var mapOption = {
                        tooltip: {
                            trigger: 'item'
                        },
                        dataRange: {
                            show: false,
                            min: 0,
                            max: 2500,
                            x: 'left',
                            y: 'bottom',
                            text: ['高', '低'],
                            calculable: true
                        },
                        roamController: {
                            show: false,
                            x: 'right',
                            mapTypeControl: {
                                'china': true
                            }
                        },
                        series: [{
                            name: '出借人人数',
                            type: 'map',
                            mapType: 'china',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: optionData
                        }]
                    };
                    nodeName.setOption(mapOption)
                }

                setMapOption(area, data)
            })
        }
    }
}
fjw.pc.cfo.init()