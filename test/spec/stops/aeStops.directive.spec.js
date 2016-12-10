'use strict';

describe('Directive: <ae-stops></ae-stops>', function() {

    let $compile, $scope, dBService, controller;
    let aeStops, aeStopElements, vm;
    let defer;

    let  _inject = (_$compile_,  _$q_, _$rootScope_, _dBService_) => {

        $compile = _$compile_;
        dBService = _dBService_;

        defer = _$q_.defer();
        spyOn(dBService, 'get').and.returnValue(defer.promise);
        defer.resolve(STOPS_LIST);

        $scope = _$rootScope_.$new();
        aeStops = $compile(angular.element('<ae-stops></ae-stops>'))($scope);
        $scope.$digest();

        aeStopElements = angular.element(aeStops).find('ae-stop');
        vm = aeStops.isolateScope().stops;
    };

    beforeEach(module('busTrackerApp'));
    beforeEach(module('partials/stop.directive.html', 'partials/menu-bar.html'));
    beforeEach(inject(_inject));

    describe('Controller: aeStopsCtrl', () => {
        it('Should call dBService.get("stops")', () => {
            expect(dBService.get).toHaveBeenCalledWith('stops');
        });

        it('Should set vm.stops to dBService.get("stops") result', () => {
            expect(vm.stops).toEqual(STOPS_LIST);
        });
    });

    it('Should create <ae-stop> directive per stop in vm.stops', () => {
        expect(aeStopElements.length).toEqual(vm.stops.length);
    });

    it('Should show error message when no data from db');
})
