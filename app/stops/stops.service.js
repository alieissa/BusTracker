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
      getRouteSummary: getRouteSummary
    }

    return Stops;

    function getAll() {
      return $firebaseArray($firebaseRef.stops);
    }

    function getRouteSummary(stopNo) {

      // Content-Type must be x-www-form-urlencoded. Tried with JSON
      // but OC Transpo returns error (weird)
      var headers = {headers: { "Content-Type": "application/x-www-form-urlencoded"}};
      var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";
      var data = "appID=" + OCCONFIG.APP_ID + "&apiKey=" + OCCONFIG.API_KEY + "&stopNo=" + stopNo + "&format=json";

      return $http.post(url, data, headers)
        .then(getRouteSummaryComplete);

      function getRouteSummaryComplete(response) {
        return response.data.GetRouteSummaryForStopResult;
      }
    }

  });
