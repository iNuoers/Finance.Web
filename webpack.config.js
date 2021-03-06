
const debug = true;
const fs = require('fs');
const path = require("path");
const url = debug ? 'http://192.168.1.53:8010' : 'https://www.fangjinnet.com';
const webpack = require('webpack');
const srcDir = path.resolve(process.cwd(), 'app');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 环境变量配置，dev / online
const WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// 获取 html-webpack-plugin参数方法
const getHtmlConfig = function (name, title) {
    return {
        template: './app/view/' + name + '.html',
        filename: '/view/' + name + '.html',
        favicon: './favicon.ico',
        title: title,
        inject: true,
        hash: true,
        chunks: ['f.vendor', name],
        minify: {
            // 压缩html
            removeComments: true,      //移除HTML中的注释
            collapseWhitespace: true   //删除空白符与换行符
        }
    };
};

// webpack config
const config = {
    // 入口文件
    entry: {
        'f.vendor': ['./app/js/app.js'],

        'index': ['./app/js/module/index.js'],
        'product/index': ['./app/js/module/product/list.js'],
        'product/detail': ['./app/js/module/product/detail.js'],
        'product/confirm': ['./app/js/module/product/confirm.js'],
        'product/result': ['./app/js/module/product/result.js'],

        'help/list': ['./app/js/module/help/list.js'],
        'help/search': ['./app/js/module/help/list.js'],
        'help/detail': ['./app/js/module/help/detail.js'],

        'about/about': ['./app/js/module/about/about.js'],
        'about/safety': ['./app/js/module/about/safety.js'],
        'about/commerce': ['./app/js/module/about/about.js'],
        'about/official': ['./app/js/module/about/about.js'],
        'about/cfo': ['./app/js/module/about/cfo.js'],
        'about/events': ['./app/js/module/about/about.js'],
        'about/notice': ['./app/js/module/about/notice.js'],
        'about/notice-detail': ['./app/js/module/about/notice.js'],
        'about/media': ['./app/js/module/about/about.js'],
        'about/info': ['./app/js/module/about/about.js'],
        'about/contact': ['./app/js/module/about/about.js'],

        'active-list': ['./app/js/module/active.js'],

        'my/index': ['./app/js/module/my/index.js'],
        'my/userinfo': ['./app/js/module/my/userinfo.js'],
        'my/custody': ['./app/js/module/my/custody.js'],
        'my/invest': ['./app/js/module/my/invest.js'],
        'my/coupon': ['./app/js/module/my/coupon.js'],
        'my/caption': ['./app/js/module/my/caption.js'],
        'my/paydeposit': ['./app/js/module/my/paydeposit.js'],
        'my/recharge': ['./app/js/module/my/recharge.js'],
        'my/rechargeAction': ['./app/js/module/my/rechargeAction.js'],
        'my/withdrawal': ['./app/js/module/my/withdrawal.js'],
        'my/bindcard': ['./app/js/module/my/bindcard.js'],
        'my/my-card': ['./app/js/module/my/my-card.js'],
        'my/invite': ['./app/js/module/my/invite.js'],
        'my/friends': ['./app/js/module/my/friends.js'],
        'my/reset-logpwd':['./app/js/module/my/reset-logpwd.js'],
        'my/reset-tradepwd':['./app/js/module/my/reset-tradepwd.js'],
        'my/create-tradepwd':['./app/js/module/my/create-tradepwd.js'],
        'my/find-tradepwd':['./app/js/module/my/find-tradepwd.js'],

        'user/login': ['./app/js/module/user/login.js'],
        'user/register': ['./app/js/module/user/register.js'],
        'user/findpwd': ['./app/js/module/user/findpwd.js']
    },
    output: {
        path: __dirname + '/dist/',
        publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : url + '/dist/',
        filename: 'js/[name].[hash:8].min.js',
        chunkFilename: 'js/[id].chunk.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        }, {
            test: /\.(gif|png|jpg)\??.*$/,
            loader: 'url-loader',
            //?limit=8192&name=resource/[name]_[sha512:hash:base64:7].[ext]
            query: {
                /*
                 *  limit=10000 ： 8kb
                 *  图片大小小于10kb 采用内联的形式，否则输出图片
                 * */
                limit: 10,
                name: 'image/[name].[hash:8].[ext]'
            }
        },
        {
            //文件加载器，处理文件静态资源
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader',
            query: {
                limit: 10,
                name: 'css/fonts/[name].[ext]'
            }
        },
        {
            test: /\.(string)$/,
            loader: 'html-loader',
            query: {
                minimize: true,
                removeAttributeQuotes: false
            }
        }]
    },
    resolve: {
        //root: path.join(__dirname + 'src'),
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.css'],

        // 模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            node_modules: __dirname + '/node_modules',
            view_path: __dirname + '/app/view',
            css_path: __dirname + '/app/css',
            js_path: __dirname + '/app/js'
        }
    },
    plugins: [
        // 把css单独打包到文件里
        new ExtractTextPlugin('css/[name].min.css'),

        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),

        new HtmlWebpackPlugin(getHtmlConfig('product/index', '理财产品')),
        new HtmlWebpackPlugin(getHtmlConfig('product/detail', '产品详情')),
        new HtmlWebpackPlugin(getHtmlConfig('product/confirm', '产品支付确认')),
        new HtmlWebpackPlugin(getHtmlConfig('product/result', '购买结果')),

        new HtmlWebpackPlugin(getHtmlConfig('active-list', '活动列表')),

        new HtmlWebpackPlugin(getHtmlConfig('about/about', '关于我们')),
        new HtmlWebpackPlugin(getHtmlConfig('about/safety', '安全保障')),
        new HtmlWebpackPlugin(getHtmlConfig('about/commerce', '工商信息')),
        new HtmlWebpackPlugin(getHtmlConfig('about/official', '官方渠道')),
        new HtmlWebpackPlugin(getHtmlConfig('about/cfo', '实时数据')),
        new HtmlWebpackPlugin(getHtmlConfig('about/events', '大事记')),
        new HtmlWebpackPlugin(getHtmlConfig('about/notice', '公司公告')),
        new HtmlWebpackPlugin(getHtmlConfig('about/notice-detail', '公司公告')),
        new HtmlWebpackPlugin(getHtmlConfig('about/media', '媒体报道')),
        new HtmlWebpackPlugin(getHtmlConfig('about/info', '法律声明')),
        new HtmlWebpackPlugin(getHtmlConfig('about/contact', '联系我们')),

        new HtmlWebpackPlugin(getHtmlConfig('help/list', '帮助中心')),
        new HtmlWebpackPlugin(getHtmlConfig('help/search', '帮助中心搜索')),
        new HtmlWebpackPlugin(getHtmlConfig('help/detail', '帮助中心详情')),

        new HtmlWebpackPlugin(getHtmlConfig('my/index', '账户总览')),
        new HtmlWebpackPlugin(getHtmlConfig('my/userinfo', '个人信息')),
        new HtmlWebpackPlugin(getHtmlConfig('my/custody', '账户安全')),
        new HtmlWebpackPlugin(getHtmlConfig('my/invest', '我的投资')),
        new HtmlWebpackPlugin(getHtmlConfig('my/coupon', '我的卡券')),
        new HtmlWebpackPlugin(getHtmlConfig('my/caption', '资金流水')),
        new HtmlWebpackPlugin(getHtmlConfig('my/paydeposit', '充值提现')),
        new HtmlWebpackPlugin(getHtmlConfig('my/recharge', '账户充值')),
        new HtmlWebpackPlugin(getHtmlConfig('my/rechargeAction', '账户充值')),
        new HtmlWebpackPlugin(getHtmlConfig('my/withdrawal', '账户提现')),
        new HtmlWebpackPlugin(getHtmlConfig('my/bindcard', '绑卡认证')),
        new HtmlWebpackPlugin(getHtmlConfig('my/my-card', '绑卡认证')),
        new HtmlWebpackPlugin(getHtmlConfig('my/invite', '邀请好友')),
        new HtmlWebpackPlugin(getHtmlConfig('my/friends', '我的好友')),
        new HtmlWebpackPlugin(getHtmlConfig('my/reset-logpwd', '修改登录密码')),
        new HtmlWebpackPlugin(getHtmlConfig('my/reset-tradepwd', '修改交易密码')),
        new HtmlWebpackPlugin(getHtmlConfig('my/create-tradepwd', '设置交易密码')),
        new HtmlWebpackPlugin(getHtmlConfig('my/find-tradepwd', '找回交易密码')),

        new HtmlWebpackPlugin(getHtmlConfig('user/login', '用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('user/register', '用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user/findpwd', '找回登录密码')),

        // 独立通用模块到 js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            // 将公共模块提取，生成名为`common`的chunk
            name: 'f.vendor',
            // children:  true, // 寻找所有子模块的共同依赖
            // minChunks: 0, // 设置一个依赖被引用超过多少次就提取出来
        }),

        new webpack.HotModuleReplacementPlugin()
    ]
};

if ('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?' + url);
}

module.exports = config;