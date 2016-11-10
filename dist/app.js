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

angular.module('busTrackerApp', ['firebase', 'ngRoute', 'routesMod', 'stopsMod', 'dbMod']).config(config).constant('config', { OC_URL: 'http://localhost:3000/v1.2' }).controller('FavesCtrl', FavesCtrl).controller('MainCtrl', MainCtrl);

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
            faveRoutes: function faveRoutes(routesService) {
                return routesService.getFaves();
            },
            faveStops: function faveStops(stopsService) {
                return stopsService.getFaves();
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
        console.log('Unable to reach ' + next);
    });
}

},{"./routes/routes.module.js":7,"./stops/stops.module.js":12}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

angular.module('dbMod', []).constant('DATABASE', 'octranspo').factory('dbService', dbService);

function dbService($q, DATABASE) {

	var db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB;

	var DB = {
		getAll: getAll,
		getFaves: getFaves,
		getFaveStatus: getFaveStatus,
		setFaveStatus: setFaveStatus
	};

	return DB;

	/*-------------------Factory function definitions-------------------------*/

	function getAll(table) {
		return function () {

			var defer = $q.defer();
			db.transaction(handleTx, handleErr);

			/*-------------------------------------------------------
   	Note: Can not insert table name using ? replacement.
   	This is true for most SQL
   ----------------------------------------------------------*/

			function handleTx(tx) {
				tx.executeSql('SELECT * FROM ' + table, [], handleRes, handleErr);
			}

			function handleRes(tx, result) {

				var data = [];
				for (var i = 0; i < result.rows.length; i++) {
					data.push(result.rows.item(i));
				}

				defer.resolve(data);
				return;
			}

			function handleErr(tx, err) {
				console.log(err);
				return defer.reject(err);
			}

			return defer.promise;
		};
	}

	function getFaves(table) {
		return function () {

			var defer = $q.defer();
			db.transaction(handleTx, handleErr);

			function handleTx(tx) {
				tx.executeSql('SELECT * FROM ' + table + ' WHERE favourite = 1', [], handleRes, handleErr);
			}

			function handleRes(tx, result) {

				var data = [];
				for (var i = 0; i < result.rows.length; i++) {
					data.push(result.rows.item(i));
				}

				defer.resolve(data);
				return;
			}

			function handleErr(tx, err) {
				console.log(err);
				return defer.reject(err);
			}

			return defer.promise;
		};
	}

	function getFaveStatus(table) {
		return function (key, value) {

			var defer = $q.defer();
			db.transaction(handleTx, handleErr);

			function handleTx(tx, result) {
				tx.executeSql('SELECT favourite FROM ' + table + ' WHERE ' + key + ' = ?', [value], handleRes, handleErr);
			}

			function handleRes(tx, result) {
				return defer.resolve(result.rows.item(0).favourite);
			}

			function handleErr(tx, error) {
				return defer.reject(error);
			}

			return defer.promise;
		};
	}

	function setFaveStatus(table) {
		return function (status, key, value) {

			var defer = $q.defer();

			db.transaction(handleTx, handleErr);

			function handleTx(tx, result) {
				tx.executeSql('UPDATE ' + table + ' SET favourite = ? WHERE ' + key + ' = ?', [status, value], handleRes, handleErr);
			}

			function handleRes(tx, result) {
				defer.resolve(result.rows);
				return;
			}

			function handleErr(tx, err) {
				console.log(err);
				return defer.reject(err);
			}

			return defer.promise;
		};
	}
}
exports.default = angular.module('dbMod');

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

  vm.faveStatus = details.favourite;
  vm.name = details.name;
  vm.number = details.number;
  vm.stops = details.stops;
  vm.setFaveStatus = _setFaveStatus;

  // Handler of Favourite button click events in route.html template
  function _setFaveStatus(name) {

    vm.faveStatus = vm.faveStatus === 0 ? 1 : 0;
    setFaveStatus(vm.faveStatus, 'name', vm.name);
  }
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
	vm.setFaveStatus = _setFaveStatus;

	// details doesn't include stop faveStatus
	getFaveStatus('number', vm.stopNo).then(function (faveStatus) {
		vm.faveStatus = faveStatus;
	});

	function _setFaveStatus() {

		vm.faveStatus = vm.faveStatus === 0 ? 1 : 0;
		setFaveStatus(vm.faveStatus, 'number', vm.stopNo);
	}
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
            routesList: function routesList(routesService) {
                return routesService.getAll();
            }
        }
    }).when('/routes/:number', {
        templateUrl: 'views/route.html',
        controller: 'RouteCtrl',
        controllerAs: 'route',
        resolve: {
            setFaveStatus: function setFaveStatus(routesService) {
                return routesService.setFaveStatus;
            },
            details: function details($location, routesService) {

                var name = $location.search().name;
                return routesService.getStops(name);
            }
        }
    }).when('/routes/:number/:stopNo', {
        templateUrl: 'views/routestops.html',
        controller: 'RouteStopDetailCtrl',
        controllerAs: 'routeStops',
        resolve: {
            getFaveStatus: function getFaveStatus(stopsService) {
                return stopsService.getFaveStatus;
            },
            setFaveStatus: function setFaveStatus(stopsService) {
                return stopsService.setFaveStatus;
            },
            details: function details($route, $location, routesService) {

                var name = $location.search().name;
                var number = $route.current.params.number;
                var stopNo = $route.current.params.stopNo;
                return routesService.getNextTrips(name, number, stopNo);
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

var _routesController = require('./routes.controller.js');

var _routeDetailController = require('./route-detail.controller.js');

var _routeStopDetailController = require('./route-stop-detail.controller.js');

var _routesService = require('./routes.service.js');

var _routesConfig = require('./routes.config.js');

angular.module('routesMod', ['firebase', 'ngRoute', 'dbMod']).config(_routesConfig.routesConfig).controller('RoutesCtrl', _routesController.RoutesCtrl).controller('RouteCtrl', _routeDetailController.RouteCtrl).controller('RouteStopDetailCtrl', _routeStopDetailController.RouteStopDetailCtrl).factory('routesService', _routesService.routesService); // import {SQLiteMod} from '../common/SQLite.module.js';
exports.default = angular.module('routesMod');

},{"./route-detail.controller.js":3,"./route-stop-detail.controller.js":4,"./routes.config.js":5,"./routes.controller.js":6,"./routes.service.js":8}],8:[function(require,module,exports){
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
exports.routesService = routesService;

var _Model = require('../common/Model.js');

routesService.$inject = ['$http', '$q', 'dbService', 'config'];function routesService($http, $q, dbService, config) {

    var Routes = {
        getAll: dbService.getAll('routes'), // returns function that gets all routes
        getFaves: dbService.getFaves('routes'), // returns function that get all fave routes
        getFaveStatus: dbService.getFaveStatus('routes'), // returns a function that takes route name
        setFaveStatus: dbService.setFaveStatus('routes'), // returns function that set status given name and status
        getNextTrips: getNextTrips,
        getStops: getStops
    };

    return Routes;

    /*-------------------Factory function definitions-------------------------*/

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

    function getStops(name) {

        var defer = $q.defer();

        var db = openDatabase('octranspo', '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB

        db.transaction(handleTx, handleErr);

        function handleTx(tx) {
            tx.executeSql('SELECT * FROM routes WHERE name = ?', [name], handleRes, handleErr);
        }

        function handleRes(tx, result) {

            var data = result.rows.item(0);

            var stops = data.stops.split('\t');

            // stops number and name are both in a long space separated string
            stops = stops.map(function (stop) {
                return {
                    number: stop.split(' ')[0],
                    name: stop.split(' ').slice(1).join(' ')
                };
            });

            data.stops = stops;
            data.favourite = parseInt(data.favourite);
            defer.resolve(data);
            return;
        }

        function handleErr(tx, error) {
            console.log(error);
            return defer.reject(error);
        }

        return defer.promise;
    }
}

},{"../common/Model.js":2}],9:[function(require,module,exports){
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
StopCtrl.$inject = ['$routeParams', 'stopRouteSummary', 'getFaveStatus', 'setFaveStatus'];

function StopCtrl($routeParams, stopRouteSummary, getFaveStatus, setFaveStatus) {

    var vm = this;

    vm.stopNo = $routeParams.stopNo;
    vm.showError = stopRouteSummary.Error !== '';
    vm.routes = vm.showError ? [] : stopRouteSummary.Routes;
    vm.stopDescription = stopRouteSummary.StopDescription;
    vm.setFaveStatus = _setFaveStatus;

    getFaveStatus('number', vm.stopNo).then(function (faveStatus) {
        vm.faveStatus = faveStatus;
    });

    function _setFaveStatus(stopNo) {

        vm.faveStatus = vm.faveStatus === 0 ? 1 : 0;
        setFaveStatus(vm.faveStatus, 'number', stopNo);
    }
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
            stopsList: function stopsList(stopsService) {
                return stopsService.getAll();
            }
        }
    }).when('/stops/:stopNo', {
        templateUrl: 'views/stop.html',
        controller: 'StopCtrl',
        controllerAs: 'stop',
        resolve: {
            getFaveStatus: function getFaveStatus(stopsService) {
                return stopsService.getFaveStatus;
            },
            setFaveStatus: function setFaveStatus(stopsService) {
                return stopsService.setFaveStatus;
            },
            stopRouteSummary: function stopRouteSummary($route, stopsService) {

                var stopNo = $route.current.params.stopNo;
                return stopsService.getRouteSummary(stopNo);
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

var _stopsController = require('./stops.controller.js');

var _stopDetailController = require('./stop-detail.controller.js');

var _stopsService = require('./stops.service.js');

var _stopsConfig = require('./stops.config.js');

// import {SQLiteMod} from '../common/SQLite.module.js';
angular.module('stopsMod', ['ngRoute', 'firebase', 'dbMod']).config(_stopsConfig.stopsConfig).controller('StopsCtrl', _stopsController.StopsCtrl).controller('StopCtrl', _stopDetailController.StopCtrl).service('stopsService', _stopsService.stopsService);

exports.default = angular.module('stopsMod');

},{"./stop-detail.controller.js":9,"./stops.config.js":10,"./stops.controller.js":11,"./stops.service.js":13}],13:[function(require,module,exports){
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
stopsService.$inject = ['$http', 'config', 'dbService'];

function stopsService($http, config, dbService) {

    var Stops = {
        getAll: dbService.getAll('stops'), // returns function that gets all routes
        getFaves: dbService.getFaves('stops'), // returns function that get all fave routes
        getFaveStatus: dbService.getFaveStatus('stops'), // returns a function that gets fave staus given stop no
        setFaveStatus: dbService.setFaveStatus('stops'), // returns function that set status given name and status
        getRouteSummary: getRouteSummary
    };

    return Stops;

    /*-------------------Factory function definitions-------------------------*/

    function getRouteSummary(stopNo) {

        var OCCONFIG = window._env.OC;
        var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }; // Content-Type must be x-www-form-urlencoded.
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

exports.stopsService = stopsService;

},{}]},{},[1]);
