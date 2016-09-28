'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.routes
 * @description
 * # routes
 * Factory in the busTrackerApp.
 */


angular.module('busTrackerApp')
  .factory('routes', function ($firebaseArray, $firebaseObject) {

    var Routes = {};

    var routesRef = firebase.database().ref('/routes');

    Routes.getAll = function () {
      return $firebaseArray(routesRef);
    }

    Routes.getStops = function (routeName) {
      return $firebaseArray(routesRef.child(routeName).child('stops'));
    }
    return Routes;
  });
