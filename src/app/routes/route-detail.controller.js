'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the busTrackerApp
 */
angular
  .module('busTrackerApp')
  .controller('RouteCtrl', RouteCtrl);

RouteCtrl.$inject = ['routes', '$routeParams'];
function RouteCtrl (routes, $routeParams) {
  var vm = this;

  vm.routeName = $routeParams.routename;
  vm.routeNo = vm.routeName.split(' ')[0]; //smelly
  vm.stops = routes.getStops($routeParams.routename);
}
