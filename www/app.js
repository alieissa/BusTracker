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

function config($routeProvider) {
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
angular.module('SQLiteMod', []).factory('dataService', dataService);

function dataService() {
	console.log('SQLite Service Test');
	var db = window.sqlitePlugin.openDatabase({ name: 'octranspo.db', location: 'database/' }, function (db) {
        
        alert("Open database successfully")
	}, function (err) {
	    alert("Error object is" + JSON.stringify(err));
	});

//	db.transaction(func1, func2);

	function func1(tx) {
		tx.executeSql('SELECT count(*) AS mycount FROM routes', [], function (tx, rs) {
			console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
		});
	}

	function func2(tx, error) {
		console.log('SELECT error: ' + error.message);
	}

	var dataService = {
		addFaveStop: addFaveStop,
		addFaveRoute: addFaveRoute,
		getFaveRoutes: getFaveRoutes,
		getFaveStops: getFaveStops,
		getAllRoutes: getAllRoutes,
		getAllStops: getAllStops
	};

	return dataService;

	function getAllRoutes() {
		// Get all routes
	}

	function getAllStops() {
		// Get all stops
	}

	function addFaveRoute(route) {
		// Add route to db
	}

	function addFaveStop(stop) {
		// Add route to db
	}

	function getFaveRoutes(routeName) {
		// Get fave route
	}

	function getFaveStops(stopNo) {
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
RouteCtrl.$inject = ['routes', '$routeParams'];

function RouteCtrl(routes, $routeParams) {
  var vm = this;

  vm.routeName = $routeParams.routename;
  vm.routeNo = vm.routeName.split(' ')[0]; //smelly
  vm.stops = routes.getStops($routeParams.routename);
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
routesConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function routesConfig($routeProvider, $firebaseRefProvider) {
  $routeProvider.when('/routes', {
    templateUrl: 'routes/views/routes.html',
    controller: 'RoutesCtrl',
    controllerAs: 'routes',
    resolve: {
      routesList: function routesList(routes) {
        return routes.getAll().$loaded();
      }
    }
  }).when('/routes/:routename', {
    templateUrl: 'routes/views/route.html',
    controller: 'RouteCtrl',
    controllerAs: 'route'
  }).when('/routes/:routename/:stopNo', {
    templateUrl: 'routes/views/routestops.html',
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
routes.$inject = ['$firebaseArray', '$firebaseObject', '$http'];

function routes($firebaseArray, $firebaseObject, $http) {

  var databaseURL = 'https://octranspo-a9250.firebaseio.com';
  var firebaseApp = firebase.initializeApp({ databaseURL: databaseURL }, 'routesApp');
  var routesRef = firebaseApp.database().ref('/routes');

  var Routes = {
    getAll: getAll,
    getStops: getStops,
    getNextTrips: getNextTrips
  };

  return Routes;

  function getAll() {
    return $firebaseArray(routesRef);
  }

  function getStops(routeName) {
    return $firebaseArray(routesRef.child(routeName).child('stops'));
  }

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
    templateUrl: 'stops/views/stops.html',
    controller: 'StopsCtrl',
    controllerAs: 'stops',
    resolve: {
      stopsList: function stopsList(stops) {
        return stops.getAll().$loaded();
      }
    }
  }).when('/stops/:stopNo', {
    templateUrl: 'stops/views/stop.html',
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
stops.$inject = ['$firebaseArray', '$firebaseObject', '$http'];

function stops($firebaseArray, $firebaseObject, $http) {

  var databaseURL = 'https://octranspo-a9250.firebaseio.com';
  var firebaseApp = firebase.initializeApp({ databaseURL: databaseURL }, 'stopsApp');
  var stopsRef = firebaseApp.database().ref('/stops');

  var Stops = {
    getAll: getAll,
    getRouteSummary: getRouteSummary
  };

  return Stops;

  function getAll() {
    return $firebaseArray(stopsRef);
  }

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
