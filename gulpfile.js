const gulp = require('gulp');
const Server = require('karma').Server;
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');


gulp.task('default', ['es6', 'test'],() => {
	gulp.watch(['src/**/*.js', 'test/**/*.js'],['es6', 'test']);
});
gulp.task('es6', es6);
gulp.task('test', test);

function es6() {

	browserify('src/app/app.js')
		.transform('babelify', {
			presets: ['es2015']
		})
		.bundle()
		.pipe(source('bus.tracker.js'))
		.pipe(buffer())
		.pipe(gulp.dest('build/'));
}

function test(done) {
	'use strict';

	let karmaConfig = {
		configFile: __dirname + '/test/karma.conf.js',
		singleRun: true
	};

	/* -----------------------------------------------------------------/
		Without this callback run once config causes gulp to throw error
		Reference https://github.com/karma-runner/gulp-karma/issues/18
	/----------------------------------------------------------------- */

	let karmaServerCallback = () => {
		var error = typeof error !== 'undefined' ? new Error('Karma returned with the error code: ' + error) : undefined;
		done(error);
	};

	new Server(karmaConfig,karmaServerCallback).start();
}
