'use strict';

require('../../../css/help/list');
require('../../plugins/searchText/searchText.js');

var _api = require('../../lib/f.data')
var _head = require('../../lib/f.head')
var _core = require('../../lib/f.core')
var _template = require('../../plugins/template/template')

var page = {
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        this.loadHelpType();
        this.loadHotQuestion();
    },
    bindEvent: function () {
        var _this = this;

        $("#F_online").on("click", function () {
            window.open("http://q.url.cn/s/R5V04Em?_type=wpa");
        });

        $(".s-history").on("click", "ul li", function () {
            $(".search-bar .search").val();
            $(".s-history").hide()
        }).on("mousemove", "ul li", function (e) {
            $(".s-history ul li").removeClass("hover"),
                $(this).addClass("hover")
        });

        $(".search-bar .search").keyup(function (e) {
            if (13 === e.keyCode) {
                var search_val = $(".search").val();
                _this.searchEvent(search_val);
            }
        }).focus(function () {
            _this.searchData();
        }).blur(function () {
            setTimeout(function () {
                $(".s-history").hide()
            }, 300);
        });

        $(".search-btn").click(function () {
            var search_val = $.trim($(".search").val());
            if (!!search_val) {
                _this.searchEvent(search_val);
            }
        });
    },
    searchEvent: function (val) {
        if (!!val) {
            $("#search-link").attr("href", "./help/help-search.html?keywords=" + encodeURI(encodeURIComponent($.trim(val))));
            document.getElementById("search-link").click();
        }
    },
    searchData: function () {
        var val = $(".search").val();

        if (!val) {
            $(".s-history").hide();
            $(".s-history ul").html("");
            return;
        };

        var param = {
            QTitle: val
        }, req = {
            M: _api.method.helpCenterList,
            D: JSON.stringify(param)
        };
        _core.request({
            url: _api.host,
            data: JSON.stringify(req),
            method: 'POST',
            success: function (res) {
                var data = JSON.parse(res);

                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <li><a href="<%=data.url%>" target="_blank"><%=data.QTitle%></a></li>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = _template(tpl, data);
                $(".s-history ul").html(html);

                $(".s-history").searchText(val, {
                    "markColor": "#0086e5",
                    "nullReport": false
                }), $(".s-history ul li:first").addClass("hover");
                $(".s-history").show();
            },
            error: function () {

            }
        });
    },
    loadHotQuestion: function () {
        var _this = this;
        var req = {
            M: _api.method.helpCenterList
        };

        _core.request({
            url: _api.host,
            data: JSON.stringify(req),
            method: 'POST',
            success: function (res) {
                var data = JSON.parse(res);

                var tpl = '<div class="help-hot-list">' +
                    '    <%if(grid.length>0) {%>' +
                    '        <%for(i = 0; i < grid.length; i ++) {%>' +
                    '            <% var data = grid[i]; %>' +
                    '            <div class="hot-item"  data-help-id="<%=data.QId%>">' +
                    '                <a href="./help-detail.html?id=<%=data.QId%>&tid=<%=data.TypeId%>">· <%=data.QTitle%></a>' +
                    '            </div>' +
                    '        <%}%>' +
                    '    <%}else{%>' +
                    '        <p class="err-tip">' +
                    '            <span>空空如也，</span>' +
                    '        </p>' +
                    '    <%}%>' +
                    '</div>';

                var html = _template(tpl, data);
                $('.help-hot-list').html(html);
            },
            error: function () {

            }
        });
    },
    loadHelpType: function () {
        var _this = this;
        var req = {
            M: _api.method.getHelpType
        };

        _core.request({
            url: _api.host,
            data: JSON.stringify(req),
            method: 'POST',
            success: function (res) {
                var data = JSON.parse(res);
                if (!!data && data.HelpTypeList.length > 0) {
                    data.HelpTypeList.forEach(function (data) {
                        if (!data.LinkUrl) {
                            data.url = "help-list.html?tid=" + data.Id;
                        } else {
                            data.url = data.LinkUrl;
                        }
                    }, this);
                }

                var tpl = '<%if(HelpTypeList.length>0) {%>' +
                    '    <%for(i = 0; i < HelpTypeList.length; i ++) {%>' +
                    '        <% var data = HelpTypeList[i]; %>' +
                    '        <li><a href="<%=data.url%>" target="_blank"><%=data.Title%></a></li>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = _template(tpl, data);
                $('.keywords-list').html(html);
            },
            error: function () {

            }
        });
    }
};
$(function () {
    page.init();
})