var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer')
var helpers = require('./helpers');

module.exports = {
  entry: {
    'polyfills': './demo/polyfills.ts',
    'vendor': './demo/vendor.ts',
    'app': './demo/main.ts'
  },

  resolve: {
    extensions: ['', '.js', '.ts']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [helpers.root('demo/index.html')]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
				test: /\.css$/,
				exclude: helpers.root('demo', 'app'),
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
			},
			{
				test: /\.css$/,
				include: helpers.root('demo', 'app'),
				loader: 'raw!postcss'
			},
			{
				test: /\.scss$/,
				exclude: helpers.root('demo', 'app'),
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!resolve-url!sass?sourceMap')
			},
			{
				test: /\.scss$/,
				include: helpers.root('demo', 'app'),
				loaders: ['exports-loader?module.exports.toString()', 'css', 'postcss', 'sass']
			}
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'demo/index.html'
    }),

    new CopyWebpackPlugin([{
      from: root('demo/public')
    }])
  ],

  postcss: function () {
    return [precss, autoprefixer({ browsers: ['last 2 versions'] })];
  }
};

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
