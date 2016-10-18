// angular
//   .module('stopsMod')
//   .config(stopsConfig)
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
      controllerAs: 'stop'
    });
}

export {stopsConfig}
