'use strict';

/**
 * @ngdoc overview
 * @name busTrackerApp
 * @description
 * # busTrackerApp
 *
 * Main module of the application.
 */

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
    'ngRoute',
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
      .when('/about', {
        templateUrl: 'views/about.html',
        // controller: 'AboutCtrl',
        // controllerAs: 'about'
      })
      .when('/routes', {
        templateUrl: 'views/routes.html',
        controller: 'RoutesCtrl',
        controllerAs: 'routes',
        resolve: {
          routesList: function(routes) {
            return routes.getAll().$loaded();
          }
        }
      })
      .when('/routes/:routename', {
        templateUrl: 'views/route.html',
        controller: 'RouteCtrl',
        controllerAs: 'route'
      })
      .when('/routes/:routeNo/:stopNo', {
        templateUrl: 'views/routestops.html',
        controller: 'RoutestopsCtrl',
        controllerAs: 'routeStops'
      })
      .when('/stops', {
        templateUrl: 'views/stops.html',
        controller: 'StopsCtrl',
        controllerAs: 'stops',
        resolve: {
          stopsList: function(stops) {
            return stops.getAll().$loaded();
          }
        }
      })
      .when('/stops/:stopNo', {
        templateUrl: 'views/stop.html',
        controller: 'StopCtrl',
        controllerAs: 'stop'
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
