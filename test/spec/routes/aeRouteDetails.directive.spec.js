describe('Directive: <ae-route-details></ae-route-details>', function() {

    let $compile, $scope, $route, $controller;
    let aeRoute, aeRouteDetails, aeTallMenuBar, aeStops, aeRouteDetailsCtrl, dBService;
    let defer, routeDetails, vm;

    let _inject = (_$compile_,  _$q_, _$rootScope_, _$controller_, _dBService_) => {

        $controller =_$controller_;
        dBService = _dBService_;

        $scope = _$rootScope_.$new();
        routeDetails = {name: "Ottawa-Rockliffe", number: 1, stops: STOPS_LIST};

        defer = _$q_.defer();
        spyOn(_dBService_, 'getStops').and.returnValue(defer.promise);

        aeRouteDetailsCtrl = _$controller_('aeRouteDetailsCtrl', {
            $routeParams: {id: 1},
            dBService: _dBService_
        });

        defer.resolve(routeDetails);

        aeRouteDetails = _$compile_(angular.element('<ae-route-details></ae-route-details>'))($scope);
        $scope.$digest();

        vm = aeRouteDetails.isolateScope().route;
        aeTallMenuBar = angular.element(aeRouteDetails).find('ae-tall-menu-bar');
        aeStops = angular.element(aeRouteDetails).find('ae-stop');
    };

    beforeEach(module('busTrackerApp'));
    beforeEach(module('partials/tall-menu-bar.html', 'partials/stop.directive.html'));
    beforeEach(inject(_inject));

    it('Should create one  <ae-stop> directive per stop in vm.routeDetails.stops', () => {
        expect(aeStops.length).toEqual(vm.routeDetails.stops.length);
    });

    it('Should create one  <ae-tall-menu-bar> directive', () => {
        expect(aeTallMenuBar.length).toEqual(1);
    });

    describe('Controller: RouteDetailsCtrl', () => {

        it('Should call dBService.getStops({id: id})', () => {
            expect(dBService.getStops).toHaveBeenCalledWith({id: 1});
        });

        it('Should set vm.routeDetails to value from defer.resovle', () => {
            expect(vm.routeDetails).toEqual(routeDetails);
        });
    });


})
