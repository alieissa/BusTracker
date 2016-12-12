'use strict';

import {stopsConfig} from './stops.config.js';

import {aeStop} from './aeStop.directive.js';
import {aeStops} from './aeStops.directive.js';
import {aeStopNextTrips, stopNextTripsCtrl, nextTripsError} from './aeStopNextTrips.directive.js';

angular.module('app_stops', [])
    .config(stopsConfig)
    .directive('nextTripsError', nextTripsError)
    .directive('aeStop', aeStop)
    .directive('aeStops', aeStops)

    // Ctrl outside of dir for testability
    .controller('stopNextTripsCtrl', stopNextTripsCtrl)
    .directive('aeStopNextTrips', aeStopNextTrips);

export default angular.module('app_stops');
