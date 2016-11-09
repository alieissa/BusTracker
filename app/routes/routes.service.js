'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.routes
 * @description
 * # routes
 * Factory in the busTrackerApp.
 */


routes.$inject = ['$http', 'config'];

export function routes($http, config) {
  
    
  const Routes = {
    getNextTrips: getNextTrips
  };

  return Routes;

  function getNextTrips(name, routeNo, stopNo) {

    let OCCONFIG = window._env.OC;
    
    let headers = {headers: { 'Content-Type': 'application/x-www-form-urlencoded'}};
    let url = `${config.OC_URL}/GetNextTripsForStop`;
    let data = `appID=${OCCONFIG.APP_ID}&apiKey=${OCCONFIG.API_KEY}&stopNo=${stopNo}&routeNo=${routeNo}&format=json`;

    return $http.post(url, data, headers)
      .then(getNextTripsComplete);

    function getNextTripsComplete(response) {
      
      let result = {};
      let data = response.data.GetNextTripsForStopResult;
      
      
      if(data.Error !== '') {
        return data;
      }

      if (!Array.isArray(data.Route.RouteDirection)) {
        result = data.Route.RouteDirection;
      }
      else {

        result = data.Route.RouteDirection.find((route) => {
          let _name = `${route.RouteNo} ${route.RouteLabel}`;
          if( _name === name) {
            return route;
          }

        });
      }

      result.name = `${result.RouteNo} ${result.RouteLabel}`;
      result.stopNo = stopNo;
      result.stopName = data.StopLabel;
      result.Trips = result.Trips.Trip;

      return result;
    }
  }
}
