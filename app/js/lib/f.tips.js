/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-06 15:45:50 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-06 21:33:49
 */
'use strict';
; (function ($) {
    var tips = function (ele, opts) {
        var me = this;
        me.ele = $(ele);
        me.cfg = $.extend({}, tips.cfg, opts);
        me.init();
    }

    tips.cfg = {
        x: 20,
        y: 20,
        zindex: 99999,
        timer: 200,
        tool_class: 'tool-tip',
        tip_class: 'tool-tips',
        tip_id: 'tool-tip',
        width: 500,
        heigh: 0
    }

    tips.prototype.init = function () {
        var me = this;
        $('.' + me.cfg.tip_class).on('mouseenter', function (e) {
            me.stopBubble(e);
            me.createHtml();
        })
    }
    tips.prototype.stopBubble = function (e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
    tips.prototype.createHtml = function () {
        var me = this, tips = $(me.ele).data('tips');
        if (!(tips == '' || tips == 'undefined' || tips == null)) {
            $('#' + me.cfg.tip_id).remove();
            var tpl = '', items = $.trim(tips).split('|');
            if (me.ele.hasClass('tool-tips')) {
                tpl += '<div id="' + me.cfg.tip_id + '" class="' + me.cfg.tool_class + '" style="position:absolute;left:-10000px;top:-10000px;display:block">';
                tpl += '<div class="items tool-tip-col">' + items + '</div>';
            }
        }
        tpl += '<b class="ar_up"></b><b class="ar_up_in"></b></div>';
        $('body').append(tpl);

        var tip = $('#' + me.cfg.tip_id);
        tip.show(function () {
            me.getPOP();
        });
        me.getPOP();
        $(".tool-tips").mouseleave(function () {
            tip.remove();
        });
    }
    tips.prototype.getPOP = function () {

        var me = this,tar=$('#' + me.cfg.tip_id);

        var aTop = me.ele.offset().top;
        var aLeft = me.ele.offset().left;
        var aHeight = me.ele.outerHeight();
        var aWidth = me.ele.outerWidth();
        var tmpWidth = tar.width();
        var tmpHeight = tar.height();
        var tmpTop = aTop - 8;//减去tool-tip的padding-top距离
        var tmpLeft = aLeft + aWidth / 2;
        var up = tar.find('.ar_up');
        var upInner = tar.find('.ar_up_in');
        if (me.ele.hasClass('tool-tips')) {
            if (tmpWidth > me.cfg.width) {
                tmpWidth = me.cfg.width;
            } else {
                tmpWidth = tar.width();
            }
        };
        var tipY = $(window).height() - (aTop + tmpHeight);
        var tipX = $(window).width() - (aLeft + tmpWidth);
        if (tipX < me.cfg.x) {
            tmpLeft = tmpLeft - (tmpWidth - aWidth / 2) + 5;
            up.css({
                left: 'auto',
                right: 5 + 'px',
                marginLeft: '0'
            });
            upInner.css({
                left: 'auto',
                right: 5 + 'px',
                marginLeft: '0'
            });
        } else {
            if (tmpLeft < tmpWidth) {
                tmpLeft = tmpLeft - aWidth / 2 - 5;
                up.css({
                    left: 5 + 'px',
                    marginLeft: '0'
                });
                upInner.css({
                    left: 5 + 'px',
                    marginLeft: '0'
                });
            } else {
                tmpLeft = tmpLeft - tmpWidth / 2;
            }
        };
        if (tipY < me.cfg.y) {
            tmpTop = tmpTop - aHeight - tmpHeight;
            up.addClass('ar_down');
            upInner.addClass('ar_down_in');
        } else {
            tmpTop = tmpTop + aHeight + 12;
        };
        tar.css({
            position: 'absolute',
            top: tmpTop,
            left: tmpLeft,
            width: tmpWidth,
            zIndex: me.cfg.zindex
        });
        tar.fadeIn('slow');
    }

    $.extend({
        tooltips: function (ele, opts) {
            new tips(ele, opts)
        }
    })

    $.fn.extend({
        tips: function (config) {
            this.each(function () {
                new tips($(this), config || null);
            });
            return this;
        }
    })
})(jQuery);