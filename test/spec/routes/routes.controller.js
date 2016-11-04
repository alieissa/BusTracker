'use strict';

const routesList = ["1 Ottawa-Rockcliffe", "1 South Keys"];

describe('Controller: RoutesCtrl', function () {

    let RoutesCtrl;

    // load the controller's module
    beforeEach(module('busTrackerApp'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller) {

        RoutesCtrl = $controller('RoutesCtrl', {
          routesList: routesList
        });

    }));

    it('Should set vm.routesList to resolved routesList array', function() {
        expect(RoutesCtrl.routesList).toEqual(routesList);
    });
});
