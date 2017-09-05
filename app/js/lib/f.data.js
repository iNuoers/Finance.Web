/*
* @Author: mr.ben(66623978) https://github.com/iNuoers/
* @Date:   2017-08-30 16:43:17
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-08-30 16:43:17
*/
'use strict';

var debug = false;

var api = {
    host: debug ? 'http://192.168.1.10:8001/api' : 'https://api.fangjinnet.com:1000/api',
    method: {
        // 产品列表
        productList: "ProductList",
        // 产品详情
        productDetail: "ProductDetail",
        // 产品购买记录
        productBuyRecord: "BuyRecord",
        // 产品购买排行榜
        productBuyRank: "ProductBuyRank",
        // 产品类型
        productTypeList: "GetProductTypes",

        // 帮助类别
        getHelpType: "GetHelpType",
        // 帮助中心
        helpCenterList: "HelpCenterListForPC",

        // 我的好友
        getFriendList: "GetFriendList",

        // 活动列表
        activeList: "NewActivityList",

        login: "Login",
        // 用户信息
        getMemberInfo:"GetMemberInfo"

    }
}

module.exports = api