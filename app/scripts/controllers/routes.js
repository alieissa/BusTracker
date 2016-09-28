'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RoutesCtrl
 * @description
 * # RoutesCtrl
 * Controller of the busTrackerApp
 */
angular.module('busTrackerApp')
  .controller('RoutesCtrl', function ($scope, routesList) {
    $scope.routesList = routesList;
  });
