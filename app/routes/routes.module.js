'use strict';

import {routesConfig} from './routes.config.js';

import {aeRoute} from './aeRoute.directive.js';
import {aeRoutes} from './aeRoutes.directive.js';
import {aeRouteTripsCard} from './aeRouteTripsCard.directive.js';
import {aeRouteDetails, aeRouteDetailsCtrl} from './aeRouteDetails.directive.js';

angular.module('routesMod', [])
    .config(routesConfig)
    .directive('aeRoute', aeRoute)
    .directive('aeRouteTripsCard', aeRouteTripsCard)

    // Ctrl outside of dir for testability
    .directive('aeRoutes', aeRoutes)
    // .controller('aeRoutesCtrl', aeRoutesCtrl)

    // Ctrl outside of dir for testability
    .directive('aeRouteDetails', aeRouteDetails)
    .controller('aeRouteDetailsCtrl', aeRouteDetailsCtrl);

export default angular.module('routesMod');
