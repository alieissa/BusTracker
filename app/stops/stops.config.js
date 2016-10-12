angular
  .module('stopsMod')
  .config(stopsConfig)

function stopsConfig($routeProvider, $firebaseRefProvider) {
  $routeProvider
    .when('/stops', {
      templateUrl: 'views/stops.html',
      controller: 'StopsCtrl',
      controllerAs: 'stops',
      resolve: {
        stopsList: function(stops) {
          return stops.getAll().$loaded();
        }
      }
    })
    .when('/stops/:stopNo', {
      templateUrl: 'views/stop.html',
      controller: 'StopCtrl',
      controllerAs: 'stop'
    });
}
