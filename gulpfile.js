'use strict';
var browserSync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  del = require('del'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  paths = {
    styles: {
      src: 'src/sass/**/*.scss',
      dest: 'dest/css/'
    },
    // html: {
    //   src: 'src/html/**/*.html',
    //   dest: 'dest/html/'
    // },
    pug: {
      src: 'src/pug/pages/**/*.pug',
      dest: 'dest/html/'
    },
    assets: {
      src: 'src/assets/**/*.{png,jpg,jpeg}',
      dest: 'dest/assets/',
    }
    // scripts: {
    //   src: 'src/scripts/**/*.js',
    //   dest: 'assets/scripts/'
    // }
  };

function sync() {
  browserSync.init({
    server: {
      directory: true,
      baseDir: "dest"
    }
  });
}

function clean() {
  return del(['dest']);
}

function styles() {
  var plugins = [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ];
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// function copyhtml() {
//   return gulp.src(paths.html.src)
//     .pipe(gulp.dest(paths.html.dest))
//     .pipe(browserSync.stream());
// }

function views() {
  return gulp.src(paths.pug.src)
    .pipe(pug())
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream());
}

function copyassets() {
  return gulp.src(paths.assets.src)
    .pipe(gulp.dest(paths.assets.dest))
    .pipe(browserSync.stream());
}

function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.pug.src, views);
  gulp.watch(paths.assets.src, copyassets);
}

var build = gulp.series(gulp.parallel(styles, views, copyassets));
var dev = gulp.series(clean, build, gulp.parallel(sync, watch));


// Static server
// gulp.task('browser-sync', sync);
gulp.task('dev', dev);
gulp.task('build', build);
