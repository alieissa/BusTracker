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

var _database = require('../config/database.js');

var _fb = require('../config/fb.js');

angular.module('busTrackerApp', ['firebase', 'routesMod', 'stopsMod']).config(function ($routeProvider, $firebaseRefProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html'
  }).otherwise({
    redirectTo: '/'
  });

  (0, _database.firebaseInit)();

  $firebaseRefProvider.registerUrl({
    default: _fb.FIREBASECONFIG.databaseURL,
    routes: _fb.FIREBASECONFIG.databaseURL + '/routes',
    stops: _fb.FIREBASECONFIG.databaseURL + '/stops'
  });
});

},{"../config/database.js":12,"../config/fb.js":13,"./routes/routes.module.js":5,"./stops/stops.module.js":10}],2:[function(require,module,exports){
'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:RouteCtrl
 * @description
 * # RouteCtrl
 * Controller of the busTrackerApp
 */
// angular
//   .module('busTrackerApp')
//   .controller('RouteCtrl', RouteCtrl);

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

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

routesConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function routesConfig($routeProvider, $firebaseRefProvider) {
  $routeProvider.when('/routes', {
    templateUrl: 'views/routes.html',
    controller: 'RoutesCtrl',
    controllerAs: 'routes',
    resolve: {
      routesList: function routesList(routes) {
        return routes.getAll().$loaded();
      }
    }
  }).when('/routes/:routename', {
    templateUrl: 'views/route.html',
    controller: 'RouteCtrl',
    controllerAs: 'route'
  }).when('/routes/:routename/:stopNo/*', {
    templateUrl: 'views/routestops.html',
    controller: 'RoutestopsCtrl',
    controllerAs: 'routeStops',
    resolve: {
      trips: function trips(routes, $http, $location, $q, $route, $timeout) {
        // var deferred = $q.defer();

        var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStop";
        var routename = $route.current.params.routename;
        var stopNo = $route.current.params.stopNo;
        var data = "appID=c618159f&apiKey=77207661c5c94208c33fb2357efc7012&routeNo=" + routename + "&stopNo=" + stopNo + "&format=json";
        var headers = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };

        $http.post(url, data, headers).then(function (response) {
          var error = response.data.GetNextTripsForStopResult.Error;
          if (error !== "") {
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
  }).when('/routes/:routeNo/:stopNo/error', {
    templateUrl: 'views/error.html',
    controller: 'ErrorCtrl',
    controllerAs: 'error'
  });
}

exports.routesConfig = routesConfig;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routesController = require('./routes.controller.js');

var _routeDetailController = require('./route-detail.controller.js');

var _routesService = require('./routes.service.js');

var _routesConfig = require('./routes.config.js');

angular.module('routesMod', ['firebase', 'ngRoute']).config(_routesConfig.routesConfig).controller('RoutesCtrl', _routesController.RoutesCtrl).controller('RouteCtrl', _routeDetailController.RouteCtrl).service('routes', _routesService.routes);

exports.default = angular.module('routesMod');

},{"./route-detail.controller.js":2,"./routes.config.js":3,"./routes.controller.js":4,"./routes.service.js":6}],6:[function(require,module,exports){
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

var _oc = require('../../config/oc.js');

routes.$inject = ['$firebaseArray', '$firebaseObject', '$firebaseRef', '$http'];function routes($firebaseArray, $firebaseObject, $firebaseRef, $http) {

  var Routes = {
    getAll: getAll,
    getStops: getStops,
    getNextTrips: getNextTrips
  };

  return Routes;

  function getAll() {
    return $firebaseArray($firebaseRef.routes);
  }

  function getStops(routeName) {
    return $firebaseArray($firebaseRef.routes.child(routeName).child('stops'));
  }

  function getNextTrips(routeNo, stopNo) {
    var headers = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };
    var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStop";
    var data = "appID=" + OCCONFIG.APP_ID + "&apiKey=" + OCCONFIG.API_KEY + "&stopNo=" + stopNo + "&routeNo=" + routeNo + "&format=json";

    return $http.post(url, data, headers).then(getNextTripsComplete);

    function getNextTripsComplete(response) {
      return response.data;
    }
  }
}

},{"../../config/oc.js":14}],7:[function(require,module,exports){
'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopCtrl
 * @description
 * # StopCtrl
 * Controller of the busTrackerApp
 */
// angular
//   .module('busTrackerApp')
//   .controller('StopCtrl', StopCtrl);

Object.defineProperty(exports, "__esModule", {
  value: true
});
StopCtrl.$inject = ['$routeParams', 'stops'];

function StopCtrl($routeParams, stops) {
  var vm = this;

  vm.routes = [];
  vm.stopNo = $routeParams.stopNo;

  activate();

  function activate() {
    return getRouteSummary().then(function (routeData) {
      // console.log(routeData);
    });
  }

  function getRouteSummary() {
    return stops.getRouteSummary(vm.stopNo).then(function (routeSummary) {
      vm.routes = routeSummary.Routes.Route;
      return vm.routes;
    });
  }
}

exports.StopCtrl = StopCtrl;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// angular
//   .module('stopsMod')
//   .config(stopsConfig)
stopsConfig.$inject = ['$routeProvider', '$firebaseRefProvider'];

function stopsConfig($routeProvider, $firebaseRefProvider) {
  $routeProvider.when('/stops', {
    templateUrl: 'views/stops.html',
    controller: 'StopsCtrl',
    controllerAs: 'stops',
    resolve: {
      stopsList: function stopsList(stops) {
        return stops.getAll().$loaded();
      }
    }
  }).when('/stops/:stopNo', {
    templateUrl: 'views/stop.html',
    controller: 'StopCtrl',
    controllerAs: 'stop'
  });
}

exports.stopsConfig = stopsConfig;

},{}],9:[function(require,module,exports){
'use strict';

/**
 * @ngdoc function
 * @name busTrackerApp.controller:StopsCtrl
 * @description
 * # StopsCtrl
 * Controller of the busTrackerApp
 */
// angular
//   .module('busTrackerApp')
//   .controller('StopsCtrl', StopsCtrl);

Object.defineProperty(exports, "__esModule", {
  value: true
});
StopsCtrl.$inject = ['stopsList'];

function StopsCtrl(stopsList) {
  var vm = this;

  vm.stopsList = stopsList;
}

exports.StopsCtrl = StopsCtrl;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stopsController = require('./stops.controller.js');

var _stopDetailController = require('./stop-detail.controller.js');

var _stopsService = require('./stops.service.js');

var _stopsConfig = require('./stops.config.js');

angular.module('stopsMod', ['ngRoute', 'firebase']);

exports.default = angular.module('stopsMod');

},{"./stop-detail.controller.js":7,"./stops.config.js":8,"./stops.controller.js":9,"./stops.service.js":11}],11:[function(require,module,exports){
'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */
// angular
//   .module('busTrackerApp')
//   .factory('stops', stops)

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stops = undefined;

var _oc = require('../../config/oc.js');

stops.$inject = ['$firebaseArray', '$firebaseObject', '$firebaseRef', '$http', 'OCCONFIG'];

function stops($firebaseArray, $firebaseObject, $firebaseRef, $http, OCCONFIG) {
  var Stops = {
    getAll: getAll,
    getRouteSummary: getRouteSummary
  };

  return Stops;

  function getAll() {
    return $firebaseArray($firebaseRef.stops);
  }

  function getRouteSummary(stopNo) {

    // Content-Type must be x-www-form-urlencoded. Tried with JSON
    // but OC Transpo returns error (weird)
    var headers = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };
    var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";
    var data = "appID=" + OCCONFIG.APP_ID + "&apiKey=" + OCCONFIG.API_KEY + "&stopNo=" + stopNo + "&format=json";

    return $http.post(url, data, headers).then(getRouteSummaryComplete);

    function getRouteSummaryComplete(response) {
      return response.data.GetRouteSummaryForStopResult;
    }
  }
}

exports.stops = stops;

},{"../../config/oc.js":14}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firebaseInit = undefined;

var _fb = require('./fb.js');

function firebaseInit() {
  firebase.initializeApp(_fb.FIREBASECONFIG);
}

exports.firebaseInit = firebaseInit;

},{"./fb.js":13}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});
var FIREBASECONFIG = {
   apiKey: "AIzaSyAsfPArCOskSBxDgZSXawQo0QNyakC5PPc",
   authDomain: "octranspo-a9250.firebaseapp.com",
   databaseURL: "https://octranspo-a9250.firebaseio.com",
   storageBucket: "octranspo-a9250.appspot.com",
   messagingSenderId: "180165321438"
};

exports.FIREBASECONFIG = FIREBASECONFIG;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var OCCONFIG = {
    "APP_ID": "c618159f",
    "API_KEY": "77207661c5c94208c33fb2357efc7012"
};

exports.OCCONFIG = OCCONFIG;

},{}]},{},[1]);
