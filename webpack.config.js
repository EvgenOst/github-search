const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

module.exports = {
	module: {
		rules: [
			{
				include: [path.resolve(__dirname, 'src')],
				loader: 'ts-loader',
				test: /\.ts$/
			},
			{
				test: /\.css$/,

				use: [
						'style-loader',
						MiniCssExtractPlugin.loader,
						'css-loader'
				]
			}
		]
	},

	entry: './src/main.ts',

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},

	resolve: {
		extensions: [".ts", ".js", ".json"]
	},
	devtool: "source-map",
	mode: 'none',
	plugins: [
		new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	]
};
