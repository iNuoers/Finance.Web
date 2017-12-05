/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-08-30 16:43:17
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-03 20:39:56
 */
'use strict';

var debug = false;

var api = {
    host: debug ? 'http://192.168.1.5:8081/api' : 'https://api.fangjinnet.com:1000/api',
    method: {
        homeData: "AppHomeData",
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
        // 问题帮助
        helpSolve: "HelperSetEffective",

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

        //充值
        recharge: "CreateRecharge",
        // 账户提现
        withdraw: "Withdraw",
        // 提现信息获取
        withdrawInfo: "GetWithdrawInfo",

        noticeList: "NoticePcList",
        noticeDetail: "",
        // 获取总账户资产
        getWalletAssets: "GetWalletAssets",
        //实时数据
        statistics: "TradingStatistics",

        // 活期投资数据
        currentInvest: "GetMyBuyCurrentForPc",
        // 活期投资列表
        currentInvestRecord: "GetMyBuyCurrentProductList",

        // 定期投资数据
        fixInvest: "GetMyBuyFixdateForPc",
        // 定期投资列表
        fixInvestRecord: "InvestProductBillList",

        // 修改用户登录密码
        modifyLogPwd: "ModifyLoginPswd",

        // 修改用户交易密码
        resetTradePwd:"ResetTradePswd"

    }
}

module.exports = api