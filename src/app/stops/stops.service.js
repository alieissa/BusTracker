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
    const OCCONFIG = window._env.OC;
    const headers = {headers: { "Content-Type": "application/x-www-form-urlencoded"}};
    const url = "https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes";
    const data = `appID=${OCCONFIG.APP_ID}&apiKey=${OCCONFIG.API_KEY}&stopNo=${stopNo}&format=json`;

    return $http.post(url, data, headers)
      .then(getRouteSummaryComplete);

    function getRouteSummaryComplete(response) {

        let result = response.data.GetRouteSummaryForStopResult;

        if(result.Error !== "") {
            return result;
        }

        result = {
          "Error":result.Error,
          "Routes": result.Routes.Route,
          "StopDescription": result.StopDescription,
          "StopNo": result.StopNo

        };

      result.Routes.forEach((route) => {
        if(Array.isArray(route.Trips)) {
          return;
        }
        else if(typeof route.Trips === 'undefined') {
          route.Trips = [];
        }
        else {
            route.Trips = [route.Trips];
        }
      });

    //   return OCData.sortRoutesByTrips(result.Routes);
        return result.Routes;
    }
  }

}

export {stops}
