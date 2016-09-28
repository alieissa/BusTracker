'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the busTrackerApp
 */
angular.module('busTrackerApp')
  .controller('RouteCtrl', function ($scope, routes, $routeParams) {
    $scope.routeName = $routeParams.routename;
    $scope.stops = routes.getStops($routeParams.routename);
  });
