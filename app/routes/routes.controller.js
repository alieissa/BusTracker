'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RoutesCtrl
 * @description
 * # RoutesCtrl
 * Controller of the busTrackerApp
 */

RoutesCtrl.$inject = ['routesList'];

function RoutesCtrl(routesList) {

    let vm = this;

    vm.routesList = routesList;
}

export {RoutesCtrl};
