'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the busTrackerApp
 */

RouteCtrl.$inject = ['details', 'setFaveStatus'];

function RouteCtrl (details, setFaveStatus) {

	let vm = this;

  	vm.name = details.name;
  	vm.number = details.number;
  	vm.stops = details.stops;
	vm.faveStatus = details.favourite;
  	vm.setFaveStatus = _setFaveStatus;

  	// Handler of Favourite button click events in route.html template
	function _setFaveStatus(name) {

	   	vm.faveStatus = vm.faveStatus === 0 ? 1: 0;
		setFaveStatus(vm.faveStatus, 'name', vm.name);
	}
}

export {RouteCtrl};
