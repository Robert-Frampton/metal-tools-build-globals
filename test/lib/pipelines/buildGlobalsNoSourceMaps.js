'use strict';

var assert = require('assert');
var babelDeps = require('babel-deps');
var buildGlobals = require('../../../lib/pipelines/buildGlobals');
var consume = require('stream-consume');
var vfs = require('vinyl-fs');

var defaultOptions = {
	sourceMaps: false
};

describe('Pipeline - Build to globals with no source maps', function() {
	beforeEach(function() {
		babelDeps.clearCache();
	});

	it('should build js files to a single bundle', function(done) {
		var stream = vfs.src('test/fixtures/js/foo.js')
			.pipe(buildGlobals(defaultOptions));

		var files = [];
		stream.on('data', function(file) {
			files.push(file.relative);
		});
		stream.on('end', function() {
			assert.strictEqual(1, files.length);
			assert.strictEqual('metal.js', files[0]);
			done();
		});
		consume(stream);
	});

	it('should build js files to single bundle with the specified filename', function(done) {
		var stream = vfs.src('test/fixtures/js/foo.js')
			.pipe(buildGlobals({
				bundleFileName: 'foo.js',
				sourceMaps: false
			}));

		stream.on('data', function(file) {
			assert.strictEqual('foo.js', file.relative);
			done();
		});
	});

	it('should publish exported variables on global', function(done) {
		var stream = vfs.src('test/fixtures/js/foo.js')
			.pipe(buildGlobals(defaultOptions));

		stream.on('data', function(file) {
			var contents = file.contents.toString();
			assert.notStrictEqual(-1, contents.indexOf('this["metal"] ='));
			done();
		});
	});

	it('should publish exported variables on specified global', function(done) {
		var stream = vfs.src('test/fixtures/js/foo.js')
			.pipe(buildGlobals({
				globalName: 'bar',
				sourceMaps: false
			}));

		stream.on('data', function(file) {
			var contents = file.contents.toString();
			assert.notStrictEqual(-1, contents.indexOf('this["bar"] ='));
			done();
		});
	});
});
