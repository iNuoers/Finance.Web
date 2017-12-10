/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-09-26 16:35:42
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-09 16:01:09
 */
'use strict';

; (function ($) {

    //定义组件参数配置
    var Tabs = function (ele, config) {
        var _this = this;

        // 保存单个tab组件
        _this.tab = ele;

        _this.config = config;

        // 默认配置
        _this.default = {
            // 鼠标触发类型  click moseover
            triggerType: 'click',
            // 切换效果 
            effect: 'default',
            // 默认显示位置
            invoke: 1,
            // 切换间隔
            auto: false,
            callback: null
        }

        //传入参数配置替换
        if (_this.getCfg() && _this.getCfg() != null) {
            $.extend(_this.default, _this.getCfg());
        }

        // 保存tab标签列表、内容列表
        _this.tab_items = _this.tab.find('.tab-nav li');
        _this.cont_items = _this.tab.find('.tab-wrap .tab-item');

        var cfg = _this.default;

        if (cfg.triggerType == 'click') {
            _this.tab_items.bind(cfg.triggerType, function (e) {
                _this.invoke($(this));
            })
        } else {
            _this.tab_items.bind("mouseover", function (e) {
                _this.invoke($(this));
            });
        }

        // 自动切换
        if (cfg.auto) {
            // 定义定时器
            _this.timer = null;
            // 计数器
            _this.loop = 0;

            _this.autoPlay(_this);

            _this.tab.hover(function () {
                window.clearInterval(_this.timer)
            }, function () {
                _this.autoPlay(_this)
            });
        }

        // 设置默认显示位置
        if (cfg.invoke > 1) {
            _this.invoke(_this.tab_items.eq(cfg.invoke - 1))
        }
    };

    // 定义组件方法
    Tabs.prototype = {
        // 获取配置参数
        getCfg: function () {
            var cfg = this.config;

            if (!(cfg && cfg != null)) {
                cfg = null;
            }
            return cfg;
        },
        // 事件驱动函数
        invoke: function (tab) {
            var idx = tab.index();
            // tab 选中状态
            tab.addClass('active').siblings().removeClass('active');

            // 切换内容区域
            var effect = this.default.effect;
            var items = this.cont_items;

            if (effect === "default") {
                items.eq(idx).addClass("current").siblings().removeClass("current");
            } else if (effect === "fade") {
                items.eq(idx).stop().fadeIn().siblings().stop().fadeOut();
            }

            // 如果配置了自动切换 设置loop的值等于当前项的值
            if (this.default.auto) {
                this.loop = idx;
            }
            
            // 启动执行计数器
            this.counter(tab);

            // 如果配置了回调方法
            if (this.default.callback) {
                this.default.callback(tab, idx)
            }
        },
        // 自动切换
        autoPlay: function (_this) {
            var _this = this,
                tab_items = this.tab_items,
                tabLength = tab_items.size(),
                cfg = this.default;

            this.timer = window.setInterval(function () {
                _this.loop++;;
                if (_this.loop >= tabLength) {
                    _this.loop = 0;
                }

                _this.invoke(tab_items.eq(_this.loop));

            }, cfg.auto);
        },
        counter: function (tab) {
            var attr = tab.attr("data-click");
            attr ? tab.attr("data-click", Number(attr) + 1) : tab.attr("data-click", 1);
        }
    }

    // 注册为 jq方法
    $.fn.extend({
        tab: function (config) {
            this.each(function () {
                new Tabs($(this), config || null);
            });
            return this;
        }
    })

    window.Tabs = Tabs;

})(jQuery);