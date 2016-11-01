'use strict';

var stopNo = 7659;
var header = { headers: {  "Content-Type": "application/x-www-form-urlencoded" }};
var data = "appID=" + OC_CONFIG_MOCK.APP_ID + "&apiKey=" + OC_CONFIG_MOCK.API_KEY + "&stopNo=" + stopNo + "&format=json";
var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";

describe('Service: stops', function () {

  // load the service's module
  beforeEach(module('busTrackerApp'));

  // instantiate service
  var stops;
  beforeEach(inject(function (_stops_) {
    stops = _stops_;
  }));

  it('should have stops.getAll() defined', function() {
    expect(stops.getAll).toBeDefined();
  });

  it('should have stops.getRouteSummary() defined', function() {
    expect(stops.getRouteSummary()).toBeDefined();
  });

  describe("stops.getAll", function() {
      it('should return entire stops table');
  });

  describe("stops.getRouteSummary()", function() {
    var $httpBackend;

    beforeEach(inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    // it("should have getRouteSummary() defined", function() {
    //   expect(stops.getRouteSummary).toBeDefined();
    // });

    it("XHR should have correct headers for CORS call",function() {
      url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";
      var nextRouteTrips = stops.getRouteSummary(stopNo);

      $httpBackend.expectPOST(url, undefined, function(headers) {
         return headers['Content-Type'] === header.headers['Content-Type'];
       }).respond(201, OC_CALL_RES_MOCK);

        $httpBackend.flush();
    });

    it('should return upcoming trips for bus stop via XHR', function() {
      stopNo = 1314;
      url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";
      data = "appID=" + OC_CONFIG_MOCK.APP_ID + "&apiKey=" + OC_CONFIG_MOCK.API_KEY + "&stopNo=" + stopNo + "&format=json";

      var nextRouteTrips = stops.getRouteSummary(stopNo);

      $httpBackend.whenPOST(url, data).respond(OC_CALL_RES_MOCK);
      $httpBackend.flush();

      nextRouteTrips.then(function(routeTrips) {
        expect(routeTrips).toEqual(GET_STOP_SUMMARY_RESULT.GetRouteSummaryForStopResult.Routes);
      });
    });
  });
});
