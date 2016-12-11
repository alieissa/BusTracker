const babelify      = require('babelify');
const browserify    = require('browserify');
const buffer        = require('vinyl-buffer');
const gulp          = require('gulp');
const jshint        = require('gulp-jshint');
const path          = require('path');
const shell         = require('shelljs');
const source        = require('vinyl-source-stream');

// command line argument check
const dest = process.argv[3] === '--development' ? 'dist' : 'www';
const destRoot = path.join(__dirname, dest);
const sourceRoot = path.join(__dirname, 'app');

const assets = path.join(__dirname, 'assets/css/*');
const modules = ['favourites', 'routes', 'stops', 'util'];

const buildTasks = ['clean', 'lint', 'es6', 'dist'];

//------------------------------------------------------------------------------
// Task registrations
//------------------------------------------------------------------------------

gulp.task('clean', clean);
gulp.task('lint', lint);
gulp.task('es6', es6);
gulp.task('dist', dist);
gulp.task('build', gulp.series(...buildTasks, build));
gulp.task('default', gulp.series('build'));

//------------------------------------------------------------------------------
// Task functions
//------------------------------------------------------------------------------

function build(done) {
    gulp.watch(['app/**/*', 'assets/css/*', '*.js'], gulp.series(...buildTasks));
    done();
}

function clean(done) {
    shell.rm('-r', `${dest}/*.js`);
    shell.rm('-r', `${dest}/*.html`);
    shell.rm('-r', `${dest}/partials/*`);
    done();
}

function dist(done) {
    shell.cp('-r', 'env.js', destRoot);
    shell.cp('-r', 'assets/css/*', `${destRoot}/assets/css`);
    shell.cp('-r', `${sourceRoot}/index.html`, destRoot);

    modules.forEach(module => {
        shell.cp('-Rf', `${sourceRoot}/${module}/partials/*`, `${destRoot}/partials/`)
    });
    done();
}

function es6(done) {

    browserify('app/app.js')
        .transform('babelify', { presets: ['es2015'] })
        .bundle()
        .on('error', function(err) {
            this.emit("end");
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest(dest));
    done();
}

function lint(done) {

    return gulp.src('app/**/*.js')
        .on('error', function(err) {
            this.emit("end");
        })
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
    done();
}
