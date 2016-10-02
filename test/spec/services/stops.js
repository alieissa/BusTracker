'use strict';

describe('Service: stops', function () {

  // load the service's module
  beforeEach(module('busTrackerApp'));

  // instantiate service
  var stops;
  beforeEach(inject(function (_stops_) {
    stops = _stops_;
  }));

  it('should have .getAll() defined', function() {
    expect(stops.getAll).toBeDefined();
  });

  it("should have .getNextTrips() defined", function() {
    expect(stops.getNextTrips).toBeDefined();
  });

  it('should return upcoming trips for bus stop via XHR', inject(function($httpBackend) {
    var stopNo = 7659;
    var data = {
      stopNo: stopNo,
      appID: OC_CONFIG_MOCK.APP_ID,
      apiKey: OC_CONFIG_MOCK.API_KEY,
      format: "json"
    }

    var nextRouteTrips = stops.getNextTrips(stopNo);
    $httpBackend.whenPOST("https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes", data).respond(OC_CALL_RES_MOCK);
    $httpBackend.flush();

    nextRouteTrips.then(function(_nextRouteTrips_) {
      expect(_nextRouteTrips_).toBe(OC_CALL_RES_MOCK.GetRouteSummaryForStopResult);
    });

    // expect(nextRouteTrips).toEqual(OC_CALL_RES_MOCK);
  }));
});
