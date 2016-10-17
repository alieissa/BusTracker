'use strict';

var routeParams = {};
var StopCtrl;
var stops;
var mockStops;
var stopNo = 7659;

describe('Controller: Stop', function () {
  // load the controller's module
  beforeEach(module('busTrackerApp'));

  // Initialize the controller
  beforeEach(inject(function ($controller, $q, _stops_) {

    mockStops = {
      getRouteSummary: function(stopNo) {
        // resolve with data
        return $q.when(OC_CALL_RES_MOCK.GetRouteSummaryForStopResult);
      }
    };

    stops = _stops_;
    routeParams.stopNo = stopNo;

    StopCtrl = $controller('StopCtrl', {
      $routeParams: routeParams,
      stops: mockStops
    });

  }));

  it("should have routes var defined", function() {
    expect(StopCtrl.routes).toBeDefined();
  });

  it("should set stop number to $routeParams.stopNo", function() {
    expect(StopCtrl.stopNo).toEqual(routeParams.stopNo);
  });

  describe('Testing activation code.', function() {
    it("should update routes var to stop routes", inject(function($rootScope) {

      // In order for angular to trigger the chained method it has to trigger digest cycle
      // how to do that with out scope not sure.

      StopCtrl.$scope = $rootScope.$new();
      StopCtrl.$scope.$digest();

      expect(StopCtrl.routes).toEqual(OC_CALL_RES_MOCK.GetRouteSummaryForStopResult.Routes.Route);

    }));
  })

});
