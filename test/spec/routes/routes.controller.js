'use strict';

describe('Controller: RoutesCtrl', function () {

  // load the controller's module
  beforeEach(module('busTrackerApp'));

  var RoutesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RoutesCtrl = $controller('RoutesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
