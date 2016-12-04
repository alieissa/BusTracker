describe('Directive: <ae-routes></ae-routes>', function() {

    let aeRoutes, aeRouteDirs, aeMenuBar, vm;
    let $compile, $scope, dBService, controller;
    let defer;
    let _inject = (_$compile_,  _$q_, _$rootScope_, _dBService_) => {

        $compile = _$compile_;
        $rootScope = _$rootScope_;
        dBService = _dBService_;
        defer = _$q_.defer();

        //dBService.get return a promise
        spyOn(dBService, 'get').and.returnValue(defer.promise);

        $scope = $rootScope.$new();
        aeRoutes = _$compile_(angular.element('<ae-routes></ae-routes>'))($scope);

        // resolve the table retrieval promise
        defer.resolve(ROUTES_LIST);

        // Cook everything
        $scope.$digest();

        // get controller that was created using controllerAs: 'routes'
        vm = aeRoutes.isolateScope().routes;
        aeMenuBar = angular.element(aeRoutes).find('ae-menu-bar');
        aeRouteDirs = angular.element(aeRoutes).find('ae-route');
    };

    beforeEach(module('busTrackerApp'));
    beforeEach(module('partials/route.directive.html', 'partials/menu-bar.html'));
    beforeEach(inject(_inject));

    it('Should create <ae-menu-bar> directive', () => {
        expect(aeMenuBar.length).toEqual(1);
    });

    it('Should create <ae-route> directive per route in vm.routes', () => {
        expect(aeRouteDirs.length).toEqual(vm.routes.length);
    });

    describe('Controller: controller', () => {

        it('Should set vm.routes to dBService.get("routes") result', () => {
            expect(vm.routes).toEqual(ROUTES_LIST);
        });

        it('Should call dBService.get("routes")', () => {
            expect(dBService.get).toHaveBeenCalledWith('routes');
        });
    })
    
    it('Should show error message when no data from db');
})
