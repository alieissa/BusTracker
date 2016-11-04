import {SQLiteMod} from '../common/SQLite.module.js';
import {RoutesCtrl} from './routes.controller.js';
import {RouteCtrl} from './route-detail.controller.js';
import {RouteStopDetailCtrl} from './route-stop-detail.controller.js';
import {routes} from './routes.service.js';
import {routesConfig} from './routes.config.js';

angular
  .module('routesMod', [
    'firebase',
    'ngRoute',
    'SQLiteMod'
  ])
  .config(routesConfig)
  .controller('RoutesCtrl', RoutesCtrl)
  .controller('RouteCtrl', RouteCtrl)
  .controller('RouteStopDetailCtrl', RouteStopDetailCtrl)
  .service('routes', routes);

export default angular.module('routesMod');
