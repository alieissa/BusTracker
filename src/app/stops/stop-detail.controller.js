'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopCtrl
 * @description
 * # StopCtrl
 * Controller of the busTrackerApp
 */
// angular
//   .module('busTrackerApp')
//   .controller('StopCtrl', StopCtrl);

StopCtrl.$inject = ['$routeParams', 'stopRouteSummary'];

function StopCtrl($routeParams, stopRouteSummary) {
  var vm = this;

  vm.stopNo = $routeParams.stopNo;
  vm.showError = stopRouteSummary.Error !== "";
  vm.routes = vm.showError ? [] : stopRouteSummary.Routes;

}

export {StopCtrl}
