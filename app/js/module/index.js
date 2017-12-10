/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-16 17:21:28 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-09 16:11:51
 */
'use strict';
require('css_path/index.css')
require('js_path/plugins/slider/superSlide')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')
var api = require('js_path/lib/f.data.js')
var doT = require('js_path/plugins/template/template.js')

fjw.pc.home = {
    cache: {
        member: null,
        banner: null,
        homeHot: null,
        product: null,
        statistical: null
    },
    init: function () {
        this.onPageLoad()
        this.bindEvent()
    },
    onPageLoad: function () {
        var me = this;

        me.method.homeData()
        me.method.homeNotice()
        me.method.homeObject()

    },
    bindEvent: function () {
        var me = this;

        $('#nav_home').addClass('active');

        $('.btn-close').on('click',function(){
            $('.toptips').hide()
        })

        var LeftBanner = '.left-banner';
        $(LeftBanner).find('.close').click(function () {
            $(LeftBanner + '.pic').removeAttr("onclick");
            $(this).parentsUntil(LeftBanner).animate({
                left: -145
            });
        });

        $("#gift").on("click", function () {
            me.method.openGift()
        });
        $("body").on("click", ".gift-container .close", function () {
            me.method.closeGift()
        });
        $("body").on("click", ".gift-container .mask", function () {
            me.method.closeGift()
        });
        $("body").on("click", ".gift-container .button", function () {
            //window.open("/assets/pc/pug/noviceGift.html")
        });
        $(window).on("resize", function () {
            var e = $(".dialog").hasClass("minDialog")
                , i = {};
            e ? $.extend(i, me.method.getMinPosition()) : $.extend(i, me.method.getMaxPosition()),
                $(".dialog").css({
                    top: i.top + "px",
                    left: i.left + "px"
                })
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
                }
            });
        },
        getMaxPosition: function () {
            var width = 498,
                height = 479,
                i = ($(window).width() - width) / 2,
                o = 150,
                a = ($(window).height() - height) / 2,
                s = a > o ? o : a;
            return {
                top: s,
                left: i,
                width: width,
                height: height
            }
        },
        getMinPosition: function () {
            var t = $("#gift").offset().top - $("body").scrollTop()
                , e = $("#gift").offset().left
                , i = $("#gift").outerWidth()
                , o = $("#gift").outerHeight();
            return {
                top: t,
                left: e,
                width: i,
                height: o
            }
        },
        openGift: function () {
            $(".gift-container").show()
            $(".gift-container .mask").show()
            var me = fjw.pc.home
                , pop = me.method.getMaxPosition();
            $(".dialog").animate({
                top: [pop.top + "px", "linear"],
                left: [pop.left + "px", "linear"],
                width: [pop.width + "px", "linear"],
                height: [pop.height + "px", "linear"]
            }, 250).removeClass("minDialog")
        },
        closeGift: function () {
            var me = fjw.pc.home
                , pop = me.method.getMinPosition();
            $(".gift-container .mask").hide();
            $(".dialog").animate({
                top: [pop.top + "px", "easeInCubic"],
                left: [pop.left + "px", "linear"],
                width: [pop.width + "px", "linear"],
                height: [pop.height + "px", "linear"]
            }, function () {
                $(".gift-container").hide()
            }).addClass("minDialog")
        },
        homeData: function () {
            var me = fjw.pc.home;
            if (window.user.isLogin) {
                me.cache.member = core.User.getInfo();
                $('.username').html(me.cache.member.phone)
                $('.avator').attr('src', me.cache.member.headPhoto)
                $('.lastTime span').html(core.Cookie.get('f.login-time'))
                $('.lastDevice span').html(core.Cookie.get('f.login-device'))

                $('.reg-zone-unlogin').toggleClass('f-hide')
                $('.reg-zone-login').toggleClass('f-hide')
            }
            var param = {
                M: api.method.homeData
            };

            me.method.ajax(JSON.stringify(param), function (data) {
                var html = '';
                var tpl = '<%if(banner.length>0) {%>' +
                    '         <div class="hd abs z5">' +
                    '             <ul id="thumb-li">' +
                    '             <%for(i = 0; i < banner.length; i ++) {%>' +
                    '                 <li class="<%= i==0 ? "on" : ""%>"></li>' +
                    '             <%}%>' +
                    '             </ul>' +
                    '         </div>' +
                    '         <div class="bd">' +
                    '             <ul class="slider rel" id="slideBox" >' +
                    '             <%for(i = 0; i < banner.length; i ++) {%>' +
                    '                 <% var data = banner[i]; %>' +
                    '                 <li data-opacity="0.1" style="background:url(<%= data.imgUrl%>) 50% 50% no-repeat;position:absolute;width:100%;left:0;top:0;display:<%= i==0 ? "list-item" : "none"%>;">' +
                    '                     <a href="<%= data.linkUrl %>" target="_blank"><%= data.title %></a>' +
                    '                 </li>' +
                    '             <%}%>' +
                    '             </ul>' +
                    '         </div>' +
                    '<%}%>';
                var html = doT(tpl, data);
                $('.bannner-box').html(html);

                $('.memcount').html(data.statistical.totalMemberCountData)
                $(".banner").slide({
                    mainCell: ".bd ul",
                    effect: "fold",
                    autoPlay: true,
                    interTime: 6000,
                    delayTime: 1000
                });
                $('#slideBox').css({ "width": "100%" });
                $('#slideBox').find("li").css("width", "100%");
            });
        },
        homeNotice: function () {
            var me = fjw.pc.home;
            var param = {
                M: api.method.noticeList,
                D: JSON.stringify({
                    PageSize: 1
                })
            };
            me.method.ajax(JSON.stringify(param), function (data) {
                if (data.grid.length > 0) {
                    $('.notice-item span').html(data.grid[0].Title)
                    $('.notice-item').attr('data-href', '/about/notice-detail.html?id=' + data.grid[0].ID)
                }
            });
        },
        homeObject: function () {
            var me = fjw.pc.home;
            var param = {
                M: api.method.productList,
                P: 2,
                D: JSON.stringify({
                    TypeId: 2
                })
            };

            me.method.ajax(JSON.stringify(param), function (data) {
                var html = '';

                var tpl = "<%if(grid.length>0) {%>" +
                    "      <%for(i = 0; i < grid.length; i ++) {%>" +
                    "      <% var data = grid[i]; var progress = (data.TotalShares - data.RemainingShares) / data.TotalShares * 100;if (progress == 0) {progress = 0;}if (progress > 0 && progress <= 1) {progress = 1;}progress = Math.floor(progress);%>" +
                    "      <% if(data.Id == 3){continue;}%>" +
                    "      <div class=\'col-lg-2 <%= i == grid.length-1 ? '' : 'mr15'%>\'>" +
                    "          <a class=\'fjw-subject-box tc animate\' href=\'javascript:;\' data-href=\'/product/detail.html?id=<%= data.Id %>\'>" +
                    "              <h4 class=\'fz20 text-333\'><%= data.Title %></h4>" +
                    "              <div class=\'fjw-subject-rate\'>" +
                    "                  <p class=\'big-text\'><%= data.IncomeRate.toFixed(2) %><small class=\'fz18\'>%</small></p>" +
                    "                  <p class=\'fz12 text-999\'>预期年化利率</p>" +
                    "              </div>" +
                    "              <div class=\'fjw-progress\'>" +
                    "                  <div class=\'fjw-progress-bar\' style=\'width:<%= progress %>%\'></div>" +
                    "              </div>" +
                    "              <div class=\'fjw-subject-limit fz12\'>" +
                    "                  <p class=\'f-fl text-999\'>期限：<span class=\'text-333\'><%= data.TimeLimit %></span></p>" +
                    "                  <p class=\'f-fr text-999\'>剩余：<span class=\'text-333\'><%= data.RemainingShares %></span></p>" +
                    "              </div>" +
                    "              <div class=\'mt30 <%= data.CountDown >0 ? \"fjw-count-btn-lg\" : \"fjw-btn-lg\" %>\'>" +
                    "                  <span rel=\'nofollow\' data-count=\"<%= data.CountDown %>\" class=\'<%= data.CountDown >0 ? \"timeSet\" : \"btn-text\" %>\' data-href=\'/product/detail.html?id=<%= data.Id %>\'><%= data.CountDown >0 ? \"\" : \"立即抢购\" %></span>" +
                    "              </div>" +
                    "          </a>" +
                    "      </div>" +
                    "   <%}%>" +
                    "<%}%>";

                var html = doT(tpl, data);
                $('.national').html(html);
                me.method.timeCountDown()
            });

            param.D = JSON.stringify({
                TypeId: 1,
                PageSize: 2
            });
            me.method.ajax(JSON.stringify(param), function (data) {
                var html = '';

                var tpl = "<%if(grid.length>0) {%>" +
                    "      <%for(i = 0; i < grid.length; i ++) {%>" +
                    "      <% var data = grid[i]; var progress = (data.TotalShares - data.RemainingShares) / data.TotalShares * 100;if (progress == 0) {progress = 0;}if (progress > 0 && progress <= 1) {progress = 1;}progress = Math.floor(progress);%>" +
                    "      <div class=\'col-lg-4 mt15 <%= i == grid.length-1 ? '' : 'mr15'%>\'>" +
                    "          <a class=\'fjw-subject-box-lg animate\' href=\'javascript:;\' data-href=\'/product/detail.html?id=<%= data.Id %>\'>" +
                    "              <h4 class=\'fz20 text-333\'><%= data.Title %></h4>" +
                    "              <div class=\'fjw-subject-data\'>" +
                    "                  <div class=\'f-fl subject-col-140\'>" +
                    "                      <p class=\'big-text\'><%= data.IncomeRate.toFixed(2) %><small class=\'fz18\'>%</small></p>" +
                    "                      <p class=\'mt5 fz12 text-999\'>预期年化利率</p>" +
                    "                  </div>" +
                    "                  <div class=\'f-fl subject-col-80 tc\'>" +
                    "                      <p class=\'mt25 fz18 text-333\'><%= data.TimeLimit %></p>" +
                    "                      <p class=\'mt10 fz12 text-999\'>期限</p>" +
                    "                  </div>" +
                    "                  <div class=\'f-fl subject-col-150 tc\'>" +
                    "                      <p class=\'mt25 fz18 text-333\'><%= data.RemainingShares %></p>" +
                    "                      <p class=\'mt10 fz12 text-999\'>剩余</p>" +
                    "                  </div>" +
                    "                  <div class=\'mt20 <%= data.CountDown >0 ? \"fjw-count-btn\" : \"fjw-btn\" %>\'>" +
                    "                      <span rel=\'nofollow\' data-count=\"<%= data.CountDown %>\" class=\'<%= data.CountDown >0 ? \"timeSet\" : \"btn-text\" %>\' data-href=\'/product/detail.html?id=<%= data.Id %>\'><%= data.CountDown >0 ? \"\" : \"立即抢购\" %></span>" +
                    "                  </div>" +
                    "                  <div class=\'fjw-progress\'>" +
                    "                      <div class=\'fjw-progress-bar\' style=\'width:<%= progress %>%\'></div>" +
                    "                  </div>" +
                    "              </div>" +
                    "          </a>" +
                    "      </div>" +
                    "   <%}%>" +
                    "<%}%>";

                var html = doT(tpl, data);
                $('.current').html(html);
                me.method.timeCountDown()
            });
        },
        addZero: function (n) {
            var n = parseInt(n, 10);
            if (n > 0) {
                if (n <= 9) {
                    n = "0" + n;
                }
                return String(n);
            } else {
                return "00";
            }
        },
        dateFormat: function (count) {
            var sec = fjw.pc.home.method.addZero(count % 60);
            var mini = Math.floor((count / 60)) > 0 ? fjw.pc.home.method.addZero(Math.floor((count / 60)) % 60) : "00";
            var hour = Math.floor((count / 3600)) > 0 ? fjw.pc.home.method.addZero(parseInt(count / 3600)) : "00";
            return "<span>" + hour + "</span>时<span >" + mini + "</span>分<span >" + sec + "</span>秒";
        },
        timeCountDown: function () {
            $(".timeSet").each(function () {
                var timecount = parseInt($(this).attr("data-count"));
                if (timecount >= 0) {
                    $(this).html(fjw.pc.home.method.dateFormat(timecount));
                    if (timecount == 0) {
                        $(this).html('立即抢购');
                    }
                    timecount--;
                    $(this).attr("data-count", timecount);
                }
            });
            setTimeout(fjw.pc.home.method.timeCountDown, 1000);
        }
    }
}

fjw.pc.home.init();