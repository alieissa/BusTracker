'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopsCtrl
 * @description
 * # StopsCtrl
 * Controller of the busTrackerApp
 */

StopsCtrl.$inject = ['stopsList'];

function StopsCtrl(stopsList) {
    var vm = this;

    vm.stopsList = stopsList;
  }

export {StopsCtrl}
