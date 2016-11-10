'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.routes
 * @description
 * # routes
 * Factory in the busTrackerApp.
 */

import {Model} from '../common/Model.js';


routesService.$inject = ['$http', '$q','dbService', 'config'];

export function routesService($http, $q, dbService, config) {

    let Routes = {
        getAll: dbService.getAll('routes'), // returns function that gets all routes
        getFaves: dbService.getFaves('routes'), // returns function that get all fave routes
        getFaveStatus: dbService.getFaveStatus('routes'), // returns a function that takes route name
        setFaveStatus: dbService.setFaveStatus('routes'), // returns function that set status given name and status
        getNextTrips: getNextTrips,
        getStops: getStops
    }

    return Routes;
    
    /*-------------------Factory function definitions-------------------------*/

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

    function getStops(name) {

        let defer = $q.defer();

        let db = openDatabase('octranspo', '1.0', 'OC Transpo DB', 2 * 1024 * 1024); // 2MB

        db.transaction(handleTx, handleErr);

        function handleTx(tx) {
          tx.executeSql('SELECT * FROM routes WHERE name = ?', [name], handleRes, handleErr);
        }

        function handleRes(tx, result) {

            let data = result.rows.item(0);

            let stops = data.stops.split('\t');

            // stops number and name are both in a long space separated string
            stops = stops.map((stop) => {
                return {
                    number: stop.split(' ')[0],
                    name: stop.split(' ').slice(1).join(' ')
                }

            });

            data.stops = stops;
            data.favourite = parseInt(data.favourite);
            defer.resolve(data);
            return;
        }

        function handleErr(tx, error) {
          console.log(error);
          return defer.reject(error);
        }

        return defer.promise;
    }
}
