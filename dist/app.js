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

var _databaseModule = require('./database/database.module.js');

var _routesModule = require('./routes/routes.module.js');

var _stopsModule = require('./stops/stops.module.js');

var _favouritesModule = require('./favourites/favourites.module.js');

var _utilModule = require('./util/util.module.js');

angular.module('busTrackerApp', ['ngRoute', 'dBMod', 'favesMod', 'routesMod', 'stopsMod', 'appUtil']).config(config).constant('config', { OC_URL: 'http://localhost:3000/v1.2' }).controller('MainCtrl', MainCtrl);

function config($routeProvider, $httpProvider) {

    $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
    });
    // .otherwise({
    //     redirectTo: '/'
    // });
}

function MainCtrl($rootScope) {

    $rootScope.$on('$routeChangeError', function (event, prev, next) {
        console.log('Unable to reach ' + next);
    });
}

},{"./database/database.module.js":2,"./favourites/favourites.module.js":6,"./routes/routes.module.js":10,"./stops/stops.module.js":14,"./util/util.module.js":17}],2:[function(require,module,exports){
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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

dBService.$inject = ['$q', 'DATABASE'];

function dBService($q, DATABASE) {

	var db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB;

	var DB = { get: get, set: set, getStops: getStops };
	return DB;

	/*-------------------Factory function definitions-------------------------*/

	function get(table, filter) {

		console.log('Getting routes...');
		var defer = $q.defer();
		db.transaction(handleTx, handleErr);

		/*-------------------------------------------------------
  	Note: Can not insert table name using ? replacement.
  	This is true for most SQL
  ----------------------------------------------------------*/

		function handleTx(tx) {

			if (typeof filter === 'undefined') {
				tx.executeSql('SELECT * FROM ' + table + ' ORDER BY number', [], handleRes, handleErr);
			} else {
				var _Object$keys = Object.keys(filter),
				    _Object$keys2 = _slicedToArray(_Object$keys, 1),
				    key = _Object$keys2[0];

				var value = filter[key];

				tx.executeSql('SELECT * FROM ' + table + ' WHERE ' + key + ' = ?', [value], handleRes, handleErr);
			}
		}

		function handleRes(tx, result) {
			return defer.resolve(parseRes(result));
		}

		function handleErr(tx, err) {
			console.log(err);
			return defer.reject(err);
		}

		return defer.promise;
	}

	function set(table, setting, filter) {
		var _Object$keys3 = Object.keys(setting),
		    _Object$keys4 = _slicedToArray(_Object$keys3, 1),
		    setKey = _Object$keys4[0];

		var setValue = setting[setKey];

		var _Object$keys5 = Object.keys(filter),
		    _Object$keys6 = _slicedToArray(_Object$keys5, 1),
		    filterKey = _Object$keys6[0];

		var filterValue = filter[filterKey];

		var defer = $q.defer();

		db.transaction(handleTx, handleErr);

		function handleTx(tx, result) {
			tx.executeSql('UPDATE ' + table + ' SET ' + setKey + ' = ? WHERE ' + filterKey + ' = ?', [setValue, filterValue], handleRes, handleErr);
		}

		function handleRes(tx, result) {
			return defer.resolve(result.rows);
		}

		function handleErr(tx, err) {
			console.log(err);
			return defer.reject(err);
		}

		return defer.promise;
	}

	function getStops(route) {

		var defer = $q.defer();

		db.transaction(handleTx, handleErr);

		function handleTx(tx) {
			tx.executeSql('SELECT * FROM routes WHERE name = ?', [route.name], handleRes, handleErr);
		}

		function handleRes(tx, result) {

			var data = result.rows.item(0);
			var stops = [];
			var _stops = data.stops.split('\t');

			// stops number and name are both in a long space separated string
			_stops.forEach(function (stop) {
				var number = stop.split(' ')[0];
				get('stops', { number: number }).then(function (result) {
					return stops.push(result[0]);
				});
			});

			data.stops = stops;
			data.favourite = parseInt(data.favourite);
			return defer.resolve(data);
		}

		function handleErr(tx, error) {
			console.log(error);
			return defer.reject(error);
		}

		return defer.promise;
	}
}

function parseRes(result) {

	var data = [];
	for (var i = 0; i < result.rows.length; i++) {
		data.push(result.rows.item(i));
	}

	return data;
}

exports.dBService = dBService;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function favesConfig($routeProvider) {

    $routeProvider.when('/favourites', {
        template: '<ae-faves></ae-faves>'
    });
}

exports.favesConfig = favesConfig;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function aeFaves(dBService) {

    var aeFaves = {
        templateUrl: './views/faves.html',
        controller: controller,
        controllerAs: 'faves',
        scope: true,
        link: link
    };

    return aeFaves;

    function controller(dBService) {

        var vm = this;

        vm.routes = [];
        vm.stops = [];

        dBService.get('routes', { 'favourite': 1 }).then(function (routes) {
            vm.routes = routes;
        });
        dBService.get('stops', { 'favourite': 1 }).then(function (stops) {
            vm.stops = stops;
        });
    }

    function link(scope, element, attrs) {

        angular.element('.tab-item').on('click', function () {

            var targetDiv = angular.element(this).attr('id');
            var contentDiv = targetDiv + '-content';
            var otherDiv = contentDiv === 'stops-tab-content' ? 'routes-tab-content' : 'stops-tab-content';

            angular.element('#' + contentDiv).css('display', 'block');
            angular.element('#' + otherDiv).css('display', 'none');
        });
    }

    return;
}

exports.aeFaves = aeFaves;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _favouritesDirectives = require('./favourites.directives.js');

var _favouritesConfig = require('./favourites.config.js');

angular.module('favesMod', []).config(_favouritesConfig.favesConfig).directive('aeFaves', _favouritesDirectives.aeFaves);

exports.default = angular.module('favesMod');

},{"./favourites.config.js":4,"./favourites.directives.js":5}],7:[function(require,module,exports){
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
  vm.setFaveStatus = _setFaveStatus;

  //  	Handler of Favourite button click events in route.html template
  function _setFaveStatus(name) {

    var _favourite = vm.favourite === 0 ? 1 : 0;
    setFaveStatus('routes', { 'favourite': _favourite }, { 'name': vm.name }).then(function () {
      vm.favourite = _favourite;
    });
  }
}

exports.RouteCtrl = RouteCtrl;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
routesConfig.$inject = ['$routeProvider'];

function routesConfig($routeProvider) {

    $routeProvider.when('/routes', {
        template: '<ae-routes></ae-routes>'
    }).when('/routes/:number', {

        templateUrl: 'views/route-details.view.html',
        controller: 'RouteCtrl',
        controllerAs: 'route',
        resolve: {
            setFaveStatus: function setFaveStatus(dBService) {
                return dBService.set;
            },
            routeDetails: function routeDetails($location, dBService) {

                var name = $location.search().name; //from query string
                return dBService.getStops({ name: name });
            }
        }
    });
}

exports.routesConfig = routesConfig;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

aeRoute.inject = ['dBService'];
aeRoutes.inject = ['dBService'];

function aeRoute(dBService) {

    var aeRoute = {
        templateUrl: 'views/route.directive.html',
        // controller: controller,
        // controllerAs: 'route',
        scope: {
            route: '='
        },
        link: link
    };

    return aeRoute;

    // function controller(dBService) {
    //
    //     let vm = this;
    //     dBService.get('routes').then((routes) => vm.routes = routes);
    // }

    function link(scope, element, attrs) {

        var star = element.find('i.star');

        star.on('click', handleStarTouch);

        function handleStarTouch() {

            var _favourite = scope.route.favourite === 0 ? 1 : 0;
            dBService.set('routes', { favourite: _favourite }, { name: scope.route.name }).then(updateStop);
        }

        function updateStop(result) {

            // toggle favourite status
            scope.route.favourite = scope.route.favourite === 0 ? 1 : 0;

            // Set the favourite status indicator
            var starType = scope.route.favourite === 0 ? 'star_border' : 'star';
            star.text(starType);
        }
    }
}

function aeRoutes(dBService) {

    var aeRoutes = {
        template: '<ae-menu-bar title="Routes" ng-cloak></ae-menu-bar>' + '<ae-route ng-repeat="route in routes.routes | limitTo: 100 |filter: {name: search, number: search}"' + 'data-route="route" ></ae-route>',

        controller: controller,
        controllerAs: 'routes',
        scope: {},
        link: link
    };

    return aeRoutes;

    function controller(dBService) {

        var vm = this;
        dBService.get('routes').then(function (routes) {
            return vm.routes = routes;
        });
    }

    function link(scope, element, attrs) {}
}

exports.aeRoute = aeRoute;
exports.aeRoutes = aeRoutes;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _routeDetailController = require('./route-detail.controller.js');

var _routesConfig = require('./routes.config.js');

var _routesDirectives = require('./routes.directives.js');

angular.module('routesMod', []).config(_routesConfig.routesConfig).directive('aeRoute', _routesDirectives.aeRoute).directive('aeRoutes', _routesDirectives.aeRoutes).controller('RouteCtrl', _routeDetailController.RouteCtrl);

exports.default = angular.module('routesMod');

},{"./route-detail.controller.js":7,"./routes.config.js":8,"./routes.directives.js":9}],11:[function(require,module,exports){
'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopDetailCtrl
 * @description
 * # StopDetailCtrl
 * Controller of the busTrackerApp
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
StopDetailCtrl.$inject = ['$routeParams', 'routeDetails', 'stopDetails', 'setFaveStatus'];

function StopDetailCtrl($routeParams, routeDetails, stopDetails, setFaveStatus) {

    var vm = this;

    vm.name = stopDetails[0].name;
    vm.number = stopDetails[0].number;
    vm.code = stopDetails[0].code;
    vm.lat = stopDetails[0].lat;
    vm.lon = stopDetails[0].lon;
    vm.favourite = stopDetails[0].favourite;

    vm.error = routeDetails.error;
    vm.routes = routeDetails.routes;
    vm.setFaveStatus = _setFaveStatus;

    function _setFaveStatus(number) {

        var _favourite = vm.favourite === 0 ? 1 : 0;
        setFaveStatus('stops', { 'favourite': _favourite }, { 'number': number }).then(function () {
            vm.favourite = _favourite;
            console.log(_favourite);
        });
    }
}

exports.StopDetailCtrl = StopDetailCtrl;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
stopsConfig.$inject = ['$routeProvider'];

function stopsConfig($routeProvider) {

    $routeProvider.when('/stops', {
        template: '<ae-stops></ae-stops>'
    }).when('/stops/:stopNo', {
        templateUrl: 'views/stop-details.html',
        controller: 'StopDetailCtrl',
        controllerAs: 'stop',
        resolve: {
            setFaveStatus: function setFaveStatus(dBService) {
                return dBService.set;
            },
            stopDetails: function stopDetails($route, dBService) {

                var stopNo = $route.current.params.stopNo;
                return dBService.get('stops', { number: stopNo });
            },
            routeDetails: function routeDetails($route, stopsService) {

                var stopNo = $route.current.params.stopNo;
                return stopsService.getNextTrips(stopNo);
            }
        }
    });
}

exports.stopsConfig = stopsConfig;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeStop.inject = ['dBService'];
aeStops.inject = ['dBService'];

function aeStop(dBService) {

    var aeStop = {
        templateUrl: 'views/stop.directive.html',
        scope: {
            stop: '='
        },
        controller: controller,
        controllerAs: 'stop',
        link: link
    };

    return aeStop;

    function controller() {}

    function link(scope, element, attrs) {

        var star = element.find('i.star');

        star.on('click', handleStarTouch);

        function handleStarTouch() {

            var _favourite = scope.stop.favourite === 0 ? 1 : 0;
            dBService.set('stops', { favourite: _favourite }, { number: scope.stop.number }).then(updateStop);
        }

        function updateStop(result) {

            // toggle favourite status
            scope.stop.favourite = scope.stop.favourite === 0 ? 1 : 0;

            // Set the favourite status indicator
            var starType = scope.stop.favourite === 0 ? 'star_border' : 'star';
            star.text(starType);
        }

        console.log('Stop directive');
    }
}

function aeStops(dBService) {

    var aeStops = {
        template: '<ae-menu-bar title="Stops" ng-cloak></ae-menu-bar>' + '<ae-stop ng-repeat="stop in stops.stops | limitTo: 100 | filter: {number: search}" ' + 'data-stop="stop"></ae-stop>',
        scope: {},
        controller: controller,
        controllerAs: 'stops',
        link: link
    };

    return aeStops;

    function controller() {

        var vm = this;
        dBService.get('stops').then(function (stops) {
            return vm.stops = stops;
        });
        // vm.stopsList = stopsList;
    }

    function link() {}
}
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

exports.aeStop = aeStop;
exports.aeStops = aeStops;
exports.nextTrips = nextTrips;
exports.nextTripsError = nextTripsError;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stopDetailController = require('./stop-detail.controller.js');

var _stopsService = require('./stops.service.js');

var _stopsConfig = require('./stops.config.js');

var _stopsDirectives = require('./stops.directives.js');

// import {dBMod} from '../database/database.module.js';

angular.module('stopsMod', []).config(_stopsConfig.stopsConfig).controller('StopDetailCtrl', _stopDetailController.StopDetailCtrl).directive('nextTrips', _stopsDirectives.nextTrips).directive('nextTripsError', _stopsDirectives.nextTripsError).directive('aeStop', _stopsDirectives.aeStop).directive('aeStops', _stopsDirectives.aeStops).service('stopsService', _stopsService.stopsService);

exports.default = angular.module('stopsMod');

},{"./stop-detail.controller.js":11,"./stops.config.js":12,"./stops.directives.js":13,"./stops.service.js":15}],15:[function(require,module,exports){
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

            var _routes = parseRoutes(result.Routes);
            _routes.forEach(function (route) {
                route.Trips = parseTrips(route.Trips);
            });

            return { 'error': result.Error, 'routes': _routes };
        }
    }
}

function parseTrips(trips) {

    var _trips = void 0;
    if (typeof trips === 'undefined') {
        _trips = [];
    } else if (typeof trips.Trip !== 'undefined') {
        _trips = [trips.Trips];
    } else {
        _trips = trips;
    }

    return _trips;
}

function parseRoutes(routes) {

    var _routes = void 0;
    if (typeof routes.Route !== 'undefined') {

        // if route.Route is not an array return it as an array, else return as is
        _routes = Array.isArray(routes.Route) ? routes.Route : [routes.Route];
    } else {
        _routes = routes;
    }

    return _routes;
}
exports.stopsService = stopsService;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function aeMenuBar() {

    var aeMenuBar = {
        templateUrl: 'views/menu-bar.html',
        link: link
    };

    return aeMenuBar;

    function link(scope, element, attrs) {

        // console.log(attrs.title);
        scope.title = attrs.title;
        angular.element(document).on('click', handleTouch);

        function handleTouch(event) {

            var parents = angular.element(event.target).parents('#sidenav-container');
            var inSidenav = parents.length;
            var isNavIcon = angular.element(event.target).hasClass('nav-icon');
            var isDisplayed = angular.element('#sidenav-container').css('display');

            // console.log(parents)
            if (!inSidenav && isDisplayed) {
                angular.element('#sidenav-container').css('display', 'none');
            }

            if (isNavIcon) {
                angular.element('#sidenav-container').css('display', 'block');
            }
        }
        console.log('Route directive link fn');
    }
}

exports.aeMenuBar = aeMenuBar;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utilDirectives = require('./util.directives.js');

angular.module('appUtil', []).directive('aeMenuBar', _utilDirectives.aeMenuBar);

exports.default = angular.module('appUtil');

},{"./util.directives.js":16}]},{},[1]);
