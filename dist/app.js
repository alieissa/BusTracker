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

angular.module('busTrackerApp', ['firebase', 'ngRoute', 'routesMod', 'stopsMod', 'SQLiteMod']).config(config).constant('config', { OC_URL: 'http://localhost:3000/v1.2' }).controller('FavesCtrl', FavesCtrl).controller('MainCtrl', MainCtrl);

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
		getRouteFaveStatus: getRouteFaveStatus,
		setRouteFaveStatus: setRouteFaveStatus,
		getStopFaveStatus: getStopFaveStatus,
		setStopFaveStatus: setStopFaveStatus,
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

	// Get bus stops for bus 'routeName'
	function getRouteStops(name) {

		var defer = $q.defer();

		db.transaction(handleRouteStopsResult, handleRouteStopsError);

		function handleRouteStopsResult(tx) {

			var stops = [];

			tx.executeSql('SELECT * FROM routes WHERE name = ?', [name], function (tx, result) {

				var data = result.rows.item(0);

				stops = data.stops.split('\t');

				// stops number and name are both in a long space separated string
				stops = stops.map(function (stop) {
					return {
						number: stop.split(' ')[0],
						name: stop.split(' ').slice(1).join(' ')
					};
				});

				data.stops = stops;
				data.favourite = parseInt(data.favourite); //SQLite returns float
				defer.resolve(data);
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
		db.transaction(handleFaveRouteResult, function (tx, result) {
			return defer.reject(error);
		});

		function handleFaveRouteResult(tx) {

			tx.executeSql('UPDATE routes SET favourite = ? WHERE name = ?', [status, route], function (tx, result) {
				console.log(result);
				return defer.resolve(result.rows);
			});
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

	function getStopFaveStatus(stopNo) {
		var defer = $q.defer();

		db.transaction(handleDb, function (tx, error) {
			return defer.reject(error);
		});

		function handleDb(tx) {
			tx.executeSql('SELECT favourite FROM stops WHERE number = ?', [stopNo], function (tx, result) {

				var faveStatus = result.rows.item(0).favourite;
				defer.resolve(faveStatus);

				return;
			});
		}

		return defer.promise;
	}

	function setStopFaveStatus(stopNo, faveStatus) {

		var defer = $q.defer();

		db.transaction(handleDb, function (tx, error) {
			return defer.reject(error);
		});

		function handleDb(tx) {
			tx.executeSql('UPDATE stops SET favourite = ? WHERE number = ?', [faveStatus, stopNo], function (tx, result) {
				defer.resolve(result);
			});
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

	function getFaveRoutes() {

		var defer = $q.defer();

		// Get fave route
		db.transaction(handleData, function (tx, error) {
			return defer.reject(error);
		});

		function handleData(tx) {

			var faves = [];

			// SQLite storing fav as float because JS doesn't do real ints.
			tx.executeSql('SELECT * FROM routes WHERE favourite > 0.0', [], function (tx, result) {

				for (var i = 0; i < result.rows.length; i++) {
					faves.push(result.rows.item(i));
				}

				defer.resolve(faves);
				return;
			});
		}

		return defer.promise;
	}

	function getFaveStops() {
		// Get fave stop
		var defer = $q.defer();

		var stops = [];

		db.transaction(handleTx, function (tx, error) {
			return defer.reject(error);
		});

		function handleTx(tx) {

			tx.executeSql('SELECT * FROM stops WHERE favourite > 0.0', [], function (tx, result) {
				// let stops = result.rows.item(0);
				for (var i = 0; i < result.rows.length; i++) {
					stops.push(result.rows[i]);
				}
				console.log(stops);
				// console.log(result.rows[result.rows.length - 1])
				// console.log(result.rows);
				defer.resolve(stops);

				return;
			});
		}

		return defer.promise;
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
RouteCtrl.$inject = ['details', 'setFaveStatus'];

function RouteCtrl(details, setFaveStatus) {

  var vm = this;

  // console.log(details);
  vm.faveStatus = details.favourite;
  vm.name = details.name;
  vm.number = details.number;
  vm.stops = details.stops;

  // Handler of Favourite button click events in route.html template
  vm.setFaveStatus = function (name) {
    //toggle fave status according to fave btn clicks
    vm.faveStatus = vm.faveStatus === 1 ? 0 : 1;
    setFaveStatus(vm.name, vm.faveStatus);
  };
}

exports.RouteCtrl = RouteCtrl;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
RouteStopDetailCtrl.$inject = ['details', 'getFaveStatus', 'setFaveStatus'];

function RouteStopDetailCtrl(details, getFaveStatus, setFaveStatus) {

  var vm = this;

  vm.showError = details.Error === '' ? false : true;
  vm.error = details.Error;

  vm.stopName = details.stopName;
  vm.stopNo = details.stopNo;
  vm.name = details.name;
  vm.trips = details.Trips;
  vm.details = details;

  getFaveStatus(vm.stopNo).then(function (faveStatus) {
    vm.faveStatus = faveStatus;
  });

  vm.setFaveStatus = function () {

    vm.faveStatus = vm.faveStatus === 1 ? 0 : 1;
    setFaveStatus(vm.stopNo, vm.faveStatus);
  };
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
  }).when('/routes/:number', {

    templateUrl: 'views/route.html',
    controller: 'RouteCtrl',
    controllerAs: 'route',
    resolve: {
      details: function details($location, dataService) {

        // get route name form query string
        var name = $location.search().name;
        return dataService.getRouteStops(name);
      },

      setFaveStatus: function setFaveStatus(dataService) {
        return dataService.setRouteFaveStatus;
      }
    }
  }).when('/routes/:number/:stopNo', {
    templateUrl: 'views/routestops.html',
    controller: 'RouteStopDetailCtrl',
    controllerAs: 'routeStops',
    resolve: {
      details: function details(routes, $route, $location) {

        // route number
        var name = $location.search().name;
        var number = $route.current.params.number;
        var stopNo = $route.current.params.stopNo;

        return routes.getNextTrips(name, number, stopNo);
      },
      getFaveStatus: function getFaveStatus(dataService) {
        return dataService.getStopFaveStatus;
      },
      setFaveStatus: function setFaveStatus(dataService) {
        return dataService.setStopFaveStatus;
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
routes.$inject = ['$http', 'config'];

function routes($http, config) {

  var Routes = {
    getNextTrips: getNextTrips
  };

  return Routes;

  function getNextTrips(name, routeNo, stopNo) {

    var OCCONFIG = window._env.OC;

    var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    var url = config.OC_URL + '/GetNextTripsForStop';
    var data = 'appID=' + OCCONFIG.APP_ID + '&apiKey=' + OCCONFIG.API_KEY + '&stopNo=' + stopNo + '&routeNo=' + routeNo + '&format=json';

    return $http.post(url, data, headers).then(getNextTripsComplete);

    function getNextTripsComplete(response) {

      var result = {};
      var data = response.data.GetNextTripsForStopResult;

      if (data.Error !== '') {
        return data;
      }

      if (!Array.isArray(data.Route.RouteDirection)) {
        result = data.Route.RouteDirection;
      } else {

        result = data.Route.RouteDirection.find(function (route) {
          var _name = route.RouteNo + ' ' + route.RouteLabel;
          if (_name === name) {
            return route;
          }
        });
      }

      result.name = result.RouteNo + ' ' + result.RouteLabel;
      result.stopNo = stopNo;
      result.stopName = data.StopLabel;
      result.Trips = result.Trips.Trip;

      return result;
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
StopCtrl.$inject = ['$routeParams', 'stopRouteSummary', 'faveStatus', 'setFaveStatus'];

function StopCtrl($routeParams, stopRouteSummary, faveStatus, setFaveStatus) {

  var vm = this;

  vm.stopNo = $routeParams.stopNo;
  vm.showError = stopRouteSummary.Error !== '';
  vm.routes = vm.showError ? [] : stopRouteSummary.Routes;
  vm.stopDescription = stopRouteSummary.StopDescription;

  vm.faveStatus = faveStatus;

  vm.setFaveStatus = function (stopNo) {

    vm.faveStatus = vm.faveStatus === 1 ? 0 : 1;
    setFaveStatus(stopNo, vm.faveStatus);

    console.log(vm.faveStatus);
  };
  console.log('Fave Status: ' + vm.faveStatus);
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
      },
      faveStatus: function faveStatus($route, dataService) {

        var stopNo = $route.current.params.stopNo;
        return dataService.getStopFaveStatus(stopNo);
      },
      setFaveStatus: function setFaveStatus(dataService) {
        return dataService.setStopFaveStatus;
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
stops.$inject = ['$http', 'config'];

function stops($http, config) {

  var Stops = {
    getRouteSummary: getRouteSummary
  };

  return Stops;

  function getRouteSummary(stopNo) {

    // Content-Type must be x-www-form-urlencoded. Tried with JSON
    // but OC Transpo returns error (weird)
    var OCCONFIG = window._env.OC;
    var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    var url = config.OC_URL + '/GetNextTripsForStopAllRoutes';
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
