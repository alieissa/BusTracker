'use strict';

stopsConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function stopsConfig($routeProvider, $firebaseRefProvider) {
  $routeProvider
    .when('/stops', {
      templateUrl: 'stops/views/stops.html',
      controller: 'StopsCtrl',
      controllerAs: 'stops',
      resolve: {
        stopsList: function(stops) {
          return stops.getAll().$loaded();
        }
      }
    })
    .when('/stops/:stopNo', {
      templateUrl: 'stops/views/stop.html',
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
