'use strict';

describe('Controller: StopsCtrl', function () {

  // load the controller's module
  beforeEach(module('busTrackerApp'));

  var StopsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StopsCtrl = $controller('StopsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
