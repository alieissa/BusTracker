'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.routes
 * @description
 * # routes
 * Factory in the busTrackerApp.
 */

// import {OCCONFIG} from '../../../config/oc.js';

routes.$inject = ['$firebaseArray', '$firebaseObject', '$firebaseRef', '$http'];

export function routes($firebaseArray, $firebaseObject, $firebaseRef, $http) {
    let databaseURL = "https://octranspo-a9250.firebaseio.com";
    let firebaseApp = firebase.initializeApp({databaseURL: databaseURL}, 'routesApp');
    let routesRef = firebaseApp.database().ref('/routes')
  const Routes = {
    getAll: getAll,
    getStops: getStops,
    getNextTrips: getNextTrips
  };

  return Routes;

  function getAll() {
    return $firebaseArray(routesRef);
  }

  function getStops(routeName) {
    return $firebaseArray(routesRef.child(routeName).child('stops'));
  }

  function getNextTrips(routeNo, stopNo) {

    let OCCONFIG = window._env.OC;
    let headers = {headers: { "Content-Type": "application/x-www-form-urlencoded"}};
    let url = "https://api.octranspo1.com/v1.2/GetNextTripsForStop";
    let data = `appID=${OCCONFIG.APP_ID}&apiKey=${OCCONFIG.API_KEY}&stopNo=${stopNo}&routeNo=${routeNo}&format=json`;

    return $http.post(url, data, headers)
      .then(getNextTripsComplete);

    function getNextTripsComplete(response) {
      let tripsRes = response.data.GetNextTripsForStopResult;

      // if RouteDirection value is not an array make it one
      if (typeof tripsRes.Route.RouteDirection !== "undefined" && !Array.isArray(tripsRes.Route.RouteDirection)) {
          tripsRes.Route.RouteDirection = [tripsRes.Route.RouteDirection];
      }
      return tripsRes;
    }
  }
}
