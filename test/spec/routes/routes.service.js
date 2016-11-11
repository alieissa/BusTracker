'use strict';
// var $httpBackend;
// var routeNo;
// var stopNo;
// var url;
// var data;
// var routes;

window._env = {};
window._env.OC = OC_CONFIG_MOCK;

describe('Service: routesService', function () {

    var routesService;

    beforeEach(module('busTrackerApp'));
    beforeEach(inject(function (_routesService_) {
        routesService = _routesService_;
    }));

    it('should have routesService.getNextTrips defined', function () {
        expect(routesService.getNextTrips).toBeDefined();
    });

    it('should have routesService.getAll defined',  function () {
        expect(routesService.getAll).toBeDefined();
    });


    describe('routes.getNextTrips(routeNo, stopNo)', function() {

        var $httpBackend;
        var routeNo;
        var stopNo;
        var url;
        var data;

        beforeEach(inject (function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
        }));

        afterEach(function() {

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should get next trips for stop', function() {

          routeNo = 1;
          name = '1 Ottawa-Rockliffe';
          stopNo = 3038;
          url = 'http://localhost:3000/v1.2/GetNextTripsForStop';
          data = "appID=" + OC_CONFIG_MOCK.APP_ID + "&apiKey=" + OC_CONFIG_MOCK.API_KEY + "&stopNo=" + stopNo + "&routeNo=" + routeNo + "&format=json";

          var nextTrips = routesService.getNextTrips(name, routeNo, stopNo);
          $httpBackend.whenPOST(url, data).respond(NEXT_TRIPS_FOR_STOP);
          $httpBackend.flush();

          nextTrips.then(function(trips) {
            expect(trips).toEqual(EXPECTED_NEXT_TRIPS_FOR_STOP.GetNextTripsForStopResult);
          });

        });
    });
});
