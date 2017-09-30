/*
* @Author: mr.ben(66623978) https://github.com/iNuoers/
* @Date:   2017-09-28 13:05:42
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-28 13:05:42
*/
'use strict';

require('css_path/my/friends.css')
require('css_path/my/common')
require('js_path/plugins/pagination/pagination.css')
require('js_path/plugins/layer/skin/default/layer.css')
require('js_path/plugins/layer/layer.js')

var _api = require('js_path/lib/f.data.js')
var _tab = require('js_path/lib/f.tab.js')
var _head = require('js_path/lib/f.head.js')
var _core = require('js_path/lib/f.core.js')
var _temp = require('js_path/plugins/template/template.js')
var _page = require('js_path/plugins/pagination/jquery.pagination.js')

var page = {
	query: {
		type: 1,
		page: 1,
		size: 10
	},
	init: function () {
		this.onLoad()
		this.listenEvent()
	},
	onLoad: function () {
		var _this = this;
	},
	listenEvent: function () {

		$("#sub_nav_friends").addClass('active');

		$('.friend-tab').tab({
			callback: page.method.tabCallback
		});
		$(".tab-nav .active").trigger("click");
	},
	method: {
		tabCallback: function (ele, idx) {
			page.query.type = idx;
			page.method.getList()
		},
		getList: function () {
			var param = {
				pageIndex: page.query.page,
				pageSize: page.query.size,
				Type: page.query.type
			};

			var req = {
				M: _api.method.friendList,
				D: JSON.stringify(param)
			};
			_core.ajax.request({
				url: _api.host,
				data: JSON.stringify(req),
				method: 'post',
				success: function (res) {
					if (res == '') return;
					var data = JSON.parse(res), html = '';
					if (data.grid.length > 0) {
						var tpl = '<%if(grid.length>0){%>' +
							'         <%for(i = 0; i < grid.length; i ++) {%>' +
							'              <% var data = grid[i]; %>' +
							'              <ul class="items">' +
							'                  <li class="col_1"><%= data.friendPhone %></li>' +
							'                  <li class="col_2"><%= data.time %></li>' +
							'                  <li class="col_3"><%= data.statusText %></li>' +
							'              </ul>' +
							'         <%}%>' +
							'    <%}%>';

						html = _temp(tpl, data);

						$('#friendsTable .friend-items').html(html);

						page.method.initPage(data.records)
					} else {
						$('#friendsTable .friend-items').html('<div class="not-infos"><p>您还没有过好友,快去加油吧！</p></div>');
					}
				},
				error: function () {
					$('#friendsTable .friend-items').html('<div class="not-infos"><p>加载出错,稍后重试！</p></div>');
				},
				beforeSend: function () {
					$('.loading-mask').removeClass('f-hide')
					$('.loading-box').removeClass('f-hide')
				},
				complete: function () {
					$('.loading-mask').addClass('f-hide')
					$('.loading-box').addClass('f-hide')
				}
			})
		},
		initPage: function (records) {
			$('.page').pagination(records, {
				current_page: page.query.page - 1,
				num_edge_entries: 1,
				num_display_entries: 4,
				callback: function (idx, ele) {
					page.query.page = idx + 1;
					page.method.getList();
					return false;
				},
				items_per_page: page.query.size
			})
		}
	}
}

$(function () {
	page.init();
})