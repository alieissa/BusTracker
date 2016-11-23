
import {RouteCtrl} from './route-detail.controller.js';
import {routesConfig} from './routes.config.js';
import {aeRoute, aeRoutes} from './routes.directives.js';

angular.module('routesMod', [])
    .config(routesConfig)
    .directive('aeRoute', aeRoute)
    .directive('aeRoutes', aeRoutes)
    .controller('RouteCtrl', RouteCtrl)

export default angular.module('routesMod');
