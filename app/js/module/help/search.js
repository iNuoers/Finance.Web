'use strict';

require('../../../css/help/list.css');
require('../../plugins/searchText/searchText.js');

var _f = require('../../lib/f.core.js');

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
        }),
            $(".list-box").on("mouseenter mouseleave", "li.q-item", function (e) {
                $(this).hasClass("active") ? $(this).removeClass("hover") : $(this).addClass("hover")
            }),
            $(".s-history").on("click", "ul li", function () {
                $(".search-bar .search").val();
                $(".s-history").hide()
            }).on("mousemove", "ul li", function (e) {
                $(".s-history ul li").removeClass("hover"),
                    $(this).addClass("hover")
            }),
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
            M: _f.config.apiMethod.helpCenterList,
            D: JSON.stringify(param)
        };
        _f.request({
            url: _f.getServerUrl(""),
            data: JSON.stringify(req),
            method: 'POST',
            success: function (res) {
                var data = JSON.parse(res);

                var templateIndex = $("#history-list")[0].innerHTML;
                var html = _f.renderHtml(templateIndex, data);

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
            M: _f.config.apiMethod.helpCenterList
        };

        _f.request({
            url: _f.getServerUrl(""),
            data: JSON.stringify(req),
            method: 'POST',
            success: function (res) {
                var data = JSON.parse(res);
                console.log(data);
                _this.renderData(data);
            },
            error: function () {

            }
        });
    },
    loadHelpType: function () {
        var _this = this;
        var req = {
            M: _f.config.apiMethod.getHelpType
        };

        _f.request({
            url: _f.getServerUrl(""),
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
                var templateIndex = $("#keywords-list")[0].innerHTML;
                var html = _f.renderHtml(templateIndex, data);
                $('.keywords-list').html(html);
            },
            error: function () {

            }
        });
    },
    renderData: function (data) {
        // 生成HTML
        this.filter(data);
        var templateIndex = $("#help-hot-list")[0].innerHTML;
        var html = _f.renderHtml(templateIndex, data);
        $('.help-hot-list').html(html);
    },
    filter: function (data) {
        data.notEmpty = !!data.grid.length;
    }
};

$(function () {
    page.init();
})