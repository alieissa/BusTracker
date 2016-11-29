'use strict';

stopsConfig.$inject = ['$routeProvider'];

function stopsConfig($routeProvider) {

    $routeProvider
        // Get all stops
        .when('/stops', {
            template: '<ae-stops></ae-stops>',
        })

        // Show next 3 next trips for all routes serving stop number 'stopNo'
        .when('/stops/:code', {
            template: '<ae-stop-next-trips></ae-stop-next-trips>'
        });
}

export {stopsConfig};
