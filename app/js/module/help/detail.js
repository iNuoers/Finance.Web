/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-30 11:04:59 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-30 14:43:47
 */
'use strict';
require('css_path/help/list')
require('css_path/help/detail')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')
var doT = require('js_path/plugins/template/template')

fjw.pc.help_detail = {
    query: {
        id: core.String.getQuery('id')
    },
    init: function () {
        this.onLoad()
        this.bindEvent()
    },
    onLoad: function () {
        var me = this;
        me.method.getType()

        if (!!me.query.id)
            me.method.getDetail()
        else
            $('.head-bar .title').html('很抱歉,没有找到帮助内容')
    },
    bindEvent: function () {
        var me = this;
        $(".q-solve a").click(function () {
            
            var cls = $(this).attr("class")
                , qid = $(this).parent().data("qid")
                , type = "solve" == cls ? 1 : 0
                , ele = $(this).parent();

            me.method.ajax(JSON.stringify({
                M: api.method.helpSolve,
                D: JSON.stringify({
                    QId: qid,
                    IsEffective: type
                })
            }), function (data) {
                $("a", ele).hide(),
                    $(".solve-tip", ele).show()
            });
        })
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
                error: function (err) {

                }
            });
        },
        getType: function () {
            var me = fjw.pc.help_detail;
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
                    '        <li><a href="<%=data.url%>" target="_blank"><%=data.Title%></a></li>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $('.keywords-list').html(html);
            });
        },
        getDetail: function () {
            var me = fjw.pc.help_detail;
            me.method.ajax(JSON.stringify({
                M: api.method.helpCenterList,
                D: JSON.stringify({
                    QId: me.query.id
                })
            }), function (data) {
                if (data.total > 0) {
                    var obj = data.grid[0];
                    $('.head-bar .title').html(obj.QTitle)
                    $('.q-content').html(obj.QContent)
                    $('.q-solve').attr('data-qid', obj.QId)

                    var tpl = '<%if(QRelations.length>0) {%>' +
                        '    <%for(i = 0; i < QRelations.length; i ++) {%>' +
                        '        <% var data = QRelations[i]; %>' +
                        '        <a href="./detail.html?id=<%=data.QId%>"><i class="dot"></i><%=data.QTitle%></a>' +
                        '     <%}%>' +
                        '<%}%>';
                    var html = doT(tpl, obj);
                    $('.relate_list').html(html);
                }
                else {
                    $('.head-bar .title').html('很抱歉,没有找到帮助内容')
                }
            });
        }
    }
}
fjw.pc.help_detail.init()