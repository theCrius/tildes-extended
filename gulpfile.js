/* eslint-env node */

'use strict';

const gulp = require('gulp'),
  del = require('del'),
  cleanhtml = require('gulp-cleanhtml'),
  eslint = require('gulp-eslint'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify-es').default,
  sass = require('gulp-sass'),
  zip = require('gulp-zip');

const distFolder = 'dist';

//clean build directory
gulp.task('clean', function () {
  return del.sync('./' + distFolder + '/**/*');
});

//copy static folders to build directory
gulp.task('copy', function() {
  // gulp.src('src/fonts/**/*')
  // 	.pipe(gulp.dest('./' + distFolder + '/fonts'));
  gulp.src('src/data/**')
    .pipe(gulp.dest('./' + distFolder + '/data'));
  gulp.src('src/images/**')
    .pipe(gulp.dest('./' + distFolder + '/images'));
  return gulp.src('src/manifest.json')
    .pipe(gulp.dest('./' + distFolder));
});

//copy and compress HTML files
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(cleanhtml())
    .pipe(gulp.dest('./' + distFolder));
});

// Check with eslint that everything is fine in the extension's code
gulp.task('eslint', () => {
  return gulp.src([
    'src/scripts/*.js',
    'src/scripts/**/*.js',
    '!node_modules/**'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

//copy vendor scripts and uglify all other scripts, creating source maps
gulp.task('scripts', ['eslint'], function() {
  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/marked/marked.min.js',
    './node_modules/popper.js/dist/umd/popper.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js'
  ]).pipe(gulp.dest('./' + distFolder + '/scripts/vendors'));

  let task = gulp.src('src/scripts/*.js').pipe(stripdebug());
  if (process.argv[3] !== '--debug-scripts') {
    task = task.pipe(uglify());
  }
  return task.pipe(gulp.dest('./' + distFolder + '/scripts'));
});

//minify styles
gulp.task('styles', function() {
  gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css'
  ]).pipe(gulp.dest('./' + distFolder + '/styles/vendors'));

  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./' + distFolder + '/styles'));
});

//build ditributable and sourcemaps after other tasks completed
gulp.task('zip', ['html', 'scripts', 'styles', 'copy'], function() {
  var manifest = require('./src/manifest'),
    distFileName = manifest.name + ' v' + manifest.version + '.zip',
    mapFileName = manifest.name + ' v' + manifest.version + '-maps.zip';
  //collect all source maps
  gulp.src('./' + distFolder + '/scripts/**/*.map')
    .pipe(zip(mapFileName))
    .pipe(gulp.dest('./' + distFolder));
  //build distributable extension
  return gulp.src(['./' + distFolder + '/**', '!./' + distFolder + '/scripts/**/*.map'])
    .pipe(zip(distFileName))
    .pipe(gulp.dest('./' + distFolder));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean'], function() {
  gulp.start('zip');
});

gulp.task('watch', ['clean', 'copy', 'html', 'scripts', 'styles'], function() {
  gulp.watch('src/manifest.json', ['copy']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch(['src/scripts/*.js', 'src/scripts/**/*.js'], ['eslint', 'scripts']);
  gulp.watch('src/styles/**', ['styles']);
});
