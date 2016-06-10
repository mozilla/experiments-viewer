var gulp = require('gulp');
var webpack = require('webpack-stream');
var browserSync = require('browser-sync');
var path = require('path');
var nib = require('nib');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');

require('es6-promise').polyfill();

var ROOT = './';
var CSS = path.resolve(ROOT, 'distributionviewer/core/static/css');

// Webpack
gulp.task('webpack', function() {
  return gulp.src('./distributionviewer/core/static/js/app/app.js')
             .pipe(webpack(require('./distributionviewer/core/static/js/webpack.config.js')))
             .pipe(gulp.dest('./'));
});

// CSS
gulp.task('css', function() {
  gulp.src([path.resolve(CSS, '**/*.styl'),
           path.resolve(CSS, 'lib/*.css')])
    .pipe(stylus({compress: true, use: [nib()]}))
    .pipe(autoprefixer())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(CSS))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['build'], function() {
  gulp.watch(path.resolve(CSS, '**/*.styl'), ['css']);
});

gulp.task('build', ['webpack', 'css']);
gulp.task('default', ['build']);
