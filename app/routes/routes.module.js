// import {SQLiteMod} from '../common/SQLite.module.js';
import {RoutesCtrl} from './routes.controller.js';
import {RouteCtrl} from './route-detail.controller.js';
import {RouteStopDetailCtrl} from './route-stop-detail.controller.js';
import {routesService} from './routes.service.js';
import {routesConfig} from './routes.config.js';

angular.module('routesMod', [
        'firebase',
        'ngRoute',
        'dbMod'
    ])
    .config(routesConfig)
    .controller('RoutesCtrl', RoutesCtrl)
    .controller('RouteCtrl', RouteCtrl)
    .controller('RouteStopDetailCtrl', RouteStopDetailCtrl)
    .factory('routesService', routesService);

export default angular.module('routesMod');
