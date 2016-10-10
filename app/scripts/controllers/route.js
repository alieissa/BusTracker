'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the busTrackerApp
 */
angular
  .module('busTrackerApp')
  .controller('RouteCtrl', function ($scope, routes, $routeParams) {
    var vm = this;

    vm.routeName = $routeParams.routename;
    vm.stops = routes.getStops($routeParams.routename);
  });
