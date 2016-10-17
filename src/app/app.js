'use strict';

/**
 * @ngdoc overview
 * @name busTrackerApp
 * @description
 * # busTrackerApp
 *
 * Main module of the application.
 */
import {routesMod} from './routes/routes.module.js';
import {stopsMod} from './stops/stops.module.js';
import {firebaseInit} from '../../config/database.js';
import {FIREBASECONFIG} from '../../config/fb.js';

angular
  .module('busTrackerApp', [
    'firebase',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'routesMod',
    'stopsMod',
    'ngSanitize',
    'ngTouch'
  ])
  .config(config)
  .controller('MainCtrl', MainCtrl);

function config($routeProvider, $firebaseRefProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
    .otherwise({
      redirectTo: '/'
    });

    firebaseInit();
    //
    $firebaseRefProvider.registerUrl({
      default: FIREBASECONFIG.databaseURL,
      routes: FIREBASECONFIG.databaseURL + '/routes',
      stops: FIREBASECONFIG.databaseURL + '/stops'
    });
}

function MainCtrl($rootScope) {

  $rootScope.$on('$routeChangeError', function(event, prev, next) {
    console.log('Gotcha');
  })
  var vm = this;
}
