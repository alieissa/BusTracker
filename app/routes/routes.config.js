'use strict';

routesConfig.$inject = ['$routeProvider'];

function routesConfig($routeProvider) {

    $routeProvider
        // Get all routes
        .when('/routes', {
            template: '<ae-routes></ae-routes>'
        })

        // Get all stops for bus number 'number'
        .when('/routes/:id', {
            template: '<ae-route-details></ae-route-details>',
        })
}

export {routesConfig};
