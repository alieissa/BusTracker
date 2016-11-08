'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopCtrl
 * @description
 * # StopCtrl
 * Controller of the busTrackerApp
 */

StopCtrl.$inject = ['$routeParams', 'stopRouteSummary', 'faveStatus', 'setFaveStatus'];

function StopCtrl($routeParams, stopRouteSummary, faveStatus, setFaveStatus) {
  
  let vm = this;

  vm.stopNo = $routeParams.stopNo;
  vm.showError = stopRouteSummary.Error !== '';
  vm.routes = vm.showError ? [] : stopRouteSummary.Routes;
  vm.stopDescription = stopRouteSummary.StopDescription;

  vm.faveStatus = faveStatus;

  vm.setFaveStatus = (stopNo) => {
  	
  	vm.faveStatus = vm.faveStatus === 1 ? 0 : 1;
  	setFaveStatus(stopNo, vm.faveStatus);

  	console.log(vm.faveStatus);
  }
  console.log('Fave Status: ' + vm.faveStatus);
}

export {StopCtrl};
