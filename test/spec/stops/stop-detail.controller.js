'use strict';

var stopNo = 7659;

describe('Controller: StopDetailCtrl', function () {

    var $controller;
    var StopDetailCtrl;
    var _getFaveStatus;
    var _setFaveStatus;
    var mockDeps;
    var stopRouteSummary;
    var routeParams = {
        stopNo:stopNo
    };

    beforeEach(module('busTrackerApp'));
    beforeEach(inject(_inject));

    function _inject(_$controller_, _$q_) {

        // var stopsService = _stopsService_;
        _getFaveStatus = function(number, stopNo) {
            return _$q_.resolve(0);
        }

        _setFaveStatus = function() {
            StopDetailCtrl.faveStatus = StopDetailCtrl.faveStatus === 1 ? 0 : 0;
        }

        $controller = _$controller_
        stopRouteSummary = {
            Error: "12"
        }
        mockDeps = {
            $routeParams: routeParams,
            stopRouteSummary: stopRouteSummary,
            getFaveStatus: _getFaveStatus,
            setFaveStatus: _setFaveStatus
        }


        StopDetailCtrl = $controller('StopDetailCtrl', mockDeps);
    }

    it("should set StopDetailCtrl.routes to details.routes", function() {
        expect(StopDetailCtrl.routes).toBeDefined();
    });

    // TODO: Uncomment and finish test
    // it('Should set StopDetailCtrl.faveStatus to resolved value of getFaveStatus', function() {

    //     spyOn(mockDeps, 'getFaveStatus');
    //     var _StopDetailCtrl =  $controller('StopDetailCtrl', mockDeps);

    //     expect(mockDeps.getFaveStatus).toHaveBeenCalled();

    // });

    it('Should set StopDetailCtrl.setFaveStatus to injected setFaveStatus function', function() {
        expect(StopDetailCtrl.setFaveStatus).toEqual(_setFaveStatus);
    });

    it("should have StopDetailCtrl.routes defined", function() {
        expect(StopDetailCtrl.routes).toBeDefined();
    });

    it("should set StopDetailCtrl.stopNo to $routeParams.stopNo", function() {
        expect(StopDetailCtrl.stopNo).toEqual(routeParams.stopNo);
    });

    it("should have StopDetailCtrl.showError defined", function() {
        expect(StopDetailCtrl.showError).toBeDefined();
    });

    describe("An error in getting the route summary for stop", function() {

        stopRouteSummary = {
          Error: "12",
          StopRouteDescription: "Stop description"
        }

        beforeEach(inject(function($controller) {

            StopDetailCtrl = $controller('StopDetailCtrl', {
                $routeParams: routeParams,
                stopRouteSummary: stopRouteSummary
            });

        }));

        it('Should set StopDetailCtrl.showError to true', function() {
            expect(StopDetailCtrl.showError).toEqual(true);
        });
        it("Should set StopDetailCtrl.routes to empty array", function() {
            expect(StopDetailCtrl.routes.length).toEqual(0);
        });
        it("Should set StopDetailCtrl.StopDescription to stopRouteSummary.StopDescription", function() {
            expect(StopDetailCtrl.StopDescription).toEqual(stopRouteSummary.StopDescription);
        })
    });

    describe("stopRouteSummary contains data", function() {
        var stopRouteSummary = {}

        beforeEach(inject(function() {

            StopDetailCtrl = new $controller("StopDetailCtrl", {
                routeParams: routeParams,
                stopRouteSummary: stopRouteSummary
            });

        }));

        it('Shoud set StopDetailCtrl.routes to stopRouteSummary.routes');
        it("Should set StopDetailCtrl.showError to false");
        it("Should set StopDetailCtrl.StopDescription to stopRouteSummary.stopDescription");
    })
});
