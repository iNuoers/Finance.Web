/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-23 11:30:40 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-23 14:00:42
 */
'use strict';
require('css_path/about/about')
require('js_path/plugins/pagination/pagination.css')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')

fjw.pc.notice = {
    cache: {
        id: 0,
        page: 1,
        size: 20,
        detail: null
    },
    init: function () {
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;
        me.method.getList()
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
        getList: function () {
            var me = fjw.pc.notice
                , html = ''
                , $listCon = $(".notice-list")
                , doT = require('js_path/plugins/template/template.js')
            require('js_path/plugins/pagination/jquery.pagination.js')

            me.method.ajax(JSON.stringify({
                M: api.method.noticeList,
                D: JSON.stringify({
                    PageIndex: me.cache.page,
                    PageSize: me.cache.size
                })
            }), function (data) {
                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <p class="f-cb">' +
                    '            <span><%= data.CreateTimeStr%></span>' +
                    '            <a href="javascript:;" data-href="/about/notice-detail.html?id=<%= data.ID %>" target="_blank">• 【平台公告】<%= data.Title %></a>' +
                    '        </p>' +
                    '     <%}%>' +
                    '<%}%>';

                // 渲染html
                html = doT(tpl, data);
                $listCon.html(html);


                // 处理分页数据                
                if (data.total > 1) {
                    me.method.setpager(data.records)
                } else {
                    $('.page').hide();
                }
            }, function (errMsg) {
                $listCon.html('<p class="err-tip">加载失败，请刷新后重试</p>');
            });
        },
        setpager: function (records) {
            var me = fjw.pc.notice;
            $('.page').show().pagination(records, {
                current_page: me.cache.page - 1,
                num_edge_entries: 1,
                num_display_entries: 4,
                callback: function (idx, ele) {
                    me.cache.page = idx + 1;
                    me.method.getList();
                    return false;
                },
                items_per_page: me.cache.size
            })
        }
    }
}

fjw.pc.notice.init()