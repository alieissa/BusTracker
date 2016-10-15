'use strict';

describe('Controller: RoutestopsCtrl', function () {

  // load the controller's module
  beforeEach(module('busTrackerApp'));

  var RoutestopsCtrl,

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    RoutestopsCtrl = $controller('RoutestopsCtrl', {
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RoutestopsCtrl.awesomeThings.length).toBe(3);
  });
});
