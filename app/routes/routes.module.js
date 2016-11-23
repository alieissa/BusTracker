import {RoutesCtrl} from './routes.controller.js';
import {RouteCtrl} from './route-detail.controller.js';
import {routesConfig} from './routes.config.js';
import {aeRoute} from './routes.directives.js';

angular.module('routesMod', [])
    .config(routesConfig)
    .controller('RoutesCtrl', RoutesCtrl)
    .directive('aeRoute', aeRoute)
    .controller('RouteCtrl', RouteCtrl)

export default angular.module('routesMod');
