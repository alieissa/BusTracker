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

var _favouritesModule = require('./favourites/favourites.module.js');

angular.module('busTrackerApp', ['firebase', 'ngRoute', 'favesMod', 'routesMod', 'stopsMod']).config(config).constant('config', { OC_URL: 'http://localhost:3000/v1.2' }).controller('MainCtrl', MainCtrl);

function config($routeProvider, $httpProvider) {

    $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
    }).otherwise({
        redirectTo: '/'
    });
}

function MainCtrl($rootScope) {

    $rootScope.$on('$routeChangeError', function (event, prev, next) {
        console.log('Unable to reach ' + next);
    });
}

},{"./favourites/favourites.module.js":7,"./routes/routes.module.js":11,"./stops/stops.module.js":16}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _databaseService = require('./database.service.js');

angular.module('dBMod', []).constant('DATABASE', 'octranspo').factory('dBService', _databaseService.dBService);

exports.default = angular.module('dBMod');

},{"./database.service.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
dBService.$inject = ['$q', 'DATABASE'];

function dBService($q, DATABASE) {

	var db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB;

	var DB = {
		getAll: getAll,
		getFaves: getFaves,
		getFaveStatus: getFaveStatus,
		setFaveStatus: setFaveStatus,
		getStops: getStops
	};

	return DB;

	/*-------------------Factory function definitions-------------------------*/

	function getAll(table) {

		var defer = $q.defer();
		db.transaction(handleTx, handleErr);

		/*-------------------------------------------------------
  	Note: Can not insert table name using ? replacement.
  	This is true for most SQL
  ----------------------------------------------------------*/

		function handleTx(tx) {
			tx.executeSql('SELECT * FROM ' + table + ' ORDER BY number', [], handleRes, handleErr);
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
	}

	function getFaves(table) {

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

	function getStops(name) {

		var defer = $q.defer();

		// let db = openDatabase('octranspo', '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB

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

exports.dBService = dBService;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function favesConfig($routeProvider) {

    $routeProvider.when('/favourites', {
        templateUrl: './views/faves.html',
        controller: 'FavesCtrl',
        controllerAs: 'faves',
        resolve: {
            faveRoutes: function faveRoutes(dBService) {
                return dBService.getFaves('routes');
            },
            faveStops: function faveStops(dBService) {
                return dBService.getFaves('stops');
            }
        }
    });
}

exports.favesConfig = favesConfig;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function FavesCtrl(faveRoutes, faveStops) {

    var vm = this;

    vm.routes = faveRoutes;
    vm.stops = faveStops;
}

exports.FavesCtrl = FavesCtrl;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function favesList() {

    var favesList = {
        templateUrl: './views/faves-list.html',
        scope: {
            routes: '=faveRoutes',
            stops: '=faveStops'
        },
        link: link
    };

    return favesList;

    function link(scope, element, attrs) {

        angular.element('.tab-item').on('touchstart', handleTouch);

        function handleTouch() {

            if (angular.element(this).hasClass('.tab-active')) {
                return;
            }

            angular.element('.tab-active').removeClass('tab-active');
            angular.element(this).addClass('tab-active');

            return;
        }
    }

    return;
}

exports.favesList = favesList;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _favouritesController = require('./favourites.controller.js');

var _favouritesDirectives = require('./favourites.directives.js');

var _favouritesConfig = require('./favourites.config.js');

var _databaseModule = require('../database/database.module.js');

// import {favesService} from './favourites.service.js';

angular.module('favesMod', ['dBMod', 'ngRoute']).config(_favouritesConfig.favesConfig).controller('FavesCtrl', _favouritesController.FavesCtrl).directive('favesList', _favouritesDirectives.favesList);

exports.default = angular.module('favesMod');

},{"../database/database.module.js":2,"./favourites.config.js":4,"./favourites.controller.js":5,"./favourites.directives.js":6}],8:[function(require,module,exports){
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
RouteCtrl.$inject = ['routeDetails', 'setFaveStatus'];

function RouteCtrl(routeDetails, setFaveStatus) {

  var vm = this;

  vm.name = routeDetails.name;
  vm.number = routeDetails.number;
  vm.stops = routeDetails.stops;
  vm.faveStatus = routeDetails.favourite;
  vm.setFaveStatus = setFaveStatus;

  // Handler of Favourite button click events in route.html template
  // function _setFaveStatus(name) {
  //
  //    	vm.faveStatus = vm.faveStatus === 0 ? 1: 0;
  // 	setFaveStatus(vm.faveStatus, 'name', vm.name);
  // }
}

exports.RouteCtrl = RouteCtrl;

},{}],9:[function(require,module,exports){
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
            routesList: function routesList(dBService) {
                return dBService.getAll('routes');
            }
        }
    }).when('/routes/:number', {

        templateUrl: 'views/route.html',
        controller: 'RouteCtrl',
        controllerAs: 'route',
        resolve: {
            setFaveStatus: function setFaveStatus(dBService) {
                return dBService.setFaveStatus;
            },
            routeDetails: function routeDetails($location, dBService) {

                var name = $location.search().name; //from query string
                return dBService.getStops(name);
            }
        }
    });
}

exports.routesConfig = routesConfig;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _routesController = require('./routes.controller.js');

var _routeDetailController = require('./route-detail.controller.js');

var _routesConfig = require('./routes.config.js');

var _databaseModule = require('../database/database.module.js');

angular.module('routesMod', ['firebase', 'ngRoute', 'dBMod']).config(_routesConfig.routesConfig).controller('RoutesCtrl', _routesController.RoutesCtrl).controller('RouteCtrl', _routeDetailController.RouteCtrl);

exports.default = angular.module('routesMod');

},{"../database/database.module.js":2,"./route-detail.controller.js":8,"./routes.config.js":9,"./routes.controller.js":10}],12:[function(require,module,exports){
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
StopDetailCtrl.$inject = ['$routeParams', 'nextTrips', 'getFaveStatus', 'setFaveStatus'];

function StopDetailCtrl($routeParams, nextTrips, getFaveStatus, setFaveStatus) {

    var vm = this;

    vm = nextTrips;
    // vm.stopNo = nextTrips.StopNo;
    // vm.Error = nextTrips.Error;
    // vm.routes = nextTrips.Routes;
    // vm.stopDescription = nextTrips.StopDescription;
    vm.setFaveStatus = _setFaveStatus;

    getFaveStatus('number', vm.stopNo).then(function (faveStatus) {
        vm.faveStatus = faveStatus;
    });

    function _setFaveStatus(stopNo) {

        vm.faveStatus = vm.faveStatus === 0 ? 1 : 0;
        setFaveStatus(vm.faveStatus, 'number', stopNo);
    }
}

exports.StopDetailCtrl = StopDetailCtrl;

},{}],13:[function(require,module,exports){
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
            stopsList: function stopsList(dBService) {
                return dBService.getAll('stops');
            }
        }
    }).when('/stops/:stopNo', {
        templateUrl: 'views/stop.html',
        controller: 'StopDetailCtrl',
        controllerAs: 'stop',
        resolve: {
            getFaveStatus: function getFaveStatus(dBService) {
                return dBService.getFaveStatus;
            },
            setFaveStatus: function setFaveStatus(dBService) {
                return dBService.setFaveStatus;
            },
            nextTrips: function nextTrips($route, stopsService) {

                var stopNo = $route.current.params.stopNo;
                return stopsService.getNextTrips(stopNo);
            }
        }
    });
}

exports.stopsConfig = stopsConfig;

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function nextTripsError() {

    var nextTripsError = {
        templateUrl: '/views/next-trips-error.html'
    };

    return nextTripsError;
}

function nextTrips() {

    var nextTrips = {
        templateUrl: '/views/next-trips.html',
        scope: {
            route: '=',
            trips: '='
        },
        link: function link(scope, element, attrs) {
            angular.element('.material-icons').click(function () {
                console.log('Clicked icon ');
            });
            console.log('Next trips link function');
        }
    };

    return nextTrips;
}

exports.nextTrips = nextTrips;
exports.nextTripsError = nextTripsError;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
      value: true
});

var _stopsController = require('./stops.controller.js');

var _stopDetailController = require('./stop-detail.controller.js');

var _stopsService = require('./stops.service.js');

var _stopsConfig = require('./stops.config.js');

var _stopsDirectives = require('./stops.directives.js');

var _databaseModule = require('../database/database.module.js');

angular.module('stopsMod', ['ngRoute', 'firebase', 'dBMod']).config(_stopsConfig.stopsConfig).controller('StopsCtrl', _stopsController.StopsCtrl).controller('StopDetailCtrl', _stopDetailController.StopDetailCtrl).directive('nextTrips', _stopsDirectives.nextTrips).directive('nextTripsError', _stopsDirectives.nextTripsError).service('stopsService', _stopsService.stopsService); // import {SQLiteMod} from '../common/SQLite.module.js';
exports.default = angular.module('stopsMod');

},{"../database/database.module.js":2,"./stop-detail.controller.js":12,"./stops.config.js":13,"./stops.controller.js":14,"./stops.directives.js":15,"./stops.service.js":17}],17:[function(require,module,exports){
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
stopsService.$inject = ['$http', 'config', 'dBService'];

function stopsService($http, config, dBService) {

    var Stops = {
        // getAll: dBService.getAll('stops'), // returns function that gets all routes
        // getFaves: dBService.getFaves('stops'), // returns function that get all fave routes
        // getFaveStatus: dBService.getFaveStatus('stops'), // returns a function that gets fave staus given stop no
        // setFaveStatus: dBService.setFaveStatus('stops'), // returns function that set status given name and status
        getNextTrips: getNextTrips
    };

    return Stops;

    /*-------------------Factory function definitions-------------------------*/

    function getNextTrips(stopNo) {

        var OCCONFIG = window._env.OC;
        var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }; // Content-Type must be x-www-form-urlencoded.
        var url = config.OC_URL + '/GetNextTripsForStopAllRoutes';
        var data = 'appID=' + OCCONFIG.APP_ID + '&apiKey=' + OCCONFIG.API_KEY + '&stopNo=' + stopNo + '&format=json';

        return $http.post(url, data, headers).then(handleRes);

        function handleRes(response) {

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

            var isTrips = false;
            result.Routes.forEach(function (route) {

                if (typeof route.Trips === 'undefined') {
                    route.Trips = [];
                } else if (!Array.isArray(route.Trips)) {
                    route.Trips = [route.Trips];
                }
                isTrips = route.Trips.length > 0 || isTrips;
                console.log(isTrips);
            });

            if (!isTrips) {
                result.Error = "16";
                return result;
            }

            return result;
        }
    }
}

exports.stopsService = stopsService;

},{}]},{},[1]);
