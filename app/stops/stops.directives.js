'use strict';

aeStop.inject = ['dBService'];
aeStops.inject = ['dBService'];
aeStopNextTrips.inject = ['$route', 'dBService', 'OCService '];

function aeStops(dBService) {

    let aeStops = {
        template:
            '<ae-menu-bar icon="menu" title="Stops" search="stops.search"></ae-menu-bar>' +
            '<ae-stop ng-repeat="stop in stops.stops  | limitTo: stops.displayLimit | filter: {number: stops.search}" track by stop.number ' +
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

        // Number of stops to display
        vm.displayLimit = 90;

        // Get all stops
        dBService.get('stops').then((stops) => vm.stops = stops);

        // Look for user scrolling
        angular.element($window).scroll(handleScroll);

        // When user scrolls increase displayed stops by 10
        function handleScroll() {

            if(vm.displayLimit > vm.stops.length) {
                return;
            }
            vm.displayLimit = vm.displayLimit + 10;
            // I know, tried very hard to get rid of $scope
            $scope.$apply();
        }
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
        templateUrl: 'partials/stop.directive.html',
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
            dBService.set('stops', {favourite:_favourite}, {code: scope.stop.code}).then(updateStop);
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

function aeStopNextTrips($location, $route, dBService, OCService ) {

    let aeStopNextTrips = {
        template:
            '<ae-tall-menu-bar title-heading="{{stopNextTrips.stop.number}}" title={{stopNextTrips.stop.name}} icon="arrow_back">' +
            '</ae-tall-menu-bar>' +
            '<ae-route-trips-card ng-repeat="route in stopNextTrips.routes" data-route="route" trips="route.Trips">' +
            '</ae-route-trips-card>' +
            '<div ng-show="stopNextTrips.routes.length === 0"> No trips scheduled for this stop</div>',

        scope: {},
        controller: controller,
        controllerAs: 'stopNextTrips',
        // link: link
    };

    return aeStopNextTrips;

    function controller() {

        let vm = this;

        // stop number from the URL
        let code = $route.current.params.code;
        let number = ($location.search()).number
        console.log(code)
        console.log($location.search());

        // Get stop information from database in an array
        dBService.get('stops', {code: code}).then((stop) => vm.stop = stop[0]);

        // Get next 3 trips for routes serving stop
        OCService.getNextTrips(number).then((result) => {

            // An error field is always present in trip information
            vm.error = result.error;

            // Array of routes with each route containing array of 3 trips
            vm.routes = result.routes;
            console.log(vm.routes);
        })
    }

    // function link() {}
 }

function nextTripsError() {

    let nextTripsError = {
        templateUrl: 'partials/next-trips-error.html',
    }

    return nextTripsError;
}

export {aeStop, aeStops, aeStopNextTrips, nextTripsError};
