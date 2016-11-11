'use strict';

var stopNo = 7659;
var header = { headers: {  "Content-Type": "application/x-www-form-urlencoded" }};
var data = "appID=" + OC_CONFIG_MOCK.APP_ID + "&apiKey=" + OC_CONFIG_MOCK.API_KEY + "&stopNo=" + stopNo + "&format=json";
// var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";

describe('Service: stops', function () {

    var stopsService;

    beforeEach(module('busTrackerApp'));
    beforeEach(inject(_inject));

    function _inject(_stopsService_) {
        stopsService = _stopsService_;
    }

    it('should have stopsService.getAll() defined', function() {
        expect(stopsService.getAll).toBeDefined();
    });

    it('should have stopsService.getRouteSummary() defined', function() {
        expect(stopsService.getRouteSummary()).toBeDefined();
    });

    describe("stops.getAll", function() {
        it('should return entire stops table');
    });

    describe("stops.getRouteSummary()", function() {

        var $httpBackend;
        var url = "http://localhost:3000/v1.2/GetNextTripsForStopAllRoutes";
        // var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";

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

            var nextRouteTrips = stopsService.getRouteSummary(stopNo);

            $httpBackend.expectPOST(url, undefined, function(headers) {
                return headers['Content-Type'] === header.headers['Content-Type'];
            }).respond(201, OC_CALL_RES_MOCK);

            $httpBackend.flush();
        });

        it('should return upcoming trips for bus stop via XHR', function() {

            stopNo = 1314;
            // url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";
            data = "appID=" + OC_CONFIG_MOCK.APP_ID + "&apiKey=" + OC_CONFIG_MOCK.API_KEY + "&stopNo=" + stopNo + "&format=json";

            var nextRouteTrips = stopsService.getRouteSummary(stopNo);

            $httpBackend.whenPOST(url, data).respond(OC_CALL_RES_MOCK);
            $httpBackend.flush();

            nextRouteTrips.then(function(routeTrips) {
                expect(Array.isArray(routeTrips.Routes)).toBe(true);
                expect(Array.isArray(routeTrips.Routes[0].Trips)).toBe(true);
                expect(Object.keys(routeTrips)).toEqual(["Error", "Routes", "StopDescription", "StopNo"]);
                // expect(routeTrips).toEqual(GET_STOP_SUMMARY_RESULT.GetRouteSummaryForStopResult.Routes);
            });
        });
  });
});
