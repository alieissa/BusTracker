const gulp = require('gulp');
const jshint = require('gulp-jshint');

const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const path = require('path');

let shell = require('shelljs');
shell.config.fatal = true;


gulp.task('lint', lint);
gulp.task('es6', es6);
gulp.task('dist', dist);

gulp.task('default', gulp.series('lint', 'es6', (done) => {
	gulp.watch('app/**/*.js', gulp.series('lint', 'es6'));
	done();
});

gulp.task('deploy', gulp.series('build', 'dist')); // build then dist

function build() {

	browserify('app/app.js')
		.transform('babelify', {
			presets: ['es2015']
		})
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('dist/'));
}

function dist() {
	let flag = process.argv[3];

	switch(flag) {
		case '--production':
			// move to app.js, views/, assets/, config.xml, database/ to www
			
			break;
		case '--development':
			// move to app.js, views/, assets/, config.xml, database/ to dist
	
			cpDirFiles(path.join(__dirname, 'app/index.html'), path.join(__dirname, 'dist'));
			cpDirFiles(path.join(__dirname, 'app/main.html'), path.join(__dirname, 'dist/views'));
			cpDirFiles(path.join(__dirname, 'app/favourites.html'), path.join(__dirname, 'dist/views'));
			cpDirFiles(path.join(__dirname, 'app/stops/views/*'), path.join(__dirname, 'dist/views'));
			cpDirFiles(path.join(__dirname, 'app/routes/views/*'), path.join(__dirname, 'dist/views'));
			cpDirFiles(path.join(__dirname, 'app/common/*.db'), path.join(__dirname, 'dist/database'));
			cpDirFiles(path.join(__dirname, 'assets/*'), path.join(__dirname, 'dist/assets'));

			break;
		default:
			// print usage
			break;
	}

	function cpDirFiles(src, target) {

		if(!shell.test('-d', target)) {
			shell.mkdir(target);
		}

		shell.cp('-r', src, target);
	}
}

// jshint fail on 10 error/warnings
function lint() {

    return gulp.src('app/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
}

// compile down to es5
function es6() {

	browserify('app/app.js')
		.transform('babelify', {
			presets: ['es2015']
		})
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('dist/'));
}
