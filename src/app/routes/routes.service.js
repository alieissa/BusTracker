'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.routes
 * @description
 * # routes
 * Factory in the busTrackerApp.
 */

import {OCCONFIG} from '../../../config/oc.js';

routes.$inject = ['$firebaseArray', '$firebaseObject', '$firebaseRef', '$http'];

export function routes($firebaseArray, $firebaseObject, $firebaseRef, $http) {

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
    var headers = {headers: { "Content-Type": "application/x-www-form-urlencoded"}};
    var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStop";
    var data = "appID=" + OCCONFIG.APP_ID + "&apiKey=" + OCCONFIG.API_KEY + "&stopNo=" + stopNo + "&routeNo=" + routeNo + "&format=json";

    return $http.post(url, data, headers)
      .then(getNextTripsComplete);

    function getNextTripsComplete(response) {
      return response.data;
    }
  }
}
