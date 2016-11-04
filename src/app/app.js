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

}

function MainCtrl($rootScope) {
  let vm = this;

  $rootScope.$on('$routeChangeError', function(event, prev, next) {
    console.log('Gotcha');
  })
}
