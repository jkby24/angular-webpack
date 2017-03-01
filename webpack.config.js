'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ngAnnotateWebpackPlugin = require('ng-annotate-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var path = require('path');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync('package.json'));

var config = {};

var ENV = process.env.npm_lifecycle_event;
var isDev = ENV === 'dev';
var isTest = ENV === 'test';
var isProd = ENV === 'bulid';

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
if (isProd) {
    dist = path.join(dist, pkg.version);
    // modifyPom();
}
/**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
config.entry = {
    app: './src/app.js'
};

/**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
config.output = {
    path: dist,
    filename: '[name].js',
    chunkFilename: 'chunk-[name].js'
};

config.resolve = {
    extentions: ['', 'js']//当requrie的模块找不到时，添加这些后缀
};
config.module = {
    loaders: [
        {
            // JS LOADER
            // Reference: https://github.com/babel/babel-loader
            // Transpile .js files using babel-loader
            // Compiles ES6 and ES7 into ES5 code
            test: /\.js$/,
            loader: 'ng-annotate!babel',
            exclude: /node_modules/
        },
        // {
        //     // TS LOADER
        //     // Transpile .ts files using ts-loader
        //     // Compiles TS into ES5 code
        //     test: /\.ts$/,
        //     loader: 'ng-annotate!ts',
        //     exclude: /node_modules/
        // },
        {
            test: /\.html$/,
            loader: 'raw'
        },
        // {
        //     test: /\.html$/,
        //     loader: 'html'
        // },
        // {
        //     test: /\.scss$/,
        //     loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
        // },
        {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'url?limit=5000'
        },
        // {
        //     test: /\.jpg$/,
        //     loader: 'file-loader'
        // }
    ]
};

config.plugins = [];
config.plugins.push(
    new webpack.ProvidePlugin({
        $: 'jquery'
    })
    , new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        inject: 'body'
    })
    // , new ngAnnotateWebpackPlugin() // 和ng-annotate-loader功能一样。也一样会在多次引用angular的时候不正常
    // , new webpack.optimize.DedupePlugin()
    // , new webpack.optimize.CommonsChunkPlugin(
    //     {
    //         name: 'app',
    //         chunks: ['core', 'tool']
    //     }
    // )
    // , new webpack.NoErrorsPlugin()
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


/**
 * Devtool
 * Reference: http://webpack.github.io/docs/configuration.html#devtool
 * Type of sourcemap to use per build type
 */
if (isTest) {
    config.devtool = 'inline-source-map';
} else if (isProd) {
    config.devtool = 'source-map';
} else {
    // config.devtool = 'eval-source-map';
}


if (isDev) {
    config.output.publicPath = 'http://localhost:8889/';
    config.plugins.push(new webpack.HotModuleReplacementPlugin());//模块热替换需要这个插件
    config.devServer = {
        port: 8889,
        outputPath: dist,
        // contentBase: './dist',
        inline: true,
        hot: true,
        open: 'http://localhost:8889/#!/home/index'
    };
}

module.exports = config;
