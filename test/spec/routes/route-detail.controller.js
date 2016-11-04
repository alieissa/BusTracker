'use strict';

const stops = {
  "3010": "LEBRETON 3A",
  "3011": "TUNNEY'S PASTURE D",
  "3060": "BAYVIEW 2A",
  "5718": "PROMENAD AND TERRASSES DE LA CHAUDIÈRE",
  "5722": "BOOTH AND VIMY PLACE",
  "6530": "EDDY AND LAURIER"
};

describe('Controller: RouteDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('busTrackerApp'));

  var RouteCtrl;
  var scope;
  var routeParams;
  var routesMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {

    routesMock = {
      getStops: function(routeParams) {
        return stops;
      }
    };

    routeParams = {
      routename: '1 Ottawa-Rockcliffe'
    };

    RouteCtrl = $controller('RouteCtrl', {
      $routeParams: routeParams,
      routes: routesMock
    });

  }));

  it('Should parse route name and set vm.routeNo using parsed data', function() {
    expect(RouteCtrl.routeNo).toEqual(routeParams.routename.split(" ")[0]);
  });

  it('Should set vm.routeName to to $routeParams.routeName', function() {
      expect(RouteCtrl.routeName).toEqual(routeParams.routename)
  });

  it('Should set vm.stops to result of route.getStops(vm.routeName)', function() {
    expect(RouteCtrl.stops).toEqual(stops);
  });

});
