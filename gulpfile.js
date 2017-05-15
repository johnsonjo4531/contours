var gulp = require('gulp'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    gprint = require('gulp-print'),
    //notify = require('gulp-notify'),
    babel = require('gulp-babel'),
    gWatch = require('gulp-watch'),
    qunit = require('gulp-qunit'),
    istanbul = require('gulp-istanbul'),
    Server = require('karma').Server,
    sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ["watchSrc", "watchTest", "watchExamples"]);

gulp.task('watchSrc', function () {
  var trueBase = "src-es6/";
  var buildLocation = "dist"
  return gWatch(trueBase + '/**/*.js', function(obj){
      if (obj.event === 'change' || obj.event === 'add') {
          gulp.src(obj.path)
              .pipe(plumber({
                  errorHandler: function (error) { /* elided */console.log(error); }
              }))
              .pipe(sourcemaps.init())
              .pipe(babel({sourceMaps: true, compact: false}))
              .pipe(sourcemaps.write('.'))
              .pipe(gulp.dest(buildLocation))
              .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
      }
  });
});

gulp.task('watchTest', function() {
  var trueBase = "tests/";
  var buildLocation = "tests/"
  return gWatch(trueBase + '/**/*-es6.js', function(obj){
      if (obj.event === 'change' || obj.event === 'add') {
          gulp.src(obj.path)
              .pipe(plumber({
                  errorHandler: function (error) { /* elided */console.log(error); }
              }))
              .pipe(babel())
              .pipe(rename(function (path) {
                  path.basename = path.basename.replace(/-es6$/, '');
              }))
              .pipe(gulp.dest(buildLocation))
              .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
      }
  });
});

gulp.task('watchExamples', function() {
  var buildLocation = "examples/";
  var trueBase = "src-es6-examples";
  var suffix = '.js'
  return gWatch(trueBase + '/**/*' + (suffix || ""), function(obj){
      if (obj.event === 'change' || obj.event === 'add') {
        console.log(obj.path);
          gulp.src(obj.path)
              .pipe(plumber({
                  errorHandler: function (error) { /* elided */console.log(error); }
              }))
              .pipe(babel())
              // .pipe(rename(function (path) {
              //     path.basename = path.basename.replace(/-es6$/, '');
              // }))
              .pipe(gulp.dest(buildLocation + obj.relative.replace(/(.*[\/\\]+)?.*$/, '$1')))
              .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
      }
  });
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
