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

},{"./database/database.module.js":2,"./favourites/favourites.module.js":6,"./routes/routes.module.js":9,"./stops/stops.module.js":12,"./util/util.module.js":15}],2:[function(require,module,exports){
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

Object.defineProperty(exports, "__esModule", {
    value: true
});
routesConfig.$inject = ['$routeProvider'];

function routesConfig($routeProvider) {

    $routeProvider
    // Get all routes
    .when('/routes', {
        template: '<ae-routes></ae-routes>'
    })

    // Get all stops for bus number 'number'
    .when('/routes/:number', {
        template: '<ae-route-details></ae-route-details>'
    });
}

exports.routesConfig = routesConfig;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeRoute.inject = ['dBService'];
aeRoutes.inject = ['dBService'];
aeRouteDetails.inject = ['$location', 'dBService'];
aeRouteTripsCard.inject = ['dBService'];

function aeRoute(dBService) {

    var aeRoute = {
        templateUrl: 'views/route.directive.html',
        scope: {
            route: '='
        },
        // controller: controller
        link: link
    };

    return aeRoute;

    // function controller() {}

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
        template: '<ae-menu-bar icon="menu" title="Routes" ng-cloak></ae-menu-bar>' + '<ae-route ng-repeat="route in routes.routes | limitTo: 100 |filter: {name: search, number: search}"' + 'data-route="route" ></ae-route>',

        controller: controller,
        controllerAs: 'routes',
        scope: {}
    };

    return aeRoutes;

    function controller(dBService) {

        var vm = this;
        dBService.get('routes').then(function (routes) {
            return vm.routes = routes;
        });
    }

    // function link() {}
}

function aeRouteDetails($location, dBService) {

    var aeRouteDetails = {
        template: '<ae-menu-bar icon="arrow_back" title={{route.title}}></ae-menu-bar>' + '<ae-stop ng-repeat="stop in route.routeDetails.stops | limitTo: 100 | filter: {number: search}" ' + 'data-stop="stop"></ae-stop>',
        scope: {},
        controller: controller,
        controllerAs: 'route',
        link: link
    };

    return aeRouteDetails;

    function controller() {

        var vm = this;

        // Get route name from query string
        var name = $location.search().name;
        vm.title = name;

        // Get route details from database
        dBService.getStops({ 'name': name }).then(function (details) {
            vm.routeDetails = details;
            // console.log(details);
        });
    }

    function link(scope, element, attrs) {}
}

function aeRouteTripsCard(dBService) {

    var aeRouteTripsCard = {
        templateUrl: '/views/route-trips-card.html',
        scope: {
            route: '=',
            trips: '='
        },
        // controller: controller,
        link: link
    };

    return aeRouteTripsCard;

    // function controller() {}

    function link(scope, element, attrs) {
        angular.element('.material-icons').click(function () {
            console.log('Clicked icon ');
        });
        console.log('Route card link function');
    }
}
exports.aeRoute = aeRoute;
exports.aeRoutes = aeRoutes;
exports.aeRouteDetails = aeRouteDetails;
exports.aeRouteTripsCard = aeRouteTripsCard;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _routesConfig = require('./routes.config.js');

var _routesDirectives = require('./routes.directives.js');

angular.module('routesMod', []).config(_routesConfig.routesConfig).directive('aeRoute', _routesDirectives.aeRoute).directive('aeRoutes', _routesDirectives.aeRoutes).directive('aeRouteTripsCard', _routesDirectives.aeRouteTripsCard).directive('aeRouteDetails', _routesDirectives.aeRouteDetails);

exports.default = angular.module('routesMod');

},{"./routes.config.js":7,"./routes.directives.js":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
stopsConfig.$inject = ['$routeProvider'];

function stopsConfig($routeProvider) {

    $routeProvider
    // Get all stops
    .when('/stops', {
        template: '<ae-stops></ae-stops>'
    })

    // Show next 3 next trips for all routes serving stop number 'stopNo'
    .when('/stops/:stopNo', {
        template: '<ae-stop-next-trips></ae-stop-next-trips>'
    });
}

exports.stopsConfig = stopsConfig;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeStop.inject = ['dBService'];
aeStops.inject = ['dBService'];
aeStopNextTrips.inject = ['$route', 'dBService', 'stopsService'];

function aeStops(dBService) {

    var aeStops = {
        template: '<ae-menu-bar icon="menu" title="Stops" ng-cloak></ae-menu-bar>' + '<ae-stop ng-repeat="stop in stops.stops | limitTo: 100 | filter: {number: search}" ' + 'data-stop="stop"></ae-stop>',
        scope: {},
        controller: controller,
        controllerAs: 'stops'
    };

    return aeStops;

    function controller() {

        var vm = this;
        dBService.get('stops').then(function (stops) {
            return vm.stops = stops;
        });
    }

    // function link() {}
}

function aeStop(dBService) {

    var aeStop = {
        templateUrl: 'views/stop.directive.html',
        scope: {
            stop: '='
        },
        // controller: controller,
        controllerAs: 'stop',
        link: link
    };

    return aeStop;

    // function controller() {}

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
    }
}

function aeStopNextTrips($route, dBService, stopsService) {

    var aeStopNextTrips = {
        template: '<ae-tall-menu-bar title-heading="{{stopNextTrips.stop.number}}" title={{stopNextTrips.stop.name}} icon="arrow_back"></ae-tall-menu-bar>' + '<ae-route-trips-card ng-repeat="route in stopNextTrips.routes" data-route="route" trips="route.Trips"></ae-route-trips-card>',
        scope: {},
        controller: controller,
        controllerAs: 'stopNextTrips'
    };

    return aeStopNextTrips;

    function controller() {

        var vm = this;

        // stop number from the URL
        var stopNo = $route.current.params.stopNo;

        // Get stop information from database in an array
        dBService.get('stops', { number: stopNo }).then(function (stop) {
            return vm.stop = stop[0];
        });

        // Get next 3 trips for routes serving stop
        stopsService.getNextTrips(stopNo).then(function (result) {

            // An error field is always present in trip information
            vm.error = result.error;

            // Array of routes with each route containing array of 3 trips
            vm.routes = result.routes;
        });
    }

    // function link() {}
}

function nextTripsError() {

    var nextTripsError = {
        templateUrl: '/views/next-trips-error.html'
    };

    return nextTripsError;
}

exports.aeStop = aeStop;
exports.aeStops = aeStops;
exports.aeStopNextTrips = aeStopNextTrips;
exports.nextTripsError = nextTripsError;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stopsService = require('./stops.service.js');

var _stopsConfig = require('./stops.config.js');

var _stopsDirectives = require('./stops.directives.js');

angular.module('stopsMod', []).config(_stopsConfig.stopsConfig).directive('nextTripsError', _stopsDirectives.nextTripsError).directive('aeStop', _stopsDirectives.aeStop).directive('aeStops', _stopsDirectives.aeStops).directive('aeStopNextTrips', _stopsDirectives.aeStopNextTrips).service('stopsService', _stopsService.stopsService);

exports.default = angular.module('stopsMod');

},{"./stops.config.js":10,"./stops.directives.js":11,"./stops.service.js":13}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

        scope.title = attrs.title;
        scope.icon = attrs.icon;

        angular.element(document).on('click', handleTouch);

        function handleTouch(event) {

            var parents = angular.element(event.target).parents('#sidenav-container');
            var inSidenav = parents.length;
            var isNavIcon = angular.element(event.target).hasClass('nav-icon');
            var isDisplayed = angular.element('#sidenav-container').css('display');

            // Clicks outside a visible nav bar close the nav bar
            if (!inSidenav && isDisplayed) {
                angular.element('#sidenav-container').css('display', 'none');
            }

            // Click on menu icon to open nav bar
            if (isNavIcon) {
                angular.element('#sidenav-container').css('display', 'block');
            }
        }
    }
}

function aeTallMenuBar() {

    var aeTallMenuBar = {
        templateUrl: 'views/tall-menu-bar.html',
        scope: {
            title: '@',
            titleHeading: '@'
        },
        link: link
    };

    return aeTallMenuBar;

    function link(scope, element, attrs) {

        console.log(attrs);
        // scope.title = attrs.title;
        // scope.icon = attrs.icon;
        // scope.titleHeading = attrs.titleHeading;

        // angular.element(document).on('click', handleTouch);

        function handleTouch(event) {

            var parents = angular.element(event.target).parents('#sidenav-container');
            var inSidenav = parents.length;
            var isNavIcon = angular.element(event.target).hasClass('nav-icon');
            var isDisplayed = angular.element('#sidenav-container').css('display');

            // Clicks outside a visible nav bar close the nav bar
            if (!inSidenav && isDisplayed) {
                angular.element('#sidenav-container').css('display', 'none');
            }

            // Click on menu icon to open nav bar
            if (isNavIcon) {
                angular.element('#sidenav-container').css('display', 'block');
            }
        }
    }
}
exports.aeMenuBar = aeMenuBar;
exports.aeTallMenuBar = aeTallMenuBar;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utilDirectives = require('./util.directives.js');

angular.module('appUtil', []).directive('aeMenuBar', _utilDirectives.aeMenuBar).directive('aeTallMenuBar', _utilDirectives.aeTallMenuBar);

exports.default = angular.module('appUtil');

},{"./util.directives.js":14}]},{},[1]);
