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

    var routesRef = firebase.database().ref('/routes');

    var Routes = {
      getAll: getAll,
      getStops: getStops
    };

    return Routes;

    function getAll() {
      return $firebaseArray(routesRef);
    }

    function getStops(routeName) {
      return $firebaseArray(routesRef.child(routeName).child('stops'));
    }
    // Routes.getAll = function () {
    // }
    //
    // Routes.getStops = function (routeName) {
    //
    // }

  });
