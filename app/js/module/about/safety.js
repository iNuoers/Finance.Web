/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-16 16:20:08 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-16 16:22:11
 */
'use strict';
require('css_path/about/safety.css')
require('js_path/lib/pc.apps.js')
require('js_path/lib/header.js')

var safety = {
	init: function () {
		
		$('#nav_safety').addClass('active');
		
		for (var i = 1; i < 8; i++) {
			// TweenMax.to($('#icon' + i), 0, { opacity: 0 });
		}
		var num = 0;
		var s = this
		setInterval(function () {
			num++
			num = num > 4 ? 1 : num;
			switch (num) {
				case 1:
					s.moveIcon('#icon1');
					s.moveIcon('#icon3');
					break;
				case 2:
					s.moveIcon('#icon2');
					s.moveIcon('#icon6');
					break;
				case 3:
					s.moveIcon('#icon4');
					s.moveIcon('#icon7');
					break;
				case 4:
					s.moveIcon('#icon2');
					s.moveIcon('#icon3');
					s.moveIcon('#icon5');
					break;
			}
		}, 2000)
	},
	moveIcon: function (name) {
		// TweenMax.to($(name), 0, { scaleX: 1, scaleY: 1, opacity: 1 })
		// TweenMax.to($(name), 1.5, { scaleX: 3, scaleY: 3, opacity: 0 });
	},
	moveSafetySection: function () {
		for (var i = 1; i < 12; i++) {
			// TweenMax.to($('#tween' + i), 0, { scaleX: 0.1, scaleY: 0.1, opacity: 0 });
			//if (i < 6) TweenMax.to($('#tweenTitle' + i), 0, { scaleX: 0.1, scaleY: 0.1, opacity: 0 });
		}
		var scrollNum = $(document).scrollTop();
		var s = this;

		$(window).scroll(function () {
			scrollNum = $(document).scrollTop();
			//console.log(scrollNum);
			s.moveCreate(scrollNum);
		});
		s.moveCreate(scrollNum);
	},
	moveCreate: function (num) {
		if (num >= 0) {
			this.moveTweenTo("#tweenTitle1");
			this.moveTweenTo("#tween1");
			this.moveTweenTo("#tween2");
		}
		if (num > 100) this.moveTweenTo("#tweenTitle2");
		if (num > 300) {
			this.moveTweenTo("#tween3");
			this.moveTweenTo("#tween4");
		}
		if (num > 500) this.moveTweenTo("#tweenTitle3");
		if (num > 700) {
			this.moveTweenTo("#tween5");
			this.moveTweenTo("#tween6");
		}
		if (num > 1100) this.moveTweenTo("#tweenTitle4");
		if (num > 1300) {
			this.moveTweenTo("#tween7");
			this.moveTweenTo("#tween8");
		}
		if (num > 1500) this.moveTweenTo("#tweenTitle5");
		if (num > 1700) {
			this.moveTweenTo("#tween9");
			this.moveTweenTo("#tween10");
		}
		if (num > 2200) {
			this.moveTweenTo("#tween11");
		}
	},
	moveTweenTo: function (name) {
		if ($(name).css('opacity') == 0) {
			// TweenMax.to($(name), 0.6, { scaleX: 1, scaleY: 1, opacity: 1 });
		}
	}
}

$(function () {
	safety.init();
	safety.moveSafetySection();
});
