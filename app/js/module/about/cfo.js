/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-26 11:59:46 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-04 15:39:20
 */
'use strict';
require('css_path/about/cfo')
require('css_path/about/about')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/pc.core.js')
var ec = require('js_path/plugins/echarts/echarts')
var doT = require('js_path/plugins/template/template.js')
require('js_path/lib/pc.apps.js')
require('js_path/lib/header.js')

fjw.pc.cfo = {
    cache: null,
    init: function () {
        this.onLoad()
        this.bindEvent()
    },
    onLoad: function () {
        var me = this;
        me.method.getData();
    },
    bindEvent: function () {
        var me = this;
        var name = location.href.split('/').pop().replace(/\.html/, '');
        $("#about_nav_" + name).parent().addClass('current');
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, (data != '' && JSON.parse(data)))
                }
            });
        },
        getData: function () {
            var me = fjw.pc.cfo;
            me.method.ajax(JSON.stringify({
                M: api.method.statistics
            }), function (data) {
                // 数据缓存
                me.cache = data;

                me.method.renderPandect();
                me.method.renderRank()
                me.method.renderMap()
            })
        },
        renderPandect: function () {
            var me = fjw.pc.cfo;
            // 渲染数据
            $("#data_total").html(Number(me.cache.TotalShares).toLocaleString());
            $("#data_month").html(Number(me.cache.MonthShares).toLocaleString());
            $("#data_today").html(Number(me.cache.DayShares).toLocaleString());
            $("#data_agv").html(Number(me.cache.TotalShares / me.cache.TotalCount).toLocaleString());
            $("#data_wait").html(Number(me.cache.TotalNotDueIncome).toLocaleString());
            $("#data_count").html(Number(me.cache.TotalCount).toLocaleString());
            $("#data_income").html(Number(me.cache.TotalIncome).toLocaleString());
            $("#data_user").html(Number(me.cache.RegCount).toLocaleString());
        },
        renderRank: function () {
            var me = fjw.pc.cfo, html = '', yearTpl = '', monthTpl = '';

            // 年榜
            yearTpl = '<%if(AnnualShareRank.length>0) {%>' +
                '    <%for(i = 0; i < AnnualShareRank.length; i ++) {%>' +
                '        <% var data = AnnualShareRank[i]; %>' +
                '        <li class="rank rank<%=(i+1)%>"><span><i><%= data.Phone %></i>——— <%= data.Shares.toLocaleString() %>元</span></li>' +
                '     <%}%>' +
                '<%}%>';
            var html = doT(yearTpl, me.cache);
            $('#year_rank').html(html);

            // 月榜
            monthTpl = '<%if(MonthlyShareRank.length>0) {%>' +
                '    <%for(i = 0; i < MonthlyShareRank.length; i ++) {%>' +
                '        <% var data = MonthlyShareRank[i]; %>' +
                '        <li class="rank rank<%=(i+1)%>"><span><i><%= data.Phone %></i>——— <%= data.Shares.toLocaleString() %>元</span></li>' +
                '     <%}%>' +
                '<%}%>';

            html = doT(monthTpl, me.cache);
            $('#month_rank').html(html);
        },
        renderMap: function () {
            var me = fjw.pc.cfo,
                setMapOption = null,
                area = null;

            for (var i = 0; i < me.cache.ProviceCount.length; i++) {
                var name = 'name',
                    value = 'value',
                    obj = me.cache.ProviceCount[i];
                if (obj['Title'] != undefined) {
                    obj[name] = obj['Title'];
                    obj[value] = obj['Cnt'];
                    delete obj['Title'];
                    delete obj['Cnt'];
                }

            }
            $.get('http://192.168.1.53:8010/app/js/plugins/china.json', function (chinaJson) {
                ec.registerMap('china', chinaJson);
                area = ec.init(document.getElementById('map'));
                setMapOption = function (nodeName, optionData) {

                    var mapOption = {
                        title: {
                            left: 'center',
                            textStyle: {
                                color: '#95cef3'
                            }
                        },
                        tooltip: {
                            show: true,
                            trigger: 'item'
                        },
                        roamController: {
                            show: false,
                            x: 'right',
                            mapTypeControl: {
                                'china': true
                            }
                        },
                        visualMap: {
                            show: false,
                            type: "continuous",
                            min: 0,
                            left: 'right',
                            top: 'bottom',
                            color: ['#016fdd', '#499de8', '#86c4f1', '#c7effb'],
                            text: ['高', '低'],
                            calculable: true
                        },
                        series: [{
                            name: '投资人人数',
                            type: 'map',
                            mapType: 'china',
                            zoom: 1.25,
                            roam: false,
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {

                                },
                                emphasis: {
                                    areaColor: "#95cef3"
                                }
                            },
                            data: optionData
                        }]
                    };
                    nodeName.setOption(mapOption)
                }

                setMapOption(area, me.cache.ProviceCount)
            })
        }
    }
}
fjw.pc.cfo.init()