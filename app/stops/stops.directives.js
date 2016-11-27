'use strict';

aeStop.inject = ['dBService'];
aeStops.inject = ['dBService'];
aeStopNextTrips.inject = ['$route', 'dBService', 'stopsService'];

function aeStops(dBService) {

    let aeStops = {
        template: '<ae-menu-bar icon="menu" title="Stops" search="stops.search"></ae-menu-bar>' +
        '<ae-stop ng-repeat="stop in stops.stops  | limitTo: stops.limit | filter: {number: stops.search}" track by stop.number ' +
        'data-stop="stop"></ae-stop>',
        scope: {},
        controller: controller,
        bindToController: true,
        controllerAs: 'stops',
        link: link
    };

    return aeStops;

    function controller($scope, $window) {

        let vm = this;
        vm.limit = 90;
        vm.display = [];
        angular.element($window).scroll(() => {
            // vm.limit = vm.limit + 50;
            // alert('Scrolling')
            if(vm.display.length < vm.stops.length) {
                let nextPage = vm.stops.slice(vm.display.length, vm.display.length + 20);
                // console.log(nextPage);
                vm.display = [...vm.display, ...nextPage];
                vm.limit = vm.limit + 10;
                // console.log(vm.display.length);
                $scope.$apply();
            }

            // console.log('Scrolling');
        });
        dBService.get('stops').then((stops) => {
            vm.stops = stops;
            vm.display = vm.stops.slice(0, 20);
        });

    }

    function link(scope, element, attrs) {
        // angular.element(window).scroll(() => {
        //     scope.stops.limit = scope.stops.limit + 50;
        //     console.log(scope.stops.limit);
        //     console.log('Scrolling');
        // });
    }
}

function aeStop(dBService) {

    let aeStop = {
        templateUrl: 'views/stop.directive.html',
        scope: {
            stop: '='
        },
        // controller: controller,
        controllerAs: 'stop',
        link: link
    }

    return aeStop;

    // function controller() {}

    function link(scope, element, attrs) {

        let star = element.find('i.star');

        star.on('click', handleStarTouch);

        function handleStarTouch() {

            let _favourite = scope.stop.favourite === 0 ? 1 : 0;
            dBService.set('stops', {favourite:_favourite}, {number: scope.stop.number}).then(updateStop);
        }

        function updateStop(result) {

            // toggle favourite status
            scope.stop.favourite = scope.stop.favourite === 0 ? 1 : 0;

            // Set the favourite status indicator
            let starType = scope.stop.favourite === 0 ? 'star_border' : 'star';
            star.text(starType);
        }
    }
}

function aeStopNextTrips($route, dBService, stopsService) {

    let aeStopNextTrips = {
        template: '<ae-tall-menu-bar title-heading="{{stopNextTrips.stop.number}}" title={{stopNextTrips.stop.name}} icon="arrow_back"></ae-tall-menu-bar>' +
        '<ae-route-trips-card ng-repeat="route in stopNextTrips.routes" data-route="route" trips="route.Trips"></ae-route-trips-card>',
        scope: {},
        controller: controller,
        controllerAs: 'stopNextTrips',
        // link: link
    };

    return aeStopNextTrips;

    function controller() {

        let vm = this;

        // stop number from the URL
        let stopNo = $route.current.params.stopNo;

        // Get stop information from database in an array
        dBService.get('stops', {number: stopNo}).then((stop) => vm.stop = stop[0]);

        // Get next 3 trips for routes serving stop
        stopsService.getNextTrips(stopNo).then((result) => {

            // An error field is always present in trip information
            vm.error = result.error;

            // Array of routes with each route containing array of 3 trips
            vm.routes = result.routes;
        })
    }

    // function link() {}
 }

function nextTripsError() {

    let nextTripsError = {
        templateUrl: '/views/next-trips-error.html',
    }

    return nextTripsError;
}

export {aeStop, aeStops, aeStopNextTrips, nextTripsError};
