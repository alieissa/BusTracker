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
gulp.task('build', gulp.series('es6', 'dist', (done) => {
	gulp.watch(['app/**/*', 'assets/css/*', '*.js'], gulp.series('es6', 'dist'))
	done()
}));

gulp.task('deploy', gulp.series('lint', 'es6', 'dist')); // build then dist

gulp.task('default', gulp.series('lint', 'es6', (done) => {
	gulp.watch(['app/**/*.js', '*.js', '/**/*.html'], gulp.series('lint', 'es6'));
	done();
}));


function dist(done) {
	let flag = process.argv[3];

	switch(flag) {
		case '--production':
			// move to app.js, views/, assets/, config.xml, database/ to www

			break;
		case '--development':
			// move to app.js, views/, assets/, config.xml, database/ to dist

			cpDirFiles(path.join(__dirname, 'env.js'), path.join(__dirname, 'dist'));
			cpDirFiles(path.join(__dirname, 'app/index.html'), path.join(__dirname, 'dist'));
			cpDirFiles(path.join(__dirname, 'app/main.html'), path.join(__dirname, 'dist/views'));
			cpDirFiles(path.join(__dirname, 'app/favourites/views/*'), path.join(__dirname, 'dist/views'));
			cpDirFiles(path.join(__dirname, 'app/util/views/*'), path.join(__dirname, 'dist/views'));
			cpDirFiles(path.join(__dirname, 'app/stops/views/*'), path.join(__dirname, 'dist/views'));
			cpDirFiles(path.join(__dirname, 'app/routes/views/*'), path.join(__dirname, 'dist/views'));
			cpDirFiles(path.join(__dirname, 'app/database/*.db'), path.join(__dirname, 'dist/database'));
			cpDirFiles(path.join(__dirname, 'assets/css/*'), path.join(__dirname, 'dist/assets/css'));

			break;
		default:
			// print usage
			break;
	}

	done();

	function cpDirFiles(src, target) {

		if(!shell.test('-d', target)) {
			shell.mkdir(target);
		}

		shell.cp('-r', src, target);
	}
}

// jshint fail on 10 error/warnings
function lint(done) {

    return gulp.src('app/**/*.js')
		.on('error', function(err) {
			console.log(err.toString());
			this.emit("end");
		})
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        // .pipe(jshint.reporter('fail'));

    done();
}

// compile down to es5
function es6(done) {

	browserify('app/app.js')
		.transform('babelify', {
			presets: ['es2015']
		})
		.bundle()
		.on('error', function(err) {
            console.log(err.toString());
            this.emit("end");
        })
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('dist/'));

	done();
}
