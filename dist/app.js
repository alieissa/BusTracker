(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * @ngdoc overview
 * @name busTrackerApp
 * @description
 * # busTrackerApp
 *
 * Main module of the application.
 */

var _routesModule = require('./routes/routes.module.js');

var _stopsModule = require('./stops/stops.module.js');

var _SQLiteModule = require('./common/SQLite.module.js');

angular.module('busTrackerApp', ['firebase', 'ngRoute', 'routesMod', 'stopsMod', 'SQLiteMod']).config(config).controller('FavesCtrl', FavesCtrl).controller('MainCtrl', MainCtrl);

function config($routeProvider, $httpProvider) {

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];

  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    controllerAs: 'main'
  }).when('/favourites', {
    templateUrl: 'views/favourites.html',
    controller: 'FavesCtrl',
    controllerAs: 'faves',
    resolve: {
      faveRoutes: function faveRoutes(dataService) {
        return dataService.getFaveRoutes();
      },

      faveStops: function faveStops(dataService) {
        return dataService.getFaveStops();
      }
    }
  }).otherwise({
    redirectTo: '/'
  });
}

function FavesCtrl(faveRoutes, faveStops) {

  var vm = this;

  vm.routes = faveRoutes;
  vm.stops = faveStops;
}

function MainCtrl($rootScope) {

  $rootScope.$on('$routeChangeError', function (event, prev, next) {
    console.log('Gotcha');
    console.log(event);
    console.log(prev);
    console.log(next);
  });
}

},{"./common/SQLite.module.js":2,"./routes/routes.module.js":7,"./stops/stops.module.js":12}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
angular.module('SQLiteMod', []).constant('DATABASE', 'octranspo').factory('dataService', dataService);

function dataService(DATABASE, $q) {

	var db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB

	var dataService = {
		addFaveStop: addFaveStop,
		getRouteFaveStatus: getRouteFaveStatus,
		setRouteFaveStatus: setRouteFaveStatus,
		getFaveRoutes: getFaveRoutes,
		getFaveStops: getFaveStops,
		getAllRoutes: getAllRoutes,
		getAllStops: getAllStops,
		getRouteStops: getRouteStops
	};

	return dataService;

	function getAllRoutes() {

		var defer = $q.defer();

		db.transaction(handleRoutesResult, handleRoutesError);

		function handleRoutesResult(tx) {

			var routes = [];

			tx.executeSql('SELECT * FROM routes', [], function (tx, result) {

				for (var i = 0; i < result.rows.length; i++) {
					routes.push(result.rows.item(i));
				}

				defer.resolve(routes);
				return;
			});
		}

		function handleRoutesError(tx, error) {

			defer.reject(error);
			return;
		}

		return defer.promise;
	}

	function getAllStops() {
		// Get all stops

		var defer = $q.defer();

		db.transaction(handleStopsResult, handleStopsError);

		function handleStopsResult(tx) {

			var stops = [];

			tx.executeSql('SELECT * FROM stops LIMIT 500', [], function (tx, result) {
				for (var i = 0; i < result.rows.length; i++) {
					stops.push(result.rows.item(i));
				}

				defer.resolve(stops);
				return;
			});
		}

		function handleStopsError(tx, error) {
			defer.reject(error);
			return;
		}

		return defer.promise;
	}

	// Get bus stops for bus 'routeName'
	function getRouteStops(routeName) {

		var defer = $q.defer();

		db.transaction(handleRouteStopsResult, handleRouteStopsError);

		function handleRouteStopsResult(tx) {

			var stops = [];

			tx.executeSql('SELECT stops FROM routes WHERE name = ?', [routeName], function (tx, result) {

				var stopsString = result.rows.item(0).stops;
				stops = stopsString.split('\t');

				// stops number and name are both in a long space separated string
				stops = stops.map(function (stop) {
					return {
						number: stop.split(' ')[0],
						name: stop.split(' ').slice(1).join(' ')
					};
				});

				defer.resolve(stops);
				return;
			});
		}

		function handleRouteStopsError(tx, error) {

			defer.reject(error);
			return;
		}

		return defer.promise;
	}

	function setRouteFaveStatus(route, status) {

		var defer = $q.defer();

		// Add route to db
		db.transaction(handleFaveRouteResult, handleFaveRouteError);

		function handleFaveRouteResult(tx) {

			tx.executeSql('UPDATE routes SET favourite = ? WHERE name = ?', [status, route], function (tx, result) {
				console.log(result);
				return defer.resolve(result.rows);
			});
		}

		function handleFaveRouteError(tx, error) {
			defer.reject(error);
		}

		return defer.promise;
	}

	function getRouteFaveStatus(route) {

		var defer = $q.defer();

		db.transaction(handleFaveRouteResult, handleFaveRouteError);

		function handleFaveRouteResult(tx) {
			tx.executeSql('SELECT favourite FROM routes WHERE name = ?', [route], function (tx, result) {
				return defer.resolve(result.rows.item(0).favourite);
			});

			return;
		}

		function handleFaveRouteError(tx, error) {

			defer.reject(error);

			return;
		}

		return defer.promise;
	}

	function addFaveStop(stop) {
		// Add route to db
	}
	function getFaveRoutes() {

		var defer = $q.defer();

		// Get fave route
		db.transaction(handleFaveRoutesResult, handleFaveRoutesError);

		function handleFaveRoutesResult(tx) {

			var faves = [];

			tx.executeSql('SELECT * FROM routes WHERE favourite = 1', function (tx, result) {
				for (var i = 0; i < result.rows.length; i++) {
					faves.push(result.rows.item(i));
				}

				defer.resolve(faves);
			});
		}

		function handleFaveRoutesError(tx, error) {
			defer.reject(error);
		}
	}

	function getFaveStops() {
		// Get fave stop
	}
}

exports.default = angular.module('SQLiteMod');

},{}],3:[function(require,module,exports){
'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the busTrackerApp
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
RouteCtrl.$inject = ['routes', '$routeParams', '$timeout', 'stopsList', 'faveStatus', 'setFaveStatus'];

function RouteCtrl(routes, $routeParams, $timeout, stopsList, faveStatus, setFaveStatus) {

  var vm = this;

  vm.routeName = $routeParams.routename;
  vm.routeNo = vm.routeName.split(' ')[0]; //smelly
  vm.stops = stopsList;
  vm.faveStatus = faveStatus;

  // Handler of Favourite button click events in route.html template
  vm.setFaveStatus = function (routeName) {
    //toggle fave status according to fave btn clicks
    vm.faveStatus = vm.faveStatus === 1 ? 0 : 1;
    setFaveStatus(routeName, vm.faveStatus);
  };
}

exports.RouteCtrl = RouteCtrl;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
RouteStopDetailCtrl.$inject = ['routeStopDetails'];

function RouteStopDetailCtrl(routeStopDetails) {

  var vm = this;

  vm.showError = routeStopDetails.Error === '' ? false : true;
  vm.error = routeStopDetails.Error;

  vm.routeStopDetails = routeStopDetails;
}

exports.RouteStopDetailCtrl = RouteStopDetailCtrl;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
routesConfig.$inject = ['$routeProvider'];

function routesConfig($routeProvider) {

  $routeProvider.when('/routes', {
    templateUrl: 'views/routes.html',
    controller: 'RoutesCtrl',
    controllerAs: 'routes',
    resolve: {
      routesList: function routesList(routes, dataService) {
        return dataService.getAllRoutes();
      }
    }
  }).when('/routes/:routename', {

    templateUrl: 'views/route.html',
    controller: 'RouteCtrl',
    controllerAs: 'route',
    resolve: {
      stopsList: function stopsList($route, dataService) {

        var routeName = $route.current.params.routename;
        return dataService.getRouteStops(routeName);
      },

      faveStatus: function faveStatus($route, dataService) {

        var routeName = $route.current.params.routename;
        return dataService.getRouteFaveStatus(routeName);
      },

      setFaveStatus: function setFaveStatus(dataService) {
        return dataService.setRouteFaveStatus;
      }
    }
  }).when('/routes/:routename/:stopNo', {
    templateUrl: 'views/routestops.html',
    controller: 'RouteStopDetailCtrl',
    controllerAs: 'routeStops',
    resolve: {
      routeStopDetails: function routeStopDetails(routes, $route) {

        var routeName = $route.current.params.routename;
        var stopNo = $route.current.params.stopNo;

        return routes.getNextTrips(routeName, stopNo);
      }
    }
  }).when('/routes/:routeNo/:stopNo/error', {
    templateUrl: 'views/error.html',
    controller: 'ErrorCtrl',
    controllerAs: 'error'
  });
}

exports.routesConfig = routesConfig;

},{}],6:[function(require,module,exports){
'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RoutesCtrl
 * @description
 * # RoutesCtrl
 * Controller of the busTrackerApp
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
RoutesCtrl.$inject = ['routesList'];

function RoutesCtrl(routesList) {

  var vm = this;

  vm.routesList = [];
  vm.routesList = routesList;
}

exports.RoutesCtrl = RoutesCtrl;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SQLiteModule = require('../common/SQLite.module.js');

var _routesController = require('./routes.controller.js');

var _routeDetailController = require('./route-detail.controller.js');

var _routeStopDetailController = require('./route-stop-detail.controller.js');

var _routesService = require('./routes.service.js');

var _routesConfig = require('./routes.config.js');

angular.module('routesMod', ['firebase', 'ngRoute', 'SQLiteMod']).config(_routesConfig.routesConfig).controller('RoutesCtrl', _routesController.RoutesCtrl).controller('RouteCtrl', _routeDetailController.RouteCtrl).controller('RouteStopDetailCtrl', _routeStopDetailController.RouteStopDetailCtrl).service('routes', _routesService.routes);

exports.default = angular.module('routesMod');

},{"../common/SQLite.module.js":2,"./route-detail.controller.js":3,"./route-stop-detail.controller.js":4,"./routes.config.js":5,"./routes.controller.js":6,"./routes.service.js":8}],8:[function(require,module,exports){
'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.routes
 * @description
 * # routes
 * Factory in the busTrackerApp.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = routes;
routes.$inject = ['$http'];

function routes($http) {

  var Routes = {
    getNextTrips: getNextTrips
  };

  return Routes;

  function getNextTrips(routeNo, stopNo) {

    var OCCONFIG = window._env.OC;

    var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    var url = 'https://api.octranspo1.com/v1.2/GetNextTripsForStop';
    var data = 'appID=' + OCCONFIG.APP_ID + '&apiKey=' + OCCONFIG.API_KEY + '&stopNo=' + stopNo + '&routeNo=' + routeNo + '&format=json';

    return $http.post(url, data, headers).then(getNextTripsComplete);

    function getNextTripsComplete(response) {
      var tripsRes = response.data.GetNextTripsForStopResult;

      // if RouteDirection value is not an array make it one
      if (typeof tripsRes.Route.RouteDirection !== 'undefined' && !Array.isArray(tripsRes.Route.RouteDirection)) {
        tripsRes.Route.RouteDirection = [tripsRes.Route.RouteDirection];
      }
      return tripsRes;
    }
  }
}

},{}],9:[function(require,module,exports){
'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopCtrl
 * @description
 * # StopCtrl
 * Controller of the busTrackerApp
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
StopCtrl.$inject = ['$routeParams', 'stopRouteSummary'];

function StopCtrl($routeParams, stopRouteSummary) {

  var vm = this;

  vm.stopNo = $routeParams.stopNo;
  vm.showError = stopRouteSummary.Error !== '';
  vm.routes = vm.showError ? [] : stopRouteSummary.Routes;
  vm.stopDescription = stopRouteSummary.StopDescription;
}

exports.StopCtrl = StopCtrl;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
stopsConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function stopsConfig($routeProvider, $firebaseRefProvider) {

  $routeProvider.when('/stops', {
    templateUrl: 'views/stops.html',
    controller: 'StopsCtrl',
    controllerAs: 'stops',
    resolve: {
      stopsList: function stopsList(stops, dataService) {
        return dataService.getAllStops();
        // return stops.getAll().$loaded();
      }
    }
  }).when('/stops/:stopNo', {
    templateUrl: 'views/stop.html',
    controller: 'StopCtrl',
    controllerAs: 'stop',
    resolve: {
      stopRouteSummary: function stopRouteSummary(stops, $route) {
        var stopNo = $route.current.params.stopNo;
        return stops.getRouteSummary(stopNo);
      }
    }
  });
}

exports.stopsConfig = stopsConfig;

},{}],11:[function(require,module,exports){
'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopsCtrl
 * @description
 * # StopsCtrl
 * Controller of the busTrackerApp
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
StopsCtrl.$inject = ['stopsList'];

function StopsCtrl(stopsList) {

  var vm = this;

  vm.stopsList = stopsList;
}

exports.StopsCtrl = StopsCtrl;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SQLiteModule = require('../common/SQLite.module.js');

var _stopsController = require('./stops.controller.js');

var _stopDetailController = require('./stop-detail.controller.js');

var _stopsService = require('./stops.service.js');

var _stopsConfig = require('./stops.config.js');

angular.module('stopsMod', ['ngRoute', 'firebase', 'SQLiteMod']).config(_stopsConfig.stopsConfig).controller('StopsCtrl', _stopsController.StopsCtrl).controller('StopCtrl', _stopDetailController.StopCtrl).service('stops', _stopsService.stops);

exports.default = angular.module('stopsMod');

},{"../common/SQLite.module.js":2,"./stop-detail.controller.js":9,"./stops.config.js":10,"./stops.controller.js":11,"./stops.service.js":13}],13:[function(require,module,exports){
'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */

// import {OCData} from '../../util/OCData.js';

Object.defineProperty(exports, "__esModule", {
  value: true
});
stops.$inject = ['$http'];

function stops($http) {

  var Stops = {
    getRouteSummary: getRouteSummary
  };

  return Stops;

  function getRouteSummary(stopNo) {

    // Content-Type must be x-www-form-urlencoded. Tried with JSON
    // but OC Transpo returns error (weird)
    var OCCONFIG = window._env.OC;
    var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    var url = 'https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes';
    var data = 'appID=' + OCCONFIG.APP_ID + '&apiKey=' + OCCONFIG.API_KEY + '&stopNo=' + stopNo + '&format=json';

    return $http.post(url, data, headers).then(getRouteSummaryComplete);

    function getRouteSummaryComplete(response) {

      var result = response.data.GetRouteSummaryForStopResult;

      if (result.Error !== '') {
        return result;
      }

      if (Array.isArray(result.Routes) && result.Routes.length === 0) {
        result.Error = '15';
        return result;
      }
      if (typeof result.Routes.Route !== 'undefined' && !Array.isArray(result.Routes.Route)) {
        result.Routes.Route = [result.Routes.Route];
      }

      result = {
        'Error': result.Error,
        'Routes': result.Routes.Route,
        'StopDescription': result.StopDescription,
        'StopNo': result.StopNo

      };

      result.Routes.forEach(function (route) {
        if (Array.isArray(route.Trips)) {
          return;
        } else if (typeof route.Trips === 'undefined') {
          route.Trips = [];
        } else {
          route.Trips = [route.Trips];
        }
      });

      //   return OCData.sortRoutesByTrips(result.Routes);
      return result;
    }
  }
}

exports.stops = stops;

},{}]},{},[1]);
