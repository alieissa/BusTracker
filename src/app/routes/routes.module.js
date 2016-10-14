import {RoutesCtrl} from './routes.controller.js';
import {RouteCtrl} from './route-detail.controller.js';
import {routes} from './routes.service.js';
import {routesConfig} from './routes.config.js';

angular
  .module('routesMod', [
    'firebase',
    'ngRoute'
  ])
  .config(routesConfig)
  .controller('RoutesCtrl', RoutesCtrl)
  .controller('RouteCtrl', RouteCtrl)
  .service('routes', routes);

export default angular.module('routesMod')
