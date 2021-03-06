const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './build';
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        entry: { 'main': './src/boot.tsx' },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: 'build/'
        },
        module: {
            rules: [
                { test: /\.tsx?$/, include: /src/, use: 'awesome-typescript-loader?silent=true' },
                { test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : ExtractTextPlugin.extract({ use: 'css-loader?minimize' }) },
                { test: /\.(scss)$/, use: [
                  {
                    loader: 'style-loader' 
                  },
                  { 
                    loader: 'css-loader' }, 
                  { 
                    loader: 'postcss-loader',
                    options: {
                      plugins: () => {
                        return [
                          require('precss'),
                          require('autoprefixer')
                        ];
                      }
                    }
                  },
                  {
                    loader: 'sass-loader'
                  }
                ] },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [
            new CheckerPlugin(),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./build/vendor-manifest.json')
            }),
            new CopyWebpackPlugin([{ from: './src/index.html' }])
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            }),
            new ExtractTextPlugin('site.css')
        ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin(),
            new ExtractTextPlugin('site.css')
        ])
    }];
};