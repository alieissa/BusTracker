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
    .when('/routes/:routename', {

      templateUrl: 'views/route.html',
      controller: 'RouteCtrl',
      controllerAs: 'route',
      resolve: {
        stopsList: ($route, dataService) => {

          let routeName = $route.current.params.routename;
          return dataService.getRouteStops(routeName)
        },

        faveStatus: ($route, dataService) => {

          let routeName = $route.current.params.routename;
          return dataService.getRouteFaveStatus(routeName);
        },

        setFaveStatus: (dataService) => {
          return dataService.setRouteFaveStatus;
        }
    }
    })
    .when('/routes/:routename/:stopNo', {
      templateUrl: 'views/routestops.html',
      controller: 'RouteStopDetailCtrl',
      controllerAs: 'routeStops',
      resolve: {
        routeStopDetails: function(routes, $route){

          let routeName = $route.current.params.routename;
          let stopNo = $route.current.params.stopNo;

          return routes.getNextTrips(routeName, stopNo);
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
