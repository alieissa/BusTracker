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

  // console.log(details);
  vm.faveStatus = details.favourite;
  vm.name = details.name;
  vm.number = details.number;
  vm.stops = details.stops; 
  
  // Handler of Favourite button click events in route.html template
  vm.setFaveStatus = (name) => {
  	//toggle fave status according to fave btn clicks
	   vm.faveStatus = vm.faveStatus === 1 ? 0: 1;
  	setFaveStatus(vm.name, vm.faveStatus);
  }

}

export {RouteCtrl};
