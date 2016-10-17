
routesConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function routesConfig($routeProvider, $firebaseRefProvider) {
  $routeProvider
    .when('/routes', {
      templateUrl: 'routes/views/routes.html',
      controller: 'RoutesCtrl',
      controllerAs: 'routes',
      resolve: {
        routesList: function(routes) {
          return routes.getAll().$loaded();
        }
      }
    })
    .when('/routes/:routename', {
      templateUrl: 'routes/views/route.html',
      controller: 'RouteCtrl',
      controllerAs: 'route'
    })
    .when('/routes/:routename/:stopNo/*', {
      templateUrl: 'views/routestops.html',
      controller: 'RoutestopsCtrl',
      controllerAs: 'routeStops',
      resolve: {
        trips: function(routes, $http, $location, $q, $route, $timeout) {
          // var deferred = $q.defer();

          var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStop";
          var routename = $route.current.params.routename;
          var stopNo = $route.current.params.stopNo;
          var data = "appID=c618159f&apiKey=77207661c5c94208c33fb2357efc7012&routeNo="+routename+"&stopNo="+ stopNo +"&format=json";
          var headers = {headers: { "Content-Type": "application/x-www-form-urlencoded"}};

          $http.post(url, data, headers)
            .then(function(response) {
              var error = response.data.GetNextTripsForStopResult.Error
              if(error !== "") {
                $location.path('/routes/' + routename + '/' + stopNo + '/error');
                // deferred.reject({
                //   error: error,
                //   message: "Error message"
                // });
              }
            });

          // return deferred.promise;
        }
      }
    })
    .when('/routes/:routeNo/:stopNo/error', {
      templateUrl: 'views/error.html',
      controller: 'ErrorCtrl',
      controllerAs: 'error'
    })
}

export {routesConfig}
