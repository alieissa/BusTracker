'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopCtrl
 * @description
 * # StopCtrl
 * Controller of the busTrackerApp
 */
angular
  .module('busTrackerApp')
  .controller('StopCtrl', StopCtrl);

StopCtrl.$inject = ['$routeParams', 'stops'];

function StopCtrl($routeParams, stops) {
  var vm = this;

  vm.stopNo = $routeParams.stopNo;
  stops.getNextTrips($routeParams.stopNo);
}
