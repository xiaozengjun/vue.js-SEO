const path = require('path');
const glob = require("glob");
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

//定义部分资源路径
const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, "src");
const BUILD_DIR_NAME="./dist";
const BUILD_PATH = path.resolve(ROOT_PATH, BUILD_DIR_NAME);
const NODE_MODULES_PATH = path.resolve(ROOT_PATH, "node_modules");
const devMode = process.env.NODE_ENV !== 'production';


//获取资源入口信息
const getEntrysMsg = () => {
    let indexFiles = glob.sync(SRC_PATH + '/*/index.js');
    let entrysMsgList = {};
    indexFiles.forEach(entry => {
        let arrDirName = path.dirname(entry).split('/');
        let chunkName = arrDirName[arrDirName.length - 1];
        let html = path.join(path.dirname(entry), 'index.html');
        entrysMsgList[chunkName] = {
            html: html,
            js: entry,
            chunk: chunkName
        }
    });
    return entrysMsgList
};
let entrysMsgList = getEntrysMsg();

//获取资源入口列表
const getEntryList = () => {
    let entryList = {};
    for (let key in entrysMsgList) {
        entryList[key] = entrysMsgList[key].js;
    }
    return entryList
};
let entryList = getEntryList();

//plgin里新增html列表资源
const plugins = [
    new CleanWebpackPlugin(BUILD_PATH),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) //非模块化js引用不到
    })
];
const pluginPushHtmlList = () => {
    // console.log(entrysMsgList);
    for(let key in entrysMsgList){
        plugins.push(new HtmlWebpackPlugin({
            filename: key+ '.html',
            template: entrysMsgList[key].html,
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            chunks: [entrysMsgList[key].chunk]
        }))
        // console.log(entrysMsgList[key].chunk);
    }
    // console.log(plugins)
};
pluginPushHtmlList();
// console.log(entryList);

module.exports = {
    entry: entryList,
    output: {
        path: BUILD_PATH,
        filename: './pc/[name].js?v=[hash]'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: false,
                            attrs: ["img:src", "link:href","script:src"]
                        }
                    }
                ]
            },
            {
                test: /(\.woff2?|\.svg|\.ttf|\.eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts',
                            publicPath: '../fonts'
                        }
                    }
                ]
            },
            {
                test: /(\.js)$/,
                include: SRC_PATH,
                exclude: NODE_MODULES_PATH,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]?v=[hash]',
                            outputPath: 'js',
                            publicPath: devMode ? '':'/dist/js'//for index.php get .com/home/index.html to .com/index.html resource dir change
                            // publicPath: './js'//for index.php get .com/home/index.html to .com/index.html resource dir change
                        }
                    }
                ]
            },
            {
                test: /(\.png|\.jpe?g|\.gif|\.ico)$/,
                oneOf: [
                    {
                        issuer: /\.css/,
                        use: {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                fallback:"file-loader",
                                name: '[name].[ext]?v=[hash]',
                                outputPath: 'images',
                                publicPath: '../images'
                            }
                        }
                    },
                    {
                        use: {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                fallback:"file-loader",
                                name: '[name].[ext]?v=[hash]',
                                outputPath: 'images',
                                publicPath: devMode ? '':'/dist/images'//for index.php relative dir
                                // publicPath: './images'//for index.php relative dir
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use:[{
                        loader: "file-loader",
                        options: {
                            //[name].[contenthash:5].[ext]
                            name: '[name].[ext]?v=[hash]',
                            outputPath: 'css',
                            publicPath: devMode ? '':'/dist/css' //for index.php relative dir
                            // publicPath: './css' //for index.php relative dir
                        }
                    },
                    "extract-loader",
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                require('cssnano')(),
                                require('autoprefixer')({overrideBrowserslist: ['> 0.15% in CN']})
                            ]
                        }
                    }
                ]
            }]
    },
    optimization: {
        minimize: true,
        minimizer: [//不支持非模块化js的处理
            new UglifyJSPlugin({
                exclude: /\.min\.js$/,
                // sourceMap: true,
                uglifyOptions: {
                    ie8: true,
                    safari10: true,
                    parallel: true,
                    extractComments: false,
                    warnings: false,
                    mangle: true,
                    compress: {
                        unused: true,
                        drop_debugger: true
                    },
                    output: {
                        comments: false,
                        beautify: false
                    }
                }
            })
        ]
    },
    plugins: plugins,
    devtool: devMode ? 'cheap-module-eval-source-map':'cheap-module-source-map',
    devServer: { //开发模式启用服务器
        contentBase: BUILD_PATH,//将dist/index.html)作为可访问文件, 不写则默认与webpack.cofig.js的同级目录
        compress: false,
        open: true,
        port: 3002,
        proxy: {
            '/dev': {
                target:'https://ai.asd.com/',
                // target: 'http://b1.s1.natapp.cc/app_dev.php',
                changeOrigin: true,
                pathRewrite: {
                    '^/dev': ''
                },
            }
        }
    }
};
