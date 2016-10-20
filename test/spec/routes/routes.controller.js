'use strict';

describe('Controller: RoutesCtrl', function () {

  // load the controller's module
  beforeEach(module('busTrackerApp'));

  var RoutesCtrl;
  var _routesList;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {

    //Should proper firebase mock to replace this
    _routesList = ["1 Ottawa-Rockcliffe", "1 South Keys"];
    RoutesCtrl = $controller('RoutesCtrl', {
      routesList: _routesList
    });
  }));

  it('Should have vm.stopsList defined', function() {
    expect(RoutesCtrl.routesList).toBeDefined(_routesList);
  })
});
