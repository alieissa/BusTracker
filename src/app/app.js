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

firebase.initializeApp({
   apiKey: "AIzaSyAsfPArCOskSBxDgZSXawQo0QNyakC5PPc",
   authDomain: "octranspo-a9250.firebaseapp.com",
   databaseURL: "https://octranspo-a9250.firebaseio.com",
   storageBucket: "octranspo-a9250.appspot.com",
   messagingSenderId: "180165321438"
 });

angular
  .module('busTrackerApp', [
    'firebase',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    // 'ngRoute',
    'routesMod',
    'stopsMod',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function (FIREBASECONFIG, $routeProvider, $firebaseRefProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        // controller: 'MainCtrl',
        // controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });

      $firebaseRefProvider.registerUrl({
        default: FIREBASECONFIG.databaseURL,
        routes: FIREBASECONFIG.databaseURL + '/routes',
        stops: FIREBASECONFIG.databaseURL + '/stops'
      });
  });
