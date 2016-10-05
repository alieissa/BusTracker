'use strict';

describe('Controller: StopCtrl', function () {

  // load the controller's module
  beforeEach(module('busTrackerApp'));

  var StopCtrl;
  var scope;
  var routeParams = {};
  var stops;
  var stopNo = 7659;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _stops_) {

    stops = _stops_;
    routeParams.stopNo = stopNo;

    StopCtrl = $controller('StopCtrl', {
      $routeParams: routeParams
    });
  }));


  it("should have routes var defined", function() {
    expect(StopCtrl.routes).toBeDefined();
  });

  it("should set stop number to $routeParams.stopNo", function() {
    expect(StopCtrl.stopNo).toEqual(routeParams.stopNo);
  });

  it("should call stops.getRouteSummary", function() {
    spyOn(stops, "getRouteSummary");
    expect(stops.getRouteSummary).toHaveBeenCalled();
  });

  it("should set routes to routes from stops.getRouteSummary", function() {});
});
