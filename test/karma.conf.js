// Karma configuration
// Generated on 2016-09-26

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // reporters configuration
    reporters: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'assets/lib//jquery/dist/jquery.js',
      'assets/lib//angular/angular.js',
      'assets/lib//angular-route/angular-route.js',
      'assets/lib//firebase/firebase.js',
      'assets/lib//angularfire/dist/angularfire.js',
      // endbower

      'dist/*.js',
      'test/constants.js',
      'test/spec/routes/*.js',
      'test/spec/stops/*.js',
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
        
        //'Chrome',
        'PhantomJS'
    ],

    // plugins: [
    //   'karma-jasmine'
    // ],
    // // Which plugins to enable
    // plugins: [
    //   'karma-phantomjs-launcher',
    //   'karma-jasmine'
    // ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
