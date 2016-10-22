'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */

import {OCData} from '../../util/OCData.js';
// import {OCCONFIG} from '../../../config/oc.js';

stops.$inject = ['$firebaseArray', '$firebaseObject', '$firebaseRef', '$http'];

function stops ($firebaseArray, $firebaseObject, $firebaseRef, $http) {
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
    var OCCONFIG = window._env.OC;
    var headers = {headers: { "Content-Type": "application/x-www-form-urlencoded"}};
    var url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";
    var data = `appID=${OCCONFIG.APP_ID}&apiKey=${OCCONFIG.API_KEY}&stopNo=${stopNo}&format=json`;

    return $http.post(url, data, headers)
      .then(getRouteSummaryComplete);

    function getRouteSummaryComplete(response) {
      let data = response.data.GetRouteSummaryForStopResult;
      return data.Error === "" ? OCData.parseRoutes(data) : data
    }
  }

}

export {stops}
