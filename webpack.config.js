
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 环境变量配置，dev / online
const WEBPACK_ENV       = process.env.WEBPACK_ENV || 'dev';

// 获取 html-webpack-plugin参数方法
const getHtmlConfig = function (name,title) {
    return {
        template    : './app/view/' + name + '.html',
        filename    : 'view/' + name + '.html',
        favicon     : './favicon.ico',
        title       : title,
        inject      : true,
        hash        : true,
        chunks      : ['build', name],
        minify      : {
            // 压缩html
            removeComments: true,       //移除HTML中的注释
            collapseWhitespace: false   //删除空白符与换行符
        }
    };
};

// webpack config
const config = {
    // 入口文件
    entry: {
        'app'               : ['./app/js/app.js'],
        'index'             : ['./app/js/app/index.js'],
        'product/index'     : ['./app/js/app/product-list.js'],
        'product/detail'    : ['./app/js/app/product-detail.js'],
        'product/confirm'   : ['./app/js/app/product-confirm.js'],
        'product/result'    : ['./app/js/app/product-result.js'],
        'help-list'         : ['./app/js/app/help-list.js'],
        'help-search'       : ['./app/js/app/help-search.js'],
        'help-detail'       : ['./app/js/app/help-list.js'],
        'safety'            : ['./app/js/app/safety.js'],
        
        'my/index'          : ['./app/js/app/my-index.js'],
        'my/userinfo'       : ['./app/js/app/my-userinfo.js'],
        'my/custody'        : ['./app/js/app/my-custody.js'],
        'my/invest'         : ['./app/js/app/my-invest.js'],
        'my/coupon'         : ['./app/js/app/my-coupon.js'],
        'my/caption'        : ['./app/js/app/my-caption.js'],
        'my/paydeposit'     : ['./app/js/app/my-paydeposit.js'],
        'my/invite'         : ['./app/js/app/my-invite.js'],
        'my/friends'        : ['./app/js/app/my-friends.js'],

        'user-login'        : ['./app/js/app/user-login.js'],
        'user-register'     : ['./app/js/app/user-register.js'],
        'user-pass-reset'   : ['./app/js/app/user-pass-reset.js']
    },
    output: {
        path        : __dirname + '/dist/',
        publicPath  : 'dev' === WEBPACK_ENV ? '/dist/' : 'http://localhost:8088/dist/',
        filename    : 'js/[name]-[chunkhash:6].min.js'
    },
    externals: {
        'jquery': 'window.jQuery'
    },
    module: {
        loaders: [{
            test    : /\.css$/,
            loader  : ExtractTextPlugin.extract('style-loader', 'css-loader')
        }, {
            test    : /\.(gif|png|jpg)\??.*$/,
            loader  : 'url-loader',
            //?limit=8192&name=resource/[name]_[sha512:hash:base64:7].[ext]
            // query   : {
            //     /*
            //      *  limit=10000 ： 8kb
            //      *  图片大小小于10kb 采用内联的形式，否则输出图片
            //      * */
            //     limit   : 8192,
            //     name    : 'resource/[name].[ext]'
            // }
        }, 
        {
            //文件加载器，处理文件静态资源
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader',
            query:{
                limit   : 8192,
                name    : 'resource/[name].[ext]'
            }
        }, 
        {
            test    : /\.(string|html)$/,
            loader  : 'html-loader',
            query   : {
                minimize                : true,
                removeAttributeQuotes   : false
            }
        }]
    },
    plugins: [
        // 把css单独打包到文件里
        new ExtractTextPlugin('css/[name]-[chunkhash:6].min.css'),

        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
        new HtmlWebpackPlugin(getHtmlConfig('product/index', '理财产品')),
        new HtmlWebpackPlugin(getHtmlConfig('product/detail', '产品详情')),
        new HtmlWebpackPlugin(getHtmlConfig('product/confirm', '产品支付确认')),
        new HtmlWebpackPlugin(getHtmlConfig('product/result', '购买结果')),
        new HtmlWebpackPlugin(getHtmlConfig('active-list', '活动列表')),
        new HtmlWebpackPlugin(getHtmlConfig('safety', '安全保障')),
        new HtmlWebpackPlugin(getHtmlConfig('about/index', '关于我们')),
        new HtmlWebpackPlugin(getHtmlConfig('about/contact', '联系我们')),
        new HtmlWebpackPlugin(getHtmlConfig('about/media', '媒体报道')),
        new HtmlWebpackPlugin(getHtmlConfig('about/notice', '公司公告')),
        new HtmlWebpackPlugin(getHtmlConfig('about/honor', '荣誉资质')),

        new HtmlWebpackPlugin(getHtmlConfig('help-list', '帮助中心')),        
        new HtmlWebpackPlugin(getHtmlConfig('help-search', '帮助中心搜索')),
        new HtmlWebpackPlugin(getHtmlConfig('help-detail', '帮助中心详情')),

        new HtmlWebpackPlugin(getHtmlConfig('my/index', '账户总览')),
        new HtmlWebpackPlugin(getHtmlConfig('my/userinfo', '个人信息')),
        new HtmlWebpackPlugin(getHtmlConfig('my/custody', '银行存管')),
        new HtmlWebpackPlugin(getHtmlConfig('my/invite', '我的投资')),
        new HtmlWebpackPlugin(getHtmlConfig('my/coupon', '我的卡券')),
        new HtmlWebpackPlugin(getHtmlConfig('my/caption', '资金流水')),
        new HtmlWebpackPlugin(getHtmlConfig('my/paydeposit', '充值提现')),
        new HtmlWebpackPlugin(getHtmlConfig('my/recharge', '账户充值')),
        new HtmlWebpackPlugin(getHtmlConfig('my/drawal', '账户提现')),
        new HtmlWebpackPlugin(getHtmlConfig('my/invite', '邀请好友')),
        new HtmlWebpackPlugin(getHtmlConfig('my/friends', '我的好友')),

        new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '找回密码')),

        // js、css都会压缩
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {
        //         except: ['$']
        //     },
        //     compress: {
        //         warnings: false
        //     },
        //     output: {
        //         comments: false
        //     }
        // }),
        
        // 独立通用模块到 js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            // 将公共模块提取，生成名为`common`的chunk
            name: 'build',
            chunk:['app']
        }),
    ]
};

if('dev' === WEBPACK_ENV){
    //config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config;