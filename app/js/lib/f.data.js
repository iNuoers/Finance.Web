/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-08-30 16:43:17
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-10-10 15:47:31
 */
'use strict';

var debug = false;

var api = {
    host: debug ? 'http://192.168.1.5:8081/api' : 'https://api.fangjinnet.com:1000/api',
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
        // 购买茶品
        buy: "Buy",
        // 帮助类别
        getHelpType: "GetHelpType",
        // 帮助中心
        helpCenterList: "HelpCenterListForPC",

        // 我的好友
        friendList: "GetFriendList",

        // 活动列表
        activeList: "NewActivityList",

        login: "Login",
        // 用户信息
        getMemberInfo: "GetMemberInfo",

        // 充值提现数据
        reAndWaBill: "ReAndWaBill",

        // 账单数据
        totalBillData: "GetTotalBillData",

        // 获取账单类型
        billTypeList: "GetBillTypeList",

        // 用户资金流水
        billDataList: "GetPcBillDataList",

        // 可用卡券列表
        ableCouponList: "GetAbleCouponList",
        // 不可用卡券列表
        unAbleCouponList: "GetUnableCouponList",
        // 已使用卡券
        usedCouponList: "GetUsedCouponList",
        // 已过期卡券
        overdueCouponList: "GetOverdueCouponList",

        // 账户提现
        withdraw:"Withdraw",
        // 提现信息获取
        withdrawInfo:"GetWithdrawInfo"

    }
}

module.exports = api