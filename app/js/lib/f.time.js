/*
* @Author: mr.ben(66623978) https://github.com/iNuoers/
* @Date:   2017-09-01 13:05:42
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-01 13:05:42
*/
'use strict';

// 采用闭包形式
(function ($) {

    /**
     * 倒计时
     * @param {Object} ele       倒计时的元素
     * @param {Fun} callback  完成后的回调
     */
    function countDown(element, options) {
        this.element = $(element);
        this.options = $.extend({}, countDown.defaults, options);
        this._init();
    }

    countDown.defaults = {
        callback: function () { }
    }

    /**
     * 
     */
    countDown.prototype._init = function () {
        var _this = this;
        for (var i = 0; i < this.element.length; i++) {
            var timer = $(this.element[i]);

            if (timer.attr('timestamp')) {
                // 如果是时间戳 则预处理一下时间为倒计时秒数
                _this._prepareProcessTimestamp2Timer(timer);
            } else if (timer.attr('datetime')) {
                // 处理时间格式为倒计时秒数
                _this._prepareProcessDatetime2Timer(timer)
            }
            // 先调用一次 避免误差
            _this._processTimer(timer, _this.options);
            setInterval(function () {
                _this._processTimer(timer, _this.options)
            }, 1000);
        }
    }
    /**
     * 这个函数将时间戳预处理成统一的倒计时秒数
     * 对时间做一个预处理，因为如果服务器直接返回剩余的秒数的话从服务器相应到客户端虽然短到几百毫秒但总是会有偏差的，这样子不太好,所以服务器只需要设置一个时间戳表示到哪里停止就可以了
     * @param {Object} timer 
     */
    countDown.prototype._prepareProcessTimestamp2Timer = function (timer) {
        var total = parseInt(timer.attr("timestamp"));
        total = Math.round(total / 1000);
        var now = new Date().getTime() / 1000;
        timer.attr("timer", total - now);
    }

    /**
     * 将日期时间格式转为倒计时格式
     * @param {Object} timer 
     */
    countDown.prototype._prepareProcessDatetime2Timer = function (timer) {
        var timestamp = new Date(timer.attr("datetime")).getTime();
        timer.attr("timestamp", timestamp);
        this._prepareProcessTimestamp2Timer(timer);
    }

    /**
     * 倒计时，滴答滴答...
     * @param {Object} timer
     */
    countDown.prototype._processTimer = function (timer, opts) {
        var total = parseInt(timer.attr("timer"));
        var t = total;

        //倒计时不能为负
        if (total < 0)
            return opts.callback(timer);

        //找到显示时间的元素
        var day = timer.find(".day");
        var hour = timer.find(".hour");
        var minute = timer.find(".minute");
        var second = timer.find(".second");

        //刷新计时器显示的值
        if (day.length) {
            var d = Math.floor(t / (60 * 60 * 24));
            day.text(d);
            t -= d * (60 * 60 * 24);
        }
        if (hour.length) {
            var h = Math.floor(t / (60 * 60));
            hour.text((h < 10 ? "0" : "") + h);
            t -= h * (60 * 60);
        }
        if (minute.length) {
            var m = Math.floor(t / 60);
            minute.text((m < 10 ? "0" : "") + m);
            t -= m * 60;
        }
        if (second.length) {
            second.text((t < 10 ? "0" : "") + t);
        }

        //一秒过去了...
        total--;
        if (total <= 0) {
            return opts.callback(timer);
        }
        timer.attr("timer", total);
    }

    $.extend({
        countdown: function (ele, opts) {
            new countDown(ele, opts)
        }
    })

})(jQuery);