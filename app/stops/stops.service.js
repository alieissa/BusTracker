'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */

// import {OCData} from '../../util/OCData.js';

stopsService.$inject = ['$http', 'config', 'dbService'];

function stopsService ($http, config, dbService) {

    let Stops = {
        getAll: dbService.getAll('stops'), // returns function that gets all routes
        getFaves: dbService.getFaves('stops'), // returns function that get all fave routes
        getFaveStatus: dbService.getFaveStatus('stops'), // returns a function that gets fave staus given stop no
        setFaveStatus: dbService.setFaveStatus('stops'), // returns function that set status given name and status
        getRouteSummary: getRouteSummary
    }

    return Stops;

    /*-------------------Factory function definitions-------------------------*/

    function getRouteSummary(stopNo) {

        const OCCONFIG = window._env.OC;
        const headers = {headers: { 'Content-Type': 'application/x-www-form-urlencoded'}}; // Content-Type must be x-www-form-urlencoded.
        const url = `${config.OC_URL}/GetNextTripsForStopAllRoutes`;
        const data = `appID=${OCCONFIG.APP_ID}&apiKey=${OCCONFIG.API_KEY}&stopNo=${stopNo}&format=json`;

        return $http.post(url, data, headers)
            .then(getRouteSummaryComplete);

        function getRouteSummaryComplete(response) {

            let result = response.data.GetRouteSummaryForStopResult;

            if(result.Error !== '') {
                return result;
            }

            if(Array.isArray(result.Routes) && result.Routes.length === 0) {
                result.Error = '15';
                return result;
            }
            if(typeof result.Routes.Route !== 'undefined' && !Array.isArray(result.Routes.Route) ) {
                result.Routes.Route = [result.Routes.Route];
            }

            result = {
                'Error':result.Error,
                'Routes': result.Routes.Route,
                'StopDescription': result.StopDescription,
                'StopNo': result.StopNo
            };

            let isTrips = false;
            result.Routes.forEach((route) => {

                if(typeof route.Trips === 'undefined') {
                    route.Trips = [];
                }
                else if (!Array.isArray(route.Trips)){
                    route.Trips = [route.Trips];
                }
                isTrips = route.Trips.length > 0 || isTrips;
                console.log(isTrips);
            });

            if(!isTrips) {
                result.Error = "16";
                return result;
            }

            return result;
        }
    }
}

export {stopsService};
