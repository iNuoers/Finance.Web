'use strict';
require('../../../css/product/detail.css')
require('../../plugins/pagination/pagination.css')
require('../../plugins/layer/skin/default/layer.css')
require('../../plugins/layer/layer.js')

var _api = require('../../lib/f.data.js');
var _head = require('../../lib/f.head.js');
var _core = require('../../lib/f.core.js');
var _time = require('../../lib/f.time.js');
var _coupon = require('../../lib/f.coupon.js')
var _user = require('../../service/user-service.js');
var _product = require('../../service/product-service.js');
var _template = require('../../plugins/template/template.js');
var _pagination = require('../../plugins/pagination/jquery.pagination.js')

var page = {
    query: {
        id: _core.Tools.getUrlParam('id'),
        first: true,
        detail: null,
        recordData: {
            page: 1,
            size: 15
        }
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        var _this = this;

        $('#nav_invest').addClass('active');

        _coupon = new _coupon();
        _coupon.payMore(0);

        if (Number(_this.query.id) > 0)
            _this.initDetail()
    },
    listenEvent: function () {
        var _this = this, all = $('#all'), investAmount = $('#investAmount');

        _this.initTab($('.tab-nav'), $('.tab-cont'));

        $('#investRecord').click(function () {
            if (_this.query.first) {
                _this.query.first = false;
                _this.getRecord();
                _this.getRank();
            }
        });

        investAmount.on('keyup blue', function () {
            _this.checkAmount(_this.query.detail);
            _this.initIncome();

        });

        all.on('click', function () {
            _this.checkUserInfo();

            var _detail = _this.query.detail,
                remain = _detail.RemainingShares,
                max = _detail.MaxBuyPrice,
                start = _detail.StartBuyPrice,
                balance = user.balance.toFixed(2),
                price = 0;

            if (remain < balance && remain < max) {
                price = remain;
            } else if (remain < balance && remain > max) {
                price = max;
            } else {
                price = balance;
            }
            price = parseInt(parseInt(price) / start) * start;

            investAmount.val(price)
            investAmount.focus();

            _this.checkAmount();
        });

        $('.F-buy').on('click', function () {
            /**
             *  1.安全校验
             *  2.验证输入框金额是否符合规范
             */
            var amount = investAmount.val()
                , u = _this.checkUserInfo()
                , a = _this.checkAmount();
            amount = Number(amount).toFixed(2);

            if (u && a) {
                window.location.href = './confirm.html?id=' + _this.query.id + '&amount=' + amount + '&coupon_type=' + 'coupon_id=';
            }
        });
    },
    initTips: function () {
        $('.f-tips').hover(function (e) {
            var $target = $(this).closest('.f-tips');
            layer.tips($target.data('tips'), $target, {
                tips: [3, '#fff'],
                time: 0,
                skin: 'index-trip',
                area: ['180px'],
                success: function (layero, index) {
                    var left = parseFloat(layero.css('left').replace(/px/g, '')) + 10;
                    layero.css('left', left)
                }
            });
            $('html').css('overflow', 'auto')
        }, function () {
            layer.closeAll('tips');
        });
    },
    initTab: function ($tab, $content) {
        var $tabs = $tab.find('.tab-nav-item');
        var $contents = $content.find('.p-cont-main');

        $.each($tabs, function (index, val) {
            $(val).data('tab', index);
            $contents.eq(index).data('tab', index);
        });

        $tabs.on('click', function (e) {
            e.preventDefault();
            var $this = $(this);
            var index = $this.data('tab');
            $contents.eq(index).removeClass('f-hide').siblings('.p-cont-main').addClass('f-hide');
            $this.addClass('tab-nav-item-selected').siblings('.tab-nav-item').removeClass('tab-nav-item-selected');
        });
    },
    initDetail: function () {
        var _this = this;

        if (_core.cookie.get($.base64.btoa('F.token')) != null) {
            _user.getUserInfo(JSON.stringify({
                M: _api.method.getMemberInfo,
            }), function (json) {
                user = JSON.parse(json);

                window.user = {
                    isLogin: true,
                    token: user.token,
                    isBuy: user.isBuy,
                    phone: user.phone,
                    balance: user.balance,
                    avator: user.headPhoto,
                    isInvite: user.friendStatus,
                    isAuthen: user.realNameAuthen,
                    hasPaypwd: user.existsTradePswd
                };

                _this.getDetail();

            }, function () {
                alert('系统异常,请刷新重试！')
            });
        } else {
            _this.getDetail();
        }
    },
    getDetail: function () {
        var _this = this;

        var param = {
            M: _api.method.productDetail,
            D: JSON.stringify({
                'ProductId': _this.query.id
            })
        };

        _product.productDetail(JSON.stringify(param), function (json) {
            var data = JSON.parse(json), html = '';
            var tpl = require('../../../view/product/detail.string');

            _this.query.detail = JSON.parse(json);

            html = _template(tpl, data);

            $('.p-cont-top').html(html);

            $.countdown($('.F-buy'), {
                callback: function (ele) {

                }
            });

            _this.listenEvent();
            _this.initTips();

        }, function () {

        });
    },
    getRecord: function () {
        var _this = this;
        var param = {
            M: _api.method.productBuyRecord,
            D: JSON.stringify({
                'ProductId': _this.query.id,
                'pageIndex': _this.query.recordData.page,
                'pageSize': _this.query.recordData.size
            })
        };

        _product.productBuyRecord(JSON.stringify(param), function (json) {
            var data = JSON.parse(json), html = '';

            if (data.grid.length > 0) {
                $(".page").hide();
                $('.record-list').html('');

                var tpl = '<%if(grid.length>0){%>' +
                    '          <%for(i = 0; i < grid.length; i ++) {%>' +
                    '          <% var data = grid[i]; %>' +
                    '          <li>' +
                    '              <div class="left"><span><%= data.number %></span></div>' +
                    '              <div class="middle"><%= data.phone %></div>' +
                    '              <div class="middle">￥<%= data.amount %></div>' +
                    '              <div class="middle"><%= data.buyTime %></div>' +
                    '              <div class="right ">' +
                    '                  <i class="icon_wx"></i>' +
                    '                  <img src="https://fangjinnet.com/static/images/android.png">' +
                    '              </div>' +
                    '          </li>' +
                    '     <%}%>' +
                    '<%}%>';

                html = _template(tpl, data);

                $('.record-list').html(html);

                // 动画效果
                // $(".record-list li").each(function (idx) {
                //     $(this).addClass("animation-delay-" + idx);
                // });

                _this.initRecordPage(data.records);

                $(".page").show();
            }
        });
    },
    initRecordPage: function (records) {
        var _this = this;
        $('.page').pagination(records, {
            current_page: _this.query.recordData.page - 1,
            num_edge_entries: 1, //边缘页数
            num_display_entries: 7, //主体页数
            callback: function (idx, ele) {
                _this.query.recordData.page = idx + 1;
                _this.getRecord();
                return false;
            },
            items_per_page: _this.query.recordData.size //每页显示1项
        })
    },
    getRank: function () {
        var _this = this;

        var param = {
            M: _api.method.productBuyRank,
            D: JSON.stringify({
                'ProductId': _this.query.id
            })
        };

        _product.productBuyRank(JSON.stringify(param), function (json) {
            var data = JSON.parse(json), html = '';

            if (data.grid.length > 0) {

                //Class 样式
                data.grid.forEach(function (rows, index) {

                    if (index === 0)
                        rows.class = "first";
                    else if (index === 1)
                        rows.class = "second";
                    else if (index === 2)
                        rows.class = "three";
                    else {
                        //名次
                        rows.rank = index + 1;
                        rows.class = "top-bg";
                    }
                    rows.share = _core.String.numberFormat(rows.Shares);
                });

                var tpl = '<%if(grid.length>0){%>' +
                    '          <%for(i = 0; i < grid.length; i ++) {%>' +
                    '          <% var data = grid[i]; %>' +
                    '          <li>' +
                    '              <div class="left"><span class="<%= data.class %>"><%= data.rank %></span></div>' +
                    '              <div class="middle"><%= data.Phone %></div>' +
                    '              <div class="right">￥<%= data.share %></div>' +
                    '          </li>' +
                    '     <%}%>' +
                    '<%}%>';

                html = _template(tpl, data);

                $('.rank-list').html(html);
            }
        });
    },
    initIncome: function () {
        // 计算收益
        var _this = this
            , val = $('#investAmount').val()
            , tips = $(".dr-tips")
            , html = '预计收益：'
            , income = 0;

        if (_this.query.detail.ProductTypeParentId == 2) {
            income = val * _this.query.detail.RemainDays / 365 * (_this.query.detail.IncomeRate) / 100
            html += income.toFixed(2) + '元';
        } else {
            income = val * 1 / 365 * _this.query.detail.IncomeRate / 100;
            income < 0.01 ? html += '不足0.01元' : html += Math.floor(income * 100) / 100 + '元';
        }

        $('#expectedProfit').show().html(html);
        tips.slideDown('500');
    },
    checkUserInfo: function () {
        var flag = false;
        if (window.user) {
            if (!user.isLogin) {
                // 提示登录
                return flag;
            }
            if (user.isAuthen == 0) {
                layer.confirm('<i class="f-s-18 tip_txt">为保障资金安全，请先完善实名认证信息</i>', function () {
                    window.location.href = basicInfo.url + "/ur/accountsafe"
                })
                return flag;
            }
            if (!user.hasPaypwd) {
                layer.confirm('<i class="f-s-18 tip_txt">请先设置支付密码</i>', function () {
                    window.location.href = basicInfo.url + "/ur/accountsafe"
                })
                return flag;
            }
            flag = true;
        }
        return flag;
    },
    checkAmount: function () {
        var _this = this
            , detail = _this.query.detail
            , ele = $('#investAmount')
            , info = _this.query.detail
            , match = /^[0-9]*$/
            , amount = ele.val();

        if (!match.test(amount)) {
            amount = amount.substring(0, amount.length - 1);
        }
        if (amount > detail.RemainingShares) {
            amount = detail.RemainingShares
        }
        ele.val(amount);

        if (amount == '') {
            layer.tips('<div style="color: #333;">请输入投资金额</div>', $('#investAmount'), {
                tips: [1, '#fff']
            });
            ele.addClass("err-input");
            return false;
        }
        if (!isNaN(amount)) {
            amount = Number(amount);
            if (amount < info.StartBuyPrice) {
                // 购买金额低于起投金额
                layer.tips('<div style="color: #333;">最低' + info.StartBuyPrice + '元起投</div>', $('#investAmount'), {
                    tips: [1, '#fff']
                });
                ele.addClass("err-input");
                return false;
            } else {
                if (amount > user.balance) {
                    // 您账户余额不足，请先充值再投资
                    layer.tips('<div style="color: #333;">您账户余额不足，请先充值再投资</div>', $('#investAmount'), {
                        tips: [1, '#fff']
                    });
                    ele.addClass("err-input");
                    return false;
                } else {
                    //if(amount<)
                }
            }

        } else {
            // 投资仅支持 10 的整数倍,请输入正确的投资金额
            ele.addClass("err-input");
            return false;
        }

        ele.removeClass("err-input");
        return true;
    }
}

$(function () {
    page.init();
});
