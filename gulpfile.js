var gulp = require('gulp');
var webpack = require('webpack-stream');
var browserSync = require('browser-sync');
var path = require('path');
var nib = require('nib');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cp = require('child_process');
var sourcemaps = require('gulp-sourcemaps');

require('es6-promise').polyfill();

var ROOT = './';
var JS = path.resolve(ROOT, 'distributionviewer/core/static/js');
var CSS = path.resolve(ROOT, 'distributionviewer/core/static/css');

// Webpack
gulp.task('webpack', function() {
  return gulp.src('./distributionviewer/core/static/js/app/app.js')
             .pipe(webpack(require('./webpack.config.js')))
             .pipe(gulp.dest('./'));
});

// CSS
gulp.task('css', function() {
  gulp.src([path.resolve(CSS, '**/*.styl'),
           path.resolve(CSS, 'lib/*.css')])
    .pipe(sourcemaps.init())
    .pipe(stylus({compress: true, use: [nib()]}))
    .pipe(autoprefixer())
    .pipe(concat('bundle.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(CSS))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['build'], function() {
  gulp.watch([path.resolve(JS, '**/*.js'), '!' + path.resolve(JS, 'bundle.js')], ['webpack']);
  gulp.watch(path.resolve(CSS, '**/*.styl'), ['css']);
});

// Fake API
gulp.task('serve:api', function(done) {
  cp.exec('json-server --watch db.json --port 3009', {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('build', ['webpack', 'css']);
gulp.task('default', ['build']);
