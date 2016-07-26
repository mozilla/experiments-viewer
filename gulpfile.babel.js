'use strict';

import gulp from 'gulp';

import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import cp from 'child_process';
import eslint from 'gulp-eslint';
import nib from 'nib';
import path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import webpack from 'webpack-stream';


const paths = {
  root: './',
  js: './distributionviewer/core/static/js',
  css: './distributionviewer/core/static/css',
};

const bundles = {
  css: {
    main: [
      path.resolve(paths.css, '**/*.styl'),
      path.resolve(paths.css, 'lib/*.css'),
      path.resolve(paths.root, 'node_modules/metrics-graphics/dist/metricsgraphics.css'),
    ],
  },
};

gulp.task('build:js', () => {
  return gulp.src(path.resolve(paths.js, 'app/app.js'))
             .pipe(webpack(require('./webpack.config.js')))
             .pipe(gulp.dest('./'));
});

gulp.task('build:css', () => {
  gulp.src(bundles.css.main)
      .pipe(sourcemaps.init())
      .pipe(stylus({compress: true, use: [nib()]}))
      .pipe(autoprefixer())
      .pipe(concat('bundle.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.css))
      .pipe(browserSync.stream());
});

gulp.task('watch', ['build'], () => {
  gulp.watch([path.resolve(paths.js, '**/*.js'), '!' + path.resolve(paths.js, 'bundle.js')], ['build:js']);
  gulp.watch(bundles.css.main, ['build:css']);
});

// Fake API
gulp.task('serve:api', done => {
  cp.exec('json-server --watch db.json --port 3009', {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('lint:js', () => {
  return gulp.src([path.resolve(paths.js, '**/*.js'), '!' + path.resolve(paths.js, 'bundle.js')])
             .pipe(eslint('.eslintrc.json'))
             .pipe(eslint.format());
});

gulp.task('build', ['build:js', 'build:css']);
gulp.task('test', ['lint:js']);
gulp.task('default', ['build']);
