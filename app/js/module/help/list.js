/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-30 09:34:17 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-01 16:05:27
 */
'use strict';

require('css_path/help/list');
require('js_path/plugins/searchText/searchText.js');

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')
var doT = require('js_path/plugins/template/template')

fjw.pc.help_list = {
    query: {
        tid: core.String.getQuery('tid'),
        keywords: core.String.getQuery('keywords')
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        var me = this;
        me.method.getType();
        me.method.getHots();

        if (me.query.keywords) {
            me.method.searchResult()
        }
    },
    bindEvent: function () {
        var me = this;

        $("#F_online").on("click", function () {
            window.open("http://q.url.cn/s/R5V04Em?_type=wpa");
        });

        $(".s-history").on("click", "ul li", function () {
            $(".search-bar .search").val();
            $(".s-history").hide()
        }).on("mousemove", "ul li", function (e) {
            $(".s-history ul li").removeClass("hover")
            $(this).addClass("hover")
        });

        $(".search-bar .search").keyup(function (e) {
            var search_val = $(".search").val();
            if (13 === e.keyCode) {
                me.method.jupmSearch(search_val);
            } else {
                var reg = /[^\u0000-\u00FF]/;
                if (reg.test(search_val)) {
                    me.method.search();
                }
            }
        }).focus(function () {
            me.method.search();
        }).blur(function () {
            setTimeout(function () {
                $(".s-history").hide()
            }, 300);
        });

        $(".search-btn").click(function () {
            var search_val = $.trim($(".search").val());
            if (!!search_val) {
                me.method.jupmSearch(search_val);
            }
        });
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, JSON.parse(data))
                },
                error: function () {

                }
            });
        },
        getType: function () {
            var me = fjw.pc.help_list;
            me.method.ajax(JSON.stringify({
                M: api.method.getHelpType
            }), function (data) {
                if (!!data && data.HelpTypeList.length > 0) {
                    data.HelpTypeList.forEach(function (data) {
                        if (!data.LinkUrl) {
                            data.url = "list.html?tid=" + data.Id;
                        } else {
                            data.url = data.LinkUrl;
                        }
                    }, this);
                }

                var tpl = '<%if(HelpTypeList.length>0) {%>' +
                    '    <%for(i = 0; i < HelpTypeList.length; i ++) {%>' +
                    '        <% var data = HelpTypeList[i]; %>' +
                    '        <li><a href="<%=data.url%>"><%=data.Title%></a></li>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $('.keywords-list').html(html);
            });
        },
        getHots: function () {
            var me = fjw.pc.help_list;
            var param = {
                M: api.method.helpCenterList
            }
            if (me.query.tid > 0) {
                param.D = JSON.stringify({
                    TypeId: me.query.tid
                })
            }
            me.method.ajax(JSON.stringify(param), function (data) {
                var tpl = '<div class="help-hot-list">' +
                    '    <%if(grid.length>0) {%>' +
                    '        <%for(i = 0; i < grid.length; i ++) {%>' +
                    '            <% var data = grid[i]; %>' +
                    '            <div class="hot-item" data-id="<%=data.QId%>">' +
                    '                <i class="dot"></i><a href="./detail.html?id=<%=data.QId%>"><%=data.QTitle%></a>' +
                    '            </div>' +
                    '        <%}%>' +
                    '    <%}else{%>' +
                    '        <p class="err-tip">' +
                    '            <span>空空如也</span>' +
                    '        </p>' +
                    '    <%}%>' +
                    '</div>';

                var html = doT(tpl, data)
                $('.help-hot-list').html(html)
                $('.help-title').html(data.grid[0].TypeTitle)
            });
        },
        search: function () {
            var me = fjw.pc.help_list;
            var val = $(".search").val();

            if (!val) {
                $(".s-history").hide();
                $(".s-history ul").html("");
                return;
            };

            me.method.ajax(JSON.stringify({
                M: api.method.helpCenterList,
                D: JSON.stringify({
                    QTitle: val
                })
            }), function (data) {
                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <li><a href="./detail.html?id=<%=data.QId%>" target="_blank"><%=data.QTitle%></a></li>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $(".s-history ul").html(html);

                $(".s-history").searchText(val, {
                    "markColor": "#ff6200",
                    "nullReport": false
                }), $(".s-history ul li:first").addClass("hover");
                $(".s-history").show();
            });
        },
        jupmSearch: function (val) {
            if (!!val) {
                $("#search-link").attr("href", "./search.html?keywords=" + encodeURI(encodeURIComponent($.trim(val))));
                document.getElementById("search-link").click();
            }
        },
        searchResult: function () {
            var me = fjw.pc.help_list,
                key = decodeURI(decodeURIComponent(me.query.keywords));

            me.method.ajax(JSON.stringify({
                M: api.method.helpCenterList,
                D: JSON.stringify({
                    QTitle: key
                })
            }), function (data) {
                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <a href="./detail.html?id=<%=data.QId%>" target="_blank"><li class="q-item">' +
                    '            <div class="q-title">' +
                    '                <span><%=data.QTitle%></span><i class="fa fa-angle-right"></i>' +
                    '            </div><div class="line"></div>' +
                    '        </a></li>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $(".questions ul").html(html);

                if (data.grid.length > 0) {
                    $('.head-bar .title').html('关于“' + key + '”一共搜出' + data.grid.length + '个结果');
                } else {
                    $('.head-bar .title').html('很抱歉,没有找到关于"' + key + '"的帮助内容');
                }
            });


        }
    }
};
$(function () {
    fjw.pc.help_list.init();
})