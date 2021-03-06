const HtmlWebPackPlugin = require("html-webpack-plugin");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = env => {
	return {
		entry: "./src/index.js",
		devServer: {
			contentBase: "./dist"
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader"
					}
				},
				{
					test: /\.svg$/,
					loader: "svg-inline-loader"
				}
			]
		},
		plugins: [
			new HtmlWebPackPlugin({
				template: "./src/index.html",
				filename: "./index.html"
			}),
			new CleanWebpackPlugin(["dist"])
			//new BundleAnalyzerPlugin()
		],
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					extractComments: true
				})
			]
		}
	};
};
