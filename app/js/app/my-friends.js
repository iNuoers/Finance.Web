'use strict';
require('../../css/my-friends.css');
require('../lib/simplePageination/simplePagination.css');
require('../lib/simplePageination/jquery.simplePagination.js');

var template = require('../lib/template/template.js')
var _header = require('./header.js'),
    _f = _header._f;

var myFriend = {
	pageObj : [
		{
			pageTotal:0,
			currentPage:1,
			pageType:0,
			dataArray:[]
		},
		{
			pageTotal:0,
			currentPage:1,
			pageType:1,
			dataArray:[]
		},
		{
			pageTotal:0,
			currentPage:1,
			pageType:2,
			dataArray:[]
		}
	],
	pageTypeId:0,

	init : function(){
		var s = this;
		$('.my-friends-listAll').hide();
		$('#loadImg').hide();
		s.getFriendList(s.pageObj[0].currentPage,10,s.pageObj[0].pageType,false);
		$('.my-friends-nav li').click(function(e){
			if($(this).css('cursor')!='default'){
				$('.my-friends-nav li').css('cursor','pointer');
				$('.my-friends-nav li').removeClass('active');
				var id = 0;
				switch($(this).text()){
					case "全部":
						$(this).css('cursor','default');
						$(this).addClass('active');
						id = 0;
						break;
					case "已邀请":
						$(this).css('cursor','default');
						$(this).addClass('active');
						id = 2;
						break;
					case "邀请成功":
						$(this).css('cursor','default');
						$(this).addClass('active');
						id = 1;
						break;
				}
				s.pageTypeId = id;
				var pageObj = s.pageObj[id]
				if(pageObj.dataArray.length == 0){
					s.getFriendList(pageObj.currentPage,10,pageObj.pageType,false);
				}else {
					s.setPaginator();
					for(var i=0;i<pageObj.dataArray.length;i++){
						if(pageObj.dataArray[i].id == pageObj.currentPage){
							s.createList(pageObj.dataArray[i].data);
							return;
						}
					}
					//console.log(s.pageObj[id].dataArray);
				}
			}
		})
	},
	getFriendList : function(pageId,pageNum,num,isChange){
		$('#loadImg').show();
		var s = this;
		var param = {
			pageIndex:pageId,
			pageSize:pageNum,
			Type:num
		};
		var req = {
			M: _f.config.apiMethod.getFriendList,
            D: JSON.stringify(param)
		};
		 _f.request({
            url: _f.config.serverHost,
            data: JSON.stringify(req),
            method: 'POST',
            success: function (res) {
            	$('#loadImg').hide();
                var data = JSON.parse(res);
                var pageObj =  s.pageObj[s.pageTypeId];
               	pageObj.pageTotal = data.total;
                $('.my-friends-listAll').empty();
                //console.log(data);
                if(!isChange)s.setPaginator();
                if(data.grid.length > 0){
                	pageObj.dataArray.push({id:pageObj.currentPage,data:data});
                	s.createList(data);
                }else{
                	$('.my-friends-listAll').hide();
                	$('.my-friends-bottom').text('暂时还没有信息哦！');
                }
            },
            error: function () {
            	$('#loadImg').hide();
            },
            hideLoading: function(){
            	$('#loadImg').hide();
            }
        });
	},
	createList : function(data){
		$('.my-friends-listAll').show();
        var tpl = "<%for(i = 0; i< grid.length; i++){%>"+
                	"<div class='my-friends-Item'>"+
                		"<ul>"+
                			"<% var data = grid[i];%>"+
                			"<li> <%=data.friendPhone%> </li>"+
                			"<li class='textCenter'> <%=data.time%> </li>"+
                			"<li class='ItemRight'> <%=data.statusText%> </li>"+
                		"</ul>"+
                	"</div>"+
                "<%}%>"	
        var html = template(tpl, data);
        $('.my-friends-listAll').html(html);
        $('#msg').hide();
	},
	setPaginator : function(){
		var pageObj = this.pageObj[this.pageTypeId];
		console.log(pageObj.pageTotal);
		$('#paginator').pagination('destroy');
		$("#paginator").pagination({
                items: pageObj.pageTotal,
                itemsOnPage: 1,
                displayedPages:3,
                prevText:'<',
                nextText:'>',
                cssStyle:'light-theme',
                onPageClick: this.changePage,
                currentPage:pageObj.currentPage
          	});
	},
	changePage : function(pageId,e){
		var pageObj = myFriend.pageObj[myFriend.pageTypeId];
		for(var i=0;i<pageObj.dataArray.length;i++){
			if(pageObj.dataArray[i].id == pageId){
				pageObj.currentPage = pageId;
				myFriend.createList(pageObj.dataArray[i].data);
				return;
			}
		}
		pageObj.currentPage = pageId;
		myFriend.getFriendList(pageObj.currentPage,10,pageObj.pageType,true);
	}
}

$(function () {
    myFriend.init();
})