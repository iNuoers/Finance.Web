'use strict';

require('../../../js/plugins/layerdate/theme/default/laydate')
require('../../../css/my/paydeposit')
require('../../../css/my/common')

    ; (function ($) {

        console.log(1)
        var Tab = function (ele) {
            var _this = this;

            // 保存单个tab组件
            this.tab = ele;

            // 默认配置
            this.cfg = {
                // 鼠标触发类型  click moseover
                triggerType: 'mouseover',
                // 切换效果 
                effect: 'default',
                // 默认显示位置
                invoke: 1,
                // 切换间隔
                auto: false
            }

            if (this.getCfg()) {
                $.extend(this.cfg, this.getCfg())
            }

            // 保存tab标签列表、内容列表
            this.tab_items = this.tab.find('ul.tab-nav li');
            this.cont_items = this.tab.find('div.content-wrap div.content-item');

            // 保存配置
            var cfg = this.cfg;

            if (cfg.triggerType == 'click') {
                this.tab_items.click(function () {
                    _this.invoke($(this));
                })
            } else if (cfg.triggerType == 'mouseover' || cfg.triggerType != 'click') {
                this.tab_items.mouseover(function () {
                    alert(2)
                })
            }

        }

        Tab.prototype = {
            getCfg: function () {
                var cfg = this.tab.data('cfg');

                // 
                if (cfg && cfg != '') {
                    return cfg
                } else {
                    return null;
                }
            },
            // 事件驱动函数
            invoke: function (tab) {
                var _this = this;

                var idx = tab.index();
                // tab 选中状态
                tab.addClass('active').siblings().removeClass('active');
                // 切换内容区域
                var effect = this.cfg.effect;
                var items = this.cont_items;

                if (effect === 'default') {
                    items.eq(idx).addClass('current').siblings().removeClass('current');
                } else if (effect === 'effect') {
                    items.eq(idx).fadeIn().siblings().fadeOut();
                }
            }
        }

        window.Tab = Tab;

    })(jQuery);

fjw.pc.paydeposit = {
    init: function () {
        var tab = new Tab($('.js-tab').eq(0));
    }
}

$(function () {
    fjw.pc.paydeposit.init();
})