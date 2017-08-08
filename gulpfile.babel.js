'use strict';

import gulp from 'gulp';

import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import cp from 'child_process';
import eslint from 'gulp-eslint';
import jest from 'gulp-jest';
import nib from 'nib';
import nightwatch from 'gulp-nightwatch';
import path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import webpack from 'webpack-stream';


const paths = {
  root: './',
  js: './viewer/static/js',
  css: './viewer/static/css',
};

const bundles = {
  css: {
    main: [
      path.resolve(paths.css, '**/*.styl'),
    ],
  },
};

gulp.task('build:js', () => {
  return gulp.src(path.resolve(paths.js, 'app/app.js'))
             .pipe(webpack(require('./webpack.config.babel.js')))
             .pipe(gulp.dest('./'));
});

gulp.task('build:css', () => {
  gulp.src(bundles.css.main)
      .pipe(sourcemaps.init())
      .pipe(stylus({use: [nib()]}))
      .pipe(autoprefixer())
      .pipe(concat('bundle.css'))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.css))
      .pipe(browserSync.stream());
});

gulp.task('watch', ['build'], () => {
  gulp.watch([path.resolve(paths.js, '**/*.js'), '!' + path.resolve(paths.js, 'bundle.js')], ['build:js']);
  gulp.watch(bundles.css.main, ['build:css']);
});

gulp.task('lint:js', ['build:js'], () => {
  return gulp.src([path.resolve(paths.js, '**/*.js'), '!' + path.resolve(paths.js, 'bundle.js')])
             .pipe(eslint('.eslintrc.json'))
             .pipe(eslint.format())
             .pipe(eslint.failAfterError());
});

gulp.task('jest', ['build:js'], () => {
  return gulp.src(path.resolve(paths.js, 'app/tests/jest'))
             .pipe(jest());
});

gulp.task('nightwatch', ['build:js'], () => {
  const cliArgs = {};
  if (process.env.CIRCLECI) {
    cliArgs['env'] = 'circleci';
  }

  return gulp.src('')
             .pipe(nightwatch({
               cliArgs,
             }));
});

gulp.task('build', ['build:js', 'build:css']);
gulp.task('test', ['lint:js', 'jest', 'nightwatch']);
gulp.task('default', ['build']);
