'use strict';

import {Parser} from './Parser.js';

function oCService() {

    //Injections
    let $http;

    // Settings
    let appId, apiKey, data, url;
    let httpConfig  = {};

    let setHttpOptions = options => ({url, appId, apiKey, httpConfig} = options );

    let getNextTrips = stopNo => {

        let _data = `appID=${appId}&apiKey=${apiKey}&stopNo=${stopNo}&format=json`;

        let _handleRes = response => {

            let getRouteSummaryForStopResult = response.data.GetRouteSummaryForStopResult;
            let result = JSON.parse(JSON.stringify(getRouteSummaryForStopResult));
            if(result.Error !== '') {
                return result;
            }

            return {'error': result.Error, 'routes': Parser.parseRoutes(result)};
        };

        return $http.post(url, _data, httpConfig)
            .then(_handleRes, (err) => alert(`Unable to call ${url}`));
    };

    let $get = (_$http_, _config_) => {
       $http = _$http_;
       return {getNextTrips};
    };

    return {setHttpOptions, $get}
}

export {oCService};
