'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:ErrorCtrl
 * @description
 * # ErrorCtrl
 * Controller of the busTrackerApp
 */
angular
  .module('busTrackerApp')
  .controller('ErrorCtrl', ErrorCtrl);

ErrorCtrl.$inject = ['$routeParams'];

function ErrorCtrl($routeParams) {
  var vm = this;

  vm.stopNo = $routeParams.stopNo;
  vm.routeNo = $routeParams.routeNo;
}
