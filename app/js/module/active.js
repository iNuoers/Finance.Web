/*
* @Author: mr.ben(66623978) https://github.com/iNuoers/
* @Date:   2017-09-03 11:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-03 11:12:27
*/

// https://my.oschina.net/u/3243585/blog/994423 图片延迟加载

'use strict';
require('../../css/active.css')
require('../plugins/pagination/pagination.css')

var _api = require('../lib/f.data.js')
var _head = require('../lib/f.head.js')
var _core = require('../lib/f.core.js')
var _template = require('../plugins/template/template.js')
var _pagination = require('../plugins/pagination/jquery.pagination.js')

fjw.pc.active = {
    query: {
        page: 1,
        size: 12,
        records: 0
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        var _this = this;
        
        $('#nav_active').addClass('active');

        _this.getList();
    },
    getList: function () {
        var _this = this, html = '', $listCon = $(".act-list");

        var param = {
            M: _api.method.activeList,
            D: JSON.stringify({
                PageIndex: _this.query.page,
                PageSize: _this.query.size
            })
        };

        _core.ajax.request({
            url: _api.host,
            data: JSON.stringify(param),
            method: 'POST',
            success: function (res) {
                var data = JSON.parse(res);
                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <dd class="act-item f-fl col-lg-8">' +
                    '            <div class="act-title">' +
                    '                <span><%= data.Title %></span>' +
                    '                <span><%= data.EndShowTimeText %>结束</span>' +
                    '            </div>' +
                    '            <div class="act-cont">' +
                    '                <img src="<%= data.ShowImageUrl %>">' +
                    '                <%if(data.IsEnd){%>' +
                    '                    <div class="mask">' +
                    '                        <a href="<%= data.LinkUrl %>" target="_blank" class="info" title="点击浏览活动详情"><%=data.Title%></a>' +
                    '                    </div>' +
                    '                <%}%>' +
                    '            </div>' +
                    '     <%}%>' +
                    '<%}%>';

                html = _template(tpl, data);

                $listCon.html(html);

                //分页-只初始化一次  
                _this.query.records = data.records;
                if ($(".pagination").html().length == '') {
                    _this.initPage();
                }
            },
            error: function () {
                alert("请求超时，请重试！");
            }
        });
    },
    initPage: function () {
        var _this = this;
        $('.page').pagination(_this.query.records, {
            current_page: _this.query.page - 1,
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            callback: _this.pageCall,
            items_per_page: _this.query.size //每页显示1项
        })
    },
    pageCall: function (idx, ele) {
        fjw.pc.active.query.page = idx + 1;
        fjw.pc.active.getList();
        return false;
    }
}
$(function () {
    fjw.pc.active.init();
})