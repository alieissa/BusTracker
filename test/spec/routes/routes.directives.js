describe('Directive: <ae-routes></ae-routes>', function() {

    var $compile;
    var $scope;
    var dBService;
    var controller;
    var defer;
    var $httpBackend;

    beforeEach(module('busTrackerApp'));
    beforeEach(module('views/route.directive.html', 'views/menu-bar.html', 'views/routes.directive.html'));
    beforeEach(inject(_inject));

    function _inject(_$compile_, _$httpBackend_,  _$q_, _$rootScope_, _dBService_) {

        $compile = _$compile_;
        $rootScope = _$rootScope_;
        dBService = _dBService_;
        defer = _$q_.defer();
        $httpBackend = _$httpBackend_;

        //dBService.get return a promise
        spyOn(dBService, 'get').and.returnValue(defer.promise);

        $scope = $rootScope.$new();
    }

    it('Should call dBService.get("routes")', function() {

        // create template and kick-off creation cycle
        var element = $compile(angular.element('<ae-routes></ae-routes>'))($scope);
        $scope.$digest();

        // Get entire 'routes' table from db
        expect(dBService.get).toHaveBeenCalledWith('routes');
    });

    it('Should set routes to data from routes from database', function() {

        // create template
        var element = $compile(angular.element('<ae-routes></ae-routes>'))($scope);

        // resolve the table retrieval promise
        defer.resolve(['Route 1', 'Route 2']);

        // Cook everything
        $scope.$digest();

        // get controller that was created using controllerAs: 'routes'
        var controller = element.isolateScope().routes;
        expect(controller.routes).toEqual(['Route 1', 'Route 2']);
    });

    it('Should create route element for each route in routes array', function() {

        // directive as is
        var element = angular.element('<ae-routes></ae-routes>');

        // directive compiled to template. i.e.
        // <ae-menu-bar></ae-menu-bar><ae-route ng-repeat="route in routes"><ae-route>
        var compiled = $compile(element)($scope);

        // route data
        defer.resolve([{name: 'Route 1', number: 1}, {name: 'Route 2', number: 2}]);

        $scope.$digest();

        // get controller that was created using controllerAs: 'routes'
        var controller = element.isolateScope().routes;
        // console.log(compiled);

        // One route element per route
        var routeElements = angular.element(element).find('ae-route');
        expect(routeElements.length).toEqual(controller.routes.length);
    })

    it('Should show error message when no data from db');
})
