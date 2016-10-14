'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the busTrackerApp
 */
angular
  .module('busTrackerApp')
  .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$rootScope'];

  function MainCtrl($rootScope) {
    $rootScope.$on('$routeChangeError', function(event, current, previous) {
      console.log(event);
      console.log(current)

    })
  }
