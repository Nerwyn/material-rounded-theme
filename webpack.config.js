const path = require('path');
const { execSync } = require('child_process');

let env =
	execSync('git branch --show-current').toString().trim() == 'main'
		? 'production'
		: 'development';
env = 'production';

module.exports = {
	mode: env,
	entry: {
		builder: './src/material-you-theme-builder.ts',
		patcher: './src/material-you-theme-patcher.ts',
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'material-you-theme-[name].min.js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
			},
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},
			{
				test: /\.css$/i,
				use: ['to-string-loader', 'css-loader'],
			},
		],
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
	devtool: env == 'production' ? false : 'eval',
};

