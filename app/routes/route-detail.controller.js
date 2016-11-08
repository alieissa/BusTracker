'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the busTrackerApp
 */

RouteCtrl.$inject = ['routes', '$routeParams', '$timeout', 'stopsList', 'faveStatus', 'setFaveStatus'];

function RouteCtrl (routes, $routeParams, $timeout, stopsList, faveStatus, setFaveStatus) {
  
  let vm = this;

  vm.routeName = $routeParams.routename;
  vm.routeNo = vm.routeName.split(' ')[0]; //smelly
  vm.stops = stopsList; 
  vm.faveStatus = faveStatus;
  
  // Handler of Favourite button click events in route.html template
  vm.setFaveStatus = (routeName) => {
  	//toggle fave status according to fave btn clicks
	   vm.faveStatus = vm.faveStatus === 1 ? 0: 1;
  	setFaveStatus(routeName, vm.faveStatus);
  }

}

export {RouteCtrl};
