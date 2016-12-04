'use strict';

aeStopNextTrips.$inject = ['$location', '$route', 'dBService', 'OCService'];

function aeStopNextTrips() {

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

    function controller($location, $route, dBService, OCService) {

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

export {aeStopNextTrips, nextTripsError};
