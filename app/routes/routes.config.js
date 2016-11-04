'use strict';

routesConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function routesConfig($routeProvider, $firebaseRefProvider) {
  
  $routeProvider
    .when('/routes', {
      templateUrl: 'views/routes.html',
      controller: 'RoutesCtrl',
      controllerAs: 'routes',
      resolve: {
        routesList: function(routes, dataService) {
          return dataService.getAllRoutes();
          // return routes.getAll().$loaded();
        }
      }
    })
    .when('/routes/:routename', {
      templateUrl: 'views/route.html',
      controller: 'RouteCtrl',
      controllerAs: 'route'
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
