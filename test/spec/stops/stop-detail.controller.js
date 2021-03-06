'use strict';



describe('Controller: StopDetailCtrl', function () {

    var StopDetailCtrl;
    var _setFaveStatus;
    var mockDeps;
    var routeDetails = {
        error: ''
    };
    var stopDetails = [{
        name: "1010 TERON",
        number: 1867,
        code: 'H430',
        lat: 45.327938,
        lon: -75.897675,
        favourite: 0
    }];

    var stopNo;
    var routeParams = {
        stopNo:stopNo
    };

    var _inject = function ($controller, _$q_) {

        _setFaveStatus = function() {
            StopDetailCtrl.favourite = StopDetailCtrl.favourite === 1 ? 0 : 0;
        }

        mockDeps = {
            routeDetails: routeDetails,
            stopDetails: stopDetails,
            setFaveStatus: _setFaveStatus
        }

        StopDetailCtrl = $controller('StopDetailCtrl', mockDeps);
    };

    beforeEach(module('busTrackerApp'));
    beforeEach(inject(_inject));

    it('should set StopDetailCtrl.code to stopDetails.code', function() {
        expect(StopDetailCtrl.code).toEqual(stopDetails[0].code);
    });

    it('should set StopDetailCtrl.error to routeDetails.error', function() {
        expect(StopDetailCtrl.error).toEqual(routeDetails.error);
    });

    it('should set StopDetailCtrl.favourite to stopDetails.favourite', function() {
        expect(StopDetailCtrl.favourite).toEqual(stopDetails[0].favourite);
    });

    // it('should set StopDetailCtrl.routes to routeDetails.routes', function() {
    //     expect(StopDetailCtrl.routes).toEqual(routeDetails.routes);
    // });

    it('should set StopDetailCtrl.name to stopDetails.name', function() {
        expect(StopDetailCtrl.name).toEqual(stopDetails[0].name);
    });

    it('should set StopDetailCtrl.number to stopDetails.number', function() {
        expect(StopDetailCtrl.number).toEqual(stopDetails[0].number);
    });

    it('should set StopDetailCtrl.setFaveStatus to stopDetails.setFaveStatus', function() {

        expect(typeof StopDetailCtrl.setFaveStatus).toEqual('function');
        // expect(StopDetailCtrl.setFaveStatus).toEqual(_setFaveStatus);
    });

});
