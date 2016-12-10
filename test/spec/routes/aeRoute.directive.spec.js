describe('Directive: <ae-route></ae-route>', function() {

    let $compile, $scope;
    let aeRoute, anchor, icon;
    
    let _inject = (_$compile_,  _$q_, _$rootScope_, _dBService_) => {

        $scope = _$rootScope_.$new();
        $scope.route = {name: "Ottawa-Rockliffe", number: "1", id: 4, favourite: 1};

        aeRoute = _$compile_(angular.element('<ae-route data-route="route"></ae-route>'))($scope);
        $scope.$digest();

        anchor = angular.element(aeRoute).find('a');
        icon = angular.element(aeRoute).find('i');
    };

    beforeEach(module('busTrackerApp'));
    beforeEach(module('partials/route.directive.html'));
    beforeEach(inject(_inject));

    it('$scope.route.favourite = 1 should set icon text to  star', () => {
        expect(icon.text()).toEqual('star')
    });

    it('$scope.route.favourite = 0 should re-set icon text to star_border', () => {

        $scope.route.favourite = 0;
        $scope.$apply();

        expect(icon.text()).toEqual('star_border');
    });

    it('Should set anchor text to "route.number route.name"', () => {
        expect(anchor.text()).toEqual(`${$scope.route.number} ${$scope.route.name}`);
    });

    it('Should set route detail link to /routes/4?name="Ottawa-Rockliffe"', () => {
        expect(anchor.attr('href')).toEqual(`#/routes/${$scope.route.id}?name=${$scope.route.name}`);
    });
})
