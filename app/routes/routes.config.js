'use strict';

routesConfig.$inject = ['$routeProvider'];

function routesConfig($routeProvider) {

    $routeProvider
    .when('/routes', {
        templateUrl: 'views/routes.html',
        controller: 'RoutesCtrl',
        controllerAs: 'routes',
        resolve: {
          routesList: (routesService) => routesService.getAll()
        }
    })
    .when('/routes/:number', {

        templateUrl: 'views/route.html',
        controller: 'RouteCtrl',
        controllerAs: 'route',
        resolve: {
            setFaveStatus: (routesService) => routesService.setFaveStatus,
            details: ($location, routesService) => {

              let name = ($location.search()).name;
              return routesService.getStops(name)
            }
        }
    })
    .when('/routes/:number/:stopNo', {
        templateUrl: 'views/routestops.html',
        controller: 'RouteStopDetailCtrl',
        controllerAs: 'routeStops',
        resolve: {
            getFaveStatus: (stopsService) => stopsService.getFaveStatus,
            setFaveStatus: (stopsService) => stopsService.setFaveStatus,
            details: ($route, $location, routesService) => {

              let name = ($location.search()).name;
              let number = $route.current.params.number;
              let stopNo = $route.current.params.stopNo;
              return routesService.getNextTrips(name, number, stopNo);
            }
        }
    })
    .when('/routes/:routeNo/:stopNo/error', {
        templateUrl: 'views/error.html',
        controller: 'ErrorCtrl',
        controllerAs: 'error'
    });

}

export {routesConfig};
