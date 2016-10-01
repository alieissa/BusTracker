'use strict';

/**
 * @ngdoc overview
 * @name busTrackerApp
 * @description
 * # busTrackerApp
 *
 * Main module of the application.
 */

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
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
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
  });
