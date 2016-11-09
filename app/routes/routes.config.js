'use strict';

routesConfig.$inject = ['$routeProvider'];

function routesConfig($routeProvider) {
  
  $routeProvider
    .when('/routes', {
      templateUrl: 'views/routes.html',
      controller: 'RoutesCtrl',
      controllerAs: 'routes',
      resolve: {
        routesList: (routes, dataService) => {
          return dataService.getAllRoutes();
        }
      }
    })
    .when('/routes/:number', {

      templateUrl: 'views/route.html',
      controller: 'RouteCtrl',
      controllerAs: 'route',
      resolve: {
        details: ($location, dataService) => {

          // get route name form query string
          let name = ($location.search()).name; 
          return dataService.getRouteStops(name)
        },

        setFaveStatus: (dataService) => {
          return dataService.setRouteFaveStatus;
        }
    }
    })
    .when('/routes/:number/:stopNo', {
      templateUrl: 'views/routestops.html',
      controller: 'RouteStopDetailCtrl',
      controllerAs: 'routeStops',
      resolve: {
        details: function(routes, $route, $location){

          // route number
          let name = ($location.search()).name;
          let number = $route.current.params.number;
          let stopNo = $route.current.params.stopNo;

          return routes.getNextTrips(name, number, stopNo);
        },
        getFaveStatus: (dataService) => dataService.getStopFaveStatus,
        setFaveStatus: (dataService) => dataService.setStopFaveStatus
      }
    })
    .when('/routes/:routeNo/:stopNo/error', {
      templateUrl: 'views/error.html',
      controller: 'ErrorCtrl',
      controllerAs: 'error'
    });

}

export {routesConfig};
