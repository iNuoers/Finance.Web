/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-20 10:35:56 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-26 10:18:46
 */
'use strict';
require('css_path/about/about')

require('js_path/lib/pc.apps.js')
require('js_path/lib/header.js')

fjw.pc.about = {
    init: function () {
        this.bindEvent()
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;

        // 渲染地图
        if ($('#allmap').length > 0) {
            me.method.renderMap()
        }

        //定位
    },
    bindEvent: function () {
        var me = this;

        $(".person-box").mouseover(function () {
            $(this).addClass('hover')
        }).mouseout(function () {
            $(this).removeClass('hover')
        });

        // 资质
        var honor = $('.honor'),
            honorIndexPage = 1, //资质荣誉当前页
            honorTotalPage = Math.ceil($('.honor dl').length / 3); //资质荣誉总页数;

        if (honorIndexPage < honorTotalPage) {
            honor.find('.btn-right').addClass('icon-right').removeClass('icon-right-disable');
        }
        honor.on('click', '.btn-left:not(.icon-left-disable)', function () {
            var $this = $(this),
                $content = honor.find('.content'),
                _left = $content.css('left');

            _left = _left.substring(0, _left.indexOf('px'));
            $this.addClass('icon-left-disable').removeClass('icon-left');
            honor.find('.content').animate({
                'left': Number(_left) + 1170
            }, function () {
                honorIndexPage = honorIndexPage - 1;
                if (honorIndexPage < honorTotalPage) {
                    honor.find('.btn-right').addClass('icon-right').removeClass('icon-right-disable');
                }
                if (honorIndexPage == 1) {
                    $this.addClass('icon-left-disable').removeClass('icon-left');
                } else {
                    $this.addClass('icon-left').removeClass('icon-left-disable');
                }
            });

        }).on('click', '.btn-right:not(.icon-right-disable)', function () {
            var $this = $(this),
                $content = honor.find('.content'),
                _left = $content.css('left');

            _left = _left.substring(0, _left.indexOf('px'));
            $this.addClass('icon-right-disable').removeClass('icon-right');
            $content.animate({
                'left': Number(_left) - 1170
            }, function () {
                honorIndexPage = honorIndexPage + 1;
                if (honorIndexPage == honorTotalPage) {
                    $this.addClass('icon-right-disable').removeClass('icon-right');
                } else {
                    $this.removeClass('icon-right-disable').addClass('icon-right');
                }
                if (honorIndexPage > 1) {
                    honor.find('.btn-left').addClass('icon-left').removeClass('icon-left-disable');
                }
            });
        });
    },
    method: {
        renderMap: function () {
            var map = new BMap.Map('allmap');
            var poi = new BMap.Point(121.429957, 31.202187);
            map.centerAndZoom(poi, 15);
            map.enableScrollWheelZoom();

            var content = '<div style="margin:0;line-height:20px;padding:2px;">' +
                '<img src="../../app/image/logo-wb.png" alt="房金网" style="float:right;zoom:1;overflow:hidden;width:80px;height:80px;margin:3px 0px 0 3px;padding:4px;"/>' +
                '地址：上海市徐汇区虹桥路777号汇京国际807室<br/><br/>电话：400-167-6880<br/>QQ群：365501376' +
                '</div>';

            //创建检索信息窗口对象
            var searchInfoWindow = null;
            searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
                title: "房金网",
                width: 275,
                height: 100,
                panel: "panel",
                enableAutoPan: true,
                searchTypes: [
                    BMAPLIB_TAB_SEARCH,
                    BMAPLIB_TAB_TO_HERE,
                    BMAPLIB_TAB_FROM_HERE
                ]
            });
            var marker = new BMap.Marker(poi);
            marker.enableDragging();
            marker.addEventListener("click", function (e) {
                searchInfoWindow.open(marker);
            })
            map.addOverlay(marker);
            searchInfoWindow.open(marker);
        }
    }
}

fjw.pc.about.init()