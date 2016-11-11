'use strict';

var stops = {
  "3010": "LEBRETON 3A",
  "3011": "TUNNEY'S PASTURE D",
  "3060": "BAYVIEW 2A",
  "5718": "PROMENAD AND TERRASSES DE LA CHAUDIÈRE",
  "5722": "BOOTH AND VIMY PLACE",
  "6530": "EDDY AND LAURIER"
};

describe('Controller: RouteDetailCtrl', function () {

    var RouteCtrl;
    var details = {
        name: '1 Ottawa-Rockliffe',
        number: '1',
        favourite: 1,
        stops: []
    };

    // load the controller's module
    beforeEach(module('routesMod'));
    beforeEach(inject(_inject));

    function _inject($controller, $rootScope) {

        var mocksDeps = {
            details: details,
            setFaveStatus: mocksetFaveStatus
        };

        RouteCtrl = $controller('RouteCtrl', mocksDeps);

        function mocksetFaveStatus() {
            RouteCtrl.faveStatus = RouteCtrl.faveStatus == 0 ? 1 : 0;
            // Also calls setFaveStatus to change database favourite field
        }
    }

    it('Should set route number to number in route details', function() {
      expect(RouteCtrl.number).toEqual(details.number);
    });

    it('Should route name to name in route details', function() {
        expect(RouteCtrl.name).toEqual(details.name)
    });

    it('Should set route stops to stops in route details', function() {
        expect(RouteCtrl.stops).toEqual(details.stops);
    });

    it('Should set route fave status, 0/1, to fave status in route details', function() {
        expect(RouteCtrl.faveStatus).toEqual(details.favourite);
    });

    it('Should set setFaveStatus to injected setFaveStatus function', function() {
        expect(typeof RouteCtrl.setFaveStatus).toBe('function');
    })

});
