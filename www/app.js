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
        template: '<ul class="list-unstyled" style="list-style: none; background-color: grey; height: auto; margin-bottom: 0">' + '<span style="color: white">' + '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/routes">Routes</a></li> ' + '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/stops">Stops</a></li>' + '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/favourites">Favourites</a></li>' + '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/nearby">Nearby</a></li>' + '</span>' + '</ul>',

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

},{"./database/database.module.js":4,"./favourites/favourites.module.js":8,"./routes/routes.module.js":11,"./stops/stops.module.js":14,"./util/util.module.js":16}],2:[function(require,module,exports){
'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OCService = undefined;

var _Parser = require('./Parser.js');

OCService.$inject = ['$http', 'config'];

function OCService($http, config) {

    var OC = {
        getNextTrips: getNextTrips
    };

    return OC;

    /*-------------------Factory function definitions-------------------------*/

    function getNextTrips(stopNo) {

        var baseUrl = window.isphone ? 'https://api.octranspo1.com/v1.2' : 'http://localhost:3000/v1.2';
        var OCCONFIG = window._env.OC;
        var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }; // Content-Type must be x-www-form-urlencoded.
        var url = baseUrl + '/GetNextTripsForStopAllRoutes';
        var data = 'appID=' + OCCONFIG.APP_ID + '&apiKey=' + OCCONFIG.API_KEY + '&stopNo=' + stopNo + '&format=json';

        return $http.post(url, data, headers).then(handleRes, handleErr);

        function handleRes(response) {

            var getRouteSummaryForStopResult = response.data.GetRouteSummaryForStopResult;

            // Deep clone result
            var result = JSON.parse(JSON.stringify(getRouteSummaryForStopResult));
            if (result.Error !== '') {
                return result;
            }

            var _routes = _Parser.Parser.parseRoutes(result);
            return { 'error': result.Error, 'routes': _routes };
        }
    }

    function handleErr() {
        alert('Unable to call ' + url);
    }
}

exports.OCService = OCService;

},{"./Parser.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = exports.Parser = function () {
    function Parser() {
        _classCallCheck(this, Parser);
    }

    _createClass(Parser, null, [{
        key: "readable",
        value: function readable(duration) {
            var hour = Math.floor(duration / 60);
            var minute = duration % 60;

            var duration_string = hour > 0 ? "In " + hour + " hr " + minute + " min" : "In " + minute + " min";
            return duration_string;
        }
    }, {
        key: "parseRoutes",
        value: function parseRoutes(data) {

            var parseData = {
                "Error": data.Error,
                "Routes": data.Routes.Route,
                "StopDescription": data.StopDescription,
                "StopNo": data.StopNo

            };

            if (typeof parseData.Routes === 'undefined') {
                return [];
            }

            if (!Array.isArray(parseData.Routes)) {
                parseData.Routes = [parseData.Routes];
            }

            parseData.Routes.forEach(function (route, index, self) {
                if (Array.isArray(route.Trips)) {
                    return;
                } else if (typeof route.Trips === 'undefined') {
                    route.Trips = [];
                } else {
                    route.Trips = [route.Trips];
                }
            });

            parseData.Routes = Parser.sortRoutesByTrips(parseData.Routes);

            return parseData.Routes;
        }
    }, {
        key: "sortRoutesByTrips",
        value: function sortRoutesByTrips(routes) {

            var _routesSchdeuled = [];
            var _routesUnscheduled = [];
            var _sortedRoutes = [];

            routes.forEach(function (route, index, self) {
                if (route.Trips.length == 0) _routesUnscheduled.push(route);else {
                    _routesSchdeuled.push(route);
                }
            });

            _sortedRoutes = _routesSchdeuled.concat(_routesUnscheduled);
            return _sortedRoutes;
        }
    }]);

    return Parser;
}();

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _databaseService = require('./database.service.js');

var _OCService = require('./OC.service.js');

angular.module('dBMod', []).constant('DATABASE', 'octranspo').factory('OCService', _OCService.OCService).factory('dBService', _databaseService.dBService);

exports.default = angular.module('dBMod');

},{"./OC.service.js":2,"./database.service.js":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

dBService.$inject = ['$q', 'DATABASE'];

function dBService($q, DATABASE) {

	var db = void 0;

	if (!window.isphone) {
		db = openDatabase(DATABASE, '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB;
	} else {
		var handleDb = function handleDb(dbb) {
			alert('Opened db using sqlite plugin');
		};

		var handleErr = function handleErr(err) {
			alert("Sqlite plugin can't open db " + JSON.stringify(err));
		};

		var options = { name: "octranspo.db", location: 0 };
		db = window.sqlitePlugin.openDatabase(options, handleDb, handleErr);
	}

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

	/*-------------------------------------------------------------------------
   Reads the stops of each route and for EVERY stop reads the stop
   information from the STOPS table using the stop NUMBER.
 ---------------------------------------------------------------------------*/

	function getStops(route) {

		var defer = $q.defer();
		db.transaction(handleTx, handleErr);

		function handleTx(tx) {
			tx.executeSql('SELECT * FROM routes WHERE id = ?', [route.id], handleRes, handleErr);
		}

		function handleRes(tx, result) {

			var data = result.rows.item(0);
			var stops = [];
			var _stops = data.stops.split('\t');

			// Get stop number from each stop name stop number string.
			// No duplicate values
			// TODO. Fix this in source data
			var uniqueStopNumbers = new Set(_stops.map(function (stop) {
				return parseInt(stop.split(' ')[0]);
			}));

			// Must convert to array in order to sort
			var orderedStopNumbers = [].concat(_toConsumableArray(uniqueStopNumbers)).sort();

			// Get stop data fro every stop
			orderedStopNumbers.forEach(function (number) {
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function aeFaves(dBService) {

    var aeFaves = {
        templateUrl: 'partials/faves.html',
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

            // Target is already the active tab
            if (angular.element(this).hasClass('tab-active')) {
                return;
            }

            var targetTab = angular.element(this).attr('id');
            var targetTabContent = targetTab + '-content';
            var otherTab = targetTab === 'stops-tab' ? 'routes-tab' : 'stops-tab';
            var otherTabContent = otherTab + '-content';

            // Show clicked tab content
            angular.element('#' + targetTabContent).css('display', 'block');
            angular.element(this).addClass('tab-active');

            // Hide other content
            angular.element('#' + otherTabContent).css('display', 'none');
            angular.element('#' + otherTab).removeClass('tab-active');
        });
    }

    return;
}

exports.aeFaves = aeFaves;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _favouritesDirectives = require('./favourites.directives.js');

var _favouritesConfig = require('./favourites.config.js');

angular.module('favesMod', []).config(_favouritesConfig.favesConfig).directive('aeFaves', _favouritesDirectives.aeFaves);

exports.default = angular.module('favesMod');

},{"./favourites.config.js":6,"./favourites.directives.js":7}],9:[function(require,module,exports){
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
    .when('/routes/:id', {
        template: '<ae-route-details></ae-route-details>'
    });
}

exports.routesConfig = routesConfig;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeRoute.inject = ['dBService'];
aeRoutes.inject = ['dBService'];
aeRouteDetails.inject = ['$location', '$route', 'dBService'];
aeRouteTripsCard.inject = ['dBService'];

function aeRoutes(dBService) {

    var aeRoutes = {
        template: '<ae-menu-bar icon="menu" title="Routes" search="routes.search"></ae-menu-bar>' + '<ae-route ng-repeat="route in routes.routes | limitTo: 100 | filter: {name: routes.search}"' + 'data-route="route" ></ae-route>',

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

function aeRoute(dBService) {

    var aeRoute = {
        templateUrl: 'partials/route.directive.html',
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
            dBService.set('routes', { favourite: _favourite }, { name: scope.route.name }).then(updateRoute);
        }

        function updateRoute(result) {

            // toggle favourite status
            scope.route.favourite = scope.route.favourite === 0 ? 1 : 0;

            // Set the favourite status indicator
            var starType = scope.route.favourite === 0 ? 'star_border' : 'star';
            star.text(starType);
        }
    }
}

function aeRouteDetails($location, $route, dBService) {

    var aeRouteDetails = {
        template: '<ae-tall-menu-bar icon="arrow_back" title-heading="{{route.routeDetails.number}}" title={{route.routeDetails.name}} search=route.search>' + '</ae-tall-menu-bar>' + '<ae-stop ng-repeat="stop in route.routeDetails.stops | filter: {number: route.search}" data-stop="stop">' + '</ae-stop>',

        scope: {},
        bindToController: true,
        controller: controller,
        controllerAs: 'route'
    };

    return aeRouteDetails;

    function controller() {

        var vm = this;

        // route id
        var id = $route.current.params.id;

        // Get route details from database
        dBService.getStops({ id: id }).then(function (details) {
            return vm.routeDetails = details;
        });
    }

    // function link(scope, element, attrs) {
    //
    // }
}

function aeRouteTripsCard(dBService) {

    var aeRouteTripsCard = {
        templateUrl: 'partials/route-trips-card.html',
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
        // angular.element('.material-icons').click(() => {
        //     //
        // })
    }
}
exports.aeRoute = aeRoute;
exports.aeRoutes = aeRoutes;
exports.aeRouteDetails = aeRouteDetails;
exports.aeRouteTripsCard = aeRouteTripsCard;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _routesConfig = require('./routes.config.js');

var _routesDirectives = require('./routes.directives.js');

angular.module('routesMod', []).config(_routesConfig.routesConfig).directive('aeRoute', _routesDirectives.aeRoute).directive('aeRoutes', _routesDirectives.aeRoutes).directive('aeRouteTripsCard', _routesDirectives.aeRouteTripsCard).directive('aeRouteDetails', _routesDirectives.aeRouteDetails);

exports.default = angular.module('routesMod');

},{"./routes.config.js":9,"./routes.directives.js":10}],12:[function(require,module,exports){
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
    .when('/stops/:code', {
        template: '<ae-stop-next-trips></ae-stop-next-trips>'
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
aeStopNextTrips.inject = ['$route', 'dBService', 'OCService '];

function aeStops(dBService) {

    var aeStops = {
        template: '<ae-menu-bar icon="menu" title="Stops" search="stops.search"></ae-menu-bar>' + '<ae-stop ng-repeat="stop in stops.stops  | limitTo: stops.displayLimit | filter: {number: stops.search}" track by stop.number ' + 'data-stop="stop"></ae-stop>',

        scope: {},
        controller: controller,
        bindToController: true,
        controllerAs: 'stops',
        link: link
    };

    return aeStops;

    function controller($scope, $window) {

        var vm = this;

        // Number of stops to display
        vm.displayLimit = 90;

        // Get all stops
        dBService.get('stops').then(function (stops) {
            return vm.stops = stops;
        });

        // Look for user scrolling
        angular.element($window).scroll(handleScroll);

        // When user scrolls increase displayed stops by 10
        function handleScroll() {

            if (vm.displayLimit > vm.stops.length) {
                return;
            }
            vm.displayLimit = vm.displayLimit + 10;
            // I know, tried very hard to get rid of $scope
            $scope.$apply();
        }
    }

    function link(scope, element, attrs) {
        // angular.element(window).scroll(() => {
        //     scope.stops.limit = scope.stops.limit + 50;
        //     console.log(scope.stops.limit);
        //     console.log('Scrolling');
        // });
    }
}

function aeStop(dBService) {

    var aeStop = {
        templateUrl: 'partials/stop.directive.html',
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
            dBService.set('stops', { favourite: _favourite }, { code: scope.stop.code }).then(updateStop);
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

function aeStopNextTrips($location, $route, dBService, OCService) {

    var aeStopNextTrips = {
        template: '<ae-tall-menu-bar title-heading="{{stopNextTrips.stop.number}}" title={{stopNextTrips.stop.name}} icon="arrow_back">' + '</ae-tall-menu-bar>' + '<ae-route-trips-card ng-repeat="route in stopNextTrips.routes" data-route="route" trips="route.Trips">' + '</ae-route-trips-card>' + '<div ng-show="stopNextTrips.routes.length === 0"> No trips scheduled for this stop</div>',

        scope: {},
        controller: controller,
        controllerAs: 'stopNextTrips'
    };

    return aeStopNextTrips;

    function controller() {

        var vm = this;

        // stop number from the URL
        var code = $route.current.params.code;
        var number = $location.search().number;
        console.log(code);
        console.log($location.search());

        // Get stop information from database in an array
        dBService.get('stops', { code: code }).then(function (stop) {
            return vm.stop = stop[0];
        });

        // Get next 3 trips for routes serving stop
        OCService.getNextTrips(number).then(function (result) {

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
        templateUrl: 'partials/next-trips-error.html'
    };

    return nextTripsError;
}

exports.aeStop = aeStop;
exports.aeStops = aeStops;
exports.aeStopNextTrips = aeStopNextTrips;
exports.nextTripsError = nextTripsError;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stopsConfig = require('./stops.config.js');

var _stopsDirectives = require('./stops.directives.js');

angular.module('stopsMod', []).config(_stopsConfig.stopsConfig).directive('nextTripsError', _stopsDirectives.nextTripsError).directive('aeStop', _stopsDirectives.aeStop).directive('aeStops', _stopsDirectives.aeStops).directive('aeStopNextTrips', _stopsDirectives.aeStopNextTrips);

exports.default = angular.module('stopsMod');

},{"./stops.config.js":12,"./stops.directives.js":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function aeMenuBar() {

    var aeMenuBar = {
        templateUrl: 'partials/menu-bar.html',
        scope: {
            title: '@',
            icon: '@',
            search: '='
        },
        // controller: controller,
        link: link
    };

    return aeMenuBar;

    // function controller() {}

    function link(scope, element, attrs) {

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
        templateUrl: 'partials/tall-menu-bar.html',
        scope: {
            title: '@',
            titleHeading: '@'
        },
        // controller: controller,
        link: link
    };

    return aeTallMenuBar;

    // function controller() {}

    function link(scope, element, attrs) {

        // element.find only works with tag names
        var backBtn = angular.element(document).find('i.back-btn');

        // Click/Touch on Android go back one page
        angular.element(backBtn).on('click', function () {
            return navigator.app.backHistory();
        });
    }
}
exports.aeMenuBar = aeMenuBar;
exports.aeTallMenuBar = aeTallMenuBar;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utilDirectives = require('./util.directives.js');

angular.module('appUtil', []).directive('aeMenuBar', _utilDirectives.aeMenuBar).directive('aeTallMenuBar', _utilDirectives.aeTallMenuBar);

exports.default = angular.module('appUtil');

},{"./util.directives.js":15}]},{},[1]);
