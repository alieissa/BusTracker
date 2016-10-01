'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */
angular.module('busTrackerApp')
  .factory('stops', function ($firebaseArray, $firebaseObject, $http) {

    var stopsRef = firebase.database().ref('/stops');

    var Stops = {
      getAll: getAll,
      getNextTrips: getNextTrips
    }

    return Stops;

    function getAll() {
      return $firebaseArray(stopsRef)
    }

    function getNextTrips(stopNo) {
      var params = {
        stopNo: stopNo,
        appID: config.APP_ID,
        apiKey: config.API_KEY,
        format: "json" };

      return $http.get("https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes", {"params" : params})
      
    }

  });
