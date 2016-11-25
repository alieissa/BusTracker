'use strict';

import {stopsService} from './stops.service.js';
import {stopsConfig} from './stops.config.js';
import {nextTrips} from './stops.directives.js';
import {aeStop, aeStops, aeStopNextTrips, nextTripsError} from './stops.directives.js';

angular.module('stopsMod', [])
    .config(stopsConfig)
    .directive('nextTripsError', nextTripsError)
    .directive('aeStop', aeStop)
    .directive('aeStops', aeStops)
    .directive('aeStopNextTrips', aeStopNextTrips)
    .service('stopsService', stopsService);

export default angular.module('stopsMod');
