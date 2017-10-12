/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-05 13:39:02 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-10 10:28:06
 */
'use strict';

require('js_path/plugins/pagination/pagination.css')
require('css_path/my/paydeposit')
require('css_path/my/common')

var _api = require('js_path/lib/f.data.js')
var _tab = require('js_path/lib/f.tab.js')
var _head = require('js_path/lib/f.head.js')
var _core = require('js_path/lib/f.core.js')
var _date = require('js_path/plugins/layerdate/laydate.js')
var _temp = require('js_path/plugins/template/template.js')
var _page = require('js_path/plugins/pagination/jquery.pagination.js')

fjw.pc.paydeposit = {
    query: {
        type: '',
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
                me.query.type = $('#flow_type .current a').attr('data-id');
                me.query.endTime = val;
                me.query.startTime = $('#start_time').val();
                me.method.getList();
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

        me.query.type = '';
        me.query.endTime = $('#end_time').val();
        me.query.startTime = $('#start_time').val();

        me.method.getList();
        me.method.getBillData();

    },
    initEvent: function () {
        var me = this;

        $("#sub_nav_paydeposit").addClass('active');

        $('.j-recharge,.j-drawal').on('click', function () {
            if (window.user.isLogin) {
                if (window.user.isAuthen == 1) {
                    $(this).hasClass('j-drawal') ? window.location.href = App.webUrl + '/my/withdrawal.html' : window.location.href = App.webUrl + '/my/recharge.html';
                } else {
                    window.location.href = App.webUrl + '/my/bindcard.html'
                }
            } else {
                // 跳转登录
                login(window.location.href);
            }
        });

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

            me.query.type = $('#flow_type .current a').attr('data-id');
            me.query.endTime = $('#end_time').val();
            me.query.startTime = $('#start_time').val();

            me.method.getList();
        });

        $('#flow_type').on('click', 'a', function () {
            $(this).parent().addClass('current').siblings().removeClass('current');

            me.query.type = $(this).attr('data-id');
            me.query.endTime = $('#end_time').val();
            me.query.startTime = $('#start_time').val();

            me.method.getList();
        });
    },
    method: {
        getList: function () {
            var param = {
                DateType: 5,
                StartTime: fjw.pc.paydeposit.query.startTime,
                EndTime: fjw.pc.paydeposit.query.endTime,
                PageIndex: fjw.pc.paydeposit.query.page,
                PageSize: fjw.pc.paydeposit.query.size,
                Type: fjw.pc.paydeposit.query.type
            };

            var req = {
                M: _api.method.reAndWaBill,
                D: JSON.stringify(param)
            };
            _core.ajax.request({
                url: _api.host,
                data: JSON.stringify(req),
                method: 'post',
                success: function (res) {
                    if (res == '') return;
                    var data = JSON.parse(res), html = '';
                    if (data.grid.length > 0) {
                        for (var i = 0; i < data.grid.length; i++) {
                            if (data.grid[i].Title.indexOf("进行中") > 0) {
                                data.grid[i].Title = data.grid[i].Title.replace('-进行中', '');
                                data.grid[i].StatusText = '<span style="color: #b2b5b7;">进行中</span>';
                            } else if (data.grid[i].Title.indexOf("成功") > 0) {
                                data.grid[i].Title = data.grid[i].Title.replace('-成功', '').replace('-用户提现', '');
                                data.grid[i].StatusText = '<span style="color: #18b160;">成功</span>';
                            } else if (data.grid[i].Title.indexOf("失败") > 0) {
                                data.grid[i].Title = data.grid[i].Title.replace('-失败', '').replace('-用户提现', '');
                                data.grid[i].StatusText = '<span style="color: #fc9b5e;">失败</span>';
                            } else {
                                data.grid[i].Title = data.grid[i].Title.replace('-成功', '');
                                data.grid[i].StatusText = '<span style="color: #18b160;">成功</span>';
                            }
                            if (data.grid[i].DateNumber.toString().length > 12) {
                                data.grid[i].DateNumberStr = data.grid[i].DateNumber.toString().substring(0, 4) + "-"
                                    + data.grid[i].DateNumber.toString().substring(4, 6)
                                    + "-" + data.grid[i].DateNumber.toString().substring(6, 8)
                                    + " " + data.grid[i].DateNumber.toString().substring(8, 10)
                                    + ":" + data.grid[i].DateNumber.toString().substring(10, 12)
                                    + ":" + data.grid[i].DateNumber.toString().substring(12, 14)
                            }
                            data.grid[i].Amount = _core.String.numberFormat(data.grid[i].BillAmount, 3)
                        }
                        var tpl = '<%if(grid.length>0){%>' +
                            '         <%for(i = 0; i < grid.length; i ++) {%>' +
                            '              <% var data = grid[i]; %>' +
                            '              <tr>' +
                            '                  <td><%= data._RN %></td>' +
                            '                  <td><%= data.Title %></td>' +
                            '                  <td><%= data.Amount %></td>' +
                            '                  <td><%= data.DateNumberStr %></td>' +
                            '                  <td><%:= data.StatusText %></td>' +
                            '              </tr>' +
                            '         <%}%>' +
                            '    <%}%>';

                        html = _temp(tpl, data);

                        $('.listContainer-tbody').html(html);

                        fjw.pc.paydeposit.method.initPage(data.records)
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
        getBillData: function () {
            _core.ajax.request({
                url: _api.host,
                data: JSON.stringify({
                    M: _api.method.totalBillData,
                    D: JSON.stringify({
                        DateYear: new Date().getFullYear(),
                        DateMonth: new Date().getMonth() + 1
                    })
                }),
                method: 'post',
                success: function (res) {
                    var json = JSON.parse(res);
                    setTimeout(function () {
                        $('#recharge').text('￥' + json.TotalRechargeAmountStr)
                        $('#cash').text('￥' + json.TotalWithdrawalAmountStr)
                        $('#balance').text('￥' + _core.String.twoDecimalPlaces(window.user.balance, 2))
                    }, 30)
                }
            });
        },
        initPage: function (records) {
            $('.page').pagination(records, {
                current_page: fjw.pc.paydeposit.query.page - 1,
                num_edge_entries: 1,
                num_display_entries: 4,
                callback: function (idx, ele) {
                    fjw.pc.paydeposit.query.page = idx + 1;
                    fjw.pc.paydeposit.method.getList();
                    return false;
                },
                items_per_page: fjw.pc.paydeposit.query.size
            })
        }
    }
}

$(function () {
    fjw.pc.paydeposit.init();
})