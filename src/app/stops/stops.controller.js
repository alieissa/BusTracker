'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopsCtrl
 * @description
 * # StopsCtrl
 * Controller of the busTrackerApp
 */
// angular
//   .module('busTrackerApp')
//   .controller('StopsCtrl', StopsCtrl);

StopsCtrl.$inject = ['stopsList'];

function StopsCtrl(stopsList) {
    var vm = this;

    vm.stopsList = stopsList;
  }

export {StopsCtrl}
