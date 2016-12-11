'use strict';

describe('Directive: <ae-stop-next-trips></ae-stop-next-trips>', function() {

    let $compile, $scope, $routeParams, $location,  dBService, oCService;
    let aeStops, aeStopElements, stopNextTripsCtrl, vm, queryObject;
    let defer;

    let  _inject = (_$compile_,  _$q_, _$controller_, _$rootScope_, _$routeParams_, _$location_,  _dBService_, _oCService_) => {

        $compile = _$compile_;
        $routeParams = _$routeParams_;
        $location = _$location_;
        dBService = _dBService_;
        oCService = _oCService_;

        let deferDb = _$q_.defer();
        spyOn(dBService, 'get').and.returnValue(deferDb.promise);
        deferDb.resolve(STOPS_LIST);

        let deferOc = _$q_.defer()
        spyOn(oCService, 'getNextTrips').and.returnValue(deferOc.promise);
        deferOc.resolve({routes: ROUTES_LIST});

        queryObject = {number: 1000}
        spyOn($location, 'search').and.returnValue(queryObject);

        $routeParams.code = 'WM52';
        vm = stopNextTripsCtrl = _$controller_('stopNextTripsCtrl', {
            dBService: dBService,
            oCService: oCService,
            $routParams: $routeParams
        });


        $scope = _$rootScope_.$new();
        aeStops = $compile(angular.element('<ae-stop-next-trips></ae-stop-next-trips>'))($scope);

        $scope.$digest();

        aeStopElements = angular.element(aeStops).find('ae-stop');
        // vm = aeStops.isolateScope().stops;
    };

    beforeEach(module('busTrackerApp'));
    beforeEach(module('partials/route-trips-card.html', 'partials/tall-menu-bar.html'));
    beforeEach(inject(_inject));

    describe('Controller: stopsNextTripsCtrl', () => {
        it('Should call dBService.get("stops", {code: "code"})', () => {
            // dBService.get('stops', {code: code}).then((stop) => vm.stop = stop[0]);
            expect(dBService.get).toHaveBeenCalledWith('stops', {code: 'WM52'});
        });

        it('Should set vm.stop to dBService.get("stops", {code: "code"}) result', () => {
            expect(vm.stop).toEqual(STOPS_LIST[0]);
        });

        it('Should call oCService.getNextTrips("number")', () => {
            // oCService.getNextTrips(number)
            expect(oCService.getNextTrips).toHaveBeenCalledWith(queryObject.number);
        });

        it('Should set vm.routes to oCService.getNextTrips(number) result', () => {
            // oCService.getNextTrips(number)
            expect(vm.routes).toEqual(ROUTES_LIST);
        })
    });

    // it('Should create <ae-stop> directive per stop in vm.stops', () => {
    //     expect(aeStopElements.length).toEqual(vm.stops.length);
    // });
    //
    // it('Should show error message when no data from db');
})
