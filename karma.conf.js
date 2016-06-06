module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['qunit'],
    files: [
      'node_modules/sinon/pkg/sinon-1.17.3.js',
      'node_modules/jquery/dist/jquery.js',
      'dist/contours.js',
      'tests/tests.js',
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: { 'dist/contours.js': ['coverage'] }
  });
};
