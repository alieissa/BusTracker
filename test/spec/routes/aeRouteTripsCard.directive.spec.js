'use strict';

describe('Directive: <ae-route-trips-card></ae-route-trips-card>', function() {

    let $scope;
    let aeRouteTripsCard, tripTimes, listItems, RouteHeading, icons;

    let _inject = (_$compile_, _$rootScope_, _dBService_) => {

        $scope = _$rootScope_.$new();
        $scope.trips = ROUTE_TRIPS[0].Trips;
        $scope.route = {
            "RouteNo":107,
            "DirectionID":1,
            "Direction":"Southbound",
            "RouteHeading":"South Keys"
        }

        let template = angular.element('<ae-route-trips-card route="route" trips="trips"></ae-route-trips-card>');
        aeRouteTripsCard = _$compile_(template)($scope);
        $scope.$digest();

        listItems = angular.element(aeRouteTripsCard).find('li');
        icons = angular.element(aeRouteTripsCard).find('i');
    };

    beforeEach(module('busTrackerApp'));
    beforeEach(module('partials/route-trips-card.html'));
    beforeEach(inject(_inject));

    it('Should create 3 icons', () => {
        expect(icons.length).toEqual(3);
    });

    it('Should create 3 trip time li elements', () => {

        let triplistItemsLength = 0;
        listItems.each(function() {
            if($(this).hasClass('trip')) {
                triplistItemsLength += 1;
            }
        });

        expect(triplistItemsLength).toEqual(3)
    });


    it('Should set trip card text block to "route.number route.name"', () => {

        listItems.each(function() {
            if($(this).hasClass('route-heading')) {
                expect($(this).text()).toEqual(`${$scope.route.RouteNo} ${$scope.route.RouteHeading}`);
            }
        });
    });

    it('Should no show any times for when no trips scheduled', () => {

        let hiddenTripTimesLiength = 0;

        $scope.route = ROUTE_TRIPS[1];
        $scope.trips = [];
        $scope.$digest();

        listItems.each(function() {
            if($(this).hasClass('ng-hide') && $(this).hasClass('trip')) {
                hiddenTripTimesLiength += 1;
            }
        });

        expect(hiddenTripTimesLiength).toEqual(3);
    });
})
