
var STOPS = [
    {
        name: "1010 TERON",
        number: "1867",
        code: "WH430",
        lat: "45.327938",
        lon: "-75.897675",
        favourite:"0",
        type: "0"
    },
    {
        name: "1090 AMBLESIDE",
        number:"2475",
        code:"NJ070",
        lat: "45.372837",
        lon: "-75.780327",
        favourite: "0",
        type: "0"
    }
]


describe('Directive: <ae-stops></ae-stops>', function() {

    var $compile;
    var $scope;
    var dBService;
    var controller;
    var defer;
    var $httpBackend;

    beforeEach(module('busTrackerApp'));
    beforeEach(module('views/stop.directive.html', 'views/menu-bar.html'));
    beforeEach(inject(_inject));

    function _inject(_$compile_, _$httpBackend_,  _$q_, _$rootScope_, _dBService_) {

        $compile = _$compile_;
        $rootScope = _$rootScope_;
        dBService = _dBService_;
        defer = _$q_.defer();
        $httpBackend = _$httpBackend_;

         //Using template cache to load template did not work
        // $httpBackend.whenGET('views/menu-bar.html').respond('<h1>Menu Bar<h1>')

        //dBService.get return a promise
        spyOn(dBService, 'get').and.returnValue(defer.promise);

        $scope = $rootScope.$new();
    }

    it('Should call dBService.get("stops")', function() {

        // create template and kick-off creation cycle
        var element = $compile(angular.element('<ae-stops></ae-stops>'))($scope);
        $scope.$digest();

        // Get entire 'routes' table from db
        expect(dBService.get).toHaveBeenCalledWith('stops');
    });

    it('Should set stops to data from  database', function() {

        var stops = [];
        // create template
        var element = $compile(angular.element('<ae-stops></ae-stops>'))($scope);

        // resolve the table retrieval promise
        defer.resolve(STOPS);

        $scope.$digest();

        // After digest, data is bound to scope
        var controller = element.isolateScope().stops;
        expect(controller.stops).toEqual(STOPS);
    });

    it('Should create stop element for each stop in stops array', function() {

        // directive as is
        var element = angular.element('<ae-stops></ae-stops>');

        // directive compiled to template. i.e.
        // <ae-menu-bar></ae-menu-bar><ae-stop ng-repeat="stop in stops"><ae-stop>
        var compiled = $compile(element)($scope);

        // route data
        defer.resolve(STOPS);

        // Cook eveything
        $scope.$digest();

        // get controller that was created using controllerAs: 'routes'
        var controller = element.isolateScope().stops;

        console.log(compiled);

        // One route element per route
        var routeElements = angular.element(element).find('ae-stop');
        expect(routeElements.length).toEqual(controller.stops.length);
    })

    it('Should show error message when no data from db');
})
