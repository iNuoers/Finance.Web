/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-03 20:50:41 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-01 17:10:35
 */

'use strict';

require('js_path/plugins/pagination/pagination.css')
require('css_path/my/caption')
require('css_path/my/common')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var _tab = require('js_path/lib/f.tab.js')
var _date = require('js_path/plugins/layerdate/laydate.js')
var _temp = require('js_path/plugins/template/template.js')
var _page = require('js_path/plugins/pagination/jquery.pagination.js')

fjw.pc.caption = {
    query: {
        type: 0,
        page: 1,
        size: 10,
        startTime: '',
        endTime: ''
    },
    init: function () {
        this.onPageLoad()
        this.initEvent()
    },
    onPageLoad: function () {
        var me = this;

        me.method.getBillType();

        _date.render({
            elem: '#start_time'
            , done: function (val) {
                $('#end_time').focus();
            }
            , theme: '#1088f1'
            , showBottom: false
        });
        _date.render({
            elem: '#end_time'
            , done: function (val) {
                me.method.getParam();
                me.method.getList();
            }
            , theme: '#1088f1'
            , showBottom: false
        });

        var today = new Date();
        var preDate = new Date();
        preDate.setDate(today.getDate() - 30);
        
        var endTime = core.String.formatTime(today, "yyyy-MM-dd"),
            startTime = core.String.formatTime(preDate, "yyyy-MM-dd");

        $('#end_time').val(endTime);
        $('#start_time').val(startTime);

        me.query.endTime = $('#end_time').val();
        me.query.startTime = $('#start_time').val();

    },
    initEvent: function () {
        var me = this;

        $("#sub_nav_caption").addClass('active');

        $('#period_type').on('click', 'a', function () {
            var today = new Date();
            var lastMonth = '',
                treeMonthAgo = '',
                oneYearAgo = '';
            //最近一个月
            var oneM = new Date();
            oneM.setDate(today.getDate() - 30);
            lastMonth = core.String.formatTime(oneM, "yyyy-MM-dd");
            //最近三个月
            var thM = new Date();
            thM.setDate(today.getDate() - 90);
            treeMonthAgo = core.String.formatTime(thM, "yyyy-MM-dd");

            //一年以前
            var oneY = new Date();
            oneY.setDate(today.getDate() - 365);
            oneYearAgo = core.String.formatTime(oneY, "yyyy-MM-dd");


            var startTimeLists = {
                ALL: '',
                1: core.String.formatTime(today, "yyyy-MM-dd"),
                30: lastMonth,
                90: treeMonthAgo,
                365: oneYearAgo
            };

            var period = $(this).attr('data-id');
            var startTime = startTimeLists[period],
                endTime = core.String.formatTime(today, "yyyy-MM-dd");

            $('#start_time').val(startTime);
            $('#end_time').val(endTime);

            $(this).parent().addClass('current').siblings().removeClass('current');

            me.method.getParam();

            me.method.getList();
        });

        $('#flow_type').on('click', 'a', function () {
            $(this).parent().addClass('current').siblings().removeClass('current');

            me.method.getParam();
            me.method.getList();
        });
    },
    method: {
        getParam: function () {
            fjw.pc.caption.query.page = 1;
            fjw.pc.caption.query.endTime = $('#end_time').val();
            fjw.pc.caption.query.startTime = $('#start_time').val();
            fjw.pc.caption.query.type = $('#flow_type .current a').attr('data-id');
        },
        getList: function () {
            var param = {
                TimeType: 5,
                StartDate: fjw.pc.caption.query.startTime,
                EndDate: fjw.pc.caption.query.endTime,
                pageIndex: fjw.pc.caption.query.page,
                pageSize: fjw.pc.caption.query.size,
                BillTypeID: fjw.pc.caption.query.type
            };

            var req = {
                M: api.method.billDataList,
                D: JSON.stringify(param)
            };
            core.ajax({
                url: api.host,
                data: JSON.stringify(req),
                type: 'post',
                success: function (res) {
                    if (res == '') return;
                    var data = JSON.parse(res), html = '';

                    $("#income").text('￥' + data.PcMemberBillSum.TotalIncomeStr);
                    $("#recharge").text('￥' + data.PcMemberBillSum.TotalRechargeAmountStr);
                    $("#withdrawal").text('￥' + data.PcMemberBillSum.TotalWithdrawalAmountStr);

                    if (data.PcMemberBillData.grid.length > 0) {
                        var grid = data.PcMemberBillData.grid;
                        var tpl = '<%for(i = 0; i < grid.length; i ++) {%>' +
                            '            <% var data = grid[i]; %>' +
                            '            <tr>' +
                            '                <td><%= data.Title %></td>' +
                            '                <td><%= data.BillAmountStr %></td>' +
                            '                <td><%= data.CreateTimeStr %></td>' +
                            '                <td><%:= data.Status %></td>' +
                            '            </tr>' +
                            '       <%}%>';

                        html = _temp(tpl, data.PcMemberBillData);

                        $('.listContainer-tbody').html(html);

                        fjw.pc.caption.method.initPage(data.PcMemberBillData.records)
                    } else {
                        $('.listContainer-tbody').html('<tr><td colspan="5" style="text-align:center">暂无记录</td></tr>');
                    }
                },
                error: function () {
                    $('.listContainer-tbody').html('<tr><td colspan="5" style="text-align:center">加载出错,稍后重试！</td></tr>');
                },
                beforeSend: function () {
                    $('.loading-mask').removeClass('f-hide')
                    $('.loading-box').removeClass('f-hide')
                },
                complete: function () {
                    $('.loading-mask').addClass('f-hide')
                    $('.loading-box').addClass('f-hide')
                }
            })
        },
        getBillType: function () {
            core.ajax({
                url: api.host,
                data: JSON.stringify({
                    M: api.method.billTypeList
                }),
                type: 'post',
                success: function (res) {
                    var data = JSON.parse(res), html = '';
                    if (data.grid.length > 0) {
                        var tpl = '<%if(grid.length>0){%>' +
                            '         <%for(i = 0; i < grid.length; i ++) {%>' +
                            '              <% var data = grid[i]; %>' +
                            '              <span class="<%= data.BillType == 0 ? "current" : ""%>"><a data-id="<%= data.BillType %>"><%= data.BillTypeStr %></a></span>' +
                            '         <%}%>' +
                            '    <%}%>';

                        html = _temp(tpl, data);

                        $('#flow_type').html(html);
                        fjw.pc.caption.method.getList();
                    }
                }
            });
        },
        initPage: function (records) {
            $('.page').html('');
            $('.page').pagination(records, {
                current_page: fjw.pc.caption.query.page - 1,
                num_edge_entries: 1,
                num_display_entries: 4,
                callback: function (idx, ele) {
                    fjw.pc.caption.query.page = idx + 1;
                    fjw.pc.caption.method.getList();
                    return false;
                },
                items_per_page: fjw.pc.caption.query.size
            })
        }
    }
}

$(function () {
    fjw.pc.caption.init();
})