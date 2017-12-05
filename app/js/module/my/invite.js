/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-11 11:07:56 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-03 16:13:12
 */

require('css_path/my/invite')
require('css_path/my/common')

var core = require('js_path/lib/pc.core.js')
var apps = require('js_path/lib/pc.apps.js')
var header = require('js_path/lib/header.js')

fjw.pc.invite = {
    data: {
        copy: {
            path: '',
            link: '夏天福气旺，168元迎新大礼包+最高6%加息券火热来袭，福利满满等你来拿！'
        },
        shareImg: 'https://css10-itzcdn-com.alikunlun.com/static/img/newUser/share-logo.png',
        shareTitle: '好友送你688元红包',
        shareUrl: location.protocol + "//" + (location.host || location.hostname) + "/member/common/register?invite=526921&profit=0",
        shareContent: '夏天福气旺，168元迎新大礼包+最高6%加息券火热来袭，福利满满等你来拿！'
    },
    init: function () {
        this.onPageLoad()
        this.initEvnet()
    },
    onPageLoad: function () {
        var me = this;
        me.method.initShare(me.data)
    },
    initEvnet: function () {
        var me = this;
        $("#sub_nav_invite").addClass('active');
    },
    method: {
        initShare: function (cfg) {
            window._bd_share_config = {
                "common": {
                    "bdText": cfg.shareTitle ? cfg.shareTitle : "100元起投！年化收益12%-14%，全额本息担保",
                    "bdDesc": cfg.shareContent ? cfg.shareContent : "夏天福气旺，168元迎新大礼包+最高6%加息券火热来袭，福利满满等你来拿！",
                    "bdUrl": cfg.shareUrl,
                    "bdPic": cfg.shareImg
                },
                "share": {}
            };
            with (document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
        }
    }
}

$(function () {
    fjw.pc.invite.init()
})