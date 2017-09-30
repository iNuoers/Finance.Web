'use strict';

require('css_path/my/coupon.css')
require('css_path/my/common')
require('js_path/plugins/pagination/pagination.css')
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

var _api = require('js_path/lib/f.data.js')
var _tab = require('js_path/lib/f.tab.js')
var _head = require('js_path/lib/f.head.js')
var _core = require('js_path/lib/f.core.js')
var _temp = require('js_path/plugins/template/template.js')
var _page = require('js_path/plugins/pagination/jquery.pagination.js')

fjw.pc.caption = {
    query: {
        type: 0,
        page: 1,
        size: 10,
        status: 0
    },
    init: function () {
        this.initEvent()
        this.onPageLoad()
    },
    onPageLoad: function () {
        var _this = this;

        _this.query.type = 1;
        _this.method.getList();
    },
    initEvent: function () {
        var _this = this;
        $("#sub_nav_coupon").addClass('active');

        $('.coupon-tab').tab({
            callback: fjw.pc.caption.method.tabCallback
        });
        $(".tab-nav .active").trigger("click");

        $('#flow_type').on('click', 'a', function () {
            $(this).parent().addClass('current').siblings().removeClass('current');
            _this.query.type = $('#flow_type .current a').attr('data-id');
            $('.grid-' + $('#flow_type .current a').attr('data-id')).siblings().addClass('f-hide').removeClass('f-hide')
            _this.method.getList();
        });
    },
    method: {
        tabCallback: function (ele, idx) {
            fjw.pc.caption.query.type = idx;
            fjw.pc.caption.method.getList()
        },
        setParam: function () {
            var req = {
                M: fjw.pc.caption.query.status = 0 ? _api.method.ableCouponList : fjw.pc.caption.query.status = 1 ? _api.method.usedCouponList : _api.method.overdueCouponList,
                D: JSON.stringify({
                    Type: fjw.pc.caption.query.type,
                    PageIndex: fjw.pc.caption.query.page,
                    PageSize: fjw.pc.caption.query.size
                })
            };
            return JSON.stringify(req)
        },
        getList: function () {
            _core.ajax.request({
                url: _api.host,
                data: fjw.pc.caption.method.setParam(),
                method: 'post',
                success: function (res) {
                    if (res == '') return;
                    var data = JSON.parse(res), html = '';
                    if (data.grid.length > 0) {
                        for (var i = 0; i < data.grid.length; i++) {

                            //使用条件
                            if (data.grid[i].MaxBuyPrice === -1 && data.grid[i].MinBuyPrice === -1) {
                                data.grid[i].Rules = "无限制使用";
                            } else if (data.grid[i].MinBuyPrice === -1 && data.grid[i].MaxBuyPrice > 0) {
                                data.grid[i].Rules = "低于" + data.grid[i].MaxBuyPrice + "元可用";
                            } else if (data.grid[i].MaxBuyPrice === -1 && data.grid[i].MinBuyPrice > 0) {
                                data.grid[i].Rules = "满" + data.grid[i].MinBuyPrice + "元可用";
                            } else {
                                data.grid[i].Rules = data.grid[i].MinBuyPrice + "~" + data.grid[i].MaxBuyPrice + "元可用";
                            }
                            if (data.grid[i].CouponType === 2) {
                                data.grid[i].CouponValueStr = data.grid[i].CouponValue + "%";
                            } else {
                                data.grid[i].CouponValueStr = data.grid[i].CouponValue + "元";
                            }
                            if (data.grid[i].UseEndTime.length > 10) {
                                data.grid[i].UseEndTimeStr = data.grid[i].UseEndTime.substring(0, 10);
                            } else {
                                data.grid[i].UseEndTimeStr = "～";
                            }
                        }
                        var tpl = '<%if(grid.length>0){%>' +
                            '         <%for(i = 0; i < grid.length; i ++) {%>' +
                            '              <% var data = grid[i]; %>' +
                            '              <ul class="items">' +
                            '                  <li class="col_1"><%= data.CouponValueStr %></li>' +
                            '                  <li class="col_2"><%= data.Rules %></li>' +
                            '                  <li class="col_3"><%= data.UseEndTimeStr %></li>' +
                            '                  <li class="col_4"><%= data.Title %></li>' +
                            '                  <li class="col_5"><%= data.Title %></li>' +
                            '              </ul>' +
                            '         <%}%>' +
                            '    <%}%>';

                        html = _temp(tpl, data);

                        $('#friendsTable .friend-items').html(html);

                        //page.method.initPage(data.records)
                    } else {
                        $('#friendsTable .friend-items').html('<div class="not-infos"><p>您还没有过好友,快去加油吧！</p></div>');
                    }
                }
            });
        }
    }

}

$(function () {
    fjw.pc.caption.init();
})