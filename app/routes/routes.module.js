'use strict';

import {routesConfig} from './routes.config.js';
import {aeRoute, aeRoutes, aeRouteDetails, aeRouteTripsCard} from './routes.directives.js';

angular.module('routesMod', [])
    .config(routesConfig)
    .directive('aeRoute', aeRoute)
    .directive('aeRoutes', aeRoutes)
    .directive('aeRouteTripsCard', aeRouteTripsCard)
    .directive('aeRouteDetails', aeRouteDetails);

export default angular.module('routesMod');
