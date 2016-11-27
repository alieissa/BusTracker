'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */

// import {OCData} from '../../util/OCData.js';

stopsService.$inject = ['$http', 'config', 'dBService'];

function stopsService ($http, config, dBService) {


    let Stops = {
        getNextTrips: getNextTrips
    }

    return Stops;

    /*-------------------Factory function definitions-------------------------*/

    function getNextTrips(stopNo) {

        const baseUrl = window.isphone ? 'https://api.octranspo1.com/v1.2': 'http://localhost:3000/v1.2'
        const OCCONFIG = window._env.OC;
        const headers = {headers: { 'Content-Type': 'application/x-www-form-urlencoded'}}; // Content-Type must be x-www-form-urlencoded.
        const url = `${baseUrl}/GetNextTripsForStopAllRoutes`;
        const data = `appID=${OCCONFIG.APP_ID}&apiKey=${OCCONFIG.API_KEY}&stopNo=${stopNo}&format=json`;
        console.log(url + "?" +data)
        return $http.post(url, data, headers).then(handleRes);

        function handleRes(response) {

            let result = response.data.GetRouteSummaryForStopResult;

            if(result.Error !== '') {
                return result;
            }

            let _routes = parseRoutes(result.Routes);
            _routes.forEach((route) => {
                route.Trips = parseTrips(route.Trips);
            });

            return {'error': result.Error, 'routes': _routes};
        }
    }
}

function parseTrips(trips) {

    let _trips;
    if(typeof trips === 'undefined') {
        _trips = [];
    }
    else if(typeof trips.Trip !== 'undefined') {
        _trips = [trips.Trips];
    }
    else {
        _trips = trips;
    }

    return _trips;
}

function parseRoutes(routes) {

    let _routes;
    if(typeof routes.Route !== 'undefined') {

        // if route.Route is not an array return it as an array, else return as is
        _routes = Array.isArray(routes.Route) ? routes.Route : [routes.Route];
    }
    else {
        _routes = routes;
    }

    return _routes;
}
export {stopsService};
