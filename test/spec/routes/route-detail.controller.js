'use strict';

describe('Controller: RouteCtrl', function () {

  // load the controller's module
  beforeEach(module('busTrackerApp'));

  var RouteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RouteCtrl = $controller('RouteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
  
});
