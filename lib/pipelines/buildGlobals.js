'use strict';

const defaultOptions = require('../options');
const merge = require('merge');
const path = require('path');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

module.exports = function(options) {
	options = merge({}, defaultOptions, options);
	return webpackStream({
		devtool: options.sourceMaps ? 'source-map' : false,
		module: {
			rules: [{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					compact: false,
					presets: options.babelPresets,
				}
			}]
		},
		output: {
			library: options.globalName,
			libraryTarget: 'this',
			filename: options.bundleFileName,
		},
	}, webpack);
};
