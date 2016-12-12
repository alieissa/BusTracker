'use strict';

import {routesConfig} from './routes.config.js';

import {aeRoute} from './aeRoute.directive.js';
import {aeRoutes} from './aeRoutes.directive.js';
import {aeRouteTripsCard} from './aeRouteTripsCard.directive.js';
import {aeRouteDetails, aeRouteDetailsCtrl} from './aeRouteDetails.directive.js';

angular.module('app_routes', [])
    .config(routesConfig)
    .directive('aeRoute', aeRoute)
    .directive('aeRouteTripsCard', aeRouteTripsCard)
    .directive('aeRoutes', aeRoutes)

    // Ctrl outside of dir for testability
    .directive('aeRouteDetails', aeRouteDetails)
    .controller('aeRouteDetailsCtrl', aeRouteDetailsCtrl);

export default angular.module('app_routes');
