'use strict';

/**
 * @ngdoc service
 * @name busTrackerApp.stops
 * @description
 * # stops
 * Factory in the busTrackerApp.
 */

import {Parser} from './Parser.js';

// OCService.$inject = [];

function OCService () {

    //Injections
    let $http;

    // settings
    let url, data, appId, apiKey;
    let httpConfig  = {}

    let setHttpOptions = (options) => {
        ({url, appId, apiKey, httpConfig} = options )
    };

    let get = (_$http_, _config_) => {
       $http = _$http_;
       return {getNextTrips};
    };

    return {setHttpOptions: setHttpOptions, $get: get}
    /*-------------------Factory function definitions-------------------------*/
    // let $get = ['$http', 'config', function($http, config) {return {getNextTrips: getNextTrips}}];

    function getNextTrips(stopNo) {

        data = `appID=${appId}&apiKey=${apiKey}&stopNo=${stopNo}&format=json`;

        return $http.post(url, data, httpConfig)
            .then(handleRes, (err) => alert(`Unable to call ${url}`));

        function handleRes(response) {

            let getRouteSummaryForStopResult = response.data.GetRouteSummaryForStopResult;
            let result = JSON.parse(JSON.stringify(getRouteSummaryForStopResult));
            if(result.Error !== '') {
                return result;
            }
            let _routes = Parser.parseRoutes(result);
            return {'error': result.Error, 'routes': _routes};
        }
    }
}

export {OCService};
