'use strict';

routesConfig.$inject = ['$routeProvider'];

function routesConfig($routeProvider) {

    $routeProvider.when('/routes', {
        templateUrl: 'views/routes.html',
        controller: 'RoutesCtrl',
        controllerAs: 'routes',
        resolve: {
          routesList: (dBService) => dBService.get('routes')
        }
    })
    .when('/routes/:number', {

        templateUrl: 'views/route.html',
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
