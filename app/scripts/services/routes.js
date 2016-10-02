'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.routes
 * @description
 * # routes
 * Factory in the busTrackerApp.
 */


angular.module('busTrackerApp')
  .factory('routes', function ($firebaseArray, $firebaseObject, $firebaseRef) {

    var routesRef = firebase.database().ref('/routes');

    var Routes = {
      getAll: getAll,
      getStops: getStops
    };

    return Routes;

    function getAll() {
      return $firebaseArray($firebaseRef.routes);
      // return $firebaseArray(routesRef);
    }

    function getStops(routeName) {
      return $firebaseArray($firebaseRef.routes.child(routeName).child('stops'));
      // return $firebaseArray(routesRef.child(routeName).child('stops'));
    }
  });
