'use strict';

var routeParams = {};
var StopCtrl;
var stops;
var mockStops;
var stopNo = 7659;

describe('Controller: Stop', function () {
  // load the controller's module
  beforeEach(module('stopsMod'));

  let StopCtrl;

  const routeParams = {
      stopNo:stopNo
  };
  // Initialize the controller
  beforeEach(inject(function ($controller, $q, _stops_) {

    // mockStops = {
    //   getRouteSummary: function(stopNo) {
    //     // resolve with data
    //     return $q.when(OC_CALL_RES_MOCK.GetRouteSummaryForStopResult);
    //   }
    // };

    stops = _stops_;

    let stopRouteSummary = {
        Error: "12"
    }

    StopCtrl = $controller('StopCtrl', {
      $routeParams: routeParams,
      stopRouteSummary: stopRouteSummary
    });

  }));


    it("should have vm.routes defined", function() {
    expect(StopCtrl.routes).toBeDefined();
    });

    it("should set vm.stopNo to $routeParams.stopNo", function() {
    expect(StopCtrl.stopNo).toEqual(routeParams.stopNo);
    });

    it("should have vm.showError defined", function() {
      expect(StopCtrl.showError).toBeDefined();
    });

    describe("An error in getting the route summary for stop", function() {

        let stopRouteSummary = {
          Error: "12",
          StopRouteDescription: "Stop description"
        }

        beforeEach(inject(function($controller) {

            StopCtrl = $controller('StopCtrl', {
                $routeParams: routeParams,
                stopRouteSummary: stopRouteSummary
            });

        }));

        it('Should set vm.showError to true', function() {
            expect(StopCtrl.showError).toEqual(true);
        });
        it("Should set vm.routes to empty array", function() {
            expect(StopCtrl.routes.length).toEqual(0);
        });
        it("Should set vm.StopDescription to stopRouteSummary.StopDescription", function() {
            expect(StopCtrl.StopDescription).toEqual(stopRouteSummary.StopDescription);
        })
    });

    describe("stopRouteSummary contains data", function() {
        let stopRouteSummary = {}

        beforeEach(inject(function() {

            StopCtrl = new $controller("StopCtrl", {
                routeParams: routeParams,
                stopRouteSummary: stopRouteSummary
            });

        }));

        it('Shoud set vm.routes to stopRouteSummary.routes');
        it("Should set vm.showError to false");
        it("Should set vm.StopDescription to stopRouteSummary.stopDescription");
    })
});
