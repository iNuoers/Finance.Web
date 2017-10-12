/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-11 11:07:56 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-11 17:42:05
 */

require('css_path/my/invite')
require('css_path/my/common')

var _share = require('js_path/plugins/ishare/ishare.min')

fjw.pc.invite = {
    data: {
        copy: {
            path: '',
            link: '夏天福气旺，168元迎新大礼包+最高6%加息券火热来袭，福利满满等你来拿！'
        },
        // 新浪微博
        wb_invite_url: 'https://www.itouzi.com/i/18DC-aP',
        // QQ
        qq_invite_url: 'https://www.itouzi.com/i/18DC-aR',
        // QQ空间
        qqkj_invite_url: 'https://www.itouzi.com/i/18DC-aT',
        shareImg: 'https://css10-itzcdn-com.alikunlun.com/static/img/newUser/share-logo.png',
        shareTitle: '好友送你688元红包',
        shareContent: '夏天福气旺，168元迎新大礼包+最高6%加息券火热来袭，福利满满等你来拿！'
    },
    init: function () {
        var me = this;

        $("#sub_nav_invite").addClass('active');

    },
    onPageLoad: function () {
        var me = this;
        me.method.initShare(me.data)
    },
    initEvnet: function () {

    },
    method: {
        initShare: function (cfg) {
            $(".iShare-d").iShare({
                selector: ".iShare-sinaweibo",
                url: cfg.wb_invite_url,
                title: cfg.shareTitle ? cfg.shareTitle : "100元起投！年化收益12%-14%，全额本息担保",
                content: cfg.shareContent ? cfg.shareContent : "夏天福气旺，168元迎新大礼包+最高6%加息券火热来袭，福利满满等你来拿！"
            })
            $(".iShare-d").iShare({
                selector: ".iShare-qqhaoyou",
                url: cfg.qq_invite_url,
                image: cfg.shareImg,
                title: cfg.shareTitle ? cfg.shareTitle : "100元起投！年化收益12%-14%，全额本息担保",
                content: cfg.shareContent ? cfg.shareContent : "夏天福气旺，168元迎新大礼包+最高6%加息券火热来袭，福利满满等你来拿！"
            })
            $(".iShare-d").iShare({
                selector: ".iShare-qqkongjian",
                url: cfg.qqkj_invite_url,
                title: cfg.shareTitle ? cfg.shareTitle : "100元起投！年化收益12%-14%，全额本息担保",
                content: cfg.shareContent ? cfg.shareContent : "夏天福气旺，168元迎新大礼包+最高6%加息券火热来袭，福利满满等你来拿！"
            })
        }
    }
}

$(function () {
    fjw.pc.invite.init()
})