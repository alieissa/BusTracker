'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopCtrl
 * @description
 * # StopCtrl
 * Controller of the busTrackerApp
 */

StopCtrl.$inject = ['$routeParams', 'stopRouteSummary'];

function StopCtrl($routeParams, stopRouteSummary) {
  var vm = this;

  vm.stopNo = $routeParams.stopNo;
  vm.showError = stopRouteSummary.Error !== "";
  vm.routes = vm.showError ? [] : stopRouteSummary.Routes;
  vm.stopDescription = stopRouteSummary.StopDescription;

}

export {StopCtrl}
