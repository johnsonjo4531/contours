var gulp = require('gulp'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    gprint = require('gulp-print'),
    //notify = require('gulp-notify'),
    babel = require('gulp-babel'),
    gWatch = require('gulp-watch'),
    qunit = require('gulp-qunit'),
    istanbul = require('gulp-istanbul'),
    Server = require('karma').Server;

gulp.task('default', ["watchSrc", "watchTest"]);

gulp.task('watchSrc', function () {
  var trueBase = "src-es6/";
  var buildLocation = "dist"
  return gWatch(trueBase + '/**/*.js', function(obj){
      if (obj.event === 'change' || obj.event === 'add') {
          gulp.src(obj.path)
              .pipe(plumber({
                  errorHandler: function (error) { /* elided */console.log(error); }
              }))
              .pipe(babel({
          			presets: ['es2015'],
                sourceMaps: true,
                compact: false
          		}))
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
              .pipe(babel({
          			presets: ['es2015'],
                sourceMaps: true,
                compact: false
          		}))
              .pipe(rename(function (path) {
                  path.basename = path.basename.replace(/-es6$/, '');
              }))
              .pipe(gulp.dest(buildLocation))
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
