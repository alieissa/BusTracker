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

StopCtrl.$inject = ['$routeParams', 'stops'];

function StopCtrl($routeParams, stops) {
  var vm = this;

  vm.routes = [];
  vm.stopNo = $routeParams.stopNo;

  activate();

  function activate() {
    return getRouteSummary().then(function(routeData) {
      // console.log(routeData);
    });
  }

  function getRouteSummary(){
    return stops.getRouteSummary(vm.stopNo)
      .then(function(routeSummary) {
        vm.routes = routeSummary.Routes.Route;
        return vm.routes;
      })
  }

}

export {StopCtrl}
