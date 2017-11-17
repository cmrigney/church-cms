const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    const extractCSS = new ExtractTextPlugin('vendor.css');
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        resolve: {
            extensions: ['.js']
        },
        module: {
            rules: [
                { test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=100000' },
                { test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'file-loader' },
                { test: /\.css(\?|$)/, use: extractCSS.extract([isDevBuild ? 'css-loader' : 'css-loader?minimize']) },
                { test: /\.js$/, use: 'babel-loader?presets[]=es2015' }
            ]
        },
        entry: {
            vendor: ['font-awesome/css/font-awesome.css', 'bootstrap', 'event-source-polyfill', 'isomorphic-fetch', 'react', 'react-dom', 'react-router-dom', 'jquery', 'toastr', 'toastr/build/toastr.css'],
        },
        output: {
            path: path.join(__dirname, 'build'),
            publicPath: 'build/',
            filename: '[name].js',
            library: '[name]_[hash]',
        },
        plugins: [
            extractCSS,
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery', Popper: ['popper.js', 'default'], Util: 'exports-loader?Util!bootstrap/js/dist/util', Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown' }), // Maps these identifiers to the jQuery package
            new webpack.DllPlugin({
                path: path.join(__dirname, 'build', '[name]-manifest.json'),
                name: '[name]_[hash]'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            }),
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    }];
};