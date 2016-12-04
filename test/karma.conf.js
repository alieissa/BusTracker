
module.exports = function(config) {
  'use strict';

  config.set({

    // enable / disable watching file and executing tests whenever any file changes
    // autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // reporters configuration
    reporters: ['mocha'],

    // Order of file loading is important
    files: [

      'assets/lib/jquery/dist/jquery.js',
      'assets/lib/angular/angular.js',
      'assets/lib/angular-route/angular-route.js',
      'assets/lib/angular-mocks/angular-mocks.js',

      // My Code
      'dist/app.js',
      'test/constants.js',

      'test/spec/routes/aeRoutes.directive.spec.js',
      'test/spec/routes/aeRoute.directive.spec.js',
      'test/spec/routes/aeRouteDetails.directive.spec.js',
      'test/spec/routes/aeRouteTripsCard.directive.spec.js',
      'test/spec/stops/aeStop.directive.spec.js',
      'test/spec/stops/aeStops.directive.spec.js',

        'dist/**/*.html'
    ],
    // generate js files from html templates
    preprocessors: { 'dist/partials/*.html': 'ng-html2js'},
    ngHtml2JsPreprocessor: { stripPrefix: 'dist/', stripSuffix: '.ext'},
    exclude: [],
    port: 8080,
    browsers: ['Chrome'],
    plugins: [
      'karma-jasmine',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-ng-html2js-preprocessor'
    ],

    // Continuous Integration mode
    singleRun: false,
    colors: true,

    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

  });
};
