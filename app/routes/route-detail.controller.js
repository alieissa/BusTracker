'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the busTrackerApp
 */

RouteCtrl.$inject = ['routes', '$routeParams', 'stopsList'];

function RouteCtrl (routes, $routeParams, stopsList) {
  
  let vm = this;

  vm.routeName = $routeParams.routename;
  vm.routeNo = vm.routeName.split(' ')[0]; //smelly
  vm.stops = stopsList; //routes.getStops($routeParams.routename);
}

export {RouteCtrl};
