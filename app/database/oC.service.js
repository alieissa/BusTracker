'use strict';

import {Parser} from './Parser.js';

function oCService() {

    //Injections
    let $http;

    // Settings
    let appId, apiKey, data, url;
    let httpConfig  = {}

    let setHttpOptions = (options) => {
        ({url, appId, apiKey, httpConfig} = options );
    };

    let $get = (_$http_, _config_) => {
       $http = _$http_;
       return {getNextTrips};
    };

    return {setHttpOptions, $get}
}

export {oCService};


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
        let routes_ = Parser.parseRoutes(result);
        return {'error': result.Error, 'routes': routes_};
    }
}
