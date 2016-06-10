const gulp = require('gulp');
const concat = require('gulp-concat');
const serve = require('gulp-serve');
const babel = require('gulp-babel');
const del = require('del');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");


gulp.task('serve', serve({
  root: ['./'],
  port: 9090,
  https: true
}));

gulp.task('default', ['compress'])

gulp.task('compress', ['scripts'], function() {
  return gulp.src('dist/qrcode.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', ['es6'], () => {
  return gulp.src([
      'lib/before.js',
      'lib/grid.js',
      'lib/version.js',
      'lib/perspectiveTransform.js',
      'lib/detector.js',
      'lib/formatinf.js',
      'lib/errorlevel.js',
      'lib/bitmatrix.js',
      'lib/dataBlock.js',
      'lib/bitMatrixParser.js',
      'lib/datamask.js',
      'lib/rsdecoder.js',
      'lib/gf256poly.js',
      'lib/gf256.js',
      'lib/decoder.js',
      'lib/qrcode.js',
      'lib/findpat.js',
      'lib/alignmentPattern.js',
      'lib/alignmentPatternFinder.js',
      'lib/dataBlockReader.js',
      'lib/adapter.js',
      '.tmp/qr-code.js',
      'lib/after.js'
    ])
    .pipe(concat('qrcode.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('es6', () => {
  return gulp.src('src/qr-code.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('clean', function() {
  return del([
    '.tmp', 'dist', 'doc'
  ]);
});
