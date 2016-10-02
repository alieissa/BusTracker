'use strict';

describe('Service: routes', function () {

  // load the service's module
  beforeEach(module('busTrackerApp'));
  // beforeEach(module('firebase'))

  // instantiate service
  var routes;
  beforeEach(inject(function (_routes_) {
    routes = _routes_;
  }));

  it('should have .getAll defined', function () {
    expect(routes.getAll).toBeDefined();
  });

});
