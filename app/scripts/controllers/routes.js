'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RoutesCtrl
 * @description
 * # RoutesCtrl
 * Controller of the busTrackerApp
 */
angular
  .module('busTrackerApp')
  .controller('RoutesCtrl', RoutesCtrl);

RoutesCtrl.$inject = ['$scope', 'routesList']

function RoutesCtrl($scope, routesList) {
  var vm = this;
  vm.routesList = [];
  vm.routesList = routesList;
}
