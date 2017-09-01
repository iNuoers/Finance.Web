/*
* @Author               : mr.ben(66623978@qq.com)
* @Date                 : 2017-08-02 16:13:42
* @Last Modified by     : mr.ben
* @Last Modified time   : 2017-08-02 16:13:42
*/
'use strict';
(function ($) {
    $.fn.searchText = function (val, opts) {
        var options = {
            divFlag: true,
            divStr: " ",
            markClass: "",
            markColor: "red",
            nullReport: true,
            callback: function () {
                return false;
            }
        };

        var settings = $.extend({}, options, opts || {}), cls;

        if (settings.markClass) {
            cls = "class='" + settings.markClass + "'";
        } else {
            cls = "style='color:" + settings.markColor + ";'";
        }

        // 对前一次高亮处理的文字还原
        $("span[rel='mark']").removeAttr("class").removeAttr("style").removeAttr("rel");

        // 字符串正则表达式关键字转化
        $.regTrim = function (s) {
            var imp = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/g;
            var imp_c = {};
            imp_c["^"] = "\\^";
            imp_c["."] = "\\.";
            imp_c["\\"] = "\\\\";
            imp_c["|"] = "\\|";
            imp_c["("] = "\\(";
            imp_c[")"] = "\\)";
            imp_c["*"] = "\\*";
            imp_c["+"] = "\\+";
            imp_c["-"] = "\\-";
            imp_c["$"] = "\$";
            imp_c["["] = "\\[";
            imp_c["]"] = "\\]";
            imp_c["?"] = "\\?";
            s = s.replace(imp, function (o) {
                return imp_c[o];
            });
            return s;
        };

        // 循环
        $(this).each(function () {
            var _this = $(this);
            val = $.trim(val);
            if (val === "") {
                alert("关键字为空");
                return false;
            } else {
                // 将关键字push到数组之中
                var arr = [];
                if (settings.divFlag) {
                    arr = val.split(settings.divStr);
                } else {
                    arr.push(val);
                }
            }
            var html = _this.html();
            // 删除注释
            html = html.replace(/<!--(?:.*)\-->/g, "");

            // 将HTML代码支离为HTML片段和文字片段，其中文字片段用于正则替换处理，而HTML片段置之不理
            var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
            var a = html.match(tags), test = 0;
            $.each(a, function (i, c) {
                if (!/<(?:.|\s)*?>/.test(c)) {//非标签
                    // 开始执行替换
                    $.each(arr, function (index, con) {
                        if (con === "") { return; }
                        var reg = new RegExp($.regTrim(con), "g");
                        if (reg.test(c)) {
                            // 正则替换
                            c = c.replace(reg, "♂" + con + "♀");
                            test = 1;
                        }
                    });
                    c = c.replace(/♂/g, "<span rel='mark' " + cls + ">").replace(/♀/g, "</span>");
                    a[i] = c;
                }
            });
            //将支离数组重新组成字符串
            var new_html = a.join("");

            $(this).html(new_html);

            if (test === 0 && settings.nullReport) {
                alert("没有搜索结果");
                return false;
            }

            //执行回调函数
            settings.callback();
        });
    }
})(jQuery);