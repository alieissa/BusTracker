'use strict';
var $httpBackend;
var routeNo;
var stopNo;
var url;
var data;

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

  it('should have .getNextTrips defined', function() {
    expect(routes.getNextTrips).toBeDefined();
  });

  describe('.getNextTrips(routeNo, stopNo)', function() {

    beforeEach(inject (function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get next trips for stop', function() {
      routeNo = 1;
      stopNo = 7659;
      url = "https://api.octranspo1.com/v1.2/GetNextTripsForStop";
      data = "appID=" + OC_CONFIG_MOCK.APP_ID + "&apiKey=" + OC_CONFIG_MOCK.API_KEY + "&stopNo=" + stopNo + "&routeNo=" + routeNo + "&format=json";

      var nextTrips = routes.getNextTrips(routeNo, stopNo);
      $httpBackend.whenPOST(url, data).respond(NEXT_TRIPS_FOR_STOP.GetNextTripsForStopResult);
      $httpBackend.flush();

      nextTrips.then(function(trips) {
        expect(trips).toEqual(NEXT_TRIPS_FOR_STOP.GetNextTripsForStopResult);
      });

    });
  });
});
