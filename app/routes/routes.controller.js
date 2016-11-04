'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RoutesCtrl
 * @description
 * # RoutesCtrl
 * Controller of the busTrackerApp
 */

RoutesCtrl.$inject = ['routesList'];

function RoutesCtrl(routesList) {
  var vm = this;

  vm.routesList = [];
  vm.routesList = routesList;
}

export {RoutesCtrl};