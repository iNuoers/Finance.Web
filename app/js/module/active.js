/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-09-03 11:12:27
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-04 15:39:12
 */

// https://my.oschina.net/u/3243585/blog/994423 图片延迟加载

'use strict';
require('css_path/active.css')
require('js_path/plugins/pagination/pagination.css')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')

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
        var me = this;

        $('#nav_active').addClass('active');

        me.method.getList();
    },
    method: {

        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, (data != '' && JSON.parse(data)))
                },
                error: function () {

                }
            });
        },
        getList: function () {
            var me = fjw.pc.active,
                html = '',
                $listCon = $(".act-list"),
                doT = require('js_path/plugins/template/template.js');
            require('js_path/plugins/pagination/jquery.pagination.js');

            var param = {
                M: api.method.activeList,
                D: JSON.stringify({
                    PageIndex: me.query.page,
                    PageSize: me.query.size
                })
            };
            var setPager = function (records) {
                $('.page').pagination(records, {
                    current_page: me.query.page - 1,
                    num_edge_entries: 1,
                    num_display_entries: 7,
                    callback: function (idx, ele) {
                        me.query.page = idx + 1;
                        me.method.getList();
                        return false;
                    },
                    items_per_page: me.query.size
                })
            };

            me.method.ajax(JSON.stringify(param), function (data) {
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

                html = doT(tpl, data);
                $listCon.html(html);

                if (data.total > 1) {
                    setPager(data.records)
                }
            })
        },
        setPager: function () {

        }
    }
}
$(function () {
    fjw.pc.active.init();
})