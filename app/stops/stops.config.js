'use strict';

stopsConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function stopsConfig($routeProvider, $firebaseRefProvider) {
  $routeProvider
    .when('/stops', {
      templateUrl: 'views/stops.html',
      controller: 'StopsCtrl',
      controllerAs: 'stops',
      resolve: {
        stopsList: function(stops, dataService) {
          dataService.getAllStops();
          // return stops.getAll().$loaded();
        }
      }
    })
    .when('/stops/:stopNo', {
      templateUrl: 'views/stop.html',
      controller: 'StopCtrl',
      controllerAs: 'stop',
      resolve: {
        stopRouteSummary: function (stops, $route) {
          let stopNo = $route.current.params.stopNo;
          return stops.getRouteSummary(stopNo);
        }
      }
    });

}

export {stopsConfig};
