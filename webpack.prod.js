const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CustomHtmlReloadPlugin = require('custom-html-reload-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')


module.exports = {
    entry: './src/client/index.js',
    output: {
        // path: path.join(__dirname, "dist"),
        // filename: "main.[contenthash].js",
        // publicPath: "/dist"
        libraryTarget: 'var',
        library: 'Client'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new WorkboxPlugin.GenerateSW(),
        new MiniCssExtractPlugin({filename: '[name].css'}),
        // reloadHtml
    ]
}

// https://github.com/webpack/webpack-dev-server/issues/1271
function reloadHtml() {
    const cache = {}
    const plugin = {name: 'CustomHtmlReloadPlugin'}
    this.hooks.compilation.tap(plugin, compilation => {
        compilation.hooks.htmlWebpackPluginAfterEmit.tap(plugin, data => {
            const orig = cache[data.outputName];
            const html = data.html.source();
            if (orig && orig !== html) {
                devServer.sockWrite(devServer.sockets, 'content-changed')
            }
            cache[data.outputName] = html;
        });
    });
}