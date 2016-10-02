'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */
angular
  .module('busTrackerApp')
  .factory('stops', function ($firebaseArray, $firebaseObject, $firebaseRef, $http, OCCONFIG) {

    var Stops = {
      getAll: getAll,
      getNextTrips: getNextTrips
    }

    return Stops;

    function getAll() {
      return $firebaseArray($firebaseRef.stops);
    }

    function getNextTrips(stopNo) {

      var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";
      var params = {
        stopNo: stopNo,
        appID: OCCONFIG.APP_ID,
        apiKey: OCCONFIG.API_KEY,
        format: "json"
      };

      return $http.post(url, params)
        .then(getNextTripsComplete);

      function getNextTripsComplete(response) {
        return response.data.GetRouteSummaryForStopResult;
      }
    }

  });
