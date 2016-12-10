describe('Directive: <ae-stop></ae-stop>', function() {

    let $compile, $scope;
    let aeStop, anchor, icon;
    let stop = {
        "name":"Jockvale & Abetti",
        "number":274,"code":"WA874",
        "lat":45.25885,
        "lon":-75.730598,
        "type":0,
        "favourite":0
    };

    let _inject = (_$compile_,  _$q_, _$rootScope_, _dBService_) => {

        $scope = _$rootScope_.$new();
        $scope.stop = stop;
        aeStop = _$compile_(angular.element('<ae-stop data-stop="stop"></ae-stop>'))($scope);
        $scope.$digest();

        anchor = angular.element(aeStop).find('a');
        icon = angular.element(aeStop).find('i');
    };

    beforeEach(module('busTrackerApp'));
    beforeEach(module('partials/stop.directive.html'));
    beforeEach(inject(_inject));

    it('$scope.stop.favourite = 0 should set icon text to  star', () => {
        expect(icon.text()).toEqual('star_border')
    });

    it('$scope.stop.favourite = 1 should re-set icon text to sta', () => {

        $scope.stop.favourite = 1;
        $scope.$apply();

        expect(icon.text()).toEqual('star');
    });

    it('Should set anchor text to "stop.number stop.name"', () => {
        expect(anchor.text()).toEqual(`${$scope.stop.number} ${$scope.stop.name}`);
    });

    it('Should set route detail link to /stops/4?number="Ottawa-Rockliffe"', () => {
        expect(anchor.attr('href')).toEqual(`#/stops/${$scope.stop.code}?number=${$scope.stop.number}`);
    });
})
