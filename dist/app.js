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

var _nearbyModule = require('./nearby/nearby.module.js');

angular.module('busTrackerApp', ['ngRoute', 'dBMod', 'favesMod', 'routesMod', 'stopsMod', 'appUtil', 'app_nearby']).config(config).constant('config', { OC_URL: 'http://localhost:3000/v1.2' }).constant("OC", {
    APP_ID: "c618159f",
    API_KEY: "77207661c5c94208c33fb2357efc7012"
}).controller('MainCtrl', MainCtrl);

function config($routeProvider, $httpProvider, OCServiceProvider, dBServiceProvider, OC) {

    dBServiceProvider.setDB(window.db);

    OCServiceProvider.setHttpOptions({
        url: window.url,
        appId: OC.APP_ID,
        apiKey: OC.API_KEY,
        httpConfig: {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
    });

    $routeProvider.when('/', {
        template: '<ul class="list-unstyled" style="list-style: none; background-color: grey; height: auto; margin-bottom: 0">' + '<span style="color: white">' + '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/routes">Routes</a></li> ' + '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/stops">Stops</a></li>' + '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/favourites">Favourites</a></li>' + '<li style="float: left; width: 25%; text-align: center"><a ng-href="#/nearby">Nearby</a></li>' + '</span>' + '</ul>',

        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
            routes: function routes(dBService) {
                return dBService.get('routes');
            },
            stops: function stops(dBService) {
                return dBService.get('stops');
            }
        }
    }).otherwise({
        redirectTo: '/'
    });
}

MainCtrl.inject = ['$rootScope', 'dataService', 'stops', 'routes'];
function MainCtrl($rootScope, dataService, routes, stops) {

    dataService.setStopsDataset(stops);
    dataService.setRoutesDataset(routes);

    $rootScope.$on('$routeChangeError', function (event, prev, next) {
        console.log('Unable to reach ' + next);
    });
}

},{"./database/database.module.js":5,"./favourites/favourites.module.js":9,"./nearby/nearby.module.js":12,"./routes/routes.module.js":19,"./stops/stops.module.js":24,"./util/util.module.js":26}],2:[function(require,module,exports){
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

// OCService.$inject = [];

function OCService() {

    //Injections
    var $http = void 0;

    // settings
    var url = void 0,
        data = void 0,
        appId = void 0,
        apiKey = void 0;
    var httpConfig = {};

    var setHttpOptions = function setHttpOptions(options) {
        url = options.url;
        appId = options.appId;
        apiKey = options.apiKey;
        httpConfig = options.httpConfig;
    };

    var get = function get(_$http_, _config_) {
        $http = _$http_;
        return { getNextTrips: getNextTrips };
    };

    return { setHttpOptions: setHttpOptions, $get: get };
    /*-------------------Factory function definitions-------------------------*/
    // let $get = ['$http', 'config', function($http, config) {return {getNextTrips: getNextTrips}}];

    function getNextTrips(stopNo) {

        data = 'appID=' + appId + '&apiKey=' + apiKey + '&stopNo=' + stopNo + '&format=json';

        return $http.post(url, data, httpConfig).then(handleRes, function (err) {
            return alert('Unable to call ' + url);
        });

        function handleRes(response) {

            var getRouteSummaryForStopResult = response.data.GetRouteSummaryForStopResult;
            var result = JSON.parse(JSON.stringify(getRouteSummaryForStopResult));
            if (result.Error !== '') {
                return result;
            }
            var _routes = _Parser.Parser.parseRoutes(result);
            return { 'error': result.Error, 'routes': _routes };
        }
    }
}exports.OCService = OCService;

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

            // {Error_, Routes, StopDescription, StopNo} = data;

            var parseData = {
                "Error": data.Error,
                "Routes": data.Routes.Route,
                "StopDescription": data.StopDescription,
                "StopNo": data.StopNo

            };

            if (data.Error !== '') {
                return data;
            }

            if (typeof parseData.Routes === 'undefined') {
                return [];
            }

            if (!Array.isArray(parseData.Routes)) {
                parseData.Routes = [parseData.Routes];
            }

            parseData.Routes.forEach(function (route, index, self) {
                // console.log(route.Trips);

                try {
                    if (Array.isArray(route.Trips.Trip)) {
                        route.Trips = route.Trips.Trip;
                    }
                } catch (TypeError) {
                    if (typeof route.Trips === 'undefined') {
                        route.Trips = [];
                    } else if (!Array.isArray(route.Trips)) {
                        route.Trips = [route.Trips];
                    }
                }
                return;
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
                if (route.Trips.length === 0) {
                    _routesUnscheduled.push(route);
                } else {
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
dataService.$inject = ['dBService'];

function dataService(dBService) {

    var stops = void 0,
        routes = void 0;
    var routeFields = ['name', 'stops', 'favourite', 'number', 'id'];
    var stopFields = ['name', 'number', 'code', 'lat', 'lon', 'type', 'favourite'];

    var setStopsDataset = function setStopsDataset(stopsDataSet) {
        return stops = stopsDataSet;
    };
    var setRoutesDataset = function setRoutesDataset(routesDataSet) {
        return routes = routesDataSet;
    };
    var getFields = function getFields(fields, obj) {
        var obj_ = {};
        fields.forEach(function (field) {
            return obj_[field] = obj[field];
        });
        return obj_;
    };

    function getRoutes() {
        var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : routeFields;
        var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (route) {
            return true;
        };


        return dBService.get('routes').then(function (routes) {
            return routes.filter(selector).map(function (route) {
                return getFields(fields, route);
            });
        });
    }

    function getStops() {
        var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : stopFields;
        var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (stop) {
            return true;
        };


        return dBService.get('stops').then(function (stops) {
            return stops.filter(selector).map(function (stop) {
                return getFields(fields, stop);
            });
        });
    }

    function setRoutes(updates, selector) {

        var routes_ = [];
        // Assign updates to routes that meet selector condition
        dBService.set('routes', updates).then(function () {
            routes_ = routes.filter(selector).map(function (route) {
                return Object.assign(route, updates);
            });
        });

        return routes_;
    }

    function setStops(updates, selector) {

        var stops_ = [];
        // Assign updates to stops that meet selector condition
        dBService.set('stops', updates).then(function () {
            stops_ = routes.filter(selector).map(function (route) {
                return Object.assign(route, updates);
            });
        });

        return stops_;
    }

    var data = { getStops: getStops, getRoutes: getRoutes, setRoutes: setRoutes,
        setStopsDataset: setStopsDataset, setRoutesDataset: setRoutesDataset, stops: stops, routes: routes };

    return data;
}

exports.dataService = dataService;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _databaseService = require('./database.service.js');

var _OCService = require('./OC.service.js');

var _dataService = require('./data.service.js');

angular.module('dBMod', []).constant('DATABASE', 'octranspo').provider('OCService', _OCService.OCService).provider('dBService', _databaseService.dBService).factory('dataService', _dataService.dataService);

exports.default = angular.module('dBMod');

},{"./OC.service.js":2,"./data.service.js":4,"./database.service.js":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function dBService() {

	var db = void 0;
	var $q = void 0;

	var setDB = function setDB(db_) {
		return db = db_;
	};

	var $get = function $get(_$q_) {
		$q = _$q_;
		return { get: get, set: set, getStops: getStops };
	};

	return { $get: $get, setDB: setDB };

	/*-------------------Factory function definitions-------------------------*/

	function get(table, filter) {

		var defer = $q.defer();

		db.transaction(handleTx, function (tx, err) {
			console.log(err);defer.reject(err);
		});

		function handleTx(tx) {

			if (typeof filter === 'undefined') {
				tx.executeSql('SELECT * FROM ' + table + ' ORDER BY number', [], handleRes, function (tx, err) {
					console.log(err);defer.reject(err);
				});
			} else {
				var _Object$keys = Object.keys(filter);

				var _Object$keys2 = _slicedToArray(_Object$keys, 1);

				var key = _Object$keys2[0];

				var value = filter[key];

				tx.executeSql('SELECT * FROM ' + table + ' WHERE ' + key + ' = ?', [value], handleRes, function (tx, err) {
					console.log(err);defer.reject(err);
				});
			}
		}

		function handleRes(tx, result) {
			return defer.resolve(parseRes(result));
		}
		return defer.promise;
	}

	function set(table, setting, filter) {
		var _Object$keys3 = Object.keys(setting);

		var _Object$keys4 = _slicedToArray(_Object$keys3, 1);

		var setKey = _Object$keys4[0];

		var setValue = setting[setKey];

		var _Object$keys5 = Object.keys(filter);

		var _Object$keys6 = _slicedToArray(_Object$keys5, 1);

		var filterKey = _Object$keys6[0];

		var filterValue = filter[filterKey];

		var defer = $q.defer();

		db.transaction(handleTx, function (tx, err) {
			console.log(err);defer.reject(err);
		});

		function handleTx(tx, result) {
			tx.executeSql('UPDATE ' + table + ' SET ' + setKey + ' = ? WHERE ' + filterKey + ' = ?', [setValue, filterValue], handleRes, function (tx, err) {
				console.log(err);defer.reject(err);
			});
		}

		function handleRes(tx, result) {
			return defer.resolve(result.rows);
		}

		return defer.promise;
	}

	/*-------------------------------------------------------------------------
   Reads the stops of each route and for EVERY stop reads the stop
   information from the STOPS table using the stop NUMBER.
 ---------------------------------------------------------------------------*/

	function getStops(route) {

		var defer = $q.defer();
		db.transaction(handleTx, function (tx, err) {
			console.log(err);defer.reject(err);
		});

		function handleTx(tx) {
			tx.executeSql('SELECT * FROM routes WHERE id = ?', [route.id], handleRes, function (tx, err) {
				console.log(err);defer.reject(err);
			});
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

		return defer.promise;
	}
}

function _handleErr(tx, err) {
	return defer.reject(err);
}

function parseRes(result) {

	var data = [];
	for (var i = 0; i < result.rows.length; i++) {
		data.push(result.rows.item(i));
	}

	return data;
}

exports.dBService = dBService;

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
            return vm.routes = routes;
        });
        dBService.get('stops', { 'favourite': 1 }).then(function (stops) {
            return vm.stops = stops;
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

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _favouritesDirectives = require('./favourites.directives.js');

var _favouritesConfig = require('./favourites.config.js');

angular.module('favesMod', []).config(_favouritesConfig.favesConfig).directive('aeFaves', _favouritesDirectives.aeFaves);

exports.default = angular.module('favesMod');

},{"./favourites.config.js":7,"./favourites.directives.js":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.config = config;
function config($routeProvider) {
    $routeProvider.when('/nearby', {
        template: '<ae-nearby></ae-nearby>'
    });
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeNearby.$inject = ['dataService', 'nearbyService'];

function aeNearby() {

    var Nearby = {
        template: '<ae-menu-bar icon="menu" title="Nearby" search="nearby.search"> </ae-menu-bar>' + '<ae-stop ng-repeat="stop in nearby.stops | filter: {name: nearby.search}" stop="stop" ></ae-stop>',
        scope: {
            stops: '='
        },
        controller: NearbyCtrl,
        controllerAs: 'nearby'
    };
    return Nearby;
}

function NearbyCtrl(dataService, nearbyService) {

    var vm = this;
    var location = { lat: 45.431566, lon: -75.684647 };

    var _selector = function _selector(stop) {
        return nearbyService.isNearby(location, stop);
    };
    var _fields = ['name', 'number', 'code', 'favourite', 'lat', 'lon'];
    dataService.getStops(_fields, _selector).then(function (stops) {
        return vm.stops = stops;
    });
}

exports.aeNearby = aeNearby;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nearbyService = require('./nearby.service.js');

var _nearbyDirective = require('./nearby.directive.js');

var _nearbyConfig = require('./nearby.config.js');

angular.module('app_nearby', []).config(_nearbyConfig.config).factory('nearbyService', _nearbyService.nearbyService).directive('aeNearby', _nearbyDirective.aeNearby);

exports.default = angular.module('app_nearby');

},{"./nearby.config.js":10,"./nearby.directive.js":11,"./nearby.service.js":13}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function nearbyService() {

    return { isNearby: isNearby };
}

function isNearby(location, stop) {

    // Earth's radius in km
    var R = 6373;
    var stopLat = stop.lat * Math.PI / 180;
    var locationLat = location.lat * Math.PI / 180;

    var dlon = (location.lon - stop.lon) * Math.PI / 180;
    var dlat = (location.lat - stop.lat) * Math.PI / 180;

    // haversine formula
    var hav = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(locationLat) * Math.cos(stopLat) * Math.pow(Math.sin(dlon / 2), 2);
    var angle = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
    var dis = R * angle;

    // distance between location and stop is less 500 m
    return dis <= 0.5;
}
exports.nearbyService = nearbyService;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeRoute.$inject = ['dBService'];

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

exports.aeRoute = aeRoute;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeRouteDetails.$inject = ['$location', '$route', 'dBService'];
aeRouteDetailsCtrl.$inject = ['$routeParams', 'dBService'];

function aeRouteDetails($location, $route, dBService) {

    var aeRouteDetails = {
        template: '<ae-tall-menu-bar icon="arrow_back" title-heading="{{route.routeDetails.number}}" title={{route.routeDetails.name}} search=route.search>' + '</ae-tall-menu-bar>' + '<ae-stop ng-repeat="stop in route.routeDetails.stops | filter: {number: route.search}" data-stop="stop">' + '</ae-stop>',

        scope: {},
        bindToController: true,
        controller: 'aeRouteDetailsCtrl',
        controllerAs: 'route'
    };

    return aeRouteDetails;
}

function aeRouteDetailsCtrl($routeParams, dBService) {

    var vm = this;

    // Get route details from database
    dBService.getStops({ id: $routeParams.id }).then(function (details) {
        return vm.routeDetails = details;
    });
}

exports.aeRouteDetails = aeRouteDetails;
exports.aeRouteDetailsCtrl = aeRouteDetailsCtrl;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeRouteTripsCard.$inject = ['dBService'];

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
exports.aeRouteTripsCard = aeRouteTripsCard;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeRoutes.$inject = ['dataService', 'dBService'];

function aeRoutes(dataService, dBService) {

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

exports.aeRoutes = aeRoutes;

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _routesConfig = require('./routes.config.js');

var _aeRouteDirective = require('./aeRoute.directive.js');

var _aeRoutesDirective = require('./aeRoutes.directive.js');

var _aeRouteTripsCardDirective = require('./aeRouteTripsCard.directive.js');

var _aeRouteDetailsDirective = require('./aeRouteDetails.directive.js');

angular.module('routesMod', []).config(_routesConfig.routesConfig).directive('aeRoute', _aeRouteDirective.aeRoute).directive('aeRouteTripsCard', _aeRouteTripsCardDirective.aeRouteTripsCard)

// Ctrl outside of dir for testability
.directive('aeRoutes', _aeRoutesDirective.aeRoutes)
// .controller('aeRoutesCtrl', aeRoutesCtrl)

// Ctrl outside of dir for testability
.directive('aeRouteDetails', _aeRouteDetailsDirective.aeRouteDetails).controller('aeRouteDetailsCtrl', _aeRouteDetailsDirective.aeRouteDetailsCtrl);

exports.default = angular.module('routesMod');

},{"./aeRoute.directive.js":14,"./aeRouteDetails.directive.js":15,"./aeRouteTripsCard.directive.js":16,"./aeRoutes.directive.js":17,"./routes.config.js":18}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeStop.$inject = ['dBService'];

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

exports.aeStop = aeStop;

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeStopNextTrips.$inject = ['$location', '$route', 'dBService', 'OCService'];
stopNextTripsCtrl.$inject = ['$routeParams', '$location', 'dBService', 'OCService'];

function aeStopNextTrips() {

    var aeStopNextTrips = {
        template: '<ae-tall-menu-bar title-heading="{{stopNextTrips.stop.number}}" title={{stopNextTrips.stop.name}} icon="arrow_back">' + '</ae-tall-menu-bar>' + '<ae-route-trips-card ng-repeat="route in stopNextTrips.routes" data-route="route" trips="route.Trips">' + '</ae-route-trips-card>' + '<div ng-show="stopNextTrips.routes.length === 0"> No trips scheduled for this stop</div>',

        scope: {},
        controller: stopNextTripsCtrl,
        controllerAs: 'stopNextTrips'
    };

    return aeStopNextTrips;

    // function link() {}
}

function stopNextTripsCtrl($routeParams, $location, dBService, OCService) {
    var vm = this;

    // stop number from the URL
    var code = $routeParams.code;
    var number = $location.search().number;

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

function nextTripsError() {

    var nextTripsError = {
        templateUrl: 'partials/next-trips-error.html'
    };

    return nextTripsError;
}

exports.aeStopNextTrips = aeStopNextTrips;
exports.stopNextTripsCtrl = stopNextTripsCtrl;
exports.nextTripsError = nextTripsError;

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeStops.$inject = ['dBService'];
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

exports.aeStops = aeStops;

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stopsConfig = require('./stops.config.js');

var _aeStopNextTripsDirective = require('./aeStopNextTrips.directive.js');

var _aeStopDirective = require('./aeStop.directive.js');

var _aeStopsDirective = require('./aeStops.directive.js');

angular.module('stopsMod', []).config(_stopsConfig.stopsConfig).directive('nextTripsError', _aeStopNextTripsDirective.nextTripsError).directive('aeStop', _aeStopDirective.aeStop).directive('aeStops', _aeStopsDirective.aeStops)

// Ctrl outside of dir for testability
.controller('stopNextTripsCtrl', _aeStopNextTripsDirective.stopNextTripsCtrl).directive('aeStopNextTrips', _aeStopNextTripsDirective.aeStopNextTrips);
// import {nextTrips} from './stops.directives.js';
exports.default = angular.module('stopsMod');

},{"./aeStop.directive.js":20,"./aeStopNextTrips.directive.js":21,"./aeStops.directive.js":22,"./stops.config.js":23}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utilDirectives = require('./util.directives.js');

angular.module('appUtil', []).directive('aeMenuBar', _utilDirectives.aeMenuBar).directive('aeTallMenuBar', _utilDirectives.aeTallMenuBar);

exports.default = angular.module('appUtil');

},{"./util.directives.js":25}]},{},[1]);
