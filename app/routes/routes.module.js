import {RoutesCtrl} from './routes.controller.js';
import {RouteCtrl} from './route-detail.controller.js';
import {routesConfig} from './routes.config.js';
import {dBMod} from '../database/database.module.js';

angular.module('routesMod', [
        'firebase',
        'ngRoute',
        'dBMod'
    ])
    .config(routesConfig)
    .controller('RoutesCtrl', RoutesCtrl)
    .controller('RouteCtrl', RouteCtrl)

export default angular.module('routesMod');
