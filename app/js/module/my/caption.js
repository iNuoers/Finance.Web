'use strict';

require('js_path/plugins/pagination/pagination.css')
require('css_path/my/caption')
require('css_path/my/common')

var _api = require('js_path/lib/f.data.js')
var _tab = require('js_path/lib/f.tab.js')
var _head = require('js_path/lib/f.head.js')
var _core = require('js_path/lib/f.core.js')
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
        var _this = this;

        _this.method.getBillType();

        _date.render({
            elem: '#start_time'
            , done: function (val) {
                $('#end_time').focus();
            }
            , theme: '#64A3F3'
            , showBottom: false
        });
        _date.render({
            elem: '#end_time'
            , done: function (val) {
                _this.method.getParam();
                _this.method.getList();
            }
            , theme: '#64A3F3'
            , showBottom: false
        });

        var today = new Date();
        var preDate = new Date();
        preDate.setDate(today.getDate() - 30);
        var endTime = _core.Tools.formatTime(today, "yyyy-MM-dd"),
            startTime = _core.Tools.formatTime(preDate, "yyyy-MM-dd");

        $('#end_time').val(endTime);
        $('#start_time').val(startTime);

        _this.query.endTime = $('#end_time').val();
        _this.query.startTime = $('#start_time').val();

    },
    initEvent: function () {
        var _this = this;

        $("#sub_nav_caption").addClass('active');

        $('#period_type').on('click', 'a', function () {
            var today = new Date();
            var lastMonth = '',
                treeMonthAgo = '',
                oneYearAgo = '';
            //最近一个月
            var oneM = new Date();
            oneM.setDate(today.getDate() - 30);
            lastMonth = _core.Tools.formatTime(oneM, "yyyy-MM-dd");
            //最近三个月
            var thM = new Date();
            thM.setDate(today.getDate() - 90);
            treeMonthAgo = _core.Tools.formatTime(thM, "yyyy-MM-dd");

            //一年以前
            var oneY = new Date();
            oneY.setDate(today.getDate() - 365);
            oneYearAgo = _core.Tools.formatTime(oneY, "yyyy-MM-dd");


            var startTimeLists = {
                ALL: '',
                1: _core.Tools.formatTime(today, "yyyy-MM-dd"),
                30: lastMonth,
                90: treeMonthAgo,
                365: oneYearAgo
            };

            var period = $(this).attr('data-id');
            var startTime = startTimeLists[period],
                endTime = _core.Tools.formatTime(today, "yyyy-MM-dd");

            $('#start_time').val(startTime);
            $('#end_time').val(endTime);

            $(this).parent().addClass('current').siblings().removeClass('current');

            _this.method.getParam();

            _this.method.getList();
        });

        $('#flow_type').on('click', 'a', function () {
            $(this).parent().addClass('current').siblings().removeClass('current');

            _this.method.getParam();
            _this.method.getList();
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
                M: _api.method.billDataList,
                D: JSON.stringify(param)
            };
            _core.ajax.request({
                url: _api.host,
                data: JSON.stringify(req),
                method: 'post',
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
                            '                <td><%= data.Title %></li>' +
                            '                <td><%= data.BillAmountStr %></li>' +
                            '                <td><%= data.CreateTimeStr %></li>' +
                            '                <td><%:= data.Status %></li>' +
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
            _core.ajax.request({
                url: _api.host,
                data: JSON.stringify({
                    M: _api.method.billTypeList
                }),
                method: 'post',
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