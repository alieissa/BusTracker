'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the busTrackerApp
 */

RouteCtrl.$inject = ['routeDetails', 'setFaveStatus'];

function RouteCtrl (routeDetails, setFaveStatus) {

	let vm = this;

  	vm.name = routeDetails.name;
  	vm.number = routeDetails.number;
  	vm.stops = routeDetails.stops;
	vm.faveStatus = routeDetails.favourite;
  	vm.setFaveStatus = setFaveStatus;

  	// Handler of Favourite button click events in route.html template
	// function _setFaveStatus(name) {
	//
	//    	vm.faveStatus = vm.faveStatus === 0 ? 1: 0;
	// 	setFaveStatus(vm.faveStatus, 'name', vm.name);
	// }
}

export {RouteCtrl};
