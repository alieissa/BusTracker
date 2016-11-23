'use strict';

routesConfig.$inject = ['$routeProvider'];

function routesConfig($routeProvider) {

    $routeProvider.when('/routes', {
        template: '<ae-routes></ae-routes>'
    })
    .when('/routes/:number', {

        templateUrl: 'views/route-details.view.html',
        controller: 'RouteCtrl',
        controllerAs: 'route',
        resolve: {
            setFaveStatus: (dBService) => dBService.set,
            routeDetails: ($location, dBService) => {

                let name = ($location.search()).name; //from query string
                return dBService.getStops({name: name});
            }
        }
    })
}

export {routesConfig};
