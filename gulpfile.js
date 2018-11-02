/* eslint-env node */

const
  htmlClean  = require('gulp-htmlclean'),
  del        = require('del'),
  eslint     = require('gulp-eslint'),
  gulp       = require('gulp'),
  merge2     = require('merge2'),
  scss       = require('gulp-sass'),
  stripDebug = require('gulp-strip-debug'),
  stylelint  = require('gulp-stylelint'),
  uglify     = require('gulp-uglify-es').default,
  zip        = require('gulp-zip');

function cleanDist() {
  return del('dist/**/*');
}

function buildHTML() {
  return gulp
    .src('src/*.html')
    .pipe(htmlClean())
    .pipe(gulp.dest('dist/'));
}

function buildCSS() {
  return gulp
    .src('src/styles/**/*.scss')
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(gulp.dest('dist/styles/'));
}

function buildJS() {
  return gulp
    .src('src/scripts/*.js')
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'));
}

function buildExtras() {
  // Merge2 merges multiple streams and returns it as one, this allows us to
  // use Gulp's async task completion without having to make multiple tasks for
  // the different locations for a number of static files.
  // https://gulpjs.com/docs/en/getting-started/async-completion#returning-a-stream
  return merge2(
    gulp // JavaScript Vendors:
      .src([
        'node_modules/marked/marked.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
      ])
      .pipe(gulp.dest('dist/scripts/vendors/')),
    gulp // CSS Vendors:
      .src('node_modules/bootstrap/dist/css/bootstrap.min.css')
      .pipe(gulp.dest('dist/styles/vendors/')),
    gulp // Data folder:
      .src('src/data/**')
      .pipe(gulp.dest('dist/data/')),
    gulp // Images folder:
      .src('src/images/**')
      .pipe(gulp.dest('dist/images/')),
    gulp // Manifest file:
      .src('src/manifest.json')
      .pipe(gulp.dest('dist/'))
  );
}

function lintSCSS() {
  return gulp
    .src('src/**/*.scss')
    .pipe(stylelint({ reporters: [{ formatter: 'string', console: true }] }));
}

function lintJS() {
  return gulp
    .src(['src/**/*.js', 'gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format());
}

function createZip() {
  const manifest = require('./src/manifest.json');
  const zipName = `${manifest.name} v${manifest.version}.zip`;
  return gulp
    .src('dist/**')
    .pipe(zip(zipName))
    .pipe(gulp.dest('dist/'));
}

function watch() {
  const watchOptions = {
    ignoreInitial: false
  };

  gulp.watch('src/*.html', watchOptions, buildHTML);
  gulp.watch('src/styles/*.scss', watchOptions, gulp.series(lintSCSS, buildCSS));
  gulp.watch('src/scripts/*.js', watchOptions, gulp.series(lintJS, buildJS));
  gulp.watch([
    'src/data/**',
    'src/images/**',
    'src/manifest.json'
  ], watchOptions, buildExtras);
}

// If you want to run any individual task you can use `npx gulp <task_name>`
// like: `npx gulp lint:scss` or `npx gulp build`
// Run `npx gulp --tasks` to see a graph of the tasks, a very useful tool!
exports['build'] =
  gulp.series(
    cleanDist,
    gulp.parallel(lintSCSS, lintJS),
    gulp.parallel(buildHTML, buildCSS, buildJS, buildExtras),
    createZip
  );
exports['build:html']   = buildHTML;
exports['build:css']    = buildCSS;
exports['build:js']     = buildJS;
exports['build:extras'] = buildExtras;
exports['clean']        = cleanDist;
exports['lint']         = gulp.parallel(lintSCSS, lintJS);
exports['lint:scss']    = lintSCSS;
exports['lint:js']      = lintJS;
exports['watch']        = gulp.series(cleanDist, watch);
exports['zip']          = createZip;
