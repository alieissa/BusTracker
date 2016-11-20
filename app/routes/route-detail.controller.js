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
  	vm.setFaveStatus = _setFaveStatus;

 //  	Handler of Favourite button click events in route.html template
	function _setFaveStatus(name) {

	   let 	_favourite = vm.favourite === 0 ? 1: 0;
		setFaveStatus('routes', {'favourite': _favourite}, {'name': vm.name})
			.then(() => {
				vm.favourite = _favourite;
			});
	}
}

export {RouteCtrl};
