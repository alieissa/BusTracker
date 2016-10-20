'use strict';
var $httpBackend;
var routeNo;
var stopNo;
var url;
var data;
var routes;

describe('Service: routes', function () {

  // load the service's module
  beforeEach(function() {
    module('busTrackerApp');
    // module('routesMod');
  });

  // instantiate service
  // var routes;
  beforeEach(inject(function (_routes_) {
    routes = _routes_;
  }));

  it('should have .getNextTrips defined', inject(function (_routes_) {
    expect(routes.getNextTrips).toBeDefined();
  }));

  it('should have .getAll defined',  inject(function (_routes_) {
    expect(routes.getAll).toBeDefined();
  }));


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
      stopNo = 3038;
      url = "https://api.octranspo1.com/v1.2/GetNextTripsForStop";
      data = "appID=" + OC_CONFIG_MOCK.APP_ID + "&apiKey=" + OC_CONFIG_MOCK.API_KEY + "&stopNo=" + stopNo + "&routeNo=" + routeNo + "&format=json";

      var nextTrips = routes.getNextTrips(routeNo, stopNo);
      $httpBackend.whenPOST(url, data).respond(NEXT_TRIPS_FOR_STOP);
      $httpBackend.flush();

      nextTrips.then(function(trips) {
        expect(trips).toEqual(EXPECTED_NEXT_TRIPS_FOR_STOP.GetNextTripsForStopResult);
      });

    });
  });
});
