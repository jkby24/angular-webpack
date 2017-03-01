'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ngAnnotateWebpackPlugin = require('ng-annotate-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync('package.json'));

var config = {};

var ENV = process.env.npm_lifecycle_event;
var isDev = ENV === 'dev';
var isProd = ENV === 'build';

/**
 * 修改pom文件中的源码路径
 */
function modifyPom() {
    var pomPath = path.join(__dirname, './pom.xml');
    fs.readFile(pomPath, 'utf-8', function (error, content) {
        content = content.replace(/(\<warSourceDirectory\>\$\{basedir\}\/src\/main\/).+?(\<\/warSourceDirectory\>)/g, '$1' + pkg.version + '$2');
        fs.writeFile(pomPath, content);
    });
}

var dist = path.join(__dirname, '/dist');
// if (isProd) {
//     dist = path.join(dist, pkg.version);
//     // modifyPom();
// }
config.entry = {
    app: './src/app.js',
    vendor : ['angular','angular-ui-router', 'oclazyload']
};

config.output = {
    path: dist,
    filename: '[name]-[hash:8].js',
    chunkFilename: 'chunk-[hash:8]-[name].js'
};

config.module = {
    loaders: [
        {
            test: /\.js$/,
            loader: 'ng-annotate!babel'
        },
        { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css")},

        {
            test: /\.html$/,
            loader: 'raw'
        },
        {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'url?limit=1024&name=css/images/[hash:8].[name].[ext]'
        }
    ]
};
config.plugins = [];
config.plugins.push(
    new webpack.ProvidePlugin({
        $: 'jquery'
    })
    , new ExtractTextPlugin('css/main.[hash:8].css')
    , new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        inject: 'body'
    })
    ,new webpack.optimize.CommonsChunkPlugin({
      		names: ['vendor']
      	})
    // , new CopyWebpackPlugin([{
    //     from: './src/themes',
    //     to: path.join(dist, 'themes')
    // }])
);

if (isProd) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: false
    }));
}

if (!isProd) {
    config.devtool = 'eval-source-map';
}


if (isDev) {
    config.output.publicPath = 'http://localhost:8889/';
    config.plugins.push(new webpack.HotModuleReplacementPlugin());//模块热替换需要这个插件
    config.devServer = {
        port: 8889,
        outputPath: dist,
        inline: true,
        hot: true,
        open: 'http://localhost:8889/#!/home/index'
    };
}

module.exports = config;
