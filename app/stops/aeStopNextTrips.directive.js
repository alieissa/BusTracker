'use strict';

aeStopNextTrips.$inject = ['$location', '$route', 'dBService', 'oCService'];
stopNextTripsCtrl.$inject = ['$routeParams', '$location', 'dBService', 'oCService'];

function aeStopNextTrips() {

    let aeStopNextTrips = {
        template:
            '<ae-tall-menu-bar title-heading="{{stopNextTrips.stop.number}}" title={{stopNextTrips.stop.name}} icon="arrow_back">' +
            '</ae-tall-menu-bar>' +
            '<ae-route-trips-card ng-repeat="route in stopNextTrips.routes" data-route="route" trips="route.Trips">' +
            '</ae-route-trips-card>' +
            '<div ng-show="stopNextTrips.routes.length === 0"> No trips scheduled for this stop</div>',

        scope: {},
        controller: stopNextTripsCtrl,
        controllerAs: 'stopNextTrips',
        // link: link
    };

    return aeStopNextTrips;

    // function link() {}
 }

function stopNextTripsCtrl($routeParams, $location, dBService, oCService) {
    let vm = this;

    // stop number from the URL
    let code = $routeParams.code;
    let number = ($location.search()).number;

    // Get stop information from database in an array
    dBService.get('stops', {code: code}).then((stop) => vm.stop = stop[0]);

    // Get next 3 trips for routes serving stop
    oCService.getNextTrips(number).then((result) => {

        // An error field is always present in trip information
        vm.error = result.error;

        // Array of routes with each route containing array of 3 trips
        vm.routes = result.routes;
    });
}


function nextTripsError() {

    let nextTripsError = {
        templateUrl: 'partials/next-trips-error.html',
    };

    return nextTripsError;
}

export {aeStopNextTrips,stopNextTripsCtrl, nextTripsError};
