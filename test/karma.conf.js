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
    frameworks: ['jasmine'],

    // reporters configuration
    reporters: ['mocha'],

    // Order of file loading is important
    files: [
    
      // Libraries
      'assets/lib/jquery/dist/jquery.js',
      'assets/lib/angular/angular.js',
      'assets/lib/angular-route/angular-route.js',
      'assets/lib/firebase/firebase.js',
      'assets/lib/angularfire/dist/angularfire.js',

      // My Code
      'dist/*.js',
      'test/constants.js',
      'test/spec/routes/*.js',
      'test/spec/stops/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    port: 8080,
    browsers: [
        
        //'Chrome',
        'PhantomJS'
    ],

    plugins: [
      'karma-jasmine',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher'
    ],
   

    // Continuous Integration mode
    singleRun: true,
    colors: true,

    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

  });
};
