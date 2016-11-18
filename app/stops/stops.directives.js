'use strict';

function nextTripsError() {

    let nextTripsError = {
        templateUrl: '/views/next-trips-error.html',
    }

    return nextTripsError;
}

function nextTrips() {

    let nextTrips = {
        templateUrl: '/views/next-trips.html',
        scope: {
            route: '=',
            trips: '='
        },
        link: (scope, element, attrs) => {
            angular.element('.material-icons').click(() => {
                console.log('Clicked icon ');
            })
            console.log('Next trips link function');
        }
    };

    return nextTrips;
}

export {nextTrips, nextTripsError};
