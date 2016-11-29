'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */

import {Parser} from './Parser.js';

OCService.$inject = ['$http', 'config'];

function OCService ($http, config) {

    let OC = {
        getNextTrips: getNextTrips
    }

    return OC;

    /*-------------------Factory function definitions-------------------------*/

    function getNextTrips(stopNo) {

        const baseUrl = window.isphone ? 'https://api.octranspo1.com/v1.2': 'http://localhost:3000/v1.2'
        const OCCONFIG = window._env.OC;
        const headers = {headers: { 'Content-Type': 'application/x-www-form-urlencoded'}}; // Content-Type must be x-www-form-urlencoded.
        const url = `${baseUrl}/GetNextTripsForStopAllRoutes`;
        const data = `appID=${OCCONFIG.APP_ID}&apiKey=${OCCONFIG.API_KEY}&stopNo=${stopNo}&format=json`;

        return $http.post(url, data, headers).then(handleRes, handleErr);

        function handleRes(response) {

            let getRouteSummaryForStopResult = response.data.GetRouteSummaryForStopResult;

            // Deep clone result
            let result = JSON.parse(JSON.stringify(getRouteSummaryForStopResult));
            if(result.Error !== '') {
                return result;
            }

            let _routes = Parser.parseRoutes(result);
            return {'error': result.Error, 'routes': _routes};
        }
    }

    function handleErr() {
        alert('Unable to call ' + url);
    }
}

export {OCService};
